document.addEventListener("DOMContentLoaded", () => {
    const session = JSON.parse(localStorage.getItem("crm_session"));
    const users = JSON.parse(localStorage.getItem("crm_users") || "[]");
    const currentUser = users.find((u) => u.id === session.userId);

    const welcomeTitle = document.getElementById("welcome-message");
    if (currentUser) {
        const firstName = currentUser.fullName.split(" ")[0];
        setInterval(() => {
            const now = new Date();
            welcomeTitle.innerText = `Welcome back, ${firstName}! ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        }, 1000);
    }

    // Fetch data (golden cycle logic)
    let clients = JSON.parse(localStorage.getItem("crm_clients"));
    if (!clients) {
        fetch("https://dummyjson.com/users?limit=30")
            .then((res) => res.json())
            .then((data) => {
                clients = data.users.map((u) => ({
                    id: u.id,
                    name: `${u.firstName} ${u.lastName}`,
                    phone: u.phone,
                    email: u.email,
                    company: u.company.name,
                    image: u.image,
                    status: "Lead",
                    dealValue: Math.floor(Math.random() * 9500) + 500,
                    notes: [],
                    createdAt: new Date().toISOString(),
                }));
                localStorage.setItem("crm_clients", JSON.stringify(clients));
                calculateStats(clients);
            });
    } else {
        calculateStats(clients);
    }

    function calculateStats(data) {
        document.getElementById("stat-total").innerText = data.length;

        const activeDeals = data.filter(
            (c) => c.status !== "Won" && c.status !== "Lost",
        ).length;
        document.getElementById("stat-active").innerText = activeDeals;

        const wonRevenue = data
            .filter((c) => c.status === "Won")
            .reduce((sum, c) => sum + c.dealValue, 0);
        document.getElementById("stat-revenue").innerText =
            `$${wonRevenue.toLocaleString()}`;

        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const newThisWeek = data.filter(
            (c) => new Date(c.createdAt).getTime() >= oneWeekAgo,
        ).length;
        document.getElementById("stat-week").innerText = newThisWeek;

        // Pipeline Overview
        const pipe = { Lead: 0, Contacted: 0, Won: 0, Lost: 0 };
        data.forEach((c) => {
            if (pipe[c.status] !== undefined) pipe[c.status]++;
        });
        document.getElementById("pipeline-summary").innerText =
            `Lead: ${pipe.Lead} | Contacted: ${pipe.Contacted} | Won: ${pipe.Won} | Lost: ${pipe.Lost}`;

        // Recent Clients (ბოლო 5)
        const recent = [...data]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        const listContainer = document.getElementById("recent-clients-list");
        listContainer.innerHTML = "";
        recent.forEach((c) => {
            const li = document.createElement("li");
            li.innerText = `${c.name} - ${c.company} [${c.status}] (${new Date(c.createdAt).toLocaleDateString()})`;
            listContainer.appendChild(li);
        });
    }
});
