// 1. AMBIL DATA TRANSAKSI

const transactionData = JSON.parse(
    localStorage.getItem("currentTransaction")
);

// 2. CEK DATA TRANSAKSI

if (!transactionData) {

    alert("Data transaksi tidak ditemukan!");

    window.location.href = "ML.html";

} else {

    initializePaymentPage();

}


// 3. FORMAT RUPIAH

function formatRupiah(number) {

    return "Rp" +
        Number(number || 0).toLocaleString("id-ID");

}


// 4. FORMAT WAKTU TRANSAKSI

function formatTransactionTime(dateString) {

    if (!dateString) {
        return "-";
    }


    const date = new Date(dateString);


    if (isNaN(date.getTime())) {
        return "-";
    }


    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
    ];


    const day = String(
        date.getDate()
    ).padStart(2, "0");


    const month =
        months[date.getMonth()];


    const year =
        date.getFullYear();


    const hour = String(
        date.getHours()
    ).padStart(2, "0");


    const minute = String(
        date.getMinutes()
    ).padStart(2, "0");


    return (
        day +
        " " +
        month +
        " " +
        year +
        " - " +
        hour +
        "." +
        minute
    );

}


// 5. FUNGSI AMAN MENGISI TEXT

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ?? "-";

    }

}


// 6. NORMALISASI KODE GAME

function normalizeGameCode(gameCode) {

    return String(
        gameCode || ""
    )
    .trim()
    .toUpperCase();

}


// 7. ICON GAME DINAMIS
//    UNTUK 8 GAME

function getPaymentGameIcon(transaction) {

    // PRIORITAS 1
    // Gunakan gameIcon dari transaksi

    if (
        transaction.gameIcon &&
        String(transaction.gameIcon).trim() !== ""
    ) {

        return String(
            transaction.gameIcon
        ).trim();

    }


    // PRIORITAS 2
    // Berdasarkan gameCode

    const gameCode =
        normalizeGameCode(
            transaction.gameCode
        );


    switch (gameCode) {

        // FREE FIRE
        case "FF":
            return "img/FFicon.png";


        // MOBILE LEGENDS
        case "ML":
            return "img/MLicon.png";


        // HONKAI STAR RAIL
        case "HSR":
            return "img/HSRicon.png";


        // HONOR OF KINGS
        case "HOK":
            return "img/HOKicon.png";


        // PUBG MOBILE
        case "PUBG":
            return "img/PUBGicon.png";


        // WUTHERING WAVES
        case "WUWA":
            return "img/WUWAicon.png";


        // GENSHIN IMPACT
        case "GI":
            return "img/GIicon.png";


        // ZENLESS ZONE ZERO
        case "ZZZ":
            return "img/ZZZicon.png";


        // FALLBACK
        default:
            return "img/MLicon.png";

    }

}


// 8. INISIALISASI HALAMAN

function initializePaymentPage() {

    // Tampilkan data transaksi
    displayTransactionData();


    // Aktifkan tombol copy
    initializeCopyButton();


    // Cek status transaksi
    checkTransactionStatus();

}


// 9. TAMPILKAN DATA TRANSAKSI

function displayTransactionData() {
// NAMA GAME DINAMIS DI SUMMARY

setText(
    "summaryGameName",
    transactionData.game || "Game"
);
    // ICON GAME DINAMIS

    const summaryGameIcon =
        document.getElementById(
            "summaryGameIcon"
        );


    if (summaryGameIcon) {

        summaryGameIcon.src =
            getPaymentGameIcon(
                transactionData
            );


        summaryGameIcon.alt =
            transactionData.game ||
            "Game";


        // Kalau gambar gagal dimuat
        summaryGameIcon.onerror =
            function() {

                this.onerror = null;

                this.src =
                    "img/MLicon.png";

            };

    }

    // SUMMARY PRODUK

    setText(
        "summaryProduct",
        transactionData.product || "-"
    );


    // TOTAL PEMBAYARAN
    setText(
        "summaryTotal",
        formatRupiah(
            transactionData.total
        )
    );


    // METODE PEMBAYARAN SUMMARY

    setText(
        "summaryPayment",
        transactionData.payment || "-"
    );


    // NOMOR TRANSAKSI

    setText(
        "transactionNumber",
        transactionData.transactionNumber || "-"
    );


    // WAKTU TRANSAKSI

    setText(
        "transactionTime",
        formatTransactionTime(
            transactionData.transactionTime
        )
    );


    // DETAIL GAME

    setText(
        "detailGame",
        transactionData.game || "Game"
    );


    // DETAIL PRODUK

    setText(
        "detailProduct",
        transactionData.product || "-"
    );

    // DETAIL USER ID + SERVER

    let fullUserId = "-";


    // Jika sudah ada userIdFull
    if (transactionData.userIdFull) {

        fullUserId =
            transactionData.userIdFull;

    }

    // Jika ada ID dan Server
    else if (
        transactionData.userId &&
        transactionData.server
    ) {

        fullUserId =
            transactionData.userId +
            " (" +
            transactionData.server +
            ")";

    }

    // Jika hanya ID
    else if (transactionData.userId) {

        fullUserId =
            transactionData.userId;

    }


    setText(
        "detailUser",
        fullUserId
    );


    // JUMLAH

    setText(
        "detailQuantity",
        transactionData.jumlah || 1
    );

    // HARGA

    setText(
        "detailPrice",
        formatRupiah(
            transactionData.total
        )
    );


    // METODE PEMBAYARAN DETAIL

    setText(
        "detailPayment",
        transactionData.payment || "-"
    );


    // POINT

    setText(
        "pointValue",
        "+" +
        (transactionData.point || 0) +
        " Poin"
    );

}


