/* ============================================================
   Playbox — Toy Store Management System (frontend demo)
   Vanilla JS, single-file data layer persisted to localStorage.
   ============================================================ */

const STORAGE_KEY = 'playbox_db_v1';
const SESSION_KEY = 'playbox_session_v1';

const CATEGORY_COLORS = ['#E8482C', '#06A77D', '#FFB627', '#6C5CE7', '#2E86FF', '#E85DAA', '#3AAFA9', '#F4845F', '#8E7DBE', '#2F9C95'];

/* ---------------- Seed data ---------------- */
function seedData() {
  return {
    users: [
      { username: 'admin', name: 'Alex Admin', role: 'Admin', password: 'admin123' },
      { username: 'manager', name: 'Mia Manager', role: 'Manager', password: 'manager123' },
      { username: 'cashier', name: 'Cody Cashier', role: 'Cashier', password: 'cashier123' },
      { username: 'staff', name: 'Sam Staff', role: 'Store Staff', password: 'staff123' },
    ],
    categories: [
      { id: 'c1', name: 'Educational Toys', color: CATEGORY_COLORS[0] },
      { id: 'c2', name: 'Building Blocks', color: CATEGORY_COLORS[1] },
      { id: 'c3', name: 'Dolls', color: CATEGORY_COLORS[2] },
      { id: 'c4', name: 'Action Figures', color: CATEGORY_COLORS[3] },
      { id: 'c5', name: 'Remote Control Toys', color: CATEGORY_COLORS[4] },
      { id: 'c6', name: 'Board Games', color: CATEGORY_COLORS[5] },
      { id: 'c7', name: 'Puzzles', color: CATEGORY_COLORS[6] },
      { id: 'c8', name: 'Outdoor Toys', color: CATEGORY_COLORS[7] },
      { id: 'c9', name: 'Musical Toys', color: CATEGORY_COLORS[8] },
      { id: 'c10', name: 'Baby Toys', color: CATEGORY_COLORS[9] },
    ],
    brands: [
      { id: 'b1', name: 'LEGO' }, { id: 'b2', name: 'Mattel' }, { id: 'b3', name: 'Hasbro' },
      { id: 'b4', name: 'Fisher-Price' }, { id: 'b5', name: 'Hot Wheels' }, { id: 'b6', name: 'Barbie' },
      { id: 'b7', name: 'Nerf' }, { id: 'b8', name: 'Playmobil' },
    ],
    suppliers: [
      { id: 's1', name: 'BrickWorld Distribution', contact: 'Dara Sok', phone: '012 345 678', email: 'dara@brickworld.com', address: 'St. 271, Phnom Penh' },
      { id: 's2', name: 'Global Toy Traders', contact: 'Lina Chan', phone: '098 765 432', email: 'lina@gtt.com', address: 'St. 63, Phnom Penh' },
    ],
    toys: [
      mkToy('LEGO Classic Bricks Set', 'b1', 'c2', '4-8', 'ABS Plastic', 'Multicolor', 18, 29.99, 42, 'Available', '12mo'),
      mkToy('Barbie Dreamhouse', 'b6', 'c3', '3-9', 'Plastic', 'Pink', 35, 59.99, 15, 'Available', '6mo'),
      mkToy('Hot Wheels Track Set', 'b5', 'c5', '5-10', 'Plastic/Metal', ' Orange', 12, 19.99, 60, 'Available', ''),
      mkToy('Nerf Elite Blaster', 'b7', 'c4', '8+', 'Plastic/Foam', ' Blue/Orange', 14, 24.99, 8, 'Available', '3mo'),
      mkToy('Fisher-Price Stack Rings', 'b4', 'c10', '0-2', 'Plastic', 'Multicolor', 6, 12.99, 3, 'Available', ''),
      mkToy('Playmobil Farm Set', 'b8', 'c2', '4-9', 'Plastic', 'Multicolor', 22, 34.99, 0, 'Out of Stock', ''),
      mkToy('Hasbro Monopoly', 'b3', 'c6', '8+', 'Cardboard/Plastic', 'Multicolor', 10, 18.99, 25, 'Available', ''),
      mkToy('1000pc Wildlife Puzzle', 'b3', 'c7', '10+', 'Cardboard', 'Multicolor', 5, 11.99, 30, 'Available', ''),
      mkToy('Mini Xylophone', 'b4', 'c9', '1-4', 'Wood/Metal', 'Rainbow', 7, 14.99, 0, 'Discontinued', ''),
      mkToy('Action Figure: Space Ranger', 'b3', 'c4', '5-12', 'Plastic', 'Silver/Blue', 9, 16.99, 4, 'Available', '1mo'),
    ],
    customers: [
      { id: 'cu1', name: 'Sophea Kim', phone: '012 111 222', email: 'sophea@mail.com', address: 'BKK1, Phnom Penh', level: 'Gold', points: 340 },
      { id: 'cu2', name: 'Vibol Sok', phone: '016 222 333', email: 'vibol@mail.com', address: 'Toul Kork, Phnom Penh', level: 'Silver', points: 120 },
      { id: 'cu3', name: 'Chan Dara', phone: '017 333 444', email: 'chandara@mail.com', address: 'Chamkar Mon, Phnom Penh', level: 'Bronze', points: 35 },
    ],
    purchases: [],
    inventoryLog: [],
    sales: [],
    promotions: [
      { id: 'p1', name: 'New Year 10% Off', type: 'Percentage Discount', value: 10, code: 'NEWYEAR10', active: true },
      { id: 'p2', name: 'Buy 1 Get 1 — Puzzles', type: 'BOGO', value: 0, code: 'PUZZLEBOGO', active: true },
      { id: 'p3', name: 'Member Flat $5', type: 'Member Discount', value: 5, code: 'MEMBER5', active: false },
    ],
    employees: [
      { id: 'e1', name: 'Mia Manager', role: 'Manager', phone: '011 001 001', email: 'mia@playbox.com', salary: 900, schedule: 'Mon–Fri 8am–5pm' },
      { id: 'e2', name: 'Cody Cashier', role: 'Cashier', phone: '011 002 002', email: 'cody@playbox.com', salary: 450, schedule: 'Tue–Sat 9am–6pm' },
      { id: 'e3', name: 'Sam Staff', role: 'Storekeeper', phone: '011 003 003', email: 'sam@playbox.com', salary: 400, schedule: 'Mon–Sat 8am–4pm' },
    ],
    settings: { storeName: 'Playbox Toy Store', address: 'St. 271, Phnom Penh, Cambodia', phone: '023 555 123', taxRate: 10, currency: '$', open: '09:00', close: '20:00' },
    seq: 1000,
  };
}
function mkToy(name, brand, category, age, material, color, cost, price, stock, status, warranty) {
  const id = 't' + Math.random().toString(36).slice(2, 9);
  return {
    id, sku: 'SKU-' + id.slice(1, 6).toUpperCase(), barcode: '8801' + Math.floor(Math.random() * 1e8),
    name, brand, category, ageGroup: age, material, color, purchasePrice: cost, sellingPrice: price,
    stock, warranty, status, image: ''
  };
}

let DB = loadDB();
function loadDB() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) { try { return JSON.parse(raw); } catch (e) { /* fallthrough */ } }
  const fresh = seedData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}
function saveDB() { localStorage.setItem(STORAGE_KEY, JSON.stringify(DB)); }
function nextId(prefix) { DB.seq++; saveDB(); return prefix + DB.seq; }

/* ---------------- Session / auth ---------------- */
let SESSION = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');

function currency(n) { return (DB.settings.currency || '$') + Number(n || 0).toFixed(2); }
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 2200);
}
function catById(id) { return DB.categories.find(c => c.id === id); }
function brandById(id) { return DB.brands.find(b => b.id === id); }
function supplierById(id) { return DB.suppliers.find(s => s.id === id); }
function customerById(id) { return DB.customers.find(c => c.id === id); }
function toyById(id) { return DB.toys.find(t => t.id === id); }

