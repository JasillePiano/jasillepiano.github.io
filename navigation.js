/**
 * Navigation script for handling the burger menu
 */
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const mainNav = document.querySelector('.main-nav');
    
    // Add grid background
    const gridBackground = document.createElement('div');
    gridBackground.className = 'grid-background';
    document.body.appendChild(gridBackground);
    
    // Toggle burger menu
    burgerMenu.addEventListener('click', function() {
        burgerMenu.classList.toggle('active');
        mainNav.classList.toggle('open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = burgerMenu.contains(event.target) || mainNav.contains(event.target);
        
        if (!isClickInside && mainNav.classList.contains('open')) {
            burgerMenu.classList.remove('active');
            mainNav.classList.remove('open');
        }
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            burgerMenu.classList.remove('active');
            mainNav.classList.remove('open');
        });
    });
});