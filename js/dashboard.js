// dashboard.js — derives dashboard numbers & recent activities from crm_clients data

function initClock() {
    const updateClock = () => {
        const liveClockEl = document.getElementById("liveClock");
        if (liveClockEl) {
            const now = new Date();
            liveClockEl.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        }
    };
    updateClock();
    setInterval(updateClock, 1000);
}

// დამხმარე ფუნქცია: თანხის ფორმატირება (მაგ: 118000 -> $118K)
function formatCurrency(num) {
    if (num >= 1000) {
        return `$${Math.round(num / 1000)}K`;
    }
    return `$${num.toLocaleString()}`;
}

async function initDashboard() {
    initClock();

    // 1. Profiling Topbar Avatar
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

    // 2. Client Metrics Calculation
    try {
        let clients = [];

        if (typeof apiGetClients === "function") {
            clients = await apiGetClients();
        } else {
            clients = JSON.parse(localStorage.getItem("crm_clients")) || [];
        }

        if (!Array.isArray(clients)) clients = [];

        const statClientsEl = document.getElementById("stat-clients");
        const statActiveEl = document.getElementById("stat-active");
        const statDealsEl = document.getElementById("stat-deals");
        const statRevenueEl = document.getElementById("stat-revenue");

        // ა) Total Clients
        if (statClientsEl) statClientsEl.textContent = clients.length;

        // ბ) Active Clients (Lead და Contacted სტატუსის მქონე კლიენტები)
        const activeClients = clients.filter((c) => {
            const st = c.status ? c.status.toLowerCase() : "";
            return st === "lead" || st === "contacted";
        });
        if (statActiveEl) statActiveEl.textContent = activeClients.length;

        // გ) Deals Won (Won სტატუსის მქონე კლიენტები)
        const wonClients = clients.filter(
            (c) => c.status && c.status.toLowerCase() === "won",
        );
        if (statDealsEl) statDealsEl.textContent = wonClients.length;

        // დ) Revenue (მხოლოდ Won კლიენტების ჯამური თანხა)
        if (statRevenueEl) {
            const totalRevenue = wonClients.reduce((sum, c) => {
                const val = parseFloat(
                    c.value?.toString().replace(/[^0-9.]/g, "") || 0,
                );
                return sum + val;
            }, 0);

            statRevenueEl.textContent = formatCurrency(totalRevenue);
        }

        // ე) Activity & Top Deals Render
        renderRecentActivity(clients);
        renderTopDeals(clients);
    } catch (error) {
        console.error("Error loading dashboard metrics:", error);
    }
}

// Recent Activity Render
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

// Top Deals Render (ყველაზე მაღალბიუჯეტიანი 4 გარიგება/კლიენტი)
function renderTopDeals(clients) {
    const dealsCard = document.getElementById("top-deals-card");
    if (!dealsCard) return;

    if (clients.length === 0) {
        dealsCard.innerHTML = `
            <div class="sec-title">Top deals</div>
            <div class="empty-state">No deals found</div>
        `;
        return;
    }

    // კლებადობით დალაგება თანხის მიხედვით და ტოპ 4-ის წამოღება
    const sortedClients = [...clients]
        .map((c) => ({
            ...c,
            numericValue: parseFloat(
                c.value?.toString().replace(/[^0-9.]/g, "") || 0,
            ),
        }))
        .sort((a, b) => b.numericValue - a.numericValue)
        .slice(0, 4);

    let html = `<div class="sec-title">Top deals</div>`;

    sortedClients.forEach((client) => {
        const clientName = client.name || client.company || "Client";
        const initials = clientName
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

        const formattedVal = formatCurrency(client.numericValue);

        html += `
            <div class="rep">
                <span class="av">${initials}</span>
                <span class="nm">${clientName}</span>
                <span class="val">${formattedVal}</span>
            </div>
        `;
    });

    dealsCard.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", initDashboard);