// 10. TOMBOL COPY NOMOR TRANSAKSI

function initializeCopyButton() {

    const copyButton =
        document.getElementById(
            "copyTransaction"
        );


    if (!copyButton) {
        return;
    }


    copyButton.addEventListener(
        "click",
        function() {

            const transactionNumber =
                transactionData.transactionNumber;


            if (!transactionNumber) {
                return;
            }


            if (
                navigator.clipboard &&
                navigator.clipboard.writeText
            ) {

                navigator.clipboard.writeText(
                    transactionNumber
                )
                .then(function() {

                    showCopiedText(
                        copyButton
                    );

                })
                .catch(function() {

                    fallbackCopy(
                        transactionNumber,
                        copyButton
                    );

                });

            } else {

                fallbackCopy(
                    transactionNumber,
                    copyButton
                );

            }

        }
    );

}


// 11. TEXT TERSALIN

function showCopiedText(button) {

    button.textContent =
        "Tersalin";


    setTimeout(function() {

        button.textContent =
            "Salin";

    }, 1500);

}


// 12. FALLBACK COPY

function fallbackCopy(text, button) {

    const temporaryInput =
        document.createElement(
            "textarea"
        );


    temporaryInput.value = text;


    document.body.appendChild(
        temporaryInput
    );


    temporaryInput.select();


    try {

        document.execCommand("copy");

        showCopiedText(button);

    } catch (error) {

        alert(
            "Nomor transaksi: " +
            text
        );

    }


    document.body.removeChild(
        temporaryInput
    );

}


// 13. SIMPAN / UPDATE RIWAYAT TRANSAKSI

function saveTransactionToHistory() {

    let transactionHistory = JSON.parse(
        localStorage.getItem(
            "transactionHistory"
        )
    ) || [];


    const existingIndex =
        transactionHistory.findIndex(
            function(transaction) {

                return (
                    transaction.transactionNumber ===
                    transactionData.transactionNumber
                );

            }
        );


    // Jika belum ada
    if (existingIndex === -1) {

        transactionHistory.unshift({
            ...transactionData
        });

    }

    // Jika sudah ada
    else {

        transactionHistory[existingIndex] = {
            ...transactionData
        };

    }


    // Simpan kembali
    localStorage.setItem(
        "transactionHistory",
        JSON.stringify(
            transactionHistory
        )
    );

}

// 14. CEK STATUS TRANSAKSI

function checkTransactionStatus() {

    // JIKA SUDAH SELESAI

    if (
        transactionData.status ===
        "finished"
    ) {

        saveTransactionToHistory();

        showFinishedStatus();

        return;

    }


    // JIKA MASIH DIPROSES

    showProcessingStatus();


    // Durasi proses 5 detik
    const processDuration = 5000;


    const transactionStart =
        new Date(
            transactionData.transactionTime
        ).getTime();


    let remainingTime =
        processDuration;


    // Jika waktu transaksi valid
    if (!isNaN(transactionStart)) {

        const elapsedTime =
            Date.now() -
            transactionStart;


        remainingTime =
            Math.max(
                0,
                processDuration -
                elapsedTime
            );

    }


    // Jika sudah melewati 5 detik
    if (remainingTime <= 0) {

        finishTransaction();

        return;

    }


    // Tunggu sisa waktu
    setTimeout(function() {

        finishTransaction();

    }, remainingTime);

}


// 15. STATUS SEDANG DIPROSES

