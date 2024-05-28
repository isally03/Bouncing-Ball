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
var totalAlive;

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
var bombX;
var bombY;
var bombLength;
var bombLoaded;
var leftmax;
var rightmax;
//폭탄 유지 시간
var time1;
//폭탄 생성 주기
var time2;

var scrambled;
var answer_word;
var answer_arr = [];

answer_arr[0] = ["Salt", "Beef", "Lime", "Pear", "Milk"]; //easy
answer_arr[1] = ["Apple", "Cherry", "Lemon", "Peach", "Honey"]; //normal, hard

function gameStart() {
	$("#main_menu").hide();
	$("#myCanvas").show();
	answer_index = Math.floor(Math.random() * 5);
	sumStart++;

	main_BGM = document.getElementById("main_menu_audio");
	main_BGM.pause();
	if (difficult == "easy") {
		brickRate = 20;
		time1 = 5000;
		time2 = 10000;
		answer_word = answer_arr[0][answer_index];
	}
	if (difficult == "normal") {
		brickRate = 10;
		time1 = 5000;
		time2 = 8000;
		answer_word = answer_arr[1][answer_index];
	}
	if (difficult == "hard") {
		brickRate = 4;
		time1 = 5000;
		time2 = 5500;
		answer_word = answer_arr[1][answer_index];
	}
	scramble(answer_word);

	currentStage = 0;
	score = 0;
	totalAlive = 0;
	scoreUpdate();
	stage(currentStage);

	backgroundMusic.currentTime = 0;
	backgroundMusic.play();
	gameoverMusic.pause();
	drawItem();
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
	brickCnt = 0;

	combo = 0;

	padX = sWidth / 2;
	padY = sHeight - 40;

	scoreView = document.getElementById("myScore");
	$("#myScore").css("font-size", "30px");
	$("#myScore").css("margin", "0 10px");
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
		ctx.clearRect(- padWidth / 2 - 1, -padHeight / 2 - 1, padWidth + 2, padHeight + 2);
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
//폭탄 그리는 함수
function drawItem() {
	var bombImage = new Image();
	bombImage.src = "bomb.png";
	bombImage.onload = function () {
		if (!bombLoaded) {
			leftmax = sWidth * 0.3 - bombLength;
			rightmax = sWidth * 0.7;
			if (Math.random() < 0.5) {
				bombX = Math.random() * leftmax;
			}
			else {
				bombX = rightmax + Math.random() * (sWidth - rightmax - bombLength);
			}
			bombY = padY - bombLength / 2;
			ctx.drawImage(bombImage, bombX, bombY, bombLength, bombLength);
			bombLoaded = true;
		}
		setTimeout(function () {
			ctx.clearRect(bombX - 1, bombY - 1, bombLength + 2, bombLength + 2);
			bombLoaded = false;
		}, time1);
	};
}
//폭탄과 충돌감지 함수
function checkCollide() {
	var padleft = padX - padWidth / 2;
	var padright = padX + padWidth / 2;
	var bombleft = bombX;
	var bombright = bombX + 30;
	if (bombLoaded == true && bombleft < padright && bombright > padleft) {
		score -= 10;
		scoreUpdate();
		ctx.clearRect(bombX, bombY, 30, 30);
		bombLoaded = false;
	}
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
	// console.log(parseInt((sWidth - timeX) / sWidth *100));
	if (timeX > sWidth)
		showResult(0); //시간이 다됐을때
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
	if (ballY > sHeight - timebarHeight - ballRadius) { //바닥에 부딪혔을때
		showResult(1);
		return;
	}
	// pad와 부딪혔을때
	if (dy > 0 &&
		(ballY >= padY - padHeight / 2 - ballRadius) &&
		(ballY <= padY + padHeight / 2) &&
		(ballX > padX - padWidth / 2) &&
		(ballX < padX + padWidth / 2)
	) {
		touchBarCnt = Math.min(touchBarCnt + 1, touchBarCntMax);
		dy = -dy * (1 + paddleSpeed * 0.5); // 공의 속도를 패드 속도에 비례하여 증가
		dx = dx + (dx * paddleSpeed * 0.1);
		paddleSpeed = 0; // 패드 속도 초기화
		if (combo > 20) {
			//console.log(combo);
			score += combo;
			combo = 0;
		}
		scoreUpdate();
		console.log("dx : " + dx + "\ndy : " + dy);
	}
	// 윗 edge와 부딪혔을때
	if (ballY < ballRadius) dy = -dy;

	ballX += dx;
	ballY += dy;
	drawBall();
	drawPad();
	//폭탄과 충돌 감지 함수
	checkCollide();
	if (brickCnt == 0) {
		clearInterval(ball);
		clearInterval(timebar);
		showResult(0);
		return;
	}
}

function scoreUpdate() {
	$("#myScore").text("점수 : " + score);

}

function stage(n) {
	if (n == answer_word.length) endings();
	else {
		gameInit();
		makeCanvas();
		ball = setInterval(movBall, ballMoveSpeed);
		bomb = setInterval(drawItem, time2);
		stageUpdate(n);
		draw();
		makeRandomBricks();
		drawAllBricks();
	}
}

function gameOver() {
	totalAlive += timeX * timePerSecond / sWidth;
	deadCnt = Math.min(deadCnt + 1, deadCntMax);
	sumAlive += totalAlive;
	maxAlive = Math.max(maxAlive, totalAlive);
	sumScore += score;
	maxScore = Math.max(maxScore, score);
	sumStage += currentStage + 1;
	maxStage = Math.max(maxStage, currentStage + 1);
	clearInterval(ball);
	clearInterval(timebar);
	clearInterval(bomb);
	backgroundMusic.pause();
	// score = 0;
	$("#myScore").hide();
}

//check answer 내부로 편입됨!
// function answer() {
// 	score += combo;
// 	score += parseInt((sWidth - timeX) / 10);
// 	// alert("Stage " + currentStage + "clear!\n" + "점수 : " + score);
// 	currentStage++;
// }

function endings() {
	alert("Clear!");
	showResult(2); //엔딩에서
}

function makeRandomBricks() {
	for (var i = 0; i < brickRowCountMax; i++) {
		for (var j = 0; j < brickColumnCountMax; j++) {
			if (bricks[i][j] == 0) {
				var randomInt = Math.floor(Math.random() * brickRate);
				if (randomInt == 0
					&& !(i == brickRowCountMax - 1 && j >= Math.floor(brickColumnCountMax / 2) - 3 && j < Math.floor(brickColumnCountMax / 2) + 3)
				) {
					bricks[i][j] = 1;
					brickCnt++;
				}
			}
			else if (bricks[i][j] == 1)
				brickCnt++;
		}
	}
}

function stageUpdate(stage_num) {
	timePerSecond = 210 - stage_num * 30;
	dx = 5 + 0.5 * stage_num;
	dy = -5 - 0.5 * stage_num;
	for (var t = 0; t <= 11; t++) {
		bricks[t] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	}

	console.log("stageUpdate - currentStage" + currentStage);

	if (currentStage == 4 && difficult != "easy") {
		var m = Math.floor(Math.random() * 5);
		var l = Math.floor(Math.random() * 25);

		alphabet(stringToFunc(scrambled[4]), m, l);
		while (true) {
			var temp = Math.floor(Math.random() * 24);

			if (temp < (l - 7) || temp >= (l + 7)) {
				alphabet(stringToFunc(scrambled[currentStage]), Math.floor(Math.random() * 5), temp);
				break;
			}
		}


	}
	else {
		alphabet(stringToFunc(scrambled[currentStage]), Math.floor(Math.random() * 5), Math.floor(Math.random() * 24));
		console.log(scrambled);
	}
}

function check_answer() {
	totalAlive += timeX * timePerSecond / sWidth;

	console.log("user_anwser" + $("#user_anwser").val());
	$("#answer_box").hide();
	console.log("scrambled[currentStage].toLowerCase()" + scrambled[currentStage].toLowerCase());
	if (scrambled[currentStage].toLowerCase() == $("#user_anwser").val().toLowerCase()) {

		score += combo;
		score += parseInt((sWidth - timeX) / sWidth * 100);
		// alert("실패.....\n점수 : " + score);
		currentStage++;
		clearCnt = Math.min(clearCnt + 1, clearCntMax);

		// console.log("++");
		stage(currentStage);
	}
	else {
		showResult(1);
	}
	$(user_anwser).off();
	$("#user_anwser").val("");


}


function exit() {

}

function scramble(word) {
	scrambled = word.split("");
	for (var i = 0; i < 10; i++) {
		var mov_index = Math.floor(Math.random() * scrambled.length);
		var alpha = scrambled[mov_index];
		scrambled.splice(mov_index, 1);
		scrambled.push(alpha);
	}
	// console.log(scrambled);
}

function alphabet(alpha, y, x) {
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 7; j++) {
			// console.log("x : " + x + "\ny : " + y + "\ni : " + i, "\nj : " + j, "\nbricks : " + bricks[y + i][x + j]);
			bricks[y + i][x + j] = alpha[i][j];
		}
	}
}