/* ---------------- Navigation config ---------------- */
const NAV = [
  {
    group: 'Overview', items: [
      { id: 'dashboard', label: 'Dashboard', ico: 'home-outline', roles: ['Admin', 'Manager', 'Cashier', 'Store Staff'] },
    ]
  },
  {
    group: 'Catalog', items: [
      { id: 'toys', label: 'Toys', ico: 'albums-outline', roles: ['Admin', 'Manager', 'Cashier', 'Store Staff'] },
      { id: 'categories', label: 'Categories', ico: 'grid-outline', roles: ['Admin', 'Manager', 'Store Staff'] },
      { id: 'brands', label: 'Brands', ico: 'business-outline', roles: ['Admin', 'Manager', 'Store Staff'] },
    ]
  },
  {
    group: 'Operations', items: [
      { id: 'suppliers', label: 'Suppliers', ico: 'car-outline', roles: ['Admin', 'Manager', 'Store Staff'] },
      { id: 'purchases', label: 'Purchases', ico: 'cart-outline', roles: ['Admin', 'Manager', 'Store Staff'] },
      { id: 'inventory', label: 'Inventory', ico: 'archive-outline', roles: ['Admin', 'Manager', 'Store Staff'] },
      { id: 'sales', label: 'Sales (POS)', ico: 'receipt-outline', roles: ['Admin', 'Manager', 'Cashier'] },
    ]
  },
  {
    group: 'People', items: [
      { id: 'customers', label: 'Customers', ico: 'person-outline', roles: ['Admin', 'Manager', 'Cashier', 'Store Staff'] },
      { id: 'employees', label: 'Employees', ico: 'id-card-outline', roles: ['Admin', 'Manager'] },
    ]
  },
  {
    group: 'Growth', items: [
      { id: 'promotions', label: 'Promotions', ico: 'pricetag-outline', roles: ['Admin', 'Manager'] },
      { id: 'reports', label: 'Reports', ico: 'bar-chart-outline', roles: ['Admin', 'Manager'] },
    ]
  },
  {
    group: 'System', items: [
      { id: 'settings', label: 'Settings', ico: 'settings-outline', roles: ['Admin'] },
    ]
  },
];

let currentView = 'dashboard';

/* ---------------- Boot ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginForm').addEventListener('submit', onLogin);
  wireShell();
  if (SESSION) { enterApp(); } else { showLogin(); }
});

function showLogin() {
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('appShell').classList.add('hidden');
}
function onLogin(e) {
  e.preventDefault();
  const role = document.getElementById('loginRole').value;
  const username = document.getElementById('loginUser').value.trim() || 'admin';
  let user = DB.users.find(u => u.username === username && u.role === role);
  if (!user) { user = { username, name: username.charAt(0).toUpperCase() + username.slice(1), role }; }
  SESSION = { username: user.username, name: user.name, role: user.role };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(SESSION));
  enterApp();
}
function enterApp() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('appShell').classList.remove('hidden');
  document.getElementById('userNameLabel').textContent = SESSION.name;
  document.getElementById('userRoleLabel').textContent = SESSION.role;
  document.getElementById('userAvatar').textContent = SESSION.name.charAt(0).toUpperCase();
  buildSidebar();
  navigate('dashboard');
}

function buildSidebar() {
  const nav = document.getElementById('sidebarNav');
  nav.innerHTML = '';
  NAV.forEach(group => {
    const visible = group.items.filter(it => it.roles.includes(SESSION.role));
    if (!visible.length) return;
    const label = document.createElement('div');
    label.className = 'nav-group-label'; label.textContent = group.group;
    nav.appendChild(label);
    visible.forEach(it => {
      const btn = document.createElement('button');
      btn.className = 'nav-item' + (it.id === currentView ? ' active' : '');
      btn.dataset.view = it.id;
      btn.innerHTML = `<ion-icon name="${it.ico}" class="nav-ico"></ion-icon><span>${it.label}</span>`;
      btn.addEventListener('click', () => navigate(it.id));
      nav.appendChild(btn);
    });
  });
}

function navigate(viewId) {
  currentView = viewId;
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const target = document.getElementById('view-' + viewId);
  if (target) target.classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === viewId));
  const navEntry = NAV.flatMap(g => g.items).find(i => i.id === viewId);
  document.getElementById('topbarTitle').textContent = navEntry ? navEntry.label : (viewId === 'profile' ? 'My profile' : 'Playbox');
  renderView(viewId);
  document.getElementById('userMenu').classList.add('hidden');
  document.getElementById('notifPanel').classList.add('hidden');
}

function renderView(viewId) {
  switch (viewId) {
    case 'dashboard': renderDashboard(); break;
    case 'toys': renderToys(); break;
    case 'categories': renderCategories(); break;
    case 'brands': renderBrands(); break;
    case 'suppliers': renderSuppliers(); break;
    case 'customers': renderCustomers(); break;
    case 'purchases': renderPurchases(); break;
    case 'inventory': renderInventory(); break;
    case 'sales': renderPOS(); break;
    case 'promotions': renderPromotions(); break;
    case 'employees': renderEmployees(); break;
    case 'reports': renderReport(); break;
    case 'settings': renderSettings(); break;
    case 'profile': renderProfile(); break;
  }
}

/* ---------------- Shell wiring (topbar, modal, notifications) ---------------- */
function wireShell() {
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
  });
  document.getElementById('notifBtn').addEventListener('click', () => {
    document.getElementById('notifPanel').classList.toggle('hidden');
    document.getElementById('userMenu').classList.add('hidden');
  });
  document.getElementById('userChip').addEventListener('click', () => {
    document.getElementById('userMenu').classList.toggle('hidden');
    document.getElementById('notifPanel').classList.add('hidden');
  });
  document.getElementById('userMenu').addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (!action) return;
    if (action === 'logout') { sessionStorage.removeItem(SESSION_KEY); SESSION = null; location.reload(); }
    if (action === 'profile') { navigate('profile'); }
    if (action === 'password') { openChangePassword(); }
  });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', (e) => { if (e.target.id === 'modalBackdrop') closeModal(); });
  document.getElementById('globalSearch').addEventListener('input', (e) => {
    // quick global search: jump to toys view when typing product-like queries
    if (e.target.value.length > 1 && currentView !== 'toys') { /* leave passive, non-intrusive */ }
  });
  refreshNotifications();
  setInterval(refreshNotifications, 4000);
}

function refreshNotifications() {
  const items = [];
  DB.toys.filter(t => t.stock > 0 && t.stock <= 5).forEach(t => items.push({ ico: '⚠️', text: `Low stock: ${t.name} (${t.stock} left)` }));
  DB.toys.filter(t => t.stock === 0 && t.status !== 'Discontinued').forEach(t => items.push({ ico: '⛔', text: `Out of stock: ${t.name}` }));
  DB.promotions.filter(p => p.active).forEach(p => items.push({ ico: '🏷', text: `Promotion active: ${p.name} (${p.code})` }));
  const panel = document.getElementById('notifPanel');
  panel.innerHTML = items.length ? items.map(i => `<div class="notif-item"><span class="ni-ico">${i.ico}</span><span>${escapeHtml(i.text)}</span></div>`).join('')
    : '<div class="notif-empty">You\'re all caught up.</div>';
  document.getElementById('notifDot').style.display = items.length ? 'block' : 'none';
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

/* ---------------- Modal helpers ---------------- */
function openModal(title, bodyHtml, onMount) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  document.getElementById('modalBackdrop').classList.remove('hidden');
  if (onMount) onMount(document.getElementById('modalBody'));
}
function closeModal() { document.getElementById('modalBackdrop').classList.add('hidden'); }

