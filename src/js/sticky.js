const canvasContainer = document.querySelector('canvas');
const stickyContainer = document.querySelector('.sticky-container');
const addNotesBtn = document.querySelector('.add-notes');
const saveStorage = document.querySelector('.save-storage');
const loadStorage = document.querySelector('.load-storage');
const deleteStorage = document.querySelector('.delete-storage');

// Position Of the Selected StickyNote It Get Updated When We Move The note
let posX = 0, posY = 0;

// store the info which sticky note is moving to avoid the case sometime all moves 
let isMouseDown = [];
let isTouched = [];

// Count Of The sticky notes created 
let noOfNotes = 0;


// For pc to move sticky notes
function addMoveWithMouseListner(stickyWrapper) {

    stickyWrapper.addEventListener('mousedown', (event) => {

        // Get The Current Position Of The mouse when clicked on the notes
        posX = event.clientX - stickyWrapper.offsetLeft;
        posY = event.clientY - stickyWrapper.offsetTop;
        // stickyWrapper.style.top = moveY + 'px';
        // stickyWrapper.style.left = moveX + 'px';

        // Make It True That We Have Selected that note and when when we move cursor the note
        // Also moves
        let stickyNo = stickyWrapper.getAttribute('data-no');
        isMouseDown[stickyNo] = true;
    })

    stickyWrapper.addEventListener('mousemove', (event) => {
        let stickyNo = stickyWrapper.getAttribute('data-no');

        // verifying that the note on which mouse was clicked only that will get move
        // avoid any other notes
        if (!isMouseDown[stickyNo]) return;

        // when mouse move we get the mousemovent from the event
        let moveY = event.clientY - posY;
        let moveX = event.clientX - posX;

        // console.log(moveX, moveY);
        // now as mouse move we move the sticky note according to the cursor
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
        // now remove the isMouseDown as now the sticky note will not move
        let stickyNo = stickyWrapper.getAttribute('data-no');
        isMouseDown[stickyNo] = false;
    })

    stickyWrapper.addEventListener('drag', () => false)
}

// For smartphone to move sticky note
function addMoveWithTouchListner(stickyWrapper) {

    // Same As Above What We have done for the mouse Similar thing we have to do with the touch
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
    isMouseDown.push(false);
    isTouched.push(false);
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

