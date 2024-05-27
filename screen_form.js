var ballColor = "#000814";
var backImage = "background1.jpg";
var backgroundMusic = new Audio("backgroundmusic1.wav");
backgroundMusic.loop = true;
var gameoverMusic = new Audio("gameover1.wav");
var backgroundMusicVolume = 0.5;
var gameoverMusicVolume = 0.5;
var difficult = "easy";

var storybox;
var prevMove
var prevMusicTime;

var touchBarCnt = 0;
var isCostomize = false;
var deadCnt = 0;
var playTime = 0;
var clearCnt = 0;

var touchBarCntMax = 20;
var deadCntMax = 3;
var playTimeMax = 180;
var clearCntMax = 3;

var initialSettings = {};

var maxAlive = 0;
var sumAlive = 0;
var maxScore = 0;
var sumScore = 0;
var maxStage = 0;
var sumStage = 0;
var sumStart = 0;

$(document).ready(function () {
    $("#myCanvas").hide();
    storybox = $(".storybox");

    $("#customize").on("click", function () {
        settings();
    });

    $("#return_img1").on("click", function () {
        settingsCancel(true);
    });
    $("#return_img2").on("click", function () {
        settingsCancel(false);
    });

    $("input[name='music']").on("click", function () {
        backgroundMusic.src = $("input[name='music']:checked").val();
        backgroundMusic.currentTime = 0;
        backgroundMusic.play();
        if (prevMusicTime) {
            clearTimeout(prevMusicTime);
        }
        prevMusicTime = setTimeout(function () {
            backgroundMusic.pause();
        }, 3000);
    });

    $("input[name='overMusic']").on("click", function () {
        gameoverMusic.src = $("input[name='overMusic']:checked").val();
        gameoverMusic.currentTime = 0;
        gameoverMusic.play();
    });

    $("#musicVolume").on("input", function () {
        $("#musicVolumeValue").text($(this).val());
        backgroundMusic.volume = $(this).val() / 100;
    });

    $("#overVolume").on("input", function () {
        $("#overVolumeValue").text($(this).val());
        gameoverMusic.volume = $(this).val() / 100;
    });

    $("input[name='backColor']").on("click", function () {
        prevCanvas.style.backgroundImage = `url("${$("input[name='backColor']:checked").val()}")`;
    });

    $("input[name='ballColor']").on("click", function () {
        ballColor = $("input[name='ballColor']:checked").val();
    });

    $("#Muteall").change(function () {
        if ($(this).is(":checked")) {
            backgroundMusic.volume = 0;
            $("#musicVolume").prop("disabled", true);
            gameoverMusic.volume = 0;
            $("#overVolume").prop("disabled", true);
        }
        else {
            backgroundMusic.volume = backgroundMusicVolume;
            $("#musicVolume").prop("disabled", false);
            gameoverMusic.volume = gameoverMusicVolume;
            $("#overVolume").prop("disabled", false);
        }
    });

    $("#startGame").on("click", prolog);
    $("#challenge").on("click", challenge);
    $("#exit").on("click", exit);
    $("#exit_img").on("click", finishStory);
    $(document).on("mousemove", mouseMoveSpeed);

    var playTimes = setInterval(function () {
        playTime++;
        if (playTime >= playTimeMax)
            clearInterval(playTimes);
    }, 1000);

    sWidth = $(document).width();
    sHeight = $(document).height();

    padHeight = 10;
    padWidth = 250;

    canvas = document.getElementById("myCanvas");
    canvas.width = sWidth;
    canvas.height = sHeight;

    prevCanvas = document.getElementById("prevCanvas");
    prevCanvas.width = $("#previewbox").width();
    prevCanvas.height = $("#previewbox").height();

    ballRadius = 15;
    ballMoveSpeed = 10;

    brickMargin = 10;
    brickRowCountMax = 12;
    brickColumnCountMax = 30;
    brickMargin = sWidth % (brickColumnCountMax + 1) / 2;
    brickLength = (sWidth - 2 * brickMargin) / (brickColumnCountMax + 1);
    brickSideMargin = brickMargin + brickLength / 2;
    brickTopMargin = brickMargin + brickLength / 2;

    timebarHeight = 20;

    bombLength = 30;
});

function startSlotAnimation(finalScore) {
    var finalScoreStr;
    if (finalScore < 0) {
        finalScoreStr = finalScore.toString();
        finalScoreStr = finalScoreStr.padStart(4, ' ');

    }
    else {
        finalScoreStr = finalScore.toString().padStart(4, '0');
    }


    finalScoreStr.split('').forEach((digit, index) => {
        setTimeout(() => {
            animateDigit(`#digit${index + 1}`, digit);
        }, index * 500);
    });
}

