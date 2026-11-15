// ==========================================
// CONTENT-MANAGER.JS: Thông báo, Báo bài, Album, TKB, Tài khoản & Khởi động
// ==========================================
async function submitNewForm() {
    let titleElem = document.getElementById('formTitleInput'), urlElem = document.getElementById('formUrlInput'), btnSubmit = document.getElementById('btnSubmitForm');
    if (!titleElem || !urlElem) return;
    let title = titleElem.value.trim(), url = urlElem.value.trim();
    if (!title || !url) { alert("Vui lòng nhập tên biểu mẫu và đường dẫn URL!"); return; }

    let parsedUrl = parseGoogleDriveLink(url) || url, authorName = (currentUser && currentUser.name) ? currentUser.name : "GVCN";
    if (btnSubmit) { btnSubmit.disabled = true; btnSubmit.innerText = "⏳ Đang lưu..."; }

    try {
        let docSnap = await db.collection("settings").doc("general").get(), currentForms = [];
        if (docSnap.exists && docSnap.data().formsList && Array.isArray(docSnap.data().formsList)) currentForms = docSnap.data().formsList;
        else if (Array.isArray(formsList)) currentForms = [...formsList];

        let maxId = currentForms.length > 0 ? Math.max(...currentForms.map(f => (Number(f.id) || 0))) : 0;
        currentForms.unshift({ id: maxId + 1, title, url: parsedUrl, author: authorName });
        formsList = currentForms;

        await db.collection("settings").doc("general").set({ banners: banners || [], formsList: currentForms, scheduleUrl: scheduleUrl || "" }, { merge: true });
        alert("Đăng biểu mẫu thành công!"); titleElem.value = ""; urlElem.value = ""; renderAdminFormsList();
    } catch (err) { alert("Lỗi khi lưu biểu mẫu: " + err.message); }
    finally { if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.innerText = "🚀 Đăng Biểu Mẫu"; } }
}

async function deleteFormItem(id) {
    if (confirm("Bạn có chắc chắn muốn xóa biểu mẫu này?")) {
        try {
            formsList = formsList.filter(f => f.id !== id);
            await db.collection("settings").doc("general").set({ banners: banners || [], formsList, scheduleUrl: scheduleUrl || "" }, { merge: true });
            renderAdminFormsList();
        } catch (err) { alert("Lỗi khi xóa: " + err.message); }
    }
}

function renderAdminFormsList() {
    let container = document.getElementById('adminFormsListContainer'); if (!container) return; container.innerHTML = '';
    if (!formsList || formsList.length === 0) { container.innerHTML = '<p style="color:#6c757d; font-size:0.8rem;">Chưa có biểu mẫu nào.</p>'; return; }
    formsList.forEach(form => {
        container.innerHTML += `<div class="card-item" style="padding:6px 10px;"><div class="card-info" style="flex:1;"><h4 style="font-size:0.82rem;">📄 ${form.title}</h4><span style="font-size:0.68rem;">🔗 ${form.url}</span></div><button class="menu-btn btn-del" style="padding:3px 6px; font-size:0.7rem;" onclick="deleteFormItem(${form.id})">Xóa</button></div>`;
    });
}

function initMultiNotiRows() {
    let container = document.getElementById('multiNotiLinksContainer'); if (!container) return; container.innerHTML = '';
    [...currentMultiLinks, ""].forEach(link => {
        let row = document.createElement('div'); row.className = 'multi-link-row'; row.style.cssText = 'display:flex; gap:6px; align-items:center;';
        row.innerHTML = `<input type="text" class="multi-input-link" value="${link}" placeholder="Dán link ảnh..." style="flex:1;" oninput="autoPreviewMultiNoti(this)"><button type="button" class="menu-btn" style="padding:5px 8px; font-size:0.75rem; background:#457b9d;" onclick="previewMultiNotiLink(this)">👁️ Xem</button><button type="button" class="btn-clear-icon" onclick="removeMultiNotiRow(this)">✖</button>`;
        container.appendChild(row);
    });
}

function initMultiHwRows() {
    let container = document.getElementById('multiHwLinksContainer'); if (!container) return; container.innerHTML = '';
    [...currentHwMultiLinks, ""].forEach(link => {
        let row = document.createElement('div'); row.className = 'multi-hw-row'; row.style.cssText = 'display:flex; gap:6px; align-items:center;';
        row.innerHTML = `<input type="text" class="multi-hw-input" value="${link}" placeholder="Dán link ảnh báo bài..." style="flex:1;" oninput="autoPreviewMultiHw(this)"><button type="button" class="menu-btn" style="padding:5px 8px; font-size:0.75rem; background:#457b9d;" onclick="previewMultiHwLink(this)">👁️ Xem</button><button type="button" class="btn-clear-icon" onclick="removeMultiHwRow(this)">✖</button>`;
        container.appendChild(row);
    });
}

