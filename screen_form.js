$(document).ready(function() {
    var backImage;
    var backgroundMusic = new Audio("backgroundmusic1.wav");
    backgroundMusic.loop = true;
    var gameoverMusic = new Audio("gameover1.wav");
    var backgroundMusicVolume;
    var gameoverMusicVolume;
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
        $digit.find('span').css('animation', 'slotSpin 2s linear infinite');
        setTimeout(function() {
            $digit.find('span').css('animation', 'slowStop 1s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards');
            
        }, 2000); 
    }

    function settings() {
    $("#main_page").hide();

    if ($("#settingsMenu").length === 0) {
        var settingsMenu=$("<div>",{
            id:"settingsMenu"
        }).appendTo("#configbox");

        //공 색깔 관련 환경설정
        var ballLabel = $("<label>", { id: "ball_label" }).text("공 색깔 선택: ").appendTo(settingsMenu);
        var ballSelect = $("<select>", {
            id: "ballSelect"
        }).appendTo(settingsMenu);
        var balls = ["공1", "공2", "공3"];
        $.each(balls, function (index, ball) {
            $("<option>", {
                value: ball,
                text: ball
            }).appendTo(ballSelect);
        });

        //게임 배경 화면 관련 환경설정
        var backLabel = $("<label>", { id: "back_label" }).text("배경 색상 선택: ").appendTo(settingsMenu);
        var backselect = $("<select>", {
            id: "backSelect"
        }).appendTo(settingsMenu);
        var backgrounds = ["배경1", "배경2", "배경3"];
        $.each(backgrounds, function (index, background) {
            $("<option>", {
                value: background,
                text: background
            }).appendTo(backSelect);
        });

        //게임 배경 음악 관련 환경설정
        var musicLabel = $("<label>", { id: "music_label" }).text("배경 음악 선택: ").appendTo(settingsMenu);
        var musicselect = $("<select>", {
            id: "musicSelect"
        }).appendTo(settingsMenu);
        var backmusics = ["음악1", "음악2", "음악3"];
        $.each(backmusics, function (index, backmusic) {
            $("<option>", {
                value: backmusic,
                text: backmusic
            }).appendTo(musicSelect);
        });
        var musicVolumeLabel = $("<label>", { id: "music_volume_label" }).text("배경 음악 음량: ").appendTo(settingsMenu);
        var musicVolumeSlider = $("<input>", {
            type: "range",
            id: "musicVolume",
            min: 0,
            max: 100,
            value: 50
        }).appendTo(settingsMenu);
        var musicVolumeValue=$("<span>",{
            id:"musicVolumeValue"
        }).text(musicVolumeSlider.val()).css("margin-left","5px").appendTo(settingsMenu);

        //게임 실패 음악 관련 환경설정
        var overLabel = $("<label>", { id: "over_label" }).text("실패 음악 선택: ").appendTo(settingsMenu);
        var overselect = $("<select>", {
            id: "overSelect"
        }).appendTo(settingsMenu);
        var overmusics = ["효과음1", "효과음2", "효과음3"];
        $.each(overmusics, function (index, overmusic) {
            $("<option>", {
                value: overmusic,
                text: overmusic
            }).appendTo(overSelect);
        });
        var overVolumeLabel = $("<label>", { id: "over_volume_label" }).text("실패 음악 음량: ").appendTo(settingsMenu);
        var overVolumeSlider = $("<input>", {
            type: "range",
            id: "overVolume",
            min: 0,
            max: 100,
            value: 50
        }).appendTo(settingsMenu);
        var overVolumeValue=$("<span>",{
            id:"overVolumeValue"
        }).text(overVolumeSlider.val()).css("margin-left","5px").appendTo(settingsMenu);

        $("<br>").appendTo(settingsMenu);
        $("<br>").appendTo(settingsMenu);

        if ($("#settings"))
            var saveButton = $("<input>", {
                type: "button", value: "저장"
            }).css("margin-right", "10px").appendTo(settingsMenu).on("click", settingsSave);
        var cancelButton = $("<input>", {
            type: "button", value: "취소"
        }).appendTo(settingsMenu).on("click", settingsCancel);
        musicVolumeSlider.on("input",function(){
            $("#musicVolumeValue").text($(this).val());
        });
        overVolumeSlider.on("input",function(){
            $("#overVolumeValue").text($(this).val());
        });
    }
    else {
        $("#settingsMenu").show();
    }
}
function settingsSave() {
    var selectBall = $("#ballSelect").val();
    if (selectBall === "공1") {
        ballColor = "black";
    }
    else if (selectBall === "공2") {
        ballColor = "red";
    }
    else {
        ballColor = "blue";
    }
    var selectBack = $("#backSelect").val();
    if (selectBack === "배경1") {
        backImage = "url(\"background1.jpg\")";
    }
    else if (selectBack === "배경2") {
        backImage = "url(\"background2.jpg\")";
    }
    else {
        backImage = "url(\"background3.png\")";
    }
    var selectMusic = $("#musicSelect").val();
    if (selectMusic === "음악1") {
        backgroundMusic.src = "backgroundmusic1.wav";
    }
    else if (selectMusic === "음악2") {
        backgroundMusic.src = "backgroundmusic2.mp3";
    }
    else {
        backgroundMusic.src = "backgroundmusic3.mp3";
    }
    var selectOver = $("#overSelect").val();
    if (selectOver === "효과음1") {
        gameoverMusic.src = "gameover1.wav";
    }
    else if (selectOver === "효과음2") {
        gameoverMusic.src = "gameover2.wav";
    }
    else {
        gameoverMusic.src = "gameover3.wav";
    }

    $("#settingsMenu").hide();
    $("#main_page").show();
}
function settingsCancel() {
    $("#settingsMenu").hide();
    $("#main_page").show();
}
    $("#customize").on("click",function(){
        $("#customize_page").css("display","block");
        settings();
    });
    $("#return_img").on("click",function(){
        $("#customize_page").hide();
        $("#main_page").show();
    })

});