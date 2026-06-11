/* Roland Holidays – Mobile Nav Toggle */
$(document).ready(function () {

    // Open menu
    $(".toggle-nav, .sidebar-bar").on("click", function () {
        $(".nav-menu").addClass("open");
        $(".menu-overlay").addClass("show");
        $("body").addClass("nav-open");
    });

    // Close via Back button
    $(".mobile-back").on("click", function () {
        $(".nav-menu").removeClass("open");
        $(".menu-overlay").removeClass("show");
        $("body").removeClass("nav-open");
    });

    // Close via overlay click
    $(".menu-overlay").on("click", function () {
        $(".nav-menu").removeClass("open");
        $(this).removeClass("show");
        $("body").removeClass("nav-open");
    });

    // Mobile submenu toggle (accordion)
    $(".main-navbar .nav-menu > li > a").on("click", function (e) {
        if ($(window).width() > 1199) return;
        var $submenu = $(this).siblings(".nav-submenu");
        if ($submenu.length === 0) return;
        e.preventDefault();
        var isOpen = $submenu.hasClass("opensubmenu");
        $(".nav-submenu").removeClass("opensubmenu");
        if (!isOpen) { $submenu.addClass("opensubmenu"); }
    });

});