function stringToFunc(str) {

	switch (str) {
		case 'A':
			return A;
		case 'B':
			return B;
		case 'C':
			return C;
		case 'H':
			return H;
		case 'L':
			return L;
		case 'M':
			return M;
		case 'P':
			return P;
		case 'S':
			return S;
		case 'a':
			return a;
		case 'b':
			return b;
		case 'c':
			return c;
		case 'e':
			return e;
		case 'f':
			return f;
		case 'h':
			return h;
		case 'i':
			return i;
		case 'k':
			return k;
		case 'l':
			return l;
		case 'm':
			return m;
		case 'n':
			return n;
		case 'o':
			return o;
		case 'p':
			return p;
		case 'r':
			return r;
		case 't':
			return t;
		case 'y':
			return y;
		default:
			return -1;
	}

}
var A = [];
var B = [];
var C = [];
var H = [];
var L = [];
var M = [];
var P = [];
var S = [];
var a = [];
var b = [];
var c = [];
var e = [];
var f = [];
var h = [];
var i = [];
var k = [];
var l = [];
var m = [];
var n = [];
var o = [];
var p = [];
var r = [];
var t = [];
var y = [];

A[0] = [0, 0, 0, 2, 0, 0, 0];
A[1] = [0, 0, 2, 0, 2, 0, 0];
A[2] = [0, 2, 0, 0, 0, 2, 0];
A[3] = [0, 2, 2, 2, 2, 2, 0];
A[4] = [0, 2, 0, 0, 0, 2, 0];
A[5] = [0, 2, 0, 0, 0, 2, 0];
A[6] = [0, 2, 0, 0, 0, 2, 0];
A[7] = [0, 0, 0, 0, 0, 0, 0];

