const toggleThemeBtn = document.querySelector('#toggle-theme-btn');
const root = document.querySelector(':root');
const bodyContainer = document.querySelector('.container');

function setupThemeToggle() {
    toggleThemeBtn.addEventListener('click', (e) => {
        e.target.classList.toggle('light');
        root.classList.toggle('light');
        bodyContainer.classList.toggle('light');
    });
}

setupThemeToggle();
