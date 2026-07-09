// ==========================================
// GAME-TOPUP.JS
// SATU JS UNTUK 8 GAME
// ==========================================


// ==========================================
// 1. KONFIGURASI GAME DARI <body>
// ==========================================

const GAME_CONFIG = {

    name:
        document.body.dataset.game ||
        "Game",

    code:
        document.body.dataset.gameCode ||
        "GAME",

    icon:
        document.body.dataset.gameIcon ||
        "img/MLicon.png",

    needServer:
        document.body.dataset.needServer ===
        "true",

    voucherGame:
        document.body.dataset.voucherGame ||
        ""

};


// ==========================================
// 2. DATA AWAL
// ==========================================

let selectedItem = null;

let appliedVoucher = null;

const adminFee = 193;


// ==========================================
// 3. SALDO BERSAMA SEMUA GAME
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


// Input user
const userId =
    document.getElementById(
        "userId"
    );

const serverId =
    document.getElementById(
        "serverId"
    );


// Voucher
const voucherCode =
    document.getElementById(
        "voucherCode"
    );

const useVoucherButton =
    document.getElementById(
        "useVoucherButton"
    ) ||
    document.getElementById(
        "voucherAction"
    );

const voucherMessage =
    document.getElementById(
        "voucherMessage"
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

const detailDiscount =
    document.getElementById(
        "detailDiscount"
    );

const detailDiscountRow =
    document.getElementById(
        "detailDiscountRow"
    ) ||
    document.getElementById(
        "voucherDiscountRow"
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

const confirmDiscount =
    document.getElementById(
        "confirmDiscount"
    ) ||
    document.getElementById(
        "confirmVoucher"
    );

const confirmDiscountRow =
    document.getElementById(
        "confirmDiscountRow"
    ) ||
    document.getElementById(
        "confirmVoucherRow"
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
// 10. FORMAT POTONGAN
// ==========================================

function formatDiscount(number) {

    return "-Rp" +
        Number(number || 0)
            .toLocaleString("id-ID");

}


// ==========================================
// 11. AMBIL PAYMENT TERPILIH
// ==========================================

function getSelectedPayment() {

    return document.querySelector(
        'input[name="payment"]:checked'
    );

}


// ==========================================
// 12. AMBIL SERVER
// ==========================================

function getServerValue() {

    if (!serverId) {
        return "";
    }

    return serverId.value.trim();

}


// ==========================================
// 13. BUAT USER ID FULL
// ==========================================

function getUserIdFull() {

    const id =
        userId
            ? userId.value.trim()
            : "";

    const server =
        getServerValue();


    if (
        GAME_CONFIG.needServer &&
        server !== ""
    ) {

        return (
            id +
            " (" +
            server +
            ")"
        );

    }

    return id;

}


// ==========================================
// 14. UPDATE SALDO
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


// Jalankan awal
updateBalanceDisplay();


// ==========================================
// 15. AMBIL DATA VOUCHER USER
// ==========================================

function getMyVouchers() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "myVouchers"
            )
        ) || [];

    } catch (error) {

        console.error(
            "Data voucher rusak:",
            error
        );

        return [];

    }

}


// ==========================================
// 16. SIMPAN DATA VOUCHER USER
// ==========================================

function saveMyVouchers(vouchers) {

    localStorage.setItem(
        "myVouchers",
        JSON.stringify(vouchers)
    );

}


// ==========================================
// 17. NORMALISASI KODE GAME
// ==========================================

function normalizeGameCode(value) {

    const code =
        String(value || "")
            .trim()
            .toUpperCase();


    const aliases = {

        "MOBILE LEGENDS": "ML",
        "MOBILE LEGENDS BANG BANG": "ML",
        "MOBILE LEGENDS: BANG BANG": "ML",
        "MLBB": "ML",

        "GENSHIN": "GI",
        "GENSHIN IMPACT": "GI"

    };


    return aliases[code] || code;

}


// ==========================================
// 18. AMBIL GAME VOUCHER
// ==========================================

