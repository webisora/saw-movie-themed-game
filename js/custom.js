let startButton = geid("startArea");
let gameOver = geid("gameOver");
let gameCompleted = geid("gameCompleted");

let timerElement = geid("timer");
let tryAgain = geid("tryAgain");
let blades = geid("blades");

let gameStarted = false;

startButton.addEventListener('click', function () {
    init();
})

tryAgain.addEventListener('click', function () {
    init();
});

let slideIndex = 0;

function init() {

    gameStarted = true;
    blades.style.opacity = 1;
    fadeIn(blades);
    fadeOut(gameOver);
    fadeIn(timerElement);
    /* Hide all the instructions */
    hideElementsAfterInit();

    let edge = geid('edge');

    let firstUnlocked = false;
    let secondUnlocked = false;
    let thirdUnlocked = false;
    let isCompleted = false;


    let today = new Date();
    /* timer for players to complete the game */
    let end = today.setSeconds(today.getSeconds() + 10);

    let _second = 1000;
    let _minute = _second * 60;
    let _hour = _minute * 60;
    let _day = _hour * 24;
    let timer;

    /* Rotate blade infinitely */
    const bladeRotation = new Propeller(edge, {
        inertia: 1, speed: 1,
    });

    let circle1Rotation = customPropeller("circle-1");
    let circle2Rotation = customPropeller("circle-2");
    let circle3Rotation = customPropeller("circle-3");

    function customPropeller(element) {
        let el = geid(element);

        return new Propeller(el, {
            angle: getRandomAngle(10, 170),
            inertia: 0,
            speed: 1,
            step: 10,
            stepTransitionTime: 100,
            stepTransitionEasing: "Linear",
            onRotate: function () {
                /* Add a glowing effect if the circle is in correct position */
                if (this.angle % 360 == 0 || this.angle == 0) {
                    addClass(el, "glow");
                }
                else {
                    removeClass(el, "glow");
                }
            },
            onDragStop: function () {
                checkIfUnlocked(this, element);
            },
        });
    }


    function checkIfUnlocked(element, flag) {

        if ((element.angle % 360 == 0 || element.angle == 0) && element.listenersInstalled) {
            element.unbind();

            if (flag == "circle-1") {
                firstUnlocked = true;
            }
            else if (flag == "circle-2") {
                secondUnlocked = true;
            }
            else if (flag == "circle-3") {
                thirdUnlocked = true;
            }
        }

        if (firstUnlocked && secondUnlocked && thirdUnlocked) {
            console.log("You survived");
            isCompleted = true;
        }

    }

    /* Game timer */
    function checkTimeMsec(i) { if (i < 10) { i = "0" + i; } return i; }
    function checkTime(i) { if (i < 10) { i = "0" + i; } return i; }

    timer = setInterval(showRemaining, 31);

    function showRemaining() {
        let now = new Date();
        let distance = end - now;
        timerElement.innerHTML = "";

        if (distance <= 0 && !isCompleted) {

            fadeIn(gameOver);
            fadeOut(timerElement);
            clearInterval(timer);

            blades.style.opacity = 0.5;

            circle1Rotation.unbind();
            circle2Rotation.unbind();
            circle3Rotation.unbind();

            console.log("You did not make it! Try again !");
        }
        else if (distance > 0 && isCompleted) {

            fadeIn(gameCompleted);
            fadeOut(timerElement);

            clearInterval(timer);

            bladeRotation.stop();
            bladeRotation.unbind();

            console.log("You survived");
        }

        let seconds = checkTime(Math.floor((distance % _minute) / _second));
        let milliseconds = checkTimeMsec(Math.floor((distance % _second) / 10));
        out = '<div class="seconds">' + seconds + '</div>' + '<span>:</span>' +
            '<div class="milliseconds">' + milliseconds + '' + '</div>';
        timerElement.innerHTML = out;
    }
}

/* Positioning the circles in random position */
function getRandomAngle(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function geid(el) {
    return document.getElementById(el);
}

function hideElementsAfterInit() {
    document.querySelectorAll(".hideAfterInit").forEach(el => fadeOut(el));
}

function fadeIn(el) {
    addClass(el, 'show');
    removeClass(el, 'hide');
}

function fadeOut(el) {
    addClass(el, 'hide');
    removeClass(el, 'show');
}

function addClass(el, className) {
    el.classList.add(className);
}

function removeClass(el, className) {
    el.classList.remove(className);
}