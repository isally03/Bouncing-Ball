var sWidth;
var sHeight;
var canvas;
var ctx;

var prevCanvas;
var prevCtx;

var ballX;
var ballY;
var velocityX;
var velocityY;
var dx;
var dy;
var ballRadius;

var padX;
var padY;
var padHeight;
var padWidth;
var difficult;

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

var score;
var timebar;
var timebarHeight;
var timePerSecond;
var timeX;

var red;
var redPerSecond;
var green;
var greenPerSecond;
var blue;
var bluePerSecond;

var currentStage;

var itmes = [];
var itemDropRate = 0.2;

let prevMouseX = 0, prevMouseY = 0;
let paddleSpeed = 0;

var main_BGM;


function gameStart() {
	$("#main_menu").hide();
	$("#myCanvas").show();
	// // 메인화면 음악 추가
	main_BGM = document.getElementById("main_menu_audio");
	main_BGM.pause();

	if (difficult == "easy") brickRate = 100;
	if (difficult == "normal") brickRate = 20;
	if (difficult == "hard") brickRate = 5;

	currentStage = 1;
	score = 0;
	scoreUpdate();
	stage(currentStage);

	backgroundMusic.currentTime = 0;
	backgroundMusic.play();
	gameoverMusic.pause();
}

function mouseMoveSpeed(event) {
	// 마우스 움직임 속도 계산
	const distance = Math.sqrt(
		Math.pow(event.clientX - prevMouseX, 2) +
		Math.pow(event.clientY - prevMouseY, 2)
	);
	const mouseSpeed = distance / 16.67; // 1초당 픽셀 수로 변환

	// 마우스 속도에 비례하여 패드 속도 조절
	paddleSpeed = mouseSpeed * 0.1;

	// 이전 마우스 좌표 업데이트
	prevMouseX = event.clientX;
	prevMouseY = event.clientY;

}

function gameInit() {
	ballX = sWidth / 2;
	ballY = sHeight - 100;
	velocityX = 5;
	velocityY = 5;
	dx = 5;
	dy = -5;
	ballRadius = 15;
	ballMoveSpeed = 10;
	brickCnt = 0;

	combo = 0;

	padX = sWidth / 2;
	padY = sHeight - 40;

	scoreView = document.getElementById("myScore");
	$("#myScore").show();
	$("#myCanvas").show();

	red = 115;
	green = 103;
	blue = 240;

	timeX = 0;
}

function makeCanvas() {
	ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, sWidth, sHeight);

	canvas.style.backgroundImage = `url("${backImage}")`;
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
	redPerSecond = (255 - red) / timePerSecond;
	greenPerSecond = - green / timePerSecond;
	bluePerSecond = - blue / timePerSecond;
	removeTimeBar();
	timebar = setInterval(removeTimeBar, 1000);
}

function removeTimeBar() {
	ctx.save();
	ctx.clearRect(0, sHeight - timebarHeight, sWidth, timebarHeight);
	ctx.fillStyle = makeRGB(red, green, blue);
	ctx.fillRect(timeX, sHeight - timebarHeight, sWidth - timeX, timebarHeight);
	red += redPerSecond;
	green += greenPerSecond;
	blue += bluePerSecond;
	timeX += sWidth / timePerSecond;
	if (timeX > sWidth)
		gameOver();
	ctx.restore();
}

function makeRGB(a, b, c) {
	return "rgb(" + Math.floor(a) + ", " + Math.floor(b) + ", " + Math.floor(c) + ")";
}

