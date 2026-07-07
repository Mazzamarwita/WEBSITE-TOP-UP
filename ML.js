// ==========================================
// 1. DATA AWAL
// ==========================================

let selectedItem = null;

const adminFee = 193;


// Saldo awal
let balances = {
    GoPay:
        localStorage.getItem("saldoGoPay") !== null
            ? Number(localStorage.getItem("saldoGoPay"))
            : 500000,

    DANA:
        localStorage.getItem("saldoDANA") !== null
            ? Number(localStorage.getItem("saldoDANA"))
            : 500000
};


// ==========================================
// 2. AMBIL ELEMENT HTML
// ==========================================

// Produk
const productCards =
    document.querySelectorAll(".product-card");

// Input
const userId =
    document.getElementById("userId");

const serverId =
    document.getElementById("serverId");

const voucherCode =
    document.getElementById("voucherCode");

// Payment
const paymentMethods =
    document.querySelectorAll(
        'input[name="payment"]'
    );

// Tombol bayar
const payButton =
    document.getElementById("payButton");


// ==========================================
// 3. DETAIL TRANSAKSI
// ==========================================

const detailItem =
    document.getElementById("detailItem");

const detailUserId =
    document.getElementById("detailUserId");

const detailServer =
    document.getElementById("detailServer");

const detailPayment =
    document.getElementById("detailPayment");

const detailPrice =
    document.getElementById("detailPrice");

const detailFee =
    document.getElementById("detailFee");

const detailTotal =
    document.getElementById("detailTotal");

const detailPoint =
    document.getElementById("detailPoint");


// ==========================================
// 4. SALDO
// ==========================================

const saldoGopay =
    document.getElementById("saldoGopay");

const saldoDana =
    document.getElementById("saldoDana");


// ==========================================
// 5. MODAL
// ==========================================

const paymentModal =
    document.getElementById("paymentModal");

const closeModalButton =
    document.getElementById("closeModalButton");

const continuePaymentButton =
    document.getElementById("continuePaymentButton");


// Isi modal
const confirmUserId =
    document.getElementById("confirmUserId");

const confirmProduct =
    document.getElementById("confirmProduct");

const confirmPrice =
    document.getElementById("confirmPrice");

const confirmFee =
    document.getElementById("confirmFee");

const confirmPayment =
    document.getElementById("confirmPayment");

const confirmTotal =
    document.getElementById("confirmTotal");

const confirmPoint =
    document.getElementById("confirmPoint");


// ==========================================
// 6. FORMAT RUPIAH
// ==========================================

function formatRupiah(number) {

    return "Rp" +
        Number(number).toLocaleString("id-ID");

}


// ==========================================
// 7. UPDATE SALDO
// ==========================================

function updateBalanceDisplay() {

    if (saldoGopay) {
        saldoGopay.textContent =
            formatRupiah(balances.GoPay);
    }

    if (saldoDana) {
        saldoDana.textContent =
            formatRupiah(balances.DANA);
    }

}

updateBalanceDisplay();


// ==========================================
// 8. PILIH ITEM / DIAMOND
// ==========================================

productCards.forEach(function(card) {

    card.addEventListener(
        "click",
        function() {

            // Hapus selected semua item
            productCards.forEach(
                function(item) {

                    item.classList.remove(
                        "selected"
                    );

                }
            );


            // Tambahkan selected
            card.classList.add(
                "selected"
            );


            // Ambil data produk
            selectedItem = {

                name:
                    card.getAttribute(
                        "data-item"
                    ),

                price:
                    Number(
                        card.getAttribute(
                            "data-price"
                        )
                    ),

                point:
                    Number(
                        card.getAttribute(
                            "data-point"
                        )
                    )

            };


            console.log(
                "Item dipilih:",
                selectedItem
            );


            // Update detail
            updateTransactionDetail();

        }
    );

});


// ==========================================
// 9. INPUT ID
// ==========================================