function initMultiAlbumRows() {
    let container = document.getElementById('multiAlbumLinksContainer'); if (!container) return; container.innerHTML = '';
    (currentAlbumLinks.length > 0 ? [...currentAlbumLinks, ""] : [""]).forEach(link => {
        let row = document.createElement('div'); row.className = 'multi-album-row'; row.style.cssText = 'display:flex; gap:6px; align-items:center;';
        row.innerHTML = `<input type="text" class="multi-album-input" value="${link}" placeholder="Dán link ảnh..." style="flex:1;" oninput="autoPreviewMultiAlbum(this)"><button type="button" class="menu-btn" style="padding:5px 8px; font-size:0.75rem; background:#457b9d;" onclick="previewSingleAlbumLink(this)">👁️ Xem</button><button type="button" class="btn-clear-icon" onclick="removeMultiAlbumRow(this)">✖</button>`;
        container.appendChild(row);
    });
}

function initMultiBannerRows() {
    let container = document.getElementById('multiBannerLinksContainer'); if (!container) return; container.innerHTML = '';
    (currentBannerLinks.length > 0 ? [...currentBannerLinks, ""] : [""]).forEach(link => {
        let row = document.createElement('div'); row.className = 'multi-banner-row'; row.style.cssText = 'display:flex; gap:6px; align-items:center;';
        row.innerHTML = `<input type="text" class="multi-banner-input" value="${link}" placeholder="Dán link banner..." style="flex:1;" oninput="autoPreviewMultiBanner(this)"><button type="button" class="menu-btn" style="padding:5px 8px; font-size:0.75rem; background:#457b9d;" onclick="previewSingleBannerLink(this)">👁️ Xem</button><button type="button" class="btn-clear-icon" onclick="removeMultiBannerRow(this)">✖</button>`;
        container.appendChild(row);
    });
}

function handleMultiNotiInput(inputElem) {
    let row = inputElem.closest('.multi-link-row'), container = document.getElementById('multiNotiLinksContainer'), allRows = container.querySelectorAll('.multi-link-row');
    if (row === allRows[allRows.length - 1] && inputElem.value.trim().length > 0) {
        let newRow = document.createElement('div'); newRow.className = 'multi-link-row'; newRow.style.cssText = 'display:flex; gap:6px; align-items:center;';
        newRow.innerHTML = `<input type="text" class="multi-input-link" placeholder="Dán link tiếp theo..." style="flex:1;" oninput="autoPreviewMultiNoti(this)"><button type="button" class="menu-btn" style="padding:5px 8px; font-size:0.75rem; background:#457b9d;" onclick="previewMultiNotiLink(this)">👁️ Xem</button><button type="button" class="btn-clear-icon" onclick="removeMultiNotiRow(this)">✖</button>`;
        container.appendChild(newRow);
    }
}

function handleMultiHwInput(inputElem) {
    let row = inputElem.closest('.multi-hw-row'), container = document.getElementById('multiHwLinksContainer'), allRows = container.querySelectorAll('.multi-hw-row');
    if (row === allRows[allRows.length - 1] && inputElem.value.trim().length > 0) {
        let newRow = document.createElement('div'); newRow.className = 'multi-hw-row'; newRow.style.cssText = 'display:flex; gap:6px; align-items:center;';
        newRow.innerHTML = `<input type="text" class="multi-hw-input" placeholder="Dán link tiếp theo..." style="flex:1;" oninput="autoPreviewMultiHw(this)"><button type="button" class="menu-btn" style="padding:5px 8px; font-size:0.75rem; background:#457b9d;" onclick="previewMultiHwLink(this)">👁️ Xem</button><button type="button" class="btn-clear-icon" onclick="removeMultiHwRow(this)">✖</button>`;
        container.appendChild(newRow);
    }
}

function handleMultiAlbumInput(inputElem) {
    let row = inputElem.closest('.multi-album-row'), container = document.getElementById('multiAlbumLinksContainer'), allRows = container.querySelectorAll('.multi-album-row');
    if (row === allRows[allRows.length - 1] && inputElem.value.trim().length > 0) {
        let newRow = document.createElement('div'); newRow.className = 'multi-album-row'; newRow.style.cssText = 'display:flex; gap:6px; align-items:center;';
        newRow.innerHTML = `<input type="text" class="multi-album-input" placeholder="Dán link tiếp theo..." style="flex:1;" oninput="autoPreviewMultiAlbum(this)"><button type="button" class="menu-btn" style="padding:5px 8px; font-size:0.75rem; background:#457b9d;" onclick="previewSingleAlbumLink(this)">👁️ Xem</button><button type="button" class="btn-clear-icon" onclick="removeMultiAlbumRow(this)">✖</button>`;
        container.appendChild(newRow);
    }
}

