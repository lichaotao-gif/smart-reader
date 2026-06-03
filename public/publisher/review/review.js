(function () {
  var toastEl = document.getElementById('pubReviewToast');

  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () {
      toastEl.hidden = true;
    }, 2200);
  }

  function setActiveReview(id) {
    if (!id) return;
    id = String(id);
    document.querySelectorAll('.pub-review-pin').forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-review-id') === id);
    });
    document.querySelectorAll('.pub-review-card').forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-review-id') === id);
    });
    var anchor = document.getElementById('review-anchor-' + id);
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function applyFilter() {
    var sel = document.getElementById('pubReviewFilter');
    if (!sel) return;
    var v = sel.value;
    document.querySelectorAll('.pub-review-card').forEach(function (card) {
      var st = card.getAttribute('data-status');
      var show =
        v === 'all' ||
        (v === 'open' && st === 'open') ||
        (v === 'resolved' && st === 'resolved');
      card.hidden = !show;
    });
  }

  var docEl = document.getElementById('pubReviewDoc');
  if (docEl) {
    docEl.addEventListener('click', function (e) {
      var pin = e.target.closest('.pub-review-pin');
      if (!pin) return;
      e.preventDefault();
      setActiveReview(pin.getAttribute('data-review-id'));
    });
  }

  var cardsEl = document.getElementById('pubReviewCards');
  if (cardsEl) {
    cardsEl.addEventListener('click', function (e) {
      var actionBtn = e.target.closest('[data-card-action]');
      if (actionBtn) {
        var act = actionBtn.getAttribute('data-card-action');
        if (act === 'resolve') toast('已标记为解决（演示，未写入服务器）');
        else if (act === 'edit') toast('编辑意见（演示）');
        else if (act === 'delete') toast('删除意见（演示）');
        return;
      }
      var card = e.target.closest('.pub-review-card');
      if (!card || card.hidden) return;
      setActiveReview(card.getAttribute('data-review-id'));
    });
  }

  var filterEl = document.getElementById('pubReviewFilter');
  if (filterEl) {
    filterEl.addEventListener('change', applyFilter);
    applyFilter();
  }

  document.getElementById('pubReviewDetailBtn') &&
    document.getElementById('pubReviewDetailBtn').addEventListener('click', function () {
      toast('审核详情（演示，可对接工单与流程）');
    });
  document.getElementById('pubReviewReworkBtn') &&
    document.getElementById('pubReviewReworkBtn').addEventListener('click', function () {
      toast('已发起返修（演示流程）');
    });
  document.getElementById('pubReviewPassBtn') &&
    document.getElementById('pubReviewPassBtn').addEventListener('click', function () {
      toast('审核通过（演示流程）');
    });

  var params = new URLSearchParams(window.location.search);
  var t = params.get('title');
  if (t) {
    var titleEl = document.getElementById('pubReviewBookTitle');
    if (titleEl) titleEl.textContent = decodeURIComponent(t);
  }
})();
