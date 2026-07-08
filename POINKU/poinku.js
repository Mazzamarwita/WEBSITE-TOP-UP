// ==========================================
// 1. DATA AWAL
// ==========================================

let selectedVoucher = null;


// ==========================================
// 2. ELEMENT HTML
// ==========================================

const pointBalance =
    document.getElementById(
        "pointBalance"
    );

const voucherCards =
    document.querySelectorAll(
        ".voucher-card"
    );

const exchangeModal =
    document.getElementById(
        "exchangeModal"
    );

const modalPoint =
    document.getElementById(
        "modalPoint"
    );

const closeExchangeModal =
    document.getElementById(
        "closeExchangeModal"
    );

const continueExchange =
    document.getElementById(
        "continueExchange"
    );

const successModal =
    document.getElementById(
        "successModal"
    );

const closeSuccess =
    document.getElementById(
        "closeSuccess"
    );


// ==========================================
// 3. AMBIL SALDO POIN
// ==========================================

function getPointBalance() {

    return Number(
        localStorage.getItem(
            "infinityPoint"
        )
    ) || 0;

}


// ==========================================
// 4. SIMPAN SALDO POIN
// ==========================================

function savePointBalance(point) {

    localStorage.setItem(
        "infinityPoint",
        String(point)
    );

}


// ==========================================
// 5. UPDATE TAMPILAN POIN
// ==========================================

function updatePointDisplay() {

    if (pointBalance) {

        pointBalance.textContent =
            getPointBalance() +
            " Poin";

    }

}


updatePointDisplay();


// ==========================================
// 6. EVENT TOMBOL TUKAR
// ==========================================

voucherCards.forEach(
    function(card) {

        const exchangeButton =
            card.querySelector(
                ".exchange-button"
            );


        if (!exchangeButton) {
            return;
        }


        exchangeButton.addEventListener(
            "click",
            function() {

                selectedVoucher = {

                    id:
                        card.dataset.id,

                    game:
                        card.dataset.game,

                    value:
                        Number(
                            card.dataset.value
                        ),

                    point:
                        Number(
                            card.dataset.point
                        ),

                    image:
                        card.dataset.image

                };


                if (modalPoint) {

                    modalPoint.textContent =
                        selectedVoucher.point +
                        " Poin";

                }


                if (exchangeModal) {

                    exchangeModal.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);


// ==========================================
// 7. TUTUP MODAL KONFIRMASI
// ==========================================

if (closeExchangeModal) {

    closeExchangeModal.addEventListener(
        "click",
        function() {

            exchangeModal.classList.remove(
                "active"
            );

        }
    );

}


// ==========================================
// 8. GENERATE KODE VOUCHER
// ==========================================

function generateVoucherCode() {

    const randomNumber =
        Math.floor(
            10000000 +
            Math.random() * 90000000
        );


    return (
        "V" +
        randomNumber
    );

}


// ==========================================
// 9. AMBIL VOUCHER SAYA
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
// 10. SIMPAN VOUCHER
// ==========================================

function saveMyVouchers(vouchers) {

    localStorage.setItem(
        "myVouchers",
        JSON.stringify(vouchers)
    );

}


// ==========================================
// 11. LANJUTKAN PENUKARAN
// ==========================================

if (continueExchange) {

    continueExchange.addEventListener(
        "click",
        function() {

            if (!selectedVoucher) {
                return;
            }


            const currentPoint =
                getPointBalance();


            // Cek poin
            if (
                currentPoint <
                selectedVoucher.point
            ) {

                alert(
                    "Poin kamu tidak mencukupi!"
                );

                return;

            }


            // ==================================
            // POTONG POIN
            // ==================================

            const remainingPoint =
                currentPoint -
                selectedVoucher.point;


            savePointBalance(
                remainingPoint
            );


            // ==================================
            // BUAT VOUCHER
            // ==================================

            const newVoucher = {

                id:
                    "VOUCHER-" +
                    Date.now(),

                voucherType:
                    selectedVoucher.id,

                game:
                    selectedVoucher.game,

                value:
                    selectedVoucher.value,

                pointCost:
                    selectedVoucher.point,

                image:
                    selectedVoucher.image,

                code:
                    generateVoucherCode(),

                status:
                    "active",

                createdAt:
                    new Date().toISOString()

            };


            // ==================================
            // SIMPAN KE VOUCHER SAYA
            // ==================================

            const myVouchers =
                getMyVouchers();


            myVouchers.unshift(
                newVoucher
            );


            saveMyVouchers(
                myVouchers
            );


            // ==================================
            // UPDATE POIN
            // ==================================

            updatePointDisplay();


            // ==================================
            // TUTUP KONFIRMASI
            // ==================================

            exchangeModal.classList.remove(
                "active"
            );


            // ==================================
            // TAMPILKAN SUCCESS
            // ==================================

            successModal.classList.add(
                "active"
            );


            console.log(
                "Voucher berhasil ditukar:",
                newVoucher
            );

        }
    );

}


// ==========================================
// 12. TUTUP SUCCESS
// ==========================================

if (closeSuccess) {

    closeSuccess.addEventListener(
        "click",
        function() {

            successModal.classList.remove(
                "active"
            );

        }
    );

}


// ==========================================
// 13. KLIK OVERLAY
// ==========================================

if (exchangeModal) {

    exchangeModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                exchangeModal
            ) {

                exchangeModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


if (successModal) {

    successModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                successModal
            ) {

                successModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ==========================================
// 14. DEBUG
// ==========================================

console.log(
    "Saldo poin:",
    getPointBalance()
);

console.log(
    "Voucher saya:",
    getMyVouchers()
);