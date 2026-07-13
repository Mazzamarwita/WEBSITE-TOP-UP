// ======================================
// AUTH USER
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    const currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    const navbarUser =
        document.getElementById("navbarUser");

    if (!navbarUser) return;

    // Belum login
    if (!currentUser) {

        navbarUser.innerHTML = `

            <button class="btn-register"
                onclick="window.location.href='REGISTER.html'">
                Daftar
            </button>

            <button class="btn-login"
                onclick="window.location.href='LOGIN.html'">
                Masuk
            </button>

        `;

        return;
    }

    // Sudah login
    const initial =
        currentUser.nama.charAt(0).toUpperCase();

    navbarUser.innerHTML = `

        <div class="profile-menu" id="profileMenu">

            <div class="profile-avatar">

                ${initial}

            </div>

            <span class="profile-name">

                ${currentUser.nama}

            </span>

            <i class='bx bx-chevron-down'></i>

        </div>

    `;

});