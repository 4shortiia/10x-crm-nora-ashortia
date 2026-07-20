// js/auth.js (Sign Up & Login Controllers)
document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    // --- P1 SIGN UP CONTROLLER --- [source: 1]
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault(); // [source: 1]

            // Clear past errors gracefully [source: 1]
            document
                .querySelectorAll(".error-text")
                .forEach((el) => (el.textContent = ""));
            document
                .querySelectorAll(".form-control")
                .forEach((el) => el.classList.remove("input-error"));

            const fullName = document.getElementById("fullName").value.trim(); // [source: 1]
            const email = document
                .getElementById("email")
                .value.trim()
                .toLowerCase(); // [source: 1]
            const company = document.getElementById("company").value.trim(); // [source: 1]
            const password = document.getElementById("password").value; // [source: 1]
            const confirmPassword =
                document.getElementById("confirmPassword").value; // [source: 1]

            let hasErrors = false;

            // Strict Validation Rules [source: 1]
            if (fullName.length < 3) {
                document.getElementById("nameError").textContent =
                    "Full name must be at least 3 characters"; // [source: 1]
                document
                    .getElementById("fullName")
                    .classList.add("input-error"); // [source: 1]
                hasErrors = true;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                document.getElementById("emailError").textContent =
                    "Please enter a valid email address"; // [source: 1]
                document.getElementById("email").classList.add("input-error"); // [source: 1]
                hasErrors = true;
            } else {
                const users = JSON.parse(
                    localStorage.getItem("crm_users") || "[]",
                ); // [source: 1]
                if (users.some((u) => u.email === email)) {
                    // [source: 1]
                    document.getElementById("emailError").textContent =
                        "An account with this email already exists"; // [source: 1]
                    document
                        .getElementById("email")
                        .classList.add("input-error"); // [source: 1]
                    hasErrors = true;
                }
            }

            const hasLetter = /[a-zA-Z]/.test(password); // [source: 1]
            const hasNumber = /[0-9]/.test(password); // [source: 1]
            if (password.length < 8 || !hasLetter || !hasNumber) {
                document.getElementById("passwordError").textContent =
                    "Password must be at least 8 characters and contain a letter and a number"; // [source: 1]
                document
                    .getElementById("password")
                    .classList.add("input-error"); // [source: 1]
                hasErrors = true;
            }

            if (password !== confirmPassword) {
                document.getElementById("confirmPasswordError").textContent =
                    "Passwords do not match"; // [source: 1]
                document
                    .getElementById("confirmPassword")
                    .classList.add("input-error"); // [source: 1]
                hasErrors = true;
            }

            if (hasErrors) return; // Halt script execution [source: 1]

            // Process Account creation [source: 1]
            const users = JSON.parse(localStorage.getItem("crm_users") || "[]"); // [source: 1]
            const newUser = {
                id: Date.now(), // [source: 1]
                fullName, // [source: 1]
                email, // [source: 1]
                password, // [source: 1]
                company: company || "Independent Shinobi", // [source: 1]
                createdAt: new Date().toISOString(), // [source: 1]
            };
            users.push(newUser); // [source: 1]
            localStorage.setItem("crm_users", JSON.stringify(users)); // [source: 1]

            showToast(
                "Account created successfully! Please log in.",
                "success",
            ); // [source: 1]
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500); // [source: 1]
        });
    }

    // --- P2 LOGIN CONTROLLER --- [source: 1]
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault(); // [source: 1]

            document
                .querySelectorAll(".error-text")
                .forEach((el) => (el.textContent = ""));

            const email = document
                .getElementById("email")
                .value.trim()
                .toLowerCase(); // [source: 1]
            const password = document.getElementById("password").value; // [source: 1]

            let localErrors = false;
            if (!email) {
                document.getElementById("emailError").textContent =
                    "Email is required"; // [source: 1]
                localErrors = true;
            }
            if (!password) {
                document.getElementById("passwordError").textContent =
                    "Password is required"; // [source: 1]
                localErrors = true;
            }
            if (localErrors) return; // [source: 1]

            const users = JSON.parse(localStorage.getItem("crm_users") || "[]"); // [source: 1]
            const matchedUser = users.find(
                (u) => u.email === email && u.password === password,
            ); // [source: 1]

            if (!matchedUser) {
                document.getElementById("globalLoginError").textContent =
                    "Invalid email or password"; // Unified Secure Message [source: 1]
                return;
            }

            // Write session parameters [source: 1]
            const sessionData = {
                userId: matchedUser.id, // [source: 1]
                email: matchedUser.email, // [source: 1]
                loginAt: new Date().toISOString(), // [source: 1]
            };
            localStorage.setItem("crm_session", JSON.stringify(sessionData)); // [source: 1]
            window.location.href = "dashboard.html"; // [source: 1]
        });
    }
});
