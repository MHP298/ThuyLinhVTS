// ==========================================
// UI-ENGINE.JS: Sidebar A (Mobile 4-Item Bar + Icon Account Dropdown) & Content B
// ==========================================
function renderApp() { renderSidebarA(); renderContentB(); renderBannerSlideshow(); }

function toggleMobileSidebarMenu(forceState) {
    isMobileSidebarOpen = (typeof forceState === 'boolean') ? forceState : !isMobileSidebarOpen;
    if (isMobileSidebarOpen) {
        if (typeof closeAllThemeDropdowns === 'function') closeAllThemeDropdowns();
        if (typeof closeMobileAccountDropdown === 'function') closeMobileAccountDropdown();
    }
    let body = document.getElementById('sidebarMenuBody');
    let backdrop = document.getElementById('mobileMenuBackdrop');
    let btn = document.getElementById('btnMobileMenuExpand');
    let icon = document.getElementById('mobileMenuExpandIcon');

    if (body) body.classList.toggle('mobile-open', isMobileSidebarOpen);
    if (backdrop) backdrop.classList.toggle('open', isMobileSidebarOpen || isMobileThemeOpen || isMobileAccountOpen);
    if (btn) btn.classList.toggle('is-open', isMobileSidebarOpen || btn.dataset.hasActive === '1');
    if (icon) {
        icon.className = isMobileSidebarOpen
            ? 'fa-solid fa-xmark'
            : 'fa-solid fa-bars-staggered';
    }
}

function buildMobileThemeDropdownHtml() {
    let activeLbl = (typeof THEME_LABELS !== 'undefined' && THEME_LABELS[currentThemeKey]) ? THEME_LABELS[currentThemeKey] : 'Nordic';
    let opts = [
        { key: 'nordic', name: 'Nordic Breeze', grad: 'linear-gradient(135deg, #0284c7, #2563eb)' },
        { key: 'lavender', name: 'Lavender Dream', grad: 'linear-gradient(135deg, #7c3aed, #c026d3)' },
        { key: 'sage', name: 'Sage Forest', grad: 'linear-gradient(135deg, #059669, #0d9488)' },
        { key: 'warm', name: 'Warm Sunset', grad: 'linear-gradient(135deg, #d97706, #ea580c)' },
        { key: 'midnight', name: 'Midnight Aurora', grad: 'linear-gradient(135deg, #0f172a, #f43f5e)' }
    ];
    let itemsHtml = opts.map(o => `
        <button type="button" class="theme-option-item ${currentThemeKey === o.key ? 'active-theme' : ''}" data-theme-key="${o.key}" onclick="applyAppTheme('${o.key}', '${o.name.split(' ')[0]}')">
            <span class="theme-dot" style="background: ${o.grad};"></span>
            <span>${o.name}</span>
        </button>
    `).join('');

    return `
        <div class="mobile-theme-wrap" onclick="event.stopPropagation()">
            <button type="button" id="btnMobileThemeSelect" class="m-nav-item ${isMobileThemeOpen ? 'is-open' : ''}" onclick="toggleThemeDropdown(event, 'mobile')" title="Đổi giao diện">
                <i class="fa-solid fa-palette"></i>
                <span class="theme-label-text">${activeLbl}</span>
            </button>
            <div id="themeDropdownMobile" class="theme-dropdown-menu ${isMobileThemeOpen ? 'open' : ''}">
                ${itemsHtml}
            </div>
        </div>
    `;
}

function buildMobileAccountDropdownHtml() {
    if (!currentUser) return '';
    let roleIcon = currentUser.role === 'admin' ? 'fa-solid fa-user-shield' : 'fa-solid fa-circle-user';
    let rolePrefix = currentUser.role === 'admin' ? '👑' : '👤';
    return `
        <div class="mobile-account-wrap" onclick="event.stopPropagation()">
            <button type="button" id="btnMobileAccountSelect" class="m-nav-item ${isMobileAccountOpen ? 'is-open' : ''}" onclick="toggleMobileAccountDropdown(event)" title="Tài khoản: ${currentUser.name}" aria-label="Tài khoản">
                <i class="${roleIcon}"></i>
            </button>
            <div id="accountDropdownMobile" class="account-dropdown-menu ${isMobileAccountOpen ? 'open' : ''}">
                <div class="account-info-header">${rolePrefix} ${currentUser.name}</div>
                <button type="button" class="menu-btn btn-del" style="width:100%; justify-content:center;" onclick="closeAllMobileOverlays(); logout();">
                    <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất
                </button>
            </div>
        </div>
    `;
}

