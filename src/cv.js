let visited = false;

if (document.cookie != '') {
  document.cookie.split(';').forEach(item => {
    item = item.split('=');
    if (item[0].trim() === 'accepted') {
      visited = !!item[1];
    }
  });
}

document.addEventListener('click', event => {
  const bgColour = event.target.getAttribute('data-bg-colour');
  document.documentElement.style.setProperty('--bg-colour', bgColour);
  const fgColour = event.target.getAttribute('data-fg-colour');
  document.documentElement.style.setProperty('--fg-colour', fgColour);
});

if (visited) {
  document.querySelector('.cookies').remove();
} else {
  const cookieAccept = event => {
    if (event.code === 'Enter' || event.type === 'click') {
      document.cookie = 'accepted=true';
      document.querySelector('.cookies').remove();
      document.removeEventListener('keydown', cookieAccept);
    }
  };

  document.querySelector('.accept').addEventListener('click', cookieAccept);
  document.addEventListener('keydown', cookieAccept);

  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    const intro = document.querySelector('.intro');
    const text = `Welcome, this is my CV. If you don't want to hear this again, please press Enter to accept cookies.`;
    const voices = synth.getVoices().filter(voice => voice.lang === navigator.language && voice.default);

    text.split(/\s+/g).forEach(word => {
      const sp = document.createElement('span');
      sp.innerText = word;
      sp.className = `${word.match(/\w+/g).join('')}-spoken`;
      intro.appendChild(sp);
    });

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices[0];
    utterance.onboundary = event => {
      const boundaryStart = event.charIndex;
      const boundaryEnd = event.currentTarget.text.indexOf(' ', event.charIndex);

      const nextWord = event.currentTarget.text.slice(boundaryStart, boundaryEnd);
      const nextClass = nextWord.match(/\w+/g).join('');
      const nextElem = intro.querySelector(`.${nextClass}-spoken`);

      if (nextElem) {
        nextElem.classList.remove(nextElem.classList);
      }
    };

    synth.speak(utterance);
  }
}
