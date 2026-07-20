// შეტყობინებების გლობალური კლასი
class ToastSystem {
    constructor() {
        // Creates a container in the DOM if it doesn't already exist.
        if (!document.getElementById("toast-container")) {
            const container = document.createElement("div");
            container.id = "toast-container";
            container.className = "toast-container";
            document.body.appendChild(container);
        }
        this.container = document.getElementById("toast-container");
    }

    show(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${message}</span><button style="background:none;border:none;color:white;cursor:pointer;margin-left:10px;">X</button>`;

        this.container.appendChild(toast);

        // Click the X button to close.
        toast
            .querySelector("button")
            .addEventListener("click", () => toast.remove());

        // Auto-disappears in 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }
}

const toast = new ToastSystem();
