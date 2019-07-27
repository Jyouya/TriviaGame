let timerLength;
let left;
let right;
let questions;
let score;
let questionNumber;
let currentQuestion;
let buttonsActive;
let timeout;

function drawSvgBorder(node) {
    node.empty();

    const w = node.parent().width() / 2;
    const h = node.parent().height();
    node.attr('viewBox', `0 0 ${w * 2} ${h}`)

    // quick function for drawing the path
    const path = flip => `M${w},0 l${flip * (w - 25)},0 a${flip * 25},25 0 0,${flip == 1 ? 1 : 0} ${flip * 25},25 l0,${h - 50} a25,25 0 0,${flip == 1 ? 1 : 0} ${flip * -25},25 l${flip * -(w - 25)},0`

    right = $('<path class=timer-path>').attr({
        'fill': '#FFFFFF00',
        'stroke': '#57a4b8',
        'stroke-width': "25",
        'd': path(1),
    });

    left = $('<path class=timer-path>').attr({
        'fill': '#FFFFFF00',
        'stroke': '#57a4b8',
        'stroke-width': "25",
        'd': path(-1),
    });

    node.append(
        right,
        left
    );

    node.parent().html(node.parent().html()); // hack to make the svg render

    // const svg = document.getElementById('timer-fill').contentDocument;
    // console.log(svg);

    timerLength = document.querySelector('path').getTotalLength();
    console.log(timerLength);

    // left = $('#left').css({
    //     'stroke-dasharray': timerLength,
    //     'stroke-dashoffset': timerLength
    // })

    $('.timer-path').css({
        'stroke-dasharray': timerLength,
        'stroke-dashoffset': timerLength
    })

    node.parent().html(node.parent().html());


}

function newGame() {
    score = 0;
    questionNumber = 1;
    currentQuestion;
    buttonsActive = false;
    questions = [
        new Question('What does Hitagi Senjougahara slip on in the first episode of Bakemonogatari?',
            'A Banana Peel',
            'A Crab',
            'A Puddle',
            'A Stapler'
        ),
        new Question('What is the perfect (ultimate in English) form of Gomamon in Digimon Adventure?',
            'Zudomon',
            'Ikakumon',
            'WarGreymon',
            'Megadramon'
        ),
        new Question('What fictional metal is MetalEtemon made of in Digimon Adventure?',
            'Chrome Digizoid',
            'Tempered Digimantium',
            'Digichalcum',
            'Star Platinum'
        ),
        new Question('Which of the following is NOT one of the Pillar-Men from Jojo\'s Bizzare Adventure',
            'Kiss',
            'Cars',
            'Wham',
            'ACDC'
        ),
        new Question('Which character is known for their catchphrase: "You\'re already dead"',
            'Kenshiro',
            'Jotaro Kujo',
            'Haruhi Suzumiya',
            'Amuro Ray'
        ),
        new Question('Which of the following is NOT a servant class in Fate/Stay Night',
            'Healer',
            'Saber',
            'Archer',
            'Caster'
        )

    ]


    blackScene(questionNumber, 'Black  Scene').then(nextQuestion());
}


function nextQuestion() {
    questions = questions.reduce((a, v) => a.splice(Math.floor(Math.random() * (a.length + 1)), 0, v) && a, []);
    currentQuestion = questions.pop();
    displayQuestion(currentQuestion);
}

