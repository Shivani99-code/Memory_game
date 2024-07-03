document.addEventListener('DOMContentLoaded', () => {
    const cardsArray = [
        { name: 'A', img: 'images/image1.jpg' },
        { name: 'B', img: 'images/image2.jpg' },
        { name: 'C', img: 'images/image3.jpg' },
        { name: 'D', img: 'images/image4.jpg' },
        { name: 'E', img: 'images/image5.jpg' },
        { name: 'F', img: 'images/image6.jpg' },
        { name: 'G', img: 'images/image7.jpg' },
        { name: 'H', img: 'images/image8.jpg' },
        { name: 'I', img: 'images/image9.jpg' },
        { name: 'J', img: 'images/image10.jpg' },
        { name: 'K', img: 'images/image11.jpg' },
        { name: 'L', img: 'images/image12.jpg' }
    ];

    const gameBoard = document.getElementById('game-board');
    const resetButton = document.getElementById('reset-button');
    const winPopup = document.getElementById('win-popup');
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');
    const levelSelector = document.getElementById('level-selector');
    const currentLevelDisplay = document.getElementById('current-level');
    const nextLevelButton = document.getElementById('next-level-button');

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matches = 0;
    let isPaused = false;
    let level = 1;

    function shuffle(array) {
        array.sort(() => 0.5 - Math.random());
    }

    function createBoard(level) {
        gameBoard.innerHTML = '';
        matches = 0;
        firstCard = null;
        secondCard = null;
        lockBoard = false;

        let selectedCardsArray = cardsArray.slice(0, level * 4);
        shuffle(selectedCardsArray);
        let gameCardsArray = selectedCardsArray.concat(selectedCardsArray);
        shuffle(gameCardsArray);

        gameBoard.style.gridTemplateColumns = `repeat(${Math.min(level * 2, 6)}, 100px)`;
        gameCardsArray.forEach((card) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.name = card.name;

            const frontFace = document.createElement('div');
            frontFace.classList.add('front');
            frontFace.style.backgroundImage = `url(${card.img})`;

            const backFace = document.createElement('div');
            backFace.classList.add('back');
            backFace.textContent = card.name;

            cardElement.appendChild(frontFace);
            cardElement.appendChild(backFace);

            cardElement.addEventListener('click', flipCard);

            gameBoard.appendChild(cardElement);
        });
    }

    function flipCard() {
        if (lockBoard || isPaused) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.name === secondCard.dataset.name;

        if (isMatch) {
            disableCards();
            matches += 2;

            if (matches === level * 8) {
                setTimeout(() => {
                    winPopup.style.display = 'flex';
                }, 500);
            }
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');

            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    function togglePause() {
        isPaused = !isPaused;
        if (isPaused) {
            pauseButton.textContent = 'Resume';
        } else {
            pauseButton.textContent = 'Pause';
        }
    }

    function changeLevel(event) {
        level = parseInt(event.target.value);
        currentLevelDisplay.textContent = `Current Level: ${level}`;
        changeTheme(level);
        createBoard(level);
    }

    function changeTheme(level) {
        const backgroundColors = [
            '#f0f0f0',   // Theme color
            '#ffebcd',   
            '#add8e6',   
            '#90ee90',   
            '#ffa07a'    
        ];

        document.body.style.backgroundColor = backgroundColors[level - 1];
    }

    function nextLevel() {
        if (level < 5) {
            level++;
            levelSelector.value = level;
            currentLevelDisplay.textContent = `Current Level: ${level}`;
            changeTheme(level);
            createBoard(level);
            winPopup.style.display = 'none';
        }
    }

    resetButton.addEventListener('click', () => {
        winPopup.style.display = 'none';
        createBoard(level);
    });

    playButton.addEventListener('click', () => {
        isPaused = false;
        pauseButton.textContent = 'Pause';
        createBoard(level);
    });

    pauseButton.addEventListener('click', togglePause);

    winPopup.addEventListener('click', () => {
        winPopup.style.display = 'none';
    });

    nextLevelButton.addEventListener('click', nextLevel);

    levelSelector.addEventListener('change', changeLevel);

    createBoard(level);
    changeTheme(level);
});
