const bucketSet = document.querySelector('.bucket-set');
const bucketColorWrapper = document.querySelector('.bucket-color-wrapper');
const penTools = document.querySelector('.pen-tool');
const penToolsWrapper = document.querySelector('.pen-tools-wrapper');
const dropMenuBtn = document.querySelector('.drop-menu');
const dropMenuItemsWrapper = document.querySelector('.drop-menu-items-container');
const switchThemeBtn = document.querySelector('.switch-theme');
const body = document.querySelector('body');

console.log(switchThemeBtn);

console.log(bucketColorWrapper, bucketSet);

bucketSet.addEventListener('click', () => {
    bucketColorWrapper.classList.toggle('invisible');
    bucketColorWrapper.classList.toggle('scale-0');
    bucketColorWrapper.classList.toggle('-translate-x-[100%]');
})


penTools.addEventListener('click', () => {
    penToolsWrapper.classList.toggle('invisible');
    penToolsWrapper.classList.toggle('scale-0');
    penToolsWrapper.classList.toggle('-translate-x-[70%]');
})

dropMenuBtn.addEventListener('click', () => {
    dropMenuBtn.firstElementChild.classList.toggle('-rotate-90');
    dropMenuItemsWrapper.classList.toggle('translate-x-[45%]');
    dropMenuItemsWrapper.classList.toggle('-translate-y-[70%]');
    dropMenuItemsWrapper.classList.toggle('scale-0');
})

switchThemeBtn.addEventListener('click', () => {
    if (switchThemeBtn.firstElementChild.classList.contains('fa-moon')) {
        switchThemeBtn.innerHTML = `<i class="fa-solid fa-sun text-[1.5rem]"></i>`;
    }
    else {
        switchThemeBtn.innerHTML = `<i class="fa-solid fa-moon text-[1.5rem] "></i>`;
    }
    body.classList.toggle('darkMode');
    // <!-- <i class="fa-solid fa-moon text-[1.5rem] "></i> -->
    // <i class="fa-solid fa-sun text-[1.5rem]"></i>
})