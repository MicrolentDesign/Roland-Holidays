/* Roland Holidays – Mobile Nav Toggle */
$(document).ready(function () {

    // Open menu
    $(".toggle-nav, .sidebar-bar").on("click", function () {
        $(".nav-menu").css("right", "0px");
        $(".menu-overlay").addClass("show");
        $("body").css("overflow", "hidden");
    });

    // Close via Back button
    $(".mobile-back").on("click", function () {
        $(".nav-menu").css("right", "-410px");
        $(".menu-overlay").removeClass("show");
        $("body").css("overflow", "auto");
    });

    // Close via overlay click
    $(".menu-overlay").on("click", function () {
        $(".nav-menu").css("right", "-410px");
        $(this).removeClass("show");
        $("body").css("overflow", "auto");
    });

});
