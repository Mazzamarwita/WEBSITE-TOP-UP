/* DATA AWAL */
let selectedVoucher = null;

let exchangeProcessing = false;

/* ELEMENT HTML */
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


/* AMBIL SALDO POIN */

function getPointBalance() {

    const savedPoint =
        localStorage.getItem(
            "infinityPoint"
        );


    /* JIKA BELUM ADA POIN */
    if (savedPoint === null) {
        return 0;
    }


    const point =
        Number(savedPoint);

    /* CEGAH NAN */
    if (isNaN(point)) {
        return 0;

    }

    return Math.max(
        0,
        point
    );

}


/* SIMPAN SALDO POIN */
function savePointBalance(point) {
    let safePoint =
        Number(point);

    /* CEGAH NAN */
    if (isNaN(safePoint)) {
        safePoint = 0;
    }

    /* CEGAH POIN MINUS */
    safePoint =
        Math.max(
            0,
            safePoint
        );
    localStorage.setItem(
        "infinityPoint",
        String(safePoint)
    );
}

/* UPDATE TAMPILAN POIN */
function updatePointDisplay() {
    if (!pointBalance) {
        return;
    }

    pointBalance.textContent =
        getPointBalance()
            .toLocaleString(
                "id-ID"
            ) +
        " Poin";
}


/* NORMALISASI KODE GAME */
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

        // Genshin Impact
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


/* AMBIL NAMA GAME */

function getGameName(gameCode) {
    const normalizedCode =
        normalizeGameCode(
            gameCode
        );

    const gameNames = {

        ML:
            "Mobile Legends",

        FF:
            "Free Fire",

        PUBG:
            "PUBG Mobile",

        HSR:
            "Honkai: Star Rail",

        HOK:
            "Honor of Kings",

        GI:
            "Genshin Impact",

        WUWA:
            "Wuthering Waves",

        ZZZ:
            "Zenless Zone Zero"

    };
    return (
        gameNames[normalizedCode] ||
        gameCode ||
        "Game"
    );

}


/* GENERATE KODE VOUCHER */

function generateVoucherCode(
    gameCode = "V"
) {

    const normalizedGame =
        normalizeGameCode(
            gameCode
        );


    /* AMBIL TIMESTAMP */
    const timestamp =
        Date.now()
            .toString()
            .slice(-5);


    /* KODE VOUCHER RANDOM 5 DIGIT */
    const randomNumber =
        Math.floor(
            10000 +
            Math.random() *
            90000
        );

    return (
        normalizedGame +
        "-" +
        timestamp +
        randomNumber
    );

}

