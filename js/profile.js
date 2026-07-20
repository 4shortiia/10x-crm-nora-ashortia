document.addEventListener("DOMContentLoaded", () => {
    const session = JSON.parse(localStorage.getItem("crm_session"));
    let users = JSON.parse(localStorage.getItem("crm_users") || "[]");
    let currentUser = users.find((u) => u.id === session.userId);

    if (!currentUser) return;

    // Initialize profile information
    function updateProfileUI() {
        const initials = currentUser.fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
        document.getElementById("user-avatar").innerText = initials;
        document.getElementById("prof-name").innerText = currentUser.fullName;
        document.getElementById("prof-meta").innerText =
            `${currentUser.email} | ${currentUser.company || "No Company"} \n Member since ${new Date(currentUser.createdAt).toLocaleDateString()}`;

        document.getElementById("p-fullName").value = currentUser.fullName;
        document.getElementById("p-company").value = currentUser.company || "";
    }

    updateProfileUI();

    // Edit profile
    document
        .getElementById("edit-profile-form")
        .addEventListener("submit", (e) => {
            e.preventDefault();
            const newName = document.getElementById("p-fullName").value.trim();
            const newCompany = document
                .getElementById("p-company")
                .value.trim();

            if (newName.length < 3) {
                document.getElementById("err-p-fullName").innerText =
                    "Full name must be at least 3 characters";
                return;
            }

            currentUser.fullName = newName;
            currentUser.company = newCompany;

            localStorage.setItem("crm_users", JSON.stringify(users));
            toast.show("Profile updated ✓", "success");
            updateProfileUI();
        });

    // Change password
    document
        .getElementById("change-pass-form")
        .addEventListener("submit", (e) => {
            e.preventDefault();
            document
                .querySelectorAll(".error-message")
                .forEach((el) => (el.innerText = ""));

            const currPass = document.getElementById("curr-pass").value;
            const newPass = document.getElementById("new-pass").value;
            const confNewPass = document.getElementById("conf-new-pass").value;

            let hasError = false;

            if (currPass !== currentUser.password) {
                document.getElementById("err-curr-pass").innerText =
                    "Current password is incorrect";
                hasError = true;
            }

            const hasLetter = /[a-zA-Z]/.test(newPass);
            const hasNumber = /[0-9]/.test(newPass);
            if (newPass.length < 8 || !hasLetter || !hasNumber) {
                document.getElementById("err-new-pass").innerText =
                    "Password must be at least 8 characters and contain a letter and a number";
                hasError = true;
            }

            if (newPass === currPass) {
                document.getElementById("err-new-pass").innerText =
                    "New password must be different from the current one";
                hasError = true;
            }

            if (newPass !== confNewPass) {
                document.getElementById("err-conf-new-pass").innerText =
                    "Passwords do not match";
                hasError = true;
            }

            if (hasError) return;

            currentUser.password = newPass;
            localStorage.setItem("crm_users", JSON.stringify(users));
            toast.show("Password changed ✓", "success");
            document.getElementById("change-pass-form").reset();
        });

    // Complete data reset (Reset CRM Data)
    document.getElementById("reset-data-btn").addEventListener("click", () => {
        if (
            confirm(
                "Are you sure you want to reset all clients? Your user account will stay active.",
            )
        ) {
            localStorage.removeItem("crm_clients");
            toast.show("CRM Clients data has been reset.", "success");
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        }
    });
});