function drawAllBricks() { // state == 1 : 진짜 벽돌, state == 2 : 가짜 벽돌
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

function drawBricks(curX, curY) { // state == 1 : 진짜 벽돌, state == 2 : 가짜 벽돌
	for (var i = -1; i < 2; i++) {
		var idxY = Math.floor((curY - brickTopMargin) / brickLength) + i;
		var y = idxY * brickLength + brickTopMargin;
		for (var j = -1; j < 2; j++) {
			var idxX = Math.floor((curX - brickSideMargin) / brickLength) + j;
			var x = idxX * brickLength + brickSideMargin;
			if (idxY < brickRowCountMax && idxY >= 0 && idxX < brickColumnCountMax && idxX >= 0) {
				ctx.save();
				if (bricks[idxY][idxX] != 0) {
					ctx.fillStyle = "gray";
					ctx.fillRect(x, y, brickLength, brickLength);
					ctx.fillStyle = "black";
					ctx.strokeRect(x, y, brickLength, brickLength);
				}
				ctx.restore();
			}
		}
	}
}

function breakBrick() {
	for (var i = 0; i != 2 * Math.sign(dy); i += 1 * Math.sign(dy)) {
		var idxY = Math.floor((ballY - brickTopMargin) / brickLength) + i;
		var y = idxY * brickLength + brickTopMargin;
		for (var j = 0; j != 2 * Math.sign(dx); j += 1 * Math.sign(dx)) {
			var idxX = Math.floor((ballX - brickSideMargin) / brickLength) + j;
			var x = idxX * brickLength + brickSideMargin;
			if (idxY < brickRowCountMax && idxY >= 0 && idxX < brickColumnCountMax && idxX >= 0 && bricks[idxY][idxX] == 1) {
				if (detectCollision(x, y) != null) {
					bricks[idxY][idxX] = 0;
					if (detectCollision(x, y) == "side") { dx = -dx; }
					else { dy = -dy; }

					brickCnt--;
					console.log(brickCnt);
					score += 10;
					combo += 10;
					scoreUpdate();
					ctx.clearRect(x - 1, y - 1, brickLength + 2, brickLength + 2);
					drawBricks(x, y);
					return;
				}
			}
		}
	}
}

function detectCollision(brickX, brickY) {
	var distX = ballX - Math.max(brickX, Math.min(ballX, brickX + brickLength));
	var distY = ballY - Math.max(brickY, Math.min(ballY, brickY + brickLength));
	if (distX * distX + distY * distY < ballRadius * ballRadius) {
		if (Math.abs(distX) > Math.abs(distY)) {
			return "side";
		}
		else {
			return "above";
		}
	}
	return null;
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
	drawBricks(ballX, ballY);
	if (ballX < ballRadius || ballX > sWidth - ballRadius)
		dx = -dx;
	if (ballY > sHeight - timebarHeight - ballRadius) {
		gameOver();
		return;
	}
	// pad와 부딪혔을때
	if (dy > 0 &&
		(ballY >= padY - padHeight / 2 - ballRadius) &&
		(ballY <= padY + padHeight / 2) &&
		(ballX > padX - padWidth / 2) &&
		(ballX < padX + padWidth / 2)
	) {
		dy = -dy * (1 + paddleSpeed * 0.5); // 공의 속도를 패드 속도에 비례하여 증가
		dx = dx + (dx * paddleSpeed * 0.1);
		paddleSpeed = 0; // 패드 속도 초기화
		if (combo > 2) {
			//console.log(combo);
			score += combo;
			combo = 0;
		}
		scoreUpdate();
		//console.log("dx : " + dx + "\ndy : " + dy);
	}
	// 윗 edge와 부딪혔을때
	if (ballY < ballRadius) dy = -dy;

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

function scoreUpdate() {
	$("#myScore").text("점수 : " + score);

}

function stage(n) {
	if (n >= 4) endings();
	else {
		gameInit();
		makeCanvas();
		ball = setInterval(movBall, ballMoveSpeed);
		if (n == 1) stageOne();
		else if (n == 2) stageTwo();
		else stageThree();
		draw();
		makeRandomBricks();
		drawAllBricks();
	}
}

function answer() {
	score += combo;
	score += parseInt((sWidth - timeX) / 10);
	alert("Stage " + currentStage + "clear!\n" + "점수 : " + score);
	currentStage++;
	stage(currentStage);
}

function gameOver() {
	clearInterval(ball);
	clearInterval(timebar);
	backgroundMusic.pause();
	gameoverMusic.currentTime = 0;
	gameoverMusic.play();
	showResult();
	setTimeout(function () {
		// showButton();
		$("#result_page").hide();
		$("#main_page").show();
	}
		, 5000);

	score = 0;
	$("#myScore").hide();

	//메인 화면 음악 추가 게임종료 화면 추가 후 옮길 예정
	main_BGM.play();
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
			else if (bricks[i][j] == 1)
				brickCnt++;
		}
	}
	for (var i = -3; i < 3; i++)
		bricks[brickRowCountMax - 1][Math.floor(brickColumnCountMax / 2) + i] = 0;
}

function stageOne() {
	timePerSecond = 180;
	bricks[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[4] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[5] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[6] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[7] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[8] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[9] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[10] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[11] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function stageTwo() {
	timePerSecond = 150;
	bricks[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[4] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[5] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[6] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[7] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[8] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[9] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[10] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[11] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function stageThree() {
	timePerSecond = 120;
	bricks[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[4] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[5] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[6] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[7] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[8] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[9] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[10] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[11] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function exit() {

}