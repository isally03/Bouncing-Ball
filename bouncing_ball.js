var sWidth = window.innerWidth;
var sHeight = window.innerHeight;
var canvas;
var ctx;

var ballX = sWidth/2;
var ballY = sHeight-100;
var velocityX = 5;
var velocityY = 5;
var dx = 3;
var dy = 3;
var ballRadius = 15;
var ballColor = "black";

var padX = sWidth/2;
var padY = sHeight-40;
var padHeight = 10;
var padWidth = 150;
var padAngle = 0;

window.onload = function () {
	mainMenu();
	$("#startGame").on("click", gameStart);
	$("#store").on("click", store);
	$("#profiles").on("click", profiles);
	$("#exitGame").on("click", exitGame);
	$("#settings").on("click", settings);
	$(document).on("keydown",movPad);
// setInterval(drawPad, 100);

}
// $(document).keydown(function(event){
// 	console.log("키 코드: " + event.which);
// });

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
	makeCanvas();
	drawBall();
	drawPad();
}

function makeCanvas() {
	var element = document.createElement("canvas");
	element.width = sWidth;
	element.height = sHeight;
	element.setAttribute("id", "myCanvas");
	document.body.appendChild(element);	

	// console.log("can" + element.height + "  screen"+ screen.availHeight);
	// console.log(document.body.style.height);
	


	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");

	canvas.style.backgroundImage = "url(\"background.jpg\")";
	canvas.style.backgroundRepeat= "no-repeat";
	canvas.style.backgroundSize = sWidth + "px " + sHeight + "px";
}

function drawBall() {
	

	ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2); //(x좌표,y좌표,원 반지름, 시작각도, 끝각도, 그리는 방향)
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();

}

function drawPad() {
	ctx.save();
	ctx.translate(padX,padY);
	ctx.rotate(padAngle * Math.PI / 180);
	ctx.fillRect(-padWidth/2, -padHeight/2, padWidth, padHeight);
	ctx.restore();
	

}

function draw(){
	ctx.clearRect(0,0,sWidth,sHeight);
	drawBall();
	drawPad();
}

function movPad(event){ //pad 각도 변경
	if(event.key=="w"){
		padAngle +=2;

	}
	else if(event.key =="s"){ 
		padAngle -=2;
	}
	// console.log("movPad: "+ event.key);
	draw();
}


