// ==========================================
// 1. ELEMENT HTML
// ==========================================

const myVoucherGrid =
    document.getElementById(
        "myVoucherGrid"
    );

const emptyVoucher =
    document.getElementById(
        "emptyVoucher"
    );


// ==========================================
// 2. AMBIL VOUCHER
// ==========================================

function getMyVouchers() {

    try {

        const vouchers =
            JSON.parse(
                localStorage.getItem(
                    "myVouchers"
                )
            ) || [];


        return Array.isArray(vouchers)
            ? vouchers
            : [];

    } catch (error) {

        return [];

    }

}


// ==========================================
// 3. TAMPILKAN VOUCHER
// ==========================================

function displayMyVouchers() {

    const vouchers =
        getMyVouchers();


    if (!myVoucherGrid) {
        return;
    }


    myVoucherGrid.innerHTML = "";


    // Tidak ada voucher
    if (vouchers.length === 0) {

        if (emptyVoucher) {

            emptyVoucher.style.display =
                "block";

        }

        return;

    }


    if (emptyVoucher) {

        emptyVoucher.style.display =
            "none";

    }


    // Tampilkan semua voucher
    vouchers.forEach(
        function(voucher) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "my-voucher-card";


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                voucher.image;


            image.alt =
                voucher.game ||
                "Voucher";


            const code =
                document.createElement(
                    "span"
                );


            code.className =
                "voucher-code";


            code.textContent =
                voucher.code;


            card.appendChild(
                image
            );


            card.appendChild(
                code
            );


            myVoucherGrid.appendChild(
                card
            );

        }
    );

}


// ==========================================
// 4. JALANKAN
// ==========================================

displayMyVouchers();


// ==========================================
// 5. DEBUG
// ==========================================

console.log(
    "Daftar voucher:",
    getMyVouchers()
);