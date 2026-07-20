(function () {
    const session = localStorage.getItem("crm_session");
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf("/") + 1);

    // List of protected pages
    const protectedPages = ["dashboard.html", "clients.html", "profile.html"];
    // List of public pages
    const publicPages = ["index.html", "signup.html", ""];

    if (protectedPages.includes(page) && !session) {
        // If the user is unauthorized and enters a protected page
        window.location.href = "index.html";
    } else if ((publicPages.includes(page) || page === "") && session) {
        // If the user is already authorized and a login or registration is opened
        window.location.href = "dashboard.html";
    }
})();

// Logout functionality
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("crm_session");
            window.location.href = "index.html";
        });
    }
});
