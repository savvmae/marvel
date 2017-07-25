var battleMain = document.querySelector('main');

//chooses random stage background
export default function changeBackground() {
  var backgroundClasses = [
    'stage1',
    'stage2',
    'stage3',
    'stage4',
    'stage5',
    'stage6',
    'stage7',
    'stage8',
    'stage9',
    'stage10',
    'stage11'
  ];
  var currentBackGround = backgroundClasses[Math.floor(Math.random() * 11)];
  battleMain.setAttribute('class', 'battle-main ' + currentBackGround);
}