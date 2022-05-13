const bucketSet = document.querySelector('.bucket-set');
const bucketColorWrapper = document.querySelector('.bucket-color-wrapper');
const penTools = document.querySelector('.pen-tool');
const penToolsWrapper = document.querySelector('.pen-tools-wrapper');
const dropMenuBtn = document.querySelector('.drop-menu');
const dropMenuItemsWrapper = document.querySelector('.drop-menu-items-container');
const switchThemeBtn = document.querySelector('.switch-theme');
const body = document.querySelector('body');
const toolContainer = document.querySelector('.tools-container');
const hideUnhideBtn = document.querySelector('.hide-unhide');

let isDarkMode = false;

// Local Storage To Get The Prev Stored Result;
function storePrevMode() {
    isDarkMode = localStorage.getItem('isDarkMode');

    // it store data in string form so converted back to bool form
    if (isDarkMode === null)
        isDarkMode = false;
    else if (isDarkMode === 'true')
        isDarkMode = true;
    else
        isDarkMode = false;

    if (isDarkMode == true) {
        switchTheme();
        isDarkMode = true;
        localStorage.setItem('isDarkMode', isDarkMode);
    }
}

storePrevMode();

// Show The Bucket Color For The Background Change
bucketSet.addEventListener('click', () => {
    bucketColorWrapper.classList.toggle('invisible');
    bucketColorWrapper.classList.toggle('scale-0');
    bucketColorWrapper.classList.toggle('-translate-x-[100%]');
})

// Show The Pen Tools Color And Size
penTools.addEventListener('click', () => {
    penToolsWrapper.classList.toggle('invisible');
    penToolsWrapper.classList.toggle('scale-0');
    penToolsWrapper.classList.toggle('-translate-x-[70%]');
})

// Drop Menu Button For The Top Right For Local Storage Options
dropMenuBtn.addEventListener('click', () => {
    dropMenuBtn.firstElementChild.classList.toggle('-rotate-90');
    dropMenuItemsWrapper.classList.toggle('translate-x-[45%]');
    dropMenuItemsWrapper.classList.toggle('-translate-y-[70%]');
    dropMenuItemsWrapper.classList.toggle('scale-0');
})


switchThemeBtn.addEventListener('click', switchTheme)
function switchTheme() {
    if (switchThemeBtn.firstElementChild.classList.contains('fa-moon')) {
        switchThemeBtn.firstElementChild.classList.replace('fa-moon', 'fa-sun');
        isDarkMode = false;
    }
    else {
        isDarkMode = true;
        switchThemeBtn.firstElementChild.classList.replace('fa-sun', 'fa-moon');
    }

    localStorage.setItem('isDarkMode', isDarkMode);
    body.classList.toggle('darkMode');
}

// Hide And Unhide The Left Side Tool Bar
hideUnhideBtn.addEventListener('click', () => {
    toolContainer.classList.toggle('left-[1.5rem]');
    toolContainer.classList.toggle('left-[-6rem]');
    hideUnhideBtn.firstElementChild.classList.toggle('fa-angles-left');
    hideUnhideBtn.firstElementChild.classList.toggle('fa-angles-right');
})

