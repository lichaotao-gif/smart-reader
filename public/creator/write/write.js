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

  function initEditorDemoContent() {
    var editor = document.getElementById('writeEditor');
    if (!editor || editor.textContent.trim()) return;
    editor.innerHTML =
      '<section class="cr-digital-demo">' +
        '<p class="cr-digital-demo__eyebrow">第一章 内容</p>' +
        '<h2>人工智能应用场景导入</h2>' +
        '<p>人工智能正在进入课堂、生产和生活的各类真实任务。本节以“校园智能助手”为案例，帮助学生理解数据采集、模型推理、结果验证与人机协作之间的关系。</p>' +
        '<figure class="cr-digital-demo__figure">' +
          '<img src="/reader/home-hero-digital-textbook.png" alt="数字教材阅读场景示意">' +
          '<figcaption>图 1-1 数字教材中的学习资源、任务与测评可以形成连续学习路径。</figcaption>' +
        '</figure>' +
        '<h3>学习目标</h3>' +
        '<ul class="cr-digital-demo__list">' +
          '<li>能够说出人工智能系统完成任务的一般流程。</li>' +
          '<li>能够结合案例判断数据来源、算法结果和人工复核的作用。</li>' +
          '<li>能够使用规范语言描述 AI 工具在学习任务中的边界。</li>' +
        '</ul>' +
        '<div class="cr-digital-demo__note">' +
          '<strong>重点提示</strong>' +
          '<p>在完成拓展练习前，可以先回顾本节“任务情境、数据依据、结果解释”三个关键词。</p>' +
        '</div>' +
        '<h3>课堂任务</h3>' +
        '<p>请以小组为单位，选择一个校园服务场景，讨论其中可由 AI 辅助完成的环节，并说明哪些决策仍需要人工确认。</p>' +
      '</section>';
  }
  initEditorDemoContent();

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
      if (btn.getAttribute('data-write-tool') === 'exercise') {
        openExercisePage();
        return;
      }
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

  var DEFAULT_EXERCISE_TITLE = '本节综合测评';
  var EXERCISE_STORE_KEY = 'cr_write_exercises:v2:' + (id || 'draft');
  var EXERCISE_META_KEY = 'cr_write_exercise_meta:v1:' + (id || 'draft');
  var exerciseQuestions = loadExerciseQuestions();
  var exerciseTitle = loadExerciseTitle();
  var exerciseActiveId = exerciseQuestions[0] ? exerciseQuestions[0].id : '';
  var answerPreviewIndex = 0;

  function makeExerciseId() {
    return 'ex_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  function loadExerciseQuestions() {
    try {
      var raw = localStorage.getItem(EXERCISE_STORE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return normalizeExerciseQuestions(parsed);
      }
    } catch (_) {}
    return [];
  }

  function loadExerciseTitle() {
    try {
      var raw = localStorage.getItem(EXERCISE_META_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        var title = String(parsed && parsed.title || '').trim();
        if (title) return title;
      }
    } catch (_) {}
    return DEFAULT_EXERCISE_TITLE;
  }

  function saveExerciseMeta() {
    try {
      localStorage.setItem(EXERCISE_META_KEY, JSON.stringify({ title: getExerciseTitle() }));
    } catch (_) {}
  }

  function getExerciseTitle() {
    return String(exerciseTitle || '').trim() || DEFAULT_EXERCISE_TITLE;
  }

  function sanitizeFilename(name) {
    return String(name || DEFAULT_EXERCISE_TITLE).replace(/[\\/:*?"<>|]/g, '').trim() || DEFAULT_EXERCISE_TITLE;
  }

  function syncExerciseTitleUi() {
    var title = getExerciseTitle();
    var editorTitle = document.getElementById('exercisePaperTitle');
    var answerTitle = document.getElementById('answerPreviewTitle');
    var titleInput = document.getElementById('exerciseTitleInput');
    if (editorTitle) editorTitle.textContent = title;
    if (answerTitle) answerTitle.textContent = title;
    if (titleInput && !titleInput.matches(':focus')) titleInput.value = title;
  }

  function openExerciseTitleEditor() {
    var form = document.getElementById('exerciseTitleForm');
    var input = document.getElementById('exerciseTitleInput');
    if (!form || !input) return;
    input.value = getExerciseTitle();
    form.hidden = false;
    input.focus({ preventScroll: true });
    input.select();
  }

  function closeExerciseTitleEditor() {
    var form = document.getElementById('exerciseTitleForm');
    if (form) form.hidden = true;
  }

  function saveExerciseTitle() {
    var input = document.getElementById('exerciseTitleInput');
    var next = String(input && input.value || '').trim();
    if (!next) {
      toast('请输入试题标题');
      input?.focus();
      return;
    }
    exerciseTitle = next.slice(0, 40);
    saveExerciseMeta();
    syncExerciseTitleUi();
    renderEditorExerciseBlock();
    closeExerciseTitleEditor();
    toast('试题标题已更新');
  }

  function normalizeExerciseQuestions(list) {
    return list
      .map(function (q) {
        var type = ['choice', 'fill', 'tf', 'short'].indexOf(q.type) >= 0 ? q.type : 'choice';
        return {
          id: q.id || makeExerciseId(),
          type: type,
          stem: String(q.stem || '').trim() || '未命名题目',
          options: Array.isArray(q.options) && q.options.length ? q.options.slice(0, 6) : ['选项 A', '选项 B', '选项 C'],
          answer: String(q.answer || (type === 'tf' ? '正确' : type === 'choice' ? 'A' : '')).trim(),
          explain: String(q.explain || '').trim(),
          score: Math.max(0, Math.min(100, Number(q.score) || (type === 'short' ? 8 : type === 'choice' ? 5 : 4))),
        };
      })
      .filter(function (q) {
        return q.stem;
      });
  }

  function exerciseTypeLabel(type) {
    if (type === 'choice') return '选择题';
    if (type === 'fill') return '填空题';
    if (type === 'tf') return '判断题';
    return '简答题';
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function downloadBlob(blob, filename) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 0);
  }

  function getExerciseAnswerUrl() {
    var url = new URL(window.location.href);
    url.searchParams.set('exercise', 'answer');
    if (id) url.searchParams.set('book', id);
    return url.href;
  }

  function getActiveExercise() {
    return exerciseQuestions.find(function (q) {
      return q.id === exerciseActiveId;
    }) || exerciseQuestions[0] || null;
  }

  function openExercisePage() {
    var page = document.getElementById('writeExercisePage');
    if (!page) return;
    page.classList.add('is-open');
    page.setAttribute('aria-hidden', 'false');
    syncExerciseTitleUi();
    renderExercisePage();
    if (exerciseQuestions.length) {
      document.getElementById('exerciseStemInput')?.focus({ preventScroll: true });
    } else {
      document.getElementById('exerciseAiBtn')?.focus({ preventScroll: true });
    }
  }

  function closeExercisePage() {
    var page = document.getElementById('writeExercisePage');
    if (!page) return;
    page.classList.remove('is-open');
    page.setAttribute('aria-hidden', 'true');
  }

  function renderExercisePage() {
    syncExerciseTitleUi();
    renderExercisePaperEditor();
  }

  function scoreForExerciseType(type) {
    if (type === 'choice') return 5;
    if (type === 'tf') return 3;
    if (type === 'short') return 8;
    return 4;
  }

  function exerciseTypeOrder() {
    return ['choice', 'fill', 'tf', 'short'];
  }

  function renderExerciseQuestionCard(q, idx) {
    var optionHtml = q.type === 'choice'
      ? '<div class="cr-qb-edit-options">' + q.options.map(function (opt, i) {
        return '<div class="cr-qb-edit-option"><span>' + String.fromCharCode(65 + i) + '</span>' + escapeHtml(opt) + '</div>';
      }).join('') + '</div>'
      : '';
    return '<article class="cr-qb-edit-question" draggable="true" data-exercise-id="' + q.id + '" data-type="' + q.type + '">' +
      '<div class="cr-qb-edit-q-head">' +
        '<div class="cr-qb-edit-q-title"><button type="button" class="cr-qb-edit-drag" title="拖拽排序" aria-label="拖拽排序">⋮⋮</button><span>' + (idx + 1) + '</span>' + escapeHtml(q.stem) + '</div>' +
        '<div class="cr-qb-edit-q-actions">' +
          '<button type="button" data-exercise-edit="' + q.id + '">编辑</button>' +
          '<button type="button" data-exercise-delete="' + q.id + '">删除</button>' +
          '<input type="number" value="' + (q.score || scoreForExerciseType(q.type)) + '" min="0" max="100" data-exercise-score="' + q.id + '" aria-label="题目分数">' +
          '<em>分</em>' +
        '</div>' +
      '</div>' +
      optionHtml +
      '<div class="cr-qb-edit-answer">' +
        '<div class="cr-qb-edit-answer-row cr-qb-edit-answer-row--answer"><strong>题目答案</strong><span>' + escapeHtml(q.answer || '待填写') + '</span></div>' +
        '<div class="cr-qb-edit-answer-row cr-qb-edit-answer-row--analysis"><strong>题目解析</strong><span>' + escapeHtml(q.explain || '暂无解析') + '</span></div>' +
      '</div>' +
    '</article>';
  }

  function renderExerciseTypeGroup(type, list) {
    if (!list.length) return '';
    var total = list.reduce(function (sum, q) { return sum + (Number(q.score) || 0); }, 0);
    return '<section class="cr-qb-edit-type-group" data-type="' + type + '">' +
      '<div class="cr-qb-edit-type-head">' +
        '<h3>' + exerciseTypeLabel(type) + '</h3>' +
        '<span>' + list.length + ' 题 · ' + total + ' 分 · 同题型内可拖拽排序</span>' +
      '</div>' +
      '<div class="cr-qb-edit-type-list">' + list.map(renderExerciseQuestionCard).join('') + '</div>' +
    '</section>';
  }

  function renderExercisePaperEditor() {
    var content = document.getElementById('exercisePaperContent');
    var summary = document.getElementById('exerciseEditorSummary');
    if (summary) {
      var s = getExerciseSummary();
      var parts = exerciseTypeOrder().map(function (type) {
        return exerciseTypeLabel(type) + ' ' + (s[type] || 0);
      }).join(' · ');
      summary.innerHTML = '<span>共 ' + s.total + ' 题</span><span>' + parts + '</span>';
    }
    if (!content) return;
    if (!exerciseQuestions.length) {
      content.innerHTML = '<div class="cr-qb-edit-empty">' +
        '<div class="cr-exam-empty-ic" aria-hidden="true"><svg class="cr-w-svg"><use href="#cr-ic-help"/></svg></div>' +
        '<h4>从一个出题动作开始</h4>' +
        '<p>可以点击顶部 AI 出题生成试卷，也可以点击添加题目手动创建选择题、填空题、判断题或简答题。</p>' +
        '<div class="cr-exam-empty-actions">' +
          '<button type="button" class="cr-exam-btn cr-exam-btn--ai" data-empty-action="ai">AI 出题</button>' +
          '<button type="button" class="cr-exam-btn cr-exam-btn--primary" data-empty-action="add">手动添加</button>' +
        '</div>' +
      '</div>';
      return;
    }
    content.innerHTML = exerciseTypeOrder().map(function (type) {
      return renderExerciseTypeGroup(type, exerciseQuestions.filter(function (q) { return q.type === type; }));
    }).join('');
  }

  function renderExerciseList() {
    renderExercisePaperEditor();
  }

  function renderExerciseEditor() {
    renderExercisePaperEditor();
  }

  function renderExercisePreview() {
    renderExercisePaperEditor();
  }

  function openExerciseEditModal(questionId) {
    var q = exerciseQuestions.find(function (item) { return item.id === questionId; }) || getActiveExercise();
    var modal = document.getElementById('exerciseEditModal');
    if (!modal || !q) return;
    exerciseActiveId = q.id;
    document.getElementById('exerciseModalType').value = q.type;
    document.getElementById('exerciseModalStem').value = q.stem || '';
    document.getElementById('exerciseModalAnswer').value = q.answer || '';
    document.getElementById('exerciseModalExplain').value = q.explain || '';
    renderExerciseModalOptions(q);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.getElementById('exerciseModalStem')?.focus({ preventScroll: true });
  }

  function closeExerciseEditModal() {
    var modal = document.getElementById('exerciseEditModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function renderExerciseModalOptions(q) {
    var box = document.getElementById('exerciseModalOptions');
    if (!box) return;
    if (q.type === 'choice') {
      box.hidden = false;
      box.innerHTML = '<span>选项</span>' + q.options
        .map(function (opt, i) {
          var letter = String.fromCharCode(65 + i);
          return '<label class="cr-exam-option-row">' +
            '<span class="cr-exam-option-letter">' + letter + '</span>' +
            '<input type="text" class="cr-exam-option-input" data-modal-option-index="' + i + '" value="' + escapeHtml(opt) + '" placeholder="选项内容">' +
            '</label>';
        })
        .join('');
    } else {
      box.hidden = true;
      box.innerHTML = '';
    }
  }

  function saveExerciseEditModal() {
    var q = getActiveExercise();
    if (!q) return false;
    var type = document.getElementById('exerciseModalType')?.value || 'choice';
    var stem = String(document.getElementById('exerciseModalStem')?.value || '').trim();
    var answer = String(document.getElementById('exerciseModalAnswer')?.value || '').trim();
    var explain = String(document.getElementById('exerciseModalExplain')?.value || '').trim();
    if (!stem) {
      toast('请先填写题干');
      document.getElementById('exerciseModalStem')?.focus();
      return false;
    }
    var next = {
      id: q.id,
      type: type,
      stem: stem,
      options: q.options || ['选项 A', '选项 B', '选项 C'],
      answer: answer,
      explain: explain,
      score: q.score || scoreForExerciseType(type),
    };
    if (type === 'choice') {
      var options = Array.from(document.querySelectorAll('[data-modal-option-index]')).map(function (inp) {
        return String(inp.value || '').trim();
      }).filter(Boolean);
      next.options = options.length >= 2 ? options : ['选项 A', '选项 B', '选项 C'];
      if (!/^[A-F]$/.test(next.answer)) next.answer = 'A';
    } else if (type === 'tf') {
      next.options = ['正确', '错误'];
      if (next.answer !== '错误') next.answer = '正确';
    } else {
      next.options = [];
    }
    exerciseQuestions = exerciseQuestions.map(function (old) { return old.id === q.id ? next : old; });
    closeExerciseEditModal();
    renderExercisePage();
    renderEditorExerciseBlock();
    toast('题目已保存');
    return true;
  }

  function collectExerciseEditor() {
    return getActiveExercise();
  }

  function applyExerciseEditor(silent) {
    renderExercisePage();
    if (!silent) toast('已应用题目修改');
    return true;
  }

  function moveExerciseQuestion(fromId, toId) {
    if (!fromId || !toId || fromId === toId) return;
    var fromIndex = exerciseQuestions.findIndex(function (q) { return q.id === fromId; });
    var toIndex = exerciseQuestions.findIndex(function (q) { return q.id === toId; });
    if (fromIndex < 0 || toIndex < 0) return;
    var next = exerciseQuestions.slice();
    var item = next.splice(fromIndex, 1)[0];
    next.splice(toIndex, 0, item);
    exerciseQuestions = next;
    exerciseActiveId = fromId;
    try {
      localStorage.setItem(EXERCISE_STORE_KEY, JSON.stringify(exerciseQuestions));
    } catch (_) {}
    renderExercisePage();
    renderEditorExerciseBlock();
  }

  function getExerciseSummary() {
    return exerciseQuestions.reduce(function (acc, q) {
      acc.total += 1;
      acc[q.type] = (acc[q.type] || 0) + 1;
      return acc;
    }, { total: 0, choice: 0, fill: 0, tf: 0, short: 0 });
  }

  function renderEditorExerciseBlock() {
    var block = document.getElementById('writeExerciseAnswerBlock');
    if (!block) return;
    if (!exerciseQuestions.length) {
      block.hidden = true;
      block.innerHTML = '';
      return;
    }
    var summary = getExerciseSummary();
    var paperTitle = getExerciseTitle();
    block.hidden = false;
    block.innerHTML =
      '<section class="reader-practice-section reader-practice-section--under-extend" aria-label="拓展练习">' +
        '<div class="reader-practice-card">' +
          '<header class="reader-practice-card__head">' +
            '<div class="reader-practice-card__head-main">' +
              '<h3 class="reader-practice-h3">拓展练习</h3>' +
            '</div>' +
            '<div class="reader-practice-actions">' +
              '<button type="button" class="reader-practice-export" id="writeExerciseBlockExport" aria-haspopup="true" aria-expanded="false">导出</button>' +
              '<div class="reader-practice-export-pop" id="writeExerciseExportPop" role="menu" aria-label="导出拓展练习">' +
                '<button type="button" role="menuitem" id="writeExerciseExportWord">导出 Word</button>' +
                '<button type="button" role="menuitem" id="writeExerciseExportQr">导出二维码</button>' +
              '</div>' +
              '<button type="button" class="reader-practice-edit" id="writeExerciseBlockEdit">编辑</button>' +
            '</div>' +
          '</header>' +
          '<div class="reader-practice-card__body">' +
            '<p class="reader-practice-lede">' + escapeHtml(paperTitle) + '：含选择题、填空、判断与简答；学生提交后可自动判分并查看每题解析与 AI 学习评价（演示，可对接 CMS）。</p>' +
            '<ul class="reader-practice-statrow" aria-label="本组题概况">' +
              '<li class="reader-practice-stat"><span class="reader-practice-stat__lab">题量</span><span class="reader-practice-stat__val">' + summary.total + ' 题</span></li>' +
            '</ul>' +
            '<div class="reader-practice-cta">' +
              '<button type="button" class="reader-practice-btn reader-practice-btn--primary" id="writeExerciseBlockAnswer">进入答题</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>';
  }

  function saveExerciseQuestions() {
    if (exerciseQuestions.length && !applyExerciseEditor(true)) return;
    try {
      localStorage.setItem(EXERCISE_STORE_KEY, JSON.stringify(exerciseQuestions));
    } catch (_) {}
    saveExerciseMeta();
    renderEditorExerciseBlock();
    closeExercisePage();
    toast('习题已保存，已插入答题板块');
  }

  function answerInputHtml(q) {
    if (q.type === 'choice') {
      return '<div class="cr-answer-options">' + q.options.map(function (opt, i) {
        var letter = String.fromCharCode(65 + i);
        return '<label class="cr-answer-option">' +
          '<input type="radio" name="answerPreviewChoice" value="' + letter + '">' +
          '<span>' + letter + '</span>' +
          '<b>' + escapeHtml(opt) + '</b>' +
        '</label>';
      }).join('') + '</div>';
    }
    if (q.type === 'tf') {
      return '<div class="cr-answer-options cr-answer-options--tf">' +
        '<label class="cr-answer-option"><input type="radio" name="answerPreviewTf" value="正确"><span>✓</span><b>正确</b></label>' +
        '<label class="cr-answer-option"><input type="radio" name="answerPreviewTf" value="错误"><span>×</span><b>错误</b></label>' +
      '</div>';
    }
    if (q.type === 'fill') {
      return '<input type="text" class="cr-answer-fill" placeholder="请填写答案">';
    }
    return '<textarea class="cr-answer-textarea" rows="5" placeholder="请输入你的作答"></textarea>';
  }

  function renderAnswerPreviewPage() {
    var body = document.getElementById('answerPreviewBody');
    var foot = document.getElementById('answerPreviewFoot');
    var sub = document.getElementById('answerPreviewSub');
    var title = document.getElementById('answerPreviewTitle');
    if (!body || !foot) return;
    if (title) title.textContent = getExerciseTitle();
    if (!exerciseQuestions.length) {
      body.innerHTML = '<div class="cr-answer-empty">暂无题目，请先返回编辑习题。</div>';
      foot.innerHTML = '<button type="button" class="cr-answer-btn" id="answerPreviewCloseEmpty">返回编辑</button>';
      return;
    }
    answerPreviewIndex = Math.max(0, Math.min(answerPreviewIndex, exerciseQuestions.length - 1));
    var q = exerciseQuestions[answerPreviewIndex];
    if (sub) sub.textContent = '共 ' + exerciseQuestions.length + ' 题 · 第 ' + (answerPreviewIndex + 1) + ' 题';
    var pills = exerciseQuestions.map(function (_, i) {
      var cls = i === answerPreviewIndex ? 'cr-answer-sheet-pill is-current' : 'cr-answer-sheet-pill';
      return '<button type="button" class="' + cls + '" data-answer-preview-step="' + i + '">' + (i + 1) + '</button>';
    }).join('');
    body.innerHTML =
      '<div class="cr-answer-layout">' +
        '<main class="cr-answer-main">' +
          '<div class="cr-answer-step-hint">第 ' + (answerPreviewIndex + 1) + ' / ' + exerciseQuestions.length + ' 题</div>' +
          '<article class="cr-answer-card">' +
            '<div class="cr-answer-qtype">' + exerciseTypeLabel(q.type) + '</div>' +
            '<h3 class="cr-answer-stem">' + escapeHtml(q.stem) + '</h3>' +
            answerInputHtml(q) +
          '</article>' +
        '</main>' +
        '<aside class="cr-answer-sheet" aria-label="答题卡">' +
          '<div class="cr-answer-sheet-head">答题卡</div>' +
          '<p class="cr-answer-sheet-progress">共 ' + exerciseQuestions.length + ' 题 · 预览模式</p>' +
          '<div class="cr-answer-sheet-grid">' + pills + '</div>' +
        '</aside>' +
      '</div>';
    var prevDisabled = answerPreviewIndex === 0 ? ' disabled' : '';
    var nextLabel = answerPreviewIndex >= exerciseQuestions.length - 1 ? '提交预览' : '下一题';
    foot.innerHTML =
      '<button type="button" class="cr-answer-btn" id="answerPreviewCloseBtn">返回阅读</button>' +
      '<button type="button" class="cr-answer-btn" id="answerPreviewPrevBtn"' + prevDisabled + '>上一题</button>' +
      '<button type="button" class="cr-answer-btn cr-answer-btn--primary" id="answerPreviewNextBtn">' + nextLabel + '</button>';
  }

  function openExerciseAnswerPreview() {
    if (!exerciseQuestions.length) {
      toast('暂无题目，请先编辑习题');
      openExercisePage();
      return;
    }
    var page = document.getElementById('writeExerciseAnswerPage');
    if (!page) return;
    answerPreviewIndex = 0;
    renderAnswerPreviewPage();
    page.classList.add('is-open');
    page.setAttribute('aria-hidden', 'false');
    document.getElementById('answerPreviewBody')?.focus({ preventScroll: true });
  }

  function closeExerciseAnswerPreview() {
    var page = document.getElementById('writeExerciseAnswerPage');
    if (!page) return;
    page.classList.remove('is-open');
    page.setAttribute('aria-hidden', 'true');
  }

  function addExerciseQuestion(type) {
    var t = ['choice', 'fill', 'tf', 'short'].indexOf(type) >= 0 ? type : 'choice';
    var defaults = {
      choice: {
        stem: '新建选择题',
        options: ['选项 A', '选项 B', '选项 C', '选项 D'],
        answer: 'A',
      },
      fill: {
        stem: '新建填空题：请在此输入含________的题干。',
        options: ['选项 A', '选项 B', '选项 C'],
        answer: '',
      },
      tf: {
        stem: '新建判断题',
        options: ['选项 A', '选项 B', '选项 C'],
        answer: '正确',
      },
      short: {
        stem: '新建简答题',
        options: ['选项 A', '选项 B', '选项 C'],
        answer: '',
      },
    };
    var d = defaults[t];
    var q = {
      id: makeExerciseId(),
      type: t,
      stem: d.stem,
      options: d.options.slice(),
      answer: d.answer,
      explain: '',
      score: scoreForExerciseType(t),
    };
    exerciseQuestions.push(q);
    exerciseActiveId = q.id;
    renderExercisePage();
    openExerciseEditModal(q.id);
  }

  function deleteExerciseQuestion(questionId) {
    var idToDelete = questionId || exerciseActiveId;
    var idx = exerciseQuestions.findIndex(function (q) {
      return q.id === idToDelete;
    });
    exerciseQuestions = exerciseQuestions.filter(function (q) {
      return q.id !== idToDelete;
    });
    var next = exerciseQuestions[Math.max(0, idx - 1)] || exerciseQuestions[0];
    exerciseActiveId = next ? next.id : '';
    renderExercisePage();
    renderEditorExerciseBlock();
    toast('已删除题目');
  }

  function updateExerciseScore(questionId, score) {
    exerciseQuestions = exerciseQuestions.map(function (q) {
      return q.id === questionId ? Object.assign({}, q, { score: Math.max(0, Math.min(100, Number(score) || 0)) }) : q;
    });
    renderExercisePage();
  }

  function batchSetExerciseScores() {
    if (!exerciseQuestions.length) {
      toast('暂无题目，请先出题');
      return;
    }
    var val = window.prompt('请输入统一分值', '5');
    if (val == null) return;
    var score = Math.max(0, Math.min(100, Number(val) || 0));
    exerciseQuestions = exerciseQuestions.map(function (q) {
      return Object.assign({}, q, { score: score });
    });
    renderExercisePage();
    toast('已批量设置分数');
  }

  function openAiExerciseModal() {
    var modal = document.getElementById('exerciseAiModal');
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    var setName = document.getElementById('exerciseAiSetName');
    if (setName && (!setName.value.trim() || setName.value.trim() === '习题集')) {
      setName.value = getExerciseTitle() || '习题集';
    }
    var prompt = document.getElementById('exerciseAiPrompt');
    if (prompt && !prompt.value.trim()) {
      prompt.value = '围绕当前章节核心概念生成习题，题干贴近教材案例，答案准确，解析说明依据，难度适合课堂测评。';
    }
    updateAiPromptCount();
    (setName || prompt)?.focus({ preventScroll: true });
  }

  function closeAiExerciseModal() {
    var modal = document.getElementById('exerciseAiModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function getAiExerciseConfig() {
    var name = String(document.getElementById('exerciseAiSetName')?.value || '').trim();
    var scope = '当前章节：第一章 内容';
    var prompt = String(document.getElementById('exerciseAiPrompt')?.value || '').trim();
    var counts = {
      choice: readAiCount('exerciseAiChoice'),
      fill: readAiCount('exerciseAiFill'),
      tf: readAiCount('exerciseAiTf'),
      short: readAiCount('exerciseAiShort'),
    };
    var count = counts.choice + counts.fill + counts.tf + counts.short;
    if (count <= 0) {
      counts.choice = 1;
      count = 1;
      writeAiCount('exerciseAiChoice', 1);
    }
    var difficulty = document.getElementById('exerciseAiDifficulty')?.value || '简单';
    var explain = 'detail';
    var refName = String(document.getElementById('exerciseAiRefName')?.dataset.fileName || '').trim();
    return { name: name, scope: scope, prompt: prompt, count: count, counts: counts, difficulty: difficulty, explain: explain, refName: refName };
  }

  function readAiCount(id) {
    return Math.max(0, Math.min(20, Number(document.getElementById(id)?.value) || 0));
  }

  function writeAiCount(id, value) {
    var el = document.getElementById(id);
    if (!el) return;
    el.value = String(Math.max(0, Math.min(20, Number(value) || 0)));
  }

  function stepAiExerciseCount(id, delta) {
    writeAiCount(id, readAiCount(id) + delta);
  }

  function updateAiPromptCount() {
    var prompt = document.getElementById('exerciseAiPrompt');
    var counter = document.getElementById('exerciseAiPromptCount');
    if (!prompt || !counter) return;
    counter.textContent = String(prompt.value.length) + '/1000';
  }

  function aiTypePlanFromConfig(cfg) {
    var plan = [];
    ['choice', 'fill', 'tf', 'short'].forEach(function (type) {
      var amount = cfg.counts && cfg.counts[type] ? cfg.counts[type] : 0;
      for (var i = 0; i < amount; i += 1) plan.push(type);
    });
    return plan.length ? plan : ['choice'];
  }

  function buildAiQuestion(type, i, cfg) {
    var n = i + 1;
    var scope = cfg.scope || '当前章节';
    var base = cfg.prompt.replace(/\s+/g, ' ').slice(0, 42) || '核心概念与案例应用';
    if (cfg.refName) base = (cfg.refName + '：' + base).slice(0, 42);
    var diff = cfg.difficulty;
    var explainTail = cfg.explain === 'detail'
      ? '解析需说明教材依据、解题步骤与易错点。'
      : cfg.explain === 'rubric'
        ? '解析需包含评分要点，便于教师批改。'
        : '解析需简明说明答案依据。';
    if (type === 'choice') {
      return {
        id: makeExerciseId(),
        type: 'choice',
        stem: '（AI生成·' + diff + '）' + scope + '：关于“' + base + '”，下列说法最恰当的是？',
        options: ['只需记忆定义，不需要结合情境', '能结合教材案例说明概念、过程与依据', '所有答案都可以直接由 AI 代替人工判断', '只要完成操作步骤即可忽略反思'],
        answer: 'B',
        explain: explainTail + '本题考查学生能否把知识点迁移到教材案例中，而非单纯记忆。',
        score: scoreForExerciseType('choice'),
      };
    }
    if (type === 'fill') {
      return {
        id: makeExerciseId(),
        type: 'fill',
        stem: '（AI生成·' + diff + '）' + scope + '中，完成学习任务后应记录关键依据与过程，以保证结果具有________。',
        options: ['选项 A', '选项 B', '选项 C'],
        answer: '可追溯性',
        explain: explainTail + '记录依据与过程有助于复盘、评价和修正学习成果。',
        score: scoreForExerciseType('fill'),
      };
    }
    if (type === 'tf') {
      return {
        id: makeExerciseId(),
        type: 'tf',
        stem: '（AI生成·' + diff + '）围绕“' + base + '”出题时，题干应与教学目标对应，并给出可核验的答案或评分依据。',
        options: ['选项 A', '选项 B', '选项 C'],
        answer: '正确',
        explain: explainTail + '题目、答案和解析需要与教学目标一致，避免泛泛而谈。',
        score: scoreForExerciseType('tf'),
      };
    }
    return {
      id: makeExerciseId(),
      type: 'short',
      stem: '（AI生成·' + diff + '）请结合' + scope + '，说明“' + base + '”可以如何转化为一道课堂测评任务。（不少于 40 字）',
      options: ['选项 A', '选项 B', '选项 C'],
      answer: '可从任务情境、考查能力、完成步骤和评价标准四方面说明，要求表述清晰并能对应教材内容。',
      explain: explainTail + '简答题重点看学生是否能说明任务设计意图和评价标准。',
      score: scoreForExerciseType('short'),
    };
  }

  function aiBuildExercisePaper() {
    var cfg = getAiExerciseConfig();
    if (!cfg.prompt) {
      toast('请先填写出题要求');
      document.getElementById('exerciseAiPrompt')?.focus();
      return;
    }
    if (cfg.name) {
      exerciseTitle = cfg.name;
      saveExerciseMeta();
      syncExerciseTitleUi();
    }
    var plan = aiTypePlanFromConfig(cfg);
    exerciseQuestions = plan.map(function (type, i) {
      return buildAiQuestion(type, i, cfg);
    });
    exerciseActiveId = exerciseQuestions[0].id;
    closeAiExerciseModal();
    renderExercisePage();
    toast('AI 已生成 ' + exerciseQuestions.length + ' 道题（演示）');
  }

  function importExerciseFile(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var text = String(reader.result || '').trim();
      if (!text) {
        toast('未读取到题目内容');
        return;
      }
      var imported = null;
      try {
        var json = JSON.parse(text);
        imported = Array.isArray(json) ? normalizeExerciseQuestions(json) : null;
      } catch (_) {}
      if (!imported || !imported.length) {
        imported = text
          .split(/\n\s*\n+/)
          .map(function (block) {
            var lines = block.split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
            if (!lines.length) return null;
            return {
              id: makeExerciseId(),
              type: 'short',
              stem: lines[0].replace(/^\d+[.、]\s*/, ''),
              options: ['选项 A', '选项 B', '选项 C'],
              answer: lines.find(function (x) { return /^答案[:：]/.test(x); })?.replace(/^答案[:：]\s*/, '') || '',
              explain: lines.find(function (x) { return /^解析[:：]/.test(x); })?.replace(/^解析[:：]\s*/, '') || '',
              score: scoreForExerciseType('short'),
            };
          })
          .filter(Boolean);
      }
      if (!imported.length) {
        toast('题目格式未识别');
        return;
      }
      exerciseQuestions = imported;
      exerciseActiveId = exerciseQuestions[0].id;
      renderExercisePage();
      toast('已导入 ' + imported.length + ' 道题');
    };
    reader.onerror = function () {
      toast('导入失败，请重试');
    };
    reader.readAsText(file);
  }

  function exportExerciseWord() {
    if (!exerciseQuestions.length) {
      toast('暂无题目，请先导入或 AI 出卷');
      return;
    }
    applyExerciseEditor(true);
    var rows = exerciseQuestions
      .map(function (q, i) {
        var options = q.type === 'choice'
          ? '<ol type="A">' + q.options.map(function (opt) { return '<li>' + escapeHtml(opt) + '</li>'; }).join('') + '</ol>'
          : '';
        return '<h2>' + (i + 1) + '. ' + exerciseTypeLabel(q.type) + '</h2>' +
          '<p>' + escapeHtml(q.stem) + '</p>' +
          options +
          '<p><strong>分值：</strong>' + escapeHtml(q.score || scoreForExerciseType(q.type)) + ' 分</p>' +
          '<p><strong>答案：</strong>' + escapeHtml(q.answer || '') + '</p>' +
          '<p><strong>解析：</strong>' + escapeHtml(q.explain || '') + '</p>';
      })
      .join('');
    var paperTitle = getExerciseTitle();
    var html = '<!doctype html><html><head><meta charset="utf-8"><title>' + escapeHtml(paperTitle) + '</title></head><body><h1>' + escapeHtml(paperTitle) + '</h1>' + rows + '</body></html>';
    var blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    downloadBlob(blob, sanitizeFilename(paperTitle) + '.doc');
    toast('已导出 Word 文件');
  }

  function qrPushBits(bits, val, len) {
    for (var i = len - 1; i >= 0; i -= 1) bits.push((val >>> i) & 1);
  }

  function qrGfTables() {
    var exp = new Array(512);
    var log = new Array(256);
    var x = 1;
    for (var i = 0; i < 255; i += 1) {
      exp[i] = x;
      log[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (var j = 255; j < 512; j += 1) exp[j] = exp[j - 255];
    return { exp: exp, log: log };
  }

  function qrGfMul(a, b, gf) {
    return a && b ? gf.exp[gf.log[a] + gf.log[b]] : 0;
  }

  function qrGeneratorPoly(degree, gf) {
    var poly = [1];
    for (var i = 0; i < degree; i += 1) {
      var next = new Array(poly.length + 1).fill(0);
      for (var j = 0; j < poly.length; j += 1) {
        next[j] ^= poly[j];
        next[j + 1] ^= qrGfMul(poly[j], gf.exp[i], gf);
      }
      poly = next;
    }
    return poly;
  }

  function qrReedSolomon(data, degree, gf, gen) {
    var ecc = new Array(degree).fill(0);
    data.forEach(function (cw) {
      var factor = cw ^ ecc.shift();
      ecc.push(0);
      for (var i = 0; i < degree; i += 1) {
        ecc[i] ^= qrGfMul(gen[i + 1], factor, gf);
      }
    });
    return ecc;
  }

  function qrMakeCodewords(text) {
    var bytes = Array.from(new TextEncoder().encode(text));
    if (bytes.length > 106) {
      bytes = Array.from(new TextEncoder().encode(location.origin + location.pathname + '?exercise=answer'));
    }
    var bits = [];
    qrPushBits(bits, 4, 4);
    qrPushBits(bits, bytes.length, 8);
    bytes.forEach(function (b) { qrPushBits(bits, b, 8); });
    var dataCapacityBits = 136 * 8;
    var terminator = Math.min(4, dataCapacityBits - bits.length);
    for (var i = 0; i < terminator; i += 1) bits.push(0);
    while (bits.length % 8) bits.push(0);
    var data = [];
    for (var j = 0; j < bits.length; j += 8) {
      data.push(bits.slice(j, j + 8).reduce(function (acc, b) { return (acc << 1) | b; }, 0));
    }
    for (var pad = 0; data.length < 136; pad += 1) data.push(pad % 2 ? 0x11 : 0xec);
    var gf = qrGfTables();
    var gen = qrGeneratorPoly(18, gf);
    var b0 = data.slice(0, 68);
    var b1 = data.slice(68, 136);
    var e0 = qrReedSolomon(b0, 18, gf, gen);
    var e1 = qrReedSolomon(b1, 18, gf, gen);
    var all = [];
    for (var d = 0; d < 68; d += 1) all.push(b0[d], b1[d]);
    for (var e = 0; e < 18; e += 1) all.push(e0[e], e1[e]);
    var out = [];
    all.forEach(function (cw) { qrPushBits(out, cw, 8); });
    for (var r = 0; r < 7; r += 1) out.push(0);
    return out;
  }

  function qrFormatBits() {
    var data = 1 << 3;
    var bits = data << 10;
    for (var i = 14; i >= 10; i -= 1) {
      if ((bits >>> i) & 1) bits ^= 0x537 << (i - 10);
    }
    return ((data << 10) | bits) ^ 0x5412;
  }

  function qrDrawFunction(matrix, reserved, x, y, dark) {
    if (x < 0 || y < 0 || y >= matrix.length || x >= matrix.length) return;
    matrix[y][x] = !!dark;
    reserved[y][x] = true;
  }

  function qrDrawFinder(matrix, reserved, x, y) {
    for (var dy = -1; dy <= 7; dy += 1) {
      for (var dx = -1; dx <= 7; dx += 1) {
        var xx = x + dx;
        var yy = y + dy;
        if (xx < 0 || yy < 0 || yy >= matrix.length || xx >= matrix.length) continue;
        var dark = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6 &&
          (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
        qrDrawFunction(matrix, reserved, xx, yy, dark);
      }
    }
  }

  function qrDrawAlignment(matrix, reserved, cx, cy) {
    for (var dy = -2; dy <= 2; dy += 1) {
      for (var dx = -2; dx <= 2; dx += 1) {
        qrDrawFunction(matrix, reserved, cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }
  }

  function qrSetFormat(matrix, reserved) {
    var size = matrix.length;
    var bits = qrFormatBits();
    for (var i = 0; i < 15; i += 1) {
      var dark = ((bits >>> i) & 1) === 1;
      if (i < 6) qrDrawFunction(matrix, reserved, 8, i, dark);
      else if (i < 8) qrDrawFunction(matrix, reserved, 8, i + 1, dark);
      else qrDrawFunction(matrix, reserved, 14 - i, 8, dark);

      if (i < 8) qrDrawFunction(matrix, reserved, size - 1 - i, 8, dark);
      else qrDrawFunction(matrix, reserved, 8, size - 15 + i, dark);
    }
    qrDrawFunction(matrix, reserved, 8, size - 8, true);
  }

  function makeQrDataUrl(text) {
    var size = 41;
    var matrix = Array.from({ length: size }, function () { return new Array(size).fill(false); });
    var reserved = Array.from({ length: size }, function () { return new Array(size).fill(false); });
    qrDrawFinder(matrix, reserved, 0, 0);
    qrDrawFinder(matrix, reserved, size - 7, 0);
    qrDrawFinder(matrix, reserved, 0, size - 7);
    for (var i = 8; i < size - 8; i += 1) {
      qrDrawFunction(matrix, reserved, i, 6, i % 2 === 0);
      qrDrawFunction(matrix, reserved, 6, i, i % 2 === 0);
    }
    qrDrawAlignment(matrix, reserved, 34, 34);
    qrSetFormat(matrix, reserved);
    var dataBits = qrMakeCodewords(text);
    var bitIndex = 0;
    var upward = true;
    for (var x = size - 1; x > 0; x -= 2) {
      if (x === 6) x -= 1;
      for (var yStep = 0; yStep < size; yStep += 1) {
        var y = upward ? size - 1 - yStep : yStep;
        for (var col = 0; col < 2; col += 1) {
          var xx = x - col;
          if (reserved[y][xx]) continue;
          var bit = bitIndex < dataBits.length ? dataBits[bitIndex] : 0;
          bitIndex += 1;
          matrix[y][xx] = Boolean(bit) !== ((x + y) % 2 === 0);
        }
      }
      upward = !upward;
    }
    qrSetFormat(matrix, reserved);
    var scale = 8;
    var quiet = 4;
    var canvas = document.createElement('canvas');
    canvas.width = (size + quiet * 2) * scale;
    canvas.height = canvas.width;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f172a';
    for (var yy = 0; yy < size; yy += 1) {
      for (var xx2 = 0; xx2 < size; xx2 += 1) {
        if (matrix[yy][xx2]) ctx.fillRect((xx2 + quiet) * scale, (yy + quiet) * scale, scale, scale);
      }
    }
    return canvas.toDataURL('image/png');
  }

  function exportExerciseQr() {
    if (!exerciseQuestions.length) {
      toast('暂无题目，请先保存习题');
      return;
    }
    applyExerciseEditor(true);
    try {
      localStorage.setItem(EXERCISE_STORE_KEY, JSON.stringify(exerciseQuestions));
    } catch (_) {}
    var url = getExerciseAnswerUrl();
    var dataUrl = makeQrDataUrl(url);
    fetch(dataUrl)
      .then(function (res) { return res.blob(); })
      .then(function (blob) {
        downloadBlob(blob, '拓展练习答题二维码.png');
        toast('已导出二维码，可印到纸质书上扫码答题');
      })
      .catch(function () {
        toast('二维码导出失败，请重试');
      });
  }

  document.getElementById('exerciseBackBtn')?.addEventListener('click', closeExercisePage);
  document.getElementById('exerciseTitleEditBtn')?.addEventListener('click', openExerciseTitleEditor);
  document.getElementById('exerciseTitleSaveBtn')?.addEventListener('click', saveExerciseTitle);
  document.getElementById('exerciseTitleCancelBtn')?.addEventListener('click', closeExerciseTitleEditor);
  document.getElementById('exerciseTitleInput')?.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveExerciseTitle();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      closeExerciseTitleEditor();
    }
  });
  document.getElementById('exerciseAddBtn')?.addEventListener('click', function () {
    var pop = document.querySelector('.cr-exam-add-pop');
    var btn = document.getElementById('exerciseAddBtn');
    if (!pop || !btn) return;
    var open = pop.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.getElementById('exerciseSaveBtn')?.addEventListener('click', saveExerciseQuestions);
  document.getElementById('exerciseDraftBtn')?.addEventListener('click', function () {
    try {
      localStorage.setItem(EXERCISE_STORE_KEY, JSON.stringify(exerciseQuestions));
    } catch (_) {}
    saveExerciseMeta();
    renderEditorExerciseBlock();
    toast('拓展练习草稿已保存');
  });
  document.getElementById('exerciseBatchScoreBtn')?.addEventListener('click', batchSetExerciseScores);
  document.getElementById('exercisePreviewBtn')?.addEventListener('click', openExerciseAnswerPreview);
  document.getElementById('exerciseAiBtn')?.addEventListener('click', openAiExerciseModal);
  document.getElementById('exerciseAiCloseBtn')?.addEventListener('click', closeAiExerciseModal);
  document.getElementById('exerciseAiCancelBtn')?.addEventListener('click', closeAiExerciseModal);
  document.getElementById('exerciseAiGenerateBtn')?.addEventListener('click', aiBuildExercisePaper);
  document.getElementById('exerciseAiPrompt')?.addEventListener('input', updateAiPromptCount);
  document.querySelectorAll('[data-ai-count-step]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      stepAiExerciseCount(btn.dataset.aiCountStep, Number(btn.dataset.aiCountDelta) || 0);
    });
  });
  ['exerciseAiChoice', 'exerciseAiFill', 'exerciseAiTf', 'exerciseAiShort'].forEach(function (id) {
    document.getElementById(id)?.addEventListener('change', function () {
      writeAiCount(id, readAiCount(id));
    });
  });
  document.getElementById('exerciseAiModal')?.addEventListener('click', function (e) {
    if (e.target.closest('[data-ai-modal-close]')) closeAiExerciseModal();
  });
  document.getElementById('exerciseAiRefInput')?.addEventListener('change', function (e) {
    var files = Array.from(e.target.files || []).slice(0, 10);
    var label = document.getElementById('exerciseAiRefName');
    if (!label) return;
    if (!files.length) {
      label.textContent = '点击或拖拽上传文件(支持上传10个文件)';
      label.dataset.fileName = '';
      return;
    }
    var names = files.map(function (file) { return file.name; });
    label.textContent = files.length === 1 ? names[0] + ' · 已作为参考资料加入' : files.length + ' 个文件已作为参考资料加入';
    label.dataset.fileName = names.join('、');
  });
  document.getElementById('exerciseExportBtn')?.addEventListener('click', exportExerciseWord);
  document.getElementById('exerciseImportInput')?.addEventListener('change', function (e) {
    importExerciseFile(e.target.files && e.target.files[0]);
    e.target.value = '';
  });
  document.getElementById('exerciseModalType')?.addEventListener('change', function () {
    var q = getActiveExercise() || { type: this.value, options: ['选项 A', '选项 B', '选项 C'], answer: '' };
    var next = Object.assign({}, q, { type: this.value });
    if (next.type === 'choice') {
      next.options = Array.isArray(q.options) && q.options.length >= 2 ? q.options : ['选项 A', '选项 B', '选项 C', '选项 D'];
      next.answer = /^[A-F]$/.test(q.answer) ? q.answer : 'A';
    } else if (next.type === 'tf') {
      next.options = ['正确', '错误'];
      next.answer = q.answer === '错误' ? '错误' : '正确';
    } else {
      next.options = [];
    }
    document.getElementById('exerciseModalAnswer').value = next.answer || '';
    renderExerciseModalOptions(next);
  });
  document.getElementById('exerciseEditModalClose')?.addEventListener('click', closeExerciseEditModal);
  document.getElementById('exerciseEditModalCancel')?.addEventListener('click', closeExerciseEditModal);
  document.getElementById('exerciseEditModalSave')?.addEventListener('click', saveExerciseEditModal);
  document.getElementById('exerciseEditModal')?.addEventListener('click', function (e) {
    if (e.target.closest('[data-exercise-edit-close]')) closeExerciseEditModal();
  });
  document.getElementById('exerciseList')?.addEventListener('click', function (e) {
    var act = e.target.closest('[data-empty-action]');
    if (act) {
      e.stopPropagation();
      if (act.getAttribute('data-empty-action') === 'ai') openAiExerciseModal();
      else addExerciseQuestion();
      return;
    }
    var row = e.target.closest('[data-exercise-id]');
    if (!row) return;
    applyExerciseEditor(true);
    exerciseActiveId = row.getAttribute('data-exercise-id');
    renderExercisePage();
  });
  document.getElementById('exerciseList')?.addEventListener('dragstart', function (e) {
    var row = e.target.closest('[data-exercise-id]');
    if (!row) return;
    row.classList.add('is-dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', row.getAttribute('data-exercise-id'));
  });
  document.getElementById('exerciseList')?.addEventListener('dragover', function (e) {
    var row = e.target.closest('[data-exercise-id]');
    if (!row) return;
    e.preventDefault();
    row.classList.add('is-drop-target');
    e.dataTransfer.dropEffect = 'move';
  });
  document.getElementById('exerciseList')?.addEventListener('dragleave', function (e) {
    var row = e.target.closest('[data-exercise-id]');
    if (row) row.classList.remove('is-drop-target');
  });
  document.getElementById('exerciseList')?.addEventListener('drop', function (e) {
    var row = e.target.closest('[data-exercise-id]');
    if (!row) return;
    e.preventDefault();
    var fromId = e.dataTransfer.getData('text/plain');
    var toId = row.getAttribute('data-exercise-id');
    document.querySelectorAll('.cr-exam-qrow').forEach(function (r) {
      r.classList.remove('is-dragging', 'is-drop-target');
    });
    moveExerciseQuestion(fromId, toId);
  });
  document.getElementById('exerciseList')?.addEventListener('dragend', function () {
    document.querySelectorAll('.cr-exam-qrow').forEach(function (r) {
      r.classList.remove('is-dragging', 'is-drop-target');
    });
  });
  document.getElementById('writeExercisePage')?.addEventListener('click', function (e) {
    var act = e.target.closest('[data-empty-action]');
    if (act) {
      if (act.getAttribute('data-empty-action') === 'ai') openAiExerciseModal();
      else addExerciseQuestion();
      return;
    }
    var edit = e.target.closest('[data-exercise-edit]');
    if (edit) {
      openExerciseEditModal(edit.getAttribute('data-exercise-edit'));
      return;
    }
    var del = e.target.closest('[data-exercise-delete]');
    if (del) {
      deleteExerciseQuestion(del.getAttribute('data-exercise-delete'));
    }
  });
  document.getElementById('writeExercisePage')?.addEventListener('change', function (e) {
    var scoreInput = e.target.closest('[data-exercise-score]');
    if (scoreInput) {
      updateExerciseScore(scoreInput.getAttribute('data-exercise-score'), scoreInput.value);
    }
  });
  document.getElementById('exercisePaperContent')?.addEventListener('dragstart', function (e) {
    var card = e.target.closest('[data-exercise-id]');
    if (!card) return;
    card.classList.add('is-dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.getAttribute('data-exercise-id'));
  });
  document.getElementById('exercisePaperContent')?.addEventListener('dragover', function (e) {
    var card = e.target.closest('[data-exercise-id]');
    var dragging = document.querySelector('.cr-qb-edit-question.is-dragging');
    if (!card || !dragging || card === dragging || card.getAttribute('data-type') !== dragging.getAttribute('data-type')) return;
    e.preventDefault();
    card.classList.add('is-drop-target');
    e.dataTransfer.dropEffect = 'move';
  });
  document.getElementById('exercisePaperContent')?.addEventListener('dragleave', function (e) {
    var card = e.target.closest('[data-exercise-id]');
    if (card) card.classList.remove('is-drop-target');
  });
  document.getElementById('exercisePaperContent')?.addEventListener('drop', function (e) {
    var card = e.target.closest('[data-exercise-id]');
    if (!card) return;
    e.preventDefault();
    var fromId = e.dataTransfer.getData('text/plain');
    var toId = card.getAttribute('data-exercise-id');
    document.querySelectorAll('.cr-qb-edit-question').forEach(function (r) {
      r.classList.remove('is-dragging', 'is-drop-target');
    });
    moveExerciseQuestion(fromId, toId);
  });
  document.getElementById('exercisePaperContent')?.addEventListener('dragend', function () {
    document.querySelectorAll('.cr-qb-edit-question').forEach(function (r) {
      r.classList.remove('is-dragging', 'is-drop-target');
    });
  });
  document.getElementById('writeExerciseAnswerBlock')?.addEventListener('click', function (e) {
    if (e.target.closest('#writeExerciseBlockExport')) {
      var btn = document.getElementById('writeExerciseBlockExport');
      var pop = document.getElementById('writeExerciseExportPop');
      if (!btn || !pop) return;
      var open = pop.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      return;
    }
    if (e.target.closest('#writeExerciseExportWord')) {
      exportExerciseWord();
      document.getElementById('writeExerciseExportPop')?.classList.remove('is-open');
      document.getElementById('writeExerciseBlockExport')?.setAttribute('aria-expanded', 'false');
      return;
    }
    if (e.target.closest('#writeExerciseExportQr')) {
      exportExerciseQr();
      document.getElementById('writeExerciseExportPop')?.classList.remove('is-open');
      document.getElementById('writeExerciseBlockExport')?.setAttribute('aria-expanded', 'false');
      return;
    }
    if (e.target.closest('#writeExerciseBlockEdit')) {
      openExercisePage();
      return;
    }
    if (e.target.closest('#writeExerciseBlockAnswer')) {
      openExerciseAnswerPreview();
    }
  });
  document.getElementById('writeExerciseAnswerPage')?.addEventListener('click', function (e) {
    if (e.target.closest('#answerPreviewBackBtn') || e.target.closest('#answerPreviewCloseBtn') || e.target.closest('#answerPreviewCloseEmpty')) {
      closeExerciseAnswerPreview();
      return;
    }
    if (e.target.closest('#answerPreviewPrevBtn')) {
      answerPreviewIndex = Math.max(0, answerPreviewIndex - 1);
      renderAnswerPreviewPage();
      return;
    }
    if (e.target.closest('#answerPreviewNextBtn')) {
      if (answerPreviewIndex >= exerciseQuestions.length - 1) {
        toast('答题预览完成（演示）');
        closeExerciseAnswerPreview();
      } else {
        answerPreviewIndex += 1;
        renderAnswerPreviewPage();
      }
      return;
    }
    var step = e.target.closest('[data-answer-preview-step]');
    if (step) {
      answerPreviewIndex = Number(step.getAttribute('data-answer-preview-step')) || 0;
      renderAnswerPreviewPage();
    }
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#writeExerciseAnswerBlock')) {
      document.getElementById('writeExerciseExportPop')?.classList.remove('is-open');
      document.getElementById('writeExerciseBlockExport')?.setAttribute('aria-expanded', 'false');
    }
  });
  document.getElementById('exerciseAddWrap')?.addEventListener('click', function (e) {
    var typeBtn = e.target.closest('[data-add-type]');
    if (!typeBtn) return;
    e.preventDefault();
    addExerciseQuestion(typeBtn.getAttribute('data-add-type'));
    var pop = document.querySelector('.cr-exam-add-pop');
    var addBtn = document.getElementById('exerciseAddBtn');
    if (pop) pop.classList.remove('is-open');
    if (addBtn) addBtn.setAttribute('aria-expanded', 'false');
    document.getElementById('exerciseModalStem')?.focus({ preventScroll: true });
  });

  syncExerciseTitleUi();
  renderEditorExerciseBlock();
  if (params.get('exercise') === 'answer') {
    setTimeout(openExerciseAnswerPreview, 80);
  }
})();
