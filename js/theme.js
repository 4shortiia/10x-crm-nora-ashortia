document.addEventListener("DOMContentLoaded", () => {
    // Check the initial theme from localStorage (default: dark)
    const currentTheme = localStorage.getItem("crm_theme") || "dark";
    if (currentTheme === "dark") {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
    }

    // Bind an event to the toggle button
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");
            const theme = document.body.classList.contains("dark-theme")
                ? "dark"
                : "light";
            localStorage.setItem("crm_theme", theme);
        });
    }
});