function displayQuestion(question) {
    const options = question.options; // Shuffles every time we ask for it, so need to store the result
    $('.answer-box').children().each(function (i) {
        $(this).text(options[i]).attr('data-answer', options[i])
    });

    $('#question').text(currentQuestion.question);

    timeout = false; // stop the animation complete callback from being called twice;
    $('.timer-path').stop().css({ 'stroke-dashoffset': timerLength }).attr('data-color', 'blue').animate({ // Animate the bar's movement
        'stroke-dashoffset': 0,
    }, {
            duration: 15000,
            easing: 'linear',
            step: function (val) { // Animate the bar's color changing
                if (val > timerLength / 2) {
                    $(this).attr({ stroke: '#57a4b8' });
                } else if ($(this).attr('data-color') == 'blue' && val > timerLength / 4) {
                    $(this).attr('data-color', 'yellow');
                    const color = {
                        red: 87,
                        green: 164,
                        blue: 184
                    }
                    $(color).animate(
                        {
                            red: 245,
                            green: 180,
                            blue: 34
                        },
                        {
                            duration: 1000,
                            step: function (tween, el) {
                                color[el.prop] = tween;
                                $(this).attr('stroke', `rgb(${color.red}, ${color.green}, ${color.blue})`)
                            }.bind(this)
                        });

                    // $(this).attr({stroke: '#f5b422'},1000);
                } else if ($(this).attr('data-color') != 'red' && val < timerLength / 4) {
                    $(this).attr('data-color', 'red');
                    const color = {
                        red: 245,
                        green: 180,
                        blue: 34
                    }
                    $(color).animate(
                        {
                            red: 242,
                            green: 2,
                            blue: 5
                        },
                        {
                            duration: 1000,
                            step: function (tween, el) {
                                color[el.prop] = tween;
                                $(this).attr('stroke', `rgb(${color.red}, ${color.green}, ${color.blue})`)
                            }.bind(this)
                        });

                    $(this).animate({ stroke: 'rgb(242, 2, 5)' }, 1000);
                }
            },
            done: timeUp
        });

    buttonsActive = true;
}

function timeUp() {
    console.log('timeup');
    if (!timeout) {
        timeout = true;
        if (questions.length) {
            questionNumber++;
            blackScene(questionNumber, 'Not answered', `Score: ${score}`).then(nextQuestion);
        } else {
            endScreen().then(newGame);
        }
    }
}

function blackScene(number, ...messages) {
    $('.container').append(
        $('<div class="black-scene">').append(
            $('<h1 class="black-scene-number">').text(`${number.toString().padStart(3, '0')}`),

            $('<div class="black-scene-message-box">').append(
                // use map to create an array of messages, then unpack them with the spread operator
                ...messages.map(message => $('<h3 class="black-scene-message">').text(message))
            )
        )
    );
    return new Promise(resolve => setTimeout(() => {
        $('.black-scene').remove();
        resolve();
    }, 1000)); // It flashes by pretty fast to mimic the 'black scenes' in bakemonogatari
}

function titleScreen() {
    $('.container').append(
        $('<div class="title-screen">').append(
            $('<h1 class="main-title">').text('Weeb Trivia'),
            $('<div class="start-btn">').append(
                ...[1, 2, 3, 4].map($.bind(null, '<div>')), // Create 4 empty divs
                $('<div class="start-btn-text">').text('Start!'),
            )
        )
    );
    return new Promise(resolve => {
        $('.start-btn').on('click', function () {
            $('.title-screen').remove();
            resolve();
        })
    });
}

function endScreen() {
    $('.container').append(
        $('<div class="title-screen">').append(
            $('<h1 class="main-title">').text(score == questionNumber ? 'Perfect!' : (score >= questionNumber * 3 / 4 ? 'Great Job!' : 'Better luck next time!')),
            $('<h2 class="end-message">').text(`You scored ${score} out of ${questionNumber}`),
            $('<div class="start-btn play-again">').append(
                ...[1, 2, 3, 4].map($.bind(null, '<div>')), // Create 4 empty divs
                $('<div class="start-btn-text">').text('Play Again!')
            )
        )
    );
    return new Promise(resolve => {
        $('.play-again').on('click', function () {
            $('.title-screen').remove();
            resolve();
        });
    });
}

$(document).ready(function () {

    // Draw our border timer.  May need to be redrawn if the screen size changes
    drawSvgBorder($('#timer-fill'));

    // Display the title screen, then initialize the game when the title screen is done
    titleScreen().then(newGame);

    // Main game loop
    $('.answer-box').on('click', '.answer', function (e) {
        if (buttonsActive) {
            $('.timer-path').stop()
            let message = '';
            if ($(this).attr('data-answer') == currentQuestion.answer) {
                message += 'Correct';
                score++;
            } else {
                console.log($(this).attr('data-answer'))
                console.log('Incorrect');
                message += 'Incorrect';
            }

            if (questions.length) {
                questionNumber++;
                blackScene(questionNumber, message, `Score: ${score}`).then(nextQuestion);
            } else {
                endScreen().then(newGame);
            }
        }
    });
})