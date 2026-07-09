// ==========================================
// 1. ELEMENT HTML
// ==========================================

const myVoucherGrid =
    document.getElementById("myVoucherGrid");

const emptyVoucher =
    document.getElementById("emptyVoucher");


// ==========================================
// 2. AMBIL VOUCHER DARI LOCALSTORAGE
// ==========================================

function getMyVouchers() {

    try {

        const vouchers = JSON.parse(
            localStorage.getItem("myVouchers")
        ) || [];

        return Array.isArray(vouchers)
            ? vouchers
            : [];

    } catch (error) {

        console.error(
            "Gagal membaca voucher:",
            error
        );

        return [];

    }

}


// ==========================================
// 3. TENTUKAN PATH GAMBAR VOUCHER
// ==========================================

function getVoucherImage(voucher) {

    // Kalau tidak ada data voucher
    if (!voucher) {
        return "/IMG/ML20K.png";
    }


    // ======================================
    // PRIORITAS BERDASARKAN VOUCHER TYPE
    // ======================================

    const voucherImages = {

        // MOBILE LEGENDS
        ML20: "/IMG/ML20K.png",
        ML40: "/IMG/ML40K.png",
        ML60: "/IMG/ML60K.png",

        // GENSHIN IMPACT
        GI20: "/IMG/GI20K.png",
        GI40: "/IMG/GI40K.png",
        GI60: "/IMG/GI60K.png"

    };


    // Cek voucherType
    if (
        voucher.voucherType &&
        voucherImages[voucher.voucherType]
    ) {

        return voucherImages[
            voucher.voucherType
        ];

    }


    // ======================================
    // FALLBACK BERDASARKAN GAME + VALUE
    // ======================================

    const game =
        String(voucher.game || "")
            .toLowerCase()
            .trim();

    const value =
        Number(voucher.value || 0);


    // MOBILE LEGENDS
    if (
        game.includes("mobile legends") ||
        game === "ml"
    ) {

        if (value === 20000) {
            return "/IMG/ML20K.png";
        }

        if (value === 40000) {
            return "/IMG/ML40K.png";
        }

        if (value === 60000) {
            return "/IMG/ML60K.png";
        }

    }


    // GENSHIN IMPACT
    if (
        game.includes("genshin impact") ||
        game.includes("genshin") ||
        game === "gi"
    ) {

        if (value === 20000) {
            return "/IMG/GI20K.png";
        }

        if (value === 40000) {
            return "/IMG/GI40K.png";
        }

        if (value === 60000) {
            return "/IMG/GI60K.png";
        }

    }


    // ======================================
    // FALLBACK DARI voucher.image
    // ======================================

    if (voucher.image) {

        // Kalau sudah path absolut
        if (voucher.image.startsWith("/")) {

            return voucher.image;

        }


        // Kalau hanya nama file
        return "/IMG/" + voucher.image;

    }


    // Default
    return "/IMG/ML20K.png";

}


// ==========================================
// 4. TAMPILKAN VOUCHER
// ==========================================

function displayMyVouchers() {

    const vouchers =
        getMyVouchers();


    if (!myVoucherGrid) {

        console.error(
            "Element #myVoucherGrid tidak ditemukan!"
        );

        return;

    }


    // Kosongkan grid
    myVoucherGrid.innerHTML = "";


    // ======================================
    // JIKA TIDAK ADA VOUCHER
    // ======================================

    if (vouchers.length === 0) {

        if (emptyVoucher) {

            emptyVoucher.style.display =
                "block";

        }

        return;

    }


    // Sembunyikan pesan kosong
    if (emptyVoucher) {

        emptyVoucher.style.display =
            "none";

    }


    // ======================================
    // LOOP SEMUA VOUCHER
    // ======================================

    vouchers.forEach(
        function(voucher) {

            // ----------------------------------
            // CARD
            // ----------------------------------

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "my-voucher-card";


            // Kalau sudah digunakan
            if (voucher.status === "used") {

                card.classList.add("used");

            }


            // ----------------------------------
            // GAMBAR
            // ----------------------------------

            const image =
                document.createElement("img");


            const imagePath =
                getVoucherImage(voucher);


            image.src =
                imagePath;


            image.alt =
                voucher.game ||
                "Voucher";


            // Debug
            console.log(
                "Voucher:",
                voucher
            );

            console.log(
                "Path gambar:",
                imagePath
            );


            // Jika gambar gagal
            image.onerror =
                function() {

                    console.error(
                        "Gambar gagal dimuat:",
                        this.src
                    );

                    this.onerror = null;

                    this.src =
                        "/IMG/ML20K.png";

                };


            // ----------------------------------
            // KODE VOUCHER
            // ----------------------------------

            const code =
                document.createElement(
                    "span"
                );

            code.className =
                "voucher-code";

            code.textContent =
                voucher.code || "-";


            // ----------------------------------
            // STATUS VOUCHER
            // ----------------------------------

            const status =
                document.createElement(
                    "span"
                );

            status.className =
                "voucher-status";


            if (voucher.status === "used") {

                status.textContent =
                    "Sudah Digunakan";

                status.classList.add(
                    "used"
                );

            } else {

                status.textContent =
                    "Aktif";

                status.classList.add(
                    "active"
                );

            }


            // ----------------------------------
            // MASUKKAN KE CARD
            // ----------------------------------

            card.appendChild(image);

            card.appendChild(code);

            card.appendChild(status);


            // ----------------------------------
            // MASUKKAN KE GRID
            // ----------------------------------

            myVoucherGrid.appendChild(
                card
            );

        }
    );

}


// ==========================================
// 5. JALANKAN SETELAH HTML SIAP
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayMyVouchers();

    }
);


// ==========================================
// 6. DEBUG
// ==========================================

console.log(
    "Daftar voucher:",
    getMyVouchers()
);