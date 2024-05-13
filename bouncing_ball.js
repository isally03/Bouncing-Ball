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

var ball;

window.onload = function () {
	mainMenu();
	$("#startGame").on("click", gameStart);
	$("#store").on("click", store);
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

	var store = document.createElement("input");
	store.type = "button";
	store.id = "store";
	store.value = "상점";
	mainMenu.appendChild(store);

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
	document.getElementById("mainMenu").style.display = "none";
	gameInit();
	makeCanvas();
	drawBall();
	drawPad();
	ball = setInterval(movBall, 10);
}

function gameInit() {
	sWidth = document.documentElement.clientWidth;
	sHeight = document.documentElement.clientHeight;
	ballX = sWidth/2;
	ballY = sHeight-100;
	velocityX = 5;
	velocityY = 5;
	dx = 3;
	dy = 3;
	ballRadius = 15;
	ballColor = "black";

	padX = sWidth/2;
	padY = sHeight-40;
	padHeight = 10;
	padWidth = 150;
}

function makeCanvas() {
	var element = document.createElement("canvas");
	element.width = sWidth;
	element.height = sHeight;
	element.setAttribute("id", "myCanvas");
	document.body.appendChild(element);

	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");

	canvas.style.backgroundImage= "url(\"background.jpg\")";
	canvas.style.backgroundRepeat= "no-repeat";
	canvas.style.backgroundSize= "cover";
	$("#myCanvas").mousemove(function(e) {
		ctx.save();
		ctx.translate(padX,padY);
		ctx.clearRect(-padWidth/2, -padHeight/2, padWidth, padHeight);
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

function drawBall() {
	ctx.save();
	ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2); //(x좌표,y좌표,원 반지름, 시작각도, 끝각도, 그리는 방향)
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
	ctx.restore();
}

function drawPad() {
	ctx.save();
	ctx.translate(padX,padY);
	ctx.fillRect(-padWidth/2, -padHeight/2, padWidth, padHeight);
	ctx.restore();
}

function draw(){
	ctx.clearRect(0,0,sWidth,sHeight);
	drawBall();
	drawPad();
}

function movBall() {
	ctx.save();
	ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius + 1, 0, Math.PI*2);
	ctx.closePath();
	ctx.clip();
	ctx.clearRect(ballX - ballRadius - 1, ballY - ballRadius - 1, ballRadius * 2 + 2, ballRadius * 2 + 2);
	ctx.restore();
	if (ballX < ballRadius || ballX > sWidth - ballRadius)
		dx = -dx;
	if (ballY < ballRadius || ballY > sHeight - ballRadius)
		dy = -dy;
	ballX += dx;
	ballY += dy;
	drawBall();
	drawPad();
}

function stopBall() {
	clearInterval(ball);
}