/* ĐỔI MÀU NÚT ĐANG CHỌN + PHÂN CẤP NÚT CON RÕ NÉT + ĐƯA QUẢN LÝ TÀI KHOẢN XUỐNG CUỐI MENU */
function renderSidebarA() {
    let isActive = (viewName) => currentView === viewName ? 'active-tab' : '';
    let secondaryViews = !currentUser
        ? ['noti_list', 'homework_list', 'exam_schedule_view', 'schedule_view', 'album_list', 'forms_user_list']
        : ['admin_post', 'sub_post', 'admin_homework', 'admin_exam_schedule', 'admin_schedule', 'admin_album', 'sub_album', 'admin_banner', 'admin_manage_album', 'admin_create_acc', 'admin_del_acc', 'admin_manage_noti', 'sub_manage_noti', 'trash_noti', 'forms_user_list', 'admin_forms'];
    let hasSecondaryActive = secondaryViews.includes(currentView);

    let mobileBarHtml = '';
    let menuItemsHtml = '';
    let mobileThemeHtml = buildMobileThemeDropdownHtml();

    if (!currentUser) {
        // Thứ tự Mobile Portrait: Trang chủ | Menu | Theme | Đăng nhập
        mobileBarHtml = `
            <div class="mobile-nav-bar guest-bar">
                <button type="button" class="m-nav-item ${isActive('home')}" onclick="switchView('home')">🏠 Trang chủ</button>
                <button type="button" id="btnMobileMenuExpand" data-has-active="${hasSecondaryActive ? '1' : '0'}" class="m-nav-item ${isMobileSidebarOpen || hasSecondaryActive ? 'is-open' : ''}" onclick="toggleMobileSidebarMenu()">
                    <i id="mobileMenuExpandIcon" class="fa-solid ${isMobileSidebarOpen ? 'fa-xmark' : 'fa-bars-staggered'}"></i>
                    <span>Menu</span>
                </button>
                ${mobileThemeHtml}
                <button type="button" class="m-nav-item ${isActive('login')}" onclick="switchView('login')">🔑 Đăng nhập</button>
            </div>
        `;

        menuItemsHtml = `
            <button class="menu-btn mobile-hide-in-grid ${isActive('login')}" onclick="switchView('login')" style="margin-bottom: 2px;">🔑 Đăng nhập</button>
            <h3>Khám Phá</h3>
            <button class="menu-btn mobile-hide-in-grid ${isActive('home')}" onclick="switchView('home')">🏠 Trang chủ</button>
            <button class="menu-btn ${isActive('noti_list')}" onclick="switchView('noti_list')">📢 Xem thông báo</button>
            <button class="menu-btn ${isActive('homework_list')}" onclick="switchView('homework_list')">📚 Xem báo bài</button>
            <button class="menu-btn ${isActive('exam_schedule_view')}" onclick="switchView('exam_schedule_view')">📅 Xem lịch kiểm tra</button>
            <button class="menu-btn ${isActive('schedule_view')}" onclick="switchView('schedule_view')">📅 Xem TKB</button>
            <button class="menu-btn ${isActive('album_list')}" onclick="switchView('album_list')">🖼️ Góc kỷ niệm</button>
            <button class="menu-btn ${isActive('forms_user_list')}" onclick="switchView('forms_user_list')">📂 Danh sách biểu mẫu</button>
        `;
    } else if (currentUser.role === 'admin') {
        let isMediaParentActive = menuState.adminMediaSub || ['admin_album', 'admin_banner', 'admin_manage_album'].includes(currentView);
        let isNotiParentActive = menuState.adminNotiSub || ['admin_manage_noti', 'trash_noti'].includes(currentView);
        let isAccParentActive = menuState.adminAccSub || ['admin_create_acc', 'admin_del_acc'].includes(currentView);

        // Thứ tự Mobile Portrait khi đã đăng nhập: Trang chủ | Menu | Theme | Chỉ Icon Tài khoản
        mobileBarHtml = `
            <div class="mobile-nav-bar">
                <button type="button" class="m-nav-item ${isActive('home')}" onclick="switchView('home')">🏠 Trang chủ</button>
                <button type="button" id="btnMobileMenuExpand" data-has-active="${hasSecondaryActive ? '1' : '0'}" class="m-nav-item ${isMobileSidebarOpen || hasSecondaryActive ? 'is-open' : ''}" onclick="toggleMobileSidebarMenu()">
                    <i id="mobileMenuExpandIcon" class="fa-solid ${isMobileSidebarOpen ? 'fa-xmark' : 'fa-bars-staggered'}"></i>
                    <span>Menu</span>
                </button>
                ${mobileThemeHtml}
                ${buildMobileAccountDropdownHtml()}
            </div>
        `;

        // Dời Quản lý tài khoản xuống cuối menu + làm nổi bật các nút con theo Theme
        menuItemsHtml = `
            <div class="user-badge-box mobile-hide-in-grid">👑 ${currentUser.name}</div>
            <button class="menu-btn mobile-hide-in-grid ${isActive('home')}" onclick="switchView('home')">🏠 Trang chủ</button>
            <button class="menu-btn ${isActive('admin_post')}" onclick="switchView('admin_post')">✍️ Đăng thông báo mới</button>
            <button class="menu-btn ${isActive('admin_homework')}" onclick="switchView('admin_homework')">📖 Đăng báo bài mới</button>
            <button class="menu-btn ${isActive('admin_exam_schedule')}" onclick="switchView('admin_exam_schedule')">📝 Đăng lịch KT</button>
            <button class="menu-btn ${isActive('admin_schedule')}" onclick="switchView('admin_schedule')">📅 Đăng TKB</button>

            <button class="menu-btn ${isMediaParentActive ? 'parent-open' : ''}" onclick="toggleSubMenu('adminMediaSub')">✨ Quản lý ảnh</button>
            <div id="adminMediaSub" class="sub-menu" style="display:${menuState.adminMediaSub ? '' : 'none'};">
                <span class="sub-menu-label">↳ Tùy chọn Quản lý ảnh</span>
                <button class="menu-btn sub-item-btn ${isActive('admin_album')}" onclick="switchView('admin_album')">📷 Đăng ảnh kỷ niệm</button>
                <button class="menu-btn sub-item-btn ${isActive('admin_banner')}" onclick="switchView('admin_banner')">✨ Đăng ảnh banner</button>
                <button class="menu-btn sub-item-btn ${isActive('admin_manage_album')}" onclick="switchView('admin_manage_album')">📁 Danh sách album</button>
            </div>

            <button class="menu-btn ${isNotiParentActive ? 'parent-open' : ''}" onclick="toggleSubMenu('adminNotiSub')">📋 Quản lý thông báo/báo bài</button>
            <div id="adminNotiSub" class="sub-menu" style="display:${menuState.adminNotiSub ? '' : 'none'};">
                <span class="sub-menu-label">↳ Tùy chọn Thông báo & Báo bài</span>
                <button class="menu-btn sub-item-btn ${isActive('admin_manage_noti')}" onclick="switchView('admin_manage_noti')">📜 Đã đăng</button>
                <button class="menu-btn sub-item-btn ${isActive('trash_noti')}" onclick="switchView('trash_noti')">📁 Đã xóa (Thùng rác)</button>
            </div>

            <button class="menu-btn ${isActive('forms_user_list')}" onclick="switchView('forms_user_list')">📂 Danh sách biểu mẫu</button>
            <button class="menu-btn ${isActive('admin_forms')}" onclick="switchView('admin_forms')">📝 Đăng biểu mẫu</button>

            <button class="menu-btn ${isAccParentActive ? 'parent-open' : ''}" onclick="toggleSubMenu('adminAccSub')">👥 Quản lý tài khoản</button>
            <div id="adminAccSub" class="sub-menu" style="display:${menuState.adminAccSub ? '' : 'none'};">
                <span class="sub-menu-label">↳ Tùy chọn Quản lý tài khoản</span>
                <button class="menu-btn sub-item-btn ${isActive('admin_create_acc')}" onclick="switchView('admin_create_acc')">➕ Tạo tài khoản/pass mới</button>
                <button class="menu-btn sub-item-btn ${isActive('admin_del_acc')}" onclick="switchView('admin_del_acc')">🗑️ Danh sách tài khoản</button>
            </div>

            <button class="menu-btn btn-del mobile-hide-in-grid" onclick="logout()" style="margin-top:4px;">🚪 Đăng xuất</button>
        `;
    } else {
        // Thứ tự Mobile Portrait khi tài khoản phụ đăng nhập: Trang chủ | Menu | Theme | Chỉ Icon Tài khoản
        mobileBarHtml = `
            <div class="mobile-nav-bar">
                <button type="button" class="m-nav-item ${isActive('home')}" onclick="switchView('home')">🏠 Trang chủ</button>
                <button type="button" id="btnMobileMenuExpand" data-has-active="${hasSecondaryActive ? '1' : '0'}" class="m-nav-item ${isMobileSidebarOpen || hasSecondaryActive ? 'is-open' : ''}" onclick="toggleMobileSidebarMenu()">
                    <i id="mobileMenuExpandIcon" class="fa-solid ${isMobileSidebarOpen ? 'fa-xmark' : 'fa-bars-staggered'}"></i>
                    <span>Menu</span>
                </button>
                ${mobileThemeHtml}
                ${buildMobileAccountDropdownHtml()}
            </div>
        `;

        menuItemsHtml = `
            <div class="user-badge-box mobile-hide-in-grid">👤 ${currentUser.name}</div>
            <button class="menu-btn mobile-hide-in-grid ${isActive('home')}" onclick="switchView('home')">🏠 Trang chủ</button>
            <button class="menu-btn ${isActive('sub_post')}" onclick="switchView('sub_post')">✍️ Đăng thông báo mới</button>
            <button class="menu-btn ${isActive('admin_homework')}" onclick="switchView('admin_homework')">📖 Đăng báo bài mới</button>
            <button class="menu-btn ${isActive('admin_exam_schedule')}" onclick="switchView('admin_exam_schedule')">📝 Đăng lịch KT</button>
            <button class="menu-btn ${isActive('admin_schedule')}" onclick="switchView('admin_schedule')">📅 Đăng TKB</button>
            <button class="menu-btn ${isActive('sub_album')}" onclick="switchView('sub_album')">📷 Đăng ảnh kỷ niệm</button>
            <button class="menu-btn ${isActive('sub_manage_noti')}" onclick="switchView('sub_manage_noti')">📋 Thông Báo & Báo Bài Đã Đăng</button>
            <button class="menu-btn ${isActive('forms_user_list')}" onclick="switchView('forms_user_list')">📂 Danh sách biểu mẫu</button>
            <button class="menu-btn btn-del mobile-hide-in-grid" onclick="logout()" style="margin-top:4px;">🚪 Đăng xuất</button>
        `;
    }

    document.getElementById('sidebarA').innerHTML = `
        ${mobileBarHtml}
        <div id="sidebarMenuBody" class="sidebar-menu-body ${isMobileSidebarOpen ? 'mobile-open' : ''}">
            ${menuItemsHtml}
        </div>
    `;
}

