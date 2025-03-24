let quotes = [
    "Shroom, you have skill issues. Go to bed now."
];
function loadQuotes() {
    const savedQuotes = localStorage.getItem('typingQuotes');
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes);
    } else {
        // Save default quotes
        saveQuotes();
    }
}
function saveQuotes() {
    localStorage.setItem('typingQuotes', JSON.stringify(quotes));
}
