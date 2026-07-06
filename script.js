document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // SIDEBAR
    // =========================

    const menuBtn = document.querySelector(".menu-btn");
    const sidebar = document.querySelector(".sidebar");
    const closeSidebar = document.querySelector(".close-sidebar");
    const sidebarOverlay = document.querySelector(".sidebar-overlay");

    // BUKA SIDEBAR
    menuBtn.addEventListener("click", function () {
        sidebar.classList.add("active");
        sidebarOverlay.classList.add("active");
    });

    // TUTUP SIDEBAR DARI TOMBOL X
    closeSidebar.addEventListener("click", function () {
        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");
    });

    // TUTUP SIDEBAR DARI OVERLAY
    sidebarOverlay.addEventListener("click", function () {
        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");
    });


    // =========================
    // BANNER SLIDER
    // =========================

    const slides = document.querySelectorAll(".slider img");
    const dots = document.querySelectorAll(".dot");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    let currentSlide = 0;

    function showSlide(index) {

        slides.forEach(function (slide) {
            slide.classList.remove("active");
        });

        dots.forEach(function (dot) {
            dot.classList.remove("active");
        });

        slides[index].classList.add("active");
        dots[index].classList.add("active");
    }


    // NEXT
    nextBtn.addEventListener("click", function () {

        currentSlide++;

        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }

        showSlide(currentSlide);
    });


    // PREVIOUS
    prevBtn.addEventListener("click", function () {

        currentSlide--;

        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }

        showSlide(currentSlide);
    });


    // DOT INDICATOR
    dots.forEach(function (dot, index) {

        dot.addEventListener("click", function () {

            currentSlide = index;

            showSlide(currentSlide);
        });
    });


    // AUTO SLIDER
    setInterval(function () {

        currentSlide++;

        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }

        showSlide(currentSlide);

    }, 5000);

});