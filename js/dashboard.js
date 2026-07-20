// js/dashboard.js
document.addEventListener("DOMContentLoaded", async () => {
    // P3.1 - Greeting Logic & Live Clock initialization [source: 1]
    const session = JSON.parse(localStorage.getItem("crm_session")); // [source: 1]
    const users = JSON.parse(localStorage.getItem("crm_users") || "[]"); // [source: 1]
    const currentUser = users.find((u) => u.id === session?.userId);

    if (currentUser) {
        const firstName = currentUser.fullName.split(" ")[0]; // Extracting first word [source: 1]
        document.getElementById("welcomeGreeting").textContent =
            `Welcome back, ${firstName}!`; // [source: 1]
    }

    // Dynamic Clock Engine [source: 1]
    setInterval(() => {
        const now = new Date();
        document.getElementById("liveClock").textContent =
            `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`; // [source: 1]
    }, 1000);

    // Load data through state core [source: 1]
    try {
        const clients = await DataEngine.loadClients(); // [source: 1]
        renderDashboardMetrics(clients);
    } catch (e) {
        showToast("Error displaying metrics", "error"); // [source: 1]
    }

    function renderDashboardMetrics(clients) {
        // Card Calculations [source: 1]
        document.getElementById("statTotal").textContent = clients.length; // [source: 1]

        const activeDeals = clients.filter(
            (c) => c.status !== "Won" && c.status !== "Lost",
        ).length; // [source: 1]
        document.getElementById("statActive").textContent = activeDeals;

        const totalWon = clients
            .filter((c) => c.status === "Won")
            .reduce((acc, c) => acc + c.dealValue, 0); // [source: 1]
        document.getElementById("statWon").textContent =
            `$${totalWon.toLocaleString()}`; // [source: 1]

        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // [source: 1]
        const newThisWeek = clients.filter(
            (c) => new Date(c.createdAt).getTime() >= sevenDaysAgo,
        ).length; // [source: 1]
        document.getElementById("statNewWeek").textContent = newThisWeek;

        // Pipeline Distribution breakdown [source: 1]
        const stages = ["Lead", "Contacted", "Won", "Lost"]; // [source: 1]
        const pipelineContainer = document.getElementById("pipelineSummary");
        pipelineContainer.innerHTML = "";
        stages.forEach((stage) => {
            const count = clients.filter((c) => c.status === stage).length; // [source: 1]
            pipelineContainer.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="badge ${stage.toLowerCase()}">${stage}</span>
                    <strong style="font-size:1.1rem">${count}</strong>
                </div>`;
        });

        // Recent 5 entries rendered safely [source: 1]
        const recent = [...clients]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5); // [source: 1]
        const table = document.getElementById("recentClientsTable");
        table.innerHTML = `
            <tr style="border-bottom:2px solid var(--border-color); color:var(--text-muted); font-size:0.9rem;">
                <th style="padding:10px 5px;">Squad Member</th>
                <th>Affiliation</th>
                <th>Status</th>
            </tr>`;
        recent.forEach((c) => {
            table.innerHTML += `
                <tr style="border-bottom:1px solid var(--border-color); font-size:0.95rem;">
                    <td style="padding:12px 5px; font-weight:500;">${c.name}</td>
                    <td>${c.company}</td>
                    <td><span class="badge ${c.status.toLowerCase()}">${c.status}</span></td>
                </tr>`;
        });
    }
});
