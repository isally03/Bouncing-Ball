$(document).ready(function() {
    function startPachinkoAnimation(finalScore) {
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
    startPachinkoAnimation(3654);
});