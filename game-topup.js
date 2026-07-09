// ==========================================
// GAME-TOPUP.JS
// SATU JS UNTUK 8 GAME
// ML, FF, PUBG, HSR, HOK, GI, WUWA, ZZZ
// ==========================================


// ==========================================
// 1. KONFIGURASI GAME DARI BODY
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

let paymentProcessing = false;

const adminFee = 1500;


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
// 4. AMBIL ELEMENT PRODUK
// ==========================================

const productCards =
    document.querySelectorAll(
        ".product-card"
    );


// ==========================================
// 5. AMBIL INPUT USER
// ==========================================

const userId =
    document.getElementById(
        "userId"
    );

const serverId =
    document.getElementById(
        "serverId"
    );


// ==========================================
// 6. AMBIL ELEMENT VOUCHER
// ==========================================

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


// ==========================================
// 7. AMBIL PAYMENT
// ==========================================

const paymentMethods =
    document.querySelectorAll(
        'input[name="payment"]'
    );


// ==========================================
// 8. TOMBOL BAYAR
// ==========================================

const payButton =
    document.getElementById(
        "payButton"
    );


// ==========================================
// 9. DETAIL TRANSAKSI
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
// 10. SALDO
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
// 11. MODAL
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
// 12. ISI MODAL
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
// 13. FORMAT RUPIAH
// ==========================================

function formatRupiah(number) {

    const value =
        Number(number || 0);

    return "Rp" +
        value.toLocaleString(
            "id-ID"
        );

}


// ==========================================
// 14. FORMAT DISKON
// ==========================================

function formatDiscount(number) {

    const value =
        Number(number || 0);

    return "-Rp" +
        value.toLocaleString(
            "id-ID"
        );

}


// ==========================================
// 15. AMBIL PAYMENT TERPILIH
// ==========================================

function getSelectedPayment() {

    return document.querySelector(
        'input[name="payment"]:checked'
    );

}


// ==========================================
// 16. AMBIL NILAI SERVER
// ==========================================

function getServerValue() {

    if (!serverId) {
        return "";
    }

    return serverId.value.trim();

}


// ==========================================
// 17. BUAT USER ID FULL
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
// 18. UPDATE SALDO
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
// 19. AMBIL VOUCHER USER
// ==========================================

function getMyVouchers() {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(
                    "myVouchers"
                )
            );


        return Array.isArray(data)
            ? data
            : [];

    } catch (error) {

        console.error(
            "Data voucher rusak:",
            error
        );

        return [];

    }

}


// ==========================================
// 20. SIMPAN VOUCHER USER
// ==========================================

function saveMyVouchers(vouchers) {

    localStorage.setItem(
        "myVouchers",
        JSON.stringify(
            vouchers
        )
    );

}


// ==========================================
// 21. NORMALISASI KODE GAME
// ==========================================

function normalizeGameCode(value) {

    const code =
        String(value || "")
            .trim()
            .toUpperCase();


    const aliases = {

        // Mobile Legends
        "ML": "ML",
        "MLBB": "ML",
        "MOBILE LEGENDS": "ML",
        "MOBILE LEGENDS BANG BANG": "ML",
        "MOBILE LEGENDS: BANG BANG": "ML",

        // Free Fire
        "FF": "FF",
        "FREE FIRE": "FF",

        // PUBG
        "PUBG": "PUBG",
        "PUBG MOBILE": "PUBG",

        // Honkai Star Rail
        "HSR": "HSR",
        "HONKAI STAR RAIL": "HSR",
        "HONKAI: STAR RAIL": "HSR",

        // Honor of Kings
        "HOK": "HOK",
        "HONOR OF KINGS": "HOK",

        // Genshin
        "GI": "GI",
        "GENSHIN": "GI",
        "GENSHIN IMPACT": "GI",

        // Wuthering Waves
        "WUWA": "WUWA",
        "WUTHERING WAVES": "WUWA",

        // Zenless Zone Zero
        "ZZZ": "ZZZ",
        "ZENLESS ZONE ZERO": "ZZZ"

    };


    return aliases[code] || code;

}


// ==========================================
// 22. AMBIL KODE VOUCHER
// ==========================================

function getVoucherCode(voucher) {

    if (!voucher) {
        return "";
    }


    return String(

        voucher.code ||
        voucher.voucherCode ||
        voucher.kode ||
        voucher.kodeVoucher ||
        ""

    )
    .trim()
    .toUpperCase();

}


// ==========================================
// 23. AMBIL GAME VOUCHER
// ==========================================

function getVoucherGame(voucher) {

    if (!voucher) {
        return "";
    }


    return normalizeGameCode(

        voucher.gameCode ||
        voucher.game ||
        voucher.voucherGame ||
        voucher.targetGame ||
        voucher.gameTarget ||
        ""

    );

}