/* AMBIL VOUCHER SAYA */
function getMyVouchers() {
    try {
        const savedData =
            localStorage.getItem(
                "myVouchers"
            );

        /* JIKA BELUM ADA VOUCHER */
        if (!savedData) {
            return [];

        }

        const vouchers =
            JSON.parse(
                savedData
            );

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


/* SIMPAN VOUCHER SAYA */
function saveMyVouchers(vouchers) {
    if (!Array.isArray(vouchers)) {
        console.error(
            "Data voucher harus berupa array!"
        );
        return false;
    }

    try {
        localStorage.setItem(
            "myVouchers",
            JSON.stringify(
                vouchers
            )
        );
        return true;

    } catch (error) {
        console.error(
            "Gagal menyimpan voucher:",
            error
        );
        return false;
    }
}


/* BUAT ID VOUCHER UNIK */
function generateVoucherId() {

    const randomPart =
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();


    return (
        "VOUCHER-" +
        Date.now() +
        "-" +
        randomPart
    );

}


/* CEK KODE VOUCHER SUDAH ADA */

function isVoucherCodeExists(code) {
    const vouchers =
        getMyVouchers();

    const normalizedCode =
        String(code || "")
            .trim()
            .toUpperCase();
        
    return vouchers.some(
        function(voucher) {

            return (
                String(
                    voucher.code || ""
                )
                .trim()
                .toUpperCase()
                ===
                normalizedCode
            );
        }
    );
}


/* BUAT KODE VOUCHER UNIK */
function createUniqueVoucherCode(
    gameCode
) {
    let voucherCode;
    let attempt = 0;

    do {
        voucherCode =
            generateVoucherCode(
                gameCode
            );
        attempt++;

    } while (
        isVoucherCodeExists(
            voucherCode
        ) &&
        attempt < 20
    );
    return voucherCode;
}


/* VALIDASI DATA VOUCHER */
function validateVoucherData(voucher) {
    if (!voucher) {
        return {
            valid: false,
            message:
                "Data voucher tidak ditemukan."
        };

    }

    /* GAME KOSONG */
    if (!voucher.game) {

        return {
            valid: false,
            message:
                "Game voucher tidak valid."
        };

    }


    /* NILAI DISKON */
    if (
        isNaN(voucher.value) ||
        voucher.value <= 0
    ) {

        return {
            valid: false,
            message:
                "Nilai potongan voucher tidak valid."
        };

    }


    /* HARGA POIN */
    if (
        isNaN(voucher.point) ||
        voucher.point <= 0
    ) {
        return {
            valid: false,
            message:
                "Harga poin voucher tidak valid."
        };
    }
    return {
        valid: true,
        message: ""
    };
}


/* EVENT TOMBOL TUKAR */
voucherCards.forEach(
    function(card) {
        const exchangeButton =
            card.querySelector(
                ".exchange-button"
            );

        /* TOMBOL TIDAK DITEMUKAN */
        if (!exchangeButton) {
            return;
        }

        exchangeButton.addEventListener(
            "click",
            function(event) {
                /* CEGAH DEFAULT */
                event.preventDefault();


               /* AMBIL DATA DARI CARD */
                selectedVoucher = {
                    id:
                        card.dataset.id ||
                        "",

                    game:
                        normalizeGameCode(
                            card.dataset.game
                        ),

                    value:
                        Number(
                            card.dataset.value ||
                            0
                        ),

                    point:
                        Number(
                            card.dataset.point ||
                            0
                        ),

                    image:
                        card.dataset.image ||
                        ""
                };


                /* VALIDASI DATA */

                const validation =
                    validateVoucherData(
                        selectedVoucher
                    );

                if (!validation.valid) {
                    alert(
                        validation.message
                    );
                    selectedVoucher = null;
                    return;
                }


                /* ISI MODAL POIN */
                if (modalPoint) {

                    modalPoint.textContent =
                        selectedVoucher.point
                            .toLocaleString(
                                "id-ID"
                            ) +
                        " Poin";

                }


                /* BUKA MODAL */

                if (exchangeModal) {
                    exchangeModal.classList.add(
                        "active"
                    );
                }


                console.log(
                    "Voucher dipilih:",
                    selectedVoucher
                );
            }
        );
    }
);


/* TUTUP MODAL KONFIRMASI */
if (closeExchangeModal) {
    closeExchangeModal.addEventListener(
        "click",
        function() {
            if (exchangeModal) {
                exchangeModal.classList.remove(
                    "active"
                );
            }
        }
    );
}


/* LANJUTKAN PENUKARAN VOUCHER */
if (continueExchange) {
    continueExchange.addEventListener(
        "click",
        function() {

          /* CEGAH DOUBLE CLICK */
            if (exchangeProcessing) {
                return;
            }

            
            /* CEK VOUCHER DIPILIH */
            if (!selectedVoucher) {
                alert(
                    "Pilih voucher terlebih dahulu!"
                );
                return;
            }


           /* VALIDASI ULANG */
            const validation =
                validateVoucherData(
                    selectedVoucher
                );

            if (!validation.valid) {
                alert(
                    validation.message
                );
                return;
            }


           /* AMBIL POIN SEKARANG */
            const currentPoint =
                getPointBalance();


           /* CEK POIN MENCUKUPI */
            if (
                currentPoint <
                selectedVoucher.point
            ) {
                alert(
                    "Poin kamu tidak mencukupi!"
                );
                return;
            }

            /* MULAI PROSES */
            exchangeProcessing = true;
            continueExchange.disabled =
                true;


           /* HITUNG SISA POIN */
            const remainingPoint =
                currentPoint -
                selectedVoucher.point;

          /* NORMALISASIKAN GAME */
            const gameCode =
                normalizeGameCode(
                    selectedVoucher.game
                );


            /* BUAT KODE VOUCHER UNIK */
            const voucherCode =
                createUniqueVoucherCode(
                    gameCode
                );


          /* BUAT DATA VOUCHER KOMPATIBEL DENGAN GAME-TOPUP.JS */
            const newVoucher = {
               /* IDENTITAS */
                id:
                    generateVoucherId(),
                voucherType:
                    selectedVoucher.id,

                /* GAME */
                game:
                    gameCode,

                gameCode:
                    gameCode,

                gameName:
                    getGameName(
                        gameCode
                    ),

                voucherGame:
                    gameCode,

                targetGame:
                    gameCode,


               /* DISKON */
                discount:
                    Number(
                        selectedVoucher.value
                    ),

                discountValue:
                    Number(
                        selectedVoucher.value
                    ),

                value:
                    Number(
                        selectedVoucher.value
                    ),

                potongan:
                    Number(
                        selectedVoucher.value
                    ),

                discountAmount:
                    Number(
                        selectedVoucher.value
                    ),


                /* BIAYA PENUKARAN VOUCHER */
                pointCost:
                    Number(
                        selectedVoucher.point
                    ),


                /* GAMBAR */
                image:
                    selectedVoucher.image,


               /* KODE VOUCHER */
                code:
                    voucherCode,

                voucherCode:
                    voucherCode,

                kode:
                    voucherCode,

                kodeVoucher:
                    voucherCode,


               /* STATUS */
                status:
                    "active",

                used:
                    false,

                isUsed:
                    false,


                /* WAKTU */
                createdAt:
                    new Date()
                        .toISOString(),

                usedAt:
                    null
            };


            /* AMBIL VOUCHER LAMA */
            const myVouchers =
                getMyVouchers();


            /* TAMBAH VOUCHER BARU */
            myVouchers.unshift(
                newVoucher
            );


            /* SIMPAN VOUCHER DULU */
            const voucherSaved =
                saveMyVouchers(
                    myVouchers
                );


            /* JIKA GAGAL SIMPAN VOUCHER */
            if (!voucherSaved) {
                exchangeProcessing =
                    false;
                continueExchange.disabled =
                    false;
                alert(
                    "Voucher gagal disimpan. Silakan coba lagi!"
                );
                return;
            }

           /* POTONG POIN SETELAH BERHASIL DISIMPAN */
            savePointBalance(
                remainingPoint
            );

            /* UPDATE TAMPILAN POIN */
            updatePointDisplay();


           /* TUTUP MODAL KONFIRMASI */
            if (exchangeModal) {
                exchangeModal.classList.remove(
                    "active"
                );
            }


            /* TAMPILKAN SUKSES MODAL */
            if (successModal) {
                successModal.classList.add(
                    "active"
                );
            }


           /* RESET PROSES */
            exchangeProcessing =
                false;

            continueExchange.disabled =
                false;

            /* RESET VOUCHER PILIHAN */
            selectedVoucher =
                null;


            /* DEBUG */
            console.log(
                "Voucher berhasil ditukar:",
                newVoucher
            );

            console.log(
                "Kode voucher:",
                voucherCode
            );

            console.log(
                "Sisa poin:",
                remainingPoint
            );

            console.log(
                "Semua voucher:",
                getMyVouchers()
            );
        }
    );
}

/* TUTUP SUKSES MODAL */
if (closeSuccess) {
    closeSuccess.addEventListener(
        "click",
        function() {
            if (successModal) {
                successModal.classList.remove(
                    "active"
                );
            }
        }
    );
}

/* KLIK OVERLAY KONFIRMASI */
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

/* KLIK OVERLAY SUKSES */
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


/* UPDATE JIKA STORAGE BERUBAH */
window.addEventListener(
    "storage",
    function(event) {
        if (
            event.key ===
            "infinityPoint"
        ) {
            updatePointDisplay();
        }
    }
);


/* INISIALISASI HALAMAN */
updatePointDisplay();

/* DEBUG */
console.log(
    "=================================="
);

console.log(
    "SISTEM POINKU AKTIF"
);

console.log(
    "Saldo poin:",
    getPointBalance()
);

console.log(
    "Voucher saya:",
    getMyVouchers()
);

console.log(
    "Jumlah voucher card:",
    voucherCards.length
);

console.log(
    "=================================="
);