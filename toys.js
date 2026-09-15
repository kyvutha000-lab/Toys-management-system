// =====================================================================
// toys.js - Toy Management page logic (list, search, add/edit, delete)
// =====================================================================

let toyBrandsCache = [];
let toyCategoriesCache = [];

document.addEventListener("DOMContentLoaded", async () => {
  if (!document.getElementById("toysRoot")) return;

  await loadBrandsAndCategoriesForFilters();
  await loadToys();

  document.getElementById("btnAddToy")?.addEventListener("click", () => openToyModal());
  document.getElementById("toyForm")?.addEventListener("submit", saveToy);
  document.getElementById("toySearchInput")?.addEventListener("keyup", debounce(loadToys, 300));
  document.getElementById("filterCategory")?.addEventListener("change", loadToys);
  document.getElementById("filterBrand")?.addEventListener("change", loadToys);
  document.getElementById("filterStatus")?.addEventListener("change", loadToys);

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("search")) {
    document.getElementById("toySearchInput").value = urlParams.get("search");
    loadToys();
  }
});

async function loadBrandsAndCategoriesForFilters() {
  const [brandsRes, catRes] = await Promise.all([api("brands.php"), api("categories.php")]);
  toyBrandsCache = brandsRes.data || [];
  toyCategoriesCache = catRes.data || [];

  fillSelect("filterBrand", toyBrandsCache, "All Brands");
  fillSelect("filterCategory", toyCategoriesCache, "All Categories");
  fillSelect("toyBrandId", toyBrandsCache, "Select Brand");
  fillSelect("toyCategoryId", toyCategoriesCache, "Select Category");
}

function fillSelect(id, items, placeholder) {
  const sel = document.getElementById(id);
  if (!sel) return;
  sel.innerHTML = `<option value="">${placeholder}</option>` +
    items.map((i) => `<option value="${i.id}">${escapeHtml(i.name)}</option>`).join("");
}

async function loadToys() {
  const tbody = document.getElementById("toysTableBody");
  if (!tbody) return;
  tbody.innerHTML = `<tr class="empty-row"><td colspan="8">Loading...</td></tr>`;

  const params = {
    search: document.getElementById("toySearchInput")?.value || "",
    category_id: document.getElementById("filterCategory")?.value || "",
    brand_id: document.getElementById("filterBrand")?.value || "",
    status: document.getElementById("filterStatus")?.value || "",
  };

  const res = await api("toys.php", { params });
  if (!res.success) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="8">Error: ${escapeHtml(res.message || "Failed to load toys")}</td></tr>`;
    return showToast(res.message || "Failed to load toys", "error");
  }

  tbody.innerHTML = "";
  if (res.data.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="8">No toys found</td></tr>`;
    return;
  }

  res.data.forEach((toy) => {
    const badgeClass = toy.status === "Available" ? "badge-success" : toy.status === "Out of Stock" ? "badge-danger" : "badge-muted";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(toy.sku)}</td>
      <td>${escapeHtml(toy.name)}</td>
      <td>${escapeHtml(toy.brand_name || "-")}</td>
      <td>${escapeHtml(toy.category_name || "-")}</td>
      <td>$${Number(toy.selling_price).toFixed(2)}</td>
      <td>${toy.stock_qty}</td>
      <td><span class="badge ${badgeClass}">${toy.status}</span></td>
      <td class="actions">
        <button class="btn-icon" title="Edit" onclick='openToyModal(${JSON.stringify(toy).replace(/'/g, "&#39;")})'><ion-icon name="create-outline"></ion-icon></button>
        <button class="btn-icon" title="Delete" onclick="deleteToy(${toy.id}, '${escapeHtml(toy.name)}')"><ion-icon name="trash-outline"></ion-icon></button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function openToyModal(toy = null) {
  const form = document.getElementById("toyForm");
  form.reset();
  document.getElementById("toyId").value = toy ? toy.id : "";
  document.getElementById("modalToyTitle").textContent = toy ? "Edit Toy" : "Add New Toy";

  if (toy) {
    document.getElementById("toySku").value = toy.sku || "";
    document.getElementById("toyBarcode").value = toy.barcode || "";
    document.getElementById("toyName").value = toy.name || "";
    document.getElementById("toyBrandId").value = toy.brand_id || "";
    document.getElementById("toyCategoryId").value = toy.category_id || "";
    document.getElementById("toyAgeGroup").value = toy.age_group || "";
    document.getElementById("toyMaterial").value = toy.material || "";
    document.getElementById("toyColor").value = toy.color || "";
    document.getElementById("toyPurchasePrice").value = toy.purchase_price || 0;
    document.getElementById("toySellingPrice").value = toy.selling_price || 0;
    document.getElementById("toyStockQty").value = toy.stock_qty || 0;
    document.getElementById("toyLowStock").value = toy.low_stock_threshold || 5;
    document.getElementById("toyWarranty").value = toy.warranty || "";
  }
  openModal("toyModal");
}

async function saveToy(e) {
  e.preventDefault();
  const id = document.getElementById("toyId").value;
  const payload = {
    sku: document.getElementById("toySku").value,
    barcode: document.getElementById("toyBarcode").value,
    name: document.getElementById("toyName").value,
    brand_id: document.getElementById("toyBrandId").value,
    category_id: document.getElementById("toyCategoryId").value,
    age_group: document.getElementById("toyAgeGroup").value,
    material: document.getElementById("toyMaterial").value,
    color: document.getElementById("toyColor").value,
    purchase_price: parseFloat(document.getElementById("toyPurchasePrice").value || 0),
    selling_price: parseFloat(document.getElementById("toySellingPrice").value || 0),
    stock_qty: parseInt(document.getElementById("toyStockQty").value || 0),
    low_stock_threshold: parseInt(document.getElementById("toyLowStock").value || 5),
    warranty: document.getElementById("toyWarranty").value,
  };

  let res;
  if (id) {
    payload.id = id;
    res = await api("toys.php?action=update", { method: "POST", body: payload });
  } else {
    res = await api("toys.php", { method: "POST", body: payload });
  }

  if (res.success) {
    showToast(res.message, "success");
    closeModal("toyModal");
    loadToys();
  } else {
    showToast(res.message || "Failed to save toy", "error");
  }
}

async function deleteToy(id, name) {
  if (!confirm(`Delete toy "${name}"? This cannot be undone.`)) return;
  const res = await api("toys.php?action=delete", { method: "POST", body: { id } });
  if (res.success) {
    showToast(res.message, "success");
    loadToys();
  } else {
    showToast(res.message || "Failed to delete toy", "error");
  }
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
