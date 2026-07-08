// ==========================================
// 1. DATA AWAL
// ==========================================

let selectedItem = null;
let isProcessingPayment = false;

const adminFee = 193;


// ==========================================
// 2. IDENTITAS GAME
// ==========================================

const GAME_CONFIG = {

    name:
        document.body.dataset.game ||
        "Honkai: Star Rail",

    code:
        document.body.dataset.gameCode ||
        "HSR",

    icon:
        document.body.dataset.gameIcon ||
        "img/HSRicon.png"

};


// ==========================================
// 3. SALDO AWAL
// ==========================================

let balances = {

    GoPay:
        localStorage.getItem("saldoGoPay") !== null
            ? Number(
                localStorage.getItem("saldoGoPay")
            )
            : 500000,

    DANA:
        localStorage.getItem("saldoDANA") !== null
            ? Number(
                localStorage.getItem("saldoDANA")
            )
            : 500000

};


// ==========================================
// 4. AMBIL ELEMENT HTML
// ==========================================

// Produk
const productCards =
    document.querySelectorAll(
        ".product-card"
    );


// Input UID
const userId =
    document.getElementById(
        "userId"
    );


// Input Server
const serverId =
    document.getElementById(
        "serverId"
    );


// Voucher
const voucherCode =
    document.getElementById(
        "voucherCode"
    );


// Tombol voucher
const voucherAction =
    document.querySelector(
        ".voucher-action"
    );


// Payment
const paymentMethods =
    document.querySelectorAll(
        'input[name="payment"]'
    );


// Tombol bayar
const payButton =
    document.getElementById(
        "payButton"
    );


// Nama game pada detail transaksi
const transactionGameName =
    document.getElementById(
        "transactionGameName"
    );


// ==========================================
// 5. DETAIL TRANSAKSI
// ==========================================

const detailItem =
    document.getElementById(
        "detailItem"
    );

const detailUserId =
    document.getElementById(
        "detailUserId"
    );

const detailServer =
    document.getElementById(
        "detailServer"
    );

const detailPayment =
    document.getElementById(
        "detailPayment"
    );

const detailPrice =
    document.getElementById(
        "detailPrice"
    );

const detailFee =
    document.getElementById(
        "detailFee"
    );

const detailTotal =
    document.getElementById(
        "detailTotal"
    );

const detailPoint =
    document.getElementById(
        "detailPoint"
    );


// ==========================================
// 6. SALDO
// ==========================================

const saldoGopay =
    document.getElementById(
        "saldoGopay"
    );

const saldoDana =
    document.getElementById(
        "saldoDana"
    );


// ==========================================
// 7. MODAL
// ==========================================

const paymentModal =
    document.getElementById(
        "paymentModal"
    );

const closeModalButton =
    document.getElementById(
        "closeModalButton"
    );

const continuePaymentButton =
    document.getElementById(
        "continuePaymentButton"
    );


// ==========================================
// 8. ISI MODAL
// ==========================================

const confirmUserId =
    document.getElementById(
        "confirmUserId"
    );

const confirmProduct =
    document.getElementById(
        "confirmProduct"
    );

const confirmPrice =
    document.getElementById(
        "confirmPrice"
    );

const confirmFee =
    document.getElementById(
        "confirmFee"
    );

const confirmPayment =
    document.getElementById(
        "confirmPayment"
    );

const confirmTotal =
    document.getElementById(
        "confirmTotal"
    );

const confirmPoint =
    document.getElementById(
        "confirmPoint"
    );


// ==========================================
// 9. FORMAT RUPIAH
// ==========================================

function formatRupiah(number) {

    return "Rp" +
        Number(number || 0)
            .toLocaleString("id-ID");

}


// ==========================================
// 10. AMBIL NILAI SERVER
// ==========================================

function getServerValue() {

    if (!serverId) {
        return "";
    }

    return serverId.value.trim();

}


