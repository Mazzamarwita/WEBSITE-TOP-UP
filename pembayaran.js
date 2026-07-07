// ==========================================
// 1. AMBIL DATA TRANSAKSI
// ==========================================

const transactionData = JSON.parse(
    localStorage.getItem("currentTransaction")
);


// ==========================================
// 2. CEK DATA TRANSAKSI
// ==========================================

if (!transactionData) {

    alert("Data transaksi tidak ditemukan!");

    window.location.href = "ML.html";

} else {

    initializePaymentPage();

}


// ==========================================
// 3. FORMAT RUPIAH
// ==========================================

function formatRupiah(number) {

    return "Rp" +
        Number(number || 0).toLocaleString("id-ID");

}


// ==========================================
// 4. FORMAT WAKTU TRANSAKSI
// ==========================================

function formatTransactionTime(dateString) {

    // Kalau tanggal tidak ada
    if (!dateString) {
        return "-";
    }


    const date = new Date(dateString);


    // Kalau tanggal tidak valid
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


// ==========================================
// 5. FUNGSI AMAN MENGISI TEXT
// ==========================================

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent = value;

    }

}


// ==========================================
// 6. INISIALISASI HALAMAN
// ==========================================

function initializePaymentPage() {

    // Tampilkan semua data transaksi
    displayTransactionData();


    // Aktifkan tombol copy
    initializeCopyButton();


    // Cek status transaksi
    checkTransactionStatus();

}


// ==========================================
// 7. TAMPILKAN DATA TRANSAKSI
// ==========================================

function displayTransactionData() {

    // ======================================
    // SUMMARY PRODUK
    // ======================================

    setText(
        "summaryProduct",
        transactionData.product || "-"
    );


    // ======================================
    // TOTAL PEMBAYARAN
    // ======================================

    setText(
        "summaryTotal",
        formatRupiah(
            transactionData.total
        )
    );


    // ======================================
    // METODE PEMBAYARAN SUMMARY
    // ======================================

    setText(
        "summaryPayment",
        transactionData.payment || "-"
    );


    // ======================================
    // NOMOR TRANSAKSI
    // ======================================

    setText(
        "transactionNumber",
        transactionData.transactionNumber || "-"
    );


    // ======================================
    // WAKTU TRANSAKSI
    // ======================================

    setText(
        "transactionTime",
        formatTransactionTime(
            transactionData.transactionTime
        )
    );


    // ======================================
    // DETAIL GAME
    // ======================================

    setText(
        "detailGame",
        transactionData.game ||
        "Mobile Legends"
    );


    // ======================================
    // DETAIL PRODUK
    // ======================================

    setText(
        "detailProduct",
        transactionData.product || "-"
    );


    // ======================================
    // DETAIL USER ID + SERVER
    // ======================================

    let fullUserId = "-";


    // Kalau userIdFull tersedia
    if (transactionData.userIdFull) {

        fullUserId =
            transactionData.userIdFull;

    }

    // Kalau ID dan Server terpisah
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

    // Kalau hanya ID
    else if (transactionData.userId) {

        fullUserId =
            transactionData.userId;

    }


    setText(
        "detailUser",
        fullUserId
    );


    // ======================================
    // JUMLAH
    // ======================================

    setText(
        "detailQuantity",
        transactionData.jumlah || 1
    );


    // ======================================
    // HARGA
    // ======================================
    // Mengikuti desain kamu:
    // yang ditampilkan adalah total akhir

    setText(
        "detailPrice",
        formatRupiah(
            transactionData.total
        )
    );


    // ======================================
    // METODE PEMBAYARAN DETAIL
    // ======================================

    setText(
        "detailPayment",
        transactionData.payment || "-"
    );


    // ======================================
    // POINT
    // ======================================

    setText(
        "pointValue",
        "+" +
        (transactionData.point || 0) +
        " Poin"
    );

}


// ==========================================
// 8. TOMBOL COPY NOMOR TRANSAKSI
// ==========================================

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


            // Kalau Clipboard API tersedia
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


// ==========================================
// 9. TAMPILKAN TEXT TERSALIN
// ==========================================

function showCopiedText(button) {

    button.textContent =
        "Tersalin";


    setTimeout(function() {

        button.textContent =
            "Salin";

    }, 1500);

}


// ==========================================
// 10. FALLBACK COPY
// ==========================================

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


// ==========================================
// 11. SIMPAN / UPDATE RIWAYAT TRANSAKSI
// ==========================================

function saveTransactionToHistory() {

    // Ambil history lama
    let transactionHistory = JSON.parse(
        localStorage.getItem(
            "transactionHistory"
        )
    ) || [];


    // Cari apakah transaksi ini
    // sudah pernah disimpan
    const existingIndex =
        transactionHistory.findIndex(
            function(transaction) {

                return (
                    transaction.transactionNumber ===
                    transactionData.transactionNumber
                );

            }
        );


    // ======================================
    // KALAU BELUM ADA
    // ======================================

    if (existingIndex === -1) {

        // Masukkan ke paling depan
        transactionHistory.unshift(
            {
                ...transactionData
            }
        );

    }


    // ======================================
    // KALAU SUDAH ADA
    // ======================================

    else {

        // Update transaksi lama
        transactionHistory[existingIndex] =
            {
                ...transactionData
            };

    }


    // ======================================
    // SIMPAN KEMBALI
    // ======================================

    localStorage.setItem(
        "transactionHistory",
        JSON.stringify(
            transactionHistory
        )
    );

}


