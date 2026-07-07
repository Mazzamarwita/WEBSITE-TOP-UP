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

    // Jalankan halaman hanya jika
    // data transaksi ditemukan
    initializePaymentPage();

}


// ==========================================
// 3. FORMAT RUPIAH
// ==========================================

function formatRupiah(number) {

    return "Rp" +
        Number(number).toLocaleString("id-ID");

}


// ==========================================
// 4. FORMAT WAKTU TRANSAKSI
// ==========================================

function formatTransactionTime(dateString) {

    const date = new Date(dateString);


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

    // --------------------------------------
    // SUMMARY PRODUK
    // --------------------------------------

    setText(
        "summaryProduct",
        transactionData.product || "-"
    );


    // --------------------------------------
    // TOTAL PEMBAYARAN
    // --------------------------------------

    setText(
        "summaryTotal",
        formatRupiah(
            transactionData.total || 0
        )
    );


    // --------------------------------------
    // METODE PEMBAYARAN SUMMARY
    // --------------------------------------

    setText(
        "summaryPayment",
        transactionData.payment || "-"
    );


    // --------------------------------------
    // NOMOR TRANSAKSI
    // --------------------------------------

    setText(
        "transactionNumber",
        transactionData.transactionNumber || "-"
    );


    // --------------------------------------
    // WAKTU TRANSAKSI
    // --------------------------------------

    setText(
        "transactionTime",
        formatTransactionTime(
            transactionData.transactionTime
        )
    );


    // --------------------------------------
    // DETAIL GAME
    // --------------------------------------

    setText(
        "detailGame",
        transactionData.game || "Mobile Legends"
    );


    // --------------------------------------
    // DETAIL PRODUK
    // --------------------------------------

    setText(
        "detailProduct",
        transactionData.product || "-"
    );


    // --------------------------------------
    // DETAIL USER ID + SERVER
    // --------------------------------------

    let fullUserId = "-";


    // Jika userIdFull tersedia
    if (transactionData.userIdFull) {

        fullUserId =
            transactionData.userIdFull;

    }

    // Jika userId dan server terpisah
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

    // Jika hanya userId
    else if (transactionData.userId) {

        fullUserId =
            transactionData.userId;

    }


    setText(
        "detailUser",
        fullUserId
    );


    // --------------------------------------
    // JUMLAH
    // --------------------------------------

    setText(
        "detailQuantity",
        transactionData.jumlah || 1
    );


    // --------------------------------------
    // HARGA
    // --------------------------------------
    // Mengikuti desainmu:
    // harga yang ditampilkan adalah total akhir

    setText(
        "detailPrice",
        formatRupiah(
            transactionData.total || 0
        )
    );


    // --------------------------------------
    // METODE PEMBAYARAN DETAIL
    // --------------------------------------

    setText(
        "detailPayment",
        transactionData.payment || "-"
    );


    // --------------------------------------
    // POINT
    // --------------------------------------

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


            // Coba Clipboard API
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
        document.createElement("textarea");


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
// 11. CEK STATUS TRANSAKSI
// ==========================================

function checkTransactionStatus() {

    // Jika transaksi sudah selesai
    if (
        transactionData.status === "finished"
    ) {

        showFinishedStatus();

        return;

    }


    // Jika masih diproses
    showProcessingStatus();


    // Mulai timer 5 detik
    setTimeout(function() {

        finishTransaction();

    }, 5000);

}


// ==========================================
// 12. STATUS SEDANG DIPROSES
// ==========================================

function showProcessingStatus() {

    // --------------------------------------
    // STEP DIPROSES AKTIF UNGU
    // --------------------------------------

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


    // --------------------------------------
    // STEP SELESAI BELUM AKTIF
    // --------------------------------------

    const finishStep =
        document.getElementById(
            "finishStep"
        );


    if (finishStep) {

        finishStep.classList.remove(
            "finished"
        );

    }


    // --------------------------------------
    // GARIS KE SELESAI BELUM HIJAU
    // --------------------------------------

    const lineTwo =
        document.getElementById(
            "lineTwo"
        );


    if (lineTwo) {

        lineTwo.classList.remove(
            "active"
        );

    }


    // --------------------------------------
    // PESAN PROSES
    // --------------------------------------

    const processMessage =
        document.getElementById(
            "processMessage"
        );


    if (processMessage) {

        processMessage.classList.remove(
            "finished"
        );

    }


    // --------------------------------------
    // IKON PESAN JAM
    // --------------------------------------

    const messageIcon =
        document.getElementById(
            "messageIcon"
        );


    if (messageIcon) {

        messageIcon.className =
            "bx bx-time-five";

    }


    // --------------------------------------
    // JUDUL PESAN
    // --------------------------------------

    setText(
        "messageTitle",
        "Pembelian kamu sedang diproses..."
    );


    // --------------------------------------
    // SUBTITLE DISEMBUNYIKAN
    // --------------------------------------

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


    // --------------------------------------
    // BADGE STATUS
    // --------------------------------------

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
// 13. SELESAIKAN TRANSAKSI
// ==========================================

function finishTransaction() {

    // Ubah data status
    transactionData.status =
        "finished";


    // Simpan waktu selesai
    transactionData.finishedTime =
        new Date().toISOString();


    // Simpan kembali ke localStorage
    localStorage.setItem(
        "currentTransaction",
        JSON.stringify(
            transactionData
        )
    );


    // Tampilkan status selesai
    showFinishedStatus();

}


// ==========================================
// 14. STATUS TRANSAKSI SELESAI
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

        // Tetap ikon jam
        // tetapi background menjadi hijau
        // melalui class completed
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
    // SUBTITLE TRANSAKSI BERHASIL
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