function toggleSubMenu(id) {
    menuState[id] = !menuState[id];
    for (let k in menuState) { if (k !== id) menuState[k] = false; }
    renderSidebarA();
}

function switchView(view) {
    closeAllMobileOverlays();
    if (currentView === 'admin_post' || currentView === 'sub_post') {
        let t = document.getElementById('postTitle'), c = document.getElementById('postContent'), p = document.getElementById('postPdfInput');
        if (t) tempPostTitle = t.value; if (c) tempPostContent = c.innerHTML; if (p) tempPostPdf = p.value;
    }
    if (currentView === 'admin_homework') {
        let h = document.getElementById('hwContent'), p = document.getElementById('hwPdfInput');
        if (h) tempHwContent = h.innerHTML; if (p) tempHwPdf = p.value;
    }
    if (currentView === 'admin_album' || currentView === 'sub_album') {
        let a = document.getElementById('albumBatchTitle'); if (a) tempAlbumTitle = a.value;
    }
    if (!['admin_create_acc','admin_del_acc','admin_manage_noti','trash_noti','admin_album','admin_banner','admin_manage_album','admin_multi_hw','sub_album','admin_forms','admin_exam_schedule'].includes(view)) {
        menuState.adminAccSub = false; menuState.adminNotiSub = false; menuState.adminMediaSub = false;
    }
    closeSmartAlertModal(); currentView = view; notiPageOffset = 0; homeworkPageOffset = 0;
    if (!['admin_post','sub_post','admin_multi_noti'].includes(view)) { editingNotiId = null; tempPostTitle = ""; tempPostContent = ""; tempPostPdf = ""; currentMultiLinks = []; }
    if (!['admin_homework','admin_multi_hw'].includes(view)) { tempHwContent = ""; tempHwPdf = ""; currentHwMultiLinks = []; }
    if (!['admin_album','sub_album'].includes(view)) { editingAlbumId = null; tempAlbumTitle = ""; currentAlbumLinks = []; }
    if (view !== 'admin_banner') currentBannerLinks = [];
    if (view !== 'admin_exam_schedule') { tempExamList = []; tempHkSubjectList = []; editingExamDocId = null; tempExamFileUrl = ''; adminExamSubTab = ''; }
    renderApp();
}