function getVoucherGame(voucher) {

    return normalizeGameCode(

        voucher.gameCode ||
        voucher.game ||
        voucher.voucherGame ||
        voucher.targetGame ||
        ""

    );

}


// ==========================================
// 19. AMBIL KODE VOUCHER
// ==========================================

function getVoucherCode(voucher) {

    return String(

        voucher.code ||
        voucher.voucherCode ||
        voucher.kode ||
        ""

    )
    .trim()
    .toUpperCase();

}


// ==========================================
// 20. AMBIL NILAI DISKON VOUCHER
// ==========================================

function getVoucherDiscount(voucher) {

    return Number(

        voucher.discount ||
        voucher.discountValue ||
        voucher.potongan ||
        voucher.value ||
        voucher.nominal ||
        0

    );

}


// ==========================================
// 21. CEK STATUS VOUCHER
// ==========================================

function isVoucherUsed(voucher) {

    return (
        voucher.used === true ||
        voucher.isUsed === true ||
        voucher.status === "used" ||
        voucher.status === "USED"
    );

}


// ==========================================
// 22. TAMPILKAN PESAN VOUCHER
// ==========================================

function showVoucherMessage(
    message,
    type = ""
) {

    if (!voucherMessage) {
        return;
    }


    voucherMessage.textContent =
        message;


    voucherMessage.classList.remove(
        "success",
        "error"
    );


    if (type) {

        voucherMessage.classList.add(
            type
        );

    }

}


// ==========================================
// 23. RESET VOUCHER
// ==========================================

function resetVoucher() {

    appliedVoucher = null;


    showVoucherMessage(
        "",
        ""
    );


    updateTransactionDetail();

}


// ==========================================
// 24. HITUNG DISKON
// ==========================================

function calculateDiscount() {

    if (
        !selectedItem ||
        !appliedVoucher
    ) {

        return 0;

    }


    let discount =
        getVoucherDiscount(
            appliedVoucher
        );


    // Jangan sampai diskon negatif
    if (discount < 0) {

        discount = 0;

    }


    // Diskon maksimal sebesar
    // harga item + admin
    const subtotal =
        selectedItem.price +
        adminFee;


    if (discount > subtotal) {

        discount = subtotal;

    }


    return discount;

}


// ==========================================
// 25. HITUNG TOTAL
// ==========================================

function calculateTotal() {

    if (!selectedItem) {
        return 0;
    }


    const subtotal =
        selectedItem.price +
        adminFee;


    const discount =
        calculateDiscount();


    return Math.max(
        0,
        subtotal - discount
    );

}


// ==========================================
// 26. PILIH ITEM
// ==========================================

