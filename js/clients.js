// clients.js — wires the clients page up to the mock API in api.js

const statusLabel = { new: "New", active: "Active", paused: "Paused" };

function rowHtml(client) {
    return `
    <tr data-id="${client.id}">
      <td>${client.name}</td>
      <td>${client.company}</td>
      <td>${client.value || "—"}</td>
      <td><span class="status ${client.status}">${statusLabel[client.status]}</span></td>
      <td><button class="del-btn" onclick="removeClient(${client.id})">Delete</button></td>
    </tr>`;
}

function renderClients(list) {
    const tbody = document.getElementById("client-rows");
    if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">No clients yet — add your first one.</div></td></tr>`;
        return;
    }
    tbody.innerHTML = list.map(rowHtml).join("");
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

function removeClient(id) {
    if (!confirm("Remove this client?")) return;
    apiDeleteClient(id).then((list) => {
        showToast("Client removed", "success");
        renderClients(list);
    });
}

document.addEventListener("DOMContentLoaded", loadClients);