function handleMultiBannerInput(inputElem) {
    let row = inputElem.closest('.multi-banner-row'), container = document.getElementById('multiBannerLinksContainer'), allRows = container.querySelectorAll('.multi-banner-row');
    if (row === allRows[allRows.length - 1] && inputElem.value.trim().length > 0) {
        let newRow = document.createElement('div'); newRow.className = 'multi-banner-row'; newRow.style.cssText = 'display:flex; gap:6px; align-items:center;';
        newRow.innerHTML = `<input type="text" class="multi-banner-input" placeholder="Dán link banner tiếp..." style="flex:1;" oninput="autoPreviewMultiBanner(this)"><button type="button" class="menu-btn" style="padding:5px 8px; font-size:0.75rem; background:#457b9d;" onclick="previewSingleBannerLink(this)">👁️ Xem</button><button type="button" class="btn-clear-icon" onclick="removeMultiBannerRow(this)">✖</button>`;
        container.appendChild(newRow);
    }
}

function autoPreviewMultiNoti(inputElem) {
    let link = inputElem.value.trim(), previewBox = document.getElementById('multiNotiPreviewBox'); if (!previewBox) return;
    previewBox.innerHTML = link ? `<img src="${parseGoogleDriveLink(link)}" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:4px; cursor:pointer;" onclick="openZoomModal('${parseGoogleDriveLink(link)}')">` : `<span style="font-size:0.8rem; color:#aaa;">Chưa có ảnh xem trước</span>`;
    handleMultiNotiInput(inputElem);
}

function autoPreviewMultiHw(inputElem) {
    let link = inputElem.value.trim(), previewBox = document.getElementById('multiHwPreviewBox'); if (!previewBox) return;
    previewBox.innerHTML = link ? `<img src="${parseGoogleDriveLink(link)}" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:4px; cursor:pointer;" onclick="openZoomModal('${parseGoogleDriveLink(link)}')">` : `<span style="font-size:0.8rem; color:#aaa;">Chưa có ảnh xem trước</span>`;
    handleMultiHwInput(inputElem);
}

function autoPreviewMultiAlbum(inputElem) {
    let link = inputElem.value.trim(), previewBox = document.getElementById('multiAlbumPreviewBox'); if (!previewBox) return;
    previewBox.innerHTML = link ? `<img src="${parseGoogleDriveLink(link)}" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:4px; cursor:pointer;" onclick="openZoomModal('${parseGoogleDriveLink(link)}')">` : `<span style="font-size:0.8rem; color:#aaa;">Chưa có ảnh xem trước</span>`;
    handleMultiAlbumInput(inputElem);
}

function autoPreviewMultiBanner(inputElem) {
    let link = inputElem.value.trim(), previewBox = document.getElementById('multiBannerPreviewBox'); if (!previewBox) return;
    previewBox.innerHTML = link ? `<img src="${parseGoogleDriveLink(link)}" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:4px; cursor:pointer;" onclick="openZoomModal('${parseGoogleDriveLink(link)}')">` : `<span style="font-size:0.8rem; color:#aaa;">Chưa có ảnh xem trước</span>`;
    handleMultiBannerInput(inputElem);
}

function previewMultiNotiLink(btn) { autoPreviewMultiNoti(btn.closest('.multi-link-row').querySelector('.multi-input-link')); }
function previewMultiHwLink(btn) { autoPreviewMultiHw(btn.closest('.multi-hw-row').querySelector('.multi-hw-input')); }
function previewSingleAlbumLink(btn) { autoPreviewMultiAlbum(btn.closest('.multi-album-row').querySelector('.multi-album-input')); }
function previewSingleBannerLink(btn) { autoPreviewMultiBanner(btn.closest('.multi-banner-row').querySelector('.multi-banner-input')); }

function removeMultiNotiRow(btn) { let row = btn.closest('.multi-link-row'); if (document.querySelectorAll('.multi-link-row').length > 1) row.remove(); else row.querySelector('.multi-input-link').value = ''; }
function removeMultiHwRow(btn) { let row = btn.closest('.multi-hw-row'); if (document.querySelectorAll('.multi-hw-row').length > 1) row.remove(); else row.querySelector('.multi-hw-input').value = ''; }
function removeMultiAlbumRow(btn) { let row = btn.closest('.multi-album-row'); if (document.querySelectorAll('.multi-album-row').length > 1) row.remove(); else row.querySelector('.multi-album-input').value = ''; }
function removeMultiBannerRow(btn) { let row = btn.closest('.multi-banner-row'); if (document.querySelectorAll('.multi-banner-row').length > 1) row.remove(); else row.querySelector('.multi-banner-input').value = ''; }

function clearAlbumInputs() {
    currentAlbumLinks = []; initMultiAlbumRows();
    let pBox = document.getElementById('multiAlbumPreviewBox'); if (pBox) pBox.innerHTML = '<span style="font-size:0.8rem; color:#aaa;">Chưa có ảnh xem trước</span>';
}

