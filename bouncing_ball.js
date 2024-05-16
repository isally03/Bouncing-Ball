var sWidth;
var sHeight;
var canvas;
var ctx;

var ballX;
var ballY;
var velocityX;
var velocityY;
var dx;
var dy;
var ballRadius;
var ballColor;

var padX;
var padY;
var padHeight;
var padWidth;

var brickLength;
var brickMargin;
var brickSideMargin;
var brickTopMargin;
var brickBottomMargin;
var brickRowCountMax;
var brickColumnCountMax;
var bricks = [];
var brickRate;
var brickCnt;

var ball;
var ballMoveSpeed;
var timebar;
var timebarHeight;
var timePerSecond;
var timeX;

var currentStage;

window.onload = function () {
	mainMenu();
	$("#startGame").on("click", gameStart);
	$("challenge").on("click", challenge);
	$("#profiles").on("click", profiles);
	$("#exitGame").on("click", exitGame);
	$("#settings").on("click", settings);
}

function mainMenu() {
	var mainMenu = document.getElementById("mainMenu");

	var startGame = document.createElement("input");
	startGame.type = "button";
	startGame.id = "startGame";
	startGame.value = "게임시작";
	mainMenu.appendChild(startGame);

	var challenge = document.createElement("input");
	challenge.type = "button";
	challenge.id = "challenge";
	challenge.value = "도전 과제";
	mainMenu.appendChild(challenge);

	var profiles = document.createElement("input");
	profiles.type = "button";
	profiles.id = "profiles";
	profiles.value = "프로필";
	mainMenu.appendChild(profiles);

	var exitGame = document.createElement("input");
	exitGame.type = "button";
	exitGame.id = "exitGame";
	exitGame.value = "게임종료";
	mainMenu.appendChild(exitGame);
}

function gameStart() {
	$("#mainMenu").hide();
	$("#settings_Icon").hide();
	currentStage = 1;
	stage(currentStage);
}

function challenge() {
	// 작성 요함
}

function profiles() {
	// 작성 요함
}

function exitGame() {
	// 작성 요함
}

function settings() {
	// 작성 요함
}

function gameInit() {
	sWidth = document.documentElement.clientWidth;
	sHeight = document.documentElement.clientHeight;
	ballX = sWidth / 2;
	ballY = sHeight - 100;
	velocityX = 5;
	velocityY = 5;
	dx = 5;
	dy = -5;
	ballRadius = 15;
	ballColor = "black";
	ballMoveSpeed = 10;

	padX = sWidth / 2;
	padY = sHeight - 40;
	padHeight = 10;
	padWidth = 150;

	canvas = document.getElementById("myCanvas");
	canvas.width = sWidth;
	canvas.height = sHeight;
	canvas.hidden = false;

	brickMargin = 10;
	brickRowCountMax = 12;
	brickColumnCountMax = 30;
	brickLength = (sWidth - 2 * brickMargin) / (brickColumnCountMax + 1);
	brickSideMargin = brickMargin + brickLength / 2;
	brickTopMargin = brickMargin + brickLength / 2;
	brickRate = 10;

	timeX = 0;
	timebarHeight = 20;
}

function makeCanvas() {
	ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, sWidth, sHeight);

	canvas.style.backgroundImage = "url(\"background.jpg\")";
	canvas.style.backgroundRepeat = "no-repeat";
	canvas.style.backgroundSize = "cover";
	$("#myCanvas").mousemove(function (e) {
		ctx.save();
		ctx.translate(padX, padY);
		ctx.clearRect(-padWidth / 2, -padHeight / 2, padWidth + 1, padHeight);
		ctx.restore();
		if (e.pageX < padWidth / 2)
			padX = padWidth / 2;
		else if (e.pageX + padWidth / 2 > sWidth)
			padX = sWidth - padWidth / 2;
		else
			padX = e.pageX;
		drawPad();
	});
}

function draw() {
	ctx.clearRect(0, 0, sWidth, sHeight);
	drawBall();
	drawPad();
	drawTimeBar();
}

function drawBall() {
	ctx.save();
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2); //(x좌표,y좌표,원 반지름, 시작각도, 끝각도, 그리는 방향)
	ctx.fillStyle = ballColor;
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}

function drawPad() {
	ctx.save();
	ctx.translate(padX, padY);
	ctx.fillRect(-padWidth / 2, -padHeight / 2, padWidth, padHeight);
	ctx.restore();
}

function drawTimeBar() {
	ctx.save();
	ctx.fillStyle = "#3CB371";
	ctx.fillRect(0, sHeight - timebarHeight, sWidth, timebarHeight);
	ctx.restore();
	timebar = setInterval(removeTimeBar, 1000);
}

function removeTimeBar() {
	ctx.save();
	ctx.clearRect(timeX, sHeight - timebarHeight, sWidth / timePerSecond, timebarHeight);
	timeX += sWidth / timePerSecond;
	if (timeX >= sWidth)
		gameOver();
	ctx.restore();
}

