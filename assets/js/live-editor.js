(function () {
    // RLE V3 - PREMIUM REDESIGN
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    // Always load saved content first
    window.addEventListener('DOMContentLoaded', () => {
        loadAllSavedEdits();
        syncNavbarAuth();
    });

    if (!isAdmin) return;

    let editModeActive = false;
    let activeModal = null;

    // Configuration
    const STORAGE_KEYS = {
        TEXT: 'rle_text_',
        IMG: 'rle_img_',
        BG: 'rle_bg_',
        VIDEO: 'rle_video_'
    };

    const pageKey = document.body.getAttribute('data-page-key') || window.location.pathname.split('/').pop().replace('.html', '') || 'index';

    // -- UTILS --
    function getAutoId(el) {
        if (el.getAttribute('data-rle-id')) return el.getAttribute('data-rle-id');
        const tag = el.tagName.toLowerCase();
        const index = Array.from(document.querySelectorAll(tag)).indexOf(el);
        return `id_${tag}_${index}`;
    }

    function getElementScope(el) {
        if (el.closest('header') || el.closest('footer') || el.getAttribute('data-edit-scope') === 'global') return 'global';
        return 'local';
    }

    function getFullKey(id, prefix, el) {
        const scope = getElementScope(el);
        return scope === 'global' ? `${prefix}global_${id}` : `${prefix}${pageKey}_${id}`;
    }

    function showToast(text, type = "success") {
        if (typeof Toastify !== 'undefined') {
            Toastify({
                text: text, duration: 2500, gravity: "top", position: "right",
                style: { background: type === "success" ? "linear-gradient(135deg, #1f6fe5, #0f5ccc)" : "#e23f57" }
            }).showToast();
        }
    }

    function rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent') return '#ffffff';
        const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!match) return '#ffffff';
        const hex = (x) => ("0" + parseInt(x).toString(16)).slice(-2);
        return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
    }

    // -- MODAL SYSTEM --
    function createRLEModal(title, bodyHtml, onSave, options = {}) {
        if (activeModal) activeModal.remove();

        const overlay = document.createElement('div');
        overlay.className = 'rle-modal-overlay';
        overlay.innerHTML = `
            <div class="rle-modal ${options.isSmall ? 'rle-confirm-modal' : ''}">
                <div class="rle-modal-header">
                    <h3 class="rle-modal-title">${title}</h3>
                    <button class="rle-close-btn">&times;</button>
                </div>
                <div class="rle-modal-body">${bodyHtml}</div>
                <div class="rle-modal-footer">
                    <button class="rle-cancel-btn">Cancel</button>
                    <button class="${options.isDanger ? 'rle-danger-btn' : 'rle-save-btn'}">${options.saveText || 'Save Changes'}</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        activeModal = overlay;

        const close = () => { overlay.remove(); activeModal = null; };
        overlay.querySelector('.rle-close-btn').onclick = close;
        overlay.querySelector('.rle-cancel-btn').onclick = close;
        overlay.querySelector(`.${options.isDanger ? 'rle-danger-btn' : 'rle-save-btn'}`).onclick = () => {
            if (onSave(overlay)) close();
        };

        return overlay;
    }

    // -- CORE LOGIC --
    function loadAllSavedEdits() {
        // Text
        document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, li, label, .stat-num, .v-name, .v-agency').forEach(el => {
            const data = localStorage.getItem(getFullKey(getAutoId(el), STORAGE_KEYS.TEXT, el));
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.html) el.innerHTML = parsed.html;
                if (parsed.color) el.style.color = parsed.color;
                if (parsed.size) el.style.fontSize = parsed.size;
            }
        });
        // Images
        document.querySelectorAll('img').forEach(img => {
            const src = localStorage.getItem(getFullKey(getAutoId(img), STORAGE_KEYS.IMG, img));
            if (src) img.src = src;
        });
        // BG
        document.querySelectorAll('[style*="background-image"], .breadcrumb-section, .bg-img-container').forEach(el => {
            const bg = localStorage.getItem(getFullKey(getAutoId(el), STORAGE_KEYS.BG, el));
            if (bg) el.style.backgroundImage = `url('${bg}')`;
        });
        // Video
        document.querySelectorAll('.video-ratio iframe, .video-embed-wrap iframe').forEach(iframe => {
            const wrap = iframe.closest('.video-ratio, .video-embed-wrap');
            const src = localStorage.getItem(getFullKey(getAutoId(wrap), STORAGE_KEYS.VIDEO, wrap));
            if (src) iframe.src = src;
        });
    }

    function openTextEditor(el) {
        const computed = window.getComputedStyle(el);
        const currentHex = rgbToHex(computed.color);
        const body = `
            <div class="rle-toolbar">
                <button type="button" onclick="document.execCommand('bold', false, null)"><i class="fas fa-bold"></i></button>
                <input type="color" id="rleColor" value="${currentHex}">
                <select id="rleSize">
                    <option value="">Font Size</option>
                    ${[14, 16, 18, 20, 24, 28, 32, 48, 64].map(s => `<option value="${s}px" ${computed.fontSize === s + 'px' ? 'selected' : ''}>${s}px</option>`).join('')}
                </select>
            </div>
            <textarea id="rleContent" class="rle-textarea">${el.innerHTML}</textarea>
        `;
        createRLEModal('Edit Content', body, (m) => {
            const html = m.querySelector('#rleContent').value;
            const color = m.querySelector('#rleColor').value;
            const size = m.querySelector('#rleSize').value;

            el.innerHTML = html;
            el.style.color = color;
            if (size) el.style.fontSize = size;

            localStorage.setItem(getFullKey(getAutoId(el), STORAGE_KEYS.TEXT, el), JSON.stringify({ html, color, size }));
            showToast("✓ Saved successfully");
            return true;
        });
    }

    function openMediaEditor(el, type) {
        let currentUrl = "";
        if (type === 'img') currentUrl = el.src;
        else if (type === 'bg') currentUrl = (el.style.backgroundImage.match(/url\(['"]?([^'")\s]+)['"]?\)/) || [])[1];
        else if (type === 'video') currentUrl = el.querySelector('iframe')?.src || "";

        const body = `
            <div class="rle-field">
                <label>Source URL (Image/Video):</label>
                <input type="text" id="rleUrl" class="rle-input" value="${currentUrl}" placeholder="Paste link here...">
            </div>
            ${type !== 'video' ? `
            <div class="rle-field">
                <label>OR Upload from Device:</label>
                <input type="file" id="rleFile" class="rle-input" accept="image/*">
            </div>
            ` : ''}
            ${type !== 'video' ? `<img src="${currentUrl}" class="rle-preview" id="rlePreview">` : ''}
        `;

        const overlay = createRLEModal(`Edit ${type.toUpperCase()}`, body, (m) => {
            const urlInput = m.querySelector('#rleUrl').value.trim();
            if (!urlInput) return false;

            if (type === 'img') el.src = urlInput;
            else if (type === 'bg') el.style.backgroundImage = `url('${urlInput}')`;
            else if (type === 'video') { const ifr = el.querySelector('iframe'); if (ifr) ifr.src = urlInput; }

            const prefix = type === 'img' ? STORAGE_KEYS.IMG : (type === 'bg' ? STORAGE_KEYS.BG : STORAGE_KEYS.VIDEO);
            localStorage.setItem(getFullKey(getAutoId(el), prefix, el), urlInput);
            showToast("✓ Media updated");
            return true;
        });

        // Handle File Upload preview
        const fileInput = overlay.querySelector('#rleFile');
        if (fileInput) {
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (re) => {
                        const base64 = re.target.result;
                        overlay.querySelector('#rleUrl').value = base64;
                        const preview = overlay.querySelector('#rlePreview');
                        if (preview) preview.src = base64;
                    };

                    reader.readAsDataURL(file);
                }
            };
        }
    }


    function toggleEditMode() {
        editModeActive = !editModeActive;
        const btn = document.getElementById('editModeBtn');
        document.body.classList.toggle('rle-edit-mode', editModeActive);
        btn.classList.toggle('active', editModeActive);
        btn.innerHTML = editModeActive ? '<i class="fas fa-check"></i> Exit Save Mode' : '<i class="fas fa-pencil-alt"></i> Edit Mode OFF';

        // Fog & Layering Lock
        const snow = document.querySelector('.snow');
        if (snow) snow.style.opacity = editModeActive ? '0' : '1';

        if (editModeActive) {
            setupActiveEditing();
            showToast("✓ You are now in EDIT MODE", "info");
        } else {
            cleanupActiveEditing();
        }
    }

    function setupActiveEditing() {
        // Text detection
        document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, li, label, .stat-num, .v-name').forEach(el => {
            if (el.id === 'navLoginLink' || el.closest('.edit-mode-toggle')) return;
            el.classList.add('rle-target', 'rle-text-target');
            el.setAttribute('data-rle-badge', 'T');
            el.onclick = (e) => { e.preventDefault(); e.stopPropagation(); openTextEditor(el); };
        });
        // Image detection
        document.querySelectorAll('img').forEach(img => {
            img.classList.add('rle-target', 'rle-media-target');
            img.setAttribute('data-rle-badge', 'IMG');
            img.onclick = (e) => { e.preventDefault(); e.stopPropagation(); openMediaEditor(img, 'img'); };
        });
        // BG detection
        document.querySelectorAll('[style*="background-image"], .breadcrumb-section, .bg-img-container').forEach(el => {
            el.classList.add('rle-target', 'rle-bg-target');
            el.setAttribute('data-rle-badge', 'BG');
            el.onclick = (e) => { e.preventDefault(); e.stopPropagation(); openMediaEditor(el, 'bg'); };
        });
        // Video detection
        document.querySelectorAll('.video-ratio, .video-embed-wrap').forEach(el => {
            el.classList.add('rle-target', 'rle-iframe-target');
            el.setAttribute('data-rle-badge', 'VID');
            el.onclick = (e) => { e.preventDefault(); e.stopPropagation(); openMediaEditor(el, 'video'); };
        });
    }

    function cleanupActiveEditing() {
        document.querySelectorAll('.rle-target').forEach(el => {
            el.classList.remove('rle-target', 'rle-text-target', 'rle-media-target', 'rle-bg-target', 'rle-iframe-target');
            el.removeAttribute('data-rle-badge');
            el.onclick = null;
        });
    }

    function syncNavbarAuth() {
        const loginLink = document.getElementById('navLoginLink');
        if (!loginLink) return;

        if (isAdmin) {
            loginLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout Admin';
            loginLink.classList.add('rle-logout-link');
            loginLink.onclick = (e) => {
                e.preventDefault();
                createRLEModal('Confirm Logout', '<p class="rle-confirm-copy">Are you sure you want to exit the admin portal? Any unsaved browser cache changes might be lost.</p>', () => {
                    localStorage.removeItem('isAdmin');
                    location.reload();
                    return true;
                }, { isDanger: true, isSmall: true, saveText: 'Yes, Logout' });
            };
        }
    }


    // -- INIT --
    window.addEventListener('DOMContentLoaded', () => {
        if (!isAdmin) return;

        const editBtn = document.createElement('button');
        editBtn.id = 'editModeBtn';
        editBtn.className = 'edit-mode-toggle';
        editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i> Edit Mode OFF';
        editBtn.onclick = toggleEditMode;
        document.body.appendChild(editBtn);

        const resetBtn = document.createElement('button');
        resetBtn.className = 'reset-edits-btn';
        resetBtn.innerHTML = '<i class="fas fa-undo"></i> Reset All Data';
        resetBtn.onclick = () => {
            createRLEModal('WIPE ALL DATA?', '<p class="rle-confirm-copy">This will permanently delete all your custom edits across the entire website. This action cannot be undone.</p>', () => {
                localStorage.clear();
                location.reload();
                return true;
            }, { isDanger: true, isSmall: true, saveText: 'Yes, Reset All' });
        };
        document.body.appendChild(resetBtn);
    });
})();