async function clearBanners() {
    if (confirm("Xóa toàn bộ ảnh banner?")) {
        banners = []; currentBannerLinks = []; await saveSettingsToFirebase(); initMultiBannerRows();
        let pBox = document.getElementById('multiBannerPreviewBox'); if (pBox) pBox.innerHTML = '<span style="font-size:0.8rem; color:#aaa;">Chưa có ảnh xem trước</span>';
        renderBannerSlideshow(); alert("Đã xóa toàn bộ banner!");
    }
}

function submitMultiNotiImages() {
    let arr = []; document.querySelectorAll('.multi-input-link').forEach(inp => { if (inp.value.trim()) arr.push(parseGoogleDriveLink(inp.value.trim())); });
    currentMultiLinks = arr; alert(`Đã nhận ${arr.length} ảnh thông báo!`); switchView(currentUser.role === 'admin' ? 'admin_post' : 'sub_post');
}

function submitMultiHwImages() {
    let arr = []; document.querySelectorAll('.multi-hw-input').forEach(inp => { if (inp.value.trim()) arr.push(parseGoogleDriveLink(inp.value.trim())); });
    currentHwMultiLinks = arr; alert(`Đã nhận ${arr.length} ảnh báo bài!`); switchView('admin_homework');
}

function previewBannerFileWithCheck(input) {
    checkDirectFileSizeLimit(input);
    if (input.files && input.files[0]) {
        let reader = new FileReader(); reader.onload = (e) => {
            let pBox = document.getElementById('multiBannerPreviewBox'); if (pBox) pBox.innerHTML = `<img src="${e.target.result}" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:4px; cursor:pointer;" onclick="openZoomModal('${e.target.result}')">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function previewScheduleFileWithCheck(input) {
    checkDirectFileSizeLimit(input);
    if (input.files && input.files[0]) {
        let reader = new FileReader(); reader.onload = (e) => {
            let box = document.getElementById('schedulePreviewArea'); if (box) box.innerHTML = `<img src="${e.target.result}" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:4px; cursor:pointer;" onclick="openZoomModal('${e.target.result}')">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function previewScheduleLink() {
    let link = document.getElementById('scheduleLinkInput').value.trim(), box = document.getElementById('schedulePreviewArea');
    if (!box) return;
    box.innerHTML = link ? `<img src="${parseGoogleDriveLink(link)}" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:4px; cursor:pointer;" onclick="openZoomModal('${parseGoogleDriveLink(link)}')">` : (scheduleUrl ? `<img src="${scheduleUrl}" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:4px; cursor:pointer;" onclick="openZoomModal('${scheduleUrl}')">` : '<span style="color:#6c757d; font-size:0.8rem;">Chưa có ảnh TKB.</span>');
}

async function submitNotification() {
    let title = document.getElementById('postTitle').value.trim(), content = document.getElementById('postContent').innerHTML.trim(), pdfUrl = document.getElementById('postPdfInput').value.trim(), fileInput = document.getElementById('postMediaFile');
    if (!title) { alert("Vui lòng nhập tiêu đề!"); return; }

    let processSave = async (mediaArray, mediaType) => {
        try {
            if (editingNotiId !== null) {
                let item = notifications.find(n => n.id === editingNotiId);
                if (item && item.docId) {
                    let updateData = { title, content, pdfUrl };
                    if (mediaArray.length > 0) { updateData.mediaUrl = mediaArray; updateData.mediaType = mediaType; }
                    await db.collection("notifications").doc(item.docId).update(updateData);
                    alert("Đã cập nhật thông báo!");
                }
            } else {
                let maxId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id || 0)) : 0, newId = maxId + 1, now = new Date();
                let dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
                await db.collection("notifications").doc("noti_" + newId).set({ id: newId, title, content, pdfUrl, timestamp: Date.now(), date: dateStr, author: currentUser.name, mediaUrl: mediaArray, mediaType: mediaType || '' });
                alert("Đăng thông báo thành công!");
            }
            editingNotiId = null; currentMultiLinks = []; tempPostTitle = ""; tempPostContent = ""; tempPostPdf = "";
            switchView(currentUser.role === 'admin' ? 'admin_manage_noti' : 'sub_manage_noti');
        } catch (err) { alert("Lỗi khi lưu: " + err.message); }
    };

    if (currentMultiLinks.length > 0) processSave(currentMultiLinks, 'image');
    else if (fileInput && fileInput.files && fileInput.files[0]) {
        let reader = new FileReader(); reader.onload = (e) => processSave([e.target.result], 'image'); reader.readAsDataURL(fileInput.files[0]);
    } else {
        let existingMediaUrl = [], existingMediaType = "";
        if (editingNotiId !== null) {
            let oldItem = notifications.find(n => n.id === editingNotiId);
            if (oldItem) { existingMediaUrl = Array.isArray(oldItem.mediaUrl) ? oldItem.mediaUrl : [oldItem.mediaUrl]; existingMediaType = oldItem.mediaType; }
        }
        processSave(existingMediaUrl, existingMediaType);
    }
}

