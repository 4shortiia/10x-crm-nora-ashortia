// js/clients.js
document.addEventListener("DOMContentLoaded", async () => {
    let currentFilter = "All";
    let selectedClientId = null;

    const grid = document.getElementById("clientsGrid");
    const loader = document.getElementById("loadingIndicator");

    // Load State via Core Engine with Try/Catch Retry Protection [source: 1]
    async function initFetch() {
        try {
            loader.style.display = "block"; // [source: 1]
            grid.innerHTML = "";
            await DataEngine.loadClients(); // [source: 1]
            loader.style.display = "none"; // [source: 1]
            applyFiltersAndRender();
        } catch (err) {
            loader.innerHTML = `
                <p style="color:var(--status-lost-text)">Could not load clients. Check your connection and try again.</p>
                <button class="btn btn-primary" id="retryBtn" style="width:auto; margin-top:10px;">🔄 Retry Synapse</button>`; // [source: 1]
            document
                .getElementById("retryBtn")
                ?.addEventListener("click", initFetch); // [source: 1]
        }
    }
    await initFetch();

    // P4.7 - Master Filter/Search/Sort Architecture Composite Engine [source: 1]
    function applyFiltersAndRender() {
        let list = [...DataEngine.state.clients]; // Operates safely on cloned array instance [source: 1]

        // 1. Stage status resolution [source: 1]
        if (currentFilter !== "All") {
            list = list.filter((c) => c.status === currentFilter); // [source: 1]
        }

        // 2. Multi-column query substring matching [source: 1]
        const query = document
            .getElementById("searchInput")
            .value.toLowerCase()
            .trim(); // [source: 1]
        if (query) {
            list = list.filter(
                (c) =>
                    c.name.toLowerCase().includes(query) ||
                    c.company.toLowerCase().includes(query),
            ); // [source: 1]
        }

        // 3. Sequential Sorting logic routing [source: 1]
        const sortBy = document.getElementById("sortSelect").value;
        if (sortBy === "Newest") {
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // [source: 1]
        } else if (sortBy === "Alpha") {
            list.sort((a, b) => a.name.localeCompare(b.name)); // [source: 1]
        } else if (sortBy === "Value") {
            list.sort((a, b) => b.dealValue - a.dealValue); // [source: 1]
        }

        renderGrid(list);
    }

    // P4.3 - Primary DOM Renderer engine [source: 1]
    function renderGrid(elements) {
        grid.innerHTML = "";
        if (elements.length === 0) {
            grid.innerHTML =
                '<div style="text-align:center;width:100%;grid-column:1/-1;color:var(--text-muted);font-weight:600;">No clients found.</div>'; // [source: 1]
            return;
        }
        elements.forEach((c) => {
            const card = document.createElement("div");
            card.className = "client-card";
            card.setAttribute("data-id", c.id); // [source: 1]
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div style="display:flex; gap:12px; align-items:center;">
                        <img src="${c.image}" style="width:45px; height:45px; border-radius:50%; background:#f1f3f5;">
                        <div>
                            <h4 style="font-size:1.05rem;">${c.name}</h4>
                            <p style="font-size:0.8rem; color:var(--text-muted);">${c.company}</p>
                        </div>
                    </div>
                    <span class="badge ${c.status.toLowerCase()}">${c.status}</span>
                </div>
                <div style="margin-top:1rem; display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color:var(--accent-color);">$${c.dealValue.toLocaleString()}</strong>
                    <select class="status-select form-control" style="width:auto; padding:3px 8px; font-size:0.8rem; height:auto;" data-id="${c.id}">
                        <option value="Lead" ${c.status === "Lead" ? "selected" : ""}>Lead</option>
                        <option value="Contacted" ${c.status === "Contacted" ? "selected" : ""}>Contacted</option>
                        <option value="Won" ${c.status === "Won" ? "selected" : ""}>Won</option>
                        <option value="Lost" ${c.status === "Lost" ? "selected" : ""}>Lost</option>
                    </select>
                    <button class="btn btn-danger delete-card-btn" style="padding:4px 8px; font-size:0.8rem;" data-id="${c.id}">Delete</button>
                </div>`;
            grid.appendChild(card);
        });
    }

    // Event Delegation Interceptor mappings for grid triggers [source: 1]
    grid.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");

        // P4.5 - Delete Execution routine [source: 1]
        if (e.target.classList.contains("delete-card-btn")) {
            e.stopPropagation(); // Avoid triggering details modal overlay opening [source: 1]
            if (confirm("Delete this client? This cannot be undone.")) {
                // [source: 1]
                DataEngine.deleteClient(id); // [source: 1]
                showToast("Client deleted", "success"); // [source: 1]
                applyFiltersAndRender(); // [source: 1]
            }
            return;
        }

        // Inline status select modification trap [source: 1]
        if (e.target.classList.contains("status-select")) {
            e.stopPropagation();
            return;
        }

        // P4.8 - Open Character Details Modal window [source: 1]
        const closestCard = e.target.closest(".client-card");
        if (closestCard) {
            const cardId = closestCard.getAttribute("data-id");
            openDetailsModal(cardId);
        }
    });

    grid.addEventListener("change", (e) => {
        // P4.6 - Status variation processing [source: 1]
        if (e.target.classList.contains("status-select")) {
            const id = e.target.getAttribute("data-id");
            DataEngine.updateClientStatus(id, e.target.value); // [source: 1]
            applyFiltersAndRender(); // Update styles & structures [source: 1]
        }
    });

    // Toolbar Input Listeners [source: 1]
    document
        .getElementById("searchInput")
        .addEventListener("input", applyFiltersAndRender); // [source: 1]
    document
        .getElementById("sortSelect")
        .addEventListener("change", applyFiltersAndRender); // [source: 1]

    document.querySelectorAll(".filter-chips .chip").forEach((chip) => {
        chip.addEventListener("click", (e) => {
            document
                .querySelectorAll(".filter-chips .chip")
                .forEach((c) => c.classList.remove("active"));
            e.target.classList.add("active"); // [source: 1]
            currentFilter = e.target.getAttribute("data-filter"); // [source: 1]
            applyFiltersAndRender(); // [source: 1]
        });
    });

    // --- ADD CLIENT LOGIC MODAL CODE --- [source: 1]
    const addModal = document.getElementById("addClientModal");
    document
        .getElementById("openAddModalBtn")
        .addEventListener("click", () => addModal.classList.add("open"));
    document
        .getElementById("closeAddModal")
        .addEventListener("click", () => addModal.classList.remove("open"));

    document.getElementById("addClientForm").addEventListener("submit", (e) => {
        e.preventDefault(); // [source: 1]
        document
            .querySelectorAll(".error-text")
            .forEach((el) => (el.textContent = ""));

        const name = document.getElementById("addName").value.trim(); // [source: 1]
        const email = document.getElementById("addEmail").value.trim(); // [source: 1]
        const phone = document.getElementById("addPhone").value.trim(); // [source: 1]
        const company = document.getElementById("addCompany").value.trim(); // [source: 1]
        const value = document.getElementById("addValue").value; // [source: 1]
        const status = document.getElementById("addStatus").value; // [source: 1]

        let valid = true;
        if (name.length < 3) {
            document.getElementById("addNameError").textContent =
                "Name must be at least 3 characters"; // [source: 1]
            valid = false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById("addEmailError").textContent =
                "Please enter a valid email address"; // [source: 1]
            valid = false;
        } else if (DataEngine.state.clients.some((c) => c.email === email)) {
            // [source: 1]
            document.getElementById("addEmailError").textContent =
                "A client with this email already exists"; // [source: 1]
            valid = false;
        }
        if (phone && phone.length < 6) {
            document.getElementById("addPhoneError").textContent =
                "Phone number looks too short"; // [source: 1]
            valid = false;
        }
        if (!value || isNaN(value) || Number(value) <= 0) {
            document.getElementById("addValueError").textContent =
                "Deal value must be a positive number"; // [source: 1]
            valid = false;
        }

        if (!valid) return; // Halt compilation if anomalies discovered [source: 1]

        // Build new entity object [source: 1]
        const targetObj = {
            id: Date.now(),
            name, // [source: 1]
            email, // [source: 1]
            phone: phone || "+81 Unspecified",
            company: company || "Rogue Shinobi Division", // [source: 1]
            image: "https://dummyjson.com/icon/users/7",
            status, // [source: 1]
            dealValue: Number(value), // [source: 1]
            notes: [], // [source: 1]
            createdAt: new Date().toISOString(), // [source: 1]
        };

        DataEngine.addClient(targetObj); // [source: 1]
        addModal.classList.remove("open"); // [source: 1]
        document.getElementById("addClientForm").reset();
        showToast("Client added ✓", "success"); // [source: 1]
        applyFiltersAndRender();
    });

    // --- CHARACTERS DETAILS & EXTENDED NOTES ENGINE --- [source: 1]
    const detailsModal = document.getElementById("detailsModal");
    document
        .getElementById("closeDetailsModal")
        .addEventListener("click", () => detailsModal.classList.remove("open"));

    function openDetailsModal(id) {
        selectedClientId = id;
        const target = DataEngine.state.clients.find((c) => c.id == id);
        if (!target) return;

        document.getElementById("detImage").src = target.image;
        document.getElementById("detName").textContent = target.name;
        document.getElementById("detMeta").textContent =
            `${target.company} (${target.status})`;
        document.getElementById("detEmail").textContent = target.email;
        document.getElementById("detPhone").textContent = target.phone;
        document.getElementById("detValue").textContent =
            `$${target.dealValue.toLocaleString()}`;
        document.getElementById("detDate").textContent = new Date(
            target.createdAt,
        ).toLocaleDateString();

        renderNotesList(target.notes);
        detailsModal.classList.add("open");
    }

    function renderNotesList(notes) {
        const container = document.getElementById("notesContainer");
        container.innerHTML = "";
        if (notes.length === 0) {
            container.innerHTML =
                '<p style="color:var(--text-muted);font-style:italic;">No log transcripts submitted yet.</p>';
            return;
        }
        notes.forEach((n) => {
            container.innerHTML += `
                <div style="background:var(--bg-sidebar); padding:6px 10px; border-radius:6px; border:1px solid var(--border-color)">
                    <p>${n.text}</p>
                    <small style="color:var(--text-muted); font-size:0.75rem">${n.date}</small>
                </div>`;
        });
    }

    document.getElementById("addNoteBtn").addEventListener("click", () => {
        const txt = document.getElementById("noteInput").value.trim(); // [source: 1]
        if (!txt) return; // Prevent logging blank transcripts [source: 1]

        DataEngine.addNoteToClient(selectedClientId, txt); // [source: 1]
        document.getElementById("noteInput").value = "";

        // Re-read structural update logs immediately [source: 1]
        const clientInstance = DataEngine.state.clients.find(
            (c) => c.id == selectedClientId,
        );
        renderNotesList(clientInstance.notes);
    });

    // P4.8 - Timeout Scheduling Notification Remind Engine [source: 1]
    document.getElementById("remindBtn").addEventListener("click", () => {
        const targetedClient = DataEngine.state.clients.find(
            (c) => c.id == selectedClientId,
        );
        if (!targetedClient) return;

        showToast("Reminder set ✓", "success"); // [source: 1]

        setTimeout(() => {
            showToast(`Follow up: ${targetedClient.name}`, "success"); // Triggers contextually even if UI windows are completely altered [source: 1]
        }, 60000); // Executed at 60 seconds sharp [source: 1]
    });
});
