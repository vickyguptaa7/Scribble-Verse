const stickyContainer = document.querySelector('canvas');
const stickyWrappers = document.querySelectorAll('.sticky-wrapper');

let posX = 0, posY = 0;
let isMouseDown = false;
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

        console.log(moveX, moveY);
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


// function isOutOfBound(stickyWrapper) {
//     let containerInfo = stickyContainer.getBoundingClientRect();
//     let stickyInfo = stickyWrapper.getBoundingClientRect();
//     if (containerInfo.top > stickyInfo.top) {
//         return true;
//     }
//     if (containerInfo.left > stickyInfo.left) {
//         return true;
//     }
//     if (containerInfo.bottom < stickyInfo.bottom) {
//         return true;
//     }
//     if (containerInfo.right < stickyInfo.right) {
//         return true;
//     }
// }

function onDrag() {

}