async function submitHomework(event) {
    let title = document.getElementById('hwTitle').value.trim(), content = document.getElementById('hwContent').innerHTML.trim(), pdfUrl = document.getElementById('hwPdfInput').value.trim(), fileInput = document.getElementById('hwMediaFile'), btnSubmit = event.target;
    if (!content || content === "<br>") { alert("Vui lòng nhập nội dung báo bài!"); return; }
    btnSubmit.disabled = true; btnSubmit.innerText = "⏳ Đang đăng...";

    let processHwSave = async (mediaUrls) => {
        try {
            if (mediaUrls && mediaUrls.length > 0) {
                mediaUrls.forEach(u => { content += `<br><div style="width:100%; margin-top:8px;"><img src="${parseGoogleDriveLink(u)}" style="width:100%; border-radius:6px; cursor:pointer;" onclick="openZoomModal('${parseGoogleDriveLink(u)}')"></div>`; });
            }
            let maxId = homeworks.length > 0 ? Math.max(...homeworks.map(h => h.id || 0)) : 0, newId = maxId + 1, now = new Date();
            let dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
            await db.collection("homeworks").doc("hw_" + newId).set({ id: newId, title, content, pdfUrl, timestamp: Date.now(), date: dateStr, author: currentUser.name });
            alert("Đăng báo bài thành công!"); currentHwMultiLinks = []; tempHwContent = ""; tempHwPdf = ""; switchView('homework_list');
        } catch (err) { alert("Lỗi khi đăng báo bài: " + err.message); }
        finally { btnSubmit.disabled = false; btnSubmit.innerText = "Đăng"; }
    };

    if (currentHwMultiLinks.length > 0) processHwSave(currentHwMultiLinks);
    else if (fileInput && fileInput.files && fileInput.files[0]) {
        let reader = new FileReader(); reader.onload = (e) => processHwSave([e.target.result]); reader.readAsDataURL(fileInput.files[0]);
    } else { processHwSave([]); }
}

async function submitDynamicBatchAlbum() {
    let title = document.getElementById('albumBatchTitle').value.trim(), linksArray = [];
    document.querySelectorAll('.multi-album-input').forEach(inp => { if (inp.value.trim()) linksArray.push(parseGoogleDriveLink(inp.value.trim())); });
    if (!title) { alert("Vui lòng nhập tên Album!"); return; }
    if (linksArray.length === 0) { alert("Vui lòng dán ít nhất 1 link ảnh!"); return; }

    try {
        if (editingAlbumId !== null) {
            let albItem = albums.find(a => a.docId === editingAlbumId || a.id === editingAlbumId);
            if (albItem && albItem.docId) { await db.collection("albums").doc(albItem.docId).update({ title, mediaUrl: linksArray[0] }); alert("Cập nhật album thành công!"); }
        } else {
            let batch = db.batch();
            linksArray.forEach((link, idx) => {
                let newDocId = "alb_" + (Date.now() + idx);
                batch.set(db.collection("albums").doc(newDocId), { id: Date.now() + idx, title: linksArray.length > 1 ? `${title} (${idx + 1}/${linksArray.length})` : title, mediaUrl: link, type: 'image', author: currentUser.name });
            });
            await batch.commit(); alert(`Đã đăng thành công ${linksArray.length} ảnh!`);
        }
        editingAlbumId = null; tempAlbumTitle = ""; currentAlbumLinks = []; switchView(currentUser.role === 'admin' ? 'admin_manage_album' : 'home');
    } catch (err) { alert("Lỗi khi lưu album: " + err.message); }
}

function startEditAlbum(docId) {
    editingAlbumId = docId; let albItem = albums.find(a => a.docId === docId || a.id === docId);
    if (albItem) { tempAlbumTitle = albItem.title.replace(/\s\(\d+\/\d+\)$/, ''); currentAlbumLinks = [albItem.mediaUrl]; }
    switchView(currentUser.role === 'admin' ? 'admin_album' : 'sub_album');
}

async function deleteAlbumItem(docId) {
    if (confirm("Xóa ảnh này?")) {
        try { await db.collection("albums").doc(docId).delete(); } catch (err) { alert("Lỗi khi xóa: " + err.message); }
    }
}

function changeAlbum(step) {
    if (albums.length === 0) return;
    albumIndex = (albumIndex + step + albums.length) % albums.length;
    renderContentB();
}