B[0] = [0, 0, 0, 0, 0, 0, 0];
B[1] = [0, 2, 2, 2, 0, 0, 0];
B[2] = [0, 2, 0, 0, 2, 0, 0];
B[3] = [0, 2, 0, 0, 2, 0, 0];
B[4] = [0, 2, 2, 2, 0, 0, 0];
B[5] = [0, 2, 0, 0, 2, 0, 0];
B[6] = [0, 2, 0, 0, 2, 0, 0];
B[7] = [0, 2, 2, 2, 0, 0, 0];

C[0] = [0, 0, 2, 2, 2, 0, 0];
C[1] = [0, 2, 0, 0, 0, 2, 0];
C[2] = [0, 2, 0, 0, 0, 0, 0];
C[3] = [0, 2, 0, 0, 0, 0, 0];
C[4] = [0, 2, 0, 0, 0, 0, 0];
C[5] = [0, 2, 0, 0, 0, 0, 0];
C[6] = [0, 2, 0, 0, 0, 2, 0];
C[7] = [0, 0, 2, 2, 2, 0, 0];

H[0] = [0, 2, 0, 0, 0, 2, 0];
H[1] = [0, 2, 0, 0, 0, 2, 0];
H[2] = [0, 2, 0, 0, 0, 2, 0];
H[3] = [0, 2, 2, 2, 2, 2, 0];
H[4] = [0, 2, 0, 0, 0, 2, 0];
H[5] = [0, 2, 0, 0, 0, 2, 0];
H[6] = [0, 2, 0, 0, 0, 2, 0];
H[7] = [0, 2, 0, 0, 0, 2, 0];

