let toastTimeout: NodeJS.Timeout | null = null;

export function showToast(message: string, x: number, y: number) {
    // Remove existing toast if present
    const existingToast = document.getElementById("toast");
    if (existingToast) {
        existingToast.remove();
    }
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    // Create and show new toast
    const toast = document.createElement("div");
    toast.id = "toast";
    toast.textContent = message;
    toast.className =
        "fixed px-2 py-1 bg-black text-white text-sm rounded-lg shadow-lg opacity-0 transition-opacity duration-200";

    // Add toast to DOM temporarily to get its dimensions
    toast.style.visibility = "hidden";
    document.body.appendChild(toast);
    const { width, height } = toast.getBoundingClientRect();

    // Position toast centered above cursor
    toast.style.left = `${x - width / 2}px`;
    toast.style.top = `${y - height - 10}px`; // 10px gap above cursor
    toast.style.visibility = "visible";

    // Fade in
    requestAnimationFrame(() => {
        toast.style.opacity = "1";
    });

    // Remove after delay
    toastTimeout = setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 200);
    }, 1000);
}
