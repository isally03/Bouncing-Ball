$(document).ready(function() {
    var backImage;
    var backgroundMusic = new Audio("backgroundmusic1.wav");
    backgroundMusic.loop = true;
    var gameoverMusic = new Audio("gameover1.wav");
    var backgroundMusicVolume;
    var gameoverMusicVolume;
    backgroundMusic.volume=0.5;
    gameoverMusic.volume=0.5;
     $("#customize").on("click", function() {
        settings();
    });

    $("#return_img").on("click", function() {
        settingsCancel();
    });

    $("#musicVolume").on("input", function() {
        $("#musicVolumeValue").text($(this).val());
        backgroundMusic.volume = $(this).val() / 100;
    });

    $("#overVolume").on("input", function() {
        $("#overVolumeValue").text($(this).val());
        gameoverMusic.volume = $(this).val() / 100;
    });
    $("#save_button").on("click",function(){
        settingsSave();
    })
    $("#cancel_button").on("click",function(){
        settingsCancel();
    })

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
        $("#customize_page").show();
    }

    function settingsSave() {
        ballColor = $("input[name='ballColor']:checked").val();
        backImage = $("input[name='backImage']:checked").val();
        var musicSrc = $("input[name='music']:checked").val();
        var overMusicSrc = $("input[name='overMusic']:checked").val();

        backgroundMusic.src = musicSrc;
        gameoverMusic.src = overMusicSrc;
        $("#customize_page").hide();
        $("#main_page").show();
    }

    function settingsCancel() {
        $("#customize_page").hide();
        $("#main_page").show();
    }
});