async function saveDynamicBanners() {
    let fileInput = document.getElementById('bannerFileInput'), linksArray = [];
    document.querySelectorAll('.multi-banner-input').forEach(inp => { if (inp.value.trim()) linksArray.push(parseGoogleDriveLink(inp.value.trim())); });

    if (fileInput && fileInput.files && fileInput.files[0]) {
        let reader = new FileReader(); reader.onload = async (e) => { banners.unshift(e.target.result); await saveSettingsToFirebase(); alert("Đã lưu banner!"); renderBannerSlideshow(); };
        reader.readAsDataURL(fileInput.files[0]); return;
    }
    if (linksArray.length > 0) { banners = [...linksArray]; await saveSettingsToFirebase(); alert("Đã lưu danh sách banner!"); renderBannerSlideshow(); }
    else { alert("Vui lòng đính kèm ít nhất 1 banner!"); }
}

async function saveSchedule() {
    let linkInput = document.getElementById('scheduleLinkInput').value.trim(), fileInput = document.getElementById('scheduleFileInput');
    if (fileInput && fileInput.files && fileInput.files[0]) {
        let reader = new FileReader(); reader.onload = async (e) => { scheduleUrl = e.target.result; await saveSettingsToFirebase(); alert("Đăng TKB thành công!"); renderContentB(); };
        reader.readAsDataURL(fileInput.files[0]);
    } else if (linkInput) { scheduleUrl = parseGoogleDriveLink(linkInput); await saveSettingsToFirebase(); alert("Đăng TKB thành công!"); renderContentB(); }
    else { alert("Vui lòng dán link hoặc chọn file TKB!"); }
}

async function deleteSchedule() {
    if (!scheduleUrl) { alert("Chưa có TKB để xóa!"); return; }
    if (confirm("Xóa TKB này?")) { scheduleUrl = ""; await saveSettingsToFirebase(); alert("Đã xóa TKB!"); renderContentB(); }
}

async function deleteHomework(docId) {
    if (confirm("Xóa bài báo bài này?")) {
        try {
            let item = homeworks.find(h => h.docId === docId);
            if (item) {
                let trashData = { ...item, isHomework: true, deletedBy: currentUser.name, deletedAt: new Date().toLocaleString() };
                delete trashData.docId; await db.collection("trashBin").add(trashData); await db.collection("homeworks").doc(docId).delete();
            }
        } catch (err) { alert("Lỗi khi xóa: " + err.message); }
    }
}

function showHwDetail(id) { window.currentHwId = id; currentView = 'homework_detail'; renderContentB(); }
function changeHwPage(step) { homeworkPageOffset += step; renderContentB(); }
function showFullDetail(id) { window.currentDetailId = id; currentView = 'full_detail'; renderContentB(); }

function showTrashDetail(idx) {
    let item = trashBin[idx]; if (!item) return;
    if (item.isHomework || (item.title && item.title.startsWith("BÁO BÀI"))) {
        window.currentHwId = item.id; currentView = 'homework_detail';
        if (!homeworks.find(h => h.id === item.id)) homeworks.push(item);
    } else {
        window.currentDetailId = item.id; currentView = 'full_detail';
        if (!notifications.find(n => n.id === item.id)) notifications.push(item);
    }
    renderContentB();
}

let bannerTimer = null;
function renderBannerSlideshow() {
    let container = document.getElementById('dynamicBannerContainer'); if (!container) return;
    if (banners.length === 0) { container.style.display = 'none'; return; }
    container.style.display = 'block'; container.innerHTML = '';
    banners.forEach(src => {
        let img = document.createElement('img'); img.src = parseGoogleDriveLink(src);
        if (container.children.length === 0) img.className = 'active'; container.appendChild(img);
    });
    if (bannerTimer) clearInterval(bannerTimer);
    let imgs = container.querySelectorAll('img');
    if (imgs.length > 1) {
        let currentIdx = 0;
        bannerTimer = setInterval(() => {
            imgs = container.querySelectorAll('img'); if (imgs.length === 0) return;
            imgs[currentIdx].classList.remove('active');
            currentIdx = (currentIdx + 1) % imgs.length;
            imgs[currentIdx].classList.add('active');
        }, 6000);
    }
}

function changePage(step) { notiPageOffset += step; renderContentB(); }

function handleLogin() {
    let u = document.getElementById('loginUser').value.trim(), p = document.getElementById('loginPass').value.trim();
    if (u === 'admin298' && p === 'ADM!n298') { currentUser = { name: "GVCN", role: "admin" }; autoCleanupExpiredExams(); switchView('welcome_dashboard'); }
    else if (u === 'admin') {
        let foundAdmin = subAccounts.find(acc => acc.name === 'admin' && acc.pass === p);
        if (foundAdmin || p === 'ad1234') { currentUser = { name: "Admin Phụ (admin)", role: "admin" }; autoCleanupExpiredExams(); switchView('welcome_dashboard'); }
        else { alert("Mật khẩu tài khoản admin không chính xác!"); }
    } else {
        let found = subAccounts.find(acc => acc.name === u && acc.pass === p);
        if (found) { currentUser = { name: found.studentName || found.name, role: "sub" }; autoCleanupExpiredExams(); switchView('welcome_dashboard'); }
        else { alert("Tên tài khoản hoặc mật khẩu không chính xác!"); }
    }
}

