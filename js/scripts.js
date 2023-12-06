document.addEventListener('DOMContentLoaded', function () {
    const numEyes = getRandomInt(4, 8); // Updated number of eyes between 4 and 8
    const minDistance = 320; // Updated minimum distance between eyes and edges
    const eyes = [];

    const backgroundMusic = document.getElementById('backgroundMusic');
            
    document.addEventListener('click', function() {
        // Play background music on any click
        if (backgroundMusic.paused) {
            backgroundMusic.play();
        } else {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }
    });

    document.onmousemove = function (event) {
        for (const eye of eyes) {
            const iris = eye.querySelector('.iris');
            moveIrisToMouse(event, eye, iris);
        }
    };

    for (let i = 0; i < numEyes; i++) {
        createEye();
    }

    function createEye() {
        const eye = document.createElement('div');
        eye.classList.add('eye');

        const iris = document.createElement('div');
        iris.classList.add('iris');

        const pupil = document.createElement('div');
        pupil.classList.add('pupil');

        const blackBar = document.createElement('div');
        blackBar.classList.add('black-bar');

        iris.appendChild(pupil);
        eye.appendChild(iris);
        eye.appendChild(blackBar);

        eye.addEventListener('click', function () {
            removeIrisAndPupil(blackBar);
            setTimeout(() => restoreEye(blackBar), 3000);
        });

        let isValidPosition = false;

        while (!isValidPosition) {
            const randomX = Math.random() * (window.innerWidth - minDistance);
            const randomY = Math.random() * (window.innerHeight - minDistance);

            isValidPosition = checkCollision(randomX, randomY);
            
            if (isValidPosition) {
                eye.style.left = `${randomX}px`;
                eye.style.top = `${randomY}px`;
                eyes.push(eye);
            }
        }

        document.body.appendChild(eye);
        randomizeIrisColor(iris);
    }

    function removeIrisAndPupil(blackBar) {
        blackBar.style.display = 'block';
        blackBar.classList.remove('hide-animation'); // Remove the hide-animation class
        blackBar.classList.add('reveal-animation');
    }

    function restoreEye(blackBar) {
        blackBar.classList.remove('reveal-animation');
        blackBar.classList.add('hide-animation');
        setTimeout(() => {
            blackBar.style.display = 'none';
            blackBar.classList.remove('hide-animation');
        }, 150); // Wait for the hide animation to complete
    }

    function checkCollision(x, y) {
        for (const existingEye of eyes) {
            const existingX = parseFloat(existingEye.style.left);
            const existingY = parseFloat(existingEye.style.top);

            const distance = Math.sqrt((x - existingX) ** 2 + (y - existingY) ** 2);

            if (distance < minDistance) {
                return false;
            }
        }

        return true;
    }

    function moveIrisToMouse(event, eye, iris) {
        const eyeRect = eye.getBoundingClientRect();
        const irisWidth = parseFloat(window.getComputedStyle(iris).width);
        const irisHeight = parseFloat(window.getComputedStyle(iris).height);

        const irisX = event.clientX - eyeRect.left - irisWidth / 2;
        const irisY = event.clientY - eyeRect.top - irisHeight / 2;

        iris.style.left = `${Math.max(0, Math.min(eyeRect.width - irisWidth, irisX))}px`;
        iris.style.top = `${Math.max(0, Math.min(eyeRect.height - irisHeight, irisY))}px`;
    }

    function randomizeIrisColor(iris) {
        const randomColor = getRandomColor();
        iris.style.backgroundColor = randomColor;
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
});