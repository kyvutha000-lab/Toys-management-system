// =====================================================================
// sales.js - Sales (POS) page logic: product grid, cart, checkout
// =====================================================================

let cart = []; // { toy_id, name, price, qty, stock }
let allToys = [];
let taxRate = 10;
let appliedCoupon = null;

document.addEventListener("DOMContentLoaded", async () => {
  if (!document.getElementById("posRoot")) return;

  const settingsRes = await api("settings.php");
  if (settingsRes.success) taxRate = Number(settingsRes.data.tax_rate) || 10;

  await loadCustomersForPOS();
  await loadProducts();
  renderCart();
  loadRecentSales();

  document.getElementById("posSearchInput")?.addEventListener("keyup", debounce(loadProducts, 250));
  document.getElementById("btnApplyCoupon")?.addEventListener("click", applyCoupon);
  document.getElementById("btnCheckout")?.addEventListener("click", checkout);
  document.getElementById("discountInput")?.addEventListener("input", renderCart);
});

async function loadCustomersForPOS() {
  const res = await api("customers.php");
  const sel = document.getElementById("posCustomer");
  if (!sel || !res.success) return;
  sel.innerHTML = `<option value="">Walk-in Customer</option>` +
    res.data.map((c) => `<option value="${c.id}">${escapeHtml(c.full_name)} (${c.loyalty_points} pts)</option>`).join("");
}

async function loadProducts() {
  const grid = document.getElementById("posProductGrid");
  if (!grid) return;
  const search = document.getElementById("posSearchInput")?.value || "";
  const res = await api("toys.php", { params: { search, status: "Available" } });
  if (!res.success) return;
  allToys = res.data;

  grid.innerHTML = "";
  if (allToys.length === 0) {
    grid.innerHTML = `<p class="small-muted">No products found.</p>`;
    return;
  }
  allToys.forEach((toy) => {
    const card = document.createElement("div");
    card.className = "pos-product-card";
    card.innerHTML = `
      <div class="name">${escapeHtml(toy.name)}</div>
      <div class="sku">${escapeHtml(toy.sku)}</div>
      <div class="price">$${Number(toy.selling_price).toFixed(2)}</div>
      <div class="stock">${toy.stock_qty} in stock</div>`;
    card.addEventListener("click", () => addToCart(toy));
    grid.appendChild(card);
  });
}

function addToCart(toy) {
  if (toy.stock_qty <= 0) return showToast("This toy is out of stock", "error");
  const existing = cart.find((c) => c.toy_id === toy.id);
  if (existing) {
    if (existing.qty >= toy.stock_qty) return showToast("No more stock available", "error");
    existing.qty++;
  } else {
    cart.push({ toy_id: toy.id, name: toy.name, price: Number(toy.selling_price), qty: 1, stock: toy.stock_qty });
  }
  renderCart();
}

function changeQty(toyId, delta) {
  const item = cart.find((c) => c.toy_id === toyId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((c) => c.toy_id !== toyId);
  } else if (item.qty > item.stock) {
    item.qty = item.stock;
    showToast("No more stock available", "error");
  }
  renderCart();
}

function removeFromCart(toyId) {
  cart = cart.filter((c) => c.toy_id !== toyId);
  renderCart();
}

function renderCart() {
  const cartEl = document.getElementById("posCartItems");
  if (!cartEl) return;
  cartEl.innerHTML = "";

  if (cart.length === 0) {
    cartEl.innerHTML = `<p class="small-muted">Cart is empty. Click a product to add it.</p>`;
  } else {
    cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "pos-cart-item";
      row.innerHTML = `
        <div>
          <div>${escapeHtml(item.name)}</div>
          <div class="small-muted">$${item.price.toFixed(2)} each</div>
        </div>
        <div class="qty-controls">
          <button onclick="changeQty(${item.toy_id}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.toy_id}, 1)">+</button>
          <button onclick="removeFromCart(${item.toy_id})" title="Remove">&times;</button>
        </div>`;
      cartEl.appendChild(row);
    });
  }

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const manualDiscount = parseFloat(document.getElementById("discountInput")?.value || 0) || 0;
  let couponDiscount = 0;
  if (appliedCoupon) {
    couponDiscount = appliedCoupon.type === "Percentage" ? subtotal * (appliedCoupon.value / 100) : Number(appliedCoupon.value);
  }
  const totalDiscount = manualDiscount + couponDiscount;
  const taxable = Math.max(subtotal - totalDiscount, 0);
  const tax = taxable * (taxRate / 100);
  const total = taxable + tax;

  setText("posSubtotal", "$" + subtotal.toFixed(2));
  setText("posDiscount", "-$" + totalDiscount.toFixed(2));
  setText("posTax", "$" + tax.toFixed(2) + ` (${taxRate}%)`);
  setText("posTotal", "$" + total.toFixed(2));
}

async function applyCoupon() {
  const code = document.getElementById("couponInput")?.value.trim();
  if (!code) return;
  const res = await api("promotions.php", { params: { code } });
  if (res.success) {
    appliedCoupon = res.data;
    showToast(`Coupon applied: ${res.data.name}`, "success");
  } else {
    appliedCoupon = null;
    showToast(res.message || "Invalid coupon", "error");
  }
  renderCart();
}

async function checkout() {
  if (cart.length === 0) return showToast("Cart is empty", "error");

  const payload = {
    items: cart.map((c) => ({ toy_id: c.toy_id, qty: c.qty })),
    customer_id: document.getElementById("posCustomer")?.value || null,
    payment_method: document.getElementById("posPaymentMethod")?.value || "Cash",
    discount: parseFloat(document.getElementById("discountInput")?.value || 0) || 0,
    coupon_code: appliedCoupon ? appliedCoupon.coupon_code : null,
    tax_rate: taxRate,
  };

  const res = await api("sales.php", { method: "POST", body: payload });
  if (res.success) {
    showToast(`Sale completed: ${res.invoice_no}`, "success");
    cart = [];
    appliedCoupon = null;
    document.getElementById("couponInput").value = "";
    document.getElementById("discountInput").value = "";
    renderCart();
    loadProducts();
    loadRecentSales();
  } else {
    showToast(res.message || "Checkout failed", "error");
  }
}

async function loadRecentSales() {
  const tbody = document.getElementById("recentSalesBody");
  if (!tbody) return;
  const res = await api("sales.php");
  if (!res.success) return;
  const rows = res.data.slice(0, 15);
  tbody.innerHTML = rows.length === 0
    ? `<tr class="empty-row"><td colspan="6">No sales yet</td></tr>`
    : rows.map((s) => `<tr>
        <td>${escapeHtml(s.invoice_no)}</td>
        <td>${escapeHtml(s.customer_name || "Walk-in")}</td>
        <td>${escapeHtml(s.payment_method)}</td>
        <td class="text-right">$${Number(s.total).toFixed(2)}</td>
        <td><span class="badge ${s.status === "Completed" ? "badge-success" : "badge-danger"}">${s.status}</span></td>
        <td class="actions">${s.status === "Completed" ? `<button class="btn btn-sm btn-danger" onclick="returnSale(${s.id})">Return</button>` : "-"}</td>
      </tr>`).join("");
}

async function returnSale(id) {
  if (!confirm("Return this sale and restock the items?")) return;
  const res = await api("sales.php?action=return", { method: "POST", body: { id } });
  if (res.success) {
    showToast(res.message, "success");
    loadRecentSales();
    loadProducts();
  } else {
    showToast(res.message || "Return failed", "error");
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
