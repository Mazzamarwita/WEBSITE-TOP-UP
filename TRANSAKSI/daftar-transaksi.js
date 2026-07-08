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
// 3. SINKRONKAN CURRENT KE HISTORY
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


    if (existingIndex === -1) {

        transactionHistory.unshift({
            ...currentTransaction
        });

    } else {

        transactionHistory[existingIndex] = {
            ...currentTransaction
        };

    }


    localStorage.setItem(
        "transactionHistory",
        JSON.stringify(
            transactionHistory
        )
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
// 5. PAGINATION
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

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(dateString);


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
// 8. NORMALISASI KODE GAME
// ==========================================

function normalizeGameCode(gameCode) {

    return String(
        gameCode || ""
    )
    .trim()
    .toUpperCase();

}


// ==========================================
// 9. ICON GAME DINAMIS
//    UNTUK 8 GAME
// ==========================================

function getGameIcon(transaction) {

    // ======================================
    // PRIORITAS 1
    // Gunakan gameIcon dari transaksi
    // ======================================

    if (
        transaction.gameIcon &&
        String(transaction.gameIcon).trim() !== ""
    ) {

        let iconPath =
            String(
                transaction.gameIcon
            ).trim();


        // Kalau sudah relatif naik folder
        if (iconPath.startsWith("../")) {

            return iconPath;

        }


        // Kalau absolute path
        if (iconPath.startsWith("/")) {

            return iconPath;

        }


        // Karena file ini ada di:
        // TRANSAKSI/daftar-transaksi.js
        return "../" + iconPath;

    }


    // ======================================
    // PRIORITAS 2
    // Berdasarkan gameCode
    // ======================================

    const gameCode =
        normalizeGameCode(
            transaction.gameCode
        );


    switch (gameCode) {

        // FREE FIRE
        case "FF":
            return "../img/FFicon.png";


        // MOBILE LEGENDS
        case "ML":
            return "../img/MLicon.png";


        // HONKAI STAR RAIL
        case "HSR":
            return "../img/HSRicon.png";


        // HONOR OF KINGS
        case "HOK":
            return "../img/HOKicon.png";


        // PUBG MOBILE
        case "PUBG":
            return "../img/PUBGicon.png";


        // WUTHERING WAVES
        case "WUWA":
            return "../img/WUWAicon.png";


        // GENSHIN IMPACT
        case "GI":
            return "../img/GIicon.png";


        // ZENLESS ZONE ZERO
        case "ZZZ":
            return "../img/ZZZicon.png";


        // FALLBACK
        default:
            return "../img/MLicon.png";

    }

}


// ==========================================
// 10. FILTER DATA TRANSAKSI
// ==========================================

function getFilteredTransactions() {

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


                    if (
                        isNaN(
                            transactionDate.getTime()
                        )
                    ) {

                        return false;

                    }


                    const difference =
                        now -
                        transactionDate;


                    const differenceDays =
                        difference /
                        (
                            1000 *
                            60 *
                            60 *
                            24
                        );


                    return (
                        differenceDays <=
                        days
                    );

                }
            );

        }

    }


    // ======================================
    // SEARCH
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


                    const gameCode =
                        String(
                            transaction.gameCode || ""
                        ).toLowerCase();


                    const number =
                        String(
                            transaction.transactionNumber || ""
                        ).toLowerCase();


                    const userId =
                        String(
                            transaction.userId || ""
                        ).toLowerCase();


                    const server =
                        String(
                            transaction.server || ""
                        ).toLowerCase();


                    return (
                        product.includes(keyword) ||
                        game.includes(keyword) ||
                        gameCode.includes(keyword) ||
                        number.includes(keyword) ||
                        userId.includes(keyword) ||
                        server.includes(keyword)
                    );

                }
            );

        }

    }


    return filtered;

}


// ==========================================
// 11. TAMPILKAN TRANSAKSI
// ==========================================

function displayTransactions() {

    if (!transactionGrid) {

        console.error(
            "Element #transactionGrid tidak ditemukan!"
        );

        return;

    }


    const filtered =
        getFilteredTransactions();


    transactionGrid.innerHTML = "";


    // ======================================
    // JIKA KOSONG
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
    // SEMBUNYIKAN PESAN KOSONG
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


    if (currentPage > totalPages) {

        currentPage =
            totalPages;

    }


    if (currentPage < 1) {

        currentPage = 1;

    }


    // ======================================
    // POTONG DATA
    // ======================================

    const startIndex =
        (currentPage - 1) *
        itemsPerPage;


    const endIndex =
        startIndex +
        itemsPerPage;


    const pageData =
        filtered.slice(
            startIndex,
            endIndex
        );


    // ======================================
    // BUAT CARD
    // ======================================

    pageData.forEach(
        function(transaction) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "transaction-card";


            // ==================================
            // STATUS
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
            // DATA
            // ==================================

            const game =
                transaction.game ||
                "Game";


            const product =
                transaction.product ||
                "-";


            const transactionNumber =
                transaction.transactionNumber ||
                "-";


            const total =
                transaction.total || 0;


            const gameIcon =
                getGameIcon(
                    transaction
                );


            // ==================================
            // ISI CARD
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
                        src="${gameIcon}"
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
            // FALLBACK JIKA ICON ERROR
            // ==================================

            const imageElement =
                card.querySelector(
                    ".transaction-game-icon"
                );


            if (imageElement) {

                imageElement.addEventListener(
                    "error",
                    function() {

                        this.src =
                            "../img/MLicon.png";

                    },
                    {
                        once: true
                    }
                );

            }


            // ==================================
            // KLIK CARD
            // ==================================

            card.addEventListener(
                "click",
                function() {

                    openTransactionDetail(
                        transactionNumber
                    );

                }
            );


            transactionGrid.appendChild(
                card
            );

        }
    );


    updatePagination(
        totalPages
    );

}


// ==========================================
// 12. BUKA DETAIL TRANSAKSI
// ==========================================

function openTransactionDetail(
    transactionNumber
) {

    const selectedTransaction =
        transactionHistory.find(
            function(transaction) {

                return (
                    transaction.transactionNumber ===
                    transactionNumber
                );

            }
        );


    if (!selectedTransaction) {

        alert(
            "Transaksi tidak ditemukan!"
        );

        return;

    }


    // Simpan transaksi yang diklik
    localStorage.setItem(
        "currentTransaction",
        JSON.stringify(
            selectedTransaction
        )
    );


    // Karena halaman daftar transaksi
    // ada di folder TRANSAKSI
    window.location.href =
        "../pembayaran.html";

}


// ==========================================
// 13. UPDATE PAGINATION
// ==========================================

function updatePagination(totalPages) {

    if (pageNumber) {

        pageNumber.textContent =
            totalPages === 0
                ? "0"
                : String(currentPage);

    }


    if (prevPage) {

        prevPage.disabled =
            currentPage <= 1;

    }


    if (nextPage) {

        nextPage.disabled =
            totalPages === 0 ||
            currentPage >= totalPages;

    }

}


// ==========================================
// 14. PREVIOUS PAGE
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
// 15. NEXT PAGE
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
// 16. FILTER STATUS
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
// 17. FILTER WAKTU
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
// 18. SEARCH
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
// 19. DEBUG
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
// 20. JALANKAN
// ==========================================

displayTransactions();