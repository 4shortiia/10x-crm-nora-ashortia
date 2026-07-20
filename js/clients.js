document.addEventListener("DOMContentLoaded", () => {
    let clientsState = [];
    let activeFilter = "All";
    let currentSelectedClientId = null;

    const container = document.getElementById("clients-container");

    // API loading logic (with error handling)
    async function loadClients() {
        const localData = localStorage.getItem("crm_clients");
        if (localData) {
            clientsState = JSON.parse(localData);
            applyFilters();
            return;
        }

        try {
            container.innerHTML = "Loading clients...";
            const response = await fetch(
                "https://dummyjson.com/users?limit=30",
            );
            if (!response.ok) throw new Error();
            const data = await response.json();
            clientsState = data.users.map((u) => ({
                id: u.id,
                name: `${u.firstName} ${u.lastName}`,
                phone: u.phone,
                email: u.email,
                company: u.company.name,
                image: u.image,
                status: "Lead",
                dealValue: 1000,
                notes: [],
                createdAt: new Date().toISOString(),
            }));
            saveState();
            applyFilters();
        } catch (err) {
            container.innerHTML = `<div>Could not load clients. Check your connection and try again. <button id="retry-btn" class="btn" style="width:auto;">Retry</button></div>`;
            document
                .getElementById("retry-btn")
                .addEventListener("click", loadClients);
        }
    }

    function saveState() {
        localStorage.setItem("crm_clients", JSON.stringify(clientsState));
    }

    // Filter, search, sort (on a copy of the same array)
    function applyFilters() {
        let filtered = [...clientsState];

        if (activeFilter !== "All") {
            filtered = filtered.filter((c) => c.status === activeFilter);
        }

        const query = document
            .getElementById("search-input")
            .value.toLowerCase();
        if (query) {
            filtered = filtered.filter(
                (c) =>
                    c.name.toLowerCase().includes(query) ||
                    c.company.toLowerCase().includes(query),
            );
        }

        const sortBy = document.getElementById("sort-select").value;
        if (sortBy === "Newest") {
            filtered.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            );
        } else if (sortBy === "Name") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "Value") {
            filtered.sort((a, b) => b.dealValue - a.dealValue);
        }

        renderClients(filtered);
    }

    function renderClients(list) {
        container.innerHTML = "";
        if (list.length === 0) {
            container.innerHTML = "<p>No clients found.</p>";
            return;
        }

        list.forEach((c) => {
            const card = document.createElement("div");
            card.className = "stat-card";
            card.style.margin = "10px 0";
            card.style.cursor = "pointer";
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div class="client-info-click" data-id="${c.id}" style="display:flex; gap:15px; align-items:center;">
                        <img src="${c.image}" width="40" height="40" style="border-radius:50%;">
                        <div>
                            <strong>${c.name}</strong> <br>
                            <small>${c.company} | ${c.email}</small> <br>
                            <span style="color:var(--success-color); font-weight:bold;">$${c.dealValue}</span>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <select class="status-change" data-id="${c.id}">
                            <option value="Lead" ${c.status === "Lead" ? "selected" : ""}>Lead</option>
                            <option value="Contacted" ${c.status === "Contacted" ? "selected" : ""}>Contacted</option>
                            <option value="Won" ${c.status === "Won" ? "selected" : ""}>Won</option>
                            <option value="Lost" ${c.status === "Lost" ? "selected" : ""}>Lost</option>
                        </select>
                        <button class="delete-btn btn" data-id="${c.id}" style="background:var(--danger-color); width:auto; padding:5px 10px;">Delete</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        // Delegate events inside the card
        container.querySelectorAll(".client-info-click").forEach((el) => {
            el.addEventListener("click", () =>
                openDetailsModal(el.getAttribute("data-id")),
            );
        });

        container.querySelectorAll(".status-change").forEach((select) => {
            select.addEventListener("change", (e) => {
                const id = parseInt(select.getAttribute("data-id"));
                const client = clientsState.find((c) => c.id === id);
                if (client) {
                    client.status = e.target.value;
                    saveState();
                    applyFilters();
                }
            });
        });

        container.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                e.stopPropagation();
                if (!confirm("Delete this client? This cannot be undone."))
                    return;
                const id = parseInt(btn.getAttribute("data-id"));

                // Dummy server deletion
                await fetch(`https://dummyjson.com/users/${id}`, {
                    method: "DELETE",
                });

                clientsState = clientsState.filter((c) => c.id !== id);
                saveState();
                applyFilters();
                toast.show("Client deleted", "success");
            });
        });
    }

    // --- ADD MODAL LOGIC ---
    const addModal = document.getElementById("add-modal");
    document.getElementById("open-add-modal").addEventListener("click", () => {
        addModal.classList.remove("hidden");
    });
    document.getElementById("close-add-modal").addEventListener("click", () => {
        addModal.classList.add("hidden");
    });

    document
        .getElementById("add-client-form")
        .addEventListener("submit", async (e) => {
            e.preventDefault();
            // Validation code
            const name = document.getElementById("c-name").value.trim();
            const email = document.getElementById("c-email").value.trim();
            const phone = document.getElementById("c-phone").value.trim();
            const company = document.getElementById("c-company").value.trim();
            const val = parseFloat(document.getElementById("c-value").value);

            let error = false;
            if (name.length < 3) {
                document.getElementById("err-c-name").innerText =
                    "Name must be at least 3 characters";
                error = true;
            }
            if (!email.includes("@")) {
                document.getElementById("err-c-email").innerText =
                    "Please enter a valid email address";
                error = true;
            }
            if (clientsState.some((c) => c.email === email)) {
                document.getElementById("err-c-email").innerText =
                    "A client with this email already exists";
                error = true;
            }
            if (phone && phone.length < 6) {
                document.getElementById("err-c-phone").innerText =
                    "Phone number looks too short";
                error = true;
            }
            if (isNaN(val) || val <= 0) {
                document.getElementById("err-c-value").innerText =
                    "Deal value must be a positive number";
                error = true;
            }

            if (error) return;

            // Mock POST request
            const response = await fetch("https://dummyjson.com/users/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName: name, email }),
            });
            const serverData = await response.json();

            const newClient = {
                id: Date.now(), // We use a timestamp for uniqueness
                name,
                email,
                phone,
                company,
                dealValue: val,
                status: document.getElementById("c-status").value,
                image: "https://dummyjson.com/icon/users/128",
                notes: [],
                createdAt: new Date().toISOString(),
            };

            clientsState.unshift(newClient);
            saveState();
            applyFilters();
            addModal.classList.add("hidden");
            document.getElementById("add-client-form").reset();
            toast.show("Client added ✓", "success");
        });

    // --- DETAILS MODAL LOGIC ---
    const detailsModal = document.getElementById("details-modal");
    function openDetailsModal(id) {
        currentSelectedClientId = parseInt(id);
        const client = clientsState.find(
            (c) => c.id === currentSelectedClientId,
        );
        if (!client) return;

        document.getElementById("det-name").innerText = client.name;
        document.getElementById("det-info").innerHTML = `
            Company: ${client.company} <br> Email: ${client.email} <br> Phone: ${client.phone} <br>
            Status: ${client.status} | Value: $${client.dealValue} <br>
            <small>Client since ${new Date(client.createdAt).toLocaleDateString()}</small>
        `;
        renderNotes(client.notes);
        detailsModal.classList.remove("hidden");
    }

    function renderNotes(notes) {
        const list = document.getElementById("notes-list");
        list.innerHTML = "";
        notes.forEach((n) => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${n.date}:</strong> ${n.text}`;
            list.appendChild(li);
        });
    }

    document.getElementById("add-note-btn").addEventListener("click", () => {
        const input = document.getElementById("new-note-input");
        const text = input.value.trim();
        if (!text) return;

        const client = clientsState.find(
            (c) => c.id === currentSelectedClientId,
        );
        client.notes.push({ text, date: new Date().toLocaleString() });
        saveState();
        renderNotes(client.notes);
        input.value = "";
    });

    document.getElementById("remind-btn").addEventListener("click", () => {
        const client = clientsState.find(
            (c) => c.id === currentSelectedClientId,
        );
        toast.show("Reminder set ✓", "success");
        setTimeout(() => {
            toast.show(`⏰ Follow up: ${client.name}`, "error");
        }, 60000); // A message will be sent in 60 seconds
    });

    document
        .getElementById("close-details-modal")
        .addEventListener("click", () => detailsModal.classList.add("hidden"));

    // Bind Toolbar events
    document
        .getElementById("search-input")
        .addEventListener("input", applyFilters);
    document
        .getElementById("sort-select")
        .addEventListener("change", applyFilters);
    document
        .getElementById("filter-chips")
        .querySelectorAll(".chip")
        .forEach((chip) => {
            chip.addEventListener("click", () => {
                document
                    .getElementById("filter-chips")
                    .querySelector(".chip.active")
                    .classList.remove("active");
                chip.classList.add("active");
                activeFilter = chip.getAttribute("data-status");
                applyFilters();
            });
        });

    loadClients();
});
