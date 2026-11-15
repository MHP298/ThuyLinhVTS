// ==========================================
// EXAM-ENGINE.JS: Quản lý & Hiển thị Lịch Kiểm Tra
// ==========================================
function setAdminExamTab(tab) { adminExamSubTab = tab; renderAdminExamSubView(); }

/* GIAO DIỆN ĐĂNG LỊCH KIỂM TRA ĐÃ TỐI ƯU CUỘN VÀ TỰ ĐỘNG XUỐNG HÀNG TRÊN DI ĐỘNG */
function renderAdminExamSubView() {
    let area = document.getElementById('adminExamContentArea'); if (!area) return;
    if (adminExamSubTab === '') { area.innerHTML = `<div style="flex:1; display:flex; align-items:center; justify-content:center;"><p style="color:#6c757d; font-size:0.85rem; text-align:center;">👈 Vui lòng chọn <b>"Thêm lịch kiểm tra"</b> hoặc <b>"Điều chỉnh lịch kiểm tra"</b> ở trên.</p></div>`; return; }
    // Để contentB (content-scroll) cuộn mượt mà tự nhiên toàn bộ

    if (adminExamSubTab === 'add') {
        area.innerHTML = `
            <div style="width:100%; display:flex; flex-direction:column; gap:8px;">
                <div style="background:white; padding:10px; border-radius:8px; border:1px solid #ced4da; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                    <div class="exam-form-grid">
                        <div style="display:flex; flex-direction:column; gap:6px;">
                            <div class="form-group" style="margin:0;">
                                <label>Loại kiểm tra:</label>
                                <div style="display:flex; gap:6px; align-items:center;">
                                    <select id="inpExamType" style="flex:1;" onchange="toggleExamFormFields()">
                                        <option value="" disabled selected>-- Chọn loại KT --</option>
                                        <option value="HK1-KTTX">HK1-KTTX</option>
                                        <option value="HK1-ở lớp">HK1-ở lớp</option>
                                        <option value="Giữa HK1">Giữa HK1</option>
                                        <option value="HK1">HK1</option>
                                        <option value="HK2-KTTX">HK2-KTTX</option>
                                        <option value="HK2-ở lớp">HK2-ở lớp</option>
                                        <option value="Giữa HK2">Giữa HK2</option>
                                        <option value="HK2">HK2</option>
                                    </select>
                                    <div id="examRoundGroup" style="display:none; align-items:center; gap:3px;">
                                        <label style="font-size:0.75rem; white-space:nowrap;">Lần:</label>
                                        <input type="number" id="inpExamRound" min="1" max="20" placeholder="?" style="width:48px; padding:5px 4px; text-align:center;">
                                    </div>
                                </div>
                            </div>

                            <div class="form-group" id="inpExamDateWrapper" style="margin:0;">
                                <label>Ngày kiểm tra:</label>
                                <div style="position:relative; display:flex; align-items:center;">
                                    <input type="text" id="inpExamDateDisplay" placeholder="Chọn ngày" readonly style="width:100%; background:#fff; padding-right:32px;">
                                    <span style="position:absolute; right:8px; font-size:0.95rem; pointer-events:none;">📅</span>
                                    <input type="date" id="inpExamDate" style="position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; cursor:pointer; z-index:5;" onchange="handleExamDateSelect(this.value)">
                                </div>
                            </div>

                            <div class="form-group" id="examSubjectGroup" style="margin:0;">
                                <label>Môn kiểm tra:</label>
                                <input type="text" id="inpExamSubject" placeholder="Nhập tên môn..." oninput="this.value = capitalizeSubject(this.value)">
                            </div>
                        </div>

                        <div style="display:flex; flex-direction:column;">
                            <div class="form-group" id="examContentGroup" style="margin:0; height:100%; display:flex; flex-direction:column;">
                                <label>Nội dung kiểm tra:</label>
                                <textarea id="inpExamContent" placeholder="Nhập chi tiết bài học..." style="flex:1; min-height:75px; resize:vertical; font-family:inherit; padding:6px; border:1px solid #ced4da; border-radius:6px; font-size:0.82rem;"></textarea>
                            </div>

                            <div id="examHkFileGroup" style="display:none; flex-direction:column; justify-content:flex-start; gap:3px;">
                                <label style="font-weight:600; font-size:0.75rem; color:var(--primary);">Tải lịch thi Học kỳ (Link Drive hoặc File Ảnh/PDF):</label>
                                <div style="display:flex; gap:6px; align-items:center;">
                                    <input type="text" id="inpExamHkUrl" placeholder="Dán link Google Drive ảnh/PDF..." style="flex:1;">
                                    <button type="button" class="btn-clear-icon" onclick="document.getElementById('inpExamHkUrl').value = ''" title="Xóa nhanh link">✖</button>
                                    <input type="file" id="inpExamHkFile" accept="image/*,application/pdf" style="display:none;" onchange="handleHkFileUpload(this)">
                                    <button type="button" class="menu-btn" style="background:#457b9d; padding:6px 10px; font-size:0.75rem; white-space:nowrap;" onclick="document.getElementById('inpExamHkFile').click()">📁 Tải lên file</button>
                                </div>
                                <span id="hkFileStatus" style="font-size:0.72rem; color:#2a9d8f;"></span>
                            </div>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:flex-end; align-items:center; flex-wrap:wrap; gap:6px; margin-top:8px;">
                        <button type="button" class="menu-btn" id="btnContentFileAction" style="background:#457b9d; padding:5px 8px; font-size:0.74rem;" onclick="handleOpenContentFileModalByExamType()">📁 Tải file nội dung KT</button>
                        <button type="button" class="menu-btn btn-del" id="btnClearInputsAction" style="padding:5px 8px; font-size:0.74rem;" onclick="handleClearCurrentInputs()">Xóa nội dung nhập</button>
                        <button type="button" class="menu-btn" id="btnSubmitExamAction" style="background:#2a9d8f; padding:5px 10px; font-size:0.74rem;" onclick="addTempExamItem()">➕ Lưu tạm</button>
                    </div>
                    <div id="attachedContentFileStatus" style="font-size:0.72rem; color:#2a9d8f; font-weight:bold; text-align:right; margin-top:2px;"></div>
                </div>

                <div id="tempExamAreaWrapper" style="display:flex; flex-direction:column; gap:6px;">
                    <h4 style="font-size:0.82rem; color:var(--primary); margin:0;">📋 Danh sách môn vừa thêm vào (Chờ lưu):</h4>
                    <div style="max-height:140px; overflow-y:auto; border:1px solid #dee2e6; border-radius:6px; background:white; padding:6px;">
                        <div id="tempExamListContainer" style="display:flex; flex-direction:column; gap:4px;"></div>
                    </div>

                    <div style="display:flex; justify-content:center; gap:10px; padding:6px 0 16px 0;">
                        <button type="button" class="menu-btn btn-del" style="flex:1; max-width:140px; justify-content:center;" onclick="cancelAllTempExamInput()">Hủy tất cả</button>
                        <button type="button" class="menu-btn" style="flex:1; max-width:140px; justify-content:center; background:#2a9d8f;" onclick="saveAllTempExams()">💾 Lưu tất cả</button>
                    </div>
                </div>
            </div>
        `;
        renderTempExamRows(); toggleExamFormFields();
    } else {
        let validExams = getValidExams();
        area.innerHTML = `
            <div style="flex:1; overflow-y:auto; border:1px solid #dee2e6; border-radius:6px; background:white; padding:6px; margin-bottom:8px; min-height:100px;">
                ${validExams.length === 0 ? '<p style="color:#6c757d; font-size:0.8rem; text-align:center; padding:15px;">Chưa có lịch kiểm tra nào.</p>' : ''}
                <div style="display:flex; flex-direction:column; gap:5px;">
                    ${validExams.map(item => `
                        <div class="card-item" style="padding:6px 10px;">
                            <div class="card-info" style="flex:1;">
                                <h4 style="font-size:0.82rem;">[${item.examType === 'HK1' || item.examType === 'HK2' ? 'Theo lịch thi' : formatDateToDDMMYY(item.examDate)}] ${item.subject || item.examType} - ${item.examType}</h4>
                                <span style="font-size:0.7rem;">✍️ Đăng bởi: ${item.author || 'GVCN'}</span>
                            </div>
                            <div style="display:flex; align-items:center; gap:5px;">
                                <button class="menu-btn btn-edit" style="padding:3px 7px; font-size:0.72rem;" onclick="openEditExamModal('${item.docId}')">Sửa</button>
                                <button class="menu-btn btn-del" style="padding:3px 7px; font-size:0.72rem;" onclick="deleteExistingExam('${item.docId}')">Xóa</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div style="display:flex; justify-content:center; flex-shrink:0; padding-bottom:10px;">
                <button type="button" class="menu-btn btn-del" style="width:140px; justify-content:center;" onclick="switchView('welcome_dashboard')">Hủy</button>
            </div>
        `;
    }
}

function triggerExamDatePicker() { let el = document.getElementById('inpExamDate'); if (el) (typeof el.showPicker === 'function') ? el.showPicker() : el.click(); }
function handleExamDateSelect(val) { let d = document.getElementById('inpExamDateDisplay'); if (!val) { if (d) { d.value = ''; d.dataset.date = ''; } return; } let p = val.split('-'); if (p.length === 3 && d) { d.value = `${p[2]}/${p[1]}/${p[0]}`; d.dataset.date = val; } }
function triggerEditDatePicker() { let el = document.getElementById('editExamDate'); if (el) (typeof el.showPicker === 'function') ? el.showPicker() : el.click(); }
function handleEditDateSelect(val) { let d = document.getElementById('editExamDateDisplay'); if (!val) { if (d) { d.value = ''; d.dataset.date = ''; } return; } let p = val.split('-'); if (p.length === 3 && d) { d.value = `${p[2]}/${p[1]}/${p[0]}`; d.dataset.date = val; } }
function triggerEditTempDatePicker() { let el = document.getElementById('editTempExamDate'); if (el) (typeof el.showPicker === 'function') ? el.showPicker() : el.click(); }
function handleEditTempDateSelect(val) { let d = document.getElementById('editTempExamDateDisplay'); if (!val) { if (d) { d.value = ''; d.dataset.date = ''; } return; } let p = val.split('-'); if (p.length === 3 && d) { d.value = `${p[2]}/${p[1]}/${p[0]}`; d.dataset.date = val; } }

function toggleExamFormFields() {
    let typeElem = document.getElementById('inpExamType'), roundGroup = document.getElementById('examRoundGroup'), subGroup = document.getElementById('examSubjectGroup'), dateWrapper = document.getElementById('inpExamDateWrapper'), contentGroup = document.getElementById('examContentGroup'), hkFileGroup = document.getElementById('examHkFileGroup'), btnContentFile = document.getElementById('btnContentFileAction'), btnClearInputs = document.getElementById('btnClearInputsAction'), btnSubmitExam = document.getElementById('btnSubmitExamAction');
    if (!typeElem || !roundGroup || !subGroup || !dateWrapper || !contentGroup || !hkFileGroup) return;
    let val = typeElem.value;
    roundGroup.style.display = (val === 'HK1-KTTX' || val === 'HK2-KTTX') ? 'flex' : 'none';
    if (val !== 'HK1-KTTX' && val !== 'HK2-KTTX') { let r = document.getElementById('inpExamRound'); if (r) r.value = ''; }

    if (val === 'HK1' || val === 'HK2') {
        dateWrapper.style.display = 'none'; subGroup.style.display = 'none'; contentGroup.style.display = 'none'; hkFileGroup.style.display = 'flex';
        if (btnContentFile) btnContentFile.innerHTML = '📁 Nhập nội dung kiểm tra HK';
        if (btnClearInputs) btnClearInputs.style.display = 'none';
        if (btnSubmitExam) btnSubmitExam.innerHTML = '💾 Lưu tạm lịch thi';
    } else {
        dateWrapper.style.display = 'flex'; subGroup.style.display = 'flex'; contentGroup.style.display = 'flex'; hkFileGroup.style.display = 'none';
        if (btnContentFile) btnContentFile.innerHTML = '📁 Tải lên file nội dung KT';
        if (btnClearInputs) { btnClearInputs.style.display = 'inline-flex'; btnClearInputs.innerHTML = 'Xóa nội dung nhập'; }
        if (btnSubmitExam) btnSubmitExam.innerHTML = '➕ Lưu tạm';
    }
}

function toggleEditFormFields() {
    let typeElem = document.getElementById('editExamType'), roundGroup = document.getElementById('editExamRoundGroup'), subGroup = document.getElementById('editExamSubjectGroup'), dateWrapper = document.getElementById('editExamDateWrapper'), contentGroup = document.getElementById('editExamContentGroup'), hkFileGroup = document.getElementById('editExamHkFileGroup');
    if (!typeElem || !roundGroup || !subGroup || !dateWrapper || !contentGroup || !hkFileGroup) return;
    let val = typeElem.value;
    roundGroup.style.display = (val === 'HK1-KTTX' || val === 'HK2-KTTX') ? 'flex' : 'none';
    if (val !== 'HK1-KTTX' && val !== 'HK2-KTTX') { let r = document.getElementById('editExamRound'); if (r) r.value = ''; }
    if (val === 'HK1' || val === 'HK2') { dateWrapper.style.display = 'none'; subGroup.style.display = 'none'; contentGroup.style.display = 'none'; hkFileGroup.style.display = 'flex'; }
    else { dateWrapper.style.display = 'flex'; subGroup.style.display = 'flex'; contentGroup.style.display = 'flex'; hkFileGroup.style.display = 'none'; }
}

function toggleEditTempFormFields() {
    let typeElem = document.getElementById('editTempExamType'), roundGroup = document.getElementById('editTempExamRoundGroup');
    if (!typeElem || !roundGroup) return;
    let val = typeElem.value;
    roundGroup.style.display = (val === 'HK1-KTTX' || val === 'HK2-KTTX') ? 'flex' : 'none';
    if (val !== 'HK1-KTTX' && val !== 'HK2-KTTX') { let r = document.getElementById('editTempExamRound'); if (r) r.value = ''; }
}

let tempHkFileBase64 = "";
function handleHkFileUpload(input) {
    checkDirectFileSizeLimit(input);
    if (input.files && input.files[0]) {
        let file = input.files[0], reader = new FileReader();
        reader.onload = (e) => { tempHkFileBase64 = e.target.result; let st = document.getElementById('hkFileStatus'); if (st) st.innerText = `Đã chọn: ${file.name} (${Math.round(file.size/1024)} KB)`; };
        reader.readAsDataURL(file);
    }
}

let tempEditHkFileBase64 = "";
function handleEditHkFileUpload(input) {
    checkDirectFileSizeLimit(input);
    if (input.files && input.files[0]) {
        let file = input.files[0], reader = new FileReader();
        reader.onload = (e) => { tempEditHkFileBase64 = e.target.result; let st = document.getElementById('editHkFileStatus'); if (st) st.innerText = `Đã chọn: ${file.name} (${Math.round(file.size/1024)} KB)`; };
        reader.readAsDataURL(file);
    }
}

function handleOpenContentFileModalByExamType() {
    let typeVal = document.getElementById('inpExamType') ? document.getElementById('inpExamType').value : '';
    (typeVal === 'HK1' || typeVal === 'HK2') ? openExamHkContentModal(typeVal) : openExamContentFileModal(false);
}

function openExamHkContentModal(examType) {
    let modal = document.getElementById('examHkContentModal'), title = document.getElementById('examHkModalTitle');
    if (title) title.innerText = `📁 Nội dung kiểm tra học kì ${examType === 'HK2' ? '2' : '1'}`;
    renderHkTempSubRows();
    if (modal) modal.style.display = 'flex';
}
function closeExamHkContentModal() { let modal = document.getElementById('examHkContentModal'); if (modal) modal.style.display = 'none'; }

function clearHkSingleSubjectInputs() {
    let s = document.getElementById('inpHkSubName'), l = document.getElementById('inpHkSubLink'), c = document.getElementById('inpHkSubContent');
    if (s) s.value = ''; if (l) l.value = ''; if (c) c.value = '';
}

function addHkSubItemToTemp() {
    let s = document.getElementById('inpHkSubName'), l = document.getElementById('inpHkSubLink'), c = document.getElementById('inpHkSubContent');
    if (!s || !s.value.trim()) { alert("Vui lòng nhập tên môn!"); return; }
    tempHkSubjectList.push({ subject: s.value.trim(), link: l ? l.value.trim() : '', content: c ? c.value.trim() : '' });
    clearHkSingleSubjectInputs(); renderHkTempSubRows();
}

function renderHkTempSubRows() {
    let box = document.getElementById('hkTempSubContainer'); if (!box) return; box.innerHTML = '';
    if (tempHkSubjectList.length === 0) { box.innerHTML = '<span style="color: #aaa; font-size: 0.75rem; text-align: center;">Chưa có môn nào được thêm.</span>'; return; }
    tempHkSubjectList.forEach((sub, idx) => {
        let div = document.createElement('div'); div.className = 'card-item'; div.style.cssText = 'padding: 5px 8px; margin: 0;';
        div.innerHTML = `<div class="card-info" style="flex:1;"><h4 style="font-size:0.82rem; color:var(--primary);">📘 ${sub.subject}</h4></div><div style="display:flex; align-items:center; gap:6px;"><button type="button" class="menu-btn btn-edit" style="padding: 3px 8px; font-size: 0.72rem; margin:0;" onclick="openEditHkSubModal(${idx})">Sửa</button><button type="button" class="btn-clear-icon" style="width:24px; height:24px; font-size:0.75rem;" onclick="removeHkSubTempItem(${idx})">✖</button></div>`;
        box.appendChild(div);
    });
}

function removeHkSubTempItem(idx) { tempHkSubjectList.splice(idx, 1); renderHkTempSubRows(); }

function openEditHkSubModal(idx) {
    if (!tempHkSubjectList[idx]) return;
    editingHkSubIndex = idx; let sub = tempHkSubjectList[idx];
    let s = document.getElementById('editHkSubName'), l = document.getElementById('editHkSubLink'), c = document.getElementById('editHkSubContent');
    if (s) s.value = sub.subject || ''; if (l) l.value = sub.link || ''; if (c) c.value = sub.content || '';
    document.getElementById('editHkSubModal').style.display = 'flex';
}

function closeEditHkSubModal() { editingHkSubIndex = null; document.getElementById('editHkSubModal').style.display = 'none'; }

function saveHkSubEditChanges() {
    if (editingHkSubIndex === null || !tempHkSubjectList[editingHkSubIndex]) return;
    let s = document.getElementById('editHkSubName').value.trim(), l = document.getElementById('editHkSubLink').value.trim(), c = document.getElementById('editHkSubContent').value.trim();
    if (!s) { alert("Vui lòng nhập tên môn!"); return; }
    tempHkSubjectList[editingHkSubIndex] = { subject: s, link: l, content: c };
    closeEditHkSubModal(); renderHkTempSubRows();
}

function cancelAllHkModal() {
    if (confirm("Hủy toàn bộ các môn đang nhập?")) {
        tempHkSubjectList = []; clearHkSingleSubjectInputs(); closeExamHkContentModal();
        let status = document.getElementById('attachedContentFileStatus'); if (status) status.innerText = '';
    }
}

function saveAllHkModalSubs() {
    let status = document.getElementById('attachedContentFileStatus');
    if (status) status.innerText = tempHkSubjectList.length > 0 ? `📎 Đã đính kèm nội dung của ${tempHkSubjectList.length} môn thi HK` : '';
    closeExamHkContentModal();
}

function openExamHkOverviewModal(docId) {
    let item = examSchedules.find(e => e.docId === docId); if (!item) return;
    let titleElem = document.getElementById('examHkOverviewTitle'), colHeader = document.getElementById('examHkOverviewColHeader'), tbody = document.getElementById('examHkOverviewBody');
    let hkNum = (item.examType === 'HK2') ? '2' : '1';
    if (titleElem) titleElem.innerText = `📝 Danh sách nội dung thi Học kỳ ${hkNum}`;
    if (colHeader) colHeader.innerText = `Nội dung thi học kì ${hkNum}`;
    tbody.innerHTML = '';
    let list = Array.isArray(item.hkSubjectList) ? item.hkSubjectList : [];
    if (list.length === 0) tbody.innerHTML = `<tr><td colspan="2" style="color:#6c757d; padding:15px; text-align:center;">Chưa có danh sách môn thi chi tiết.</td></tr>`;
    else {
        list.forEach((sub, idx) => {
            tbody.innerHTML += `<tr><td><b>${sub.subject || '-'}</b></td><td><button type="button" class="btn-view-exam-link" onclick="openExamDetailForHkSub('${docId}', ${idx})">Xem</button></td></tr>`;
        });
    }
    document.getElementById('examHkOverviewModal').style.display = 'flex';
}
function closeExamHkOverviewModal() { let modal = document.getElementById('examHkOverviewModal'); if (modal) modal.style.display = 'none'; }

function openExamDetailForHkSub(docId, subIdx) {
    let item = examSchedules.find(e => e.docId === docId); if (!item || !item.hkSubjectList || !item.hkSubjectList[subIdx]) return;
    let sub = item.hkSubjectList[subIdx], titleElem = document.getElementById('examDetailModalTitle'), bodyElem = document.getElementById('examDetailModalBody');
    if (titleElem) titleElem.innerHTML = `📝 Nội dung ôn tập: ${sub.subject} - [${item.examType}]`;
    let htmlContent = sub.content ? `<div style="margin-bottom:10px; color:#212529;">${sub.content}</div>` : '';
    if (sub.link) {
        let fileUrl = sub.link.trim(), isPdf = fileUrl.includes('.pdf') || fileUrl.includes('drive.google.com/file') || fileUrl.includes('preview');
        let isImg = fileUrl.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i), pUrl = isPdf ? parseGoogleDrivePdfEmbed(fileUrl) : (isImg ? parseGoogleDriveLink(fileUrl) : fileUrl);
        let dUrl = isPdf ? parseGoogleDrivePdfDownload(fileUrl) : pUrl;
        htmlContent += `<hr style="border:0; border-top:1px solid #dee2e6; margin:8px 0;"><div style="margin-top:6px; display:flex; justify-content:space-between; align-items:center;"><span style="font-weight:bold; color:var(--primary);">📎 Tài liệu ôn tập:</span><a href="${dUrl}" target="_blank" class="btn-download" style="margin-top:0;">📥 Mở / Tải</a></div>`;
        if (isPdf) htmlContent += `<iframe src="${pUrl}" style="width:100%; height:380px; border:1px solid #ced4da; border-radius:6px; margin-top:8px;"></iframe>`;
        else if (isImg) htmlContent += `<div style="text-align:center; margin-top:8px;"><img src="${pUrl}" style="max-width:100%; max-height:360px; border-radius:6px; cursor:pointer;" onclick="openZoomModal('${pUrl}')"></div>`;
    }
    if (!htmlContent) htmlContent = '<p style="color:#6c757d; font-style:italic;">Không có nội dung chi tiết hoặc phổ biến trên lớp.</p>';
    if (bodyElem) bodyElem.innerHTML = htmlContent;
    document.getElementById('examDetailModal').style.display = 'flex';
}

function openExamDetailModal(docId) {
    let item = examSchedules.find(e => e.docId === docId); if (!item) return;
    let titleElem = document.getElementById('examDetailModalTitle'), bodyElem = document.getElementById('examDetailModalBody');
    if (titleElem) titleElem.innerHTML = `📝 Nội dung kiểm tra: ${item.subject} (${item.examType}) - [${formatDateToDDMMYY(item.examDate)}]`;
    let htmlContent = item.content ? `<div style="margin-bottom:10px; color:#212529;">${item.content}</div>` : '';
    if (item.contentFileUrl) {
        let fileUrl = item.contentFileUrl.trim(), isPdf = fileUrl.includes('.pdf') || fileUrl.includes('drive.google.com/file') || fileUrl.includes('preview');
        let isImg = fileUrl.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i), pUrl = isPdf ? parseGoogleDrivePdfEmbed(fileUrl) : (isImg ? parseGoogleDriveLink(fileUrl) : fileUrl);
        let dUrl = isPdf ? parseGoogleDrivePdfDownload(fileUrl) : pUrl;
        htmlContent += `<hr style="border:0; border-top:1px solid #dee2e6; margin:8px 0;"><div style="margin-top:6px; display:flex; justify-content:space-between; align-items:center;"><span style="font-weight:bold; color:var(--primary);">📎 Tài liệu:</span><a href="${dUrl}" target="_blank" class="btn-download" style="margin-top:0;">📥 Mở / Tải</a></div>`;
        if (isPdf) htmlContent += `<iframe src="${pUrl}" style="width:100%; height:380px; border:1px solid #ced4da; border-radius:6px; margin-top:8px;"></iframe>`;
        else if (isImg) htmlContent += `<div style="text-align:center; margin-top:8px;"><img src="${pUrl}" style="max-width:100%; max-height:360px; border-radius:6px; cursor:pointer;" onclick="openZoomModal('${pUrl}')"></div>`;
    }
    if (!htmlContent) htmlContent = '<p style="color:#6c757d; font-style:italic;">Không có nội dung chi tiết hoặc phổ biến trên lớp.</p>';
    if (bodyElem) bodyElem.innerHTML = htmlContent;
    document.getElementById('examDetailModal').style.display = 'flex';
}
function closeExamDetailModal() { let modal = document.getElementById('examDetailModal'); if (modal) modal.style.display = 'none'; }

function openExamContentFileModal(isEditing = false, isEditingTemp = false) {
    isEditingModalActive = isEditing; isEditingTempModalActive = isEditingTemp;
    let inp = document.getElementById('inpExamContentFileUrl'); if (inp) inp.value = tempExamFileUrl || '';
    let modal = document.getElementById('examContentFileModal'); if (modal) modal.style.display = 'flex';
}
function closeExamContentFileModal() { let modal = document.getElementById('examContentFileModal'); if (modal) modal.style.display = 'none'; }

function saveExamContentFileUrl() {
    let inp = document.getElementById('inpExamContentFileUrl'); if (!inp) return;
    tempExamFileUrl = inp.value.trim();
    let targetId = isEditingModalActive ? 'editAttachedContentStatus' : (isEditingTempModalActive ? 'editTempAttachedContentStatus' : 'attachedContentFileStatus');
    let stBox = document.getElementById(targetId); if (stBox) stBox.innerText = tempExamFileUrl ? `📎 Đã đính kèm link file` : ``;
    closeExamContentFileModal();
}

function handleClearCurrentInputs() { clearTempExamInputFields(); }

function clearTempExamInputFields() {
    let dDisplay = document.getElementById('inpExamDateDisplay'), d = document.getElementById('inpExamDate'), s = document.getElementById('inpExamSubject'), r = document.getElementById('inpExamRound'), t = document.getElementById('inpExamType'), c = document.getElementById('inpExamContent'), u = document.getElementById('inpExamHkUrl'), f = document.getElementById('inpExamHkFile'), st = document.getElementById('hkFileStatus'), stBox = document.getElementById('attachedContentFileStatus');
    if (dDisplay) { dDisplay.value = ''; dDisplay.dataset.date = ''; }
    if (d) d.value = ''; if (s) s.value = ''; if (r) r.value = ''; if (t) t.selectedIndex = 0; if (c) c.value = ''; if (u) u.value = ''; if (f) f.value = ''; if (st) st.innerText = ''; if (stBox) stBox.innerText = '';
    tempHkFileBase64 = ''; tempExamFileUrl = ''; tempHkSubjectList = []; toggleExamFormFields();
}

function cancelAllTempExamInput() {
    if (confirm("Hủy toàn bộ danh sách chờ lưu và quay lại trang chính?")) { tempExamList = []; clearTempExamInputFields(); switchView('welcome_dashboard'); }
}

let isEditingHkDatabase = false, editingHkDatabaseDocId = null, currentEditingHkDatabaseSubList = [], childHkSubTempList = [];

function openAddHkSubChildModal() {
    let currentExam = isEditingHkDatabase ? examSchedules.find(e => e.docId === editingHkDatabaseDocId) : (editingTempExamIndex !== null ? tempExamList[editingTempExamIndex] : null);
    let examType = currentExam ? currentExam.examType : 'HK1';
    let title = document.getElementById('addHkSubChildTitle'); if (title) title.innerText = `📁 Cập nhật nội dung kiểm tra HK ${examType === 'HK2' ? '2' : '1'}`;
    childHkSubTempList = []; clearChildHkInputs(); renderChildHkTempRows();
    document.getElementById('addHkSubChildModal').style.display = 'flex';
}

function closeAddHkSubChildModal() { childHkSubTempList = []; document.getElementById('addHkSubChildModal').style.display = 'none'; }

function clearChildHkInputs() {
    let s = document.getElementById('childHkSubName'), l = document.getElementById('childHkSubLink'), c = document.getElementById('childHkSubContent');
    if (s) s.value = ''; if (l) l.value = ''; if (c) c.value = '';
}

function addChildHkSubItem() {
    let s = document.getElementById('childHkSubName'), l = document.getElementById('childHkSubLink'), c = document.getElementById('childHkSubContent');
    if (!s || !s.value.trim()) { alert("Vui lòng nhập tên môn!"); return; }
    childHkSubTempList.push({ subject: s.value.trim(), link: l ? l.value.trim() : '', content: c ? c.value.trim() : '' });
    clearChildHkInputs(); renderChildHkTempRows();
}

function renderChildHkTempRows() {
    let box = document.getElementById('childHkTempContainer'); if (!box) return; box.innerHTML = '';
    if (childHkSubTempList.length === 0) { box.innerHTML = '<span style="color:#aaa; font-size:0.75rem; text-align:center;">Chưa có môn nào được thêm.</span>'; return; }
    childHkSubTempList.forEach((sub, idx) => {
        let div = document.createElement('div'); div.className = 'card-item'; div.style.cssText = 'padding: 5px 8px; margin: 0;';
        div.innerHTML = `<div class="card-info" style="flex:1;"><h4 style="font-size:0.82rem; color:var(--primary);">📘 ${sub.subject}</h4></div><button type="button" class="btn-clear-icon" style="width:24px; height:24px; font-size:0.75rem;" onclick="removeChildHkSubItem(${idx})">✖</button>`;
        box.appendChild(div);
    });
}

function removeChildHkSubItem(idx) { childHkSubTempList.splice(idx, 1); renderChildHkTempRows(); }

function commitAddHkSubChildList() {
    if (childHkSubTempList.length > 0) {
        if (isEditingHkDatabase) {
            currentEditingHkDatabaseSubList.push(...childHkSubTempList); renderEditTempHkSubRows();
        } else if (editingTempExamIndex !== null && tempExamList[editingTempExamIndex]) {
            if (!Array.isArray(tempExamList[editingTempExamIndex].hkSubjectList)) tempExamList[editingTempExamIndex].hkSubjectList = [];
            tempExamList[editingTempExamIndex].hkSubjectList.push(...childHkSubTempList); renderEditTempHkSubRows();
        }
    }
    closeAddHkSubChildModal();
}

function openEditDatabaseHkExamModal(docId) {
    let item = examSchedules.find(e => e.docId === docId); if (!item) return;
    isEditingHkDatabase = true; editingHkDatabaseDocId = docId; editingTempExamIndex = null;
    currentEditingHkDatabaseSubList = Array.isArray(item.hkSubjectList) ? [...item.hkSubjectList] : [];
    let title = document.getElementById('editTempHkModalTitle'); if (title) title.innerText = `Chỉnh sửa lịch thi học kì ${item.examType === 'HK2' ? '2' : '1'}`;
    let urlInput = document.getElementById('editTempHkUrl'); if (urlInput) urlInput.value = item.hkFileUrl || '';
    renderEditTempHkSubRows(); document.getElementById('editTempHkExamModal').style.display = 'flex';
}

function addTempExamItem() {
    let dateDisplay = document.getElementById('inpExamDateDisplay');
    let dateVal = (dateDisplay && dateDisplay.dataset.date) ? dateDisplay.dataset.date : (document.getElementById('inpExamDate') ? document.getElementById('inpExamDate').value : '');
    let typeElem = document.getElementById('inpExamType'), typeVal = typeElem ? typeElem.value : '';
    let roundElem = document.getElementById('inpExamRound'), roundVal = roundElem ? roundElem.value.trim() : '';
    let subjectVal = document.getElementById('inpExamSubject') ? document.getElementById('inpExamSubject').value.trim() : '';
    let contentVal = document.getElementById('inpExamContent') ? document.getElementById('inpExamContent').value.trim() : '';
    let hkUrlVal = document.getElementById('inpExamHkUrl') ? document.getElementById('inpExamHkUrl').value.trim() : '';

    if (!typeVal) { alert("Vui lòng chọn Loại kiểm tra!"); return; }
    let isHk = (typeVal === 'HK1' || typeVal === 'HK2'), hkFileFinal = hkUrlVal ? parseGoogleDriveLink(hkUrlVal) : tempHkFileBase64;

    if (isHk) {
        if (!hkFileFinal && tempHkSubjectList.length === 0) { alert("Vui lòng đính kèm file/link lịch thi hoặc nhập ít nhất 1 môn thi học kỳ!"); return; }
    } else {
        if (!dateVal) { alert("Vui lòng chọn ngày kiểm tra!"); return; }
        if (!subjectVal) { alert("Vui lòng nhập môn kiểm tra!"); return; }
    }

    let finalExamType = typeVal;
    if ((typeVal === 'HK1-KTTX' || typeVal === 'HK2-KTTX') && roundVal) finalExamType = `${typeVal} lần ${roundVal}`;

    let now = new Date(), createdDateStr = formatDateToDDMMYY(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
    let item = {
        tempId: Date.now() + Math.random(), examDate: isHk ? 'Theo lịch thi' : dateVal, createdDate: createdDateStr,
        examType: finalExamType, subject: isHk ? `Lịch thi ${typeVal}` : subjectVal, content: isHk ? '' : contentVal,
        contentFileUrl: isHk ? '' : (tempExamFileUrl || ''), hkFileUrl: isHk ? hkFileFinal : '', hkSubjectList: isHk ? [...tempHkSubjectList] : [],
        author: currentUser.name || "GVCN"
    };
    tempExamList.push(item); clearTempExamInputFields(); renderTempExamRows();
}

function openEditTempExamModal(idx) {
    if (!tempExamList[idx]) return;
    editingTempExamIndex = idx; let item = tempExamList[idx];
    let d = document.getElementById('editTempExamDate'), t = document.getElementById('editTempExamType'), r = document.getElementById('editTempExamRound'), s = document.getElementById('editTempExamSubject'), c = document.getElementById('editTempExamContent'), stBox = document.getElementById('editTempAttachedContentStatus');
    if (d && item.examDate) { d.value = item.examDate; handleEditTempDateSelect(item.examDate); }
    if (t && item.examType) {
        let m = item.examType.match(/(HK[12]-KTTX)\s+lần\s+(\d+)/);
        if (m) { t.value = m[1]; if (r) r.value = m[2]; } else { t.value = item.examType; if (r) r.value = ''; }
        toggleEditTempFormFields();
    }
    if (s) s.value = item.subject || ''; if (c) c.value = item.content || '';
    tempExamFileUrl = item.contentFileUrl || ''; if (stBox) stBox.innerText = tempExamFileUrl ? `📎 Đã đính kèm link file` : ``;
    document.getElementById('editTempExamModal').style.display = 'flex';
}
function closeEditTempExamModal() { editingTempExamIndex = null; document.getElementById('editTempExamModal').style.display = 'none'; }

function saveEditTempExamChanges() {
    if (editingTempExamIndex === null || !tempExamList[editingTempExamIndex]) return;
    let dateDisplay = document.getElementById('editTempExamDateDisplay');
    let dateVal = (dateDisplay && dateDisplay.dataset.date) ? dateDisplay.dataset.date : (document.getElementById('editTempExamDate') ? document.getElementById('editTempExamDate').value : '');
    let typeElem = document.getElementById('editTempExamType'), typeVal = typeElem ? typeElem.value : '';
    let roundElem = document.getElementById('editTempExamRound'), roundVal = roundElem ? roundElem.value.trim() : '';
    let subjectVal = document.getElementById('editTempExamSubject') ? document.getElementById('editTempExamSubject').value.trim() : '';
    let contentVal = document.getElementById('editTempExamContent') ? document.getElementById('editTempExamContent').value.trim() : '';

    if (!dateVal) { alert("Vui lòng chọn ngày kiểm tra!"); return; }
    if (!typeVal) { alert("Vui lòng chọn Loại kiểm tra!"); return; }
    if (!subjectVal) { alert("Vui lòng nhập môn kiểm tra!"); return; }

    let finalExamType = typeVal;
    if ((typeVal === 'HK1-KTTX' || typeVal === 'HK2-KTTX') && roundVal) finalExamType = `${typeVal} lần ${roundVal}`;

    tempExamList[editingTempExamIndex].examDate = dateVal;
    tempExamList[editingTempExamIndex].examType = finalExamType;
    tempExamList[editingTempExamIndex].subject = subjectVal;
    tempExamList[editingTempExamIndex].content = contentVal;
    tempExamList[editingTempExamIndex].contentFileUrl = tempExamFileUrl || '';
    closeEditTempExamModal(); renderTempExamRows();
}

function renderTempExamRows() {
    let container = document.getElementById('tempExamListContainer'); if (!container) return; container.innerHTML = '';
    if (tempExamList.length === 0) { container.innerHTML = '<span style="font-size:0.75rem; color:#aaa; text-align:center;">Chưa có môn nào được thêm vào danh sách tạm.</span>'; return; }
    tempExamList.forEach((item, idx) => {
        let div = document.createElement('div'); div.className = 'card-item'; div.style.cssText = 'padding:6px 10px; margin:0;';
        let isHk = (item.examType === 'HK1' || item.examType === 'HK2');
        let titleText = isHk ? `Lịch thi ${item.examType}` : `[${formatDateToDDMMYY(item.examDate)}] ${item.subject} (${item.examType})`;
        div.innerHTML = `<div class="card-info" style="flex:1;"><h4 style="font-size:0.84rem; color:var(--primary);">${titleText}</h4></div><div style="display:flex; align-items:center; gap:6px;"><button type="button" class="menu-btn btn-edit" style="padding:3px 8px; font-size:0.72rem; margin:0;" onclick="${isHk ? `openEditTempHkExamModal(${idx})` : `openEditTempExamModal(${idx})`}">Sửa</button><button type="button" class="btn-clear-icon" style="width:24px; height:24px; font-size:0.75rem;" onclick="removeTempExamItem(${idx})">✖</button></div>`;
        container.appendChild(div);
    });
}
function removeTempExamItem(idx) { tempExamList.splice(idx, 1); renderTempExamRows(); }

function openEditTempHkExamModal(idx) {
    isEditingHkDatabase = false; editingHkDatabaseDocId = null;
    if (!tempExamList[idx]) return;
    editingTempExamIndex = idx; let item = tempExamList[idx];
    let title = document.getElementById('editTempHkModalTitle'); if (title) title.innerText = `Chỉnh sửa lịch thi học kì ${item.examType === 'HK2' ? '2' : '1'}`;
    let urlInput = document.getElementById('editTempHkUrl'); if (urlInput) urlInput.value = item.hkFileUrl || '';
    renderEditTempHkSubRows(); document.getElementById('editTempHkExamModal').style.display = 'flex';
}

function closeEditTempHkExamModal() {
    editingTempExamIndex = null; isEditingHkDatabase = false; editingHkDatabaseDocId = null; currentEditingHkDatabaseSubList = [];
    document.getElementById('editTempHkExamModal').style.display = 'none';
}

let tempEditTempHkFileBase64 = "";
function handleEditTempHkFileUpload(input) {
    checkDirectFileSizeLimit(input);
    if (input.files && input.files[0]) {
        let file = input.files[0], reader = new FileReader();
        reader.onload = (e) => { tempEditTempHkFileBase64 = e.target.result; let status = document.getElementById('editTempHkFileStatus'); if (status) status.innerText = `Đã chọn: ${file.name} (${Math.round(file.size/1024)} KB)`; };
        reader.readAsDataURL(file);
    }
}

function renderEditTempHkSubRows() {
    let container = document.getElementById('editTempHkSubContainer'); if (!container) return; container.innerHTML = '';
    let list = isEditingHkDatabase ? currentEditingHkDatabaseSubList : (editingTempExamIndex !== null && tempExamList[editingTempExamIndex] ? tempExamList[editingTempExamIndex].hkSubjectList || [] : []);
    if (list.length === 0) { container.innerHTML = '<span style="color:#aaa; font-size:0.75rem; text-align:center;">Chưa có môn nào được thêm.</span>'; return; }
    list.forEach((sub, subIdx) => {
        let div = document.createElement('div'); div.className = 'card-item'; div.style.cssText = 'padding: 5px 8px; margin: 0;';
        div.innerHTML = `<div class="card-info" style="flex:1;"><h4 style="font-size:0.82rem; color:var(--primary);">📘 ${sub.subject}</h4></div><div style="display:flex; align-items:center; gap:6px;"><button type="button" class="menu-btn btn-edit" style="padding: 3px 8px; font-size: 0.72rem; margin:0;" onclick="openEditSubFromTempHk(${subIdx})">Sửa</button><button type="button" class="btn-clear-icon" style="width:24px; height:24px; font-size:0.75rem;" onclick="removeSubFromTempHk(${subIdx})">✖</button></div>`;
        container.appendChild(div);
    });
}

function removeSubFromTempHk(subIdx) {
    if (isEditingHkDatabase) currentEditingHkDatabaseSubList.splice(subIdx, 1);
    else if (editingTempExamIndex !== null && tempExamList[editingTempExamIndex]) tempExamList[editingTempExamIndex].hkSubjectList.splice(subIdx, 1);
    renderEditTempHkSubRows();
}

function openEditSubFromTempHk(subIdx) {
    let list = isEditingHkDatabase ? currentEditingHkDatabaseSubList : (editingTempExamIndex !== null && tempExamList[editingTempExamIndex] ? tempExamList[editingTempExamIndex].hkSubjectList || [] : []);
    if (!list[subIdx]) return;
    let sub = list[subIdx]; editingHkSubIndex = subIdx;
    let s = document.getElementById('editHkSubName'), l = document.getElementById('editHkSubLink'), c = document.getElementById('editHkSubContent');
    if (s) s.value = sub.subject || ''; if (l) l.value = sub.link || ''; if (c) c.value = sub.content || '';
    document.getElementById('editHkSubModal').style.display = 'flex';
}

async function saveEditTempHkExamChanges() {
    let urlInput = document.getElementById('editTempHkUrl'), finalUrl = urlInput ? urlInput.value.trim() : '';
    if (tempEditTempHkFileBase64) finalUrl = tempEditTempHkFileBase64;
    if (isEditingHkDatabase && editingHkDatabaseDocId) {
        try {
            let updateData = { hkSubjectList: [...currentEditingHkDatabaseSubList] };
            if (finalUrl) updateData.hkFileUrl = finalUrl;
            await db.collection("exam_schedules").doc(editingHkDatabaseDocId).update(updateData);
            alert("Cập nhật lịch thi học kỳ thành công!"); tempEditTempHkFileBase64 = ""; closeEditTempHkExamModal();
        } catch (err) { alert("Lỗi khi cập nhật lịch thi: " + err.message); }
        return;
    }
    if (editingTempExamIndex !== null && tempExamList[editingTempExamIndex]) {
        tempExamList[editingTempExamIndex].hkFileUrl = finalUrl; tempEditTempHkFileBase64 = ""; closeEditTempHkExamModal(); renderTempExamRows();
    }
}

async function saveAllTempExams() {
    if (tempExamList.length === 0) { alert("Danh sách tạm đang trống. Hãy thêm ít nhất 1 bài kiểm tra!"); return; }
    try {
        let batch = db.batch();
        tempExamList.forEach(item => {
            let docRef = db.collection("exam_schedules").doc("exam_" + Date.now() + "_" + Math.floor(Math.random()*1000));
            let dataToSave = { ...item }; delete dataToSave.tempId; batch.set(docRef, dataToSave);
        });
        await batch.commit(); alert(`Đã lưu thành công ${tempExamList.length} lịch kiểm tra lên máy chủ!`);
        tempExamList = []; switchView('admin_homework');
    } catch (err) { alert("Lỗi khi lưu lịch kiểm tra: " + err.message); }
}

function openEditExamModal(docId) {
    let item = examSchedules.find(e => e.docId === docId); if (!item) return;
    if (item.examType === 'HK1' || item.examType === 'HK2') { openEditDatabaseHkExamModal(docId); return; }
    editingExamDocId = docId;
    let d = document.getElementById('editExamDate'), t = document.getElementById('editExamType'), r = document.getElementById('editExamRound'), s = document.getElementById('editExamSubject'), c = document.getElementById('editExamContent'), stBox = document.getElementById('editAttachedContentStatus');
    if (d && item.examDate) { d.value = item.examDate; handleEditDateSelect(item.examDate); }
    if (t && item.examType) {
        let m = item.examType.match(/(HK[12]-KTTX)\s+lần\s+(\d+)/);
        if (m) { t.value = m[1]; if (r) r.value = m[2]; } else { t.value = item.examType; if (r) r.value = ''; }
        toggleEditFormFields();
    }
    if (s) s.value = item.subject || ''; if (c) c.value = item.content || '';
    tempExamFileUrl = item.contentFileUrl || ''; if (stBox) stBox.innerText = tempExamFileUrl ? `📎 Đã đính kèm link file` : ``;
    document.getElementById('editExamModal').style.display = 'flex';
}
function closeEditExamModal() { editingExamDocId = null; document.getElementById('editExamModal').style.display = 'none'; }

async function saveEditedExamToDatabase() {
    if (!editingExamDocId) return;
    let dateDisplay = document.getElementById('editExamDateDisplay');
    let dateVal = (dateDisplay && dateDisplay.dataset.date) ? dateDisplay.dataset.date : (document.getElementById('editExamDate') ? document.getElementById('editExamDate').value : '');
    let typeElem = document.getElementById('editExamType'), typeVal = typeElem ? typeElem.value : '';
    let roundElem = document.getElementById('editExamRound'), roundVal = roundElem ? roundElem.value.trim() : '';
    let subjectVal = document.getElementById('editExamSubject') ? document.getElementById('editExamSubject').value.trim() : '';
    let contentVal = document.getElementById('editExamContent') ? document.getElementById('editExamContent').value.trim() : '';

    let isHk = (typeVal === 'HK1' || typeVal === 'HK2');
    if (!isHk && !dateVal) { alert("Vui lòng chọn ngày kiểm tra!"); return; }

    let finalExamType = typeVal;
    if ((typeVal === 'HK1-KTTX' || typeVal === 'HK2-KTTX') && roundVal) finalExamType = `${typeVal} lần ${roundVal}`;

    try {
        let updateData = { examDate: isHk ? 'Theo lịch thi' : dateVal, examType: finalExamType, subject: isHk ? `Lịch thi ${typeVal}` : (subjectVal || `Lịch thi ${typeVal}`), content: isHk ? '' : contentVal, contentFileUrl: tempExamFileUrl || '' };
        await db.collection("exam_schedules").doc(editingExamDocId).update(updateData);
        alert("Cập nhật lịch kiểm tra thành công!"); closeEditExamModal();
    } catch (err) { alert("Lỗi khi cập nhật lịch kiểm tra: " + err.message); }
}

async function deleteExistingExam(docId) {
    if (confirm("Bạn có chắc chắn muốn xóa lịch kiểm tra này?")) {
        try { await db.collection("exam_schedules").doc(docId).delete(); alert("Đã xóa lịch kiểm tra!"); } catch (err) { alert("Lỗi khi xóa: " + err.message); }
    }
}