---
layout: page
title: Guestbook
permalink: /guestbook/
---

<p>Assina o guestbook — deixa um recado e diz que passaste por aqui.</p>

<div class="aero-window guestbook-window">
  <div class="aero-window__titlebar">
    <span>guestbook.txt</span>
    <div class="aero-window__buttons">
      <span>_</span><span>□</span><span>×</span>
    </div>
  </div>
  <div class="aero-window__body">
    {% for entry in site.data.guestbook reversed %}
      <div class="guestbook-msg">
        <span class="guestbook-msg__name">{{ entry.name }}</span>
        <span class="guestbook-msg__date"> ({{ entry.date }})</span>
        <p class="guestbook-msg__text">{{ entry.message }}</p>
      </div>
    {% endfor %}

    {% if site.data.guestbook == empty %}
      <p class="guestbook-empty">Ainda sem mensagens. Sê o primeiro!</p>
    {% endif %}
  </div>
</div>

<h3>Deixar mensagem</h3>

<div class="guestbook-form">
  <div class="guestbook-form__field">
    <label for="gb-name">Nome:</label>
    <input type="text" id="gb-name" placeholder="O teu nome" required>
  </div>
  <div class="guestbook-form__field">
    <label for="gb-message">Mensagem:</label>
    <textarea id="gb-message" placeholder="Deixa o teu recado..." required></textarea>
  </div>
  <button id="gb-submit" class="guestbook-form__submit">Enviar</button>
  <p id="gb-status" class="guestbook-status"></p>
</div>

<script>
(function() {
  var btn = document.getElementById('gb-submit');
  var status = document.getElementById('gb-status');

  btn.addEventListener('click', function() {
    var name = document.getElementById('gb-name').value.trim();
    var message = document.getElementById('gb-message').value.trim();

    if (!name || !message) {
      status.textContent = 'Preenche todos os campos.';
      status.className = 'guestbook-status guestbook-status--error';
      return;
    }

    var title = '[Guestbook] ' + name;
    var body = '## Guestbook Entry\n\n**Name:** ' + name + '\n\n**Message:**\n\n' + message;
    var labels = 'guestbook';
    var repo = 'joaosantosg/personal-blog';

    var url = 'https://github.com/' + repo + '/issues/new?title='
      + encodeURIComponent(title)
      + '&body=' + encodeURIComponent(body)
      + '&labels=' + encodeURIComponent(labels);

    window.open(url, '_blank');
    status.textContent = 'A abrir o GitHub... Submete a issue para assinar o guestbook.';
    status.className = 'guestbook-status guestbook-status--success';
  });
})();
</script>
