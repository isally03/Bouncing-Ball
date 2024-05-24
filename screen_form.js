$(document).ready(function() {
    function startPachinkoAnimation(finalScore) {
        var finalScoreStr = finalScore.toString().padStart(4, '0');

        finalScoreStr.split('').forEach((digit, index) => {
            setTimeout(() => {
                animateDigit(`#digit${index + 1}`, digit);
            }, index * 500); // Delay each animation start by 500ms
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
        numbers += finalDigit + '<br>'; // Ensure the final digit is the last number

        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                numbers += Math.floor(Math.random()*10) + '<br>';
            }
        }
        $digit.html('<span>' + numbers + '</span>');
        
        // Start the animation
        $digit.find('span').css('animation', 'slotSpin 2s linear infinite');
        
        // Stop the animation after a few seconds and display the final digit with a slowing effect
        setTimeout(function() {
            $digit.find('span').css('animation', 'slowStop 1s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards');
            // setTimeout( 1000); // Duration of the slow stop animation
        }, 2000); // Duration of the main animation before stopping
    }

    // Example usage: Start the animation with a final score of 3654
    startPachinkoAnimation(3654);
});