function animateDigit(selector, finalDigit) {
    var $digit = $(selector);
    var numbers = '';

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            numbers += Math.floor(Math.random() * 10) + '<br>';
        }
    }
    numbers += finalDigit + '<br>';

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            numbers += Math.floor(Math.random() * 10) + '<br>';
        }
    }
    $digit.html('<span>' + numbers + '</span>');
    $digit.find('span').css('animation', 'slotSpin 1s linear infinite');
    setTimeout(function () {
        $digit.find('span').css('animation', 'slowStop 1s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards');

    }, 1000);
}

function settings() {
    $("#main_page").hide();
    $("#customize_page").show();

    prevCtx = prevCanvas.getContext("2d");
    prevCtx.clearRect(0, 0, prevCanvas.width, prevCanvas.height);
    prevCanvas.style.backgroundImage = `url("${$("input[name='backColor']:checked").val()}")`;
    prevCanvas.style.backgroundRepeat = "no-repeat";
    prevCanvas.style.backgroundSize = "100% 100%";


    ballX = prevCanvas.width / 2;
    ballY = 50;
    dx = 5;
    dy = 5;
    prevDrawBall();
    prevMove = setInterval(prevMoveBall, 10);

    $("#settingsMenu input[type='radio']").each(function () {
        if ($(this).is(':checked')) {
            initialSettings[$(this).attr('name')] = $(this).val();
        }
    });
    initialSettings["Muteall"] = $("#Muteall").is(":checked");
    initialSettings["musicVolume"] = $("#musicVolume").is(":disabled");
    initialSettings["overVolume"] = $("#overVolume").is(":disabled");
    initialSettings["musicVolumeValue"] = $("#musicVolume").val();
    initialSettings["overVolumeValue"] = $("#overVolumeValue").val();
}

function prevDrawBall() {
    prevCtx.save();
    prevCtx.beginPath();
    prevCtx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2); //(x좌표,y좌표,원 반지름, 시작각도, 끝각도, 그리는 방향)
    prevCtx.fillStyle = ballColor;
    prevCtx.fill();
    prevCtx.closePath();
    prevCtx.restore();
}

function prevMoveBall() {
    prevCtx.save();
    prevCtx.beginPath();
    prevCtx.arc(ballX, ballY, ballRadius + 1, 0, Math.PI * 2);
    prevCtx.closePath();
    prevCtx.clip();
    prevCtx.clearRect(ballX - ballRadius - 1, ballY - ballRadius - 1, ballRadius * 2 + 2, ballRadius * 2 + 2);
    prevCtx.restore();
    if (ballX < ballRadius || ballX > prevCanvas.width - ballRadius)
        dx = -dx;
    if (ballY > prevCanvas.height - ballRadius || ballY < ballRadius) {
        dy = -dy;
    }
    ballX += dx;
    ballY += dy;
    prevDrawBall();
}

function settingsSave() {
    ballColor = $("input[name='ballColor']:checked").val();
    backImage = $("input[name='backColor']:checked").val();
    difficult = $("input[name='difficult']:checked").val();
    var musicSrc = $("input[name='music']:checked").val();
    var overMusicSrc = $("input[name='overMusic']:checked").val();
    backgroundMusic.src = musicSrc;
    gameoverMusic.src = overMusicSrc;

    $("#settingsMenu input[type='radio']:checked").each(function () {
        var name = $(this).attr('name');
        if (initialSettings[name] !== $(this).val()) {
            isCostomize = true;
        }
    });

    $("#customize_page").hide();
    $("#main_page").show();
    clearInterval(prevMove);
}

function settingsCancel(flag) {
    if (flag == true) {
        $("#settingsMenu input[type='radio']").each(function () {
            var name = $(this).attr('name');
            if (initialSettings[name] === $(this).val()) {
                $(this).prop('checked', true);
                if (name == "ballColor")
                    ballColor = $(this).val();
                else if (name == "backColor")
                    backImage = $(this).val();
            }
        });
        $("#Muteall").prop("checked", initialSettings["Muteall"]);
        $("#musicVolume").prop("disabled", initialSettings["musicVolume"]);
        $("#overVolume").prop("disabled", initialSettings["overVolume"]);
        $("#musicVolume").val(initialSettings["musicVolumeValue"]);
        $("#overVolume").val(initialSettings["overVolumeValue"]);
        $("#musicVolumeValue").text($(musicVolume).val());
        $("#overVolumeValue").text($(overVolume).val());
    }

    $("#customize_page").hide();
    $("#challenge_page").hide();
    $("#main_page").show();
    clearInterval(prevMove);
}

