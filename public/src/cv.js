var visited = false;

if (document.cookie !== '') {
  document.cookie.split(';').forEach(function(item) {
    item = item.split('=');
    if (item[0].trim() === 'accepted') {
      visited = !!item[1];
    }
  });
}

document.addEventListener('click', function(event) {
  var bgColour = event.target.getAttribute('data-bg-colour');
  document.documentElement.style.setProperty('--bg-colour', bgColour);
  var fgColour = event.target.getAttribute('data-fg-colour');
  document.documentElement.style.setProperty('--fg-colour', fgColour);
});

if (!visited) {
  var cookieAccept = function(event) {
    if (event.code && event.code === 'Enter' || event.type === 'click') {
      document.cookie = 'accepted=true';
      document.querySelector('.cookies').remove();
      document.removeEventListener('keydown', cookieAccept);
    }
  };

  document.querySelector('.accept').addEventListener('click', cookieAccept);
  document.addEventListener('keydown', cookieAccept);

  if ('speechSynthesis' in window) {
    var synth = window.speechSynthesis;
    var intro = document.querySelector('.intro');
    var text = `Welcome, this is my CV. If you don't want to hear this again, please press Enter to accept cookies.`;
    var voices = synth
      .getVoices()
      .filter(voice => voice.lang === navigator.language && voice.default);

    text.split(/\s+/g).forEach(function(word) {
      var sp = document.createElement('span');
      sp.innerText = word;
      sp.className = `${word.match(/\w+/g).join('')}-spoken`;
      intro.appendChild(sp);
    });

    var utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices[0];
    utterance.onboundary = function(event) {
      var boundaryStart = event.charIndex;
      var boundaryEnd = event.currentTarget.text.indexOf(' ', event.charIndex);

      var nextWord = event.currentTarget.text.slice(boundaryStart, boundaryEnd);
      var nextClass = nextWord.match(/\w+/g).join('');
      var nextElem = intro.querySelector(`.${nextClass}-spoken`);
      if (nextElem) {
        nextElem.classList.remove(nextElem.classList);
      }
    };

    synth.speak(utterance);
  }
} else {
  document.querySelector('.cookies').remove();
}
