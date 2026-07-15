/* Element HTML */
const myVoucherGrid =
    document.getElementById("myVoucherGrid");

const emptyVoucher =
    document.getElementById("emptyVoucher");


/* Mengambil data voucher dari Local Storage */
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


/* Menentukan gambar voucher */
function getVoucherImage(voucher) {

    if (!voucher) {
        return "/IMG/ML20K.png";
    }

    const voucherImages = {

        ML20: "/IMG/ML20K.png",
        ML40: "/IMG/ML40K.png",
        ML60: "/IMG/ML60K.png",

        GI20: "/IMG/GI20K.png",
        GI40: "/IMG/GI40K.png",
        GI60: "/IMG/GI60K.png"

    };

    if (
        voucher.voucherType &&
        voucherImages[voucher.voucherType]
    ) {

        return voucherImages[
            voucher.voucherType
        ];

    }

    const game =
        String(voucher.game || "")
            .toLowerCase()
            .trim();

    const value =
        Number(voucher.value || 0);

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

    if (voucher.image) {

        if (voucher.image.startsWith("/")) {
            return voucher.image;
        }

        return "/IMG/" + voucher.image;

    }

    return "/IMG/ML20K.png";

}


/* Menampilkan daftar voucher */
function displayMyVouchers() {

    const vouchers =
        getMyVouchers();

    if (!myVoucherGrid) {

        console.error(
            "Element #myVoucherGrid tidak ditemukan!"
        );

        return;

    }

    myVoucherGrid.innerHTML = "";

    if (vouchers.length === 0) {

        if (emptyVoucher) {
            emptyVoucher.style.display = "block";
        }

        return;

    }

    if (emptyVoucher) {
        emptyVoucher.style.display = "none";
    }

    vouchers.forEach(
        function(voucher) {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "my-voucher-card";

            if (voucher.status === "used") {
                card.classList.add("used");
            }

            const image =
                document.createElement("img");

            const imagePath =
                getVoucherImage(voucher);

            image.src = imagePath;

            image.alt =
                voucher.game ||
                "Voucher";

            console.log(
                "Voucher:",
                voucher
            );

            console.log(
                "Path gambar:",
                imagePath
            );

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

            const code =
                document.createElement(
                    "span"
                );

            code.className =
                "voucher-code";

            code.textContent =
                voucher.code || "-";

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

            card.appendChild(image);
            card.appendChild(code);
            card.appendChild(status);

            myVoucherGrid.appendChild(
                card
            );

        }
    );

}


/* Menjalankan fungsi saat halaman selesai dimuat */
document.addEventListener(
    "DOMContentLoaded",
    function() {
        displayMyVouchers();
    }
);


/* Debug */
console.log(
    "Daftar voucher:",
    getMyVouchers()
);