productCards.forEach(
    function(card) {

        card.addEventListener(
            "click",
            function() {

                // Hapus selected
                productCards.forEach(
                    function(item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                // Pilih card
                card.classList.add(
                    "selected"
                );


                // Ambil data
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


                // Update detail
                updateTransactionDetail();

            }
        );

    }
);


// ==========================================
// 27. INPUT USER ID
// ==========================================

if (userId) {

    userId.addEventListener(
        "input",
        updateTransactionDetail
    );

}


// ==========================================
// 28. INPUT SERVER
// ==========================================

if (serverId) {

    serverId.addEventListener(
        "input",
        updateTransactionDetail
    );

}


// ==========================================
// 29. PILIH PAYMENT
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
// 30. UPDATE DETAIL TRANSAKSI
// ==========================================

function updateTransactionDetail() {

    // ======================================
    // USER ID
    // ======================================

    if (detailUserId) {

        detailUserId.textContent =
            userId &&
            userId.value.trim()
                ? userId.value.trim()
                : "-";

    }


    // ======================================
    // SERVER
    // ======================================

    if (detailServer) {

        if (GAME_CONFIG.needServer) {

            detailServer.textContent =
                getServerValue() || "-";

        } else {

            detailServer.textContent =
                "-";

        }

    }


    // ======================================
    // PAYMENT
    // ======================================

    const selectedPayment =
        getSelectedPayment();


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


        if (detailDiscount) {

            detailDiscount.textContent =
                "-Rp0";

        }


        if (detailDiscountRow) {

            detailDiscountRow.style.display =
                "none";

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
    // HITUNG
    // ======================================

    const discount =
        calculateDiscount();

    const total =
        calculateTotal();


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
    // DISKON
    // ======================================

    if (detailDiscount) {

        detailDiscount.textContent =
            formatDiscount(
                discount
            );

    }


    if (detailDiscountRow) {

        detailDiscountRow.style.display =
            discount > 0
                ? "flex"
                : "none";

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
// 31. GUNAKAN VOUCHER
// ==========================================

if (useVoucherButton) {

    useVoucherButton.addEventListener(
        "click",
        function() {

            // Game tidak mendukung voucher
            if (!GAME_CONFIG.voucherGame) {

                showVoucherMessage(
                    "Voucher tidak tersedia untuk game ini.",
                    "error"
                );

                return;
            }


            // Input tidak ada
            if (!voucherCode) {

                showVoucherMessage(
                    "Input voucher tidak ditemukan.",
                    "error"
                );

                return;
            }


            const inputCode =
                voucherCode.value
                    .trim()
                    .toUpperCase();


            // Kode kosong
            if (!inputCode) {

                showVoucherMessage(
                    "Masukkan kode voucher terlebih dahulu.",
                    "error"
                );

                voucherCode.focus();

                return;
            }


            // Ambil voucher
            const vouchers =
                getMyVouchers();


            // Cari voucher
            const voucher =
                vouchers.find(
                    function(item) {

                        return (
                            getVoucherCode(item) ===
                            inputCode
                        );

                    }
                );


            // Tidak ditemukan
            if (!voucher) {

                appliedVoucher = null;

                showVoucherMessage(
                    "Kode voucher tidak ditemukan.",
                    "error"
                );

                updateTransactionDetail();

                return;
            }


            // Sudah digunakan
            if (isVoucherUsed(voucher)) {

                appliedVoucher = null;

                showVoucherMessage(
                    "Voucher sudah pernah digunakan.",
                    "error"
                );

                updateTransactionDetail();

                return;
            }


            // Cek game voucher
            const voucherGame =
                getVoucherGame(voucher);

            const currentVoucherGame =
                normalizeGameCode(
                    GAME_CONFIG.voucherGame
                );


            if (
                voucherGame !==
                currentVoucherGame
            ) {

                appliedVoucher = null;

                showVoucherMessage(
                    "Voucher ini tidak berlaku untuk " +
                    GAME_CONFIG.name +
                    ".",
                    "error"
                );

                updateTransactionDetail();

                return;
            }


            // Cek nilai diskon
            const discount =
                getVoucherDiscount(
                    voucher
                );


            if (discount <= 0) {

                appliedVoucher = null;

                showVoucherMessage(
                    "Nilai voucher tidak valid.",
                    "error"
                );

                updateTransactionDetail();

                return;
            }


            // Terapkan voucher
            appliedVoucher = {
                ...voucher,
                code: getVoucherCode(voucher),
                discount: discount
            };


            showVoucherMessage(
                "Voucher berhasil digunakan. Potongan " +
                formatRupiah(discount) +
                ".",
                "success"
            );


            updateTransactionDetail();

        }
    );

}


// ==========================================
// 32. JIKA KODE VOUCHER DIUBAH
// RESET VOUCHER YANG SUDAH DITERAPKAN
// ==========================================

if (voucherCode) {

    voucherCode.addEventListener(
        "input",
        function() {

            if (!appliedVoucher) {
                return;
            }


            const currentCode =
                voucherCode.value
                    .trim()
                    .toUpperCase();


            if (
                currentCode !==
                getVoucherCode(
                    appliedVoucher
                )
            ) {

                appliedVoucher = null;

                showVoucherMessage(
                    "",
                    ""
                );

                updateTransactionDetail();

            }

        }
    );

}


// ==========================================
// 33. VALIDASI DATA
// ==========================================

function validateTransaction() {

    // Item
    if (!selectedItem) {

        alert(
            "Silakan pilih item terlebih dahulu!"
        );

        return false;

    }


    // User ID
    if (
        !userId ||
        userId.value.trim() === ""
    ) {

        alert(
            "Silakan masukkan ID " +
            GAME_CONFIG.name +
            "!"
        );


        if (userId) {
            userId.focus();
        }


        return false;

    }


    // Server hanya game tertentu
    if (GAME_CONFIG.needServer) {

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


            return false;

        }

    }


    // Payment
    const selectedPayment =
        getSelectedPayment();


    if (!selectedPayment) {

        alert(
            "Silakan pilih metode pembayaran!"
        );

        return false;

    }


    // Total
    const total =
        calculateTotal();


    // Saldo
    if (
        balances[selectedPayment.value] ===
        undefined
    ) {

        alert(
            "Metode pembayaran tidak valid!"
        );

        return false;

    }


    if (
        balances[selectedPayment.value] <
        total
    ) {

        alert(
            "Saldo " +
            selectedPayment.value +
            " tidak mencukupi!"
        );

        return false;

    }


    return true;

}


// ==========================================
// 34. KLIK BAYAR SEKARANG
// ==========================================

if (payButton) {

    payButton.addEventListener(
        "click",
        function() {

            // Validasi
            if (!validateTransaction()) {

                return;

            }


            const selectedPayment =
                getSelectedPayment();


            const discount =
                calculateDiscount();


            const total =
                calculateTotal();


            // ==================================
            // USER ID MODAL
            // ==================================

            if (confirmUserId) {

                confirmUserId.textContent =
                    getUserIdFull();

            }


            // ==================================
            // PRODUK
            // ==================================

            if (confirmProduct) {

                confirmProduct.textContent =
                    selectedItem.name;

            }


            // ==================================
            // HARGA
            // ==================================

            if (confirmPrice) {

                confirmPrice.textContent =
                    formatRupiah(
                        selectedItem.price
                    );

            }


            // ==================================
            // BIAYA
            // ==================================

            if (confirmFee) {

                confirmFee.textContent =
                    formatRupiah(
                        adminFee
                    );

            }


            // ==================================
            // DISKON
            // ==================================

            if (confirmDiscount) {

                confirmDiscount.textContent =
                    formatDiscount(
                        discount
                    );

            }


            if (confirmDiscountRow) {

                confirmDiscountRow.style.display =
                    discount > 0
                        ? "flex"
                        : "none";

            }


            // ==================================
            // PAYMENT
            // ==================================

            if (confirmPayment) {

                confirmPayment.textContent =
                    selectedPayment.value;

            }


            // ==================================
            // TOTAL
            // ==================================

            if (confirmTotal) {

                confirmTotal.textContent =
                    formatRupiah(
                        total
                    );

            }


            // ==================================
            // POINT
            // ==================================

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
// 35. TUTUP MODAL
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
// 36. KLIK AREA GELAP
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
// 37. TANDAI VOUCHER SUDAH DIGUNAKAN
// ==========================================

function markVoucherAsUsed() {

    if (!appliedVoucher) {
        return;
    }


    const vouchers =
        getMyVouchers();


    const voucherCodeUsed =
        getVoucherCode(
            appliedVoucher
        );


    const voucherIndex =
        vouchers.findIndex(
            function(item) {

                return (
                    getVoucherCode(item) ===
                    voucherCodeUsed
                );

            }
        );


    if (voucherIndex === -1) {
        return;
    }


    // Tandai used
    vouchers[voucherIndex].used =
        true;

    vouchers[voucherIndex].isUsed =
        true;

    vouchers[voucherIndex].status =
        "used";

    vouchers[voucherIndex].usedAt =
        new Date().toISOString();


    // Simpan
    saveMyVouchers(
        vouchers
    );

}


// ==========================================
// 38. LANJUTKAN PEMBAYARAN
// ==========================================

if (continuePaymentButton) {

    continuePaymentButton.addEventListener(
        "click",
        function() {

            // Validasi ulang
            if (!validateTransaction()) {

                return;

            }


            const selectedPayment =
                getSelectedPayment();


            const paymentName =
                selectedPayment.value;


            const discount =
                calculateDiscount();


            const total =
                calculateTotal();


            // ==================================
            // CEK SALDO ULANG
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
            // NONAKTIFKAN TOMBOL
            // CEGAH DOUBLE CLICK
            // ==================================

            continuePaymentButton.disabled =
                true;


            // ==================================
            // POTONG SALDO
            // ==================================

            balances[paymentName] -=
                total;


            // ==================================
            // SIMPAN SALDO
            // ==================================

            localStorage.setItem(
                "saldoGoPay",
                String(
                    balances.GoPay
                )
            );


            localStorage.setItem(
                "saldoDANA",
                String(
                    balances.DANA
                )
            );


            // ==================================
            // UPDATE TAMPILAN SALDO
            // ==================================

            updateBalanceDisplay();


            // ==================================
            // NOMOR TRANSAKSI
            // ==================================

            const transactionNumber =
                "#" +
                GAME_CONFIG.code +
                Date.now();


            // ==================================
            // DATA VOUCHER TRANSAKSI
            // ==================================

            const voucherData =
                appliedVoucher
                    ? {
                        code:
                            getVoucherCode(
                                appliedVoucher
                            ),

                        discount:
                            discount,

                        game:
                            getVoucherGame(
                                appliedVoucher
                            )
                    }
                    : null;


            // ==================================
            // DATA TRANSAKSI
            // ==================================

            const transactionData = {

                // Game
                game:
                    GAME_CONFIG.name,

                gameCode:
                    GAME_CONFIG.code,

                gameIcon:
                    GAME_CONFIG.icon,


                // Produk
                product:
                    selectedItem.name,


                // User
                userId:
                    userId.value.trim(),

                server:
                    GAME_CONFIG.needServer
                        ? getServerValue()
                        : "",

                userIdFull:
                    getUserIdFull(),


                // Jumlah
                jumlah:
                    1,


                // Harga
                harga:
                    selectedItem.price,

                biaya:
                    adminFee,

                discount:
                    discount,

                potongan:
                    discount,

                total:
                    total,


                // Pembayaran
                payment:
                    paymentName,


                // Poin
                point:
                    selectedItem.point,


                // Voucher
                voucher:
                    voucherData,

                voucherCode:
                    voucherData
                        ? voucherData.code
                        : "",


                // Transaksi
                transactionNumber:
                    transactionNumber,

                transactionTime:
                    new Date()
                        .toISOString(),

                status:
                    "processing"

            };


            // ==================================
            // TANDAI VOUCHER DIGUNAKAN
            // ==================================

            if (appliedVoucher) {

                markVoucherAsUsed();

            }


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
            // PINDAH KE PEMBAYARAN
            // ==================================

            window.location.href =
                "pembayaran.html";

        }
    );

}


// ==========================================
// 39. INISIALISASI TAMPILAN
// ==========================================

updateTransactionDetail();


// ==========================================
// 40. DEBUG
// ==========================================

console.log(
    "=================================="
);

console.log(
    "GAME TOPUP SYSTEM AKTIF"
);

console.log(
    "Game:",
    GAME_CONFIG.name
);

console.log(
    "Kode:",
    GAME_CONFIG.code
);

console.log(
    "Icon:",
    GAME_CONFIG.icon
);

console.log(
    "Butuh Server:",
    GAME_CONFIG.needServer
);

console.log(
    "Voucher Game:",
    GAME_CONFIG.voucherGame || "Tidak ada"
);

console.log(
    "Jumlah Produk:",
    productCards.length
);

console.log(
    "=================================="
);