// ==========================================
// 11. BUAT UID LENGKAP
// ==========================================

function getFullUserId() {

    const idValue =
        userId
            ? userId.value.trim()
            : "";

    const serverValue =
        getServerValue();


    if (serverValue !== "") {

        return (
            idValue +
            " (" +
            serverValue +
            ")"
        );

    }


    return idValue;

}


// ==========================================
// 12. UPDATE SALDO
// ==========================================

function updateBalanceDisplay() {

    if (saldoGopay) {

        saldoGopay.textContent =
            formatRupiah(
                balances.GoPay
            );

    }


    if (saldoDana) {

        saldoDana.textContent =
            formatRupiah(
                balances.DANA
            );

    }

}


// ==========================================
// 13. SIMPAN SALDO
// ==========================================

function saveBalances() {

    localStorage.setItem(
        "saldoGoPay",
        String(balances.GoPay)
    );


    localStorage.setItem(
        "saldoDANA",
        String(balances.DANA)
    );

}


// ==========================================
// 14. TAMPILKAN NAMA GAME
// ==========================================

function displayGameName() {

    if (transactionGameName) {

        transactionGameName.textContent =
            GAME_CONFIG.name.toUpperCase();

    }

}


// Jalankan awal
updateBalanceDisplay();
displayGameName();


// ==========================================
// 15. PILIH ITEM
// ==========================================

productCards.forEach(
    function(card) {

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
                        ) || "Produk",

                    price:
                        Number(
                            card.getAttribute(
                                "data-price"
                            ) || 0
                        ),

                    point:
                        Number(
                            card.getAttribute(
                                "data-point"
                            ) || 0
                        )

                };


                console.log(
                    "Item HSR dipilih:",
                    selectedItem
                );


                updateTransactionDetail();

            }
        );

    }
);


// ==========================================
// 16. INPUT UID
// ==========================================

if (userId) {

    userId.addEventListener(
        "input",
        updateTransactionDetail
    );

}


// ==========================================
// 17. INPUT SERVER
// ==========================================

if (serverId) {

    serverId.addEventListener(
        "input",
        updateTransactionDetail
    );

}


// ==========================================
// 18. PILIH PAYMENT
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
// 19. UPDATE DETAIL TRANSAKSI
// ==========================================

function updateTransactionDetail() {

    // ======================================
    // UID
    // ======================================

    if (
        detailUserId &&
        userId
    ) {

        detailUserId.textContent =
            userId.value.trim() ||
            "-";

    }


    // ======================================
    // SERVER
    // ======================================

    if (detailServer) {

        const serverValue =
            getServerValue();

        detailServer.textContent =
            serverValue || "-";

    }


    // ======================================
    // PAYMENT
    // ======================================

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


    // ======================================
    // BELUM PILIH ITEM
    // ======================================

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


    // ======================================
    // HITUNG TOTAL
    // ======================================

    const total =
        selectedItem.price +
        adminFee;


    // ======================================
    // ITEM
    // ======================================

    if (detailItem) {

        detailItem.textContent =
            selectedItem.name;

    }


    // ======================================
    // HARGA
    // ======================================

    if (detailPrice) {

        detailPrice.textContent =
            formatRupiah(
                selectedItem.price
            );

    }


    // ======================================
    // BIAYA ADMIN
    // ======================================

    if (detailFee) {

        detailFee.textContent =
            formatRupiah(
                adminFee
            );

    }


    // ======================================
    // TOTAL
    // ======================================

    if (detailTotal) {

        detailTotal.textContent =
            formatRupiah(
                total
            );

    }


    // ======================================
    // POINT
    // ======================================

    if (detailPoint) {

        detailPoint.textContent =
            "+" +
            selectedItem.point +
            " Poin";

    }

}


// ==========================================
// 20. KLIK BAYAR SEKARANG
// ==========================================