function logout() { currentUser = null; switchView('home'); }

async function deleteAccountByName(accName, docId) {
    if (accName.toLowerCase() === 'admin') { alert("Không thể xóa tài khoản admin chính!"); return; }
    if (confirm("Xóa tài khoản này?")) {
        try { await db.collection("subAccounts").doc(docId).delete(); } catch (err) { alert("Lỗi khi xóa: " + err.message); }
    }
}

function startEdit(id) {
    editingNotiId = id; currentMultiLinks = [];
    let item = notifications.find(n => n.id === id);
    if (item) {
        tempPostTitle = item.title; tempPostContent = item.content; tempPostPdf = item.pdfUrl || "";
        currentMultiLinks = Array.isArray(item.mediaUrl) ? [...item.mediaUrl] : (item.mediaUrl ? item.mediaUrl.split('\n').filter(l => l.trim()) : []);
    }
    switchView(currentUser.role === 'admin' ? 'admin_post' : 'sub_post');
}

async function deleteNotification(docId, id) {
    if (confirm("Chuyển thông báo này vào thùng rác?")) {
        try {
            let item = notifications.find(n => n.docId === docId || n.id === id);
            if (item) {
                let trashData = { ...item, isHomework: false, deletedBy: currentUser.name, deletedAt: new Date().toLocaleString() };
                delete trashData.docId; await db.collection("trashBin").add(trashData); await db.collection("notifications").doc(item.docId).delete();
            }
        } catch (err) { alert("Lỗi khi xóa: " + err.message); }
    }
}

async function restoreNotification(docId) {
    try {
        let item = trashBin.find(t => t.docId === docId);
        if (item) {
            let restoreData = { ...item }; delete restoreData.docId; delete restoreData.deletedBy; delete restoreData.deletedAt;
            if (restoreData.isHomework || (restoreData.title && restoreData.title.startsWith("BÁO BÀI"))) {
                delete restoreData.isHomework; await db.collection("homeworks").doc("hw_" + restoreData.id).set(restoreData);
            } else { await db.collection("notifications").doc("noti_" + restoreData.id).set(restoreData); }
            await db.collection("trashBin").doc(docId).delete(); alert("Khôi phục thành công!");
        }
    } catch (err) { alert("Lỗi khi khôi phục: " + err.message); }
}

async function deleteSelectedTrash() {
    let checkboxes = document.querySelectorAll('.trash-check:checked');
    if (checkboxes.length === 0) { alert("Chọn ít nhất một mục!"); return; }
    if (confirm("Xóa vĩnh viễn các mục đã chọn?")) {
        let batch = db.batch();
        checkboxes.forEach(cb => { if (cb.dataset.docid) batch.delete(db.collection("trashBin").doc(cb.dataset.docid)); });
        await batch.commit(); alert("Đã xóa vĩnh viễn!");
    }
}

/* ZOOM & PAN */
let currentScale = 1, panX = 0, panY = 0, isDragging = false, startX = 0, startY = 0, initialDistance = 0, initialScale = 1;
function openZoomModal(imgSrc) {
    let modal = document.getElementById('zoomModal'), img = document.getElementById('zoomedImg');
    img.src = parseGoogleDriveLink(imgSrc); resetZoom(); modal.style.display = 'flex';
}
function closeZoomModal() { document.getElementById('zoomModal').style.display = 'none'; }
function zoomIn() { currentScale = Math.min(currentScale + 0.4, 5); updateImageTransform(); }
function zoomOut() { currentScale = Math.max(currentScale - 0.4, 0.6); updateImageTransform(); }
function resetZoom() { currentScale = 1; panX = 0; panY = 0; updateImageTransform(); }
function updateImageTransform() { let img = document.getElementById('zoomedImg'); if (img) img.style.transform = `translate(${panX}px, ${panY}px) scale(${currentScale})`; }

const zoomModalEl = document.getElementById('zoomModal');
zoomModalEl.addEventListener('mousedown', (e) => { isDragging = true; startX = e.clientX - panX; startY = e.clientY - panY; });
window.addEventListener('mousemove', (e) => { if (!isDragging) return; panX = e.clientX - startX; panY = e.clientY - startY; updateImageTransform(); });
window.addEventListener('mouseup', () => { isDragging = false; });
zoomModalEl.addEventListener('wheel', (e) => { e.preventDefault(); if (e.deltaY < 0) zoomIn(); else zoomOut(); }, { passive: false });
zoomModalEl.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) { isDragging = true; startX = e.touches[0].clientX - panX; startY = e.touches[0].clientY - panY; }
    else if (e.touches.length === 2) { isDragging = false; initialDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); initialScale = currentScale; }
}, { passive: false });
zoomModalEl.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) { panX = e.touches[0].clientX - startX; panY = e.touches[0].clientY - startY; updateImageTransform(); }
    else if (e.touches.length === 2 && initialDistance > 0) {
        let dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        currentScale = Math.min(Math.max(initialScale * (dist / initialDistance), 0.6), 5); updateImageTransform();
    }
}, { passive: false });
zoomModalEl.addEventListener('touchend', (e) => { if (e.touches.length === 0) isDragging = false; });

