/* ==========================================================================
   ROLAND HOLIDAYS — DESIGN SYSTEM JS ENGINE (v2.1 Refined)
   Handles: Smooth Kinetic Button Text Rolling, Arrow Badges, and Scroll Reveals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initKineticButtons();
    initScrollReveals();
    initMobileDrawer();
});

/**
 * Mobile Drawer Menu Handler
 */
function initMobileDrawer() {
    const toggleBtn = document.querySelector('.toggle-nav');
    const mainNavbar = document.querySelector('.main-navbar');
    const overlay = document.querySelector('.menu-overlay');

    if (!toggleBtn || !mainNavbar) return;

    // Create close button inside mobile navbar if missing
    if (!mainNavbar.querySelector('.mobile-close-btn')) {
        const closeBtn = document.createElement('div');
        closeBtn.className = 'mobile-close-btn';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        mainNavbar.prepend(closeBtn);

        closeBtn.addEventListener('click', closeDrawer);
    }

    function openDrawer() {
        mainNavbar.classList.add('show');
        if (overlay) overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        mainNavbar.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDrawer();
    });

    if (overlay) {
        overlay.addEventListener('click', closeDrawer);
    }
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
