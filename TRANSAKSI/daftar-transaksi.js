// ==========================================
// 1. AMBIL RIWAYAT TRANSAKSI
// ==========================================

let transactionHistory = JSON.parse(
    localStorage.getItem("transactionHistory")
) || [];


// ==========================================
// 2. AMBIL TRANSAKSI TERAKHIR
// ==========================================

const currentTransaction = JSON.parse(
    localStorage.getItem("currentTransaction")
);


// ==========================================
// 3. SINKRONKAN CURRENT TRANSACTION
//    KE TRANSACTION HISTORY
// ==========================================

if (
    currentTransaction &&
    currentTransaction.transactionNumber
) {

    const existingIndex =
        transactionHistory.findIndex(
            function(transaction) {

                return (
                    transaction.transactionNumber ===
                    currentTransaction.transactionNumber
                );

            }
        );


    // Kalau transaksi belum ada di history
    if (existingIndex === -1) {

        transactionHistory.unshift({
            ...currentTransaction
        });

    }

    // Kalau sudah ada, update datanya
    else {

        transactionHistory[existingIndex] = {
            ...currentTransaction
        };

    }


    // Simpan kembali ke localStorage
    localStorage.setItem(
        "transactionHistory",
        JSON.stringify(transactionHistory)
    );

}


// ==========================================
// 4. AMBIL ELEMENT HTML
// ==========================================

const transactionGrid =
    document.getElementById(
        "transactionGrid"
    );


const emptyTransaction =
    document.getElementById(
        "emptyTransaction"
    );


const statusFilter =
    document.getElementById(
        "statusFilter"
    );


const timeFilter =
    document.getElementById(
        "timeFilter"
    );


const searchTransaction =
    document.getElementById(
        "searchTransaction"
    );


const prevPage =
    document.getElementById(
        "prevPage"
    );


const nextPage =
    document.getElementById(
        "nextPage"
    );


const pageNumber =
    document.getElementById(
        "pageNumber"
    );


// ==========================================
// 5. PENGATURAN PAGINATION
// ==========================================

let currentPage = 1;

const itemsPerPage = 4;


// ==========================================
// 6. FORMAT RUPIAH
// ==========================================

function formatRupiah(number) {

    return "Rp" +
        Number(number || 0).toLocaleString(
            "id-ID"
        );

}


// ==========================================
// 7. FORMAT TANGGAL
// ==========================================

