let quotes = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.",
    "Programming is the art of telling another human being what one wants the computer to do.",
    "The best way to predict the future is to invent it. The future is not laid out on a track.",
    "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
    "The most disastrous thing that you can ever learn is your first programming language.",
    "The function of good software is to make the complex appear to be simple.",
    "Any sufficiently advanced technology is indistinguishable from magic.",
    "Simplicity is the ultimate sophistication. It takes a lot of hard work to make something simple.",
    "The only way to learn a new programming language is by writing programs in it.",
    "The computer was born to solve problems that did not exist before.",
    "Software is like entropy: It is difficult to grasp, weighs nothing, and obeys the Second Law of Thermodynamics; i.e., it always increases.",
    "Walking on water and developing software from a specification are easy if both are frozen.",
    "The best thing about a boolean is even if you are wrong, you are only off by a bit.",
    "Before software can be reusable it first has to be usable.",
    "The best performance improvement is the transition from the nonworking state to the working state."
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
