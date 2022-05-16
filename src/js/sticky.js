const canvasContainer = document.querySelector('canvas');
const stickyContainer = document.querySelector('.sticky-container');
const addNotesBtn = document.querySelector('.add-notes');
const saveStorage = document.querySelector('.save-storage');
const loadStorage = document.querySelector('.load-storage');
const deleteStorage = document.querySelector('.delete-storage');

// Position Of the Selected StickyNote It Get Updated When We Move The note
let posX = 0, posY = 0;

// Count Of The sticky notes created 
let noOfNotes = 0;

// To track the sticky notes 
let isMouseDn;
let isTouchStrt;
let selectedStickyNote = null;

// give zindex value to current selected stickynote so that it's comes to top 
let zIndexs = 11;

function selectStickyNoteForMovement(event, isMouse, stickyWrapper) {
    selectedStickyNote = stickyWrapper;
    selectedStickyNote.style.zIndex = zIndexs++;

    // Get The Current Position Of The mouse when clicked on the notes
    if (isMouse) {
        posX = event.clientX - stickyWrapper.offsetLeft;
        posY = event.clientY - stickyWrapper.offsetTop;
        isMouseDn = true;
    }
    else {
        posX = event.changedTouches[0].clientX - stickyWrapper.offsetLeft;
        posY = event.changedTouches[0].clientY - stickyWrapper.offsetTop;
        isTouchStrt = true;
    }
    // stickyWrapper.style.top = moveY + 'px';
    // stickyWrapper.style.left = moveX + 'px';

    // Add Listner only when the touch start or the click down moveListner
    if (isMouse) {
        window.addEventListener('mousemove', moveStickyNote);
    }
    else {
        window.addEventListener('touchmove', moveStickyNote);
    }
}

function moveStickyNote(event) {
    // when mouse move we get the mousemovent from the event
    let moveX, moveY;
    if (isMouseDn) {
        moveY = event.clientY - posY;
        moveX = event.clientX - posX;
    }
    else {
        moveY = event.changedTouches[0].clientY - posY;
        moveX = event.changedTouches[0].clientX - posX;
    }

    // console.log(moveX, moveY);
    // now as mouse move we move the sticky note according to the cursor
    selectedStickyNote.style.top = moveY + 'px';
    selectedStickyNote.style.left = moveX + 'px';
}

function endMovementOfStickyNote(event, isMouse) {
    if (isMouse) isMouseDn = false;
    else isTouchStrt = false;
    if (isMouse) {
        window.removeEventListener('mousemove', moveStickyNote);
    }
    else {
        window.removeEventListener('touchmove', moveStickyNote);
    }
    selectedStickyNote = null;
}

// For pc to move sticky notes
function addMoveWithMouseListner(stickyWrapper) {

    stickyWrapper.addEventListener('mousedown', (event) => selectStickyNoteForMovement(event, true, stickyWrapper));

    stickyWrapper.addEventListener('mouseup', (event) => endMovementOfStickyNote(event, true))

    stickyWrapper.addEventListener('drag', () => false)
}

// For smartphone to move sticky note
function addMoveWithTouchListner(stickyWrapper) {

    // Same As Above What We have done for the mouse Similar thing we have to do with the touch
    stickyWrapper.addEventListener('touchstart', (event) => selectStickyNoteForMovement(event, false, stickyWrapper));

    stickyWrapper.addEventListener('touchend', (event) => endMovementOfStickyNote(event, false));

    stickyWrapper.addEventListener('drag', () => false)
}

// listner for click when pressed on the red crossed on sticky note
function addRemoveListner(btn) {
    btn.addEventListener('click', () => {
        btn.parentElement.parentElement.parentElement.parentElement.remove();
    })
}

// listner for minimizing the content of the sticky note
function addMinimizeListner(btn) {
    btn.addEventListener('click', () => {
        let targetElement = btn.parentElement.parentElement.parentElement.lastElementChild;
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

// Create new notes 
addNotesBtn.addEventListener('click', createNewNotes);

function createNewNotes(noteInfo) {
    noOfNotes++;
    let stickyNote = document.createElement('div');
    stickyNote.classList.add('sticky-wrapper');
    stickyNote.setAttribute('data-no', `${noOfNotes - 1}`);
    if (noteInfo.heading !== undefined) {
        stickyNote.style.top = noteInfo.top + 'px';
        stickyNote.style.left = noteInfo.left + 'px';
        stickyNote.innerHTML = `
    <div class="sticky">
        <div class="sticky-top ">
            <input type="text" value="${noteInfo.heading}" class="sticky-heading" placeholder="Note...">
            <div class="sticky-btns">
                <button class="minimize-btn " title="minimize">
                    <i class="fa-solid fa-minus "></i>
                </button>
                <button class="remove-btn " title="remove">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
        <div class="sticky-content" style="height: 8rem; padding:0.25rem 0rem;">
            <textarea name="content" class="" placeholder="type here...">${noteInfo.content}</textarea>
        </div>
    </div>`;
    }
    else {
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
        <div class="sticky-content" style="height: 8rem; padding:0.25rem 0rem;">
            <textarea name="content" class=""  placeholder="type here..."></textarea>
        </div>
    </div>`;
    }

    stickyContainer.appendChild(stickyNote);
    addMoveWithMouseListner(stickyNote);
    addMoveWithTouchListner(stickyNote);
    addRemoveListner(stickyNote.querySelector('.remove-btn'));
    addMinimizeListner(stickyNote.querySelector('.minimize-btn'));
}

// Saving The Notes 
function saveAllNotes() {
    let allNotes = document.querySelectorAll('.sticky-wrapper');
    let notesArray = [];
    allNotes.forEach(note => {
        let noteInfo = {
            heading: note.querySelector('.sticky-heading').value,
            content: note.querySelector('textarea').value,
            top: note.offsetTop,
            left: note.offsetLeft,
        };
        notesArray.push(noteInfo);
    });
    localStorage.setItem('saveStickyNotes', JSON.stringify(notesArray));
}

// Loading The Notes 
function loadAllNotes() {
    if (localStorage.getItem('saveStickyNotes')) {
        let notesArray = JSON.parse(localStorage.saveStickyNotes);
        notesArray.forEach(note => {
            createNewNotes(note);
        });
    }
}

saveStorage.addEventListener('click', saveAllNotes);
loadStorage.addEventListener('click', loadAllNotes);

// Deleting the notes
deleteStorage.addEventListener('click', () => {
    localStorage.removeItem('saveStickyNotes');
});

