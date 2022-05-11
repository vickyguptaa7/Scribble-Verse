const stickyContainer = document.querySelector('canvas');
const stickyWrappers = document.querySelectorAll('.sticky-wrapper');

let posX = 0, posY = 0;
let isMouseDown = false;
let isTouched=false;

// for pc to move sticky notes
stickyWrappers.forEach(stickyWrapper => {
    stickyWrapper.addEventListener('mousedown', (event) => {
        posX = event.clientX - stickyWrapper.offsetLeft;
        posY = event.clientY - stickyWrapper.offsetTop;
        // stickyWrapper.style.top = moveY + 'px';
        // stickyWrapper.style.left = moveX + 'px';
        isMouseDown = true;
    })
    stickyWrapper.addEventListener('mousemove', (event) => {
        if (!isMouseDown) return;

        let moveY = event.clientY - posY;
        let moveX = event.clientX - posX;

        // console.log(moveX, moveY);
        stickyWrapper.style.top = moveY + 'px';
        stickyWrapper.style.left = moveX + 'px';
    });
    stickyContainer.addEventListener('mousemove', (event) => {
        if (!isMouseDown) return;

        let moveY = event.clientY - posY;
        let moveX = event.clientX - posX;
        stickyWrapper.style.top = moveY + 'px';
        stickyWrapper.style.left = moveX + 'px';
    });
    stickyWrapper.addEventListener('mouseup', () => {
        isMouseDown = false;
    })
    stickyWrapper.addEventListener('drag', () => false)
});

// For smartphone to move sticky note
stickyWrappers.forEach(stickyWrapper => {
    stickyWrapper.addEventListener('touchstart', (event) => {
        posX = event.changedTouches[0].clientX - stickyWrapper.offsetLeft;
        posY = event.changedTouches[0].clientY - stickyWrapper.offsetTop;
        // console.log(posX,posY);
        // stickyWrapper.style.top = moveY + 'px';
        // stickyWrapper.style.left = moveX + 'px';
        isTouched = true;
    })
    stickyWrapper.addEventListener('touchmove', (event) => {
        if (!isTouched) return;

        let moveY = event.changedTouches[0].clientY - posY;
        let moveX = event.changedTouches[0].clientX - posX;

        // console.log(moveX, moveY);
        stickyWrapper.style.top = moveY + 'px';
        stickyWrapper.style.left = moveX + 'px';
    });
    stickyContainer.addEventListener('touchmove', (event) => {
        if (!isTouched) return;

        let moveY = event.changedTouches[0].clientY - posY;
        let moveX = event.changedTouches[0].clientX - posX;
        stickyWrapper.style.top = moveY + 'px';
        stickyWrapper.style.left = moveX + 'px';
    });
    stickyWrapper.addEventListener('touchend', () => {
        isTouched = false;
    })
    stickyWrapper.addEventListener('drag', () => false)
});
