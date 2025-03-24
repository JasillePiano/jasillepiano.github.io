document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userInfoSection = document.getElementById('user-info');
    const challengeArea = document.getElementById('challenge-area');
    const resultArea = document.getElementById('result');
    const usernameInput = document.getElementById('username');
    const userDisplayName = document.getElementById('user-display-name');
    const startBtn = document.getElementById('start-btn');
    const retryBtn = document.getElementById('retry-btn');
    const newQuoteBtn = document.getElementById('new-quote-btn');
    const quoteDisplay = document.getElementById('quote-display');
    const quoteInput = document.getElementById('quote-input');
    const wpmDisplay = document.getElementById('wpm');
    const errorsDisplay = document.getElementById('errors');
    const resultMessage = document.getElementById('result-message');
    const finalWpm = document.getElementById('final-wpm');
    const finalErrors = document.getElementById('final-errors');

    let currentQuote = '';
    let startTime;
    let timer;
    let errors = 0;
    let isTyping = false;
    let username = 'User';
    let currentIndex = 0;
    const savedUsername = localStorage.getItem('typingUsername');
    if (savedUsername) {
        usernameInput.value = savedUsername;
    }

    function getRandomQuote() {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    function displayQuote() {
        currentQuote = getRandomQuote();
        quoteDisplay.innerHTML = '';
        
        currentQuote.split('').forEach((char, index) => {
            const charSpan = document.createElement('span');
            charSpan.textContent = char;
            charSpan.dataset.index = index;
            quoteDisplay.appendChild(charSpan);
        });
    }

    function calculateWPM(timeElapsed) {
        // Words are traditionally counted as 5 characters
        const words = quoteInput.value.length / 5;
        const minutes = timeElapsed / 60;
        return Math.round(words / minutes);
    }

    function countErrors() {
        errors = 0;
        const inputChars = quoteInput.value.split('');
        const quoteChars = currentQuote.split('');
        
        inputChars.forEach((char, index) => {
            if (index < quoteChars.length && char !== quoteChars[index]) {
                errors++;
            }
        });
        
        return errors;
    }

    function updateTimer() {
        const currentTime = new Date();
        const timeElapsed = (currentTime - startTime) / 1000; // in seconds
        const wpm = calculateWPM(timeElapsed);
        
        wpmDisplay.textContent = wpm;
        errorsDisplay.textContent = countErrors();
        
        timer = setTimeout(updateTimer, 500);
    }

    function updateCharacterStyling() {
        const inputValue = quoteInput.value;
        const quoteChars = quoteDisplay.querySelectorAll('span');
        
        quoteChars.forEach(span => {
            span.classList.remove('correct', 'incorrect', 'current');
        });
        
        for (let i = 0; i < inputValue.length; i++) {
            if (i < quoteChars.length) {
                if (inputValue[i] === quoteChars[i].textContent) {
                    quoteChars[i].classList.add('correct');
                } else {
                    quoteChars[i].classList.add('incorrect');
                }
            }
        }
        
        if (inputValue.length < quoteChars.length) {
            quoteChars[inputValue.length].classList.add('current');
        }
    }

    function startChallenge() {
        username = usernameInput.value.trim() || 'User';
        userDisplayName.textContent = username;
        

        localStorage.setItem('typingUsername', username);
        
        userInfoSection.classList.add('hidden');
        challengeArea.classList.remove('hidden');
        resultArea.classList.add('hidden');
        
        displayQuote();
        quoteInput.value = '';
        errors = 0;
        errorsDisplay.textContent = '0';
        wpmDisplay.textContent = '0';
        currentIndex = 0;
        
        quoteInput.focus();
    }
function endChallenge() {
    clearTimeout(timer);
    isTyping = false;
    
    const finalWpmValue = parseInt(wpmDisplay.textContent);
    const finalErrorsValue = parseInt(errorsDisplay.textContent);
    
    finalWpm.textContent = finalWpmValue;
    finalErrors.textContent = finalErrorsValue;
    
    if (finalWpmValue >= 120) {
        resultMessage.textContent = 'Success! You typed over 120 WPM!';
        resultMessage.className = 'success';
    } else {
        resultMessage.textContent = 'Not quite there yet. Keep practicing!';
        resultMessage.className = 'failure';
    }
    
    resultArea.classList.remove('hidden');
    

    saveResult(finalWpmValue, finalErrorsValue);
}

function saveResult(wpm, errors) {
    const result = {
        date: new Date().toISOString(),
        wpm: wpm,
        errors: errors
    };
    
    let history = JSON.parse(localStorage.getItem('typingHistory')) || [];
    history.push(result);
    localStorage.setItem('typingHistory', JSON.stringify(history));
}

startBtn.addEventListener('click', startChallenge);

retryBtn.addEventListener('click', function() {
    quoteInput.value = '';
    errors = 0;
    startTime = new Date();
    updateTimer();
    resultArea.classList.add('hidden');
    quoteInput.focus();
});

newQuoteBtn.addEventListener('click', function() {
    displayQuote();
    quoteInput.value = '';
    errors = 0;
    startTime = new Date();
    updateTimer();
    resultArea.classList.add('hidden');
    quoteInput.focus();
});

quoteInput.addEventListener('input', function() {
    if (!isTyping) {
        isTyping = true;
        startTime = new Date();
        updateTimer();
    }
    
    updateCharacterStyling();
    

    if (quoteInput.value.length === currentQuote.length) {
        endChallenge();
    }
});

document.addEventListener('keydown', function(e) {
    // Ctrl+Enter to restart with new quote
    if (e.ctrlKey && e.key === 'Enter') {
        if (!userInfoSection.classList.contains('hidden')) {
            startChallenge();
        } else if (!resultArea.classList.contains('hidden')) {
            newQuoteBtn.click();
        }
    }
});

loadQuotes();
});
