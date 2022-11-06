// const listOfSpellingWords = [
//     'shop',
//     'ship',
//     'fish',
//     'wish',
//     'fast',
//     'past',
// ];
const wordRate = .5;
let correct = true;
let listOfSpellingWords = [
    'whip',
    'whale',
    'catch',
    'match',
    'chin',
    'graph',
    'shop',
    'with',
    'many',
    'around',
];
// data 
let word = '';
let index = 0;
let points = 3;
const goodJobWords = [
    'good job',
    'well done',
    'nice',
    'great',
    'excellent',
    'fantastic',
    'amazing',
    'awesome',
    'super',
    'cool',
    'brilliant',
    'wonderful',
    'terrific',
    'marvelous',
    'splendid',
    'magnificent',
    'outstanding',
    'fabulous',
    'stupendous',
    'superb',
    'incredible',
    'remarkable',
    'phenomenal',
    'unbelievable',
    'astonishing',
    'astounding',
    'stunning',
    'dazzling',
    'glorious',
    'lovely',
    'beautiful',
    'gorgeous',
];
const incorrectWords = [
    'try again',
    'wrong',
    'no',
    'incorrect',
    'nice try',
    'not quite',
];
const copyOfListOfSpellingWords = [...listOfSpellingWords];
function pickRandomWord() {
    correct = true;
    printMessage('-');
    if (listOfSpellingWords.length === 0) {
        listOfSpellingWords = [...copyOfListOfSpellingWords];
    }
    const randomIndex = Math.floor(Math.random() * listOfSpellingWords.length);
    return listOfSpellingWords.splice(randomIndex, 1)[0];
}
// web api speech synthesis say word
function sayWord(thing, show) {
    const isLetterELement = document.querySelector(`.${thing}`);
    printMessage(thing, show);
    const utterance = new SpeechSynthesisUtterance(thing);
    const pickVoice = speechSynthesis.getVoices().filter(voice => voice.lang === 'en-US')[0];
    // slow down the speech rate
    utterance.rate = thing === word ? wordRate : wordRate * 1.5;
    utterance.voice = pickVoice;
    
    if (isLetterELement) {
        isLetterELement.classList.add('highlight');
        setTimeout(() => {
            isLetterELement.classList.remove('highlight');
            console.log(isLetterELement)
        }, 500);
    }
    speechSynthesis.speak(utterance);
}
const button = document.createElement('button');
button.innerHTML = 'Click to start';
document.body.prepend(button);
button.addEventListener('click', () => {
    if (word) {
        sayWord(word);
    } else {
        word = pickRandomWord();
        sayWord(word);
        createUnderscoreWordBox(word);
    }
});
function createUnderscoreWordBox(word) {
    word.split('').forEach(letter => {
        const underscore = document.createElement('button');
        underscore.innerHTML = '_';
        document.querySelector('.box').append(underscore);
    });
}
document.addEventListener('keypress', (e) => {
    checkLetter(e.key);
});
function updatePoints() {
    document.querySelector('.points').innerHTML = points;
}
function createLettersButton() {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    letters.forEach(letter => {
        const button = document.createElement('button');
        button.innerHTML = letter.toUpperCase() + ' ';
        button.innerHTML += letter.toLowerCase();
        document.querySelector('.letters').append(button);
        button.addEventListener('click', () => {
            debugger;
            checkLetter(letter);
            sayWord(letter);
        })
    });
}
function checkLetter(key) {
    if (!word) return;
    const copyWord = word;
    if (key.toLowerCase() === word[index].toLowerCase()) {
        document.querySelector('.box').children[index].innerHTML = key;
        index++;
        if (index === word.length) {
            
            document.querySelector('.box').innerHTML = '';
            index = 0;
            points++;
            updatePoints();
            word = '';
            setTimeout(() => {
                sayWord(randomFromArray(goodJobWords));
                sayWord(copyWord);
            }, 500);
            setTimeout(() => {
                if (correct === true) {
                    right(copyWord);
                } else {
                    wrong(copyWord);
                }
            });
        }
    } else {
        correct = false;
        if (index === word.length) {
            sayWord(randomFromArray(incorrectWords));
            const copyWord = word;
            copyWord.split('').forEach((letter, i) => {
                    sayWord(letter); 
            });
            sayWord(word, true);
            document.querySelector('.box').innerHTML = '';
            index = 0;
            updatePoints();
            word = '';
        }
       
    }
}
function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function printMessage(message, show){
    if (message !== word || show) {
        document.querySelector('.message').innerHTML = `${message.split('').map(l => `<span class="${l}">${l}</span>`).join('')}`;
    }
}
updatePoints();
createLettersButton();

function showWords() {
    document.querySelector('.message').innerHTML = listOfSpellingWords.join(', ');
}

showWords();

function backspace(){
    if (index > 0){
        index--;
        document.querySelector('.box').children[index].innerHTML = '_';
    }
}

function right(word){
    document.querySelector('.right').innerHTML += word + `<div class='correct'>${word}</div>`;
}

function wrong(word){
    document.querySelector('.wrong').innerHTML += word + `<div class='incorrect'>${word}</div>`;
}