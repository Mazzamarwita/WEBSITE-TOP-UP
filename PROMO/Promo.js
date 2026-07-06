document.addEventListener("DOMContentLoaded", function() {

    // =========================
    // SIDEBAR
    // =========================

    const menuBtn = document.querySelector(".menu-btn");
    const sidebar = document.querySelector(".sidebar");
    const closeSidebar = document.querySelector(".close-sidebar");
    const sidebarOverlay = document.querySelector(".sidebar-overlay");

    // Buka Sidebar
    if (menuBtn && sidebar && sidebarOverlay) {
        menuBtn.addEventListener("click", function() {
            sidebar.classList.add("active");
            sidebarOverlay.classList.add("active");
        });
    }

    // Tutup Sidebar dari tombol X
    if (closeSidebar && sidebar && sidebarOverlay) {
        closeSidebar.addEventListener("click", function() {
            sidebar.classList.remove("active");
            sidebarOverlay.classList.remove("active");
        });
    }

    // Tutup Sidebar dari Overlay
    if (sidebarOverlay && sidebar) {
        sidebarOverlay.addEventListener("click", function() {
            sidebar.classList.remove("active");
            sidebarOverlay.classList.remove("active");
        });
    }

});