function drawBricks() { // state == 1 : 진짜 벽돌, state == 2 : 가짜 벽돌
	for (var i = 0; i < brickRowCountMax; i++) {
		var y = brickTopMargin + brickLength * i;
		for (var j = 0; j < brickColumnCountMax; j++) {
			var x = brickSideMargin + brickLength * j;
			if (bricks[i][j] != 0) {
				ctx.save();
				ctx.fillStyle = "gray";
				ctx.fillRect(x, y, brickLength, brickLength);
				ctx.fillStyle = "black";
				ctx.strokeRect(x, y, brickLength, brickLength);
				ctx.restore();
			}
		}
	}
}

function breakBrick() {
	for (var i = 0; i < 2; i++) {
		var idxY = Math.floor((ballY - brickTopMargin) / brickLength) + i;
		var y = idxY * brickLength + brickTopMargin;
		for (var j = 0; j < 2; j++) {
			var idxX = Math.floor((ballX - brickSideMargin) / brickLength) + j;
			var x = idxX * brickLength + brickSideMargin;
			if (idxY < brickRowCountMax && idxY >= 0 && idxX < brickColumnCountMax && idxX >= 0 && bricks[idxY][idxX] == 1) {
				if (dx > 0 && ballX < x && ballX + ballRadius > x && ballY > y && ballY < y + brickLength) { // LeftSide
					dx = -dx;
					bricks[idxY][idxX] = 0;
				}
				else if (dy > 0 && ballY < y && ballY + ballRadius > y && ballX > x && ballX < x + brickLength) { // TopSide
					dy = -dy;
					bricks[idxY][idxX] = 0;
				}
				else if (dx < 0 && ballX > x && ballX - ballRadius < x + brickLength && ballY > y && ballY < y + brickLength) { // RightSide
					dx = -dx;
					bricks[idxY][idxX] = 0;
				}
				else if (dy < 0 && ballY > y && ballY - ballRadius < y + brickLength && ballX > x && ballX < x + brickLength) { // BottomSide
					dy = -dy;
					bricks[idxY][idxX] = 0;
				}

				if (bricks[idxY][idxX] == 0) {
					brickCnt--;
					ctx.save();
					ctx.clearRect(x - 1, y - 1, brickLength + 2, brickLength + 2);
					ctx.restore();
					return;
				}
			}
		}
	}
}

function movBall() {
	ctx.save();
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius + 1, 0, Math.PI * 2);
	ctx.closePath();
	ctx.clip();
	ctx.clearRect(ballX - ballRadius - 1, ballY - ballRadius - 1, ballRadius * 2 + 2, ballRadius * 2 + 2);
	ctx.restore();
	breakBrick();
	drawBricks();
	if (ballX < ballRadius || ballX > sWidth - ballRadius)
		dx = -dx;
	if (ballY > sHeight - ballRadius) {
		gameOver();
		return;
	}
	if ((dy > 0 && ballY >= padY - padHeight / 2 - ballRadius && ballY <= padY + padHeight / 2 && ballX > padX - padWidth / 2 && ballX < padX + padWidth / 2) || ballY < ballRadius)
		dy = -dy;
	ballX += dx;
	ballY += dy;
	drawBall();
	drawPad();
	if (brickCnt == 0) {
		clearInterval(ball);
		clearInterval(timebar);
		answer();
		return;
	}
}

function stage(n) {
	if (n >= 4) endings();
	else {
		gameInit();
		makeCanvas();
		ball = setInterval(movBall, ballMoveSpeed);
		brickCnt = 0;
		if (n == 1) stageOne();
		else if (n == 2) stageTwo();
		else stageThree();
		draw();
		makeRandomBricks();
		drawBricks();
	}
}

function answer() {
	alert("Stage " + currentStage + "clear!");
	currentStage++;
	stage(currentStage);
}

function gameOver() {
	clearInterval(ball);
	clearInterval(timebar);
	canvas.hidden = true;
	$("#mainMenu").show();
	$("#settings_Icon").show();
}

function endings() {
	alert("Clear!");
}

function makeRandomBricks() {
	for (var i = 0; i < brickRowCountMax; i++) {
		for (var j = 0; j < brickColumnCountMax; j++) {
			if (bricks[i][j] == 0) {
				var randomInt = Math.floor(Math.random() * brickRate);
				if (randomInt == 0) {
					bricks[i][j] = 1;
					brickCnt++;
				}
			}
		}
	}
}

function stageOne() {
	timePerSecond = 180;
	bricks[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[4] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[5] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[6] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[7] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[8] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[9] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[10] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[11] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
}

function stageTwo() {
	timePerSecond = 150;
	bricks[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[4] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[5] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[6] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[7] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[8] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[9] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[10] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[11] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
}

function stageThree() {
	timePerSecond = 120;
	bricks[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[4] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[5] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[6] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[7] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[8] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[9] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[10] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
	bricks[11] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
}