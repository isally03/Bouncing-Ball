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

let prevMouseX = 0, prevMouseY = 0;
let paddleSpeed = 0;

var main_BGM;
var bombX;
var bombY;
var bombLoaded;
var leftmax;
var rightmax;
//폭탄 유지 시간
var time1;
//폭탄 생성 주기
var time2;

function gameStart() {
	$("#main_menu").hide();
	$("#myCanvas").show();
	// // 메인화면 음악 추가
	main_BGM = document.getElementById("main_menu_audio");
	main_BGM.pause();
	if (difficult == "easy"){
		brickRate = 100;
		time1=5000;
		time2=10000;
	} 
	if (difficult == "normal"){
		brickRate = 20;
		time1=5000;
		time2=8000;
	} 
	if (difficult == "hard") 
	{
		brickRate = 5;
		time1=5000;
		time2=5500;
	}

	currentStage = 1;
	score = 0;
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
//폭탄 그리는 함수
function drawItem()
{
	var bombImage=new Image();
	bombImage.src="bomb.jpg";
	bombImage.onload=function(){
		if(!bombLoaded){
			leftmax=sWidth*0.3-bombImage.width;
			rightmax=sWidth*0.7;
			if(Math.random()<0.5){
				bombX=Math.random()*leftmax;
			}
		else{
			bombX=rightmax+Math.random()*(sWidth-rightmax-bombImage.width);
			}
		bombY=890;
		ctx.drawImage(bombImage,bombX,bombY,30,30);
		bombLoaded=true;
		}
		setTimeout(function(){
		ctx.clearRect(bombX,bombY,30,30);
		bombLoaded=false;
		},time1);
	};
}
//폭탄과 충돌감지 함수
function checkCollide(){
	var padleft=padX-padWidth/2;
	var padright=padX+padWidth/2;
	var bombleft=bombX;
	var bombright=bombX+30;
	if(bombLoaded==true && bombleft<padright && bombright>padleft){
		score-=10;
		scoreUpdate();
		ctx.clearRect(bombX,bombY,30,30);
		bombLoaded=false;
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
	//폭탄과 충돌 감지 함수
	checkCollide();
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
		bomb = setInterval(drawItem,time2);
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
	clearInterval(bomb);
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
	bricks[0]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[1]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[2]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[3]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[4]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[5]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[6]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[7]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[8]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[9]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[10] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[11] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	alphabet(a, 1, 2);

}

function stageTwo() {
	timePerSecond = 150;
	bricks[0]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[1]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[2]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[3]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[4]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[5]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[6]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[7]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[8]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[9]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[10] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[11] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	alphabet(p, 3, 3);

}

function stageThree() {
	timePerSecond = 120;
	bricks[0]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[1]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[2]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[3]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[4]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[5]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[6]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[7]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[8]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[9]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[10] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bricks[11] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	alphabet(l, 1, 2);

}

function exit() {

}


function alphabet(alpha, y,x){
	for(var i = 0; i<8; i++){
		for(var j= 0; j<7; j++){
			bricks[y+i][x+j] = alpha[i][j];
			console.log(bricks[y+i][x+j]);
		}
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
var c = [];
var e = [];
var f = [];
var h = [];
var i = [];
var l = [];
var m = [];
var n = [];
var o = [];
var p = [];
var r = [];
var y = [];

A[0]  = [0, 0, 0, 2, 0, 0, 0];
A[1]  = [0, 0, 2, 0, 2, 0, 0];
A[2]  = [0, 2, 0, 0, 0, 2, 0];
A[3]  = [0, 2, 2, 2, 2, 2, 0];
A[4]  = [0, 2, 0, 0, 0, 2, 0];
A[5]  = [0, 2, 0, 0, 0, 2, 0];
A[6]  = [0, 2, 0, 0, 0, 2, 0];
A[7]  = [0, 0, 0, 0, 0, 0, 0];

B[0]  = [0, 0, 0, 0, 0, 0, 0];
B[1]  = [0, 2, 2, 2, 0, 0, 0];
B[2]  = [0, 2, 0, 0, 2, 0, 0];
B[3]  = [0, 2, 0, 0, 2, 0, 0];
B[4]  = [0, 2, 2, 2, 0, 0, 0];
B[5]  = [0, 2, 0, 0, 2, 0, 0];
B[6]  = [0, 2, 0, 0, 2, 0, 0];
B[7]  = [0, 2, 2, 2, 0, 0, 0];

C[0]  = [0, 0, 2, 2, 2, 0, 0];
C[1]  = [0, 2, 0, 0, 0, 2, 0];
C[2]  = [0, 2, 0, 0, 0, 0, 0];
C[3]  = [0, 2, 0, 0, 0, 0, 0];
C[4]  = [0, 2, 0, 0, 0, 0, 0];
C[5]  = [0, 2, 0, 0, 0, 0, 0];
C[6]  = [0, 2, 0, 0, 0, 2, 0];
C[7]  = [0, 0, 2, 2, 2, 0, 0];

H[0]  = [0, 2, 0, 0, 0, 2, 0];
H[1]  = [0, 2, 0, 0, 0, 2, 0];
H[2]  = [0, 2, 0, 0, 0, 2, 0];
H[3]  = [0, 2, 2, 2, 2, 2, 0];
H[4]  = [0, 2, 0, 0, 0, 2, 0];
H[5]  = [0, 2, 0, 0, 0, 2, 0];
H[6]  = [0, 2, 0, 0, 0, 2, 0];
H[7]  = [0, 2, 0, 0, 0, 2, 0];

L[0]  = [0, 2, 0, 0, 0, 0, 0];
L[1]  = [0, 2, 0, 0, 0, 0, 0];
L[2]  = [0, 2, 0, 0, 0, 0, 0];
L[3]  = [0, 2, 0, 0, 0, 0, 0];
L[4]  = [0, 2, 0, 0, 0, 0, 0];
L[5]  = [0, 2, 0, 0, 0, 0, 0];
L[6]  = [0, 2, 0, 0, 0, 0, 0];
L[7]  = [0, 2, 2, 2, 2, 2, 0];

M[0]  = [0, 2, 0, 0, 0, 2, 0];
M[1]  = [0, 2, 2, 0, 2, 2, 0];
M[2]  = [0, 2, 2, 0, 2, 2, 0];
M[3]  = [0, 2, 0, 2, 0, 2, 0];
M[4]  = [0, 2, 0, 0, 0, 2, 0];
M[5]  = [0, 2, 0, 0, 0, 2, 0];
M[6]  = [0, 2, 0, 0, 0, 2, 0];
M[7]  = [0, 2, 0, 0, 0, 2, 0];

P[0]  = [0, 2, 2, 2, 2, 0, 0];
P[1]  = [0, 2, 0, 0, 0, 2, 0];
P[2]  = [0, 2, 0, 0, 0, 2, 0];
P[3]  = [0, 2, 0, 0, 0, 2, 0];
P[4]  = [0, 2, 2, 2, 2, 0, 0];
P[5]  = [0, 2, 0, 0, 0, 0, 0];
P[6]  = [0, 2, 0, 0, 0, 0, 0];
P[7]  = [0, 2, 0, 0, 0, 0, 0];

S[0]  = [0, 0, 2, 2, 2, 0, 0];
S[1]  = [0, 2, 0, 0, 0, 2, 0];
S[2]  = [0, 2, 0, 0, 0, 0, 0];
S[3]  = [0, 0, 2, 2, 0, 0, 0];
S[4]  = [0, 0, 0, 2, 2, 0, 0];
S[5]  = [0, 0, 0, 0, 0, 2, 0];
S[6]  = [0, 2, 0, 0, 0, 2, 0];
S[7]  = [0, 0, 2, 2, 2, 0, 0];

a[0]  = [0, 0, 2, 2, 2, 0, 0];
a[1]  = [0, 2, 0, 0, 0, 2, 0];
a[2]  = [0, 0, 0, 0, 0, 2, 0];
a[3]  = [0, 0, 2, 2, 2, 2, 0];
a[4]  = [0, 2, 0, 0, 0, 2, 0];
a[5]  = [0, 2, 0, 0, 0, 2, 0];
a[6]  = [0, 0, 2, 2, 2, 2, 0];
a[7]  = [0, 0, 0, 0, 0, 0, 0];

c[0]  = [0, 0, 0, 0, 0, 0, 0];
c[1]  = [0, 0, 2, 2, 2, 0, 0];
c[2]  = [0, 2, 0, 0, 0, 2, 0];
c[3]  = [0, 2, 0, 0, 0, 0, 0];
c[4]  = [0, 2, 0, 0, 0, 0, 0];
c[5]  = [0, 2, 0, 0, 0, 2, 0];
c[6]  = [0, 0, 2, 2, 2, 0, 0];
c[7]  = [0, 0, 0, 0, 0, 0, 0];

e[0]  = [0, 0, 2, 2, 2, 0, 0];
e[1]  = [0, 2, 0, 0, 0, 2, 0];
e[2]  = [0, 2, 0, 0, 0, 2, 0];
e[3]  = [0, 2, 2, 2, 2, 2, 0];
e[4]  = [0, 2, 0, 0, 0, 0, 0];
e[5]  = [0, 2, 0, 0, 0, 2, 0];
e[6]  = [0, 0, 2, 2, 2, 0, 0];
e[7]  = [0, 0, 0, 0, 0, 0, 0];

f[0]  = [0, 0, 0, 2, 0, 0, 0];
f[1]  = [0, 0, 2, 0, 2, 0, 0];
f[2]  = [0, 0, 2, 0, 0, 0, 0];
f[3]  = [0, 0, 2, 0, 0, 0, 0];
f[4]  = [0, 2, 2, 2, 2, 0, 0];
f[5]  = [0, 0, 2, 0, 0, 0, 0];
f[6]  = [0, 0, 2, 0, 0, 0, 0];
f[7]  = [0, 0, 2, 0, 0, 0, 0];

h[0]  = [0, 0, 0, 0, 0, 0, 0];
h[1]  = [0, 2, 0, 0, 0, 0, 0];
h[2]  = [0, 2, 0, 0, 0, 0, 0];
h[3]  = [0, 2, 2, 2, 0, 0, 0];
h[4]  = [0, 2, 0, 0, 2, 0, 0];
h[5]  = [0, 2, 0, 0, 2, 0, 0];
h[6]  = [0, 2, 0, 0, 2, 0, 0];
h[7]  = [0, 0, 0, 0, 0, 0, 0];

i[0]  = [0, 0, 0, 2, 0, 0, 0];
i[1]  = [0, 0, 0, 0, 0, 0, 0];
i[2]  = [0, 0, 0, 2, 0, 0, 0];
i[3]  = [0, 0, 0, 2, 0, 0, 0];
i[4]  = [0, 0, 0, 2, 0, 0, 0];
i[5]  = [0, 0, 0, 2, 0, 0, 0];
i[6]  = [0, 0, 0, 2, 0, 0, 0];
i[7]  = [0, 0, 0, 2, 0, 0, 0];

l[0]  = [0, 0, 0, 2, 0, 0, 0];
l[1]  = [0, 0, 0, 2, 0, 0, 0];
l[2]  = [0, 0, 0, 2, 0, 0, 0];
l[3]  = [0, 0, 0, 2, 0, 0, 0];
l[4]  = [0, 0, 0, 2, 0, 0, 0];
l[5]  = [0, 0, 0, 2, 0, 0, 0];
l[6]  = [0, 0, 0, 2, 0, 0, 0];
l[7]  = [0, 0, 0, 2, 0, 0, 0];

m[0]  = [0, 0, 0, 0, 0, 0, 0];
m[1]  = [0, 2, 2, 0, 2, 2, 0];
m[2]  = [2, 0, 0, 2, 0, 0, 2];
m[3]  = [2, 0, 0, 2, 0, 0, 2];
m[4]  = [2, 0, 0, 2, 0, 0, 2];
m[5]  = [2, 0, 0, 2, 0, 0, 2];
m[6]  = [2, 0, 0, 0, 0, 0, 2];
m[7]  = [0, 0, 0, 0, 0, 0, 0];

n[0]  = [0, 0, 0, 0, 0, 0, 0];
n[1]  = [0, 0, 0, 0, 0, 0, 0];
n[2]  = [0, 2, 0, 2, 2, 0, 0];
n[3]  = [0, 2, 2, 0, 0, 2, 0];
n[4]  = [0, 2, 0, 0, 0, 2, 0];
n[5]  = [0, 2, 0, 0, 0, 2, 0];
n[6]  = [0, 2, 0, 0, 0, 2, 0];
n[7]  = [0, 0, 0, 0, 0, 0, 0];

o[0]  = [0, 0, 0, 0, 0, 0, 0];
o[1]  = [0, 0, 2, 2, 2, 0, 0];
o[2]  = [0, 2, 0, 0, 0, 2, 0];
o[3]  = [0, 2, 0, 0, 0, 2, 0];
o[4]  = [0, 2, 0, 0, 0, 2, 0];
o[5]  = [0, 0, 2, 2, 2, 0, 0];
o[6]  = [0, 0, 0, 0, 0, 0, 0];
o[7]  = [0, 0, 0, 0, 0, 0, 0];

p[0]  = [0, 0, 0, 0, 0, 0, 0];
p[1]  = [0, 2, 2, 2, 0, 0, 0];
p[2]  = [0, 2, 0, 0, 2, 0, 0];
p[3]  = [0, 2, 0, 0, 2, 0, 0];
p[4]  = [0, 2, 2, 2, 0, 0, 0];
p[5]  = [0, 2, 0, 0, 0, 0, 0];
p[6]  = [0, 2, 0, 0, 0, 0, 0];
p[7]  = [0, 0, 0, 0, 0, 0, 0];

r[0]  = [0, 0, 0, 0, 0, 0, 0];
r[1]  = [0, 2, 0, 2, 0, 0, 0];
r[2]  = [0, 2, 2, 0, 2, 0, 0];
r[3]  = [0, 2, 0, 0, 0, 0, 0];
r[4]  = [0, 2, 0, 0, 0, 0, 0];
r[5]  = [0, 2, 0, 0, 0, 0, 0];
r[6]  = [0, 2, 0, 0, 0, 0, 0];
r[7]  = [0, 0, 0, 0, 0, 0, 0];

y[0]  = [0, 2, 0, 0, 2, 0, 0];
y[1]  = [0, 2, 0, 0, 2, 0, 0];
y[2]  = [0, 2, 0, 0, 2, 0, 0];
y[3]  = [0, 0, 2, 2, 2, 0, 0];
y[4]  = [0, 0, 0, 0, 2, 0, 0];
y[5]  = [0, 2, 0, 0, 2, 0, 0];
y[6]  = [0, 0, 2, 2, 0, 0, 0];
y[7]  = [0, 0, 0, 0, 0, 0, 0];