function renderContentB() {
    let b = document.getElementById('contentB');
    b.innerHTML = '';

    if (currentView === 'welcome_dashboard') {
        let h = new Date().getHours(), isTeacher = (currentUser && (currentUser.role === 'admin' || currentUser.name.includes('GVCN') || currentUser.name.includes('admin')));
        let x = isTeacher ? 'thầy/cô' : 'bạn';
        let y = (h < 12) ? 'ngày tràn đầy năng lượng và vui vẻ!' : (h < 18 ? 'buổi chiều đầy phấn khởi, tươi vui!' : 'buổi tối bình an và một giấc ngủ ngon!');
        let bgStyle = (h < 12) ? 'linear-gradient(135deg, #fff9db 0%, #ffe8cc 50%, #d8f5a2 100%)' : (h < 18 ? 'linear-gradient(135deg, #e3fafc 0%, #c5f6fa 50%, #d0ebff 100%)' : 'linear-gradient(135deg, #f3f0ff 0%, #e5dbff 50%, #dbe4ff 100%)');
        let textColor = (h < 12) ? '#d9480f' : (h < 18 ? '#0c8599' : '#5f3dc4');
        b.innerHTML = `<div class="welcome-card-box" style="background:${bgStyle};"><div class="welcome-greeting-text" style="color:${textColor};">Xin chào ${x}, chúc ${x} một ${y}</div></div>`;
        return;
    }

    if (currentView === 'home') {
        b.innerHTML = `<div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; width:100%; padding:10px 15px;">${getAdaptiveGreetingBanner(true)}<div style="width:100%; max-width:900px; display:flex; flex-direction:column; align-items:center; gap:8px;">${getCrossNotificationBanners('home')}</div></div>`;
        return;
    }

    if (currentView === 'noti_list') {
        let sorted = [...notifications].sort((a,b) => b.id - a.id), sliceNotis = sorted.slice(notiPageOffset, notiPageOffset + 5);
        b.innerHTML = `${getAdaptiveGreetingBanner(false)}${getCrossNotificationBanners('noti_list')}<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;"><h3 style="color:var(--primary); font-size: 0.95rem;">📢 Danh sách thông báo</h3><button class="menu-btn" style="padding:4px 8px; font-size:0.75rem;" onclick="openSearchModal()">🔍 Tìm kiếm</button></div>`;
        if (sliceNotis.length === 0) b.innerHTML += '<p style="color:var(--text-sub); text-align:center; margin-top:20px;">Chưa có thông báo nào.</p>';
        else {
            sliceNotis.forEach(item => {
                let div = document.createElement('div'); div.className = 'card-item';
                div.innerHTML = `<div class="card-info" style="cursor:pointer; flex:1;" onclick="showFullDetail(${item.id})"><h4>Thông báo số ${item.id}: ${item.title}</h4><span>📅 ${item.date} | ✍️ ${item.author}</span></div>`;
                b.appendChild(div);
            });
            let nav = document.createElement('div'); nav.className = 'pagination-bar';
            if (notiPageOffset > 0) nav.innerHTML += `<button class="menu-btn" style="padding:4px 8px; font-size:0.75rem;" onclick="changePage(-5)">⬅️ Trở về</button>`;
            if (notiPageOffset + 5 < sorted.length) nav.innerHTML += `<button class="menu-btn" style="padding:4px 8px; font-size:0.75rem;" onclick="changePage(5)">Xem tiếp ➡️</button>`;
            b.appendChild(nav);
        }
    }
    else if (currentView === 'exam_schedule_view') {
        let validExams = getValidExams(), hkSec = '';
        let hkItem = validExams.find(e => e.hkFileUrl && (e.examType === 'HK1' || e.examType === 'HK2'));
        if (hkItem) {
            let fUrl = hkItem.hkFileUrl, isPdf = fUrl.includes('.pdf') || fUrl.includes('drive.google.com/file') || fUrl.includes('preview');
            let pUrl = isPdf ? parseGoogleDrivePdfEmbed(fUrl) : parseGoogleDriveLink(fUrl), dUrl = isPdf ? parseGoogleDrivePdfDownload(fUrl) : pUrl;
            hkSec = isPdf 
                ? `<div class="pdf-viewer-container" style="margin-bottom:12px;"><div style="display:flex; justify-content:space-between; align-items:center;"><span style="font-weight:bold; font-size:0.85rem; color:var(--primary);">📄 Lịch thi ${hkItem.examType} chính thức (PDF):</span><a href="${dUrl}" target="_blank" class="btn-download">📥 Tải về PDF</a></div><iframe src="${pUrl}" class="pdf-iframe" allow="autoplay"></iframe></div>`
                : `<div style="background:white; border:1px solid var(--border-card); border-radius:8px; padding:10px; margin-bottom:12px; display:flex; flex-direction:column; align-items:center;"><div style="font-weight:bold; font-size:0.85rem; color:var(--primary); margin-bottom:6px; align-self:flex-start;">🖼️ Lịch thi ${hkItem.examType} chính thức (Ảnh):</div><img src="${pUrl}" style="max-width:100%; max-height:420px; object-fit:contain; border-radius:6px; cursor:pointer;" onclick="openZoomModal('${pUrl}')"><a href="${dUrl}" download="LichThi_${hkItem.examType}.png" target="_blank" class="btn-download" style="margin-top:6px;">📥 Tải về ảnh</a></div>`;
        }

        b.innerHTML = `
            ${getAdaptiveGreetingBanner(false)}${getCrossNotificationBanners('exam_schedule_view')}
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
                <h3 style="color:var(--primary); font-size: 0.95rem;">📅 Lịch Kiểm Tra Lớp 11A3</h3>
                <div style="display:flex; gap:6px; align-items:center;">
                    <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background:#ffe3e3; border:1px solid #ffa8a8;"></span> <span style="font-size:0.7rem; color:var(--text-sub);">Còn 1 ngày</span>
                    <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background:#fff3bf; border:1px solid #ffe066;"></span> <span style="font-size:0.7rem; color:var(--text-sub);">Còn 2 ngày</span>
                    <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background:#d3f9d8; border:1px solid #8ce99a;"></span> <span style="font-size:0.7rem; color:var(--text-sub);">Còn 3 ngày</span>
                </div>
            </div>
            ${hkSec}
            <div class="exam-table-wrap">
                <table class="exam-table">
                    <thead><tr><th style="width:18%;">Ngày</th><th style="width:20%;">Môn</th><th style="width:24%;">Loại KT</th><th style="width:38%;">Nội dung kiểm tra</th></tr></thead>
                    <tbody>
                        ${validExams.length === 0 ? '<tr><td colspan="4" style="text-align:center; color:var(--text-sub); padding:20px;">Hiện tại chưa có lịch kiểm tra nào sắp tới.</td></tr>' : ''}
                        ${validExams.map(item => {
                            let diff = getDayDiffFromToday(item.examDate), rClass = (diff === 1) ? 'row-pastel-red' : ((diff === 2) ? 'row-pastel-yellow' : ((diff === 3) ? 'row-pastel-green' : 'row-normal'));
                            let isHk = (item.examType === 'HK1' || item.examType === 'HK2');
                            return `
                                <tr class="${rClass}">
                                    <td><b>${isHk ? 'Theo lịch thi' : formatDateToDDMMYY(item.examDate)}</b></td>
                                    <td><b>${item.subject || '-'}</b></td>
                                    <td>${item.examType || '-'}</td>
                                    <td>
                                        <button type="button" class="btn-view-exam-link" onclick="${isHk ? `openExamHkOverviewModal('${item.docId}')` : `openExamDetailModal('${item.docId}')`}">Xem</button>
                                        <div style="font-size:0.68rem; color:#6c757d; margin-top:3px;">📅 ${item.createdDate || '23/10/26'} | ✍️ ${item.author || 'GVCN'}</div>
                                    </td>
                                </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    else if (currentView === 'admin_exam_schedule') {
        b.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
                <h3 style="color:var(--primary); font-size: 0.95rem; white-space:nowrap;">📝 Lịch Kiểm Tra</h3>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button class="menu-btn" style="${adminExamSubTab === 'add' ? 'background:var(--primary); border:1px solid #ffffff;' : 'background:#2a9d8f;'} padding:6px 12px; font-size:0.78rem;" onclick="setAdminExamTab('add')">➕ Thêm lịch kiểm tra</button>
                    <button class="menu-btn" style="${adminExamSubTab === 'edit' ? 'background:var(--primary); border:1px solid #ffffff;' : 'background:#e76f51;'} padding:6px 12px; font-size:0.78rem;" onclick="setAdminExamTab('edit')">📝 Điều chỉnh lịch kiểm tra</button>
                </div>
            </div>
            <div id="adminExamContentArea" style="width:100%; display:flex; flex-direction:column; gap:8px;"></div>
        `;
        renderAdminExamSubView();
    }
    else if (currentView === 'forms_user_list') {
        b.innerHTML = `${getAdaptiveGreetingBanner(false)}${getCrossNotificationBanners('forms_user_list')}<h3 style="color:var(--primary); font-size: 0.95rem; margin-bottom:8px;">📂 Danh Sách Biểu Mẫu</h3>`;
        if (!formsList || formsList.length === 0) b.innerHTML += '<p style="color:var(--text-sub); text-align:center; margin-top:20px;">Chưa có biểu mẫu nào.</p>';
        else {
            formsList.forEach(f => {
                let isWeb = f.url.includes('.html') || (f.url.includes('http') && !f.url.includes('drive.google.com/file') && !f.url.includes('uc?export=download'));
                let btn = isWeb ? `<a href="${f.url}" target="_blank" class="menu-btn" style="background:#2a9d8f; padding:5px 12px; font-size:0.78rem; text-decoration:none;">👁️ Duyệt biểu mẫu</a>` : `<a href="${parseGoogleDrivePdfDownload(f.url) || f.url}" target="_blank" class="menu-btn" style="padding:5px 12px; font-size:0.78rem; text-decoration:none;">📥 Tải biểu mẫu</a>`;
                b.innerHTML += `<div class="card-item"><div class="card-info" style="flex:1;"><h4>📄 ${f.title}</h4><span>✍️ Đăng bởi: ${f.author || 'GVCN'}</span></div><div>${btn}</div></div>`;
            });
        }
    }
    else if (currentView === 'admin_forms') {
        b.innerHTML = `
            <h3 style="color:var(--primary); font-size: 0.95rem; margin-bottom:8px;">📝 Quản Lý Biểu Mẫu</h3>
            <div style="background:white; padding:14px; border-radius:8px; border:1px solid var(--border-card); margin-bottom:12px;">
                <div class="form-group"><label>Tên biểu mẫu:</label><input type="text" id="formTitleInput" placeholder="Nhập tên biểu mẫu..."></div>
                <div class="form-group"><label>Dán link Drive / URL của biểu mẫu:</label><input type="text" id="formUrlInput" placeholder="Dán link biểu mẫu..."></div>
                <div style="display:flex; justify-content:center; gap:8px; margin-top:8px;">
                    <button class="menu-btn btn-del" style="width:140px; justify-content:center;" onclick="switchView('home')">Hủy</button>
                    <button class="menu-btn" id="btnSubmitForm" style="width:140px; justify-content:center; background:#2a9d8f;" onclick="submitNewForm()">🚀 Đăng Biểu Mẫu</button>
                </div>
            </div>
            <h4 style="color:var(--primary); font-size:0.88rem; margin-bottom:6px;">Danh sách biểu mẫu hiện có:</h4>
            <div id="adminFormsListContainer" style="display:flex; flex-direction:column; gap:6px;"></div>
        `;
        renderAdminFormsList();
    }
    else if (currentView === 'schedule_view') {
        b.innerHTML = `${getAdaptiveGreetingBanner(false)}<h3 style="color:var(--primary); font-size: 0.95rem; margin-bottom:6px;">📅 Thời khóa biểu lớp</h3>`;
        let popAlerts = getCrossNotificationBanners('popup');
        if (popAlerts) setTimeout(() => openSmartAlertModal(popAlerts), 250);
        if (!scheduleUrl) b.innerHTML += '<p style="color:var(--text-sub); text-align:center; margin-top:20px;">Chưa cập nhật Thời khóa biểu.</p>';
        else {
            let pS = parseGoogleDriveLink(scheduleUrl);
            b.innerHTML += `
                <div style="flex:1; display:flex; flex-direction:column; background:white; padding:10px; border-radius:8px; overflow:hidden;">
                    <div style="display:flex; flex-direction:column; align-items:flex-start; margin-bottom:8px; gap:4px;">
                        <span style="font-size:0.82rem; color:#e63946; font-weight:700;">👉 Bạn click vào ảnh TKB để phóng to cho dễ xem hơn nhé!</span>
                        <a href="${pS}" download="ThoiKhoaBieu_11A3.png" class="btn-download" target="_blank">📥 Tải thời khóa biểu</a>
                    </div>
                    <div style="flex:1; width:100%; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                        <img src="${pS}" alt="Thời khóa biểu" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:6px; cursor:pointer;" onclick="openZoomModal('${pS}')" title="Click để phóng to TKB">
                    </div>
                </div>`;
        }
    }
    else if (currentView === 'admin_schedule') {
        b.innerHTML = `
            <h3 style="color:var(--primary); font-size: 0.95rem; margin-bottom:6px;">📅 Đăng / Cập nhật Thời khóa biểu</h3>
            <div style="display:flex; flex:1; gap:12px; overflow:hidden; min-height:0;">
                <div style="flex:1; width:50%; border-radius:8px; border:1px solid var(--border-card); background:#f8f9fa; display:flex; flex-direction:column; overflow:hidden;">
                    <div style="background:#e9ecef; padding:5px 8px; font-size:0.75rem; font-weight:bold; color:var(--primary);">🖼️ Preview TKB (Click để phóng to)</div>
                    <div id="schedulePreviewArea" style="flex:1; width:100%; display:flex; align-items:center; justify-content:center; padding:8px;">${scheduleUrl ? `<img src="${parseGoogleDriveLink(scheduleUrl)}" style="max-width:100%; max-height:100%; object-fit:contain; cursor:pointer;" onclick="openZoomModal('${parseGoogleDriveLink(scheduleUrl)}')">` : '<span style="color:var(--text-sub); font-size:0.8rem;">Chưa có ảnh TKB.</span>'}</div>
                </div>
                <div style="flex:1; width:50%; display:flex; flex-direction:column; justify-content:center; background:white; padding:12px; border-radius:8px; border:1px solid var(--border-card);">
                    <div class="form-group"><label>Dán link ảnh TKB (Drive/URL):</label><input type="text" id="scheduleLinkInput" value="${scheduleUrl.startsWith('http') ? scheduleUrl : ''}" oninput="previewScheduleLink()"></div>
                    <div class="form-group" style="margin-top:6px;"><label>Hoặc tải file từ máy (≤1MB):</label><input type="file" id="scheduleFileInput" accept="image/*" onchange="previewScheduleFileWithCheck(this)"></div>
                    <div style="display:flex; justify-content:center; gap:8px; margin-top:14px;">
                        <button class="menu-btn btn-del" style="flex:1; justify-content:center;" onclick="switchView(currentUser.role === 'admin' ? 'admin_manage_noti' : 'sub_manage_noti')">Hủy</button>
                        <button class="menu-btn" id="btnSubmitTKB" style="flex:1; justify-content:center; background:#2a9d8f;" onclick="saveSchedule()">Đăng</button>
                        <button class="menu-btn btn-del" style="flex:1; justify-content:center;" onclick="deleteSchedule()">Xóa</button>
                    </div>
                </div>
            </div>
        `;
    }
    else if (currentView === 'homework_list') {
        let sortedHw = [...homeworks].sort((a,b) => b.id - a.id), sliceHw = sortedHw.slice(homeworkPageOffset, homeworkPageOffset + 5);
        b.innerHTML = `${getAdaptiveGreetingBanner(false)}${getCrossNotificationBanners('homework_list')}<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;"><h3 style="color:var(--primary); font-size: 0.95rem;">📚 Danh sách báo bài</h3></div>`;
        if (sliceHw.length === 0) b.innerHTML += '<p style="color:var(--text-sub); text-align:center; margin-top:20px;">Chưa có nội dung báo bài nào.</p>';
        else {
            sliceHw.forEach(item => {
                let div = document.createElement('div'); div.className = 'card-item';
                div.innerHTML = `<div class="card-info" style="cursor:pointer; flex:1;" onclick="showHwDetail(${item.id})"><h4>${item.title}</h4><span>📅 ${item.date} | ✍️ ${item.author}</span></div>`;
                b.appendChild(div);
            });
            let nav = document.createElement('div'); nav.className = 'pagination-bar';
            if (homeworkPageOffset > 0) nav.innerHTML += `<button class="menu-btn" style="padding:4px 8px; font-size:0.75rem;" onclick="changeHwPage(-5)">⬅️ Trở về</button>`;
            if (homeworkPageOffset + 5 < sortedHw.length) nav.innerHTML += `<button class="menu-btn" style="padding:4px 8px; font-size:0.75rem;" onclick="changeHwPage(5)">Xem tiếp ➡️</button>`;
            b.appendChild(nav);
        }
    }
    else if (currentView === 'homework_detail') {
        let item = homeworks.find(h => h.id === window.currentHwId);
        if (!item) { switchView('homework_list'); return; }
        let pdf = item.pdfUrl ? `<div class="pdf-viewer-container"><div style="display:flex; justify-content:space-between; align-items:center;"><span style="font-weight:bold; font-size:0.85rem; color:var(--primary);">📄 Tài liệu PDF đính kèm:</span><a href="${parseGoogleDrivePdfDownload(item.pdfUrl)}" target="_blank" class="btn-download">📥 Tải về PDF</a></div><iframe src="${parseGoogleDrivePdfEmbed(item.pdfUrl)}" class="pdf-iframe" allow="autoplay"></iframe></div>` : '';
        b.innerHTML = `${getAdaptiveGreetingBanner(false)}${getCrossNotificationBanners('homework_detail')}<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;"><button class="menu-btn" style="padding:5px 10px; font-size:0.8rem;" onclick="switchView('homework_list')">⬅️ Quay lại</button><span style="font-size:0.75rem; color:var(--text-sub);">📅 ${item.date}</span></div><div style="background:white; padding:14px; border-radius:8px;"><h3 style="color:var(--primary); margin-bottom:4px; font-size:1.05rem;">${item.title}</h3><p style="font-size:0.78rem; color:var(--accent); margin-bottom:10px;">Đăng bởi: <b>${item.author}</b></p><hr style="border:0; border-top:1px solid var(--border-card); margin-bottom:10px;"><div style="font-size:0.9rem; line-height:1.5;">${item.content}</div>${pdf}</div>`;
    }
    else if (currentView === 'full_detail') {
        let item = notifications.find(n => n.id === window.currentDetailId);
        if (!item) { switchView('noti_list'); return; }
        let urls = Array.isArray(item.mediaUrl) ? item.mediaUrl : (typeof item.mediaUrl === 'string' && item.mediaUrl ? item.mediaUrl.split('\n').filter(u => u.trim()) : []);
        let pagesHtml = urls.length > 0 ? `<div class="doc-page-container">` + urls.map((u, idx) => {
            let pU = parseGoogleDriveLink(u.trim());
            return `<div class="doc-page-item"><img src="${pU}" class="doc-page-img" onclick="openZoomModal('${pU}')"><div class="doc-page-footer"><span style="font-size:0.75rem; font-weight:bold; color:var(--primary);">Trang ${idx + 1} / ${urls.length}</span><a href="${pU}" download="anh_${item.id}_${idx + 1}.png" class="btn-download" target="_blank">📥 Download</a></div></div>`;
        }).join('') + `</div>` : '';
        let pdf = item.pdfUrl ? `<div class="pdf-viewer-container"><div style="display:flex; justify-content:space-between; align-items:center;"><span style="font-weight:bold; font-size:0.85rem; color:var(--primary);">📄 PDF đính kèm:</span><a href="${parseGoogleDrivePdfDownload(item.pdfUrl)}" target="_blank" class="btn-download">📥 Tải về</a></div><iframe src="${parseGoogleDrivePdfEmbed(item.pdfUrl)}" class="pdf-iframe" allow="autoplay"></iframe></div>` : '';
        b.innerHTML = `${getAdaptiveGreetingBanner(false)}${getCrossNotificationBanners('full_detail')}<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;"><button class="menu-btn" style="padding:5px 10px; font-size:0.8rem;" onclick="switchView('noti_list')">⬅️ Quay lại</button><span style="font-size:0.75rem; color:var(--text-sub);">📅 ${item.date}</span></div><div style="background:white; padding:14px; border-radius:8px;"><h3 style="color:var(--primary); margin-bottom:4px; font-size:1.05rem;">Thông báo số ${item.id}: ${item.title}</h3><p style="font-size:0.78rem; color:var(--accent); margin-bottom:10px;">Đăng bởi: <b>${item.author}</b></p><hr style="border:0; border-top:1px solid var(--border-card); margin-bottom:10px;">${item.content && item.content !== "<br>" ? `<div style="font-size:0.92rem; line-height:1.6; margin-bottom:8px;">${item.content}</div>` : ''}${pagesHtml}${pdf}</div>`;
    }
    else if (currentView === 'album_list') {
        b.innerHTML = `${getAdaptiveGreetingBanner(false)}<h3 style="color:var(--primary); font-size: 0.95rem; margin-bottom:6px;">🖼️ Góc kỷ niệm</h3>`;
        let popAlerts = getCrossNotificationBanners('popup');
        if (popAlerts) setTimeout(() => openSmartAlertModal(popAlerts), 250);
        if (albums.length === 0) b.innerHTML += '<p style="color:var(--text-sub); text-align:center; margin-top:20px;">Chưa có ảnh kỷ niệm nào.</p>';
        else {
            if (albumIndex >= albums.length) albumIndex = 0; if (albumIndex < 0) albumIndex = albums.length - 1;
            let alb = albums[albumIndex], pA = parseGoogleDriveLink(alb.mediaUrl);
            let mediaRender = (alb.type === 'video' || (alb.mediaUrl && alb.mediaUrl.endsWith('.mp4'))) ? `<video controls style="width:100%; max-height:480px; border-radius:6px;"><source src="${pA}" type="video/mp4"></video>` : `<img src="${pA}" style="width:100%; max-height:480px; object-fit:contain; border-radius:6px; cursor:pointer;" onclick="openZoomModal('${pA}')">`;
            b.innerHTML += `<div style="background:white; padding:12px; border-radius:8px; text-align:center; display:flex; flex-direction:column; align-items:center;"><h4 style="color:var(--primary); margin-bottom:4px;">${alb.title}</h4><p style="font-size:0.75rem; color:var(--text-sub); margin-bottom:8px;">Đăng bởi: ${alb.author} (${albumIndex + 1} / ${albums.length})</p><div style="width:100%; display:flex; justify-content:center;">${mediaRender}</div></div><div class="pagination-bar" style="margin-top:8px;"><button class="menu-btn" style="padding:6px 14px; font-size:0.82rem;" onclick="changeAlbum(-1)" ${albumIndex === 0 ? 'disabled style="opacity:0.5;"' : ''}>⬅️ Ảnh trước</button><button class="menu-btn" style="padding:6px 14px; font-size:0.82rem;" onclick="changeAlbum(1)" ${albumIndex === albums.length - 1 ? 'disabled style="opacity:0.5;"' : ''}>Ảnh sau ➡️</button></div>`;
        }
    }
    else if (currentView === 'login') {
        b.innerHTML = `
            <div style="max-width:280px; margin: 20px auto; width:100%; display:flex; flex-direction:column; gap:8px;">
                <h3 style="color:var(--primary); text-align:center; font-size: 1rem;">🔑 Đăng Nhập</h3>
                <div class="form-group"><label>Tên tài khoản:</label><input type="text" id="loginUser" placeholder="Nhập tên tài khoản..."></div>
                <div class="form-group"><label>Mật khẩu:</label><div class="password-wrapper"><input type="password" id="loginPass" placeholder="Nhập mật khẩu..."><button type="button" class="toggle-password" onclick="togglePasswordVisibility()">👁️</button></div></div>
                <button class="menu-btn" style="justify-content:center; margin-top:4px; background: var(--grad-primary);" onclick="handleLogin()">Xác Nhận</button>
            </div>
        `;
    }
    else if (currentView === 'admin_post' || currentView === 'sub_post') {
        let isEditing = editingNotiId !== null, editTitle = tempPostTitle, editContent = tempPostContent, editPdf = tempPostPdf;
        if (isEditing && !tempPostTitle && !tempPostContent) {
            let item = notifications.find(n => n.id === editingNotiId);
            if (item) { editTitle = item.title; editContent = item.content; editPdf = item.pdfUrl || ""; currentMultiLinks = Array.isArray(item.mediaUrl) ? [...item.mediaUrl] : (item.mediaUrl ? item.mediaUrl.split('\n').filter(l => l.trim()) : []); }
        }
        b.innerHTML = `
            <h3 style="color:var(--primary); font-size: 0.95rem; margin-bottom:6px;">${isEditing ? '✏️ Chỉnh Sửa Thông Báo' : '✍️ Đăng Thông Báo Mới'}</h3>
            <div class="form-group"><label>Tiêu đề:</label><input type="text" id="postTitle" value="${editTitle}" placeholder="Tiêu đề..."></div>
            <div class="form-group"><label>Nội dung:</label><div class="editor-toolbar"><button type="button" onclick="toggleFormat(this, 'bold')"><b>B</b></button><button type="button" onclick="toggleFormat(this, 'italic')"><i>I</i></button><button type="button" onclick="toggleFormat(this, 'underline')"><u>U</u></button><button type="button" onclick="toggleAlign(this, 'justifyLeft')">Canh trái</button><button type="button" onclick="toggleAlign(this, 'justifyCenter')">Canh giữa</button><button type="button" onclick="toggleAlign(this, 'justifyRight')">Canh phải</button><button type="button" onclick="toggleAlign(this, 'justifyFull')">Canh đều</button><label class="color-picker-label">🎨 Màu: <input type="color" onchange="changeTextColor(this.value)" value="#1d3557"></label></div><div id="postContent" class="rich-editor" contenteditable="true">${editContent}</div></div>
            <div class="form-group" style="display:flex; flex-direction:row; align-items:center; flex-wrap:wrap; gap:6px;">
                <div style="flex:1; min-width:180px; display:flex; flex-direction:column; gap:3px;">
                    <label>Tải file từ máy (≤1MB):</label>
                    <input type="file" id="postMediaFile" accept="image/*,video/mp4" multiple onchange="checkDirectFileSizeLimit(this)">
                </div>
                <button type="button" class="menu-btn" style="background:#2a9d8f; align-self:flex-end; padding:6px 10px; font-size:0.75rem; white-space:nowrap;" onclick="switchView('admin_multi_noti')">🖼️ Dán link Drive / URL</button>
            </div>
            <div class="form-group"><label>Đường dẫn Google Drive file PDF:</label><input type="text" id="postPdfInput" value="${editPdf}" placeholder="Link Drive PDF..."></div>
            <div style="display:flex; justify-content:center; gap:12px; margin-top:6px;"><button class="menu-btn btn-del" style="width:140px; justify-content:center;" onclick="switchView('home')">Hủy</button><button class="menu-btn" style="width:140px; justify-content:center; background:#2a9d8f;" onclick="submitNotification()">${isEditing ? 'Lưu Thay Đổi' : 'Đăng Ngay'}</button></div>
        `;
    }
    else if (currentView === 'admin_multi_noti') {
        b.innerHTML = `<h3 style="color:var(--primary); font-size: 0.95rem; margin-bottom:6px;">Đăng link ảnh (Thông báo)</h3><div style="display:flex; flex:1; gap:12px; overflow:hidden;"><div style="flex:1.2; display:flex; flex-direction:column; background:white; padding:12px; border-radius:8px; border:1px solid var(--border-card);"><div id="multiNotiLinksContainer" style="display:flex; flex-direction:column; gap:6px; max-height:250px; overflow-y:auto; flex:1;"></div><div style="display:flex; justify-content:center; gap:8px; margin-top:6px;"><button class="menu-btn btn-del" onclick="switchView(currentUser.role === 'admin' ? 'admin_post' : 'sub_post')">Quay lại</button><button class="menu-btn" style="background:#2a9d8f;" onclick="submitMultiNotiImages()">🚀 Xong & Tiếp tục</button></div></div><div style="flex:1; border-radius:8px; border:1px solid var(--border-card); background:#f8f9fa; display:flex; flex-direction:column; overflow:hidden;"><div style="background:#e9ecef; padding:5px 8px; font-size:0.75rem; font-weight:bold;">🖼️ Preview</div><div id="multiNotiPreviewBox" style="flex:1; display:flex; align-items:center; justify-content:center; padding:8px;"><span style="font-size:0.8rem; color:var(--text-sub);">Chưa có ảnh</span></div></div></div>`;
        initMultiNotiRows();
    }
    else if (currentView === 'admin_homework') {
        b.innerHTML = `
            <h3 style="color:var(--primary); font-size: 0.95rem; margin-bottom:6px;">📖 Đăng Báo Bài Mới</h3>
            <div class="form-group"><label>Tiêu đề:</label><input type="text" id="hwTitle" value="${getCalculatedHomeworkTitle()}" readonly style="font-weight:bold; color:var(--primary);"></div>
            <div class="form-group"><label>Nội dung:</label><div class="editor-toolbar"><button type="button" onclick="toggleFormat(this, 'bold')"><b>B</b></button><button type="button" onclick="toggleFormat(this, 'italic')"><i>I</i></button><button type="button" onclick="toggleFormat(this, 'underline')"><u>U</u></button><button type="button" onclick="toggleAlign(this, 'justifyLeft')">Canh trái</button><button type="button" onclick="toggleAlign(this, 'justifyCenter')">Canh giữa</button><button type="button" onclick="toggleAlign(this, 'justifyRight')">Canh phải</button><button type="button" onclick="toggleAlign(this, 'justifyFull')">Canh đều</button><label class="color-picker-label">🎨 Màu: <input type="color" onchange="changeTextColor(this.value)" value="#1d3557"></label></div><div id="hwContent" class="rich-editor" contenteditable="true">${tempHwContent}</div></div>
            <div class="form-group" style="display:flex; flex-direction:row; align-items:center; flex-wrap:wrap; gap:6px;">
                <div style="flex:1; min-width:180px; display:flex; flex-direction:column; gap:3px;">
                    <label>Tải file từ máy (≤1MB):</label>
                    <input type="file" id="hwMediaFile" accept="image/*,video/mp4" multiple onchange="checkDirectFileSizeLimit(this)">
                </div>
                <button type="button" class="menu-btn" style="background:#2a9d8f; align-self:flex-end; padding:6px 10px; font-size:0.75rem; white-space:nowrap;" onclick="switchView('admin_multi_hw')">🖼️ Dán link Drive / URL</button>
            </div>
            <div class="form-group"><label>Link Drive file PDF:</label><input type="text" id="hwPdfInput" value="${tempHwPdf}" placeholder="Link Drive PDF..."></div>
            <div style="display:flex; justify-content:center; gap:12px; margin-top:6px;"><button class="menu-btn btn-del" style="width:140px; justify-content:center;" onclick="switchView('home')">Hủy</button><button class="menu-btn" style="width:140px; justify-content:center; background:#2a9d8f;" onclick="submitHomework(event)">Đăng</button></div>
        `;
    }
    else if (currentView === 'admin_multi_hw') {
        b.innerHTML = `<h3 style="color:var(--primary); font-size: 0.95rem; margin-bottom:6px;">Đăng link ảnh (Báo bài)</h3><div style="display:flex; flex:1; gap:12px; overflow:hidden;"><div style="flex:1.2; display:flex; flex-direction:column; background:white; padding:12px; border-radius:8px; border:1px solid var(--border-card);"><div id="multiHwLinksContainer" style="display:flex; flex-direction:column; gap:6px; max-height:250px; overflow-y:auto; flex:1;"></div><div style="display:flex; justify-content:center; gap:8px; margin-top:6px;"><button class="menu-btn btn-del" onclick="switchView('admin_homework')">Quay lại</button><button class="menu-btn" style="background:#2a9d8f;" onclick="submitMultiHwImages()">🚀 Xong & Tiếp tục</button></div></div><div style="flex:1; border-radius:8px; border:1px solid var(--border-card); background:#f8f9fa; display:flex; flex-direction:column; overflow:hidden;"><div style="background:#e9ecef; padding:5px 8px; font-size:0.75rem; font-weight:bold;">🖼️ Preview</div><div id="multiHwPreviewBox" style="flex:1; display:flex; align-items:center; justify-content:center; padding:8px;"><span style="font-size:0.8rem; color:var(--text-sub);">Chưa có ảnh</span></div></div></div>`;
        initMultiHwRows();
    }
    else if (currentView === 'admin_album' || currentView === 'sub_album') {
        let isAlbEditing = editingAlbumId !== null, albTitleVal = tempAlbumTitle; 
        if (isAlbEditing && !tempAlbumTitle) {
            let albItem = albums.find(a => a.docId === editingAlbumId || a.id === editingAlbumId);
            if (albItem) { albTitleVal = albItem.title.replace(/\s\(\d+\/\d+\)$/, ''); currentAlbumLinks = [albItem.mediaUrl]; }
        }
        b.innerHTML = `
            <h3 style="color:var(--primary); font-size: 0.95rem; margin-bottom:6px;">📷 ${isAlbEditing ? 'Chỉnh Sửa Album' : 'Đăng Ảnh Kỷ Niệm'}</h3>
            <div class="form-group"><label>Tên Album:</label><input type="text" id="albumBatchTitle" value="${albTitleVal}" placeholder="Tên album..."></div>
            <div style="display:flex; flex:1; gap:12px; overflow:hidden;"><div style="flex:1.2; display:flex; flex-direction:column; background:white; padding:10px; border-radius:8px; border:1px solid var(--border-card);"><label style="font-weight:600; font-size:0.75rem;">Link ảnh (Drive/URL):</label><div id="multiAlbumLinksContainer" style="display:flex; flex-direction:column; gap:6px; flex:1; max-height:230px; overflow-y:auto;"></div></div><div style="flex:1; border-radius:8px; border:1px solid var(--border-card); background:#f8f9fa; display:flex; flex-direction:column; overflow:hidden;"><div style="background:#e9ecef; padding:5px 8px; font-size:0.75rem; font-weight:bold;">🖼️ Preview</div><div id="multiAlbumPreviewBox" style="flex:1; display:flex; align-items:center; justify-content:center; padding:8px;"><span style="font-size:0.8rem; color:var(--text-sub);">Chưa có ảnh</span></div></div></div>
            <div style="display:flex; justify-content:center; gap:12px; margin-top:8px;"><button class="menu-btn btn-del" style="flex:1; max-width:180px; justify-content:center;" onclick="switchView(currentUser.role === 'admin' ? 'admin_manage_album' : 'home')">Hủy</button><button class="menu-btn btn-del" style="flex:1; max-width:180px; justify-content:center;" onclick="clearAlbumInputs()">🗑️ Xóa Tất Cả</button><button class="menu-btn" style="flex:1; max-width:180px; justify-content:center; background:#2a9d8f;" onclick="submitDynamicBatchAlbum()">${isAlbEditing ? '💾 Lưu' : '🚀 Đăng'}</button></div>
        `;
        initMultiAlbumRows();
    }
    else if (currentView === 'admin_banner') {
        b.innerHTML = `
            <h3 style="color:var(--primary); font-size: 0.95rem; margin-bottom:6px;">✨ Đăng Ảnh Banner</h3>
            <div class="form-group"><label>Tải file từ máy (≤1MB):</label><input type="file" id="bannerFileInput" accept="image/*" onchange="previewBannerFileWithCheck(this)"></div>
            <div style="display:flex; flex:1; gap:12px; overflow:hidden;"><div style="flex:1.2; display:flex; flex-direction:column; background:white; padding:10px; border-radius:8px; border:1px solid var(--border-card);"><label style="font-weight:600; font-size:0.75rem;">Link ảnh banner (Drive/URL):</label><div id="multiBannerLinksContainer" style="display:flex; flex-direction:column; gap:6px; flex:1; max-height:230px; overflow-y:auto;"></div></div><div style="flex:1; border-radius:8px; border:1px solid var(--border-card); background:#f8f9fa; display:flex; flex-direction:column; overflow:hidden;"><div style="background:#e9ecef; padding:5px 8px; font-size:0.75rem; font-weight:bold;">🖼️ Preview</div><div id="multiBannerPreviewBox" style="flex:1; display:flex; align-items:center; justify-content:center; padding:8px;"><span style="font-size:0.8rem; color:var(--text-sub);">Chưa có ảnh</span></div></div></div>
            <div style="display:flex; justify-content:center; gap:12px; margin-top:8px;"><button class="menu-btn btn-del" style="flex:1; max-width:180px; justify-content:center;" onclick="switchView('home')">Hủy</button><button class="menu-btn btn-del" style="flex:1; max-width:180px; justify-content:center;" onclick="clearBanners()">🗑️ Xóa Tất Cả</button><button class="menu-btn" style="flex:1; max-width:180px; justify-content:center; background:#2a9d8f;" onclick="saveDynamicBanners()">🚀 Lưu Danh Sách</button></div>
        `;
        currentBannerLinks = banners.length > 0 ? [...banners] : [];
        initMultiBannerRows();
    }
    else if (currentView === 'admin_manage_album') {
        b.innerHTML = `<h3 style="color:var(--primary); font-size: 0.95rem; margin-bottom:8px;">📁 Danh Sách Album Kỷ Niệm</h3>`;
        if (albums.length === 0) b.innerHTML += '<p style="color:var(--text-sub); text-align:center; margin-top:20px;">Chưa có album nào.</p>';
        else {
            albums.forEach((alb, idx) => {
                b.innerHTML += `<div class="card-item"><div class="card-info" style="flex:1;"><h4>[Album ${idx + 1}] ${alb.title}</h4><span>✍️ Đăng bởi: ${alb.author}</span></div><div style="display:flex; align-items:center; gap:5px;"><button class="menu-btn btn-edit" onclick="startEditAlbum('${alb.docId}')">Sửa</button><button class="menu-btn btn-del" onclick="deleteAlbumItem('${alb.docId}')">Xóa</button></div></div>`;
            });
        }
    }
    else if (currentView === 'admin_create_acc') {
        b.innerHTML = `
            <div style="max-width:380px; margin: 10px auto; width:100%; display:flex; flex-direction:column; gap:8px;">
                <h3 style="color:var(--primary); text-align:center; font-size: 1rem;">➕ Tạo tài khoản mới</h3>
                <div class="form-group"><label>Họ tên đầy đủ:</label><input type="text" id="newStudentName" placeholder="Nhập họ tên..."></div>
                <div class="form-group"><label>Tên tài khoản:</label><input type="text" id="newAccName" placeholder="Tên đăng nhập..."></div>
                <div style="display:flex; justify-content:center; gap:12px; margin-top:4px;"><button class="menu-btn btn-del" style="width:140px; justify-content:center;" onclick="switchView('admin_manage_noti')">Hủy</button><button class="menu-btn" style="width:140px; justify-content:center; background:#2a9d8f;" onclick="saveOrUpdateAccount()">Tạo mới</button></div>
                <div style="margin-top:6px;"><label style="font-weight:600; font-size:0.75rem; color:var(--primary);">Thông tin vừa tạo:</label><div style="display:flex; align-items:center; gap:6px; margin-top:2px;"><input type="text" id="resAccountInfo" readonly value="${lastCreatedAccountInfo}" style="flex:1; font-weight:bold; color:#e63946; padding:6px 8px; border-radius:6px; font-size:0.82rem;"><button class="menu-btn" style="padding:6px 10px; background:#2a9d8f; font-size:0.78rem;" onclick="copyAccountInfo()">📋 Copy</button></div></div>
            </div>
        `;
    }
    else if (currentView === 'admin_del_acc') {
        b.innerHTML = `<h3 style="color:var(--primary); font-size: 0.95rem; margin-bottom:8px;">🗑️ Danh Sách Tài Khoản</h3>`;
        let filtered = subAccounts.filter(acc => acc.name.toLowerCase() !== 'admin');
        if (filtered.length === 0) b.innerHTML += '<p style="color:var(--text-sub);">Chưa có tài khoản phụ nào.</p>';
        else {
            filtered.forEach((acc, idx) => {
                b.innerHTML += `<div class="card-item"><div class="card-info" style="flex:1;"><h4>STT ${idx + 1}: ${acc.studentName || 'Chưa cập nhật'}</h4><span>👤 <b>TK:</b> ${acc.name} | 🔑 <b>Pass:</b> ${acc.pass}</span></div><button class="menu-btn btn-del" onclick="deleteAccountByName('${acc.name}', '${acc.docId}')">Xóa</button></div>`;
            });
        }
    }
    else if (currentView === 'admin_manage_noti' || currentView === 'sub_manage_noti') {
        let notiList = currentView === 'admin_manage_noti' ? [...notifications].sort((a,b) => b.id - a.id) : notifications.filter(n => n.author === currentUser.name).sort((a,b) => b.id - a.id);
        let hwList = [...homeworks].sort((a,b) => b.id - a.id);
        b.innerHTML = `<h3 style="color:var(--primary); font-size: 0.95rem; margin-bottom:8px;">📜 Bài Đã Đăng</h3>`;
        let combined = [...notiList.map(item => ({ ...item, displayHeader: `[📢 Thông báo ${item.id}] ${item.title}`, isHomework: false })), ...hwList.map(item => ({ ...item, displayHeader: `[📚 Báo bài] ${item.title}`, isHomework: true }))];
        if (combined.length === 0) b.innerHTML += '<p style="color:var(--text-sub);">Không có bài đăng nào.</p>';
        else {
            combined.forEach(item => {
                let isAdmin = (currentUser.role === 'admin' || currentUser.name.includes('GVCN') || currentUser.name.includes('Admin'));
                let canEdit = !item.isHomework && (isAdmin || (item.author === currentUser.name && (!item.timestamp || Date.now() - item.timestamp < 30 * 60 * 1000)));
                b.innerHTML += `<div class="card-item"><div class="card-info" style="flex:1;"><h4>${item.displayHeader}</h4><span>📅 ${item.date} | ✍️ ${item.author}</span></div><div style="display:flex; align-items:center; gap:5px;">${canEdit ? `<button class="menu-btn btn-edit" onclick="startEdit(${item.id})">Sửa</button>` : ''}<button class="menu-btn btn-del" onclick="${item.isHomework ? `deleteHomework('${item.docId}')` : `deleteNotification('${item.docId}', ${item.id})`}">Xóa</button></div></div>`;
            });
        }
    }
    else if (currentView === 'trash_noti') {
        b.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;"><h3 style="color:var(--primary); font-size: 1rem;">📁 Thùng Rác</h3><button class="menu-btn btn-del" style="padding:4px 8px; font-size:0.75rem;" onclick="deleteSelectedTrash()">Xóa vĩnh viễn đã chọn</button></div>`;
        if (trashBin.length === 0) b.innerHTML += '<p style="color:var(--text-sub);">Thùng rác trống.</p>';
        else {
            trashBin.forEach((item, idx) => {
                let isHw = (item.isHomework === true || (item.title && item.title.startsWith("BÁO BÀI")));
                b.innerHTML += `<div class="card-item" style="border-left-color:#e63946;"><div style="display:flex; align-items:center; gap:8px; flex:1;"><input type="checkbox" class="trash-check" data-docid="${item.docId}"><div class="card-info" style="cursor:pointer; flex:1;" onclick="showTrashDetail(${idx})"><h4>${isHw ? `[📚 Báo bài] ${item.title}` : `[📢 Thông báo ${item.id}] ${item.title}`}</h4><span>🗑️ Xóa bởi: ${item.deletedBy} lúc ${item.deletedAt}</span></div></div><button class="menu-btn btn-restore" onclick="restoreNotification('${item.docId}')">Khôi phục</button></div>`;
            });
        }
    }
}