function openSearchModal() { document.getElementById('searchModal').style.display = 'flex'; }
function closeSearchModal() { document.getElementById('searchModal').style.display = 'none'; }
function executeSearch() {
    let aName = document.getElementById('sAuthor').value.toLowerCase().trim(), sId = document.getElementById('sId').value.trim(), sDate = document.getElementById('sDate').value.trim();
    let res = notifications.filter(n => {
        let matchA = aName ? n.author.toLowerCase().includes(aName) : true;
        let matchId = sId ? n.id.toString() === sId : true;
        let matchDate = sDate ? n.date.startsWith(sDate) : true;
        return matchA && matchId && matchDate;
    });
    let box = document.getElementById('searchResults'); box.innerHTML = '';
    if (res.length === 0) box.innerHTML = '<p style="color:#6c757d; font-size:0.75rem; margin-top:3px;">Không tìm thấy thông báo phù hợp.</p>';
    else {
        res.forEach(item => {
            box.innerHTML += `<div class="card-item" style="margin-top:5px; padding:5px; cursor:pointer;" onclick="closeSearchModal(); showFullDetail(${item.id})"><div class="card-info"><h4 style="font-size:0.78rem;">Số ${item.id}: ${item.title}</h4><span style="font-size:0.65rem;">${item.date} - ${item.author}</span></div></div>`;
        });
    }
}

async function saveOrUpdateAccount() {
    let studentName = document.getElementById('newStudentName').value.trim(), accName = document.getElementById('newAccName').value.trim();
    if (!studentName && !accName) { alert("Vui lòng nhập thông tin!"); return; }
    if (!accName && studentName) { let p = studentName.split(" "); accName = p[p.length - 1].toLowerCase(); }
    let initials = studentName ? studentName.split(" ").map(w => w.charAt(0).toLowerCase()).join("") : accName.charAt(0).toLowerCase();
    let generatedPass = initials + Math.floor(1000 + Math.random() * 9000);

    try {
        await db.collection("subAccounts").doc("acc_" + accName.toLowerCase()).set({ name: accName, pass: generatedPass, studentName: studentName });
        lastCreatedAccountInfo = `Tài khoản: ${accName} | Mật khẩu: ${generatedPass}`;
        let infoBox = document.getElementById('resAccountInfo'); if (infoBox) infoBox.value = lastCreatedAccountInfo;
        alert("Tạo/cập nhật tài khoản thành công!");
    } catch (err) { alert("Lỗi khi lưu tài khoản: " + err.message); }
}

function copyAccountInfo() {
    let infoBox = document.getElementById('resAccountInfo');
    if (!infoBox || infoBox.value.includes("Chưa có")) return;
    navigator.clipboard.writeText(infoBox.value).then(() => alert("Đã copy thông tin tài khoản!"));
}

function toggleFormat(btn, cmd) { document.execCommand(cmd, false, null); btn.classList.toggle('active'); }
function toggleAlign(btn, cmd) {
    let toolbar = btn.closest('.editor-toolbar'), alignBtns = toolbar.querySelectorAll('button[data-align]'), wasActive = btn.classList.contains('active');
    alignBtns.forEach(b => b.classList.remove('active'));
    if (!wasActive) { document.execCommand(cmd, false, null); btn.classList.add('active'); }
    else { document.execCommand('justifyLeft', false, null); }
}
function changeTextColor(color) { document.execCommand('foreColor', false, color); }

function getCalculatedHomeworkTitle() {
    let targetDate = new Date(); targetDate.setDate(targetDate.getDate() + 1);
    let dayOfWeek = targetDate.getDay();
    if (dayOfWeek === 6) targetDate.setDate(targetDate.getDate() + 2);
    else if (dayOfWeek === 0) targetDate.setDate(targetDate.getDate() + 1);

    let daysMap = ["Chủ Nhật", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"];
    let dName = daysMap[targetDate.getDay()], dayNum = String(targetDate.getDate()).padStart(2, '0'), monthNum = String(targetDate.getMonth() + 1).padStart(2, '0');
    return `BÁO BÀI thứ ${dName} ngày ${dayNum}/${monthNum}/${targetDate.getFullYear()}`;
}

// KHỞI ĐỘNG ỨNG DỤNG
renderApp();
initRealtimeDatabase();
    