L[0] = [0, 2, 0, 0, 0, 0, 0];
L[1] = [0, 2, 0, 0, 0, 0, 0];
L[2] = [0, 2, 0, 0, 0, 0, 0];
L[3] = [0, 2, 0, 0, 0, 0, 0];
L[4] = [0, 2, 0, 0, 0, 0, 0];
L[5] = [0, 2, 0, 0, 0, 0, 0];
L[6] = [0, 2, 0, 0, 0, 0, 0];
L[7] = [0, 2, 2, 2, 2, 2, 0];

M[0] = [0, 2, 0, 0, 0, 2, 0];
M[1] = [0, 2, 2, 0, 2, 2, 0];
M[2] = [0, 2, 2, 0, 2, 2, 0];
M[3] = [0, 2, 0, 2, 0, 2, 0];
M[4] = [0, 2, 0, 0, 0, 2, 0];
M[5] = [0, 2, 0, 0, 0, 2, 0];
M[6] = [0, 2, 0, 0, 0, 2, 0];
M[7] = [0, 2, 0, 0, 0, 2, 0];

P[0] = [0, 2, 2, 2, 2, 0, 0];
P[1] = [0, 2, 0, 0, 0, 2, 0];
P[2] = [0, 2, 0, 0, 0, 2, 0];
P[3] = [0, 2, 0, 0, 0, 2, 0];
P[4] = [0, 2, 2, 2, 2, 0, 0];
P[5] = [0, 2, 0, 0, 0, 0, 0];
P[6] = [0, 2, 0, 0, 0, 0, 0];
P[7] = [0, 2, 0, 0, 0, 0, 0];

S[0] = [0, 0, 2, 2, 2, 0, 0];
S[1] = [0, 2, 0, 0, 0, 2, 0];
S[2] = [0, 2, 0, 0, 0, 0, 0];
S[3] = [0, 0, 2, 2, 0, 0, 0];
S[4] = [0, 0, 0, 2, 2, 0, 0];
S[5] = [0, 0, 0, 0, 0, 2, 0];
S[6] = [0, 2, 0, 0, 0, 2, 0];
S[7] = [0, 0, 2, 2, 2, 0, 0];

a[0] = [0, 0, 2, 2, 2, 0, 0];
a[1] = [0, 2, 0, 0, 0, 2, 0];
a[2] = [0, 0, 0, 0, 0, 2, 0];
a[3] = [0, 0, 2, 2, 2, 2, 0];
a[4] = [0, 2, 0, 0, 0, 2, 0];
a[5] = [0, 2, 0, 0, 0, 2, 0];
a[6] = [0, 0, 2, 2, 2, 2, 0];
a[7] = [0, 0, 0, 0, 0, 0, 0];

b[0] = [0, 0, 0, 0, 0, 0, 0]
b[1] = [0, 2, 0, 0, 0, 0, 0]
b[2] = [0, 2, 0, 0, 0, 0, 0]
b[3] = [0, 2, 2, 2, 0, 0, 0]
b[4] = [0, 2, 0, 0, 2, 0, 0]
b[5] = [0, 2, 0, 0, 2, 0, 0]
b[6] = [0, 2, 2, 2, 0, 0, 0]
b[7] = [0, 0, 0, 0, 0, 0, 0]

