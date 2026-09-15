// =====================================================================
// dashboard.js - Loads and renders dashboard statistics
// =====================================================================

document.addEventListener("DOMContentLoaded", async () => {
  if (!document.getElementById("dashboardRoot")) return;
  await loadDashboard();
});

async function loadDashboard() {
  const res = await api("dashboard.php");
  if (!res.success) return showToast("Failed to load dashboard", "error");
  const d = res.data;

  setText("statTotalProducts", d.total_products);
  setText("statAvailableStock", d.available_stock);
  setText("statLowStock", d.low_stock);
  setText("statOutOfStock", d.out_of_stock);
  setText("statTotalCustomers", d.total_customers);
  setText("statTodaySales", "$" + Number(d.today_sales).toFixed(2));
  setText("statMonthRevenue", "$" + Number(d.month_revenue).toFixed(2));

  // Best selling table
  const bestBody = document.getElementById("bestSellingBody");
  if (bestBody) {
    bestBody.innerHTML = "";
    if (d.best_selling.length === 0) {
      bestBody.innerHTML = `<tr class="empty-row"><td colspan="2">No sales yet</td></tr>`;
    } else {
      d.best_selling.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${escapeHtml(row.name)}</td><td class="text-right">${row.total_sold}</td>`;
        bestBody.appendChild(tr);
      });
    }
  }

  // Sales chart (simple bar chart drawn with divs, no external lib needed)
  const chartEl = document.getElementById("salesChart");
  if (chartEl) {
    chartEl.innerHTML = "";
    const max = Math.max(1, ...d.sales_chart.map((r) => Number(r.total)));
    d.sales_chart.forEach((row) => {
      const bar = document.createElement("div");
      const pct = Math.round((Number(row.total) / max) * 100);
      bar.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:6px;flex:1;`;
      bar.innerHTML = `
        <div style="width:100%;height:120px;display:flex;align-items:flex-end;">
          <div style="width:100%;background:var(--accent);border-radius:6px 6px 0 0;height:${pct}%;"></div>
        </div>
        <span class="small-muted">${row.day.slice(5)}</span>`;
      chartEl.appendChild(bar);
    });
    if (d.sales_chart.length === 0) {
      chartEl.innerHTML = `<p class="small-muted">No sales in the last 7 days.</p>`;
    }
  }

  // Inventory status chart (simple legend list)
  const invEl = document.getElementById("inventoryStatusChart");
  if (invEl) {
    invEl.innerHTML = "";
    const colors = { Available: "var(--success)", "Out of Stock": "var(--danger)", Discontinued: "var(--text-muted)" };
    d.inventory_status.forEach((row) => {
      const div = document.createElement("div");
      div.className = "flex-between mb-10";
      div.innerHTML = `
        <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${colors[row.status] || "#ccc"};margin-right:8px;"></span>${row.status}</span>
        <strong>${row.count}</strong>`;
      invEl.appendChild(div);
    });
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
