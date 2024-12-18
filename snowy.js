// ロードしたらキャンバスを取得する
window.onload = function () {
    var canvas = document.getElementById("canvas");
  
    canvas.width = 400;
    canvas.height = 600;
  
    ctx = canvas.getContext("2d");
  };
  
  // canvasの大きさ
  var w = 400;
  var h = 600;
  
  // オブジェクトを生成するコンストラクター
  Material = function (posX, posY, radius) {
    this.posX = posX;
    this.posY = posY;
    this.radius = radius;
  };
  
  Material.prototype.display = function (color, posX, posY, x, y) {
    ctx.fillStyle = color;
    ctx.fillRect(posX, posY, x, y);
  };
  
  // 自機を表すオブジェクト（雪だるま）
  var plane = new Material(w / 2, h * 0.95 - 50, 10);
  
  plane.hitJudge = function () {
    for (var i = 0; i < balls.length; i++) {
      var b = balls[i];
      if (
        b.posX >= plane.posX &&
        b.posX <= plane.posX + 40 &&
        b.posY >= plane.posY &&
        b.posY <= plane.posY + 60
      ) {
        return true;
      }
    }
    return false;
  };
  
  // 降ってくる玉関係
  var balls = [];
  var count = 0;
  var timerSeconds = 0;
  
  // 玉の生成
  function makeBalls() {
    var rand = Math.floor(Math.random() * w);
    var newBall = new Material(rand, 0, 5);
    newBall.speed = 3.5;
    balls.push(newBall);
  }
  
  // 玉を描写
  balls.display = function () {
    for (var i = 0; i < balls.length; i++) {
      var b = balls[i];
      b.posY += b.speed;
  
      if (b.posY > h) {
        balls.splice(i, 1);
        i--;
        continue;
      }
  
      ctx.fillStyle = "rgb(255,255,255)";
      ctx.beginPath();
      ctx.arc(b.posX, b.posY, b.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  // キーボード入力
  document.onkeydown = function (e) {
    k = e.keyCode;
    if (k == 37 && plane.posX > 0) plane.posX -= 10;
    if (k == 39 && plane.posX < w - 40) plane.posX += 10;
    if (k == 27) document.location.reload();
  };
  
  // ゲームメインループ
  var gameMainLoop = function () {
    // 背景と地面
    ctx.fillStyle = "rgb(119, 137, 206)"; // 空
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgb(34,139,34)"; // 地面
    ctx.fillRect(0, h - 50, w, 50);
  
    // クリスマスツリーを描画
    drawChristmasTree();
  
    // 10フレームに1回、玉を生成
    if (count % 10 === 0) makeBalls();
  
    // 玉の描写
    balls.display();
  
    // 自機（雪だるま）の描写
    drawSnowman();
  
    count++;
  
    if (plane.hitJudge()) {
      alert("あなたのスコアは " + count + "点です");
      clearInterval(timer);
    }
  
    // スコアとタイマーを画面外に表示
    updateScoreAndTimer();
  };
  
  // 雪だるまを描画
  function drawSnowman() {
    // 下の胴体
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(plane.posX, plane.posY, 40, 40);
    // 頭
    ctx.fillRect(plane.posX + 10, plane.posY - 20, 20, 20);
  
    // ボタン
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(plane.posX + 18, plane.posY + 10, 4, 4);
    ctx.fillRect(plane.posX + 18, plane.posY + 20, 4, 4);
    ctx.fillRect(plane.posX + 18, plane.posY + 30, 4, 4);
  
    // 目
    ctx.fillRect(plane.posX + 14, plane.posY - 15, 4, 4);
    ctx.fillRect(plane.posX + 24, plane.posY - 15, 4, 4);
  }
  
  // クリスマスツリーを描画
  function drawChristmasTree() {
    var treeBaseX = 50;
    var treeBaseY = h - 70;
  
    // ツリー本体
    ctx.fillStyle = "rgb(0,100,0)";
    ctx.beginPath();
    ctx.moveTo(treeBaseX, treeBaseY - 60);
    ctx.lineTo(treeBaseX - 40, treeBaseY);
    ctx.lineTo(treeBaseX + 40, treeBaseY);
    ctx.closePath();
    ctx.fill();
  
    ctx.beginPath();
    ctx.moveTo(treeBaseX, treeBaseY - 100);
    ctx.lineTo(treeBaseX - 30, treeBaseY - 50);
    ctx.lineTo(treeBaseX + 30, treeBaseY - 50);
    ctx.closePath();
    ctx.fill();
  
    // 幹
    ctx.fillStyle = "rgb(100,50,0)";
    ctx.fillRect(treeBaseX - 10, treeBaseY, 20, 20);
  
    // 装飾
    ctx.fillStyle = "rgb(255,0,0)"; // 赤い玉
    ctx.beginPath();
    ctx.arc(treeBaseX - 15, treeBaseY - 70, 5, 0, Math.PI * 2);
    ctx.fill();
  
    ctx.fillStyle = "rgb(255,255,0)"; // 黄色の玉
    ctx.beginPath();
    ctx.arc(treeBaseX + 15, treeBaseY - 80, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // スコアとタイマーを画面外に表示
  function updateScoreAndTimer() {
    var scoreElement = document.getElementById("score");
    var timerElement = document.getElementById("timer");
  
    var minutes = Math.floor(timerSeconds / 60);
    var seconds = timerSeconds % 60;
  
    scoreElement.innerText = "スコア: " + count;
    timerElement.innerText = "タイマー: " + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }
  
  // タイマーをカウントアップ
  setInterval(() => {
    timerSeconds++;
  }, 1000);
  
  // setIntervalでゲームを開始
  var timer = setInterval(gameMainLoop, 50);