c[0] = [0, 0, 0, 0, 0, 0, 0];
c[1] = [0, 0, 2, 2, 2, 0, 0];
c[2] = [0, 2, 0, 0, 0, 2, 0];
c[3] = [0, 2, 0, 0, 0, 0, 0];
c[4] = [0, 2, 0, 0, 0, 0, 0];
c[5] = [0, 2, 0, 0, 0, 2, 0];
c[6] = [0, 0, 2, 2, 2, 0, 0];
c[7] = [0, 0, 0, 0, 0, 0, 0];

e[0] = [0, 0, 2, 2, 2, 0, 0];
e[1] = [0, 2, 0, 0, 0, 2, 0];
e[2] = [0, 2, 0, 0, 0, 2, 0];
e[3] = [0, 2, 2, 2, 2, 2, 0];
e[4] = [0, 2, 0, 0, 0, 0, 0];
e[5] = [0, 2, 0, 0, 0, 2, 0];
e[6] = [0, 0, 2, 2, 2, 0, 0];
e[7] = [0, 0, 0, 0, 0, 0, 0];

f[0] = [0, 0, 0, 2, 0, 0, 0];
f[1] = [0, 0, 2, 0, 2, 0, 0];
f[2] = [0, 0, 2, 0, 0, 0, 0];
f[3] = [0, 0, 2, 0, 0, 0, 0];
f[4] = [0, 2, 2, 2, 2, 0, 0];
f[5] = [0, 0, 2, 0, 0, 0, 0];
f[6] = [0, 0, 2, 0, 0, 0, 0];
f[7] = [0, 0, 2, 0, 0, 0, 0];

h[0] = [0, 0, 0, 0, 0, 0, 0];
h[1] = [0, 2, 0, 0, 0, 0, 0];
h[2] = [0, 2, 0, 0, 0, 0, 0];
h[3] = [0, 2, 2, 2, 0, 0, 0];
h[4] = [0, 2, 0, 0, 2, 0, 0];
h[5] = [0, 2, 0, 0, 2, 0, 0];
h[6] = [0, 2, 0, 0, 2, 0, 0];
h[7] = [0, 0, 0, 0, 0, 0, 0];

i[0] = [0, 0, 0, 2, 0, 0, 0];
i[1] = [0, 0, 0, 0, 0, 0, 0];
i[2] = [0, 0, 0, 2, 0, 0, 0];
i[3] = [0, 0, 0, 2, 0, 0, 0];
i[4] = [0, 0, 0, 2, 0, 0, 0];
i[5] = [0, 0, 0, 2, 0, 0, 0];
i[6] = [0, 0, 0, 2, 0, 0, 0];
i[7] = [0, 0, 0, 2, 0, 0, 0];

k[0] = [0, 0, 0, 0, 0, 0, 0];
k[1] = [0, 2, 0, 0, 2, 0, 0];
k[2] = [0, 2, 0, 2, 0, 0, 0];
k[3] = [0, 2, 2, 0, 0, 0, 0];
k[4] = [0, 2, 2, 0, 0, 0, 0];
k[5] = [0, 2, 0, 2, 0, 0, 0];
k[6] = [0, 2, 0, 0, 2, 0, 0];
k[7] = [0, 0, 0, 0, 0, 0, 0];

l[0] = [0, 0, 0, 2, 0, 0, 0];
l[1] = [0, 0, 0, 2, 0, 0, 0];
l[2] = [0, 0, 0, 2, 0, 0, 0];
l[3] = [0, 0, 0, 2, 0, 0, 0];
l[4] = [0, 0, 0, 2, 0, 0, 0];
l[5] = [0, 0, 0, 2, 0, 0, 0];
l[6] = [0, 0, 0, 2, 0, 0, 0];
l[7] = [0, 0, 0, 2, 0, 0, 0];

