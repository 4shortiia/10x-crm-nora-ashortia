// clients.js — wires the clients page up to the mock API in api.js

const statusLabel = { new: "New", active: "Active", paused: "Paused" };
let currentModalClientId = null;

function rowHtml(client) {
    return `
    <tr data-id="${client.id}" style="cursor: pointer;">
      <td>${client.name}</td>
      <td>${client.company}</td>
      <td>${client.value || "—"}</td>
      <td>
        <select class="status-select ${client.status}" onchange="updateClientStatus(event, ${client.id})">
          <option value="new" ${client.status === "new" ? "selected" : ""}>New</option>
          <option value="active" ${client.status === "active" ? "selected" : ""}>Active</option>
          <option value="paused" ${client.status === "paused" ? "selected" : ""}>Paused</option>
        </select>
      </td>
      <td><button class="del-btn" onclick="removeClient(event, ${client.id})">Delete</button></td>
    </tr>`;
}

function renderClients(list) {
    const tbody = document.getElementById("client-rows");
    if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">No clients yet — add your first one.</div></td></tr>`;
        return;
    }
    tbody.innerHTML = list.map(rowHtml).join("");

    // Bind clicking on rows to open a modal (unless we click on delete or select)
    tbody.querySelectorAll("tr").forEach((tr, index) => {
        tr.addEventListener("click", (e) => {
            if (e.target.closest(".del-btn") || e.target.closest("select"))
                return;
            openClientModal(list[index].id);
        });
    });
}

function loadClients() {
    const tbody = document.getElementById("client-rows");
    tbody.innerHTML = `<tr><td colspan="5"><div class="loading-state">Loading clients…</div></td></tr>`;
    apiGetClients().then(renderClients);
}

function addClient(event) {
    event.preventDefault();
    const name = document.getElementById("in-name").value.trim();
    const company = document.getElementById("in-company").value.trim();
    const value = document.getElementById("in-value").value.trim();
    const status = document.getElementById("in-status").value;

    if (!name || !company) {
        showToast("Name and company are required", "error");
        return;
    }

    const btn = document.getElementById("add-btn");
    btn.disabled = true;
    btn.textContent = "Adding…";

    apiAddClient({ name, company, value, status }).then(() => {
        showToast("Client added", "success");
        document.getElementById("in-name").value = "";
        document.getElementById("in-company").value = "";
        document.getElementById("in-value").value = "";
        btn.disabled = false;
        btn.textContent = "Add client";
        loadClients();
    });
}

function removeClient(event, id) {
    event.stopPropagation();
    if (!confirm("Remove this client?")) return;
    apiDeleteClient(id).then((list) => {
        showToast("Client removed", "success");
        renderClients(list);
    });
}

function updateClientStatus(event, id) {
    event.stopPropagation();
    const newStatus = event.target.value;

    // Updating the data in localStorage
    const clients = JSON.parse(localStorage.getItem("crm_clients")) || [];
    const client = clients.find((c) => c.id == id);
    if (client) {
        client.status = newStatus;
        localStorage.setItem("crm_clients", JSON.stringify(clients));
        showToast("Status updated", "success");
        loadClients();
    }
}

// Modal & Notes Logic
function openClientModal(clientId) {
    const clients = JSON.parse(localStorage.getItem("crm_clients")) || [];
    const client = clients.find((c) => c.id == clientId);
    if (!client) return;

    currentModalClientId = client.id;

    document.getElementById("m-name").textContent = client.name || "—";
    document.getElementById("m-company").textContent = client.company || "—";
    document.getElementById("m-email").textContent =
        client.email || "client@example.com";
    document.getElementById("m-phone").textContent =
        client.phone || "+1 000-000-0000";
    document.getElementById("m-value").textContent = client.value || "—";
    document.getElementById("m-inducted").textContent =
        client.inducted || new Date().toLocaleDateString();
    document.getElementById("m-avatar").textContent = (client.name || "C")
        .slice(0, 2)
        .toUpperCase();

    renderNotes(client.notes || []);

    document.getElementById("client-modal").classList.remove("hidden");
}

function closeClientModal() {
    document.getElementById("client-modal").classList.add("hidden");
    currentModalClientId = null;
}

function renderNotes(notes) {
    const list = document.getElementById("m-notes-list");
    if (!list) return;

    if (!notes.length) {
        list.innerHTML =
            '<div class="empty-notes" style="color:var(--muted); font-size:13px; text-align:center; padding:15px;">No notes yet.</div>';
        return;
    }

    list.innerHTML = notes
        .map(
            (n) => `
        <div class="note-item" style="background:var(--panel); padding:8px 12px; border-radius:8px; margin-bottom:8px; border:1px solid var(--line);">
            <span class="note-date" style="display:block; font-size:11px; color:var(--muted);">${n.date}</span>
            <span style="font-size:13px;">${n.text}</span>
        </div>
    `,
        )
        .join("");
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    loadClients();

    // Close with X button and click on modal background
    document
        .getElementById("close-modal")
        ?.addEventListener("click", closeClientModal);
    document.getElementById("client-modal")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) closeClientModal();
    });

    // Add Note
    document.getElementById("m-add-note")?.addEventListener("click", () => {
        const input = document.getElementById("m-new-note");
        if (!input || !input.value.trim() || !currentModalClientId) return;

        const clients = JSON.parse(localStorage.getItem("crm_clients")) || [];
        const client = clients.find((c) => c.id == currentModalClientId);

        if (client) {
            if (!client.notes) client.notes = [];
            client.notes.push({
                text: input.value.trim(),
                date: new Date().toLocaleString(),
            });

            localStorage.setItem("crm_clients", JSON.stringify(clients));
            renderNotes(client.notes);
            input.value = "";
            showToast("Note added", "success");
        }
    });

    // Reminder Button
    document.getElementById("m-remind")?.addEventListener("click", () => {
        showToast("Reminder set for 1 minute.", "success");
        const clientName =
            document.getElementById("m-name")?.textContent || "Client";
        setTimeout(() => {
            showToast(`⏰ REMINDER: Follow up with ${clientName}!`, "success");
        }, 60000);
    });
});
