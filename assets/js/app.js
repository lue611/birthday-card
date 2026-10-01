(function () {
  'use strict';
  var c = CARD_CONFIG;
  var $ = function (id) { return document.getElementById(id); };
  var clean = function (value) { return String(value || '').trim(); };
  var name = clean(c.recipient) || '你';
  var words = Array.isArray(c.shortWishes) ? c.shortWishes.map(clean).filter(Boolean) : [];
  var wordIndex = 0;

  $('openingRecipient').textContent = name;
  $('peekRecipient').textContent = name;
  $('salutation').textContent = '亲爱的 ' + name + '：';
  $('lead').textContent = clean(c.openingLine) || '今天，世界又多了一点温柔。';
  $('sender').textContent = clean(c.sender) || '关心你的人';
  document.title = '一封生日来信 · ' + name;

  var now = new Date();
  $('dateLine').textContent = now.getFullYear() + ' 年 ' + (now.getMonth() + 1) + ' 月 ' + now.getDate() + ' 日 · 写给特别的你';
  (Array.isArray(c.letter) ? c.letter : []).forEach(function (line) {
    var paragraph = document.createElement('p');
    paragraph.textContent = line;
    $('letter').appendChild(paragraph);
  });

  function showWish() {
    $('wish').textContent = words.length ? words[wordIndex++ % words.length] : '愿你生日快乐，万事顺意。';
  }
  showWish();

  if (clean(c.photoUrl)) {
    $('photo').src = clean(c.photoUrl);
    $('caption').textContent = clean(c.photoCaption) || '这一刻，值得被珍藏。';
    $('photoCard').classList.remove('hidden');
  }

  var music = $('music');
  if (clean(c.musicUrl)) {
    music.src = clean(c.musicUrl);
    $('musicButton').classList.remove('hidden');
    $('musicButton').addEventListener('click', function () {
      if (music.paused) {
        music.play().then(function () { $('musicButton').textContent = '♫ 暂停背景音乐'; }).catch(function () { $('musicButton').textContent = '音乐暂时无法播放'; });
      } else {
        music.pause();
        $('musicButton').textContent = '♫ 播放这封信的背景音乐';
      }
    });
  }

  function celebrate(count) {
    var colors = ['#e97972', '#d4a14c', '#6e7db7', '#8a5c85', '#70aa9d', '#efb46c'];
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < (count || 90); i += 1) {
      var piece = document.createElement('i');
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.setProperty('--t', 2.5 + Math.random() * 2 + 's');
      piece.style.setProperty('--d', Math.random() * 0.5 + 's');
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '1px';
      fragment.appendChild(piece);
    }
    $('confetti').replaceChildren(fragment);
    window.setTimeout(function () { $('confetti').replaceChildren(); }, 4800);
  }

  $('wishButton').addEventListener('click', function () { showWish(); celebrate(26); });
  function reveal() {
    var envelope = $('envelope');
    if (envelope.classList.contains('is-open')) return;
    envelope.classList.add('is-open');
    window.setTimeout(function () {
      $('opening').classList.add('is-gone');
      $('memory').classList.add('is-visible');
      celebrate();
    }, 860);
  }
  $('envelope').addEventListener('click', reveal);
  $('envelope').addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); reveal(); }
  });

  var openAt = clean(c.openAt) ? new Date(c.openAt).getTime() : 0;
  function updateCountdown() {
    var remaining = openAt - Date.now();
    if (remaining <= 0) { window.location.reload(); return; }
    var seconds = Math.ceil(remaining / 1000);
    var days = Math.floor(seconds / 86400);
    var hours = Math.floor(seconds % 86400 / 3600);
    var minutes = Math.floor(seconds % 3600 / 60);
    $('countdownNumber').textContent = days + ' 天 ' + String(hours).padStart(2, '0') + ' 时 ' + String(minutes).padStart(2, '0') + ' 分 ' + String(seconds % 60).padStart(2, '0') + ' 秒';
  }
  if (Number.isFinite(openAt) && openAt > Date.now()) {
    $('countdown').classList.remove('hidden');
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }
}());
