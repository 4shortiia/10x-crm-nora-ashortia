// js/profile.js
document.addEventListener("DOMContentLoaded", () => {
    const session = JSON.parse(localStorage.getItem("crm_session")); // [source: 1]
    let users = JSON.parse(localStorage.getItem("crm_users") || "[]"); // [source: 1]
    let currentUser = users.find((u) => u.id === session?.userId);

    if (!currentUser) return;

    // Trigger visual components parsing [source: 1]
    syncProfileUI();

    function syncProfileUI() {
        // P5.1 - Initials extractor string operation logic [source: 1]
        const names = currentUser.fullName.split(" ");
        const initials = names
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2); // [source: 1]
        document.getElementById("avatarBadge").textContent = initials; // [source: 1]

        document.getElementById("profTitleName").textContent =
            currentUser.fullName;
        document.getElementById("profEmailMeta").textContent =
            `📧 Connection: ${currentUser.email} | 🏛 Division: ${currentUser.company}`;
        document.getElementById("profJoinedMeta").textContent =
            `Inducted: ${new Date(currentUser.createdAt).toLocaleDateString()}`;

        // Feed forms inputs [source: 1]
        document.getElementById("profNameInput").value = currentUser.fullName;
        document.getElementById("profCompanyInput").value = currentUser.company;
    }

    // --- CONTROLLER A: SAVE PROFILE CHANGES --- [source: 1]
    document
        .getElementById("editProfileForm")
        .addEventListener("submit", (e) => {
            e.preventDefault(); // [source: 1]
            document.getElementById("profNameError").textContent = "";

            const updatedName = document
                .getElementById("profNameInput")
                .value.trim(); // [source: 1]
            const updatedCompany = document
                .getElementById("profCompanyInput")
                .value.trim(); // [source: 1]

            if (updatedName.length < 3) {
                document.getElementById("profNameError").textContent =
                    "Full name must be at least 3 characters"; // [source: 1]
                return;
            }

            // Mutation operations on master storage registry [source: 1]
            currentUser.fullName = updatedName; // [source: 1]
            currentUser.company = updatedCompany || "Independent Ninja"; // [source: 1]

            users = users.map((u) =>
                u.id === currentUser.id ? currentUser : u,
            ); // [source: 1]
            localStorage.setItem("crm_users", JSON.stringify(users)); // [source: 1]

            showToast("Profile updated ✓", "success"); // [source: 1]
            syncProfileUI(); // Re-render visual assets immediately [source: 1]
        });

    // --- CONTROLLER B: CHANGE PASSWORD VALIDATION BLOCK --- [source: 1]
    document
        .getElementById("changePasswordForm")
        .addEventListener("submit", (e) => {
            e.preventDefault(); // [source: 1]
            document
                .querySelectorAll(".error-text")
                .forEach((el) => (el.textContent = ""));

            const currPass = document.getElementById("currPass").value; // [source: 1]
            const newPass = document.getElementById("newPass").value; // [source: 1]
            const confNewPass = document.getElementById("confNewPass").value; // [source: 1]

            let valid = true;
            if (currPass !== currentUser.password) {
                document.getElementById("currPassError").textContent =
                    "Current password is incorrect"; // [source: 1]
                valid = false;
            }

            const hasLetter = /[a-zA-Z]/.test(newPass); // [source: 1]
            const hasNumber = /[0-9]/.test(newPass); // [source: 1]
            if (newPass.length < 8 || !hasLetter || !hasNumber) {
                document.getElementById("newPassError").textContent =
                    "Password must be at least 8 characters and contain a letter and a number"; // [source: 1]
                valid = false;
            } else if (newPass === currentUser.password) {
                document.getElementById("newPassError").textContent =
                    "New password must be different from the current one"; // [source: 1]
                valid = false;
            }

            if (newPass !== confNewPass) {
                document.getElementById("confNewPassError").textContent =
                    "Passwords do not match"; // [source: 1]
                valid = false;
            }

            if (!valid) return; // [source: 1]

            // Write mutated parameters [source: 1]
            currentUser.password = newPass; // [source: 1]
            users = users.map((u) =>
                u.id === currentUser.id ? currentUser : u,
            ); // [source: 1]
            localStorage.setItem("crm_users", JSON.stringify(users)); // [source: 1]

            document.getElementById("changePasswordForm").reset();
            showToast("Password changed ✓", "success"); // [source: 1]
        });

    // --- CONTROLLER C: HARD CLEAR PURGE DATA SCROLL --- [source: 1]
    document.getElementById("resetDataBtn").addEventListener("click", () => {
        if (
            confirm(
                "Are you absolutely certain you desire to wipe active operational state caches? Profiles will remain intact.",
            )
        ) {
            // [source: 1]
            localStorage.removeItem("crm_clients"); // Remove target client state node only [source: 1]
            showToast("State wiped. Re-loading scrolls...", "success"); // [source: 1]
            setTimeout(() => {
                window.location.href = "clients.html";
            }, 1000); // Redirect triggers fresh reload cycle [source: 1]
        }
    });
});
