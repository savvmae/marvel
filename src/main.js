import battle from './initialize.js';

var API_URL = 'https://akabab.github.io/superhero-api/api/all.json';
var FALLBACK_URL = './characters-fallback.json';

//variables for index
var main = document.querySelector('.choose-char-main');
var filteredResults = [];
var videoContainer = document.querySelector('.video-container');
var video = document.querySelector('video');
var skipButton = document.querySelector('.skip-intro');
var introDone = false;

//powerstats come back 0-100, the battle screen expects the original ranges
function scaleStat(value, min, max) {
  return min + Math.round((value / 100) * (max - min));
}

//keeps a character only if it can survive the comma-split in localStorage
function usable(c) {
  var stats = c.powerstats;
  return c.name.indexOf(',') === -1 && stats &&
    typeof stats.durability === 'number' &&
    typeof stats.strength === 'number' &&
    typeof stats.combat === 'number';
}

function toRoster(records) {
  return records.map(function (c) {
    return [
      c.name,
      scaleStat(c.powerstats.durability, 15, 43),
      scaleStat(c.powerstats.strength, 3, 8),
      scaleStat(c.powerstats.combat, 3, 8),
      c.image,
    ];
  });
}

//live api first, bundled snapshot if it's unreachable
function loadCharacters() {
  return fetch(API_URL)
    .then(function (res) {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then(function (all) {
      var marvel = all
        .filter(function (c) {
          return c.biography && c.biography.publisher === 'Marvel Comics';
        })
        .map(function (c) {
          return { name: c.name, powerstats: c.powerstats, image: c.images.md };
        })
        .filter(usable);
      if (!marvel.length) throw new Error('no marvel characters');
      return toRoster(marvel);
    })
    .catch(function () {
      return fetch(FALLBACK_URL)
        .then(function (res) { return res.json(); })
        .then(function (records) { return toRoster(records.filter(usable)); });
    });
}

const getCharacters = function () {
  startIntro();
  loadCharacters().then(newChar);
};

//browsers block autoplay with sound, so the intro is muted and every exit
//route is wired up: it ended, it failed, or the visitor skipped it
function startIntro() {
  if (!video) return;

  video.addEventListener('ended', removeVideoPlaySong);
  video.addEventListener('error', removeVideoPlaySong);
  if (skipButton) skipButton.addEventListener('click', removeVideoPlaySong);

  var started = video.play();
  if (started && typeof started.catch === 'function') {
    started.catch(removeVideoPlaySong);
  }
}

if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
  getCharacters();
}
if (window.location.pathname === '/battle.html') {
  battle();
}

//removes intro video, safe to call more than once
function removeVideoPlaySong() {
  if (introDone) return;
  introDone = true;
  if (video) video.remove();
  if (videoContainer) videoContainer.remove();
  loopSong();
}

// creates background song and loops
function loopSong() {
  if (!main) return;
  var backgroundSong = document.createElement('audio');
  backgroundSong.setAttribute('src', './audio/choose-character-song.mp3');
  backgroundSong.setAttribute('autoplay', 'autoplay');
  main.appendChild(backgroundSong);
  backgroundSong.loop = true;
  //blocked unless the visitor has interacted with the page, which is fine
  var started = backgroundSong.play();
  if (started && typeof started.catch === 'function') {
    started.catch(function () {});
  }
}

//creates random character **computer
function randomCharGenerator(results) {
  var cpuStats = []
  for (var i = 0; i < 5; i++) {
    cpuStats.push(results[Math.floor(Math.random() * results.length)]);
  }
  localStorage.cpuComplete = cpuStats.toString();
}

//creates new characters and puts them on page.
function newChar(roster) {
  filteredResults = roster;

  for (var k = 0; k < filteredResults.length; k++) {
    var charContainer = document.createElement('div');
    var charInfo = document.createElement('div');
    var charButton = document.createElement('button');
    var charName = document.createElement('p');
    var charHealth = document.createElement('p');
    var charHit = document.createElement('p');
    var charKick = document.createElement('p');

    charContainer.setAttribute('class', 'char-container');
    charInfo.setAttribute('class', 'char-info');
    charButton.setAttribute('class', 'char-button');
    charButton.style.backgroundImage = 'url(' + filteredResults[k][4] + ')';
    charName.setAttribute('class', 'name text-fire');
    charHealth.setAttribute('class', 'stats top');
    charHit.setAttribute('class', 'stats middle');
    charKick.setAttribute('class', 'stats bottom');

    charName.textContent = filteredResults[k][0] + "!";
    charHealth.textContent = "Health: " + filteredResults[k][1];
    charHit.textContent = "Hit Damage: " + filteredResults[k][2];
    charKick.textContent = "Kick Damage: " + filteredResults[k][3];

    charButton.setAttribute('value', [k]);
    charInfo.appendChild(charButton);
    charInfo.appendChild(charName);
    charInfo.appendChild(charHealth);
    charInfo.appendChild(charHit);
    charInfo.appendChild(charKick);
    charContainer.appendChild(charInfo); main.appendChild(charContainer);

    var allButtons = document.querySelectorAll('button');
  }
  randomCharGenerator(filteredResults);

  //loops through 'buttons' and assigns event listener, calls handleClick when clicked
  for (var j = 0; j < allButtons.length; j++) {
    allButtons[j].addEventListener("click", handleClick);
  }

  // stops choose character song
  var stopButton = document.getElementById('stopButton');
  stopButton.addEventListener('click', stopMusic);

  function stopMusic() {
    var sounds = document.getElementsByTagName('audio');
    if (stopButton.value === "Party Pooper Button") {
      for (i = 0; i < sounds.length; i++) sounds[i].pause();
      stopButton.value = "Start party";
    } else {
      sounds[0].play();
      stopButton.value = "Party Pooper Button";
    }
  };
}

//function for click on character, sets stats for character
function handleClick(event) {
  var playerStatsComplete = filteredResults[event.target.value];
  localStorage.playerComplete = playerStatsComplete.toString();
  location.assign("./battle.html");
}
