// dashboard.js — derives dashboard numbers & recent activities from crm_clients data

function initClock() {
    const updateClock = () => {
        const liveClockEl = document.getElementById("liveClock");
        if (liveClockEl) {
            const now = new Date();
            liveClockEl.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        }
    };
    updateClock(); // appear immediately
    setInterval(updateClock, 1000); // Update every 1 second
}

async function initDashboard() {
    // 1. Start the clock
    initClock();

    // 2. Updating the user profile in Topbar
    try {
        if (typeof getSession === "function") {
            const session = getSession();
            if (session && session.name) {
                const avatarEl = document.getElementById("topbar-avatar");
                const greetNameEl = document.getElementById("greet-name");

                if (avatarEl) {
                    avatarEl.textContent = session.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();
                }
                if (greetNameEl) {
                    greetNameEl.textContent = session.name.split(" ")[0];
                }
            }
        }
    } catch (e) {
        console.error("Session error:", e);
    }

    // 3. Acquiring clients and updating statistics
    try {
        let clients = [];

        if (typeof apiGetClients === "function") {
            clients = await apiGetClients();
        } else {
            clients = JSON.parse(localStorage.getItem("crm_clients")) || [];
        }

        if (!Array.isArray(clients)) clients = [];

        // ა) Total Clients & Active Clients
        const statClientsEl = document.getElementById("stat-clients");
        const statActiveEl = document.getElementById("stat-active");

        if (statClientsEl) statClientsEl.textContent = clients.length;

        const activeClients = clients.filter(
            (c) => c.status && c.status.toLowerCase() === "active",
        );
        if (statActiveEl) statActiveEl.textContent = activeClients.length;

        // b) Update Revenue (if customers have a value field)
        const statRevenueEl = document.getElementById("stat-revenue");
        if (statRevenueEl) {
            const totalRevenue = clients.reduce((sum, c) => {
                const val = parseFloat(
                    c.value?.toString().replace(/[^0-9.]/g, "") || 0,
                );
                return sum + val;
            }, 0);

            if (totalRevenue > 0) {
                statRevenueEl.textContent = `$${totalRevenue.toLocaleString()}`;
            }
        }

        // c) Recent Activity
        renderRecentActivity(clients);
    } catch (error) {
        console.error("Error loading dashboard metrics:", error);
    }
}

// Recent Activity
function renderRecentActivity(clients) {
    const activityCard = document.getElementById("recent-activity-card");
    if (!activityCard) return;

    if (clients.length === 0) {
        activityCard.innerHTML = `
            <div class="sec-title">Recent activity</div>
            <div class="empty-state">No recent activity yet</div>
        `;
        return;
    }

    // Gets the last 4 added clients
    const recentClients = [...clients].reverse().slice(0, 4);

    let html = `<div class="sec-title">Recent activity</div>`;

    recentClients.forEach((client) => {
        html += `
            <div class="row">
                <span class="dot"></span>
                <span class="txt"><b>${client.name || "Client"}</b> added — ${client.company || "New Lead"}</span>
                <span class="time">Recently</span>
            </div>
        `;
    });

    activityCard.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", initDashboard);
