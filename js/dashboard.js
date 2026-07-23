// dashboard.js — derives dashboard numbers & recent activities from crm_clients data

function initClock() {
    const updateClock = () => {
        const liveClockEl = document.getElementById("liveClock");
        if (liveClockEl) {
            const now = new Date();
            liveClockEl.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        }
    };
    updateClock(); // დაუყოვნებლივ გამოჩნდეს
    setInterval(updateClock, 1000); // ყოველ 1 წამში განახლება
}

async function initDashboard() {
    // 1. საათის გაშვება
    initClock();

    // 2. მომხმარებლის პროფილის განახლება Topbar-ში
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

    // 3. კლიენტების წამოღება და სტატისტიკის განახლება
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

        // ბ) Revenue-ს განახლება (თუ კლიენტებს აქვთ value ველი)
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

        // გ) Recent Activity-ს დინამიკური რენდერი
        renderRecentActivity(clients);
    } catch (error) {
        console.error("Error loading dashboard metrics:", error);
    }
}

// Recent Activity სექციის დარენდერება
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

    // იღებს ბოლო 4 დამატებულ კლიენტს
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
