// js/data.js
const DataEngine = {
    // Main Reactive State [source: 1]
    state: {
        clients: [],
    },

    // Load initial state from LocalStorage or External DummyJSON API [source: 1]
    async loadClients() {
        const localData = localStorage.getItem("crm_clients"); // [source: 1]
        if (localData) {
            this.state.clients = JSON.parse(localData); // [source: 1]
            return this.state.clients;
        }

        // Fallback to API if storage is fresh and empty [source: 1]
        try {
            const res = await fetch("https://dummyjson.com/users?limit=30"); // [source: 1]
            if (!res.ok) throw new Error("API server down"); // [source: 1]
            const data = (await res.res.json()) || (await res.json());
            const rawUsers = data.users || [];

            // Map external API structural layout into our strict local Client contract [source: 1]
            this.state.clients = rawUsers.map((user) => ({
                id: user.id,
                name: `${user.firstName} ${user.lastName}`, // [source: 1]
                phone: user.phone || "+81 90-1234-5678",
                email: user.email, // [source: 1]
                company: user.company
                    ? user.company.name
                    : "Hidden Leaf Academy", // [source: 1]
                image: user.image || "https://dummyjson.com/icon/shinobi/128", // [source: 1]
                status: "Lead", // Default status required [source: 1]
                dealValue: Math.floor(Math.random() * 9500) + 500, // [source: 1]
                notes: [], // [source: 1]
                createdAt: new Date().toISOString(), // [source: 1]
            }));

            this.saveToStorage(); // [source: 1]
            return this.state.clients;
        } catch (err) {
            console.error(err);
            throw err; // [source: 1]
        }
    },

    // Save current active runtime state straight to local registry [source: 1]
    saveToStorage() {
        localStorage.setItem("crm_clients", JSON.stringify(this.state.clients)); // [source: 1]
    },

    // Core Mutators (Add, Status update, Delete) [source: 1]
    addClient(client) {
        this.state.clients.unshift(client); // [source: 1]
        this.saveToStorage(); // [source: 1]
    },

    updateClientStatus(id, newStatus) {
        const client = this.state.clients.find((c) => c.id == id);
        if (client) {
            client.status = newStatus; // [source: 1]
            this.saveToStorage(); // [source: 1]
        }
    },

    deleteClient(id) {
        this.state.clients = this.state.clients.filter((c) => c.id != id); // [source: 1]
        this.saveToStorage(); // [source: 1]
    },

    addNoteToClient(id, noteText) {
        const client = this.state.clients.find((c) => c.id == id);
        if (client) {
            client.notes.push({
                text: noteText, // [source: 1]
                date: new Date().toLocaleString(), // [source: 1]
            });
            this.saveToStorage(); // [source: 1]
        }
    },
};