m[0] = [0, 0, 0, 0, 0, 0, 0];
m[1] = [0, 2, 2, 0, 2, 2, 0];
m[2] = [2, 0, 0, 2, 0, 0, 2];
m[3] = [2, 0, 0, 2, 0, 0, 2];
m[4] = [2, 0, 0, 2, 0, 0, 2];
m[5] = [2, 0, 0, 2, 0, 0, 2];
m[6] = [2, 0, 0, 0, 0, 0, 2];
m[7] = [0, 0, 0, 0, 0, 0, 0];

n[0] = [0, 0, 0, 0, 0, 0, 0];
n[1] = [0, 0, 0, 0, 0, 0, 0];
n[2] = [0, 2, 0, 2, 2, 0, 0];
n[3] = [0, 2, 2, 0, 0, 2, 0];
n[4] = [0, 2, 0, 0, 0, 2, 0];
n[5] = [0, 2, 0, 0, 0, 2, 0];
n[6] = [0, 2, 0, 0, 0, 2, 0];
n[7] = [0, 0, 0, 0, 0, 0, 0];

o[0] = [0, 0, 0, 0, 0, 0, 0];
o[1] = [0, 0, 2, 2, 2, 0, 0];
o[2] = [0, 2, 0, 0, 0, 2, 0];
o[3] = [0, 2, 0, 0, 0, 2, 0];
o[4] = [0, 2, 0, 0, 0, 2, 0];
o[5] = [0, 0, 2, 2, 2, 0, 0];
o[6] = [0, 0, 0, 0, 0, 0, 0];
o[7] = [0, 0, 0, 0, 0, 0, 0];

p[0] = [0, 0, 0, 0, 0, 0, 0];
p[1] = [0, 2, 2, 2, 0, 0, 0];
p[2] = [0, 2, 0, 0, 2, 0, 0];
p[3] = [0, 2, 0, 0, 2, 0, 0];
p[4] = [0, 2, 2, 2, 0, 0, 0];
p[5] = [0, 2, 0, 0, 0, 0, 0];
p[6] = [0, 2, 0, 0, 0, 0, 0];
p[7] = [0, 0, 0, 0, 0, 0, 0];

r[0] = [0, 0, 0, 0, 0, 0, 0];
r[1] = [0, 2, 0, 2, 0, 0, 0];
r[2] = [0, 2, 2, 0, 2, 0, 0];
r[3] = [0, 2, 0, 0, 0, 0, 0];
r[4] = [0, 2, 0, 0, 0, 0, 0];
r[5] = [0, 2, 0, 0, 0, 0, 0];
r[6] = [0, 2, 0, 0, 0, 0, 0];
r[7] = [0, 0, 0, 0, 0, 0, 0];

t[0] = [0, 0, 0, 0, 0, 0, 0];
t[1] = [0, 0, 0, 2, 0, 0, 0];
t[2] = [0, 0, 0, 2, 0, 0, 0];
t[3] = [0, 0, 2, 2, 2, 0, 0];
t[4] = [0, 0, 0, 2, 0, 0, 0];
t[5] = [0, 0, 0, 2, 0, 0, 0];
t[6] = [0, 0, 0, 2, 0, 0, 0];
t[7] = [0, 0, 0, 0, 0, 0, 0];


y[0] = [0, 2, 0, 0, 2, 0, 0];
y[1] = [0, 2, 0, 0, 2, 0, 0];
y[2] = [0, 2, 0, 0, 2, 0, 0];
y[3] = [0, 0, 2, 2, 2, 0, 0];
y[4] = [0, 0, 0, 0, 2, 0, 0];
y[5] = [0, 2, 0, 0, 2, 0, 0];
y[6] = [0, 0, 2, 2, 0, 0, 0];
y[7] = [0, 0, 0, 0, 0, 0, 0];