// ==========================================
// 12. CEK STATUS TRANSAKSI
// ==========================================

function checkTransactionStatus() {

    // ======================================
    // JIKA SUDAH SELESAI
    // ======================================

    if (
        transactionData.status ===
        "finished"
    ) {

        // Pastikan transaksi masuk history
        saveTransactionToHistory();


        // Langsung tampil selesai
        showFinishedStatus();


        return;

    }


    // ======================================
    // JIKA MASIH DIPROSES
    // ======================================

    showProcessingStatus();


    // Tunggu 5 detik
    setTimeout(function() {

        finishTransaction();

    }, 5000);

}


// ==========================================
// 13. STATUS SEDANG DIPROSES
// ==========================================

function showProcessingStatus() {

    // ======================================
    // STEP DIPROSES
    // ======================================

    const processStep =
        document.getElementById(
            "processStep"
        );


    if (processStep) {

        // Aktif ungu
        processStep.classList.add(
            "active"
        );


        // Hapus hijau
        processStep.classList.remove(
            "completed"
        );

    }


    // ======================================
    // IKON DIPROSES
    // ======================================

    const processIcon =
        document.getElementById(
            "processIcon"
        );


    if (processIcon) {

        processIcon.className =
            "bx bx-time-five";

    }


    // ======================================
    // STEP SELESAI BELUM AKTIF
    // ======================================

    const finishStep =
        document.getElementById(
            "finishStep"
        );


    if (finishStep) {

        finishStep.classList.remove(
            "finished"
        );

    }


    // ======================================
    // GARIS MENUJU SELESAI
    // ======================================

    const lineTwo =
        document.getElementById(
            "lineTwo"
        );


    if (lineTwo) {

        lineTwo.classList.remove(
            "active"
        );

    }


    // ======================================
    // PESAN PROSES
    // ======================================

    const processMessage =
        document.getElementById(
            "processMessage"
        );


    if (processMessage) {

        processMessage.classList.remove(
            "finished"
        );

    }


    // ======================================
    // IKON PESAN JAM
    // ======================================

    const messageIcon =
        document.getElementById(
            "messageIcon"
        );


    if (messageIcon) {

        messageIcon.className =
            "bx bx-time-five";

    }


    // ======================================
    // JUDUL PESAN
    // ======================================

    setText(
        "messageTitle",
        "Pembelian kamu sedang diproses..."
    );


    // ======================================
    // SUBTITLE DISEMBUNYIKAN
    // ======================================

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


    // ======================================
    // BADGE STATUS
    // ======================================

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


// ==========================================
// 14. SELESAIKAN TRANSAKSI
// ==========================================

function finishTransaction() {

    // ======================================
    // UBAH STATUS
    // ======================================

    transactionData.status =
        "finished";


    // ======================================
    // SIMPAN WAKTU SELESAI
    // ======================================

    transactionData.finishedTime =
        new Date().toISOString();


    // ======================================
    // UPDATE CURRENT TRANSACTION
    // ======================================

    localStorage.setItem(
        "currentTransaction",
        JSON.stringify(
            transactionData
        )
    );


    // ======================================
    // SIMPAN KE DAFTAR TRANSAKSI
    // ======================================

    saveTransactionToHistory();


    // ======================================
    // TAMPILKAN STATUS SELESAI
    // ======================================

    showFinishedStatus();

}


// ==========================================
// 15. STATUS TRANSAKSI SELESAI
// ==========================================

function showFinishedStatus() {

    // ======================================
    // STEP DIPROSES JADI HIJAU
    // ======================================

    const processStep =
        document.getElementById(
            "processStep"
        );


    if (processStep) {

        // Hapus active ungu
        processStep.classList.remove(
            "active"
        );


        // Tambahkan completed hijau
        processStep.classList.add(
            "completed"
        );

    }


    // ======================================
    // IKON DIPROSES
    // ======================================

    const processIcon =
        document.getElementById(
            "processIcon"
        );


    if (processIcon) {

        // Ikon tetap jam
        // background hijau dari CSS completed
        processIcon.className =
            "bx bx-time-five";

    }


    // ======================================
    // GARIS MENUJU SELESAI JADI HIJAU
    // ======================================

    const lineTwo =
        document.getElementById(
            "lineTwo"
        );


    if (lineTwo) {

        lineTwo.classList.add(
            "active"
        );

    }


    // ======================================
    // STEP SELESAI JADI HIJAU
    // ======================================

    const finishStep =
        document.getElementById(
            "finishStep"
        );


    if (finishStep) {

        finishStep.classList.add(
            "finished"
        );

    }


    // ======================================
    // PESAN BERHASIL JADI HIJAU
    // ======================================

    const processMessage =
        document.getElementById(
            "processMessage"
        );


    if (processMessage) {

        processMessage.classList.add(
            "finished"
        );

    }


    // ======================================
    // IKON PESAN JADI CENTANG
    // ======================================

    const messageIcon =
        document.getElementById(
            "messageIcon"
        );


    if (messageIcon) {

        messageIcon.className =
            "bx bx-check";

    }


    // ======================================
    // JUDUL BERHASIL
    // ======================================

    setText(
        "messageTitle",
        "Yeay, Produk udah kamu terima!"
    );


    // ======================================
    // SUBTITLE BERHASIL
    // ======================================

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


    // ======================================
    // BADGE STATUS SELESAI
    // ======================================

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