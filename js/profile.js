// profile.js — fills the profile page and handles account operations

function initProfile() {
    const session = getSession();
    if (!session) return;

    // Retrieving users and the current user from localStorage
    let users = JSON.parse(localStorage.getItem("crm_users") || "[]");
    const currentUser = users.find((u) => u.email === session.email) || {
        ...session,
        password: session.password || "",
    };

    // 1. Displaying profile data in the UI
    const initials = (session.name || "User")
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const avatarEl = document.getElementById("topbar-avatar");
    const pAvatarEl = document.getElementById("p-avatar");
    const pNameEl = document.getElementById("p-name");
    const pEmailEl = document.getElementById("p-email");
    const pCompanyEl = document.getElementById("p-company"); // <--- კომპანიის ელემენტი
    const pJoinedEl = document.getElementById("p-joined");

    if (avatarEl) avatarEl.textContent = initials;
    if (pAvatarEl) pAvatarEl.textContent = initials;
    if (pNameEl) pNameEl.textContent = session.name || "User";
    if (pEmailEl) pEmailEl.textContent = session.email || "—";

    // კომპანიის დასახელების გამოჩენა (სესიიდან ან crm_users-იდან)
    if (pCompanyEl) {
        pCompanyEl.textContent =
            session.company || currentUser.company || "Not specified";
    }

    if (pJoinedEl) {
        pJoinedEl.textContent = session.loggedInAt
            ? new Date(session.loggedInAt).toLocaleDateString()
            : new Date().toLocaleDateString();
    }

    // 2. CHANGE PASSWORD VALIDATION BLOCK
    const changePasswordForm = document.getElementById("changePasswordForm");
    if (changePasswordForm) {
        changePasswordForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Clearing previous errors
            document
                .querySelectorAll(".field-error")
                .forEach((el) => (el.textContent = ""));

            const currPassEl = document.getElementById("currPass");
            const newPassEl = document.getElementById("newPass");
            const confNewPassEl = document.getElementById("confNewPass");

            const currPass = currPassEl ? currPassEl.value : "";
            const newPass = newPassEl ? newPassEl.value : "";
            const confNewPass = confNewPassEl ? confNewPassEl.value : "";

            let valid = true;

            if (currPass !== currentUser.password) {
                const err = document.getElementById("currPassError");
                if (err) err.textContent = "Current password is incorrect";
                valid = false;
            }

            const hasLetter = /[a-zA-Z]/.test(newPass);
            const hasNumber = /[0-9]/.test(newPass);

            if (newPass.length < 8 || !hasLetter || !hasNumber) {
                const err = document.getElementById("newPassError");
                if (err) {
                    err.textContent =
                        "Password must be at least 8 characters and contain a letter and a number";
                }
                valid = false;
            } else if (newPass === currentUser.password) {
                const err = document.getElementById("newPassError");
                if (err) {
                    err.textContent =
                        "New password must be different from current one";
                }
                valid = false;
            }

            if (newPass !== confNewPass) {
                const err = document.getElementById("confNewPassError");
                if (err) err.textContent = "Passwords do not match";
                valid = false;
            }

            if (!valid) return;

            // Password update
            currentUser.password = newPass;
            users = users.map((u) =>
                u.email === currentUser.email ? currentUser : u,
            );
            localStorage.setItem("crm_users", JSON.stringify(users));

            // Refresh session data
            session.password = newPass;
            localStorage.setItem("crm_session", JSON.stringify(session));

            changePasswordForm.reset();

            if (typeof showToast === "function") {
                showToast("Password changed successfully ✓", "success");
            }
        });
    }

    // 3. RESET DATA BLOCK
    const resetDataBtn = document.getElementById("resetDataBtn");
    if (resetDataBtn) {
        resetDataBtn.addEventListener("click", () => {
            if (
                confirm(
                    "Are you sure you want to clear active client data? Profile settings will remain intact.",
                )
            ) {
                localStorage.removeItem("crm_clients");
                if (typeof showToast === "function") {
                    showToast("Client data wiped. Reloading...", "success");
                }
                setTimeout(() => {
                    window.location.href = "clients.html";
                }, 800);
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", initProfile);
