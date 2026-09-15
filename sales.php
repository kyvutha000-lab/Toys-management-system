<?php
/**
 * php/sales.php - Sales / POS API
 * GET  ?id=1        -> single sale with items
 * GET               -> list sales
 * POST              -> create a new sale (checkout)
 * POST ?action=return -> mark a sale as returned and restock items
 */
require_once __DIR__ . '/db.php';
require_login();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

if ($method === 'GET') {
    if (!empty($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT s.*, c.full_name AS customer_name, e.full_name AS employee_name
                                FROM sales s
                                LEFT JOIN customers c ON s.customer_id = c.id
                                LEFT JOIN employees e ON s.employee_id = e.id
                                WHERE s.id = ?");
        $stmt->execute([$_GET['id']]);
        $sale = $stmt->fetch();
        if (!$sale) json_error('Sale not found', 404);

        $items = $pdo->prepare("SELECT si.*, t.name AS toy_name, t.sku
                                 FROM sale_items si JOIN toys t ON si.toy_id = t.id
                                 WHERE si.sale_id = ?");
        $items->execute([$_GET['id']]);
        $sale['items'] = $items->fetchAll();

        json_response(['success' => true, 'data' => $sale]);
    }

    $sql = "SELECT s.*, c.full_name AS customer_name
            FROM sales s LEFT JOIN customers c ON s.customer_id = c.id";
    $params = [];
    if (!empty($_GET['search'])) {
        $sql .= " WHERE s.invoice_no LIKE ? OR c.full_name LIKE ?";
        $like = '%' . $_GET['search'] . '%';
        array_push($params, $like, $like);
    }
    $sql .= " ORDER BY s.created_at DESC LIMIT 500";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    json_response(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST' && $action === 'return') {
    require_role(['Admin','Manager','Cashier']);
    $input = get_input();
    $id = $input['id'] ?? null;
    if (!$id) json_error('id is required');

    $pdo->beginTransaction();
    try {
        $items = $pdo->prepare("SELECT * FROM sale_items WHERE sale_id = ?");
        $items->execute([$id]);
        foreach ($items->fetchAll() as $it) {
            $pdo->prepare("UPDATE toys SET stock_qty = stock_qty + ? WHERE id = ?")
                ->execute([$it['qty'], $it['toy_id']]);
            $pdo->prepare("INSERT INTO inventory_log (toy_id, type, qty, reason) VALUES (?, 'Stock In', ?, 'Sale return')")
                ->execute([$it['toy_id'], $it['qty']]);
        }
        $pdo->prepare("UPDATE sales SET status = 'Returned' WHERE id = ?")->execute([$id]);
        $pdo->commit();
        json_response(['success' => true, 'message' => 'Sale returned and stock restored']);
    } catch (Exception $e) {
        $pdo->rollBack();
        json_error('Return failed: ' . $e->getMessage(), 500);
    }
}

if ($method === 'POST' && !$action) {
    require_role(['Admin','Manager','Cashier']);
    $input = get_input();
    $cart = $input['items'] ?? [];
    if (empty($cart)) json_error('Cart is empty');

    $customerId = $input['customer_id'] ?: null;
    $employeeId = $input['employee_id'] ?: null;
    $paymentMethod = $input['payment_method'] ?? 'Cash';
    $couponCode = $input['coupon_code'] ?? null;
    $discountInput = (float)($input['discount'] ?? 0);
    $taxRate = (float)($input['tax_rate'] ?? 10);

    $pdo->beginTransaction();
    try {
        $subtotal = 0;
        $lineItems = [];

        foreach ($cart as $ci) {
            $stmt = $pdo->prepare("SELECT * FROM toys WHERE id = ? FOR UPDATE");
            $stmt->execute([$ci['toy_id']]);
            $toy = $stmt->fetch();
            if (!$toy) throw new Exception("Toy not found (id {$ci['toy_id']})");
            if ($toy['stock_qty'] < $ci['qty']) throw new Exception("Not enough stock for {$toy['name']}");

            $lineTotal = $toy['selling_price'] * $ci['qty'];
            $subtotal += $lineTotal;
            $lineItems[] = ['toy_id' => $toy['id'], 'qty' => $ci['qty'], 'price' => $toy['selling_price'], 'subtotal' => $lineTotal];
        }

        // Apply coupon if provided and valid
        $discount = $discountInput;
        if ($couponCode) {
            $promo = $pdo->prepare("SELECT * FROM promotions WHERE coupon_code = ? AND status = 'Active'
                                     AND (start_date IS NULL OR start_date <= CURDATE())
                                     AND (end_date IS NULL OR end_date >= CURDATE())");
            $promo->execute([$couponCode]);
            $p = $promo->fetch();
            if ($p) {
                if ($p['type'] === 'Percentage') {
                    $discount += $subtotal * ($p['value'] / 100);
                } elseif ($p['type'] === 'Fixed Amount') {
                    $discount += $p['value'];
                }
            }
        }

        $taxable = max($subtotal - $discount, 0);
        $tax = $taxable * ($taxRate / 100);
        $total = $taxable + $tax;

        $invoiceNo = 'INV-' . date('Ymd') . '-' . str_pad((string)rand(1, 9999), 4, '0', STR_PAD_LEFT);

        $pdo->prepare("INSERT INTO sales (invoice_no, customer_id, employee_id, subtotal, discount, tax, total, payment_method, coupon_code)
                       VALUES (?,?,?,?,?,?,?,?,?)")
            ->execute([$invoiceNo, $customerId, $employeeId, $subtotal, $discount, $tax, $total, $paymentMethod, $couponCode]);

        $saleId = $pdo->lastInsertId();

        foreach ($lineItems as $li) {
            $pdo->prepare("INSERT INTO sale_items (sale_id, toy_id, qty, unit_price, subtotal) VALUES (?,?,?,?,?)")
                ->execute([$saleId, $li['toy_id'], $li['qty'], $li['price'], $li['subtotal']]);

            $pdo->prepare("UPDATE toys SET stock_qty = stock_qty - ? WHERE id = ?")
                ->execute([$li['qty'], $li['toy_id']]);

            $pdo->prepare("INSERT INTO inventory_log (toy_id, type, qty, reason) VALUES (?, 'Stock Out', ?, 'Sale')")
                ->execute([$li['toy_id'], $li['qty']]);

            // Update status to Out of Stock if needed & trigger low stock notification
            $t = $pdo->prepare("SELECT stock_qty, low_stock_threshold, name FROM toys WHERE id = ?");
            $t->execute([$li['toy_id']]);
            $trow = $t->fetch();
            if ($trow['stock_qty'] <= 0) {
                $pdo->prepare("UPDATE toys SET status = 'Out of Stock' WHERE id = ?")->execute([$li['toy_id']]);
            }
            if ($trow['stock_qty'] <= $trow['low_stock_threshold']) {
                $pdo->prepare("INSERT INTO notifications (type, message) VALUES ('Low Stock', ?)")
                    ->execute(["Low stock: {$trow['name']} ({$trow['stock_qty']} left)"]);
            }
        }

        // Loyalty points: 1 point per $10 spent
        if ($customerId) {
            $points = floor($total / 10);
            $pdo->prepare("UPDATE customers SET loyalty_points = loyalty_points + ? WHERE id = ?")
                ->execute([$points, $customerId]);
        }

        $pdo->commit();

        json_response([
            'success' => true,
            'message' => 'Sale completed',
            'invoice_no' => $invoiceNo,
            'sale_id' => $saleId,
            'subtotal' => $subtotal,
            'discount' => $discount,
            'tax' => $tax,
            'total' => $total,
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        json_error('Checkout failed: ' . $e->getMessage(), 500);
    }
}

json_error('Unsupported request', 405);
