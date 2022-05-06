const body = document.body;
const pen = document.querySelector('.pen');
const penColor = document.querySelector('.pen-color');
const penWidth = document.querySelector('.pen-slider');
const bucketColor = document.querySelector('.bucket-color');
const eraser = document.querySelector('.eraser');
const clearCanvas = document.querySelector('.clear');
const saveImage = document.querySelector('.save-image');
const allTools = document.querySelectorAll('.header-icons-styles');
const selectedTool = document.querySelector('.selected-tools');
const saveStorage = document.querySelector('.save-storage');
const loadStorage = document.querySelector('.load-storage');
const deleteStorage = document.querySelector('.delete-storage');
const undo = document.querySelector('.undo');
const redo = document.querySelector('.redo');

const canvas = document.createElement('canvas');
canvas.id = 'canvas';
const context = canvas.getContext('2d');

let currentPenSize = 10;
let currBucketColor = '#fff';
let currPenColor = '#000000';
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];
let currentDrawState = 0;
let eachStateArray = [];
let isTouched = false;
let isPrevUndo = -1;
// Setting background color
bucketColor.addEventListener('input', () => {
    currBucketColor = bucketColor.firstElementChild.value;
    createCanvas();
    restoreCanvas();
})

// Setting pen color
penColor.addEventListener('input', () => {
    isEraser = false;
    currPenColor = penColor.firstElementChild.value;
})

//Setting Eraser 
eraser.addEventListener('click', () => {
    selectedTool.textContent = 'Eraser';
    isEraser = true;
    allTools.forEach(tool => {
        if (tool.classList.contains('selected-icon-style')) {
            tool.classList.remove('selected-icon-style');
        }
    })
    eraser.classList.add('selected-icon-style');
    currPenColor = currBucketColor;
    currentPenSize = 50;
    penWidth.firstElementChild.value = currentPenSize;
});

// Setting Brush Size
penWidth.addEventListener('change', () => {
    currentPenSize = penWidth.firstElementChild.value;
})

// pen
pen.addEventListener('click', switchToPen);

undo.addEventListener('click', undoOperation)

redo.addEventListener('click', redoOperations)


// Undo Functions
function undoOperation() {

    // This Check Is To Skip The Empty Object 
    if (isPrevUndo === false) {
        isPrevUndo = true;
        undoOperation();
    }
    for (let state = currentDrawState; state >= 0; state--) {
        if (drawnArray[state] && Object.keys(drawnArray[state]).length === 0) {
            currentDrawState = state - 1;
            createCanvas();
            restoreCanvas();
            selectedTool.textContent = 'Undo';
            setTimeout(switchToPen, 1500);
            break;
        }
    }
}

// redoOperations
function redoOperations() {
    // While undo we decrease one extra to remove the empty object so to avoid that empty object we skip by one
    if (isPrevUndo === true) {
        isPrevUndo = false;
        redoOperations();
        // Make A function And Call This Function
    }
    for (let state = currentDrawState; state < drawnArray.length; state++) {
        if ((drawnArray[state] && Object.keys(drawnArray[state]).length === 0) || state == drawnArray.length - 1) {
            currentDrawState = state;
            createCanvas();
            restoreCanvas();
            selectedTool.textContent = 'Redo';
            setTimeout(switchToPen, 1500);
            break;
        }
    }
    if (currentDrawState < drawnArray.length - 1) currentDrawState++;
}

// Switch From Eraser To Pen
function switchToPen() {
    isEraser = false;
    selectedTool.textContent = 'Pen';
    currPenColor = penColor.firstElementChild.value;
    currentPenSize = 10;
    allTools.forEach(tool => {
        if (tool.classList.contains('selected-icon-style')) {
            tool.classList.remove('selected-icon-style');
        }
    })
    pen.classList.add('selected-icon-style');
    penWidth.firstElementChild.value = currentPenSize;
}




// Create Canvas
function createCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 75;
    context.fillStyle = currBucketColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    body.appendChild(canvas);
    switchToPen();
}

createCanvas();

// Draw What is Stored in drawn array
function restoreCanvas() {
    for (let j = 0; j < drawnArray.length; j++) {
        for (let i = 1; i < drawnArray[j].length; i++) {

            context.beginPath();

            // we first move where we have to start the drawing
            context.moveTo(drawnArray[j][i - 1].x, drawnArray[j][i - 1].y);

            // Setting Up The initials 
            context.lineWidth = drawnArray[j][i - 1].size;
            context.lineCap = 'round';
            if (drawnArray[j][i - 1].erase) {
                context.strokeStyle = currBucketColor;
            } else {
                context.strokeStyle = drawnArray[j][i - 1].color;
            }

            // Drawing the line
            context.lineTo(drawnArray[j][i].x, drawnArray[j][i].y);
            // adding stroke to lines
            context.stroke();
        }
    }
}

