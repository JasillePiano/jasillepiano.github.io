/**
 * Main script for the typing challenge
 */
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

    // Variables
    let currentQuote = '';
    let startTime;
    let timer;
    let errors = 0;
    let isTyping = false;
    let username = 'User';
    let currentIndex = 0;

    // Load saved username if available
    const savedUsername = localStorage.getItem('typingUsername');
    if (savedUsername) {
        usernameInput.value = savedUsername;
    }

    // Get a random quote
    function getRandomQuote() {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    // Display the quote with each character in a span
    function displayQuote() {
        currentQuote = getRandomQuote();
        quoteDisplay.innerHTML = '';
        
        // Create spans for each character
        currentQuote.split('').forEach((char, index) => {
            const charSpan = document.createElement('span');
            charSpan.textContent = char;
            charSpan.dataset.index = index;
            quoteDisplay.appendChild(charSpan);
        });
    }

    // Calculate WPM
    function calculateWPM(timeElapsed) {
        // Words are traditionally counted as 5 characters
        const words = quoteInput.value.length / 5;
        const minutes = timeElapsed / 60;
        return Math.round(words / minutes);
    }

    // Count errors
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

    // Update the timer and stats
    function updateTimer() {
        const currentTime = new Date();
        const timeElapsed = (currentTime - startTime) / 1000; // in seconds
        const wpm = calculateWPM(timeElapsed);
        
        wpmDisplay.textContent = wpm;
        errorsDisplay.textContent = countErrors();
        
        // Update every 500ms
        timer = setTimeout(updateTimer, 500);
    }

    // Update character styling based on typing
    function updateCharacterStyling() {
        const inputValue = quoteInput.value;
        const quoteChars = quoteDisplay.querySelectorAll('span');
        
        // Reset all characters
        quoteChars.forEach(span => {
            span.classList.remove('correct', 'incorrect', 'current');
        });
        
        // Style characters based on input
        for (let i = 0; i < inputValue.length; i++) {
            if (i < quoteChars.length) {
                if (inputValue[i] === quoteChars[i].textContent) {
                    quoteChars[i].classList.add('correct');
                } else {
                    quoteChars[i].classList.add('incorrect');
                }
            }
        }
        
        // Mark current character
        if (inputValue.length < quoteChars.length) {
            quoteChars[inputValue.length].classList.add('current');
        }
    }

    // Start the challenge
    function startChallenge() {
        username = usernameInput.value.trim() || 'User';
        userDisplayName.textContent = username;
        
        // Save username
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
// End the challenge
function endChallenge() {
    clearTimeout(timer);
    isTyping = false;
    
    const finalWpmValue = parseInt(wpmDisplay.textContent);
    const finalErrorsValue = parseInt(errorsDisplay.textContent);
    
    finalWpm.textContent = finalWpmValue;
    finalErrors.textContent = finalErrorsValue;
    
    // Determine if passed or failed
    if (finalWpmValue >= 120) {
        resultMessage.textContent = 'Success! You typed over 120 WPM!';
        resultMessage.className = 'success';
    } else {
        resultMessage.textContent = 'Not quite there yet. Keep practicing!';
        resultMessage.className = 'failure';
    }
    
    resultArea.classList.remove('hidden');
    
    // Save result to history
    saveResult(finalWpmValue, finalErrorsValue);
}

// Save result to local storage
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

// Event Listeners
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
    
    // Check if completed
    if (quoteInput.value.length === currentQuote.length) {
        endChallenge();
    }
});

// Handle keyboard shortcuts
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

// Initialize with a random quote
loadQuotes();
});