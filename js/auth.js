// auth.js — everything related to accounts and sessions.
// Two localStorage keys are used:
//   crm_users   -> array of {name, email, password} created at signup
//   crm_session -> the currently logged-in user, or absent if logged out

function getUsers() {
    return JSON.parse(localStorage.getItem("crm_users") || "[]");
}

function saveUsers(users) {
    localStorage.setItem("crm_users", JSON.stringify(users));
}

function getSession() {
    const raw = localStorage.getItem("crm_session");
    return raw ? JSON.parse(raw) : null;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---- Sign up ----
function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById("su-name").value.trim();
    const email = document
        .getElementById("su-email")
        .value.trim()
        .toLowerCase();
    const password = document.getElementById("su-password").value;
    const errorEl = document.getElementById("su-error");
    errorEl.classList.remove("show");

    if (!name || !isValidEmail(email)) {
        errorEl.textContent = "Enter your name and a valid email address.";
        errorEl.classList.add("show");
        return;
    }
    if (password.length < 6) {
        errorEl.textContent = "Password needs at least 6 characters.";
        errorEl.classList.add("show");
        return;
    }

    const users = getUsers();
    if (users.some((u) => u.email === email)) {
        errorEl.textContent = "An account with this email already exists.";
        errorEl.classList.add("show");
        return;
    }

    users.push({ name, email, password });
    saveUsers(users);
    showToast("Account created — please sign in", "success");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 900);
}

// ---- Login ----
function handleLogin(event) {
    event.preventDefault();
    const email = document
        .getElementById("li-email")
        .value.trim()
        .toLowerCase();
    const password = document.getElementById("li-password").value;
    const errorEl = document.getElementById("li-error");
    errorEl.classList.remove("show");

    const users = getUsers();
    const match = users.find(
        (u) => u.email === email && u.password === password,
    );

    if (!match) {
        errorEl.textContent = "Invalid email or password";
        errorEl.classList.add("show");
        showToast("Invalid email or password", "error");
        return;
    }

    localStorage.setItem(
        "crm_session",
        JSON.stringify({
            name: match.name,
            email: match.email,
            loggedInAt: new Date().toISOString(),
        }),
    );
    window.location.href = "dashboard.html";
}

// ---- Auth guard ----
// Call this at the very top of every protected page. If there is no
// session, the user is bounced to the login screen before anything renders.
function requireAuth() {
    if (!getSession()) {
        window.location.href = "login.html";
    }
}

// ---- Logout ----
function handleLogout() {
    localStorage.removeItem("crm_session");
    window.location.href = "login.html";
}
