window.addEventListener('scroll', function () {
    var header = document.querySelector('header.tour-header');
    if (!header) return;
    if (window.scrollY > 60) { header.classList.add('sticky'); }
    else { header.classList.remove('sticky'); }
});