// ==========================================
// 24. AMBIL NILAI DISKON VOUCHER
// ==========================================

function getVoucherDiscount(voucher) {

    if (!voucher) {
        return 0;
    }


    const rawValue =

        voucher.discount ??
        voucher.discountValue ??
        voucher.potongan ??
        voucher.value ??
        voucher.nominal ??
        voucher.discountAmount ??
        0;


    // Kalau number langsung pakai
    if (
        typeof rawValue ===
        "number"
    ) {

        return rawValue;

    }


    // Kalau string seperti:
    // "10000"
    // "Rp10.000"
    // "10.000"
    const cleanedValue =
        String(rawValue)
            .replace(/[^\d]/g, "");


    return Number(
        cleanedValue || 0
    );

}


// ==========================================
// 25. CEK VOUCHER SUDAH DIPAKAI
// ==========================================

function isVoucherUsed(voucher) {

    if (!voucher) {
        return false;
    }


    const status =
        String(
            voucher.status || ""
        )
        .trim()
        .toLowerCase();


    return (

        voucher.used === true ||

        voucher.isUsed === true ||

        status === "used" ||

        status === "dipakai" ||

        status === "used-up"

    );

}


// ==========================================
// 26. CEK VOUCHER AKTIF
// ==========================================

function isVoucherActive(voucher) {

    if (!voucher) {
        return false;
    }


    // Kalau sudah dipakai
    if (isVoucherUsed(voucher)) {
        return false;
    }


    const status =
        String(
            voucher.status || ""
        )
        .trim()
        .toLowerCase();


    // Status kosong dianggap aktif
    // agar kompatibel dengan voucher lama
    if (status === "") {
        return true;
    }


    return (

        status === "active" ||

        status === "aktif" ||

        status === "available" ||

        status === "tersedia"

    );

}


// ==========================================
// 27. TAMPILKAN PESAN VOUCHER
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
// 28. RESET VOUCHER
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
// 29. HITUNG DISKON
// ==========================================

function calculateDiscount() {

    // Belum pilih item
    if (!selectedItem) {
        return 0;
    }


    // Belum ada voucher aktif
    if (!appliedVoucher) {
        return 0;
    }


    let discount =
        Number(
            appliedVoucher.discount ||
            0
        );


    // Nilai tidak valid
    if (
        isNaN(discount) ||
        discount < 0
    ) {

        discount = 0;

    }


    // Harga + admin
    const subtotal =
        selectedItem.price +
        adminFee;


    // Diskon tidak boleh
    // lebih besar dari subtotal
    if (discount > subtotal) {

        discount = subtotal;

    }


    return discount;

}


// ==========================================
// 30. HITUNG TOTAL
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
// 31. PILIH ITEM
// ==========================================

