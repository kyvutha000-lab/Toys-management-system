# PLAYBOX — Toy Store Management System

A full-stack Toy Store Management System built with **HTML, CSS, vanilla JavaScript, PHP (REST-style JSON API), and MySQL**, following the requirements in *Topic 18: Toy Store Management System*.

## Folder Structure

```
PLAYBOX/
│
├── frontend/            All pages the user sees (PHP-rendered shell + JS-driven data)
│   ├── partials/        Shared sidebar/topbar (head.php) and closing scripts (foot.php)
│   ├── index.php        Login page
│   ├── dashboard.php    Stats, charts, best sellers
│   ├── toys.php         Toy management (Add/Edit/Delete/Search)
│   ├── categories.php   Category management
│   ├── brands.php       Brand management
│   ├── suppliers.php    Supplier management + purchase history
│   ├── customers.php    Customer management + purchase history + loyalty
│   ├── purchases.php    Purchase orders (create / receive / cancel)
│   ├── inventory.php    Stock in/out/adjust, low-stock alerts, history log
│   ├── sales.php        POS: cart, coupons, checkout, returns
│   ├── promotions.php   Promotions & coupon codes
│   ├── employees.php    Employee management
│   ├── reports.php      All report types + CSV export + print
│   ├── notifications.php
│   └── settings.php     Store info, tax/currency, change password
│
├── css/
│   └── style.css        Extends your original design (sidebar/topbar) + tables, modals, forms, POS, login
│
├── js/
│   ├── main.js           Shared: auth guard, nav toggle, toasts, api() helper, notifications bell
│   ├── dashboard.js       Dashboard stats/chart rendering
│   ├── toys.js            Toy Management CRUD UI
│   └── sales.js           POS cart + checkout + returns
│
├── php/                  JSON API endpoints (called via fetch from the js/ files)
│   ├── db.php             PDO connection + session/auth helpers
│   ├── login.php          login / logout / me / change_password
│   ├── toys.php           Toy CRUD
│   ├── categories.php     Category CRUD
│   ├── brands.php         Brand CRUD
│   ├── suppliers.php      Supplier CRUD + purchase history
│   ├── customers.php      Customer CRUD + purchase history
│   ├── purchases.php      Purchase orders (create/receive/cancel)
│   ├── inventory.php      Stock adjustments + low-stock + history log
│   ├── sales.php          POS checkout, sale detail, returns
│   ├── promotions.php     Promotions/coupon CRUD + validation
│   ├── employees.php      Employee CRUD
│   ├── notifications.php  Notification feed
│   ├── dashboard.php      Dashboard statistics
│   ├── reports.php        All report types
│   └── settings.php       Store settings
│
└── database/
    ├── playbox.sql        Full schema + seed data (categories, brands, sample toys)
    └── create_admin.php   Run once in the browser to set up the admin login
```

## Setup

1. **Create the database**
   - Import `database/playbox.sql` into MySQL (via phpMyAdmin, Adminer, or the CLI):
     ```
     mysql -u root -p < database/playbox.sql
     ```

2. **Configure the DB connection**
   - Edit `php/db.php` if your MySQL username/password/host differ from the defaults (`root` / empty password / `localhost`).

3. **Create the admin login**
   - Visit `http://localhost/PLAYBOX/database/create_admin.php` once in your browser.
   - This creates/reset the admin account: **username `admin`, password `admin123`**.
   - Delete `create_admin.php` afterwards (or keep it — it's safe to re-run any time to reset the password).

4. **Serve the project**
   - Point your web server's document root at the `PLAYBOX/` folder (Apache, Nginx+PHP-FPM, or simply `php -S localhost:8000` from inside `PLAYBOX/`).
   - Open `http://localhost/frontend/index.php` (or `http://localhost:8000/frontend/index.php`) and log in.

## How it works

- Every `frontend/*.php` page renders the shared sidebar/topbar (from `partials/head.php` + `foot.php`) and then calls the JSON APIs in `php/` via `fetch()` (see `js/main.js`'s `api()` helper).
- All tables use semantic `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<td>` markup as requested.
- Sessions (`$_SESSION`) handle login state; `php/db.php`'s `require_login()` / `require_role()` guard the API endpoints.
- Selling a toy in POS automatically deducts stock, logs an inventory entry, awards loyalty points, and raises a Low Stock notification when a toy drops to/under its threshold.
- Receiving a Purchase Order automatically adds stock and logs the inventory movement.
- Reports (`php/reports.php`) support Sales, Inventory, Purchase, Customer, Supplier, Revenue, Profit & Loss, Best Selling, Low Stock, and Employee Performance — with CSV export and print from the Reports page.

## Roles

`Admin`, `Manager`, `Cashier`, `Store Staff` — enforced in each PHP API file via `require_role([...])`. Adjust as needed for your assignment.