function prolog() {
    $("#main_page").hide();
    $("#storyboard").show();
    $(window).keydown(playStory);
}

var index = 0;

function playStory() {
    if ((index) == storybox.length) {
        finishStory();
    }
    else {
        // console.log("index: " + index + "\nstorybox[index]" + storybox[index]);
        storybox.eq(index).css("display", "flex");
        index++;
    }

}

function finishStory() {
    $(window).off();
    $("#storyboard").hide();
    gameStart();
}


function showResult(state) { //중간에 정답 도전할 때(0), 공 떨궈서 실패했을때(1), 끝까지 성공했을때(2)
    $("#myCanvas").hide();
    $("#main_menu").show();
    $("#result_page").show();
    switch (state) {
        case 0:
            $("#answer_box").show();
            $("#user_anwser").focus();

            clearInterval(ball);
            clearInterval(timebar);
            clearInterval(bomb);
            backgroundMusic.pause();

            $("#user_anwser").keydown(function (e) {
                if (e.keyCode == 13) {
                    check_answer();
                }
            }); //enter 이벤트 핸들러 연결
            break;
        case 1:
            $("#_box").show();
            $("#failed").show();

            gameOver();
            gameoverMusic.currentTime = 0;
            gameoverMusic.play();
            startSlotAnimation(score);

            setTimeout(function () {
                $("#_box").hide();
                $("#failed").hide();
                $("#result_page").hide();
                $("#main_page").show();
                score = 0;
                main_BGM.play();
            }
                , 5000);
            break;
        case 2:
            $("#_box").show();
            $("#success").show();

            gameOver();

            startSlotAnimation(score);
            setTimeout(function () {
                $("#_box").hide();
                $("#success").hide();
                $("#result_page").hide();
                $("#main_page").show();
                score = 0;
                main_BGM.play();
            }
                , 5000);
            break;

        default:
    }



}

function challenge() {
    $("#main_page").hide();
    challengeChange();
    profilesChange();
    $("#challenge_page").show();
}

function challengeChange() {
    $("#touchBarCnt").text(`발판에 닿은 횟수 (${touchBarCnt}/${touchBarCntMax})`);
    if (touchBarCnt >= touchBarCntMax) $("#touchBarCnt").attr("class", "clearedassignment");

    $("#isCostomize").text(`설정에서 디자인 변경`);
    if (isCostomize == true) $("#isCostomize").attr("class", "clearedassignment");

    $("#deadCnt").text(`스테이지 실패 횟수 (${deadCnt}/${deadCntMax})`);
    if (deadCnt >= deadCntMax) $("#deadCnt").attr("class", "clearedassignment");

    $("#playTime").text(`플레이 시간 (${playTime}/${playTimeMax}) (단위: 초)`);
    if (playTime >= playTimeMax) $("#playTime").attr("class", "clearedassignment");

    $("#clearCnt").text(`스테이지 성공 횟수 (${clearCnt}/${clearCntMax})`);
    if (clearCnt >= clearCntMax) $("#clearCnt").attr("class", "clearedassignment");
}

function profilesChange() {
    if (sumStart == 0) {
        $("#maxAlive").text(`최고 생존 시간 : ${parseInt(maxAlive)}초`);
        $("#meansAlive").text(`평균 생존 시간 : ${sumAlive}초`);
        $("#maxScore").text(`최고 점수 : ${maxScore}점`);
        $("#meansScore").text(`평균 점수 : ${sumScore}점`);
        $("#maxStage").text(`최고 스테이지 : ${maxStage}`);
        $("#meansStage").text(`평균 스테이지 : ${sumStage}`);
        $("#sumStart").text(`플레이 횟수 : ${sumStart}회`);
    }
    else {
        $("#maxAlive").text(`최고 생존 시간 : ${parseInt(maxAlive)}초`);
        $("#meansAlive").text(`평균 생존 시간 : ${parseInt(sumAlive / sumStart)}초`);
        $("#maxScore").text(`최고 점수 : ${maxScore}점`);
        $("#meansScore").text(`평균 점수 : ${parseInt(sumScore / sumStart)}점`);
        $("#maxStage").text(`최고 스테이지 : ${maxStage}`);
        $("#meansStage").text(`평균 스테이지 : ${parseInt(sumStage / sumStart)}`);
        $("#sumStart").text(`플레이 횟수 : ${sumStart}회`);
    }
}