if (userId) {

    userId.addEventListener(
        "input",
        updateTransactionDetail
    );

}


// ==========================================
// 10. INPUT SERVER
// ==========================================

if (serverId) {

    serverId.addEventListener(
        "input",
        updateTransactionDetail
    );

}


// ==========================================
// 11. PILIH PAYMENT
// ==========================================

paymentMethods.forEach(
    function(payment) {

        payment.addEventListener(
            "change",
            updateTransactionDetail
        );

    }
);


// ==========================================
// 12. UPDATE DETAIL TRANSAKSI
// ==========================================

function updateTransactionDetail() {

    // -------------------------
    // ID
    // -------------------------

    if (detailUserId && userId) {

        detailUserId.textContent =
            userId.value.trim() || "-";

    }


    // -------------------------
    // SERVER
    // -------------------------

    if (detailServer && serverId) {

        detailServer.textContent =
            serverId.value.trim() || "-";

    }


    // -------------------------
    // PAYMENT
    // -------------------------

    const selectedPayment =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    if (detailPayment) {

        detailPayment.textContent =
            selectedPayment
                ? selectedPayment.value
                : "-";

    }


    // -------------------------
    // BELUM PILIH ITEM
    // -------------------------

    if (!selectedItem) {

        if (detailItem) {
            detailItem.textContent =
                "Belum memilih item";
        }

        if (detailPrice) {
            detailPrice.textContent =
                "Rp0";
        }

        if (detailFee) {
            detailFee.textContent =
                "Rp0";
        }

        if (detailTotal) {
            detailTotal.textContent =
                "Rp0";
        }

        if (detailPoint) {
            detailPoint.textContent =
                "+0 Poin";
        }

        return;
    }


    // -------------------------
    // HITUNG TOTAL
    // -------------------------

    const total =
        selectedItem.price +
        adminFee;


    // -------------------------
    // TAMPILKAN ITEM
    // -------------------------

    if (detailItem) {

        detailItem.textContent =
            selectedItem.name;

    }


    // -------------------------
    // HARGA
    // -------------------------

    if (detailPrice) {

        detailPrice.textContent =
            formatRupiah(
                selectedItem.price
            );

    }


    // -------------------------
    // BIAYA
    // -------------------------

    if (detailFee) {

        detailFee.textContent =
            formatRupiah(
                adminFee
            );

    }


    // -------------------------
    // TOTAL
    // -------------------------

    if (detailTotal) {

        detailTotal.textContent =
            formatRupiah(
                total
            );

    }


    // -------------------------
    // POINT
    // -------------------------

    if (detailPoint) {

        detailPoint.textContent =
            "+" +
            selectedItem.point +
            " Poin";

    }

}


// ==========================================
// 13. KLIK BAYAR SEKARANG
// ==========================================

