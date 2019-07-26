let timerLength;
let left;
let right;
let questions;

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
let questionNumber = 1;
let currentQuestion;
let buttonsActive = false;

function newGame() {
    questions = [
        new Question('What does Hitagi Senjougahara slip on in the first episode of Bakemonogatari?',
            'A Banana Peel',
            'A Crab',
            'An Oil-Spill',
            'A Stapler'
        ),
        new Question('What is the perfect (ultimate in English) form of Gomamon in Digimon Adventure?',
            'Zudomon',
            'Ikakumon',
            'WarGreymon',
            'Megadramon'),

        new Question('What fictional metal is MetalEtemon made of in Digimon Adventure?',
            'Chrome Digizoid',
            'Adamantium',
            'Digichalcum',
            'Mythril'
        )
    ]
}

function nextQuestion() {
    questions = questions.reduce((a, v) => a.splice(Math.floor(Math.random() * a.length), 0, v) && a, []);
    currentQuestion = questions.pop();
    displayQuestion(currentQuestion);
}

function displayQuestion(question) {
    const options = question.options; // Shuffles every time we ask for it, so need to store the result
    $('.answer-box').children().each(function (i) {
        $(this).text(options[i]).attr('data-answer', options[i])
    });

    $('#question').text(currentQuestion.question);

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
    blackScene(questionNumber, 'Not answered').then(nextQuestion);
}

function blackScene(number, message) {
    $('.container').append(
        $('<div class="black-scene">').append(
            $('<h1 class="black-scene-number">').text(number),
            $('<h3 class="black-scene-message">').text(message),
        )
    );
    return new Promise(resolve => setTimeout(() => {
        $('.black-scene').remove();
        resolve();
    }, 1000)); // It flashes by pretty fast to mimic the 'black scenes' in bakemonogatari
}


$(document).ready(function () {


    console.log('debug');

    drawSvgBorder($('#timer-fill'));

    newGame();
    nextQuestion();


    $('.answer-box').on('click', '.answer', function () {
        if (buttonsActive) {
            let message = `Question ${questionNumber.toString().padStart(3 - questionNumber.toString().length, '0')} `;
            if ($(this).attr('data-answer') == currentQuestion.answer) {
                message += 'correct'
            } else {
                console.log($(this).attr('data-answer'))
                console.log('Incorrect');
                message += 'incorrect'
            }
            questionNumber++;
            blackScene(questionNumber, message).then(nextQuestion);
        }
    })

})