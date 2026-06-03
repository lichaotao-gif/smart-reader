(function () {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('book') || '';
  var title = '';
  try {
    var raw = sessionStorage.getItem('cr_write_book');
    if (raw) {
      var o = JSON.parse(raw);
      if (o && o.id && (!id || o.id === id)) {
        id = o.id;
        title = o.title || '';
      }
    }
  } catch (e) {}

  function toast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.setAttribute('role', 'status');
    t.style.cssText =
      'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);z-index:900;' +
      'padding:10px 18px;border-radius:999px;background:#1f2937;color:#fff;font-size:13px;' +
      'font-weight:500;box-shadow:0 8px 28px rgba(0,0,0,0.18);animation:crWriteFade .25s ease';
    if (!document.getElementById('crWriteToastStyle')) {
      var s = document.createElement('style');
      s.id = 'crWriteToastStyle';
      s.textContent = '@keyframes crWriteFade{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
      document.head.appendChild(s);
    }
    document.body.appendChild(t);
    setTimeout(function () {
      t.style.opacity = '0';
      t.style.transition = 'opacity .25s ease';
      setTimeout(function () {
        t.remove();
      }, 260);
    }, 2200);
  }

  var h = document.getElementById('writePageTitle');
  if (h) {
    h.textContent = title || (id ? '教材编写' : '撰写图书');
  }

  function syncAuditBadges() {
    var list = document.getElementById('writeAuditList');
    var tabBadge = document.getElementById('writeAuditTabBadge');
    var railBadge = document.getElementById('writeRailAuditBadge');
    var n = list ? list.querySelectorAll('.cr-write-audit-item').length : 0;
    var label = n > 0 ? n + '条' : '';
    if (tabBadge) {
      tabBadge.textContent = label;
      tabBadge.hidden = n === 0;
    }
    if (railBadge) {
      railBadge.textContent = label;
      railBadge.hidden = n === 0;
      if (n > 0) {
        railBadge.setAttribute('aria-label', n + ' 条审核记录');
      } else {
        railBadge.removeAttribute('aria-label');
      }
    }
  }
  syncAuditBadges();

  var auditBody = document.getElementById('writeRailAudit');
  var verBody = document.getElementById('writeRailVersion');
  if (verBody) {
    verBody.addEventListener('click', function (e) {
      if (e.target.closest('.cr-write-version-open')) {
        toast('打开历史版本（演示）');
      }
    });
  }

  if (auditBody) {
    auditBody.addEventListener('click', function (e) {
      var expand = e.target.closest('.cr-write-audit-expand-btn');
      if (expand) {
        var panelId = expand.getAttribute('aria-controls');
        var panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) return;
        var open = panel.hidden;
        panel.hidden = !open;
        expand.setAttribute('aria-expanded', open ? 'true' : 'false');
        return;
      }
      if (e.target.closest('.cr-write-audit-link')) {
        toast('留言（演示，可对接评论服务）');
        return;
      }
      if (e.target.closest('.cr-write-audit-send')) {
        toast('已发送（演示，未写入服务器）');
      }
    });
  }

  var rail = document.getElementById('writeRailAside');
  var railToggle = document.getElementById('writeRailToggle');
  function syncRailToggleUi() {
    if (!rail || !railToggle) return;
    var collapsed = rail.classList.contains('is-collapsed');
    railToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    railToggle.setAttribute(
      'title',
      collapsed ? '展开侧栏（审核记录 / 版本记录）' : '收起侧栏'
    );
    var panel = document.getElementById('writeRailPanel');
    if (panel) panel.setAttribute('aria-hidden', collapsed ? 'true' : 'false');
  }
  if (rail && railToggle) {
    railToggle.addEventListener('click', function (e) {
      e.preventDefault();
      rail.classList.toggle('is-collapsed');
      syncRailToggleUi();
    });
    syncRailToggleUi();
  }

  document.querySelectorAll('[data-write-tab]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tab = btn.getAttribute('data-write-tab');
      document.querySelectorAll('[data-write-tab]').forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      var audit = document.getElementById('writeRailAudit');
      var ver = document.getElementById('writeRailVersion');
      if (audit && ver) {
        var showAudit = tab === 'audit';
        audit.hidden = !showAudit;
        audit.style.display = showAudit ? 'block' : 'none';
        ver.hidden = showAudit;
        ver.style.display = showAudit ? 'none' : 'block';
      }
    });
  });

  var ai = document.getElementById('writeAiBtn');
  if (ai) {
    ai.addEventListener('click', function () {
      toast('AI 助手为演示入口，可对接大模型与教材知识库');
    });
  }

  var head = document.querySelector('.cr-write-head-actions');
  if (head) {
    head.querySelectorAll('.cr-write-btn').forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        var lab = (btn.textContent || '').trim();
        if (/预览/.test(lab)) toast('预览：演示环境可渲染阅读端样式');
        else if (/保存/.test(lab)) toast('已保存（演示，未写入服务器）');
        else if (/提交/.test(lab)) toast('已提交审核（演示流程）');
      });
    });
  }

  document.querySelectorAll('.cr-write-tool-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      toast('「' + (btn.textContent || btn.title || '工具').trim() + '」（演示，可接入编辑器内核）');
    });
  });

  document.getElementById('writeNewChapter') &&
    document.getElementById('writeNewChapter').addEventListener('click', function () {
      toast('新建章节/任务（演示）');
    });

  document.querySelectorAll('.cr-write-tree-row').forEach(function (row) {
    row.addEventListener('click', function (e) {
      if (
        e.target.closest('.cr-write-row-menu') ||
        e.target.closest('.cr-write-tree-chev')
      ) {
        return;
      }
      document.querySelectorAll('.cr-write-tree-row').forEach(function (r) {
        r.classList.remove('is-active');
      });
      row.classList.add('is-active');
    });
  });

  document.querySelectorAll('.cr-write-tree-chev').forEach(function (cv) {
    cv.addEventListener('click', function (e) {
      e.stopPropagation();
      toast('展开 / 收起目录（演示）');
    });
  });

  document.querySelectorAll('.cr-write-row-menu').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) {
        document.querySelectorAll('.cr-write-row-menu').forEach(function (o) {
          if (o !== d) o.removeAttribute('open');
        });
      }
    });
  });

  document.querySelectorAll('.cr-write-menu-item').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (btn.disabled) return;
      var lab = (btn.textContent || '').trim();
      var menu = btn.closest('.cr-write-row-menu');
      if (menu) menu.removeAttribute('open');
      toast(lab + '（演示）');
    });
  });

  document.querySelector('.cr-write-toc-scroll') &&
    document.querySelector('.cr-write-toc-scroll').addEventListener('click', function (e) {
      if (!e.target.closest('.cr-write-row-menu')) {
        document.querySelectorAll('.cr-write-row-menu[open]').forEach(function (d) {
          d.removeAttribute('open');
        });
      }
    });

})();
