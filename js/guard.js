// js/guard.js
(function () {
    // P0.1 - Auth Guard Logic [source: 1]
    const session = localStorage.getItem("crm_session"); // [source: 1]
    const currentPath = window.location.pathname;
    const isPublicPage =
        currentPath.includes("index.html") ||
        currentPath.includes("signup.html") ||
        currentPath === "/";

    if (!session && !isPublicPage) {
        // Not logged in and trying to access protected zone -> Force redirect to login [source: 1]
        window.location.href = "index.html"; // [source: 1]
    } else if (session && isPublicPage) {
        // Already logged in and trying to access login/signup -> Redirect to dashboard [source: 1]
        window.location.href = "dashboard.html"; // [source: 1]
    }

    // P0.3 - Theme Engine initialization [source: 1]
    document.addEventListener("DOMContentLoaded", () => {
        const savedTheme = localStorage.getItem("crm_theme") || "light"; // [source: 1]
        if (savedTheme === "dark") {
            document.body.classList.add("dark-theme"); // [source: 1]
        }

        // Wire up theme toggles if present on the page [source: 1]
        const themeBtn = document.getElementById("themeToggleBtn");
        if (themeBtn) {
            themeBtn.addEventListener("click", () => {
                document.body.classList.toggle("dark-theme"); // [source: 1]
                const activeTheme = document.body.classList.contains(
                    "dark-theme",
                )
                    ? "dark"
                    : "light"; // [source: 1]
                localStorage.setItem("crm_theme", activeTheme); // [source: 1]
            });
        }

        // Wire up Logout handler if present [source: 1]
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("crm_session"); // Delete session only [source: 1]
                window.location.href = "index.html"; // Redirect safely [source: 1]
            });
        }
    });
})();

// P0.4 - Premium Global Toast Notification System [source: 1]
function showToast(message, type = "success") {
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = `toast ${type}`; // [source: 1]
    toast.innerHTML = `<span>${message}</span><strong style="cursor:pointer;margin-left:15px" onclick="this.parentElement.remove()">✕</strong>`; // [source: 1]
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000); // [source: 1]
}