function storeDrawn(x, y, size, color, erase) {
    const line = {
        x, y, size, color, erase,
    };
    // console.log(line);
    if (drawnArray.length != currentDrawState) {
        drawnArray = drawnArray.splice(0, currentDrawState + 1);
    }
    eachStateArray.push(line);
}


// Clear Canvas
clearCanvas.addEventListener('click', () => {
    createCanvas();
    drawnArray = [];
    selectedTool.textContent = 'Canvas Cleared';
    setTimeout(switchToPen, 1500);
});


// Mouse Click
// Get Mouse Position
function getMousePosition(event) {
    const boundaries = canvas.getBoundingClientRect();
    return {
        x: event.clientX - boundaries.left,
        y: event.clientY - boundaries.top,
    };
}

// mouse click to draw
canvas.addEventListener('mousedown', (event) => {
    // console.log("mstrt");
    isMouseDown = true;
    const currentPosition = getMousePosition(event);
    context.moveTo(currentPosition.x, currentPosition.y);
    context.beginPath();
    context.lineWidth = currentPenSize;
    context.lineCap = 'round';
    context.strokeStyle = currPenColor;

    // Storing Undefined For One Time 
    // So there will be breakpoint 
    eachStateArray = [];
    // storeDrawn(undefined);
})

// while clicked move to draw
canvas.addEventListener('mousemove', (event) => {
    // console.log("mmove");
    if (isMouseDown) {
        const currentPosition = getMousePosition(event);
        context.lineTo(currentPosition.x, currentPosition.y);
        context.stroke();
        storeDrawn(
            currentPosition.x,
            currentPosition.y,
            currentPenSize,
            currPenColor,
            isEraser
        );
    }
    // else {
    //     //     // Storing Undefined For One Time 
    //     console.log(drawnArray.length);
    //     if (Object.keys(drawnArray[drawnArray.length - 1]).length !== 0) {
    //         console.log("store");
    //         storeDrawn(undefined);
    //     }
    // }
})

// unclicked to stop the drawing
canvas.addEventListener('mouseup', (event) => {
    // console.log("mend");
    if (eachStateArray.length !== 0){
        drawnArray.push(eachStateArray);
        currentDrawState = drawnArray.length - 1;
    }
    isMouseDown = false;
})


// Touch 
// Get Touch Position
function getTouchPosition(event) {
    const boundaries = canvas.getBoundingClientRect();
    // console.log(event.touches[0].screenX, event.touches[0].screenY);
    // console.log(event.touches[0].clientX, event.touches[0].clientY);

    return {
        x: event.touches[0].clientX - boundaries.left,
        y: event.touches[0].clientY - boundaries.top,
    };
}

canvas.addEventListener('touchstart', (event) => {
    isTouched = true;
    // console.log("tstrt");
    const currentPosition = getTouchPosition(event);
    context.moveTo(currentPosition.x, currentPosition.y);
    context.beginPath();
    context.lineWidth = currentPenSize;
    context.lineCap = 'round';
    context.strokeStyle = currPenColor;

    /* 
    To avoid merging all the context of drawing bcoz there is no event for for hover touch
    which we can get the context first from where we start 
    Undefined is added to add break point between two drawn shape
    */
    storeDrawn(undefined);
    // console.log(currentPosition);
})

canvas.addEventListener('touchmove', (event) => {
    // console.log("tmove");
    if (isTouched) {
        const currentPosition = getTouchPosition(event);
        // console.log(currentPosition);
        context.lineTo(currentPosition.x, currentPosition.y);
        context.stroke();
        storeDrawn(
            currentPosition.x,
            currentPosition.y,
            currentPenSize,
            currPenColor,
            isEraser
        );
    }
})

canvas.addEventListener('touchend', (event) => {
    // console.log("tend");
    isTouched = false;
})



// Local Storage
// save to local storage
saveStorage.addEventListener('click', () => {
    localStorage.setItem('saveCanvas', JSON.stringify(drawnArray));
    selectedTool.textContent = 'Canvas Saved';
    setTimeout(switchToPen, 1500);
})

// load from local storage
loadStorage.addEventListener('click', () => {
    if (localStorage.getItem('saveCanvas')) {
        drawnArray = JSON.parse(localStorage.saveCanvas);
        currentDrawState = drawnArray.length - 1;
        selectedTool.textContent = 'Canvas Loaded';
        restoreCanvas();
        setTimeout(switchToPen, 1500);
    }
    else {
        selectedTool.textContent = 'Canvas Not Found';
        setTimeout(switchToPen, 1500);
    }

})

// clear local storage
deleteStorage.addEventListener('click', () => {
    localStorage.removeItem('saveCanvas');
    selectedTool.textContent = 'Cleared Local Storage';
    setTimeout(switchToPen, 1500);
})


// Save Canvas As Image
saveImage.addEventListener('click', () => {
    saveImage.firstElementChild.href = canvas.toDataURL('image/jpeg', 1);
    saveImage.firstElementChild.download = 'paint-example.jpeg';
    selectedTool.textContent = 'Image File Saved';
    setTimeout(switchToPen, 1500);
})