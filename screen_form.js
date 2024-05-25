var ballColor = "black";
var backImage = "background1.jpg";
var backgroundMusic = new Audio("backgroundmusic1.wav");
backgroundMusic.loop = true;
var gameoverMusic = new Audio("gameover1.wav");
var backgroundMusicVolume = 0.5;
var gameoverMusicVolume = 0.5;

var storybox;

$(document).ready(function() {
    $("#myCanvas").hide();
    storybox = $(".storybox");

    $("#customize").on("click", function() {
        settings();
    });

    $("#return_img1").on("click", function() {
        settingsCancel();
    });
     $("#return_img2").on("click", function() {
        settingsCancel();
    });

    $("#musicVolume").on("input", function() {
        $("#musicVolumeValue").text($(this).val());
        backgroundMusic.volume = $(this).val() / 100;
    });

    $("#overVolume").on("input", function() {
        $("#overVolumeValue").text($(this).val());
        gameoverMusic.volume = $(this).val() / 100;

    $("#Muteall").change(function(){
        if($(this).is(":checked")){
           backgroundMusic.volume=0;
           $("#musicVolume").val(0).prop("disabled",true);
           $("#musicVolumeValue").text(0);
           gameoverMusic.volume=0;
           $("#overVolume").val(0).prop("disabled",true);
           $("#overVolumeValue").text(0);
        }
        else{
            var volume=50;
            backgroundMusic.volume=volume/100;
            $("#musicVolume").val(50).prop("disabled",false);
            $("#musicVolumeValue").text(50);
            gameoverMusic.volume=volume/100;
            $("#overVolume").val(50).prop("disabled",false);
            $("#overVolumeValue").text(50);
        }
    });
});

    $("#startGame").on("click", prolog);
    $("#challenge").on("click", challenge);
    $("#exit").on("click", exit);  
    $("#exit_img").on("click", finishStory);
    $(document).on("mousemove", mouseMoveSpeed);
});

function startSlotAnimation(finalScore) {
    var finalScoreStr = finalScore.toString().padStart(4, '0');

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
            numbers += Math.floor(Math.random()*10) + '<br>';
        }
    }
    numbers += finalDigit + '<br>'; 

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            numbers += Math.floor(Math.random()*10) + '<br>';
        }
    }
    $digit.html('<span>' + numbers + '</span>');
    $digit.find('span').css('animation', 'slotSpin 1s linear infinite');
    setTimeout(function() {
        $digit.find('span').css('animation', 'slowStop 1s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards');
        
    }, 1000); 
}

function settings() {
    $("#main_page").hide();
    $("#customize_page").show();
}

function settingsSave() {
    ballColor = $("input[name='ballColor']:checked").val();
    backImage = $("input[name='backColor']:checked").val();
    var musicSrc = $("input[name='music']:checked").val();
    var overMusicSrc = $("input[name='overMusic']:checked").val();

    backgroundMusic.src = musicSrc;
    gameoverMusic.src = overMusicSrc;
    $("#customize_page").hide();
    $("#main_page").show();
}

function settingsCancel() {
    $("#customize_page").hide();
    $("#challenge_page").hide();
    $("#main_page").show();
}

function prolog(){
    $("#main_page").hide();
    $("#storyboard").show();
    $(window).keydown(playStory);
}


var index = 0;

function playStory(){
    if((index)== storybox.length ){
        finishStory();
    }
    else{
        console.log("index: "+index+"\nstorybox[index]"+ storybox[index]);
        storybox.eq(index).css("display", "flex");
        index++;
    }
   
}

function finishStory(){
    $(window).off();
    $("#storyboard").hide();
    gameStart();
}


function showResult(){
    $("#main_menu").show();
    $("#result_page").show();
    startSlotAnimation(score);
}

function challenge(){
    $("#main_page").hide();
    $("#challenge_page").show();
}