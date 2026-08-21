/* ==========================================================================
   ROLAND HOLIDAYS — DESIGN SYSTEM JS ENGINE (v2.1 Refined)
   Handles: Smooth Kinetic Button Text Rolling, Arrow Badges, and Scroll Reveals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initKineticButtons();
    initScrollReveals();
    initMobileDrawer();
    initWebpOptimizer();
});

/**
 * Automatic WebP Image Optimization Engine
 */
function initWebpOptimizer() {
    function processImages() {
        var images = document.querySelectorAll('img');
        images.forEach(function (img) {
            var src = img.getAttribute('src');
            if (!src) return;

            // 1. Automatic WebP query parameter injection for Unsplash images
            if (src.includes('images.unsplash.com')) {
                if (!src.includes('fm=webp') && !src.includes('format=webp')) {
                    if (src.includes('?')) {
                        img.src = src + '&fm=webp&q=80';
                    } else {
                        img.src = src + '?auto=format&fit=crop&w=1200&q=80&fm=webp';
                    }
                }
            }

            // 2. Ensure high performance lazy loading & async decoding
            if (!img.hasAttribute('loading') && !img.classList.contains('no-lazy')) {
                img.setAttribute('loading', 'lazy');
            }
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });

        // 3. Process background images for WebP support
        var bgEditableElements = document.querySelectorAll('[data-bg-editable="true"], [style*="background"]');
        bgEditableElements.forEach(function (el) {
            var style = el.getAttribute('style');
            if (style && style.includes('images.unsplash.com') && !style.includes('fm=webp')) {
                var updatedStyle = style.replace(/images\.unsplash\.com([^"')\s]+)/g, function(match) {
                    return match.includes('?') ? match + '&fm=webp&q=80' : match + '?auto=format&fit=crop&w=1600&q=80&fm=webp';
                });
                el.setAttribute('style', updatedStyle);
            }
        });
    }

    processImages();
}

/**
 * Mobile Drawer Menu Handler – Ultra-Luxury B2B Travel Portal
 */
function initMobileDrawer() {
    const toggleBtns = document.querySelectorAll('.toggle-nav, .sidebar-bar');
    const mainNavbar = document.querySelector('.main-navbar');
    const navMenu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.menu-overlay');

    if (!mainNavbar) return;

    // 1. Inject Luxury Drawer Header if missing
    if (!mainNavbar.querySelector('.ds-drawer-header')) {
        const drawerHeader = document.createElement('div');
        drawerHeader.className = 'ds-drawer-header';
        drawerHeader.innerHTML = `
            <a href="index.html">
                <img src="./assets/img/logo.png" alt="Roland Holidays" class="ds-drawer-logo">
            </a>
            <button type="button" class="mobile-close-btn" aria-label="Close Menu">
                <i class="fas fa-times"></i>
            </button>
        `;
        mainNavbar.prepend(drawerHeader);
        const closeBtn = drawerHeader.querySelector('.mobile-close-btn');
        if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    }

    // 2. Enhance Navigation Links with Luxury Icons & Chevrons
    const iconMap = {
        'home': 'fas fa-home',
        'about': 'fas fa-compass',
        'destination': 'fas fa-globe-asia',
        'luxury': 'fas fa-umbrella-beach',
        'testimonial': 'fas fa-quote-right',
        'contact': 'fas fa-paper-plane'
    };

    if (navMenu) {
        navMenu.querySelectorAll('li > a').forEach(link => {
            if (!link.querySelector('.nav-link-left')) {
                const text = link.textContent.trim();
                const lower = text.toLowerCase();
                let iconClass = 'fas fa-chevron-right';
                for (const [key, icon] of Object.entries(iconMap)) {
                    if (lower.includes(key)) {
                        iconClass = icon;
                        break;
                    }
                }
                link.innerHTML = `
                    <div class="nav-link-left">
                        <span class="nav-link-icon"><i class="${iconClass}"></i></span>
                        <span class="nav-link-text">${text}</span>
                    </div>
                    <i class="fas fa-chevron-right nav-arrow"></i>
                `;
            }
        });
    }

    // 3. Inject B2B Action Footer if missing
    if (!mainNavbar.querySelector('.ds-drawer-footer')) {
        const drawerFooter = document.createElement('div');
        drawerFooter.className = 'ds-drawer-footer';
        drawerFooter.innerHTML = `
            <a href="tel:+919769421051" class="ds-drawer-btn-call">
                <i class="fas fa-phone-alt"></i> Call Travel Desk
            </a>
            <a href="https://api.whatsapp.com/send?phone=919769421051" target="_blank" class="ds-drawer-btn-wa">
                <i class="fab fa-whatsapp"></i> WhatsApp Support
            </a>
            <p class="ds-drawer-badge">
                <i class="fas fa-shield-alt text-warning me-1"></i> Mumbai Travel Desk | 24/7 B2B
            </p>
        `;
        mainNavbar.appendChild(drawerFooter);
    }

    function openDrawer(e) {
        if (e) e.stopPropagation();
        mainNavbar.classList.add('show');
        if (navMenu) navMenu.classList.add('open');
        if (overlay) overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer(e) {
        if (e) e.stopPropagation();
        mainNavbar.classList.remove('show');
        if (navMenu) navMenu.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', openDrawer);
    });

    if (overlay) {
        overlay.addEventListener('click', closeDrawer);
    }

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDrawer();
    });
}

/**
 * 1. Initialize Avenora Kinetic Pill Buttons
 * Ensures all .ds-btn-kinetic and .primary-button elements have dual-layer
 * rolling text copies and arrow badge structures.
 */
function initKineticButtons() {
    const buttons = document.querySelectorAll('.ds-btn-kinetic, .primary-button');
    
    buttons.forEach(btn => {
        // Ensure inner item main container exists
        let itemMain = btn.querySelector('.button-item-main');
        if (!itemMain) {
            itemMain = document.createElement('div');
            itemMain.className = 'button-item-main';
            while (btn.firstChild) {
                itemMain.appendChild(btn.firstChild);
            }
            btn.appendChild(itemMain);
        }

        // Handle text pill container and dual-layer text creation
        let textPill = itemMain.querySelector('.button-text-pill');
        if (!textPill) {
            textPill = document.createElement('div');
            textPill.className = 'button-text-pill';
            
            const firstText = itemMain.querySelector('.primay-button-text') || document.createElement('div');
            if (!firstText.className) {
                firstText.className = 'primay-button-text';
                firstText.textContent = btn.textContent.trim();
            }
            textPill.appendChild(firstText);
            itemMain.prepend(textPill);
        }

        // Duplicate text element for the vertical roll slide if only 1 text layer exists
        if (textPill && textPill.children.length === 1) {
            const copy = textPill.children[0].cloneNode(true);
            textPill.appendChild(copy);
        }

        // Ensure circular arrow badge exists
        if (!itemMain.querySelector('.button-arrow-pill')) {
            const arrowPill = document.createElement('div');
            arrowPill.className = 'button-arrow-pill';
            arrowPill.innerHTML = '<div class="arrow-wrapper"><i class="fas fa-arrow-right button-arrow"></i></div>';
            itemMain.appendChild(arrowPill);
        }

        // Ensure animated color fill container exists
        if (!btn.querySelector('.button-animated-color')) {
            const fill = document.createElement('div');
            fill.className = 'button-animated-color';
            btn.appendChild(fill);
        }
    });
}

/**
 * 2. Scroll Reveal Observer
 */
function initScrollReveals() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('ds-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.ds-reveal, .strength-card, .facts-card').forEach(el => {
        observer.observe(el);
    });
}