function openChangePassword() {
  openModal('Change password', `
    <form id="pwForm">
      <label>Current password <input type="password" required></label>
      <label>New password <input type="password" required></label>
      <label>Confirm new password <input type="password" required></label>
      <div class="form-actions"><button type="submit" class="btn btn-primary">Update password</button></div>
    </form>`, (body) => {
    body.querySelector('#pwForm').addEventListener('submit', (e) => { e.preventDefault(); closeModal(); toast('Password updated.'); });
  });
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function renderDashboard() {
  const totalProducts = DB.toys.length;
  const availableStock = DB.toys.reduce((s, t) => s + Number(t.stock || 0), 0);
  const lowStock = DB.toys.filter(t => t.stock > 0 && t.stock <= 5).length;
  const outOfStock = DB.toys.filter(t => t.stock === 0).length;
  const totalCustomers = DB.customers.length;
  const today = new Date().toISOString().slice(0, 10);
  const todaysSales = DB.sales.filter(s => s.date.slice(0, 10) === today).reduce((s, x) => s + x.total, 0);
  const monthKey = new Date().toISOString().slice(0, 7);
  const monthlyRevenue = DB.sales.filter(s => s.date.slice(0, 7) === monthKey).reduce((s, x) => s + x.total, 0);

  const stats = [
    { label: 'Total products', value: totalProducts, cls: '' },
    { label: 'Available stock', value: availableStock, cls: '' },
    { label: 'Low stock alerts', value: lowStock, cls: 'warn' },
    { label: 'Out of stock', value: outOfStock, cls: 'alert' },
    { label: 'Total customers', value: totalCustomers, cls: 'info' },
    { label: "Today's sales", value: currency(todaysSales), cls: '' },
    { label: 'Monthly revenue', value: currency(monthlyRevenue), cls: 'info' },
  ];
  document.getElementById('statGrid').innerHTML = stats.map(s => `
    <div class="stat-card ${s.cls}">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${s.value}</div>
    </div>`).join('');

  // Sales bar chart, last 7 days
  const days = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const dayTotals = days.map(d => DB.sales.filter(s => s.date.slice(0, 10) === d).reduce((s, x) => s + x.total, 0));
  const max = Math.max(...dayTotals, 1);
  document.getElementById('salesChart').innerHTML = days.map((d, i) => `
    <div class="bar-col">
      <div class="bar" style="height:${Math.max(6, (dayTotals[i] / max) * 130)}px" title="${currency(dayTotals[i])}"></div>
      <div class="bar-label">${d.slice(5)}</div>
    </div>`).join('');

  // Inventory donut
  const avail = DB.toys.filter(t => t.status === 'Available' && t.stock > 5).length;
  const low = DB.toys.filter(t => t.stock > 0 && t.stock <= 5).length;
  const out = DB.toys.filter(t => t.stock === 0).length;
  const total = Math.max(avail + low + out, 1);
  const seg = [avail / total * 360, low / total * 360, out / total * 360];
  const c1 = seg[0], c2 = c1 + seg[1];
  document.getElementById('inventoryDonut').innerHTML = `
    <div class="donut" style="background:conic-gradient(var(--teal) 0deg ${c1}deg, var(--yellow) ${c1}deg ${c2}deg, var(--red) ${c2}deg 360deg);"></div>
    <div class="donut-legend">
      <div><span class="legend-dot" style="background:var(--teal)"></span>Healthy stock — ${avail}</div>
      <div><span class="legend-dot" style="background:var(--yellow)"></span>Low stock — ${low}</div>
      <div><span class="legend-dot" style="background:var(--red)"></span>Out of stock — ${out}</div>
    </div>`;

  // Best sellers
  const soldMap = {};
  DB.sales.forEach(s => s.items.forEach(it => { soldMap[it.toyId] = (soldMap[it.toyId] || 0) + it.qty; }));
  const best = Object.entries(soldMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  document.getElementById('bestSellers').innerHTML = best.length ? best.map(([id, qty], i) => {
    const t = toyById(id); if (!t) return '';
    return `<div class="bs-row"><span class="bs-rank">${i + 1}</span><span class="bs-name">${escapeHtml(t.name)}</span><span class="bs-count">${qty} sold</span></div>`;
  }).join('') : '<p class="muted">No sales recorded yet — completed sales will show here.</p>';
}

/* ============================================================
   TOYS
   ============================================================ */
function renderToys() {
  const catSel = document.getElementById('toyFilterCategory');
  if (catSel.children.length <= 1) {
    DB.categories.forEach(c => catSel.insertAdjacentHTML('beforeend', `<option value="${c.id}">${escapeHtml(c.name)}</option>`));
  }
  const search = document.getElementById('toySearch');
  const statusSel = document.getElementById('toyFilterStatus');
  [search, catSel, statusSel].forEach(el => el.oninput = drawToyTable);
  document.getElementById('addToyBtn').onclick = () => openToyForm();
  drawToyTable();
}
function drawToyTable() {
  const q = (document.getElementById('toySearch').value || '').toLowerCase();
  const catFilter = document.getElementById('toyFilterCategory').value;
  const statusFilter = document.getElementById('toyFilterStatus').value;
  let rows = DB.toys.filter(t => {
    const matchesQ = !q || t.name.toLowerCase().includes(q) || t.sku.toLowerCase().includes(q) || t.barcode.includes(q);
    const matchesCat = !catFilter || t.category === catFilter;
    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesQ && matchesCat && matchesStatus;
  });
  const table = document.getElementById('toyTable');
  table.querySelector('thead').innerHTML = `<tr><th></th><th>Toy</th><th>SKU</th><th>Category</th><th>Brand</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr>`;
  table.querySelector('tbody').innerHTML = rows.map(t => {
    const cat = catById(t.category);
    const badgeCls = t.status === 'Available' ? 'badge-available' : t.status === 'Out of Stock' ? 'badge-out' : 'badge-discontinued';
    return `<tr>
      <td>${t.image ? `<img src="${t.image}" style="width:34px;height:34px;object-fit:cover;border-radius:8px;">` : `<div style="width:34px;height:34px;border-radius:8px;background:${cat ? cat.color : '#ddd'}22;display:flex;align-items:center;justify-content:center;">🧸</div>`}</td>
      <td><strong>${escapeHtml(t.name)}</strong><div class="mono">${escapeHtml(t.barcode)}</div></td>
      <td class="mono">${escapeHtml(t.sku)}</td>
      <td>${cat ? `<span class="tag" style="background:${cat.color}1a;color:${cat.color}"><span class="tag-dot" style="background:${cat.color}"></span>${escapeHtml(cat.name)}</span>` : '—'}</td>
      <td>${escapeHtml((brandById(t.brand) || {}).name || '—')}</td>
      <td class="mono">${currency(t.sellingPrice)}</td>
      <td>${t.stock}</td>
      <td><span class="badge ${badgeCls}">${t.status}</span></td>
      <td><div class="row-actions">
        <button class="btn-view" title="View" onclick="viewToy('${t.id}')">View</button>
        <button class="btn-edit" title="Edit" onclick="openToyForm('${t.id}')">Edit</button>
        <button class="btn-delete" title="Delete" onclick="deleteToy('${t.id}')">Delete</button>
      </div></td>
    </tr>`;
  }).join('') || `<tr><td colspan="9" class="muted" style="text-align:center;padding:30px;">No toys match your search.</td></tr>`;
}
function openToyForm(id) {
  const t = id ? toyById(id) : null;
  const catOpts = DB.categories.map(c => `<option value="${c.id}" ${t && t.category === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('');
  const brandOpts = DB.brands.map(b => `<option value="${b.id}" ${t && t.brand === b.id ? 'selected' : ''}>${escapeHtml(b.name)}</option>`).join('');
  openModal(t ? 'Edit toy' : 'Add toy', `
    <form id="toyForm">
      <div class="modal-grid">
        <label>Toy name <input name="name" required value="${t ? escapeHtml(t.name) : ''}"></label>
        <label>Barcode <input name="barcode" value="${t ? escapeHtml(t.barcode) : ''}"></label>
        <label>Category <select name="category">${catOpts}</select></label>
        <label>Brand <select name="brand">${brandOpts}</select></label>
        <label>Age group <input name="ageGroup" placeholder="e.g. 5-10" value="${t ? escapeHtml(t.ageGroup) : ''}"></label>
        <label>Material <input name="material" value="${t ? escapeHtml(t.material) : ''}"></label>
        <label>Color <input name="color" value="${t ? escapeHtml(t.color) : ''}"></label>
        <label>Warranty (optional) <input name="warranty" value="${t ? escapeHtml(t.warranty) : ''}"></label>
        <label>Purchase price <input type="number" step="0.01" name="purchasePrice" required value="${t ? t.purchasePrice : ''}"></label>
        <label>Selling price <input type="number" step="0.01" name="sellingPrice" required value="${t ? t.sellingPrice : ''}"></label>
        <label>Stock quantity <input type="number" name="stock" required value="${t ? t.stock : 0}"></label>
        <label>Status <select name="status">
          <option ${t && t.status === 'Available' ? 'selected' : ''}>Available</option>
          <option ${t && t.status === 'Out of Stock' ? 'selected' : ''}>Out of Stock</option>
          <option ${t && t.status === 'Discontinued' ? 'selected' : ''}>Discontinued</option>
        </select></label>
      </div>
      <label>Toy image <input type="file" name="image" accept="image/*"></label>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">${t ? 'Save changes' : 'Add toy'}</button>
      </div>
    </form>`, (body) => {
    body.querySelector('#toyForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const finish = (imageData) => {
        const rec = {
          name: fd.get('name'), barcode: fd.get('barcode') || ('8801' + Math.floor(Math.random() * 1e8)),
          category: fd.get('category'), brand: fd.get('brand'), ageGroup: fd.get('ageGroup'),
          material: fd.get('material'), color: fd.get('color'), warranty: fd.get('warranty'),
          purchasePrice: parseFloat(fd.get('purchasePrice')) || 0, sellingPrice: parseFloat(fd.get('sellingPrice')) || 0,
          stock: parseInt(fd.get('stock')) || 0, status: fd.get('status'), image: imageData
        };
        if (rec.stock === 0 && rec.status === 'Available') rec.status = 'Out of Stock';
        if (t) { Object.assign(t, rec); if (!imageData) t.image = t.image || ''; toast('Toy updated.'); }
        else { rec.id = 't' + nextId(''); rec.sku = 'SKU-' + rec.id.slice(-6).toUpperCase(); DB.toys.push(rec); toast('Toy added.'); }
        saveDB(); closeModal(); drawToyTable(); refreshNotifications();
      };
      const file = fd.get('image');
      if (file && file.size > 0) {
        const reader = new FileReader();
        reader.onload = () => finish(reader.result);
        reader.readAsDataURL(file);
      } else finish(t ? t.image : '');
    });
  });
}
function viewToy(id) {
  const t = toyById(id); if (!t) return;
  const cat = catById(t.category), br = brandById(t.brand);
  openModal(t.name, `
    ${t.image ? `<img src="${t.image}" style="width:100%;max-height:200px;object-fit:cover;border-radius:10px;margin-bottom:12px;">` : ''}
    <div class="modal-grid">
      <p><strong>SKU:</strong> ${escapeHtml(t.sku)}</p>
      <p><strong>Barcode:</strong> ${escapeHtml(t.barcode)}</p>
      <p><strong>Category:</strong> ${cat ? escapeHtml(cat.name) : '—'}</p>
      <p><strong>Brand:</strong> ${br ? escapeHtml(br.name) : '—'}</p>
      <p><strong>Age group:</strong> ${escapeHtml(t.ageGroup || '—')}</p>
      <p><strong>Material:</strong> ${escapeHtml(t.material || '—')}</p>
      <p><strong>Color:</strong> ${escapeHtml(t.color || '—')}</p>
      <p><strong>Warranty:</strong> ${escapeHtml(t.warranty || '—')}</p>
      <p><strong>Purchase price:</strong> ${currency(t.purchasePrice)}</p>
      <p><strong>Selling price:</strong> ${currency(t.sellingPrice)}</p>
      <p><strong>Stock:</strong> ${t.stock}</p>
      <p><strong>Status:</strong> ${t.status}</p>
    </div>`);
}
function deleteToy(id) {
  if (!confirm('Delete this toy? This cannot be undone.')) return;
  DB.toys = DB.toys.filter(t => t.id !== id); saveDB(); drawToyTable(); toast('Toy deleted.'); refreshNotifications();
}

/* ============================================================
   CATEGORIES & BRANDS (shared pattern)
   ============================================================ */
function renderCategories() {
  document.getElementById('categorySearch').oninput = drawCategoryGrid;
  document.getElementById('addCategoryBtn').onclick = () => openCategoryForm();
  drawCategoryGrid();
}
function drawCategoryGrid() {
  const q = (document.getElementById('categorySearch').value || '').toLowerCase();
  const list = DB.categories.filter(c => c.name.toLowerCase().includes(q));
  document.getElementById('categoryGrid').innerHTML = list.map(c => {
    const count = DB.toys.filter(t => t.category === c.id).length;
    return `<div class="aisle-card" style="--tag-color:${c.color}">
      <h4>${escapeHtml(c.name)}</h4>
      <p>${count} toy${count === 1 ? '' : 's'} in this aisle</p>
      <div class="row-actions">
        <button class="btn-edit" onclick="openCategoryForm('${c.id}')">Edit</button>
        <button class="btn-delete" onclick="deleteCategory('${c.id}')">Delete</button>
      </div>
    </div>`;
  }).join('') || `<p class="muted">No categories found.</p>`;
}
function openCategoryForm(id) {
  const c = id ? catById(id) : null;
  openModal(c ? 'Edit category' : 'Add category', `
    <form id="catForm">
      <label>Category name <input name="name" required value="${c ? escapeHtml(c.name) : ''}"></label>
      <label>Tag color <input type="color" name="color" value="${c ? c.color : CATEGORY_COLORS[DB.categories.length % CATEGORY_COLORS.length]}"></label>
      <div class="form-actions"><button class="btn btn-primary" type="submit">${c ? 'Save changes' : 'Add category'}</button></div>
    </form>`, (body) => {
    body.querySelector('#catForm').addEventListener('submit', (e) => {
      e.preventDefault(); const fd = new FormData(e.target);
      if (c) { c.name = fd.get('name'); c.color = fd.get('color'); toast('Category updated.'); }
      else { DB.categories.push({ id: 'c' + nextId(''), name: fd.get('name'), color: fd.get('color') }); toast('Category added.'); }
      saveDB(); closeModal(); drawCategoryGrid();
    });
  });
}
function deleteCategory(id) {
  if (!confirm('Delete this category?')) return;
  DB.categories = DB.categories.filter(c => c.id !== id); saveDB(); drawCategoryGrid();
}

function renderBrands() {
  document.getElementById('brandSearch').oninput = drawBrandGrid;
  document.getElementById('addBrandBtn').onclick = () => openBrandForm();
  drawBrandGrid();
}
function drawBrandGrid() {
  const q = (document.getElementById('brandSearch').value || '').toLowerCase();
  const list = DB.brands.filter(b => b.name.toLowerCase().includes(q));
  document.getElementById('brandGrid').innerHTML = list.map(b => {
    const count = DB.toys.filter(t => t.brand === b.id).length;
    return `<div class="aisle-card" style="--tag-color:var(--violet)">
      <h4>${escapeHtml(b.name)}</h4>
      <p>${count} toy${count === 1 ? '' : 's'} carried</p>
      <div class="row-actions">
        <button class="btn-edit" onclick="openBrandForm('${b.id}')">Edit</button>
        <button class="btn-delete" onclick="deleteBrand('${b.id}')">Delete</button>
      </div>
    </div>`;
  }).join('') || `<p class="muted">No brands found.</p>`;
}
function openBrandForm(id) {
  const b = id ? brandById(id) : null;
  openModal(b ? 'Edit brand' : 'Add brand', `
    <form id="brandForm">
      <label>Brand name <input name="name" required value="${b ? escapeHtml(b.name) : ''}"></label>
      <div class="form-actions"><button class="btn btn-primary" type="submit">${b ? 'Save changes' : 'Add brand'}</button></div>
    </form>`, (body) => {
    body.querySelector('#brandForm').addEventListener('submit', (e) => {
      e.preventDefault(); const fd = new FormData(e.target);
      if (b) { b.name = fd.get('name'); toast('Brand updated.'); }
      else { DB.brands.push({ id: 'b' + nextId(''), name: fd.get('name') }); toast('Brand added.'); }
      saveDB(); closeModal(); drawBrandGrid();
    });
  });
}
function deleteBrand(id) {
  if (!confirm('Delete this brand?')) return;
  DB.brands = DB.brands.filter(b => b.id !== id); saveDB(); drawBrandGrid();
}

/* ============================================================
   SUPPLIERS
   ============================================================ */
function renderSuppliers() {
  document.getElementById('supplierSearch').oninput = drawSupplierTable;
  document.getElementById('addSupplierBtn').onclick = () => openSupplierForm();
  drawSupplierTable();
}
function drawSupplierTable() {
  const q = (document.getElementById('supplierSearch').value || '').toLowerCase();
  const list = DB.suppliers.filter(s => s.name.toLowerCase().includes(q));
  const table = document.getElementById('supplierTable');
  table.querySelector('thead').innerHTML = `<tr><th>Supplier</th><th>Contact</th><th>Phone</th><th>Email</th><th>Address</th><th>Purchases</th><th></th></tr>`;
  table.querySelector('tbody').innerHTML = list.map(s => {
    const count = DB.purchases.filter(p => p.supplierId === s.id).length;
    return `<tr>
      <td><strong>${escapeHtml(s.name)}</strong></td>
      <td>${escapeHtml(s.contact || '—')}</td>
      <td class="mono">${escapeHtml(s.phone || '—')}</td>
      <td>${escapeHtml(s.email || '—')}</td>
      <td>${escapeHtml(s.address || '—')}</td>
      <td>${count} order${count === 1 ? '' : 's'}</td>
      <td><div class="row-actions">
        <button class="btn-edit" onclick="openSupplierForm('${s.id}')">Edit</button>
        <button class="btn-delete" onclick="deleteSupplier('${s.id}')">Delete</button>
      </div></td>
    </tr>`;
  }).join('') || `<tr><td colspan="7" class="muted" style="text-align:center;padding:30px;">No suppliers found.</td></tr>`;
}
function openSupplierForm(id) {
  const s = id ? supplierById(id) : null;
  openModal(s ? 'Edit supplier' : 'Add supplier', `
    <form id="supForm">
      <label>Supplier name <input name="name" required value="${s ? escapeHtml(s.name) : ''}"></label>
      <label>Contact person <input name="contact" value="${s ? escapeHtml(s.contact || '') : ''}"></label>
      <label>Phone number <input name="phone" value="${s ? escapeHtml(s.phone || '') : ''}"></label>
      <label>Email <input type="email" name="email" value="${s ? escapeHtml(s.email || '') : ''}"></label>
      <label>Address <input name="address" value="${s ? escapeHtml(s.address || '') : ''}"></label>
      <div class="form-actions"><button class="btn btn-primary" type="submit">${s ? 'Save changes' : 'Add supplier'}</button></div>
    </form>`, (body) => {
    body.querySelector('#supForm').addEventListener('submit', (e) => {
      e.preventDefault(); const fd = new FormData(e.target);
      const rec = { name: fd.get('name'), contact: fd.get('contact'), phone: fd.get('phone'), email: fd.get('email'), address: fd.get('address') };
      if (s) { Object.assign(s, rec); toast('Supplier updated.'); }
      else { rec.id = 's' + nextId(''); DB.suppliers.push(rec); toast('Supplier added.'); }
      saveDB(); closeModal(); drawSupplierTable();
    });
  });
}
function deleteSupplier(id) {
  if (!confirm('Delete this supplier?')) return;
  DB.suppliers = DB.suppliers.filter(s => s.id !== id); saveDB(); drawSupplierTable();
}

/* ============================================================
   CUSTOMERS
   ============================================================ */
function renderCustomers() {
  document.getElementById('customerSearch').oninput = drawCustomerTable;
  document.getElementById('addCustomerBtn').onclick = () => openCustomerForm();
  drawCustomerTable();
}
function drawCustomerTable() {
  const q = (document.getElementById('customerSearch').value || '').toLowerCase();
  const list = DB.customers.filter(c => c.name.toLowerCase().includes(q) || (c.phone || '').includes(q));
  const table = document.getElementById('customerTable');
  table.querySelector('thead').innerHTML = `<tr><th>Customer</th><th>Phone</th><th>Email</th><th>Membership</th><th>Loyalty points</th><th>Purchases</th><th></th></tr>`;
  table.querySelector('tbody').innerHTML = list.map(c => {
    const count = DB.sales.filter(s => s.customerId === c.id).length;
    return `<tr>
      <td><strong>${escapeHtml(c.name)}</strong></td>
      <td class="mono">${escapeHtml(c.phone || '—')}</td>
      <td>${escapeHtml(c.email || '—')}</td>
      <td><span class="tag" style="background:var(--yellow)22;color:#8A5A00">${escapeHtml(c.level || '—')}</span></td>
      <td>${c.points || 0} pts</td>
      <td>${count} order${count === 1 ? '' : 's'}</td>
      <td><div class="row-actions">
        <button title="History" onclick="viewCustomerHistory('${c.id}')">🧾</button>
        <button class="btn-edit" onclick="openCustomerForm('${c.id}')">Edit</button>
        <button class="btn-delete" onclick="deleteCustomer('${c.id}')">Delete</button>
      </div></td>
    </tr>`;
  }).join('') || `<tr><td colspan="7" class="muted" style="text-align:center;padding:30px;">No customers found.</td></tr>`;
}
function openCustomerForm(id) {
  const c = id ? customerById(id) : null;
  openModal(c ? 'Edit customer' : 'Register customer', `
    <form id="custForm">
      <label>Full name <input name="name" required value="${c ? escapeHtml(c.name) : ''}"></label>
      <label>Phone number <input name="phone" value="${c ? escapeHtml(c.phone || '') : ''}"></label>
      <label>Email <input type="email" name="email" value="${c ? escapeHtml(c.email || '') : ''}"></label>
      <label>Address <input name="address" value="${c ? escapeHtml(c.address || '') : ''}"></label>
      <label>Membership level <select name="level">
        <option ${c && c.level === 'Bronze' ? 'selected' : ''}>Bronze</option>
        <option ${c && c.level === 'Silver' ? 'selected' : ''}>Silver</option>
        <option ${c && c.level === 'Gold' ? 'selected' : ''}>Gold</option>
      </select></label>
      <label>Loyalty points <input type="number" name="points" value="${c ? c.points : 0}"></label>
      <div class="form-actions"><button class="btn btn-primary" type="submit">${c ? 'Save changes' : 'Register customer'}</button></div>
    </form>`, (body) => {
    body.querySelector('#custForm').addEventListener('submit', (e) => {
      e.preventDefault(); const fd = new FormData(e.target);
      const rec = { name: fd.get('name'), phone: fd.get('phone'), email: fd.get('email'), address: fd.get('address'), level: fd.get('level'), points: parseInt(fd.get('points')) || 0 };
      if (c) { Object.assign(c, rec); toast('Customer updated.'); }
      else { rec.id = 'cu' + nextId(''); DB.customers.push(rec); toast('Customer registered.'); }
      saveDB(); closeModal(); drawCustomerTable();
    });
  });
}
function deleteCustomer(id) {
  if (!confirm('Delete this customer?')) return;
  DB.customers = DB.customers.filter(c => c.id !== id); saveDB(); drawCustomerTable();
}
function viewCustomerHistory(id) {
  const c = customerById(id); if (!c) return;
  const sales = DB.sales.filter(s => s.customerId === id);
  openModal('Purchase history — ' + c.name, sales.length ? `
    <table style="width:100%"><thead><tr><th>Date</th><th>Items</th><th>Total</th></tr></thead><tbody>
    ${sales.map(s => `<tr><td>${s.date.slice(0, 10)}</td><td>${s.items.length}</td><td>${currency(s.total)}</td></tr>`).join('')}
    </tbody></table>` : `<p class="muted">No purchases recorded yet.</p>`);
}

/* ============================================================
   PURCHASES (Purchase Orders)
   ============================================================ */
function renderPurchases() {
  document.getElementById('addPurchaseBtn').onclick = () => openPurchaseForm();
  drawPurchaseTable();
}
function drawPurchaseTable() {
  const table = document.getElementById('purchaseTable');
  table.querySelector('thead').innerHTML = `<tr><th>PO ID</th><th>Supplier</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr>`;
  table.querySelector('tbody').innerHTML = DB.purchases.slice().reverse().map(p => {
    const sup = supplierById(p.supplierId);
    return `<tr>
      <td class="mono">${escapeHtml(p.id)}</td>
      <td>${sup ? escapeHtml(sup.name) : '—'}</td>
      <td>${p.date.slice(0, 10)}</td>
      <td>${p.items.length}</td>
      <td class="mono">${currency(p.total)}</td>
      <td><span class="badge ${p.status === 'Received' ? 'badge-available' : p.status === 'Cancelled' ? 'badge-discontinued' : 'badge-out'}">${p.status}</span></td>
      <td><div class="row-actions">
        ${p.status === 'Pending' ? `<button title="Receive" onclick="receivePurchase('${p.id}')">📥</button><button title="Cancel" onclick="cancelPurchase('${p.id}')">✕</button>` : ''}
      </div></td>
    </tr>`;
  }).join('') || `<tr><td colspan="7" class="muted" style="text-align:center;padding:30px;">No purchase orders yet.</td></tr>`;
}
function openPurchaseForm() {
  const supOpts = DB.suppliers.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
  const toyOpts = DB.toys.map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join('');
  openModal('Create purchase order', `
    <form id="poForm">
      <label>Supplier <select name="supplier">${supOpts}</select></label>
      <label>Toy <select name="toy">${toyOpts}</select></label>
      <div class="modal-grid">
        <label>Quantity <input type="number" name="qty" value="10" min="1" required></label>
        <label>Unit cost <input type="number" name="cost" step="0.01" required></label>
      </div>
      <div class="form-actions"><button class="btn btn-primary" type="submit">Create order</button></div>
    </form>
    <p class="muted">This demo supports one line item per order — create another order to add more.</p>`, (body) => {
    body.querySelector('#poForm').addEventListener('submit', (e) => {
      e.preventDefault(); const fd = new FormData(e.target);
      const qty = parseInt(fd.get('qty')) || 0, cost = parseFloat(fd.get('cost')) || 0;
      const po = {
        id: 'PO' + nextId(''), supplierId: fd.get('supplier'), date: new Date().toISOString(),
        items: [{ toyId: fd.get('toy'), qty, cost }], total: qty * cost, status: 'Pending'
      };
      DB.purchases.push(po); saveDB(); closeModal(); drawPurchaseTable(); toast('Purchase order created.');
    });
  });
}
function receivePurchase(id) {
  const p = DB.purchases.find(x => x.id === id); if (!p) return;
  p.status = 'Received';
  p.items.forEach(it => {
    const t = toyById(it.toyId);
    if (t) {
      t.stock += it.qty; if (t.status === 'Out of Stock') t.status = 'Available';
      DB.inventoryLog.push({ id: 'log' + nextId(''), toyId: t.id, type: 'in', qty: it.qty, date: new Date().toISOString(), note: 'Received PO ' + p.id });
    }
  });
  saveDB(); drawPurchaseTable(); toast('Purchase received — stock updated.'); refreshNotifications();
}
function cancelPurchase(id) {
  const p = DB.purchases.find(x => x.id === id); if (!p) return;
  p.status = 'Cancelled'; saveDB(); drawPurchaseTable(); toast('Purchase order cancelled.');
}

/* ============================================================
   INVENTORY
   ============================================================ */
function renderInventory() {
  const low = DB.toys.filter(t => t.stock > 0 && t.stock <= 5);
  const out = DB.toys.filter(t => t.stock === 0);
  document.getElementById('lowStockBanner').innerHTML = (low.length || out.length) ?
    `⚠️ ${low.length} toy(s) low on stock, ${out.length} out of stock. Check Inventory actions below.` : '';
  document.getElementById('stockInBtn').onclick = () => openStockForm('in');
  document.getElementById('stockOutBtn').onclick = () => openStockForm('out');
  document.getElementById('stockAdjustBtn').onclick = () => openStockForm('adjust');
  drawInventoryTable();
}
function drawInventoryTable() {
  const table = document.getElementById('inventoryTable');
  table.querySelector('thead').innerHTML = `<tr><th>Date</th><th>Toy</th><th>Type</th><th>Qty</th><th>Note</th></tr>`;
  table.querySelector('tbody').innerHTML = DB.inventoryLog.slice().reverse().map(l => {
    const t = toyById(l.toyId);
    const typeLabel = l.type === 'in' ? 'Stock in' : l.type === 'out' ? 'Stock out' : 'Adjustment';
    return `<tr><td>${l.date.slice(0, 16).replace('T', ' ')}</td><td>${t ? escapeHtml(t.name) : '(deleted)'}</td><td>${typeLabel}</td><td>${l.qty}</td><td>${escapeHtml(l.note || '')}</td></tr>`;
  }).join('') || `<tr><td colspan="5" class="muted" style="text-align:center;padding:30px;">No inventory movements logged yet.</td></tr>`;
}
function openStockForm(type) {
  const toyOpts = DB.toys.map(t => `<option value="${t.id}">${escapeHtml(t.name)} (stock: ${t.stock})</option>`).join('');
  const title = type === 'in' ? 'Stock in' : type === 'out' ? 'Stock out' : 'Stock adjustment';
  openModal(title, `
    <form id="stockForm">
      <label>Toy <select name="toy">${toyOpts}</select></label>
      <label>${type === 'adjust' ? 'New stock quantity' : 'Quantity'} <input type="number" name="qty" min="0" required></label>
      <label>Note <input name="note" placeholder="Reason / reference"></label>
      <div class="form-actions"><button class="btn btn-primary" type="submit">Confirm</button></div>
    </form>`, (body) => {
    body.querySelector('#stockForm').addEventListener('submit', (e) => {
      e.preventDefault(); const fd = new FormData(e.target);
      const t = toyById(fd.get('toy')); const qty = parseInt(fd.get('qty')) || 0;
      if (t) {
        if (type === 'in') t.stock += qty;
        else if (type === 'out') t.stock = Math.max(0, t.stock - qty);
        else t.stock = qty;
        if (t.stock === 0 && t.status === 'Available') t.status = 'Out of Stock';
        if (t.stock > 0 && t.status === 'Out of Stock') t.status = 'Available';
        DB.inventoryLog.push({ id: 'log' + nextId(''), toyId: t.id, type, qty, date: new Date().toISOString(), note: fd.get('note') });
      }
      saveDB(); closeModal(); drawInventoryTable(); renderInventory(); toast('Inventory updated.'); refreshNotifications();
    });
  });
}

/* ============================================================
   SALES / POS
   ============================================================ */
let cart = [];
function renderPOS() {
  const custSel = document.getElementById('posCustomer');
  custSel.innerHTML = '<option value="">Walk-in customer</option>' + DB.customers.map(c => `<option value="${c.id}">${escapeHtml(c.name)} (${c.points} pts)</option>`).join('');
  document.getElementById('posTaxRate').textContent = DB.settings.taxRate;
  document.getElementById('posSearch').oninput = drawPOSToyGrid;
  ['posDiscount', 'posCoupon', 'posPoints', 'posCustomer'].forEach(id => document.getElementById(id).oninput = updateCartTotals);
  document.getElementById('completeSaleBtn').onclick = completeSale;
  document.getElementById('clearCartBtn').onclick = () => { cart = []; drawCart(); };
  drawPOSToyGrid();
  drawCart();
}
function drawPOSToyGrid() {
  const q = (document.getElementById('posSearch').value || '').toLowerCase();
  const list = DB.toys.filter(t => t.stock > 0 && (!q || t.name.toLowerCase().includes(q) || t.sku.toLowerCase().includes(q)));
  document.getElementById('posToyGrid').innerHTML = list.map(t => `
    <button class="pos-toy-card" onclick="addToCart('${t.id}')">
      <div class="pt-name">${escapeHtml(t.name)}</div>
      <div class="pt-price">${currency(t.sellingPrice)}</div>
      <div class="pt-stock">${t.stock} in stock</div>
    </button>`).join('') || `<p class="muted">No toys match — try a different search.</p>`;
}
function addToCart(toyId) {
  const t = toyById(toyId); if (!t || t.stock <= 0) return;
  const existing = cart.find(c => c.toyId === toyId);
  if (existing) { if (existing.qty < t.stock) existing.qty++; else toast('No more stock available.'); }
  else cart.push({ toyId, qty: 1 });
  drawCart();
}
function drawCart() {
  document.getElementById('cartItems').innerHTML = cart.map(ci => {
    const t = toyById(ci.toyId); if (!t) return '';
    return `<div class="cart-row">
      <span class="ci-name">${escapeHtml(t.name)}</span>
      <input type="number" min="1" max="${t.stock}" value="${ci.qty}" onchange="updateCartQty('${ci.toyId}', this.value)">
      <span class="mono">${currency(t.sellingPrice * ci.qty)}</span>
      <button onclick="removeFromCart('${ci.toyId}')" style="border:none;background:none;color:var(--red);">✕</button>
    </div>`;
  }).join('') || `<p class="muted" style="font-size:13px;">Cart is empty — tap a toy to add it.</p>`;
  updateCartTotals();
}
function updateCartQty(toyId, val) {
  const ci = cart.find(c => c.toyId === toyId); const t = toyById(toyId);
  if (ci && t) ci.qty = Math.max(1, Math.min(parseInt(val) || 1, t.stock));
  drawCart();
}
function removeFromCart(toyId) { cart = cart.filter(c => c.toyId !== toyId); drawCart(); }
function computeCartTotals() {
  const subtotal = cart.reduce((s, ci) => { const t = toyById(ci.toyId); return s + (t ? t.sellingPrice * ci.qty : 0); }, 0);
  const discountPct = parseFloat(document.getElementById('posDiscount').value) || 0;
  const couponCode = (document.getElementById('posCoupon').value || '').trim().toUpperCase();
  const coupon = DB.promotions.find(p => p.active && p.code.toUpperCase() === couponCode);
  let afterDiscount = subtotal * (1 - discountPct / 100);
  if (coupon) {
    if (coupon.type === 'Percentage Discount') afterDiscount *= (1 - coupon.value / 100);
    else if (coupon.type === 'Fixed Amount Discount') afterDiscount = Math.max(0, afterDiscount - coupon.value);
    else if (coupon.type === 'Member Discount') afterDiscount = Math.max(0, afterDiscount - coupon.value);
  }
  const pointsUsed = Math.max(0, parseInt(document.getElementById('posPoints').value) || 0);
  const pointsValue = pointsUsed * 0.01; // 1 point = $0.01
  afterDiscount = Math.max(0, afterDiscount - pointsValue);
  const tax = afterDiscount * (DB.settings.taxRate / 100);
  const total = afterDiscount + tax;
  return { subtotal, tax, total, coupon, pointsUsed };
}
function updateCartTotals() {
  const { subtotal, tax, total } = computeCartTotals();
  document.getElementById('posSubtotal').textContent = currency(subtotal);
  document.getElementById('posTax').textContent = currency(tax);
  document.getElementById('posTotal').textContent = currency(total);
}
function completeSale() {
  if (!cart.length) { toast('Cart is empty.'); return; }
  const { subtotal, tax, total, pointsUsed } = computeCartTotals();
  const customerId = document.getElementById('posCustomer').value;
  const payment = document.getElementById('posPayment').value;
  const sale = {
    id: 'SALE' + nextId(''), date: new Date().toISOString(), customerId: customerId || null,
    items: cart.map(ci => ({ toyId: ci.toyId, qty: ci.qty, price: toyById(ci.toyId).sellingPrice })),
    discount: parseFloat(document.getElementById('posDiscount').value) || 0,
    coupon: document.getElementById('posCoupon').value || '', tax, total, payment, cashier: SESSION.name
  };
  cart.forEach(ci => {
    const t = toyById(ci.toyId); if (t) {
      t.stock = Math.max(0, t.stock - ci.qty); if (t.stock === 0) t.status = 'Out of Stock';
      DB.inventoryLog.push({ id: 'log' + nextId(''), toyId: t.id, type: 'out', qty: ci.qty, date: new Date().toISOString(), note: 'Sale ' + sale.id });
    }
  });
  if (customerId) {
    const c = customerById(customerId);
    if (c) { c.points = Math.max(0, c.points - pointsUsed) + Math.floor(total); }
  }
  DB.sales.push(sale); saveDB();
  showReceipt(sale);
  cart = []; drawCart(); drawPOSToyGrid(); refreshNotifications();
}
function showReceipt(sale) {
  const cust = sale.customerId ? customerById(sale.customerId) : null;
  openModal('Sale complete — ' + sale.id, `
    <div id="receiptArea">
      <p><strong>${escapeHtml(DB.settings.storeName)}</strong><br><span class="muted">${escapeHtml(DB.settings.address || '')}</span></p>
      <p class="mono">${sale.id} &middot; ${sale.date.slice(0, 16).replace('T', ' ')}</p>
      <p>Customer: ${cust ? escapeHtml(cust.name) : 'Walk-in'} &middot; Cashier: ${escapeHtml(sale.cashier)}</p>
      <table style="width:100%;margin:10px 0;"><thead><tr><th>Toy</th><th>Qty</th><th>Price</th></tr></thead><tbody>
      ${sale.items.map(it => { const t = toyById(it.toyId); return `<tr><td>${t ? escapeHtml(t.name) : '—'}</td><td>${it.qty}</td><td>${currency(it.price * it.qty)}</td></tr>`; }).join('')}
      </tbody></table>
      <div class="pos-row"><span>Tax</span><span>${currency(sale.tax)}</span></div>
      <div class="pos-row pos-total"><span>Total</span><span>${currency(sale.total)}</span></div>
      <p>Payment method: ${sale.payment}</p>
    </div>
    <div class="form-actions"><button class="btn btn-secondary" onclick="window.print()">🖶 Print receipt</button></div>`);
}

/* ============================================================
   PROMOTIONS
   ============================================================ */
function renderPromotions() {
  document.getElementById('addPromotionBtn').onclick = () => openPromotionForm();
  drawPromotionTable();
}
function drawPromotionTable() {
  const table = document.getElementById('promotionTable');
  table.querySelector('thead').innerHTML = `<tr><th>Name</th><th>Type</th><th>Value</th><th>Code</th><th>Status</th><th></th></tr>`;
  table.querySelector('tbody').innerHTML = DB.promotions.map(p => `
    <tr>
      <td><strong>${escapeHtml(p.name)}</strong></td>
      <td>${escapeHtml(p.type)}</td>
      <td>${p.type.includes('Percentage') ? p.value + '%' : p.type === 'BOGO' ? '—' : currency(p.value)}</td>
      <td class="mono">${escapeHtml(p.code)}</td>
      <td><span class="badge ${p.active ? 'badge-available' : 'badge-discontinued'}">${p.active ? 'Active' : 'Inactive'}</span></td>
      <td><div class="row-actions">
        <button onclick="togglePromotion('${p.id}')">${p.active ? '⏸' : '▶'}</button>
        <button class="btn-edit" onclick="openPromotionForm('${p.id}')">Edit</button>
        <button class="btn-delete" onclick="deletePromotion('${p.id}')">Delete</button>
      </div></td>
    </tr>`).join('') || `<tr><td colspan="6" class="muted" style="text-align:center;padding:30px;">No promotions yet.</td></tr>`;
}
function openPromotionForm(id) {
  const p = id ? DB.promotions.find(x => x.id === id) : null;
  openModal(p ? 'Edit promotion' : 'Create promotion', `
    <form id="promoForm">
      <label>Name <input name="name" required value="${p ? escapeHtml(p.name) : ''}"></label>
      <label>Type <select name="type">
        ${['Percentage Discount', 'Fixed Amount Discount', 'BOGO', 'Seasonal Promotions', 'Member Discount'].map(t => `<option ${p && p.type === t ? 'selected' : ''}>${t}</option>`).join('')}
      </select></label>
      <label>Value (% or amount) <input type="number" name="value" step="0.01" value="${p ? p.value : 0}"></label>
      <label>Coupon code <input name="code" required value="${p ? escapeHtml(p.code) : ''}"></label>
      <label style="flex-direction:row;align-items:center;gap:8px;"><input type="checkbox" name="active" style="width:auto;" ${p && p.active ? 'checked' : (!p ? 'checked' : '')}> Active</label>
      <div class="form-actions"><button class="btn btn-primary" type="submit">${p ? 'Save changes' : 'Create promotion'}</button></div>
    </form>`, (body) => {
    body.querySelector('#promoForm').addEventListener('submit', (e) => {
      e.preventDefault(); const fd = new FormData(e.target);
      const rec = { name: fd.get('name'), type: fd.get('type'), value: parseFloat(fd.get('value')) || 0, code: fd.get('code'), active: fd.get('active') === 'on' };
      if (p) { Object.assign(p, rec); toast('Promotion updated.'); }
      else { rec.id = 'p' + nextId(''); DB.promotions.push(rec); toast('Promotion created.'); }
      saveDB(); closeModal(); drawPromotionTable(); refreshNotifications();
    });
  });
}
function togglePromotion(id) { const p = DB.promotions.find(x => x.id === id); if (p) { p.active = !p.active; saveDB(); drawPromotionTable(); refreshNotifications(); } }
function deletePromotion(id) { if (!confirm('Delete this promotion?')) return; DB.promotions = DB.promotions.filter(p => p.id !== id); saveDB(); drawPromotionTable(); }

/* ============================================================
   EMPLOYEES
   ============================================================ */
function renderEmployees() {
  document.getElementById('employeeSearch').oninput = drawEmployeeTable;
  document.getElementById('addEmployeeBtn').onclick = () => openEmployeeForm();
  drawEmployeeTable();
}
function drawEmployeeTable() {
  const q = (document.getElementById('employeeSearch').value || '').toLowerCase();
  const list = DB.employees.filter(e => e.name.toLowerCase().includes(q));
  const table = document.getElementById('employeeTable');
  table.querySelector('thead').innerHTML = `<tr><th>Name</th><th>Role</th><th>Phone</th><th>Schedule</th><th>Salary</th><th></th></tr>`;
  table.querySelector('tbody').innerHTML = list.map(e => `
    <tr>
      <td><strong>${escapeHtml(e.name)}</strong></td>
      <td><span class="tag" style="background:var(--violet)1a;color:var(--violet)">${escapeHtml(e.role)}</span></td>
      <td class="mono">${escapeHtml(e.phone || '—')}</td>
      <td>${escapeHtml(e.schedule || '—')}</td>
      <td class="mono">${currency(e.salary)}</td>
      <td><div class="row-actions">
        <button class="btn-edit" onclick="openEmployeeForm('${e.id}')">Edit</button>
        <button class="btn-delete" onclick="deleteEmployee('${e.id}')">Delete</button>
      </div></td>
    </tr>`).join('') || `<tr><td colspan="6" class="muted" style="text-align:center;padding:30px;">No employees found.</td></tr>`;
}
function openEmployeeForm(id) {
  const e = id ? DB.employees.find(x => x.id === id) : null;
  openModal(e ? 'Edit employee' : 'Add employee', `
    <form id="empForm">
      <label>Full name <input name="name" required value="${e ? escapeHtml(e.name) : ''}"></label>
      <label>Role <select name="role">
        ${['Manager', 'Cashier', 'Sales Staff', 'Storekeeper'].map(r => `<option ${e && e.role === r ? 'selected' : ''}>${r}</option>`).join('')}
      </select></label>
      <div class="modal-grid">
        <label>Phone <input name="phone" value="${e ? escapeHtml(e.phone || '') : ''}"></label>
        <label>Email <input type="email" name="email" value="${e ? escapeHtml(e.email || '') : ''}"></label>
        <label>Salary <input type="number" name="salary" step="0.01" value="${e ? e.salary : 0}"></label>
        <label>Work schedule <input name="schedule" value="${e ? escapeHtml(e.schedule || '') : ''}"></label>
      </div>
      <div class="form-actions"><button class="btn btn-primary" type="submit">${e ? 'Save changes' : 'Add employee'}</button></div>
    </form>`, (body) => {
    body.querySelector('#empForm').addEventListener('submit', (ev) => {
      ev.preventDefault(); const fd = new FormData(ev.target);
      const rec = { name: fd.get('name'), role: fd.get('role'), phone: fd.get('phone'), email: fd.get('email'), salary: parseFloat(fd.get('salary')) || 0, schedule: fd.get('schedule') };
      if (e) { Object.assign(e, rec); toast('Employee updated.'); }
      else { rec.id = 'e' + nextId(''); DB.employees.push(rec); toast('Employee added.'); }
      saveDB(); closeModal(); drawEmployeeTable();
    });
  });
}
function deleteEmployee(id) { if (!confirm('Delete this employee?')) return; DB.employees = DB.employees.filter(e => e.id !== id); saveDB(); drawEmployeeTable(); }

/* ============================================================
   REPORTS
   ============================================================ */
function renderReport() {
  document.getElementById('reportType').onchange = drawReport;
  document.getElementById('reportPrintBtn').onclick = () => window.print();
  document.getElementById('reportPdfBtn').onclick = () => window.print();
  document.getElementById('reportExcelBtn').onclick = exportReportCSV;
  drawReport();
}
let lastReportRows = { headers: [], rows: [], title: '' };
function drawReport() {
  const type = document.getElementById('reportType').value;
  let headers = [], rows = [], title = '';
  if (type === 'inventory') {
    title = 'Product Inventory Report';
    headers = ['SKU', 'Toy', 'Category', 'Stock', 'Status'];
    rows = DB.toys.map(t => [t.sku, t.name, (catById(t.category) || {}).name || '—', t.stock, t.status]);
  } else if (type === 'sales') {
    title = 'Sales Report'; headers = ['Sale ID', 'Date', 'Items', 'Total', 'Payment'];
    rows = DB.sales.map(s => [s.id, s.date.slice(0, 10), s.items.length, currency(s.total), s.payment]);
  } else if (type === 'purchase') {
    title = 'Purchase Report'; headers = ['PO ID', 'Supplier', 'Date', 'Total', 'Status'];
    rows = DB.purchases.map(p => [p.id, (supplierById(p.supplierId) || {}).name || '—', p.date.slice(0, 10), currency(p.total), p.status]);
  } else if (type === 'customer') {
    title = 'Customer Report'; headers = ['Name', 'Phone', 'Membership', 'Points'];
    rows = DB.customers.map(c => [c.name, c.phone, c.level, c.points]);
  } else if (type === 'supplier') {
    title = 'Supplier Report'; headers = ['Name', 'Contact', 'Phone', 'Orders'];
    rows = DB.suppliers.map(s => [s.name, s.contact, s.phone, DB.purchases.filter(p => p.supplierId === s.id).length]);
  } else if (type === 'revenue') {
    title = 'Revenue Report'; headers = ['Month', 'Revenue'];
    const byMonth = {};
    DB.sales.forEach(s => { const m = s.date.slice(0, 7); byMonth[m] = (byMonth[m] || 0) + s.total; });
    rows = Object.entries(byMonth).map(([m, v]) => [m, currency(v)]);
  } else if (type === 'profitloss') {
    title = 'Profit & Loss Report'; headers = ['Metric', 'Amount'];
    const revenue = DB.sales.reduce((s, x) => s + x.total, 0);
    const cogs = DB.sales.reduce((s, sale) => s + sale.items.reduce((a, it) => { const t = toyById(it.toyId); return a + (t ? t.purchasePrice * it.qty : 0); }, 0), 0);
    rows = [['Revenue', currency(revenue)], ['Cost of goods sold', currency(cogs)], ['Gross profit', currency(revenue - cogs)]];
  } else if (type === 'bestselling') {
    title = 'Best Selling Toys Report'; headers = ['Toy', 'Units sold'];
    const soldMap = {}; DB.sales.forEach(s => s.items.forEach(it => { soldMap[it.toyId] = (soldMap[it.toyId] || 0) + it.qty; }));
    rows = Object.entries(soldMap).sort((a, b) => b[1] - a[1]).map(([id, q]) => [(toyById(id) || {}).name || '—', q]);
  } else if (type === 'lowstock') {
    title = 'Low Stock Report'; headers = ['Toy', 'Stock', 'Status'];
    rows = DB.toys.filter(t => t.stock <= 5).map(t => [t.name, t.stock, t.status]);
  } else if (type === 'employee') {
    title = 'Employee Sales Performance Report'; headers = ['Cashier', 'Sales count', 'Revenue'];
    const byCashier = {}; DB.sales.forEach(s => { byCashier[s.cashier] = byCashier[s.cashier] || { count: 0, rev: 0 }; byCashier[s.cashier].count++; byCashier[s.cashier].rev += s.total; });
    rows = Object.entries(byCashier).map(([name, d]) => [name, d.count, currency(d.rev)]);
  }
  lastReportRows = { headers, rows, title };
  document.getElementById('reportOutput').innerHTML = `
    <h3 style="font-family:var(--font-display);margin-top:0;">${title}</h3>
    <table style="width:100%"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.length ? rows.map(r => `<tr>${r.map(c => `<td>${escapeHtml(String(c))}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${headers.length}" class="muted" style="text-align:center;padding:20px;">No data available for this report.</td></tr>`}</tbody></table>`;
}
function exportReportCSV() {
  const { headers, rows, title } = lastReportRows;
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = (title || 'report').replace(/\s+/g, '_') + '.csv';
  a.click();
}

/* ============================================================
   SETTINGS
   ============================================================ */
function renderSettings() {
  const s = DB.settings;
  document.getElementById('setStoreName').value = s.storeName;
  document.getElementById('setStoreAddress').value = s.address;
  document.getElementById('setStorePhone').value = s.phone;
  document.getElementById('setTaxRate').value = s.taxRate;
  document.getElementById('setCurrency').value = s.currency;
  document.getElementById('setOpen').value = s.open;
  document.getElementById('setClose').value = s.close;
  document.getElementById('saveSettingsBtn').onclick = () => {
    s.storeName = document.getElementById('setStoreName').value;
    s.address = document.getElementById('setStoreAddress').value;
    s.phone = document.getElementById('setStorePhone').value;
    s.taxRate = parseFloat(document.getElementById('setTaxRate').value) || 0;
    s.currency = document.getElementById('setCurrency').value || '$';
    s.open = document.getElementById('setOpen').value;
    s.close = document.getElementById('setClose').value;
    saveDB(); toast('Settings saved.');
  };
  document.getElementById('backupBtn').onclick = () => {
    const blob = new Blob([JSON.stringify(DB, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'playbox-backup-' + new Date().toISOString().slice(0, 10) + '.json'; a.click();
    toast('Backup downloaded.');
  };
  document.getElementById('restoreInput').onchange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { const data = JSON.parse(reader.result); DB = data; saveDB(); toast('Database restored.'); navigate('dashboard'); }
      catch (err) { toast('Restore failed — invalid file.'); }
    };
    reader.readAsText(file);
  };
}

/* ============================================================
   PROFILE
   ============================================================ */
function renderProfile() {
  document.getElementById('profileName').value = SESSION.name;
  document.getElementById('profileUsername').value = SESSION.username;
  document.getElementById('profileRole').value = SESSION.role;
  document.getElementById('saveProfileBtn').onclick = () => {
    SESSION.name = document.getElementById('profileName').value || SESSION.name;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(SESSION));
    document.getElementById('userNameLabel').textContent = SESSION.name;
    document.getElementById('userAvatar').textContent = SESSION.name.charAt(0).toUpperCase();
    toast('Profile updated.');
  };
}