if (payButton) {

    payButton.addEventListener(
        "click",
        function() {

            // ==================================
            // CEK ITEM
            // ==================================

            if (!selectedItem) {

                alert(
                    "Silakan pilih item terlebih dahulu!"
                );

                return;

            }


            // ==================================
            // CEK UID
            // ==================================

            if (
                !userId ||
                userId.value.trim() === ""
            ) {

                alert(
                    "Silakan masukkan UID Honkai: Star Rail!"
                );


                if (userId) {

                    userId.focus();

                }


                return;

            }


            // ==================================
            // CEK SERVER
            // ==================================

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


            // ==================================
            // AMBIL PAYMENT
            // ==================================

            const selectedPayment =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            // ==================================
            // CEK PAYMENT
            // ==================================

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


            // ==================================
            // CEK PAYMENT VALID
            // ==================================

            if (
                balances[paymentName] ===
                undefined
            ) {

                alert(
                    "Metode pembayaran tidak valid!"
                );

                return;

            }


            // ==================================
            // CEK SALDO
            // ==================================

            if (
                balances[paymentName] <
                total
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
                    getFullUserId();

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
                    formatRupiah(
                        total
                    );

            }


            if (confirmPoint) {

                confirmPoint.textContent =
                    "+" +
                    selectedItem.point +
                    " Poin";

            }


            // ==================================
            // BUKA MODAL
            // ==================================

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
// 21. TUTUP MODAL
// ==========================================

if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        function() {

            if (paymentModal) {

                paymentModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ==========================================
// 22. KLIK AREA GELAP
// ==========================================

if (paymentModal) {

    paymentModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                paymentModal
            ) {

                paymentModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ==========================================
// 23. GENERATE NOMOR TRANSAKSI
// ==========================================

function generateTransactionNumber() {

    const randomNumber =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return (
        "#P" +
        Date.now() +
        randomNumber
    );

}


// ==========================================
// 24. SIMPAN / UPDATE RIWAYAT
// ==========================================

function saveTransactionToHistory(
    transactionData
) {

    let transactionHistory = [];


    try {

        transactionHistory =
            JSON.parse(
                localStorage.getItem(
                    "transactionHistory"
                )
            ) || [];

    } catch (error) {

        transactionHistory = [];

    }


    // Pastikan array
    if (
        !Array.isArray(
            transactionHistory
        )
    ) {

        transactionHistory = [];

    }


    // Cari transaksi yang sama
    const existingIndex =
        transactionHistory.findIndex(
            function(transaction) {

                return (
                    transaction.transactionNumber ===
                    transactionData.transactionNumber
                );

            }
        );


    // Kalau belum ada
    if (existingIndex === -1) {

        transactionHistory.unshift({
            ...transactionData
        });

    }

    // Kalau sudah ada
    else {

        transactionHistory[existingIndex] = {
            ...transactionData
        };

    }


    // Simpan history gabungan
    localStorage.setItem(
        "transactionHistory",
        JSON.stringify(
            transactionHistory
        )
    );

}


// ==========================================
// 25. LANJUTKAN PEMBAYARAN
// ==========================================

if (continuePaymentButton) {

    continuePaymentButton.addEventListener(
        "click",
        function() {

            // ==================================
            // CEGAH DOUBLE CLICK
            // ==================================

            if (isProcessingPayment) {

                return;

            }


            isProcessingPayment = true;


            continuePaymentButton.disabled =
                true;


            // ==================================
            // AMBIL PAYMENT
            // ==================================

            const selectedPayment =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            // ==================================
            // VALIDASI DATA
            // ==================================

            if (
                !selectedPayment ||
                !selectedItem ||
                !userId ||
                userId.value.trim() === "" ||
                !serverId ||
                serverId.value.trim() === ""
            ) {

                isProcessingPayment =
                    false;

                continuePaymentButton.disabled =
                    false;

                return;

            }


            const paymentName =
                selectedPayment.value;


            const total =
                selectedItem.price +
                adminFee;


            // ==================================
            // CEK PAYMENT VALID
            // ==================================

            if (
                balances[paymentName] ===
                undefined
            ) {

                alert(
                    "Metode pembayaran tidak valid!"
                );


                isProcessingPayment =
                    false;

                continuePaymentButton.disabled =
                    false;

                return;

            }


            // ==================================
            // CEK SALDO
            // ==================================

            if (
                balances[paymentName] <
                total
            ) {

                alert(
                    "Saldo tidak mencukupi!"
                );


                isProcessingPayment =
                    false;

                continuePaymentButton.disabled =
                    false;

                return;

            }


            // ==================================
            // WAKTU TRANSAKSI
            // ==================================

            const transactionTime =
                new Date().toISOString();


            // ==================================
            // NOMOR TRANSAKSI
            // ==================================

            const transactionNumber =
                generateTransactionNumber();


            // ==================================
            // SERVER
            // ==================================

            const serverValue =
                getServerValue();


            // ==================================
            // DATA TRANSAKSI
            // ==================================

            const transactionData = {

                // ------------------------------
                // IDENTITAS GAME
                // ------------------------------

                game:
                    GAME_CONFIG.name,

                gameCode:
                    GAME_CONFIG.code,

                gameIcon:
                    GAME_CONFIG.icon,


                // ------------------------------
                // PRODUK
                // ------------------------------

                product:
                    selectedItem.name,


                // ------------------------------
                // DATA USER
                // ------------------------------

                userId:
                    userId.value.trim(),

                server:
                    serverValue,

                userIdFull:
                    getFullUserId(),


                // ------------------------------
                // JUMLAH
                // ------------------------------

                jumlah:
                    1,


                // ------------------------------
                // HARGA
                // ------------------------------

                harga:
                    selectedItem.price,

                biaya:
                    adminFee,

                total:
                    total,


                // ------------------------------
                // PEMBAYARAN
                // ------------------------------

                payment:
                    paymentName,


                // ------------------------------
                // POINT
                // ------------------------------

                point:
                    selectedItem.point,


                // ------------------------------
                // VOUCHER
                // ------------------------------

                voucher:
                    voucherCode
                        ? voucherCode.value.trim()
                        : "",


                // ------------------------------
                // IDENTITAS TRANSAKSI
                // ------------------------------

                transactionNumber:
                    transactionNumber,

                transactionTime:
                    transactionTime,


                // ------------------------------
                // STATUS
                // ------------------------------

                status:
                    "processing"

            };


            // ==================================
            // POTONG SALDO
            // ==================================

            balances[paymentName] -=
                total;


            // ==================================
            // SIMPAN SALDO
            // ==================================

            saveBalances();


            // ==================================
            // UPDATE TAMPILAN SALDO
            // ==================================

            updateBalanceDisplay();


            // ==================================
            // SIMPAN CURRENT TRANSACTION
            // ==================================

            localStorage.setItem(
                "currentTransaction",
                JSON.stringify(
                    transactionData
                )
            );


            // ==================================
            // SIMPAN KE HISTORY GABUNGAN
            // ==================================

            saveTransactionToHistory(
                transactionData
            );


            // ==================================
            // DEBUG
            // ==================================

            console.log(
                "Transaksi HSR dibuat:",
                transactionData
            );


            // ==================================
            // PINDAH KE PEMBAYARAN
            // ==================================

            window.location.href =
                "pembayaran.html";

        }
    );

}


// ==========================================
// 26. CEK KONEKSI HTML
// ==========================================

console.log(
    "================================"
);

console.log(
    "GAME CONFIG:",
    GAME_CONFIG
);

console.log(
    "Jumlah produk HSR ditemukan:",
    productCards.length
);

console.log(
    "Input UID:",
    userId
);

console.log(
    "Input Server:",
    serverId
);

console.log(
    "Saldo:",
    balances
);

console.log(
    "================================"
);