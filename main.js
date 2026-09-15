// =====================================================================
// main.js - Shared logic for every PLAYBOX page (nav, auth, toast, api)
// =====================================================================
 
const API_BASE = "../php/";
 
// ---------------------------------------------------------------------
// Generic API helper (wraps fetch, always sends/receives JSON + cookies)
// ---------------------------------------------------------------------
async function api(endpoint, { method = "GET", params = null, body = null } = {}) {
  let url = API_BASE + endpoint;
  if (params) {
    const qs = new URLSearchParams(params).toString();
    url += (url.includes("?") ? "&" : "?") + qs;
  }
  const opts = {
    method,
    credentials: "same-origin",
    headers: {},
  };
  if (body) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = { success: false, message: "Invalid server response" };
  }
  if (!res.ok && res.status === 401) {
    // Not logged in -> redirect to login
    window.location.href = "index.php";
    return data;
  }
  return data;
}
 
// ---------------------------------------------------------------------
// Shared HTML-escaping helper (used by every page-specific script)
// ---------------------------------------------------------------------
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
 
// ---------------------------------------------------------------------
// Toast notifications
// ---------------------------------------------------------------------
function showToast(message, type = "") {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = "toast " + type;
  requestAnimationFrame(() => toast.classList.add("show"));
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 3000);
}
 
// ---------------------------------------------------------------------
// Auth guard - every dashboard page calls this on load
// ---------------------------------------------------------------------
async function requireAuth() {
  const res = await api("login.php?action=me");
  if (!res.logged_in) {
    window.location.href = "index.php";
    return null;
  }
  const nameEl = document.querySelector(".user-name");
  const roleEl = document.querySelector(".user-role");
  const avatarEl = document.querySelector(".avatar");
  if (nameEl) nameEl.textContent = res.user.full_name;
  if (roleEl) roleEl.textContent = res.user.role;
  if (avatarEl) avatarEl.textContent = res.user.full_name.charAt(0).toUpperCase();
  return res.user;
}
 
// ---------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------
function setupLogout() {
  const profile = document.querySelector(".user-profile");
  if (!profile) return;
  profile.style.cursor = "pointer";
  profile.title = "Click to logout";
  profile.addEventListener("click", async () => {
    if (confirm("Log out of PLAYBOX?")) {
      await api("login.php?action=logout", { method: "POST" });
      window.location.href = "index.php";
    }
  });
}
 
// ---------------------------------------------------------------------
// Notification bell
// ---------------------------------------------------------------------
async function loadNotificationBell() {
  const bell = document.querySelector(".notification-bell");
  if (!bell) return;
  try {
    const res = await api("notifications.php");
    const dot = bell.querySelector(".notif-dot");
    if (dot) dot.style.display = res.unread_count > 0 ? "block" : "none";
  } catch (e) { /* ignore */ }
  bell.addEventListener("click", () => {
    window.location.href = "notifications.php";
  });
}
 
// ---------------------------------------------------------------------
// Navigation hover / active link / sidebar toggle
// ---------------------------------------------------------------------
function setupNavigation() {
  const list = document.querySelectorAll(".navigation li");
  list.forEach((item) => {
    item.addEventListener("mouseover", function () {
      list.forEach((i) => i.classList.remove("hovered"));
      this.classList.add("hovered");
    });
  });
 
  let currentFile = window.location.pathname.split("/").pop().toLowerCase();
  if (currentFile === "") currentFile = "index.php";
  list.forEach((item) => {
    const link = item.querySelector("a");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href) return;
    const linkFile = href.split("/").pop().split("?")[0].toLowerCase();
    item.classList.remove("active-page");
    if (linkFile === currentFile) item.classList.add("active-page");
  });
 
  const toggle = document.querySelector(".toggle");
  const navigation = document.querySelector(".navigation");
  const main = document.querySelector(".main");
  if (!toggle || !navigation || !main) return;
 
  if (sessionStorage.getItem("navActive") === "true") {
    navigation.classList.add("active");
    main.classList.add("active");
  }
  toggle.onclick = function () {
    navigation.classList.toggle("active");
    main.classList.toggle("active");
    sessionStorage.setItem("navActive", navigation.classList.contains("active"));
  };
}
 
// ---------------------------------------------------------------------
// Search box -> quick search across toys/customers/suppliers
// ---------------------------------------------------------------------
function setupGlobalSearch() {
  const input = document.querySelector(".search-box input");
  if (!input) return;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      window.location.href = "toys.php?search=" + encodeURIComponent(input.value.trim());
    }
  });
}
 
// ---------------------------------------------------------------------
// Modal helpers
// ---------------------------------------------------------------------
function openModal(id) {
  document.getElementById(id)?.classList.add("open");
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove("open");
}
 
// ---------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  if (document.querySelector(".navigation")) {
    await requireAuth();
    setupNavigation();
    setupLogout();
    loadNotificationBell();
    setupGlobalSearch();
  }
});