function formatDate(dateString) {

    // Kalau tanggal tidak tersedia
    if (!dateString) {

        return "-";

    }


    const date =
        new Date(dateString);


    // Kalau format tanggal tidak valid
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


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    const month =
        months[date.getMonth()];


    const year =
        date.getFullYear();


    const hour =
        String(
            date.getHours()
        ).padStart(2, "0");


    const minute =
        String(
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
// 8. AMBIL ICON GAME
// ==========================================

function getGameIcon(game) {

    // Karena daftar-transaksi.js
    // berada di folder TRANSAKSI,
    // maka harus naik satu folder.

    return "../img/MLicon.png";

}


// ==========================================
// 9. FILTER DATA TRANSAKSI
// ==========================================

function getFilteredTransactions() {

    // Salin data history
    let filtered = [
        ...transactionHistory
    ];


    // ======================================
    // FILTER STATUS
    // ======================================

    if (statusFilter) {

        const selectedStatus =
            statusFilter.value;


        if (selectedStatus !== "all") {

            filtered = filtered.filter(
                function(transaction) {

                    return (
                        transaction.status ===
                        selectedStatus
                    );

                }
            );

        }

    }


    // ======================================
    // FILTER WAKTU
    // ======================================

    if (timeFilter) {

        const selectedTime =
            timeFilter.value;


        if (selectedTime !== "all") {

            const days =
                Number(selectedTime);


            const now =
                new Date();


            filtered = filtered.filter(
                function(transaction) {

                    const transactionDate =
                        new Date(
                            transaction.transactionTime
                        );


                    // Tanggal tidak valid
                    if (
                        isNaN(
                            transactionDate.getTime()
                        )
                    ) {

                        return false;

                    }


                    const difference =
                        now - transactionDate;


                    const differenceDays =
                        difference /
                        (
                            1000 *
                            60 *
                            60 *
                            24
                        );


                    return (
                        differenceDays <= days
                    );

                }
            );

        }

    }


    // ======================================
    // SEARCH TRANSAKSI
    // ======================================

    if (searchTransaction) {

        const keyword =
            searchTransaction.value
                .trim()
                .toLowerCase();


        if (keyword !== "") {

            filtered = filtered.filter(
                function(transaction) {

                    const product =
                        String(
                            transaction.product || ""
                        ).toLowerCase();


                    const game =
                        String(
                            transaction.game || ""
                        ).toLowerCase();


                    const number =
                        String(
                            transaction.transactionNumber || ""
                        ).toLowerCase();


                    const userId =
                        String(
                            transaction.userId || ""
                        ).toLowerCase();


                    return (
                        product.includes(keyword) ||
                        game.includes(keyword) ||
                        number.includes(keyword) ||
                        userId.includes(keyword)
                    );

                }
            );

        }

    }


    return filtered;

}


// ==========================================
// 10. TAMPILKAN SEMUA TRANSAKSI
// ==========================================

function displayTransactions() {

    // Pastikan grid ditemukan
    if (!transactionGrid) {

        console.error(
            "Element #transactionGrid tidak ditemukan!"
        );

        return;

    }


    // Ambil data hasil filter
    const filtered =
        getFilteredTransactions();


    // Kosongkan isi grid
    transactionGrid.innerHTML = "";


    // ======================================
    // JIKA TIDAK ADA TRANSAKSI
    // ======================================

    if (filtered.length === 0) {

        if (emptyTransaction) {

            emptyTransaction.classList.add(
                "show"
            );

        }


        updatePagination(0);

        return;

    }


    // ======================================
    // SEMBUNYIKAN EMPTY MESSAGE
    // ======================================

    if (emptyTransaction) {

        emptyTransaction.classList.remove(
            "show"
        );

    }


    // ======================================
    // HITUNG TOTAL HALAMAN
    // ======================================

    const totalPages =
        Math.ceil(
            filtered.length /
            itemsPerPage
        );


    // Kalau current page terlalu besar
    if (currentPage > totalPages) {

        currentPage =
            totalPages;

    }


    // Kalau current page kurang dari 1
    if (currentPage < 1) {

        currentPage = 1;

    }


    // ======================================
    // HITUNG INDEX DATA
    // ======================================

    const startIndex =
        (currentPage - 1) *
        itemsPerPage;


    const endIndex =
        startIndex +
        itemsPerPage;


    // Ambil data sesuai halaman
    const pageData =
        filtered.slice(
            startIndex,
            endIndex
        );


    // ======================================
    // BUAT CARD TRANSAKSI
    // ======================================

    pageData.forEach(
        function(transaction) {

            // Buat article
            const card =
                document.createElement(
                    "article"
                );


            // Tambahkan class
            card.className =
                "transaction-card";


            // ==================================
            // STATUS TRANSAKSI
            // ==================================

            const isFinished =
                transaction.status ===
                "finished";


            const statusText =
                isFinished
                    ? "BERHASIL"
                    : "DIPROSES";


            const statusClass =
                isFinished
                    ? "finished"
                    : "processing";


            // ==================================
            // DATA AMAN
            // ==================================

            const game =
                transaction.game ||
                "Mobile Legends";


            const product =
                transaction.product ||
                "-";


            const transactionNumber =
                transaction.transactionNumber ||
                "-";


            const total =
                transaction.total || 0;


            // ==================================
            // ISI HTML CARD
            // ==================================

            card.innerHTML = `

                <div class="transaction-card-header">

                    <span class="transaction-date">
                        ${formatDate(
                            transaction.transactionTime
                        )}
                    </span>


                    <span
                        class="
                            transaction-status
                            ${statusClass}
                        "
                    >
                        ${statusText}
                    </span>

                </div>


                <div class="transaction-product">

                    <img
                        src="${getGameIcon(game)}"
                        class="transaction-game-icon"
                        alt="${game}"
                    >


                    <div class="transaction-product-info">

                        <span class="transaction-game">
                            ${game}
                        </span>


                        <strong class="transaction-product-name">
                            ${product}
                        </strong>

                    </div>

                </div>


                <div class="transaction-card-footer">

                    <span class="transaction-number">
                        ${transactionNumber}
                    </span>


                    <strong class="transaction-price">
                        ${formatRupiah(total)}
                    </strong>

                </div>

            `;


            // ==================================
            // KETIKA CARD DIKLIK
            // ==================================

            card.addEventListener(
                "click",
                function() {

                    openTransactionDetail(
                        transactionNumber
                    );

                }
            );


            // Masukkan card ke grid
            transactionGrid.appendChild(
                card
            );

        }
    );


    // Update pagination
    updatePagination(
        totalPages
    );

}


// ==========================================
// 11. BUKA DETAIL TRANSAKSI
// ==========================================

function openTransactionDetail(
    transactionNumber
) {

    // Cari transaksi berdasarkan
    // nomor transaksi
    const selectedTransaction =
        transactionHistory.find(
            function(transaction) {

                return (
                    transaction.transactionNumber ===
                    transactionNumber
                );

            }
        );


    // Kalau tidak ditemukan
    if (!selectedTransaction) {

        alert(
            "Transaksi tidak ditemukan!"
        );

        return;

    }


    // ======================================
    // SIMPAN TRANSAKSI YANG DIPILIH
    // ======================================

    localStorage.setItem(
        "currentTransaction",
        JSON.stringify(
            selectedTransaction
        )
    );


    // ======================================
    // BUKA PEMBAYARAN.HTML
    // ======================================
    //
    // daftar-transaksi.html berada:
    // TRANSAKSI/daftar-transaksi.html
    //
    // pembayaran.html berada:
    // PROJECT/pembayaran.html
    //
    // Jadi harus naik satu folder
    // menggunakan ../
    // ======================================

    window.location.href =
        "../pembayaran.html";

}


// ==========================================
// 12. UPDATE PAGINATION
// ==========================================

function updatePagination(totalPages) {

    // Update nomor halaman
    if (pageNumber) {

        pageNumber.textContent =
            totalPages === 0
                ? "0"
                : String(currentPage);

    }


    // Tombol previous
    if (prevPage) {

        prevPage.disabled =
            currentPage <= 1;

    }


    // Tombol next
    if (nextPage) {

        nextPage.disabled =
            totalPages === 0 ||
            currentPage >= totalPages;

    }

}


// ==========================================
// 13. TOMBOL PREVIOUS
// ==========================================

if (prevPage) {

    prevPage.addEventListener(
        "click",
        function() {

            if (currentPage > 1) {

                currentPage--;

                displayTransactions();

            }

        }
    );

}


// ==========================================
// 14. TOMBOL NEXT
// ==========================================

if (nextPage) {

    nextPage.addEventListener(
        "click",
        function() {

            const filtered =
                getFilteredTransactions();


            const totalPages =
                Math.ceil(
                    filtered.length /
                    itemsPerPage
                );


            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                displayTransactions();

            }

        }
    );

}


// ==========================================
// 15. FILTER STATUS
// ==========================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        function() {

            currentPage = 1;

            displayTransactions();

        }
    );

}


// ==========================================
// 16. FILTER WAKTU
// ==========================================

if (timeFilter) {

    timeFilter.addEventListener(
        "change",
        function() {

            currentPage = 1;

            displayTransactions();

        }
    );

}


// ==========================================
// 17. SEARCH TRANSAKSI
// ==========================================

if (searchTransaction) {

    searchTransaction.addEventListener(
        "input",
        function() {

            currentPage = 1;

            displayTransactions();

        }
    );

}


// ==========================================
// 18. DEBUG
// ==========================================

console.log(
    "Current Transaction:",
    currentTransaction
);


console.log(
    "Transaction History:",
    transactionHistory
);


// ==========================================
// 19. JALANKAN HALAMAN
// ==========================================

displayTransactions();