if (payButton) {

    payButton.addEventListener(
        "click",
        function() {

            // Cek item
            if (!selectedItem) {

                alert(
                    "Silakan pilih item terlebih dahulu!"
                );

                return;
            }


            // Cek ID
            if (
                !userId ||
                userId.value.trim() === ""
            ) {

                alert(
                    "Silakan masukkan ID Mobile Legends!"
                );

                if (userId) {
                    userId.focus();
                }

                return;
            }


            // Cek server
            if (
                !serverId ||
                serverId.value.trim() === ""
            ) {

                alert(
                    "Silakan masukkan Server!"
                );

                if (serverId) {
                    serverId.focus();
                }

                return;
            }


            // Ambil payment
            const selectedPayment =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            // Cek payment
            if (!selectedPayment) {

                alert(
                    "Silakan pilih metode pembayaran!"
                );

                return;
            }


            const paymentName =
                selectedPayment.value;


            const total =
                selectedItem.price +
                adminFee;


            // Cek saldo
            if (
                balances[paymentName] < total
            ) {

                alert(
                    "Saldo " +
                    paymentName +
                    " tidak mencukupi!"
                );

                return;
            }


            // ==================================
            // ISI MODAL KONFIRMASI
            // ==================================

            if (confirmUserId) {

                confirmUserId.textContent =
                    userId.value.trim() +
                    " (" +
                    serverId.value.trim() +
                    ")";

            }


            if (confirmProduct) {

                confirmProduct.textContent =
                    selectedItem.name;

            }


            if (confirmPrice) {

                confirmPrice.textContent =
                    formatRupiah(
                        selectedItem.price
                    );

            }


            if (confirmFee) {

                confirmFee.textContent =
                    formatRupiah(
                        adminFee
                    );

            }


            if (confirmPayment) {

                confirmPayment.textContent =
                    paymentName;

            }


            if (confirmTotal) {

                confirmTotal.textContent =
                    formatRupiah(total);

            }


            if (confirmPoint) {

                confirmPoint.textContent =
                    "+" +
                    selectedItem.point +
                    " Poin";

            }


            // Buka modal
            if (paymentModal) {

                paymentModal.classList.add(
                    "active"
                );

            } else {

                alert(
                    "Modal pembayaran tidak ditemukan!"
                );

            }

        }
    );

}


// ==========================================
// 14. TUTUP MODAL
// ==========================================

if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        function() {

            paymentModal.classList.remove(
                "active"
            );

        }
    );

}


// Klik area gelap
if (paymentModal) {

    paymentModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === paymentModal
            ) {

                paymentModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ==========================================
// 15. LANJUTKAN PEMBAYARAN
// ==========================================

if (continuePaymentButton) {

    continuePaymentButton.addEventListener(
        "click",
        function() {

            // Ambil payment
            const selectedPayment =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            if (
                !selectedPayment ||
                !selectedItem
            ) {

                return;
            }


            const paymentName =
                selectedPayment.value;


            const total =
                selectedItem.price +
                adminFee;


            // Cek saldo
            if (
                balances[paymentName] < total
            ) {

                alert(
                    "Saldo tidak mencukupi!"
                );

                return;
            }


            // ==================================
            // POTONG SALDO
            // ==================================

            balances[paymentName] -= total;


            // ==================================
            // SIMPAN SALDO
            // ==================================

            localStorage.setItem(
                "saldoGoPay",
                balances.GoPay
            );

            localStorage.setItem(
                "saldoDANA",
                balances.DANA
            );


            // ==================================
            // NOMOR TRANSAKSI
            // ==================================

            const transactionNumber =
                "#P" + Date.now();


            // ==================================
            // DATA TRANSAKSI
            // ==================================

            const transactionData = {

                game:
                    "Mobile Legends",

                product:
                    selectedItem.name,

                userId:
                    userId.value.trim(),

                server:
                    serverId.value.trim(),

                userIdFull:
                    userId.value.trim() +
                    " (" +
                    serverId.value.trim() +
                    ")",

                jumlah:
                    1,

                harga:
                    selectedItem.price,

                biaya:
                    adminFee,

                total:
                    total,

                payment:
                    paymentName,

                point:
                    selectedItem.point,

                transactionNumber:
                    transactionNumber,

                transactionTime:
                    new Date().toISOString(),

                status:
                    "processing"

            };


            // ==================================
            // SIMPAN TRANSAKSI
            // ==================================

            localStorage.setItem(
                "currentTransaction",
                JSON.stringify(
                    transactionData
                )
            );


            // ==================================
            // PINDAH HALAMAN
            // ==================================

            window.location.href =
                "pembayaran.html";

        }
    );

}


// ==========================================
// 16. CEK KONEKSI HTML
// ==========================================

console.log(
    "Jumlah produk ditemukan:",
    productCards.length
);

console.log(
    "Input ID:",
    userId
);

console.log(
    "Input Server:",
    serverId
);