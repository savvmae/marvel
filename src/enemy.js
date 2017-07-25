

// var upNextDiv = document.querySelector('.next');
// var previousDiv = document.querySelector('.previous');
// var nextThum = document.querySelector('.next-thumb');
// var cpu1;
// var cpu2;
// var cpu3;
// var cpu4;
// var cpu5;
// var allCPUS = [];
// var upNext;
// var previous;
// export var cpuBattle;

// // set up dom for previous and next characters
// function buildEnemyCycle(prev, next) {

//   if (prev && next) {
//     upNextDiv.textContent = "Up Next: " + next[0];
//     nextThum.style.backgroundImage = 'url(' + next[4] + ')';
//     previousDiv.textContent = "Previous: " + previous[0];
//   }
//   else if (next) {
//     upNextDiv.textContent = "Up Next: " + next[0];
//     nextThum.style.backgroundImage = 'url(' + next[4] + ')';
//   }
//   else if (!next) {
//     upNextDiv.textContent = ""
//     nextThum.style.backgroundImage = 'none';
//     previousDiv.textContent = "Previous: " + previous[0];
//   }
// }

// // move to next enemy in list
// function selectNextEnemy() {
//   if (hasRunInit) {
//     for (var i = 0; i < allCPUS.length; i++) {
//       if (cpuInfoDiv.textContent === allCPUS[i][0]) {
//         cpuBattle = allCPUS[i + 1];
//         upNext = allCPUS[i + 2];
//         previous = allCPUS[i];
//         buildEnemyCycle(previous, upNext);
//       }
//       else if (cpuInfoDiv.textContent === allCPUS[allCPUS.length - 1][0]) {
//         location.assign("/");
//       }
//     }
//   }
// }

// // build out cpu characters
// export function cpuChars() {
//   hasRunInit = true;
//   var allCPUCharsString = localStorage.cpuComplete.split(",");
//   cpu1 = allCPUCharsString.slice(0, 5);
//   cpu2 = allCPUCharsString.slice(5, 10);
//   cpu3 = allCPUCharsString.slice(10, 15);
//   cpu4 = allCPUCharsString.slice(15, 20);
//   cpu5 = allCPUCharsString.slice(20, 25);
//   allCPUS.push(cpu1, cpu2, cpu3, cpu4, cpu5);

//   cpuBattle = cpu1;
//   upNext = cpu2;
//   buildEnemyCycle(previous, upNext);
//   buildBattle();

// }