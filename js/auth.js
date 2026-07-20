document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    // Helper function for clearing errors
    const clearErrors = (form) => {
        form.querySelectorAll(".error-message").forEach(
            (el) => (el.innerText = ""),
        );
        form.querySelectorAll("input").forEach((el) =>
            el.classList.remove("input-error"),
        );
    };

    // --- SIGN UP LOGIC ---
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            clearErrors(signupForm);

            const fullName = document.getElementById("fullName").value.trim();
            const email = document
                .getElementById("email")
                .value.trim()
                .toLowerCase();
            const company = document.getElementById("company").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword =
                document.getElementById("confirmPassword").value;

            let hasError = false;

            if (fullName.length < 3) {
                document.getElementById("err-fullName").innerText =
                    "Full name must be at least 3 characters";
                document
                    .getElementById("fullName")
                    .classList.add("input-error");
                hasError = true;
            }

            const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
            if (!emailRegex.test(email)) {
                document.getElementById("err-email").innerText =
                    "Please enter a valid email address";
                document.getElementById("email").classList.add("input-error");
                hasError = true;
            } else {
                const users = JSON.parse(
                    localStorage.getItem("crm_users") || "[]",
                );
                if (users.some((u) => u.email === email)) {
                    document.getElementById("err-email").innerText =
                        "An account with this email already exists";
                    document
                        .getElementById("email")
                        .classList.add("input-error");
                    hasError = true;
                }
            }

            const hasLetter = /[a-zA-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            if (password.length < 8 || !hasLetter || !hasNumber) {
                document.getElementById("err-password").innerText =
                    "Password must be at least 8 characters and contain a letter and a number";
                document
                    .getElementById("password")
                    .classList.add("input-error");
                hasError = true;
            }

            if (password !== confirmPassword) {
                document.getElementById("err-confirmPassword").innerText =
                    "Passwords do not match";
                document
                    .getElementById("confirmPassword")
                    .classList.add("input-error");
                hasError = true;
            }

            if (hasError) return;

            const users = JSON.parse(localStorage.getItem("crm_users") || "[]");
            const newUser = {
                id: Date.now(),
                fullName,
                email,
                password, // Kept open for educational purposes
                company,
                createdAt: new Date().toISOString(),
            };

            users.push(newUser);
            localStorage.setItem("crm_users", JSON.stringify(users));

            toast.show(
                "Account created successfully! Please log in.",
                "success",
            );
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        });
    }

    // --- LOGIN LOGIC ---
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            clearErrors(loginForm);

            const email = document
                .getElementById("login-email")
                .value.trim()
                .toLowerCase();
            const password = document.getElementById("login-password").value;
            let hasError = false;

            if (!email) {
                document.getElementById("err-login-email").innerText =
                    "Email is required";
                document
                    .getElementById("login-email")
                    .classList.add("input-error");
                hasError = true;
            }

            if (!password) {
                document.getElementById("err-login-password").innerText =
                    "Password is required";
                document
                    .getElementById("login-password")
                    .classList.add("input-error");
                hasError = true;
            }

            if (hasError) return;

            const users = JSON.parse(localStorage.getItem("crm_users") || "[]");
            const user = users.find(
                (u) => u.email === email && u.password === password,
            );

            if (!user) {
                document.getElementById("global-login-error").innerText =
                    "Invalid email or password";
                return;
            }

            const sessionObj = {
                userId: user.id,
                email: user.email,
                loginAt: new Date().toISOString(),
            };
            localStorage.setItem("crm_session", JSON.stringify(sessionObj));
            window.location.href = "dashboard.html";
        });
    }
});
