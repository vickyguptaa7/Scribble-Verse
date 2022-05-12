const canvasContainer = document.querySelector('canvas');
const stickyContainer = document.querySelector('.sticky-container');
const addNotesBtn = document.querySelector('.add-notes');

let posX = 0, posY = 0;
let isMouseDown = [];
let isTouched = [];
let noOfNotes = 0;
// for pc to move sticky notes
function addMoveWithMouseListner(stickyWrapper) {
    stickyWrapper.addEventListener('mousedown', (event) => {
        posX = event.clientX - stickyWrapper.offsetLeft;
        posY = event.clientY - stickyWrapper.offsetTop;
        // stickyWrapper.style.top = moveY + 'px';
        // stickyWrapper.style.left = moveX + 'px';
        let stickyNo = stickyWrapper.getAttribute('data-no');
        isMouseDown[stickyNo] = true;
    })
    stickyWrapper.addEventListener('mousemove', (event) => {
        let stickyNo = stickyWrapper.getAttribute('data-no');
        if (!isMouseDown[stickyNo]) return;

        let moveY = event.clientY - posY;
        let moveX = event.clientX - posX;

        // console.log(moveX, moveY);
        stickyWrapper.style.top = moveY + 'px';
        stickyWrapper.style.left = moveX + 'px';
    });
    canvasContainer.addEventListener('mousemove', (event) => {
        let stickyNo = stickyWrapper.getAttribute('data-no');
        if (!isMouseDown[stickyNo]) return;

        let moveY = event.clientY - posY;
        let moveX = event.clientX - posX;
        stickyWrapper.style.top = moveY + 'px';
        stickyWrapper.style.left = moveX + 'px';
    });
    stickyWrapper.addEventListener('mouseup', () => {
        let stickyNo = stickyWrapper.getAttribute('data-no');
        isMouseDown[stickyNo] = false;
    })
    stickyWrapper.addEventListener('drag', () => false)
}

// For smartphone to move sticky note
function addMoveWithTouchListner(stickyWrapper) {
    stickyWrapper.addEventListener('touchstart', (event) => {
        posX = event.changedTouches[0].clientX - stickyWrapper.offsetLeft;
        posY = event.changedTouches[0].clientY - stickyWrapper.offsetTop;
        // console.log(posX,posY);
        // stickyWrapper.style.top = moveY + 'px';
        // stickyWrapper.style.left = moveX + 'px';
        let stickyNo = stickyWrapper.getAttribute('data-no');
        isTouched[stickyNo] = true;
    })
    stickyWrapper.addEventListener('touchmove', (event) => {
        let stickyNo = stickyWrapper.getAttribute('data-no');
        if (!isTouched[stickyNo]) return;

        let moveY = event.changedTouches[0].clientY - posY;
        let moveX = event.changedTouches[0].clientX - posX;

        // console.log(moveX, moveY);
        stickyWrapper.style.top = moveY + 'px';
        stickyWrapper.style.left = moveX + 'px';
    });
    canvasContainer.addEventListener('touchmove', (event) => {
        let stickyNo = stickyWrapper.getAttribute('data-no');
        if (!isTouched[stickyNo]) return;

        let moveY = event.changedTouches[0].clientY - posY;
        let moveX = event.changedTouches[0].clientX - posX;
        stickyWrapper.style.top = moveY + 'px';
        stickyWrapper.style.left = moveX + 'px';
    });
    stickyWrapper.addEventListener('touchend', () => {
        let stickyNo = stickyWrapper.getAttribute('data-no');
        isTouched[stickyNo] = false;
    })
    stickyWrapper.addEventListener('drag', () => false)
}

function addRemoveListner(btn) {
    btn.addEventListener('click', () => {
        btn.parentElement.parentElement.parentElement.parentElement.remove();
    })
}

function addMinimizeListner(btn) {
    btn.addEventListener('click', () => {
        let targetElement = btn.parentElement.parentElement.parentElement.lastElementChild;
        console.log(targetElement.style.height);
        if (targetElement.style.height == "8rem") {
            targetElement.style.height = '0rem';
            targetElement.style.padding = '0rem';
        }
        else {
            targetElement.style.height = '8rem';
            targetElement.style.padding = '0.25rem 0rem';
        }
    })
}

addNotesBtn.addEventListener('click', createNewNotes);

function createNewNotes() {
    noOfNotes++;
    isMouseDown.push(false);
    isTouched.push(false);
    let stickyNote = document.createElement('div');
    stickyNote.classList.add('sticky-wrapper');
    stickyNote.setAttribute('data-no', `${noOfNotes - 1}`);
    stickyNote.innerHTML = `
    <div class="sticky">
        <div class="sticky-top ">
            <input type="text" value="" class="sticky-heading" placeholder="Note...">
            <div class="sticky-btns">
                <button class="minimize-btn " title="minimize">
                    <i class="fa-solid fa-minus "></i>
                </button>
                <button class="remove-btn " title="remove">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
        <hr>
        <div class="sticky-content" style="height: 8rem; padding:0.25rem 0rem;">
            <textarea name="content" class="" placeholder="type here..."></textarea>
        </div>
    </div>`;

    stickyContainer.appendChild(stickyNote);
    addMoveWithMouseListner(stickyNote);
    addMoveWithTouchListner(stickyNote);
    addRemoveListner(stickyNote.querySelector('.remove-btn'));
    addMinimizeListner(stickyNote.querySelector('.minimize-btn'));
}
