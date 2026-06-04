(function () {
  const ICON_EDIT =
    '<svg class="cr-foot-btn__ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
  const ICON_INVITE =
    '<svg class="cr-foot-btn__ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>';
  const BOOK_ACTIONS = [
    { key: 'smartLecture', label: '智能云讲义' },
    { key: 'task', label: '任务模式创建' },
    { key: 'av', label: '视听内容' },
    { key: 'teach', label: '教材讲义（教学）' },
    { key: 'res', label: '资源库' },
    { key: 'lab', label: '教学实训' },
    { key: 'publish', label: '出版详情查看' },
    {
      key: 'meta',
      label: '图书信息编辑',
      hint: '封面、名称、主编、简介与视频介绍等',
    },
    { key: 'delete', label: '删除教材', danger: true, hint: '删除该图书，操作不可恢复' },
  ];

  /** 与阅读端 src/main.js 一致的封面 pastel 色板与科目映射 */
  var READER_PAL = [
    ['#4a8ec8', '#7ab4de'],
    ['#4a8ec8', '#7ab4de'],
    ['#d48548', '#e8a870'],
    ['#8a60b8', '#aa88d0'],
    ['#c85a72', '#e08898'],
    ['#b8a030', '#d0c060'],
    ['#4a98b0', '#78bcd0'],
    ['#98804a', '#b8a878'],
  ];
  var READER_SM = {
    计算机基础: 0,
    Python: 1,
    程序设计: 2,
    计算机网络: 3,
    Web前端: 4,
    办公应用: 5,
    数字媒体: 6,
    数据库: 0,
    Linux: 1,
    算法与结构: 2,
    人工智能: 3,
    机器学习: 4,
    深度学习: 5,
    自然语言: 6,
    云计算: 7,
    大数据: 0,
    移动开发: 1,
    网络安全: 2,
    机器人: 3,
  };

  function readerCoverColors(subKey) {
    var k = subKey && READER_SM.hasOwnProperty(subKey) ? subKey : '计算机基础';
    var idx = READER_SM[k] != null ? READER_SM[k] : 0;
    return READER_PAL[idx % READER_PAL.length];
  }

  function guessSubKeyFromDiscipline(discipline) {
    var t = String(discipline || '');
    if (/艺术|视觉|媒体|设计|版式/.test(t)) return '数字媒体';
    if (/机械|工程|制图|CAD/i.test(t)) return '程序设计';
    if (/Python|python/.test(t)) return 'Python';
    if (/网络|安全|运维|Linux/i.test(t)) return '计算机网络';
    if (/数据库|SQL|MySQL/i.test(t)) return '数据库';
    if (/人工智能|AI|机器学习|深度学习/.test(t)) return '人工智能';
    if (/办公|WPS|Office/.test(t)) return '办公应用';
    if (/Web|前端|HTML|网页/.test(t)) return 'Web前端';
    return '计算机基础';
  }

  function coverGradeLine(b) {
    var parts = String(b.sub || '').split(/\s*·\s*/);
    return parts[0] ? parts[0].trim() : '数字教材';
  }

  function coverSubLine(b) {
    var parts = String(b.sub || '').split(/\s*·\s*/);
    if (parts.length > 1) return parts.slice(1).join(' · ').trim();
    return '创作者教材';
  }

  function cssUrlQuote(u) {
    return JSON.stringify(String(u || ''));
  }

  function buildReaderStyleCoverHtml(b) {
    var sk = b.subKey || guessSubKeyFromDiscipline(b.sub || b.title);
    var pair = readerCoverColors(sk);
    var c1 = pair[0];
    var c2 = pair[1];
    var g = escapeHtml(coverGradeLine(b));
    var sub = escapeHtml(coverSubLine(b));
    var name = escapeHtml(b.title);
    if (b.coverDataUrl) {
      return (
        '<div class="cover cr-creator-cover" aria-hidden="true">' +
        '<div class="cover-inner cover-inner--image">' +
        '<div class="cover-photo-bg" style="background-image:url(' +
        cssUrlQuote(b.coverDataUrl) +
        ')"></div>' +
        '<div class="cover-photo-vignette" aria-hidden="true"></div>' +
        '<span class="cover-grade">' +
        g +
        '</span>' +
        '<div class="cover-name">' +
        name +
        '</div>' +
        '<div class="cover-sub">' +
        sub +
        '</div></div></div>'
      );
    }
    return (
      '<div class="cover cr-creator-cover" aria-hidden="true">' +
      '<div class="cover-inner" style="background:linear-gradient(145deg,' +
      c1 +
      ',' +
      c2 +
      ')">' +
      '<span class="cover-grade">' +
      g +
      '</span>' +
      '<div class="cover-name">' +
      name +
      '</div>' +
      '<div class="cover-sub">' +
      sub +
      '</div></div></div>'
    );
  }

  var coverDraftUrl = null;
  var COVER_FILE_MAX = 2.5 * 1024 * 1024;
  var introVideoDraft = { dataUrl: null, name: null };
  var VIDEO_FILE_MAX = 28 * 1024 * 1024;
  var PROFILE_AVATAR_FILE_MAX = 2 * 1024 * 1024;
  var CREATOR_PROFILE_KEY = 'creator-profile';
  var CREATOR_PASSWORD_KEY = 'creator-password';
  var CREATOR_LOGIN_KEY = 'creator-login-session';
  var CREATOR_DEFAULT_NAME = '李明远';
  var CREATOR_DEFAULT_AVATAR =
    'https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=Wang&backgroundColor=b6e3f4';
  var CREATOR_AVATAR_PRESETS = [
    'https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=Lin&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=Chen&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=Wang&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=Liu&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=Zhao&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=Yang&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=Xu&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=Sun&backgroundColor=b6e3f4',
  ];
  var creatorProfileDraft = {
    name: CREATOR_DEFAULT_NAME,
    avatar: CREATOR_DEFAULT_AVATAR,
  };

  function simpleHash(str) {
    var h = 5381;
    var s = String(str || '');
    for (var i = 0; i < s.length; i++) {
      h = (h << 5) + h + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  function wrapTextLines(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    var s = String(text || '');
    var line = '';
    var yy = y;
    var n = 0;
    for (var i = 0; i < s.length && n < maxLines; i++) {
      var test = line + s.charAt(i);
      if (ctx.measureText(test).width > maxWidth && line.length > 0) {
        ctx.fillText(line, x, yy);
        line = s.charAt(i);
        yy += lineHeight;
        n++;
      } else {
        line = test;
      }
    }
    if (line && n < maxLines) ctx.fillText(line, x, yy);
  }

  function generateAiCoverDataUrl(prompt, title) {
    var w = 360;
    var h = 480;
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    var ctx = c.getContext('2d');
    var seed = simpleHash(String(prompt || '') + '|' + String(title || ''));
    var hue1 = seed % 360;
    var hue2 = (seed * 17 + 47) % 360;
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, 'hsl(' + hue1 + ',48%,38%)');
    g.addColorStop(0.45, 'hsl(' + hue2 + ',42%,32%)');
    g.addColorStop(1, 'hsl(' + ((hue1 + 22) % 360) + ',35%,24%)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.beginPath();
    ctx.arc(w * 0.78, h * 0.22, w * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = 'hsla(' + hue2 + ',60%,55%,0.12)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.12, h * 0.88, w * 0.42, 0, Math.PI * 2);
    ctx.fillStyle = 'hsla(0,0%,100%,0.08)';
    ctx.fill();
    var k;
    for (k = 0; k < 80; k++) {
      var rx = Math.abs((seed * (k + 3)) % w);
      var ry = Math.abs((seed * (k + 7)) % h);
      ctx.fillStyle = 'rgba(255,255,255,' + (0.02 + ((k * 13 + seed) % 5) / 200) + ')';
      ctx.fillRect(rx, ry, 2, 2);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.font = '13px "Noto Sans SC",system-ui,sans-serif';
    wrapTextLines(ctx, (prompt || '').slice(0, 120), 18, 36, w - 36, 20, 4);
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.font = 'bold 22px "ZCOOL XiaoWei",serif';
    var t = String(title || '教材').slice(0, 18);
    ctx.fillText(t, 18, h - 56);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '11px system-ui,sans-serif';
    ctx.fillText('AI 演示预览', 18, h - 30);
    return c.toDataURL('image/jpeg', 0.88);
  }

  function updateCoverPreview() {
    var img = document.getElementById('formCoverPreview');
    var ph = document.getElementById('formCoverPreviewPh');
    var hit = document.getElementById('btnPickCover');
    if (!img || !ph) return;
    if (coverDraftUrl) {
      img.src = coverDraftUrl;
      img.hidden = false;
      img.alt = '封面预览';
      ph.hidden = true;
      if (hit) hit.classList.add('cr-cover-hit--has');
    } else {
      img.removeAttribute('src');
      img.hidden = true;
      img.alt = '';
      ph.hidden = false;
      if (hit) hit.classList.remove('cr-cover-hit--has');
    }
  }

  function subLineForSave(existingBook) {
    var status = '草稿';
    if (existingBook && existingBook.sub) {
      var parts = String(existingBook.sub).split(/\s*·\s*/);
      if (parts.length > 1) status = parts.slice(1).join(' · ');
    }
    return '教材 · ' + status;
  }

  function setAiChipLabel(text) {
    var btn = document.getElementById('btnToggleAiCover');
    if (!btn) return;
    var el = btn.querySelector('.cr-ai-chip__txt');
    if (el) el.textContent = text;
    else btn.textContent = text;
  }

  function collapseCoverAiPanel() {
    var panel = document.getElementById('crCoverAiPanel');
    var toggle = document.getElementById('btnToggleAiCover');
    if (panel) panel.hidden = true;
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    setAiChipLabel('AI 生成');
  }

  function updateIntroVideoUI() {
    var ph = document.getElementById('formIntroVideoPh');
    var nm = document.getElementById('formIntroVideoName');
    var hit = document.getElementById('btnPickIntroVideo');
    if (!ph || !nm) return;
    if (introVideoDraft.dataUrl) {
      ph.hidden = true;
      nm.hidden = false;
      nm.textContent = introVideoDraft.name || '已选择视频';
      if (hit) hit.classList.add('cr-video-hit--has');
    } else {
      ph.hidden = false;
      nm.hidden = true;
      nm.textContent = '';
      if (hit) hit.classList.remove('cr-video-hit--has');
    }
  }

  function openBookModal(book) {
    var isEdit = !!book;
    editingId = isEdit ? book.id : null;
    var mt = document.getElementById('modalBookTitle');
    if (mt) mt.textContent = isEdit ? '编辑图书' : '创建图书';
    var ft = document.getElementById('formBookTitle');
    var fe = document.getElementById('formBookEditor');
    var fi = document.getElementById('formBookIntro');
    var ai = document.getElementById('formCoverAiPrompt');
    var fileInp = document.getElementById('formCoverFile');
    var fileVid = document.getElementById('formIntroVideoFile');
    if (fileInp) fileInp.value = '';
    if (fileVid) fileVid.value = '';
    if (ai) ai.value = '';
    collapseCoverAiPanel();
    if (isEdit) {
      if (ft) ft.value = book.title || '';
      if (fe) fe.value = book.editorInChief || '';
      if (fi) fi.value = book.intro || '';
      coverDraftUrl = book.coverDataUrl || null;
      introVideoDraft = {
        dataUrl: book.introVideoDataUrl || null,
        name: book.introVideoFileName || null,
      };
    } else {
      if (ft) ft.value = '';
      if (fe) fe.value = '';
      if (fi) fi.value = '';
      coverDraftUrl = null;
      introVideoDraft = { dataUrl: null, name: null };
    }
    updateCoverPreview();
    updateIntroVideoUI();
    openModal('#modalBook');
  }

  let books = [
    {
      id: 'b1',
      title: 'Python 程序设计基础',
      sub: '教材 · 草稿',
      updated: '2026-04-18',
      subKey: 'Python',
      editorInChief: '张炜、李可',
      intro: '面向零基础读者的 Python 入门教材，涵盖语法、函数与简单项目实践。',
      introVideoDataUrl: null,
      introVideoFileName: '',
      coverDataUrl: null,
      team: [
        { id: 'u-me', name: '李明远', role: 'owner', avatar: '李' },
        { id: 'u-a', name: '王悦', role: 'member', avatar: '王' },
        { id: 'u-b', name: '陈思', role: 'member', avatar: '陈' },
      ],
    },
    {
      id: 'b2',
      title: '数字媒体技术导论',
      sub: '教材 · 审核中',
      updated: '2026-04-10',
      subKey: '数字媒体',
      editorInChief: '王悦',
      intro: '介绍数字媒体基础概念、采集与编辑流程，适合设计类通识课。',
      introVideoDataUrl: null,
      introVideoFileName: '',
      coverDataUrl: null,
      team: [
        { id: 'u-me', name: '李明远', role: 'owner', avatar: '李' },
        { id: 'u-c', name: '赵明', role: 'member', avatar: '赵' },
      ],
    },
    {
      id: 'b3',
      title: '工程制图与 CAD',
      sub: '教材 · 已发布',
      updated: '2026-03-22',
      subKey: '程序设计',
      editorInChief: '李明远',
      intro: '制图规范与 CAD 软件操作并重，配套练习与图样示例。',
      introVideoDataUrl: null,
      introVideoFileName: '',
      coverDataUrl: null,
      team: [{ id: 'u-me', name: '李明远', role: 'owner', avatar: '李' }],
    },
  ];

  let editingId = null;
  let pendingDeleteId = null;

  function $(sel) {
    return document.querySelector(sel);
  }

  function showToast(msg) {
    var t = document.getElementById('creatorToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast._tm);
    showToast._tm = setTimeout(function () {
      t.classList.remove('show');
    }, 2400);
  }

  function setPanel(key) {
    document.querySelectorAll('.sidebar-nav .nav-item[data-panel]').forEach(function (el) {
      el.classList.toggle('active', el.dataset.panel === key);
    });
    document.querySelectorAll('.scroll .page').forEach(function (el) {
      el.classList.toggle('active', el.id === 'panel-' + key);
    });
    var titleEl = document.getElementById('creatorPageTitle');
    var hintEl = document.getElementById('creatorTopHint');
    if (key === 'stats') {
      if (titleEl) titleEl.textContent = '使用统计';
      if (hintEl) hintEl.textContent = '访问与教学行为数据总览';
    } else {
      if (titleEl) titleEl.textContent = '我的图书';
      if (hintEl) hintEl.textContent = '管理教材与多端内容配置';
    }
  }

  function openModal(id) {
    var m = document.querySelector(id);
    if (m) m.classList.add('open');
  }

  function closeModal(id) {
    var m = document.querySelector(id);
    if (m) m.classList.remove('open');
  }

  function readCreatorProfile() {
    try {
      var raw = localStorage.getItem(CREATOR_PROFILE_KEY);
      if (!raw) return { name: CREATOR_DEFAULT_NAME, avatar: CREATOR_DEFAULT_AVATAR };
      var parsed = JSON.parse(raw);
      return {
        name: parsed && parsed.name ? parsed.name : CREATOR_DEFAULT_NAME,
        avatar: parsed && parsed.avatar ? parsed.avatar : CREATOR_DEFAULT_AVATAR,
      };
    } catch (e) {
      return { name: CREATOR_DEFAULT_NAME, avatar: CREATOR_DEFAULT_AVATAR };
    }
  }

  function writeCreatorProfile(profile) {
    localStorage.setItem(CREATOR_PROFILE_KEY, JSON.stringify(profile));
  }

  function applyCreatorProfile(profile) {
    var name = String((profile && profile.name) || CREATOR_DEFAULT_NAME).trim() || CREATOR_DEFAULT_NAME;
    var avatar = String((profile && profile.avatar) || CREATOR_DEFAULT_AVATAR).trim() || CREATOR_DEFAULT_AVATAR;
    var topName = document.getElementById('creatorUserName');
    var topAvatar = document.getElementById('creatorUserAvatar');
    var previewName = document.getElementById('creatorSettingsPreviewName');
    var previewAvatar = document.getElementById('creatorSettingsPreviewAvatar');
    if (topName) topName.textContent = name;
    if (topAvatar) topAvatar.src = avatar;
    if (previewName) previewName.textContent = name;
    if (previewAvatar) previewAvatar.src = avatar;
  }

  function hasCreatorPassword() {
    return !!localStorage.getItem(CREATOR_PASSWORD_KEY);
  }

  function refreshCreatorPasswordState() {
    var has = hasCreatorPassword();
    var statusEl = document.getElementById('creatorPasswordStatusText');
    var entryText = document.getElementById('creatorPasswordEntryText');
    if (statusEl) statusEl.textContent = has ? '已设置密码，可修改' : '未设置密码';
    if (entryText) entryText.textContent = has ? '修改密码' : '设置密码';
  }

  function highlightCreatorPresetAvatar() {
    document.querySelectorAll('#creatorAvatarPickList .cr-avatar-pick').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-avatar') === creatorProfileDraft.avatar);
    });
  }

  function syncCreatorProfileDraft(profile) {
    creatorProfileDraft.name = String((profile && profile.name) || CREATOR_DEFAULT_NAME).trim() || CREATOR_DEFAULT_NAME;
    creatorProfileDraft.avatar =
      String((profile && profile.avatar) || CREATOR_DEFAULT_AVATAR).trim() || CREATOR_DEFAULT_AVATAR;
    var nameInput = document.getElementById('creatorProfileNameInput');
    var namePreview = document.getElementById('creatorProfileNamePreview');
    var avatarPreview = document.getElementById('creatorProfileAvatarPreview');
    var fileInput = document.getElementById('creatorProfileAvatarFile');
    if (nameInput) nameInput.value = creatorProfileDraft.name;
    if (namePreview) namePreview.textContent = creatorProfileDraft.name;
    if (avatarPreview) avatarPreview.src = creatorProfileDraft.avatar;
    if (fileInput) fileInput.value = '';
    highlightCreatorPresetAvatar();
  }

  function renderCreatorAvatarPresets() {
    var root = document.getElementById('creatorAvatarPickList');
    if (!root) return;
    root.innerHTML = CREATOR_AVATAR_PRESETS.map(function (avatar) {
      return (
        '<button type="button" class="cr-avatar-pick" data-avatar="' +
        escapeAttr(avatar) +
        '">' +
        '<img src="' +
        escapeAttr(avatar) +
        '" alt="默认头像">' +
        '</button>'
      );
    }).join('');
    root.querySelectorAll('.cr-avatar-pick').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var avatar = btn.getAttribute('data-avatar');
        if (!avatar) return;
        creatorProfileDraft.avatar = avatar;
        var avatarPreview = document.getElementById('creatorProfileAvatarPreview');
        if (avatarPreview) avatarPreview.src = avatar;
        highlightCreatorPresetAvatar();
      });
    });
    highlightCreatorPresetAvatar();
  }

  function openCreatorSettingsDrawer() {
    var drawer = document.getElementById('creatorSettingsDrawer');
    var mask = document.getElementById('creatorSettingsMask');
    if (drawer) {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
    }
    if (mask) mask.classList.add('open');
  }

  function closeCreatorSettingsDrawer() {
    var drawer = document.getElementById('creatorSettingsDrawer');
    var mask = document.getElementById('creatorSettingsMask');
    if (drawer) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
    }
    if (mask) mask.classList.remove('open');
  }

  function isValidPhone(v) {
    return /^1\d{10}$/.test(String(v || '').trim());
  }

  function openCreatorLogin() {
    var overlay = document.getElementById('creatorLoginOverlay');
    if (overlay) overlay.classList.add('open');
  }

  function closeCreatorLogin() {
    var overlay = document.getElementById('creatorLoginOverlay');
    if (overlay) overlay.classList.remove('open');
  }

  function initCreatorLogin() {
    var overlay = document.getElementById('creatorLoginOverlay');
    var tabPwdEl = document.getElementById('creatorLoginTabPwd');
    var tabOtpEl = document.getElementById('creatorLoginTabOtp');
    var panePwdEl = document.getElementById('creatorLoginPanePwd');
    var paneOtpEl = document.getElementById('creatorLoginPaneOtp');
    var phonePwdEl = document.getElementById('creatorLoginPhone');
    var phoneOtpEl = document.getElementById('creatorLoginPhoneOtp');
    var otpCodeEl = document.getElementById('creatorLoginOtpCode');
    var sendOtpEl = document.getElementById('creatorLoginSendCodeBtn');
    var submitPwdEl = document.getElementById('creatorLoginSubmitPwd');
    var submitOtpEl = document.getElementById('creatorLoginSubmitOtp');
    var pwdEl = document.getElementById('creatorLoginPassword');
    var togglePwdEl = document.getElementById('creatorLoginTogglePwd');
    var errPwdEl = document.getElementById('creatorLoginErrPwd');
    var errOtpEl = document.getElementById('creatorLoginErrOtp');
    if (
      !overlay ||
      !tabPwdEl ||
      !tabOtpEl ||
      !panePwdEl ||
      !paneOtpEl ||
      !phonePwdEl ||
      !phoneOtpEl ||
      !otpCodeEl ||
      !sendOtpEl ||
      !submitPwdEl ||
      !submitOtpEl ||
      !pwdEl
    ) {
      return;
    }
    var loginMode = 'pwd';
    var creatorOtp = { code: '', target: '', cool: 0, timer: null };
    function setErr(mode, msg) {
      var errEl = mode === 'otp' ? errOtpEl : errPwdEl;
      if (errEl) errEl.textContent = msg || '';
    }
    function clearErr() {
      setErr('pwd', '');
      setErr('otp', '');
    }
    function clearOtpTimer() {
      if (creatorOtp.timer) {
        clearInterval(creatorOtp.timer);
        creatorOtp.timer = null;
      }
    }
    function resetOtpState() {
      clearOtpTimer();
      creatorOtp = { code: '', target: '', cool: 0, timer: null };
      sendOtpEl.disabled = false;
      sendOtpEl.textContent = '获取验证码';
      if (otpCodeEl) otpCodeEl.value = '';
    }
    function setLoginMode(mode) {
      loginMode = mode === 'otp' ? 'otp' : 'pwd';
      var pwdActive = loginMode === 'pwd';
      tabPwdEl.classList.toggle('is-active', pwdActive);
      tabOtpEl.classList.toggle('is-active', !pwdActive);
      tabPwdEl.setAttribute('aria-selected', pwdActive ? 'true' : 'false');
      tabOtpEl.setAttribute('aria-selected', pwdActive ? 'false' : 'true');
      panePwdEl.classList.toggle('cr-login-pane--hidden', !pwdActive);
      paneOtpEl.classList.toggle('cr-login-pane--hidden', pwdActive);
      panePwdEl.setAttribute('aria-hidden', pwdActive ? 'false' : 'true');
      paneOtpEl.setAttribute('aria-hidden', pwdActive ? 'true' : 'false');
      clearErr();
    }
    function completeLogin(phone) {
      localStorage.setItem(
        CREATOR_LOGIN_KEY,
        JSON.stringify({ phone: phone, ts: Date.now() })
      );
      clearErr();
      resetOtpState();
      closeCreatorLogin();
      showToast('已登录创作者端');
    }
    function submitPwd() {
      var phone = String(phonePwdEl.value || '').trim();
      var pwd = String(pwdEl.value || '').trim();
      if (!isValidPhone(phone)) {
        setErr('pwd', '请输入正确的 11 位手机号');
        return;
      }
      if (pwd.length < 6) {
        setErr('pwd', '密码不少于 6 位');
        return;
      }
      completeLogin(phone);
    }
    function sendOtpCode() {
      var phone = String(phoneOtpEl.value || '').trim();
      if (!isValidPhone(phone)) {
        setErr('otp', '请输入正确的 11 位手机号');
        return;
      }
      clearErr();
      creatorOtp.target = phone;
      creatorOtp.code = String(Math.floor(100000 + Math.random() * 900000));
      creatorOtp.cool = 60;
      sendOtpEl.disabled = true;
      sendOtpEl.textContent = creatorOtp.cool + 's';
      showToast('验证码（演示）: ' + creatorOtp.code);
      clearOtpTimer();
      creatorOtp.timer = setInterval(function () {
        creatorOtp.cool -= 1;
        if (creatorOtp.cool <= 0) {
          clearOtpTimer();
          sendOtpEl.disabled = false;
          sendOtpEl.textContent = '获取验证码';
          return;
        }
        sendOtpEl.textContent = creatorOtp.cool + 's';
      }, 1000);
    }
    function submitOtp() {
      var phone = String(phoneOtpEl.value || '').trim();
      var code = String(otpCodeEl.value || '').trim();
      if (!isValidPhone(phone)) {
        setErr('otp', '请输入正确的 11 位手机号');
        return;
      }
      if (!/^\d{6}$/.test(code)) {
        setErr('otp', '请输入 6 位短信验证码');
        return;
      }
      if (!creatorOtp.code) {
        setErr('otp', '请先获取验证码');
        return;
      }
      if (phone !== creatorOtp.target) {
        setErr('otp', '手机号与接收验证码号码不一致');
        return;
      }
      if (code !== creatorOtp.code) {
        setErr('otp', '验证码错误');
        return;
      }
      completeLogin(phone);
    }
    submitPwdEl.addEventListener('click', submitPwd);
    submitOtpEl.addEventListener('click', submitOtp);
    sendOtpEl.addEventListener('click', sendOtpCode);
    tabPwdEl.addEventListener('click', function () {
      setLoginMode('pwd');
    });
    tabOtpEl.addEventListener('click', function () {
      setLoginMode('otp');
    });
    if (togglePwdEl) {
      togglePwdEl.addEventListener('click', function () {
        var isPwd = pwdEl.type === 'password';
        pwdEl.type = isPwd ? 'text' : 'password';
        togglePwdEl.setAttribute('aria-label', isPwd ? '隐藏密码' : '显示密码');
        togglePwdEl.setAttribute('title', isPwd ? '隐藏密码' : '显示密码');
      });
    }
    phonePwdEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') submitPwd();
    });
    pwdEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') submitPwd();
    });
    phoneOtpEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') submitOtp();
    });
    otpCodeEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') submitOtp();
    });
    setLoginMode('pwd');
    if (localStorage.getItem(CREATOR_LOGIN_KEY)) {
      closeCreatorLogin();
    } else {
      openCreatorLogin();
    }
  }

  function getBookById(id) {
    return books.find(function (x) {
      return x.id === id;
    });
  }

  function defaultTeam() {
    return [{ id: 'u-me', name: '李明远', role: 'owner', avatar: '李' }];
  }

  function ensureBookTeam(book) {
    if (!book) return;
    if (!Array.isArray(book.team) || !book.team.length) book.team = defaultTeam();
  }

  function getJoinBase() {
    try {
      var o = window.location.origin;
      if (o && o !== 'null' && String(o).indexOf('file:') !== 0) return o;
    } catch (e) {}
    return 'https://sc-digital-textbook.demo';
  }

  function buildInviteUrl(bookId) {
    return getJoinBase() + '/creator/join?book=' + encodeURIComponent(bookId) + '&token=demo-invite';
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch (e) {}
      document.body.removeChild(ta);
      resolve();
    });
  }

  function renderInviteTeamList() {
    var bidEl = document.getElementById('inviteBookId');
    var wrap = document.getElementById('inviteTeamList');
    if (!bidEl || !wrap) return;
    var book = getBookById(bidEl.value);
    ensureBookTeam(book);
    if (!book) {
      wrap.innerHTML = '';
      return;
    }
    wrap.innerHTML = book.team
      .map(function (m) {
        var isOwner = m.role === 'owner';
        var rowClass = 'cr-team-row' + (isOwner ? '' : ' cr-team-row--member');
        var badges = isOwner
          ? '<span class="cr-badge cr-badge--admin">管理员</span><span class="cr-badge cr-badge--creator">创建者</span>'
          : '<span class="cr-badge cr-badge--member">组员</span>';
        var removeBtn = isOwner
          ? ''
          : '<button type="button" class="cr-team-remove" data-remove-team="' +
            escapeAttr(m.id) +
            '">移除</button>';
        return (
          '<div class="' +
          rowClass +
          '" role="listitem">' +
          '<div class="cr-team-av" aria-hidden="true">' +
          escapeHtml(m.avatar || (m.name && m.name.charAt(0)) || '?') +
          '</div>' +
          '<div class="cr-team-body">' +
          '<span class="cr-team-name">' +
          escapeHtml(m.name) +
          '</span>' +
          badges +
          '</div>' +
          removeBtn +
          '</div>'
        );
      })
      .join('');
  }

  function refreshInviteLinkAndQr() {
    var bidEl = document.getElementById('inviteBookId');
    var inp = document.getElementById('inviteLinkInput');
    var img = document.getElementById('inviteQrImg');
    if (!bidEl || !inp) return;
    var book = getBookById(bidEl.value);
    var url = buildInviteUrl(bidEl.value);
    inp.value = url;
    if (img) {
      img.alt = book ? '《' + book.title + '》邀请二维码' : '邀请二维码';
      img.src =
        'https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=8&data=' + encodeURIComponent(url);
    }
  }

  function openInviteModal(bookId) {
    var hid = document.getElementById('inviteBookId');
    if (hid) hid.value = bookId;
    ensureBookTeam(getBookById(bookId));
    renderInviteTeamList();
    refreshInviteLinkAndQr();
    openModal('#modalInvite');
  }

  /** 进入教材编写占位页（正式环境可替换为 CMS 编辑器路由） */
  function goBookWritePage(book) {
    if (!book) return;
    try {
      sessionStorage.setItem(
        'cr_write_book',
        JSON.stringify({ id: book.id, title: book.title || '' })
      );
    } catch (e) {}
    window.location.href = 'write/index.html?book=' + encodeURIComponent(book.id);
  }

  function closeAllCreatorBookMore() {
    document.querySelectorAll('.cr-book-more-dropdown').forEach(function (dd) {
      dd.hidden = true;
    });
    document.querySelectorAll('[data-cr-more-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  function toggleCreatorBookMore(bookId) {
    var sid = String(bookId || '');
    var dd = document.getElementById('crBookMore_' + sid);
    if (!dd) return;
    var anchor = dd.parentElement;
    var btn = anchor && anchor.querySelector('[data-cr-more-toggle]');
    if (!btn) return;
    var willOpen = dd.hidden;
    closeAllCreatorBookMore();
    if (willOpen) {
      dd.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
    }
  }

  var creatorBookMoreUiBound = false;
  function bindCreatorBookMoreUiOnce() {
    if (creatorBookMoreUiBound) return;
    creatorBookMoreUiBound = true;
    document.addEventListener('click', function (e) {
      if (e.target.closest('.cr-book-more-anchor')) return;
      closeAllCreatorBookMore();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllCreatorBookMore();
    });
  }

  function renderBooks() {
    var root = document.getElementById('creatorBookList');
    if (!root) return;

    bindCreatorBookMoreUiOnce();

    root.innerHTML = books
      .map(function (b) {
        var pills = BOOK_ACTIONS.map(function (a) {
          var pillCls = 'pill' + (a.danger ? ' pill--danger' : '');
          var isDel = a.key === 'delete';
          var dataAttr = isDel
            ? 'data-del="' + escapeAttr(b.id) + '"'
            : 'data-act="' + a.key + '" data-id="' + escapeAttr(b.id) + '"';
          return (
            '<button type="button" class="' +
            pillCls +
            '" ' +
            dataAttr +
            ' title="' +
            escapeAttr(a.hint || a.label) +
            '">' +
            escapeHtml(a.label) +
            '</button>'
          );
        }).join('');

        return (
          '<article class="cr-card cr-card--book" data-book-id="' +
          b.id +
          '">' +
          '<div class="cr-card-head">' +
          buildReaderStyleCoverHtml(b) +
          '<div class="cr-card-meta">' +
          '<div class="cr-card-title">' +
          escapeHtml(b.title) +
          '</div>' +
          '<div class="cr-card-sub">' +
          (b.editorInChief
            ? '主编 ' + escapeHtml(b.editorInChief) + ' · '
            : '') +
          escapeHtml(b.sub) +
          ' · 更新 ' +
          escapeHtml(b.updated) +
          '</div>' +
          '</div></div>' +
          '<div class="cr-card-body">' +
          '<div class="cr-card-foot">' +
          '<button type="button" class="cr-foot-btn" data-edit="' +
          b.id +
          '">' +
          ICON_EDIT +
          '<span class="cr-foot-btn__txt">撰写图书</span></button>' +
          '<button type="button" class="cr-foot-btn" data-invite="' +
          b.id +
          '">' +
          ICON_INVITE +
          '<span class="cr-foot-btn__txt">邀请作者</span></button>' +
          '<div class="cr-book-more-anchor">' +
          '<button type="button" class="cr-foot-btn cr-foot-btn--more" data-cr-more-toggle data-book-id="' +
          escapeAttr(b.id) +
          '" aria-expanded="false" aria-haspopup="true">' +
          '<span class="cr-foot-btn__txt">更多操作...</span></button>' +
          '<div class="cr-book-more-dropdown" id="crBookMore_' +
          b.id +
          '" hidden role="menu">' +
          '<div class="cr-more-pill-stack">' +
          pills +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div></div></article>'
        );
      })
      .join('');

    root.querySelectorAll('[data-cr-more-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleCreatorBookMore(btn.getAttribute('data-book-id'));
      });
    });
    root.querySelectorAll('.cr-book-more-dropdown').forEach(function (dd) {
      dd.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    });
    root.querySelectorAll('.cr-book-more-dropdown .pill').forEach(function (p) {
      p.addEventListener('click', function () {
        closeAllCreatorBookMore();
      });
    });

    root.querySelectorAll('[data-act]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.id;
        var act = btn.dataset.act;
        var book = books.find(function (x) {
          return x.id === id;
        });
        if (!book) return;
        if (act === 'meta') {
          openBookModal(book);
          return;
        }
        showToast('「' + book.title + '」· ' + btn.textContent.trim() + '（演示，可对接 CMS）');
      });
    });
    root.querySelectorAll('[data-invite]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openInviteModal(btn.dataset.invite);
      });
    });
    root.querySelectorAll('[data-del]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        pendingDeleteId = btn.dataset.del;
        openModal('#modalDelete');
      });
    });
    root.querySelectorAll('[data-edit]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.edit;
        var book = books.find(function (x) {
          return x.id === id;
        });
        if (!book) return;
        goBookWritePage(book);
      });
    });
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, '&#39;');
  }

  document.querySelectorAll('.sidebar-nav .nav-item[data-panel]').forEach(function (el) {
    el.addEventListener('click', function () {
      setPanel(el.dataset.panel);
    });
  });

  var creatorSettingsTrigger = document.getElementById('creatorSettingsTrigger');
  if (creatorSettingsTrigger) {
    creatorSettingsTrigger.addEventListener('click', function () {
      openCreatorSettingsDrawer();
    });
  }
  var creatorSettingsCloseBtn = document.getElementById('creatorSettingsCloseBtn');
  if (creatorSettingsCloseBtn) {
    creatorSettingsCloseBtn.addEventListener('click', function () {
      closeCreatorSettingsDrawer();
    });
  }
  var creatorSettingsMask = document.getElementById('creatorSettingsMask');
  if (creatorSettingsMask) {
    creatorSettingsMask.addEventListener('click', function () {
      closeCreatorSettingsDrawer();
    });
  }

  var openCreatorProfileModalBtn = document.getElementById('openCreatorProfileModalBtn');
  if (openCreatorProfileModalBtn) {
    openCreatorProfileModalBtn.addEventListener('click', function () {
      syncCreatorProfileDraft(readCreatorProfile());
      openModal('#modalCreatorProfile');
    });
  }
  var creatorProfileCancel = document.getElementById('creatorProfileCancel');
  if (creatorProfileCancel) {
    creatorProfileCancel.addEventListener('click', function () {
      closeModal('#modalCreatorProfile');
    });
  }
  var creatorProfileNameInput = document.getElementById('creatorProfileNameInput');
  if (creatorProfileNameInput) {
    creatorProfileNameInput.addEventListener('input', function () {
      var nextName = String(creatorProfileNameInput.value || '').trim();
      creatorProfileDraft.name = nextName || CREATOR_DEFAULT_NAME;
      var namePreview = document.getElementById('creatorProfileNamePreview');
      if (namePreview) namePreview.textContent = creatorProfileDraft.name;
    });
  }
  var creatorProfileAvatarFile = document.getElementById('creatorProfileAvatarFile');
  if (creatorProfileAvatarFile) {
    creatorProfileAvatarFile.addEventListener('change', function () {
      var f = creatorProfileAvatarFile.files && creatorProfileAvatarFile.files[0];
      if (!f) return;
      if (!/^image\//.test(f.type)) {
        showToast('请选择图片文件');
        creatorProfileAvatarFile.value = '';
        return;
      }
      if (f.size > PROFILE_AVATAR_FILE_MAX) {
        showToast('头像图片请小于约 2MB');
        creatorProfileAvatarFile.value = '';
        return;
      }
      var r = new FileReader();
      r.onload = function () {
        creatorProfileDraft.avatar = typeof r.result === 'string' ? r.result : CREATOR_DEFAULT_AVATAR;
        var avatarPreview = document.getElementById('creatorProfileAvatarPreview');
        if (avatarPreview) avatarPreview.src = creatorProfileDraft.avatar;
        highlightCreatorPresetAvatar();
      };
      r.onerror = function () {
        showToast('读取头像失败，请重试');
      };
      r.readAsDataURL(f);
    });
  }
  var creatorProfileReset = document.getElementById('creatorProfileReset');
  if (creatorProfileReset) {
    creatorProfileReset.addEventListener('click', function () {
      var reset = { name: CREATOR_DEFAULT_NAME, avatar: CREATOR_DEFAULT_AVATAR };
      writeCreatorProfile(reset);
      applyCreatorProfile(reset);
      syncCreatorProfileDraft(reset);
      showToast('已恢复默认资料');
    });
  }
  var creatorProfileSave = document.getElementById('creatorProfileSave');
  if (creatorProfileSave) {
    creatorProfileSave.addEventListener('click', function () {
      var nameInput = document.getElementById('creatorProfileNameInput');
      var name = String((nameInput && nameInput.value) || '').trim();
      if (!name) {
        showToast('用户名不能为空');
        return;
      }
      var next = { name: name, avatar: creatorProfileDraft.avatar || CREATOR_DEFAULT_AVATAR };
      writeCreatorProfile(next);
      applyCreatorProfile(next);
      closeModal('#modalCreatorProfile');
      showToast('资料已更新');
    });
  }

  var openCreatorPasswordModalBtn = document.getElementById('openCreatorPasswordModalBtn');
  if (openCreatorPasswordModalBtn) {
    openCreatorPasswordModalBtn.addEventListener('click', function () {
      var has = hasCreatorPassword();
      var titleEl = document.getElementById('modalCreatorPasswordTitle');
      var oldRow = document.getElementById('creatorOldPasswordRow');
      var oldInp = document.getElementById('creatorOldPasswordInput');
      var newInp = document.getElementById('creatorNewPasswordInput');
      var confInp = document.getElementById('creatorConfirmPasswordInput');
      if (titleEl) titleEl.textContent = has ? '修改密码' : '设置密码';
      if (oldRow) oldRow.style.display = has ? 'block' : 'none';
      if (oldInp) oldInp.value = '';
      if (newInp) newInp.value = '';
      if (confInp) confInp.value = '';
      openModal('#modalCreatorPassword');
    });
  }
  var creatorPasswordCancel = document.getElementById('creatorPasswordCancel');
  if (creatorPasswordCancel) {
    creatorPasswordCancel.addEventListener('click', function () {
      closeModal('#modalCreatorPassword');
    });
  }
  var creatorPasswordSave = document.getElementById('creatorPasswordSave');
  if (creatorPasswordSave) {
    creatorPasswordSave.addEventListener('click', function () {
      var has = hasCreatorPassword();
      var oldPwd = String((document.getElementById('creatorOldPasswordInput') || {}).value || '').trim();
      var newPwd = String((document.getElementById('creatorNewPasswordInput') || {}).value || '').trim();
      var confPwd = String((document.getElementById('creatorConfirmPasswordInput') || {}).value || '').trim();
      if (has) {
        var saved = localStorage.getItem(CREATOR_PASSWORD_KEY) || '';
        if (!oldPwd || oldPwd !== saved) {
          showToast('当前密码不正确');
          return;
        }
      }
      if (newPwd.length < 6) {
        showToast('密码至少 6 位');
        return;
      }
      if (newPwd !== confPwd) {
        showToast('两次密码不一致');
        return;
      }
      localStorage.setItem(CREATOR_PASSWORD_KEY, newPwd);
      refreshCreatorPasswordState();
      closeModal('#modalCreatorPassword');
      showToast(has ? '密码已修改' : '密码已设置');
    });
  }

  var creatorLogoutBtn = document.getElementById('creatorLogoutBtn');
  if (creatorLogoutBtn) {
    creatorLogoutBtn.addEventListener('click', function () {
      localStorage.removeItem(CREATOR_PROFILE_KEY);
      localStorage.removeItem(CREATOR_PASSWORD_KEY);
      localStorage.removeItem(CREATOR_LOGIN_KEY);
      closeCreatorSettingsDrawer();
      openCreatorLogin();
      showToast('已退出账号');
    });
  }

  var btnNew = document.getElementById('btnNewBook');
  if (btnNew) {
    btnNew.addEventListener('click', function () {
      openBookModal(null);
    });
  }

  var btnPickCover = document.getElementById('btnPickCover');
  if (btnPickCover) {
    btnPickCover.addEventListener('click', function () {
      var inp = document.getElementById('formCoverFile');
      if (inp) inp.click();
    });
  }

  var btnToggleAiCover = document.getElementById('btnToggleAiCover');
  if (btnToggleAiCover) {
    btnToggleAiCover.addEventListener('click', function (ev) {
      ev.stopPropagation();
      var panel = document.getElementById('crCoverAiPanel');
      if (!panel) return;
      var open = !!panel.hidden;
      panel.hidden = !open;
      btnToggleAiCover.setAttribute('aria-expanded', open ? 'true' : 'false');
      setAiChipLabel(open ? '收起' : 'AI 生成');
      if (open) {
        var ta = document.getElementById('formCoverAiPrompt');
        if (ta) ta.focus();
      }
    });
  }

  var btnPickIntroVideo = document.getElementById('btnPickIntroVideo');
  var formIntroVideoFile = document.getElementById('formIntroVideoFile');
  if (btnPickIntroVideo && formIntroVideoFile) {
    btnPickIntroVideo.addEventListener('click', function () {
      formIntroVideoFile.click();
    });
  }

  if (formIntroVideoFile) {
    formIntroVideoFile.addEventListener('change', function () {
      var f = formIntroVideoFile.files && formIntroVideoFile.files[0];
      if (!f) return;
      if (!/^video\//.test(f.type)) {
        showToast('请选择视频文件（如 MP4、WebM）');
        formIntroVideoFile.value = '';
        return;
      }
      if (f.size > VIDEO_FILE_MAX) {
        showToast('视频请小于约 28MB（演示页限制，正式环境可对接云存储）');
        formIntroVideoFile.value = '';
        return;
      }
      var r = new FileReader();
      r.onload = function () {
        introVideoDraft.dataUrl = typeof r.result === 'string' ? r.result : null;
        introVideoDraft.name = f.name;
        updateIntroVideoUI();
        showToast('已载入视频介绍');
      };
      r.onerror = function () {
        showToast('读取视频失败，请重试');
      };
      r.readAsDataURL(f);
    });
  }

  var btnClearIntroVideo = document.getElementById('btnClearIntroVideo');
  if (btnClearIntroVideo) {
    btnClearIntroVideo.addEventListener('click', function (ev) {
      ev.stopPropagation();
      introVideoDraft = { dataUrl: null, name: null };
      if (formIntroVideoFile) formIntroVideoFile.value = '';
      updateIntroVideoUI();
      showToast('已清除视频介绍');
    });
  }

  var formCoverFile = document.getElementById('formCoverFile');
  if (formCoverFile) {
    formCoverFile.addEventListener('change', function () {
      var f = formCoverFile.files && formCoverFile.files[0];
      if (!f) return;
      if (!/^image\//.test(f.type)) {
        showToast('请选择图片文件（JPEG / PNG / WebP / GIF）');
        formCoverFile.value = '';
        return;
      }
      if (f.size > COVER_FILE_MAX) {
        showToast('图片请小于约 2.5MB');
        formCoverFile.value = '';
        return;
      }
      var r = new FileReader();
      r.onload = function () {
        coverDraftUrl = typeof r.result === 'string' ? r.result : null;
        updateCoverPreview();
        showToast('已载入封面图片');
      };
      r.onerror = function () {
        showToast('读取图片失败，请重试');
      };
      r.readAsDataURL(f);
    });
  }

  var btnClearCover = document.getElementById('btnClearCover');
  if (btnClearCover) {
    btnClearCover.addEventListener('click', function () {
      coverDraftUrl = null;
      if (formCoverFile) formCoverFile.value = '';
      updateCoverPreview();
      showToast('已清除封面');
    });
  }

  var btnAiCover = document.getElementById('btnAiCover');
  if (btnAiCover) {
    btnAiCover.addEventListener('click', function () {
      var prompt = (document.getElementById('formCoverAiPrompt') && document.getElementById('formCoverAiPrompt').value) || '';
      prompt = String(prompt).trim();
      if (!prompt) {
        showToast('请先填写 AI 生成提示词');
        return;
      }
      var title = (document.getElementById('formBookTitle') && document.getElementById('formBookTitle').value) || '';
      try {
        coverDraftUrl = generateAiCoverDataUrl(prompt, title.trim());
        if (formCoverFile) formCoverFile.value = '';
        updateCoverPreview();
        showToast('已根据提示词生成 AI 演示封面（可继续上传替换）');
      } catch (err) {
        showToast('生成失败，请重试或改用上传图片');
      }
    });
  }

  document.getElementById('modalBookSave') &&
    document.getElementById('modalBookSave').addEventListener('click', function () {
      var title = (document.getElementById('formBookTitle').value || '').trim();
      var editor = (document.getElementById('formBookEditor').value || '').trim();
      var intro = (document.getElementById('formBookIntro').value || '').trim();
      if (!title) {
        showToast('请填写教材名称');
        return;
      }
      var sk = guessSubKeyFromDiscipline(title);
      if (editingId) {
        var ob = books.find(function (x) {
          return x.id === editingId;
        });
        if (ob) {
          ob.title = title;
          ob.sub = subLineForSave(ob);
          ob.updated = new Date().toISOString().slice(0, 10);
          ob.subKey = sk;
          ob.editorInChief = editor;
          ob.intro = intro;
          ob.introVideoDataUrl = introVideoDraft.dataUrl || null;
          ob.introVideoFileName = introVideoDraft.name || '';
          ob.coverDataUrl = coverDraftUrl || null;
        }
        showToast('已保存修改（演示）');
      } else {
        books.unshift({
          id: 'b' + Date.now(),
          title: title,
          sub: subLineForSave(null),
          updated: new Date().toISOString().slice(0, 10),
          subKey: sk,
          editorInChief: editor,
          intro: intro,
          introVideoDataUrl: introVideoDraft.dataUrl || null,
          introVideoFileName: introVideoDraft.name || '',
          coverDataUrl: coverDraftUrl || null,
          team: defaultTeam(),
        });
        showToast('已创建图书（演示）');
      }
      closeModal('#modalBook');
      renderBooks();
    });

  document.getElementById('modalBookCancel') &&
    document.getElementById('modalBookCancel').addEventListener('click', function () {
      closeModal('#modalBook');
    });

  var modalInviteEl = document.getElementById('modalInvite');
  if (modalInviteEl) {
    modalInviteEl.addEventListener('click', function (e) {
    var rm = e.target.closest('[data-remove-team]');
    if (!rm) return;
    e.preventDefault();
    var mid = rm.getAttribute('data-remove-team');
    var bid = document.getElementById('inviteBookId').value;
    var book = getBookById(bid);
    if (!book || !book.team) return;
    var mem = book.team.find(function (x) {
      return x.id === mid;
    });
    if (!mem || mem.role === 'owner') return;
    book.team = book.team.filter(function (x) {
      return x.id !== mid;
    });
    renderInviteTeamList();
    showToast('已移除「' + mem.name + '」');
    renderBooks();
  });
  }

  document.getElementById('btnCopyInviteLink') &&
    document.getElementById('btnCopyInviteLink').addEventListener('click', function () {
      var inp = document.getElementById('inviteLinkInput');
      if (!inp || !inp.value) return;
      copyToClipboard(inp.value)
        .then(function () {
          showToast('邀请链接已复制');
        })
        .catch(function () {
          showToast('复制失败，请手动选中链接复制');
        });
    });

  document.getElementById('btnInviteEntry') &&
    document.getElementById('btnInviteEntry').addEventListener('click', function () {
      var inp = document.getElementById('inviteLinkInput');
      if (!inp || !inp.value) return;
      copyToClipboard(inp.value)
        .then(function () {
          showToast('邀请链接已复制，请将链接或二维码分享给成员');
        })
        .catch(function () {
          showToast('复制失败，请手动选中链接复制');
        });
    });

  document.getElementById('modalInviteDone') &&
    document.getElementById('modalInviteDone').addEventListener('click', function () {
      closeModal('#modalInvite');
    });

  document.getElementById('modalDeleteConfirm') &&
    document.getElementById('modalDeleteConfirm').addEventListener('click', function () {
      if (pendingDeleteId) {
        books = books.filter(function (x) {
          return x.id !== pendingDeleteId;
        });
        pendingDeleteId = null;
        showToast('已删除该教材（演示）');
        renderBooks();
      }
      closeModal('#modalDelete');
    });
  document.getElementById('modalDeleteCancel') &&
    document.getElementById('modalDeleteCancel').addEventListener('click', function () {
      pendingDeleteId = null;
      closeModal('#modalDelete');
    });

  document.querySelectorAll('.login-overlay__bg').forEach(function (bg) {
    bg.addEventListener('click', function () {
      var ov = bg.closest('.login-overlay');
      if (ov) ov.classList.remove('open');
    });
  });

  setPanel('tutorials');
  renderBooks();
  applyCreatorProfile(readCreatorProfile());
  refreshCreatorPasswordState();
  renderCreatorAvatarPresets();
  initCreatorLogin();
})();