productCards.forEach(
    function(card) {

        card.addEventListener(
            "click",
            function() {

                // Hapus selected semua
                productCards.forEach(
                    function(item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                // Pilih card ini
                card.classList.add(
                    "selected"
                );


                // Ambil data item
                selectedItem = {

                    name:
                        card.getAttribute(
                            "data-item"
                        ) ||
                        "Produk",

                    price:
                        Number(
                            card.getAttribute(
                                "data-price"
                            ) ||
                            0
                        ),

                    point:
                        Number(
                            card.getAttribute(
                                "data-point"
                            ) ||
                            0
                        )

                };


                // Langsung update
                // Jika voucher sudah aktif,
                // diskon otomatis dihitung ulang
                updateTransactionDetail();


                console.log(
                    "Item dipilih:",
                    selectedItem
                );

            }
        );

    }
);


// ==========================================
// 32. INPUT USER ID
// ==========================================

if (userId) {

    userId.addEventListener(
        "input",
        updateTransactionDetail
    );

}


// ==========================================
// 33. INPUT SERVER
// ==========================================

if (serverId) {

    serverId.addEventListener(
        "input",
        updateTransactionDetail
    );

}


// ==========================================
// 34. PILIH PAYMENT
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
// 35. UPDATE DETAIL TRANSAKSI
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
                getServerValue() ||
                "-";

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
    // HITUNG DISKON DAN TOTAL
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
    // DISKON VOUCHER
    // ======================================

    if (detailDiscount) {

        detailDiscount.textContent =
            formatDiscount(
                discount
            );

    }


    // Tampilkan baris diskon
    // hanya jika voucher aktif
    if (detailDiscountRow) {

        detailDiscountRow.style.display =
            discount > 0
                ? "flex"
                : "none";

    }


    // ======================================
    // TOTAL SETELAH DISKON
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
// 36. GUNAKAN VOUCHER
// LANGSUNG AKTIF DAN POTONG TOTAL
// ==========================================

if (useVoucherButton) {

    useVoucherButton.addEventListener(
        "click",
        function() {

            // ==================================
            // CEK GAME DUKUNG VOUCHER
            // ==================================

            if (!GAME_CONFIG.voucherGame) {

                appliedVoucher = null;


                showVoucherMessage(
                    "Voucher tidak tersedia untuk game ini.",
                    "error"
                );


                updateTransactionDetail();

                return;

            }


            // ==================================
            // CEK INPUT VOUCHER
            // ==================================

            if (!voucherCode) {

                showVoucherMessage(
                    "Input voucher tidak ditemukan.",
                    "error"
                );

                return;

            }


            // ==================================
            // AMBIL KODE INPUT
            // ==================================

            const inputCode =
                voucherCode.value
                    .trim()
                    .toUpperCase();


            // Kode kosong
            if (!inputCode) {

                appliedVoucher = null;


                showVoucherMessage(
                    "Masukkan kode voucher terlebih dahulu.",
                    "error"
                );


                voucherCode.focus();


                updateTransactionDetail();

                return;

            }


            // ==================================
            // AMBIL SEMUA VOUCHER USER
            // ==================================

            const vouchers =
                getMyVouchers();


            // ==================================
            // CARI VOUCHER SESUAI KODE
            // ==================================

            const voucher =
                vouchers.find(
                    function(item) {

                        return (
                            getVoucherCode(item) ===
                            inputCode
                        );

                    }
                );


            // ==================================
            // VOUCHER TIDAK DITEMUKAN
            // ==================================

            if (!voucher) {

                appliedVoucher = null;


                showVoucherMessage(
                    "Kode voucher tidak ditemukan.",
                    "error"
                );


                updateTransactionDetail();

                return;

            }


            // ==================================
            // VOUCHER SUDAH DIPAKAI
            // ==================================

            if (isVoucherUsed(voucher)) {

                appliedVoucher = null;


                showVoucherMessage(
                    "Voucher sudah pernah digunakan.",
                    "error"
                );


                updateTransactionDetail();

                return;

            }


            // ==================================
            // CEK STATUS AKTIF
            // ==================================

            if (!isVoucherActive(voucher)) {

                appliedVoucher = null;


                showVoucherMessage(
                    "Voucher tidak aktif.",
                    "error"
                );


                updateTransactionDetail();

                return;

            }


            // ==================================
            // CEK GAME VOUCHER
            // ==================================

            const voucherGame =
                getVoucherGame(
                    voucher
                );


            const currentGame =
                normalizeGameCode(
                    GAME_CONFIG.voucherGame
                );


            if (
                voucherGame !==
                currentGame
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


            // ==================================
            // AMBIL NILAI DISKON
            // ==================================

            const discount =
                getVoucherDiscount(
                    voucher
                );


            // Diskon tidak valid
            if (
                isNaN(discount) ||
                discount <= 0
            ) {

                appliedVoucher = null;


                showVoucherMessage(
                    "Nilai voucher tidak valid.",
                    "error"
                );


                updateTransactionDetail();

                return;

            }


            // ==================================
            // AKTIFKAN VOUCHER
            // ==================================

            appliedVoucher = {

                ...voucher,

                code:
                    getVoucherCode(
                        voucher
                    ),

                game:
                    voucherGame,

                discount:
                    Number(
                        discount
                    )

            };


            // ==================================
            // PESAN BERHASIL
            // ==================================

            showVoucherMessage(
                "Voucher aktif! Potongan " +
                formatRupiah(
                    discount
                ),
                "success"
            );


            // ==================================
            // LANGSUNG HITUNG ULANG
            // TOTAL LANGSUNG TERPOTONG
            // ==================================

            updateTransactionDetail();


            // ==================================
            // DEBUG
            // ==================================

            console.log(
                "Voucher aktif:",
                appliedVoucher
            );


            console.log(
                "Diskon aktif:",
                calculateDiscount()
            );


            console.log(
                "Total setelah diskon:",
                calculateTotal()
            );

        }
    );

}


// ==========================================
// 37. JIKA INPUT KODE VOUCHER DIUBAH
// RESET VOUCHER AKTIF
// ==========================================

if (voucherCode) {

    voucherCode.addEventListener(
        "input",
        function() {

            // Tidak ada voucher aktif
            if (!appliedVoucher) {
                return;
            }


            const currentCode =
                voucherCode.value
                    .trim()
                    .toUpperCase();


            const activeCode =
                getVoucherCode(
                    appliedVoucher
                );


            // Kalau kode berubah,
            // voucher dibatalkan
            if (
                currentCode !==
                activeCode
            ) {

                appliedVoucher = null;


                showVoucherMessage(
                    "",
                    ""
                );


                // Total kembali normal
                updateTransactionDetail();

            }

        }
    );

}


// ==========================================
// 38. VALIDASI TRANSAKSI
// ==========================================

function validateTransaction() {

    // ======================================
    // CEK ITEM
    // ======================================

    if (!selectedItem) {

        alert(
            "Silakan pilih item terlebih dahulu!"
        );

        return false;

    }


    // ======================================
    // CEK USER ID
    // ======================================

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


    // ======================================
    // CEK SERVER DINAMIS
    // ======================================

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


    // ======================================
    // CEK PAYMENT
    // ======================================

    const selectedPayment =
        getSelectedPayment();


    if (!selectedPayment) {

        alert(
            "Silakan pilih metode pembayaran!"
        );

        return false;

    }


    // ======================================
    // CEK PAYMENT ADA DI SALDO
    // ======================================

    const paymentName =
        selectedPayment.value;


    if (
        balances[paymentName] ===
        undefined
    ) {

        alert(
            "Metode pembayaran tidak valid!"
        );

        return false;

    }


    // ======================================
    // CEK SALDO
    // ======================================

    const total =
        calculateTotal();


    if (
        balances[paymentName] <
        total
    ) {

        alert(
            "Saldo " +
            paymentName +
            " tidak mencukupi!"
        );

        return false;

    }


    return true;

}


// ==========================================
// 39. KLIK BAYAR SEKARANG
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
            // DISKON MODAL
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
// 40. TUTUP MODAL
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
// 41. KLIK AREA GELAP MODAL
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
// 42. TANDAI VOUCHER SUDAH DIGUNAKAN
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


    // Voucher tidak ditemukan
    if (voucherIndex === -1) {

        console.warn(
            "Voucher tidak ditemukan saat akan ditandai used."
        );

        return;

    }


    // ======================================
    // TANDAI SUDAH DIPAKAI
    // ======================================

    vouchers[voucherIndex].used =
        true;

    vouchers[voucherIndex].isUsed =
        true;

    vouchers[voucherIndex].status =
        "used";

    vouchers[voucherIndex].usedAt =
        new Date().toISOString();


    // ======================================
    // SIMPAN
    // ======================================

    saveMyVouchers(
        vouchers
    );

}


// ==========================================
// 43. LANJUTKAN PEMBAYARAN
// ==========================================

if (continuePaymentButton) {

    continuePaymentButton.addEventListener(
        "click",
        function() {

            // ==================================
            // CEGAH DOUBLE CLICK
            // ==================================

            if (paymentProcessing) {

                return;

            }


            // ==================================
            // VALIDASI ULANG
            // ==================================

            if (!validateTransaction()) {

                return;

            }


            const selectedPayment =
                getSelectedPayment();


            if (!selectedPayment) {

                return;

            }


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
            // MULAI PROSES
            // ==================================

            paymentProcessing = true;


            continuePaymentButton.disabled =
                true;


            // ==================================
            // POTONG SALDO
            // TOTAL SUDAH SETELAH VOUCHER
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
                            ),

                        name:
                            appliedVoucher.name ||
                            appliedVoucher.title ||
                            "Voucher"

                    }
                    : null;


            // ==================================
            // DATA TRANSAKSI
            // ==================================

            const transactionData = {

                // ------------------------------
                // GAME
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
                // USER
                // ------------------------------

                userId:
                    userId.value.trim(),

                server:
                    GAME_CONFIG.needServer
                        ? getServerValue()
                        : "",

                userIdFull:
                    getUserIdFull(),


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

                discount:
                    discount,

                potongan:
                    discount,

                subtotal:
                    selectedItem.price +
                    adminFee,

                total:
                    total,


                // ------------------------------
                // PAYMENT
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
                    voucherData,

                voucherCode:
                    voucherData
                        ? voucherData.code
                        : "",


                // ------------------------------
                // TRANSAKSI
                // ------------------------------

                transactionNumber:
                    transactionNumber,

                transactionTime:
                    new Date()
                        .toISOString(),

                status:
                    "processing"

            };


            // ==================================
            // TANDAI VOUCHER SUDAH DIPAKAI
            // HANYA SETELAH PEMBAYARAN
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
            // DEBUG
            // ==================================

            console.log(
                "Transaksi dibuat:",
                transactionData
            );


            console.log(
                "Total dibayar:",
                total
            );


            console.log(
                "Diskon voucher:",
                discount
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
// 44. INISIALISASI HALAMAN
// ==========================================

updateBalanceDisplay();

updateTransactionDetail();


// ==========================================
// 45. DEBUG SISTEM
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
    "Kode Game:",
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
    GAME_CONFIG.voucherGame ||
    "Tidak tersedia"
);

console.log(
    "Jumlah Produk:",
    productCards.length
);

console.log(
    "Voucher Tersimpan:",
    getMyVouchers()
);

console.log(
    "=================================="
);