const pieces={
 A:[[1,1]],
 B:[[1,0,1,0],[0,1,0,1]],
 C:[[0,1,0,1],[1,0,1,0]],
 D:[[1]],
 E:[[1],[1],[1]],
 F:[[1,1,1],[0,1,1],[0,0,1]],
 G:[[1,1,1],[0,0,1],[0,0,1]],
 H:[[1,1,1],[1,0,1],[0,0,1],[1,1,1]],
 I:[[1,1,1,1]],
 J:[[1,0,0],[0,1,0],[0,0,1],[0,1,0],[1,0,0]],
 K:[[1,0],[0,1]],
 L:[[0,0,1],[1,1,1]],
 M:[[0,1,1],[1,1,1],[1,1,0]],
 O:[[1,1],[1,1]],
 S:[[0,1,1],[1,1,0]],
 T:[[0,1,0],[1,1,1]],
 Z:[[1,1,0],[0,1,1]]
};
const colors={
 A:'#ff0095',
 B:'#00bfff',
 C:'#ffbb00',
 D:'#02795b',
 E:'#2b7902',
 F:'#eb6c56',
 G:'#6b9f91',
 H:'#61a382',
 I:'#00f7ff',
 J:'#0066ff',
 K:'#fd33e7',
 L:'#ff8800',
 M:'#28e0b6',
 O:'#ffe600',
 S:'#00ff88',
 T:'#c400ff',
 Z:'#ff0044'
};
let sb=null,authUser=null,myProfile=null,channel=null,queueChannel=null,queueTimer=null,roomId='',playerId=crypto.randomUUID(),playerName='PLAYER',opponentId=null,opponentUserId=null,opponentName='OPPONENT',isHost=false,started=false,finished=false,gameMode='solo',onlineKind='',cpuMode=false,cpuClock=0,resultRecorded=false,remote={board:Array.from({length:ROWS},()=>Array(COLS).fill(0)),score:0,lines:0,combo:0,gameOver:false};
let board,current,next,hold=null,x=3,y=0,score=0,combo=0,
linesCleared=0,level=1,lockTimer=0,
dropInterval=800,dropCounter=0,lastTime=0,
holdUsed=false,lastMoveRotate=false,
particles=[],shockwaves=[],lasers=[],
effectTimer=0,effectText='',gameOver=false,
paused=false,backToBack=false,lastNet=0,sendTimer=0;
const canvas=$('game'),ctx=canvas.getContext('2d'),enemyCanvas=$('enemyGame'),enemyCtx=enemyCanvas.getContext('2d'),nextCtx=$('next').getContext('2d'),holdCtx=$('hold').getContext('2d');
function status(id,msg){$(id).textContent=msg}
function setView(view){$('titleScreen').style.display=view==='title'?'flex':'none';$('accountScreen').style.display=view==='account'?'block':'none';$('onlineMenu').style.display=view==='online'?'flex':'none';$('lobby').style.display=view==='lobby'?'block':'none';$('gameArea').style.display=view==='game'?'block':'none'}
/*
function randomPiece(){
 const keys=Object.keys(pieces);
 const name=keys[Math.floor(Math.random()*keys.length)];
 return {name,shape:pieces[name].map(r=>[...r])};
}*/

// 全15種類のミノを出現対象にする
const STANDARD_PIECES = [
  'A', 'B', 'C', 'D', 'E','F', 'G', 'H', 'I', 'J', 'K','L','M','O', 'S', 'T', 'Z'
];

// 15-bag方式
let pieceBag = [];

function randomPiece() {
  if (pieceBag.length === 0) {
    pieceBag = [...STANDARD_PIECES];

    // シャッフル
    for (let i = pieceBag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieceBag[i], pieceBag[j]] = [pieceBag[j], pieceBag[i]];
    }
  }

  const name = pieceBag.pop();

  return {
    name,
    shape: pieces[name].map(row => [...row])
  };
}
