(() => {
  // src/randomizer.js
  function randomizer(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // src/audio.js
  var stageSong;
  var stageSongs = [
    "./audio/stage-song1.mp3",
    "./audio/stage-song2.mp3",
    "./audio/stage-song3.mp3",
    "./audio/stage-song4.mp3"
  ];
  var fightSnippets = [
    "./audio/attack1.wav",
    "./audio/attack2.wav",
    "./audio/attack3.wav",
    "./audio/attack4.wav",
    "./audio/attack5.wav",
    "./audio/attack6.wav",
    "./audio/attack7.wav",
    "./audio/attack8.wav",
    "./audio/attack9.wav",
    "./audio/attack10.wav"
  ];
  function stageSongRet(idx) {
    var snippet = randomizer(stageSongs);
    var clip = new Audio(snippet);
    return clip;
  }
  function pauseSong(song) {
    song.pause();
    song.currentTime = 0;
  }
  function playStageSong() {
    if (stopButton2.value === "Party Pooper Button") {
      stageSong = stageSongRet();
      stageSong.play();
      stageSong.loop = true;
    }
  }
  function stopMusic2() {
    if (stopButton2.value === "Party Pooper Button") {
      stageSong.volume = 0;
      stopButton2.value = "Start party";
    } else {
      stageSong.volume = 1;
      stopButton2.value = "Party Pooper Button";
    }
  }
  function playRandomSnippet() {
    if (stopButton2.value === "Party Pooper Button") {
      var snippet = randomizer(fightSnippets);
      var clip = new Audio(snippet);
      clip.play();
    }
  }

  // src/background.js
  var battleMain = document.querySelector("main");
  function changeBackground() {
    var backgroundClasses = [
      "stage1",
      "stage2",
      "stage3",
      "stage4",
      "stage5",
      "stage6",
      "stage7",
      "stage8",
      "stage9",
      "stage10",
      "stage11"
    ];
    var currentBackGround = backgroundClasses[Math.floor(Math.random() * 11)];
    battleMain.setAttribute("class", "battle-main " + currentBackGround);
  }

  // src/initialize.js
  var playerDiv = document.querySelector(".player");
  var playerImgDiv = document.querySelector(".player-img");
  var playerInfoDiv = document.querySelector(".player-info");
  var playerHBar = document.querySelector(".playerBar");
  var cpuDiv = document.querySelector(".cpu");
  var cpuImgDiv = document.querySelector(".cpu-img");
  var cpuInfoDiv = document.querySelector(".cpu-info");
  var cpuHB = document.querySelector(".cpuBar");
  var buttonWrapper = document.querySelector(".button-wrapper");
  var playerSpecialBar = document.querySelector(".playerSpecialBar");
  var cpuSpecialBar = document.querySelector(".cpu-special-bar");
  var bannerElement = document.createElement("div");
  var stageNumberDiv = document.querySelector(".stage");
  var stageNumber = 0;
  var playerBattleH;
  var playerH100;
  var playerBattleD;
  var playerBattleD2;
  var cpuBattle;
  var cpuBattleH;
  var cpuH100;
  var cpuBattleD;
  var cpuBattleD2;
  var stopButton2;
  var battleMain2 = document.querySelector("main");
  var hitButton = document.querySelector(".hit");
  var kickButton = document.querySelector(".kick");
  var upNextDiv = document.querySelector(".next");
  var previousDiv = document.querySelector(".previous");
  var nextThum = document.querySelector(".next-thumb");
  var tallyWin = document.querySelector(".tally-win");
  var tallyLose = document.querySelector(".tally-lose");
  var playerImg = document.createElement("img");
  var cpuImg = document.createElement("img");
  var cpu1;
  var cpu2;
  var cpu3;
  var cpu4;
  var cpu5;
  var allCPUS = [];
  var upNext;
  var previous;
  var hasRunInit;
  function buildEnemyCycle(prev, next) {
    if (prev && next) {
      upNextDiv.textContent = "Up Next: " + next[0];
      nextThum.style.backgroundImage = "url(" + next[4] + ")";
      previousDiv.textContent = "Previous: " + previous[0];
    } else if (next) {
      upNextDiv.textContent = "Up Next: " + next[0];
      nextThum.style.backgroundImage = "url(" + next[4] + ")";
    } else if (!next) {
      upNextDiv.textContent = "";
      nextThum.style.backgroundImage = "none";
      previousDiv.textContent = "Previous: " + previous[0];
    }
  }
  function selectNextEnemy() {
    if (hasRunInit) {
      for (var i2 = 0; i2 < allCPUS.length; i2++) {
        if (cpuInfoDiv.textContent === allCPUS[i2][0]) {
          cpuBattle = allCPUS[i2 + 1];
          upNext = allCPUS[i2 + 2];
          previous = allCPUS[i2];
          buildEnemyCycle(previous, upNext);
        } else if (cpuInfoDiv.textContent === allCPUS[allCPUS.length - 1][0]) {
          location.assign("/");
        }
      }
    }
  }
  function cpuChars() {
    hasRunInit = true;
    var allCPUCharsString = localStorage.cpuComplete.split(",");
    cpu1 = allCPUCharsString.slice(0, 5);
    cpu2 = allCPUCharsString.slice(5, 10);
    cpu3 = allCPUCharsString.slice(10, 15);
    cpu4 = allCPUCharsString.slice(15, 20);
    cpu5 = allCPUCharsString.slice(20, 25);
    allCPUS.push(cpu1, cpu2, cpu3, cpu4, cpu5);
    cpuBattle = cpu1;
    upNext = cpu2;
    buildEnemyCycle(previous, upNext);
    buildBattle();
  }
  function buildBattle() {
    selectNextEnemy();
    stageNumber += 1;
    stageNumberDiv.textContent = "Stage " + stageNumber;
    cpuBattleH = cpuBattle[1];
    cpuH100 = cpuBattleH;
    cpuBattleD = cpuBattle[2];
    cpuBattleD2 = cpuBattle[3];
    cpuInfoDiv.textContent = cpuBattle[0];
    cpuImg.setAttribute("src", cpuBattle[4]);
    cpuHitCounter = 0;
    specialBar(playerSpecialBar, playerHitCounter);
    specialBar(cpuSpecialBar, cpuHitCounter);
    removeSpecialButton();
    changeBackground();
    bannerElement.remove();
    var playerBattle = localStorage.playerComplete.split(",");
    playerBattleH = playerBattle[1];
    playerH100 = playerBattleH;
    playerBattleD = playerBattle[2];
    playerBattleD2 = playerBattle[3];
    playerInfoDiv.textContent = playerBattle[0];
    playerImg.setAttribute("src", playerBattle[4]);
    playerImg.setAttribute("class", "black-border-fifty");
    playerImgDiv.appendChild(playerImg);
    cpuImg.setAttribute("class", "black-border-fifty");
    cpuImgDiv.appendChild(cpuImg);
    cpuHB.setAttribute("style", "width: 100%");
    cpuHB.setAttribute("class", "progress-bar cpuBar");
    playerHBar.setAttribute("style", "width: 100%");
    playerHBar.setAttribute("class", "progress-bar playerBar");
    hitButton.addEventListener("click", battle);
    kickButton.addEventListener("click", battle);
    stopButton2 = document.getElementById("stopButton2");
    stopButton2.addEventListener("click", stopMusic2);
    playStageSong();
  }
  var playerHitCounter = 0;
  var cpuHitCounter = 0;
  var specialButton = document.createElement("button");
  function specialButtonCreator() {
    if (buttonWrapper.contains(specialButton)) {
      return;
    } else {
      specialButton.setAttribute("class", "special glow");
      specialButton.textContent = "Special";
      specialButton.addEventListener("click", battle);
      buttonWrapper.appendChild(specialButton);
    }
  }
  function removeSpecialButton() {
    playerHitCounter = 0;
    specialBar(playerSpecialBar, playerHitCounter);
    if (buttonWrapper.contains(specialButton)) {
      buttonWrapper.removeChild(specialButton);
    } else {
      return;
    }
  }
  function determineHealthPercent(current, constant, bar) {
    var healthPercent = current / constant * 100;
    changeProgressBar(bar, healthPercent);
  }
  function changeProgressBar(bar, healthPercent) {
    bar.setAttribute("style", "width: " + healthPercent + "%");
    if (healthPercent <= 50 && healthPercent >= 15) {
      bar.className += " health-warning";
    } else if (healthPercent <= 15) {
      bar.className += " health-danger";
    }
  }
  function specialBar(bar, count) {
    if (count === 1) {
      bar.setAttribute("style", "width: 33%");
    } else if (count === 2) {
      bar.setAttribute("style", "width: 66%");
    } else if (count === 3) {
      bar.setAttribute("style", "width: 100%");
      bar.className += " glow";
    } else if (count === 0) {
      bar.setAttribute("style", "width: 0%");
      bar.classList.remove("glow");
    }
  }
  function battle() {
    if (cpuBattleH > 0 && playerBattleH > 0) {
      playerHitCounter += 1;
      specialBar(playerSpecialBar, playerHitCounter);
      if (playerHitCounter > 0 && playerHitCounter % 3 === 0) {
        specialButtonCreator();
      }
      if (event.target.className === "hit") {
        playRandomSnippet();
        cpuBattleH -= playerBattleD2;
      } else if (event.target.className === "kick") {
        playRandomSnippet();
        cpuBattleH -= playerBattleD;
      } else if (event.target.className === "special glow") {
        playRandomSnippet();
        cpuBattleH -= playerBattleD * 2;
        removeSpecialButton();
      }
      determineHealthPercent(cpuBattleH, cpuH100, cpuHB);
      playerImg.setAttribute("class", "swing black-border-fifty");
      remSwing(playerImg);
      if (cpuBattleH <= 0) {
        return alertDelay(playerImg);
      }
      cpuAttackDelay();
      if (cpuHitCounter > 0 && cpuHitCounter % 3 === 0) {
        playerBattleH -= cpuBattleD2 * 2;
        cpuHitCounter = 0;
      } else {
        playerBattleH -= cpuBattleD2;
        cpuHitCounter += 1;
      }
      if (playerBattleH <= 0) {
        return alertDelay(cpuImg);
      }
    }
  }
  function remSwing(img) {
    setTimeout(function() {
      img.removeAttribute("class", "swing");
      img.setAttribute("class", "black-border-fifty");
    }, 500);
  }
  function cpuAttackDelay() {
    setTimeout(function() {
      playRandomSnippet();
      specialBar(cpuSpecialBar, cpuHitCounter);
      cpuImg.setAttribute("class", "r-swing black-border-fifty");
      determineHealthPercent(playerBattleH, playerH100, playerHBar);
      remSwing(cpuImg);
    }, 500);
  }
  function banner(message) {
    bannerElement.textContent = message;
    bannerElement.setAttribute("class", "banner victory text-fire");
    battleMain2.appendChild(bannerElement);
  }
  var winSong = new Audio("./audio/congrats-song.mp3");
  var loseSong = new Audio("./audio/lose-song.mp3");
  function alertDelay(winner) {
    setTimeout(function() {
      if (winner === playerImg) {
        var cheer = new Audio("./audio/win.mp3");
        tallyWin.textContent += " I";
        pauseSong(stageSong);
        if (stopButton2.value === "Party Pooper Button") {
          cheer.play();
          winSong.play();
        }
        banner("YOU WIN!!!");
        winner.setAttribute("class", "spin black-border-fifty");
        delayReset();
      } else {
        var gameOver = new Audio("./audio/game-over.wav");
        tallyLose.textContent += " I";
        pauseSong(stageSong);
        if (stopButton2.value === "Party Pooper Button") {
          gameOver.play();
          loseSong.play();
        }
        banner("YOU LOSE!!!");
        winner.setAttribute("class", "spin black-border-fifty");
        delayReset();
      }
    }, 1500);
  }
  function delayReset() {
    setTimeout(function() {
      pauseSong(winSong);
      pauseSong(loseSong);
      buildBattle();
    }, 5e3);
  }

  // src/main.js
  var API_URL = "https://akabab.github.io/superhero-api/api/all.json";
  var FALLBACK_URL = "./characters-fallback.json";
  var main = document.querySelector(".choose-char-main");
  var filteredResults = [];
  var videoContainer = document.querySelector(".video-container");
  var video = document.querySelector("video");
  var skipButton = document.querySelector(".skip-intro");
  var introDone = false;
  function scaleStat(value, min, max) {
    return min + Math.round(value / 100 * (max - min));
  }
  function usable(c) {
    var stats = c.powerstats;
    return c.name.indexOf(",") === -1 && stats && typeof stats.durability === "number" && typeof stats.strength === "number" && typeof stats.combat === "number";
  }
  function toRoster(records) {
    return records.map(function(c) {
      return [
        c.name,
        scaleStat(c.powerstats.durability, 15, 43),
        scaleStat(c.powerstats.strength, 3, 8),
        scaleStat(c.powerstats.combat, 3, 8),
        c.image
      ];
    });
  }
  function loadCharacters() {
    return fetch(API_URL).then(function(res) {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    }).then(function(all) {
      var marvel = all.filter(function(c) {
        return c.biography && c.biography.publisher === "Marvel Comics";
      }).map(function(c) {
        return { name: c.name, powerstats: c.powerstats, image: c.images.md };
      }).filter(usable);
      if (!marvel.length) throw new Error("no marvel characters");
      return toRoster(marvel);
    }).catch(function() {
      return fetch(FALLBACK_URL).then(function(res) {
        return res.json();
      }).then(function(records) {
        return toRoster(records.filter(usable));
      });
    });
  }
  var getCharacters = function() {
    startIntro();
    loadCharacters().then(newChar);
  };
  function startIntro() {
    if (!video) return;
    video.addEventListener("ended", removeVideoPlaySong);
    video.addEventListener("error", removeVideoPlaySong);
    if (skipButton) skipButton.addEventListener("click", removeVideoPlaySong);
    var started = video.play();
    if (started && typeof started.catch === "function") {
      started.catch(removeVideoPlaySong);
    }
  }
  if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
    getCharacters();
  }
  if (window.location.pathname === "/battle.html") {
    cpuChars();
  }
  function removeVideoPlaySong() {
    if (introDone) return;
    introDone = true;
    if (video) video.remove();
    if (videoContainer) videoContainer.remove();
    loopSong();
  }
  function loopSong() {
    if (!main) return;
    var backgroundSong = document.createElement("audio");
    backgroundSong.setAttribute("src", "./audio/choose-character-song.mp3");
    backgroundSong.setAttribute("autoplay", "autoplay");
    main.appendChild(backgroundSong);
    backgroundSong.loop = true;
    var started = backgroundSong.play();
    if (started && typeof started.catch === "function") {
      started.catch(function() {
      });
    }
  }
  function randomCharGenerator(results) {
    var cpuStats = [];
    for (var i2 = 0; i2 < 5; i2++) {
      cpuStats.push(results[Math.floor(Math.random() * results.length)]);
    }
    localStorage.cpuComplete = cpuStats.toString();
  }
  function newChar(roster) {
    filteredResults = roster;
    for (var k = 0; k < filteredResults.length; k++) {
      var charContainer = document.createElement("div");
      var charInfo = document.createElement("div");
      var charButton = document.createElement("button");
      var charName = document.createElement("p");
      var charHealth = document.createElement("p");
      var charHit = document.createElement("p");
      var charKick = document.createElement("p");
      charContainer.setAttribute("class", "char-container");
      charInfo.setAttribute("class", "char-info");
      charButton.setAttribute("class", "char-button");
      charButton.style.backgroundImage = "url(" + filteredResults[k][4] + ")";
      charName.setAttribute("class", "name text-fire");
      charHealth.setAttribute("class", "stats top");
      charHit.setAttribute("class", "stats middle");
      charKick.setAttribute("class", "stats bottom");
      charName.textContent = filteredResults[k][0] + "!";
      charHealth.textContent = "Health: " + filteredResults[k][1];
      charHit.textContent = "Hit Damage: " + filteredResults[k][2];
      charKick.textContent = "Kick Damage: " + filteredResults[k][3];
      charButton.setAttribute("value", [k]);
      charInfo.appendChild(charButton);
      charInfo.appendChild(charName);
      charInfo.appendChild(charHealth);
      charInfo.appendChild(charHit);
      charInfo.appendChild(charKick);
      charContainer.appendChild(charInfo);
      main.appendChild(charContainer);
      var allButtons = document.querySelectorAll("button");
    }
    randomCharGenerator(filteredResults);
    for (var j = 0; j < allButtons.length; j++) {
      allButtons[j].addEventListener("click", handleClick);
    }
    var stopButton = document.getElementById("stopButton");
    stopButton.addEventListener("click", stopMusic);
    function stopMusic() {
      var sounds = document.getElementsByTagName("audio");
      if (stopButton.value === "Party Pooper Button") {
        for (i = 0; i < sounds.length; i++) sounds[i].pause();
        stopButton.value = "Start party";
      } else {
        sounds[0].play();
        stopButton.value = "Party Pooper Button";
      }
    }
    ;
  }
  function handleClick(event2) {
    var playerStatsComplete = filteredResults[event2.target.value];
    localStorage.playerComplete = playerStatsComplete.toString();
    location.assign("./battle.html");
  }
})();