function showProcessingStatus() {

    // STEP DIPROSES

    const processStep =
        document.getElementById(
            "processStep"
        );


    if (processStep) {

        processStep.classList.add(
            "active"
        );


        processStep.classList.remove(
            "completed"
        );

    }


    // IKON DIPROSES

    const processIcon =
        document.getElementById(
            "processIcon"
        );


    if (processIcon) {

        processIcon.className =
            "bx bx-time-five";

    }


    // STEP SELESAI

    const finishStep =
        document.getElementById(
            "finishStep"
        );


    if (finishStep) {

        finishStep.classList.remove(
            "finished"
        );

    }


    // GARIS KE SELESAI

    const lineTwo =
        document.getElementById(
            "lineTwo"
        );


    if (lineTwo) {

        lineTwo.classList.remove(
            "active"
        );

    }


    // PESAN PROSES

    const processMessage =
        document.getElementById(
            "processMessage"
        );


    if (processMessage) {

        processMessage.classList.remove(
            "finished"
        );

    }


    // IKON PESAN

    const messageIcon =
        document.getElementById(
            "messageIcon"
        );


    if (messageIcon) {

        messageIcon.className =
            "bx bx-time-five";

    }


    // JUDUL PESAN

    setText(
        "messageTitle",
        "Pembelian kamu sedang diproses..."
    );


    // SUBTITLE

    const messageSubtitle =
        document.getElementById(
            "messageSubtitle"
        );


    if (messageSubtitle) {

        messageSubtitle.textContent =
            "";


        messageSubtitle.classList.add(
            "hidden"
        );

    }


    // BADGE STATUS

    const statusBadge =
        document.getElementById(
            "statusBadge"
        );


    if (statusBadge) {

        statusBadge.textContent =
            "SEDANG DIPROSES";


        statusBadge.classList.remove(
            "finished"
        );


        statusBadge.classList.add(
            "processing"
        );

    }

}


// 16. SELESAIKAN TRANSAKSI

function finishTransaction() {

    // Cegah selesai dua kali
    if (
        transactionData.status ===
        "finished"
    ) {

        saveTransactionToHistory();

        showFinishedStatus();

        return;

    }


    // Ubah status
    transactionData.status =
        "finished";


    // Simpan waktu selesai
    transactionData.finishedTime =
        new Date().toISOString();
// TAMBAHKAN POIN KE SALDO POIN

if (!transactionData.pointClaimed) {

    const currentPoint =
        Number(
            localStorage.getItem(
                "infinityPoint"
            )
        ) || 0;


    const earnedPoint =
        Number(
            transactionData.point
        ) || 0;


    const newPoint =
        currentPoint +
        earnedPoint;


    localStorage.setItem(
        "infinityPoint",
        String(newPoint)
    );


    // Tandai agar poin tidak masuk dua kali
    transactionData.pointClaimed = true;


    console.log(
        "Poin masuk:",
        earnedPoint
    );

    console.log(
        "Total poin:",
        newPoint
    );

}


    // Update current transaction
    localStorage.setItem(
        "currentTransaction",
        JSON.stringify(
            transactionData
        )
    );


    // Simpan ke riwayat
    saveTransactionToHistory();


    // Tampilkan selesai
    showFinishedStatus();

}


// 17. STATUS TRANSAKSI SELESAI

function showFinishedStatus() {

    // DIPROSES JADI HIJAU

    const processStep =
        document.getElementById(
            "processStep"
        );


    if (processStep) {

        processStep.classList.remove(
            "active"
        );


        processStep.classList.add(
            "completed"
        );

    }


    // IKON DIPROSES
    const processIcon =
        document.getElementById(
            "processIcon"
        );


    if (processIcon) {

        processIcon.className =
            "bx bx-time-five";

    }

    // GARIS KE SELESAI HIJAU

    const lineTwo =
        document.getElementById(
            "lineTwo"
        );


    if (lineTwo) {

        lineTwo.classList.add(
            "active"
        );

    }

    // STEP SELESAI HIJAU


    const finishStep =
        document.getElementById(
            "finishStep"
        );


    if (finishStep) {

        finishStep.classList.add(
            "finished"
        );

    }

    // PESAN BERHASIL

    const processMessage =
        document.getElementById(
            "processMessage"
        );


    if (processMessage) {

        processMessage.classList.add(
            "finished"
        );

    }


    // IKON CENTANG

    const messageIcon =
        document.getElementById(
            "messageIcon"
        );


    if (messageIcon) {

        messageIcon.className =
            "bx bx-check";

    }


    // JUDUL BERHASIL

    setText(
        "messageTitle",
        "Yeay, Produk udah kamu terima!"
    );


    // SUBTITLE BERHASIL

    const messageSubtitle =
        document.getElementById(
            "messageSubtitle"
        );


    if (messageSubtitle) {

        messageSubtitle.textContent =
            "Transaksi berhasil";


        messageSubtitle.classList.remove(
            "hidden"
        );

    }


    // BADGE STATUS

    const statusBadge =
        document.getElementById(
            "statusBadge"
        );


    if (statusBadge) {

        statusBadge.textContent =
            "SELESAI DIPROSES";


        statusBadge.classList.remove(
            "processing"
        );


        statusBadge.classList.add(
            "finished"
        );

    }

}
