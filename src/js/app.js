const forCanvas = document.querySelector('.for-canvas');
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
const header = document.querySelector('header');

const canvas = document.createElement('canvas');
canvas.id = 'canvas';
const context = canvas.getContext('2d');

let currentPenSize = 10;
let currBucketColor = '#fff';
let currPenColor = '#000000';
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];
let currentDrawState = -1;
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
    if (currentDrawState < 0) {
        return;
    }
    currentDrawState--;
    createCanvas();
    restoreCanvas();
    selectedTool.textContent = 'Undo';
    setTimeout(switchToPen, 1000);
}

// redoOperations
function redoOperations() {
    if (drawnArray.length - 1 === currentDrawState) {
        return
    }
    currentDrawState++;
    createCanvas();
    restoreCanvas();
    selectedTool.textContent = 'Redo';
    setTimeout(switchToPen, 1000);
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
    canvas.width = window.innerWidth * (0.87);
    canvas.height = window.innerHeight - header.offsetHeight - 50;
    context.fillStyle = currBucketColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    forCanvas.appendChild(canvas);
    switchToPen();
}

function restoreDataDueToResize() {
    // this function will avoid the hiding of the drawn object when canvas is resized.
    if (drawnArray.length === 0) return;
    let newWidth = canvas.offsetWidth;
    let newHeight = canvas.offsetHeight;
    let oldHeight = drawnArray[0][0].h;
    let oldWidth = drawnArray[0][0].w;

    let wratio = newWidth / oldWidth;
    let hratio = newHeight / oldHeight;

    for (let i = 0; i < drawnArray.length; i++) {
        for (let j = 0; j < drawnArray[i].length; j++) {
            drawnArray[i][j].w = newWidth;
            drawnArray[i][j].h = newHeight;
            drawnArray[i][j].x *= wratio;
            drawnArray[i][j].y *= hratio;
            drawnArray[i][j].size *= (hratio + wratio) / 2;
        }
    }
}

window.addEventListener('resize', () => {
    createCanvas();
    console.log("Hello");
    restoreDataDueToResize();
    restoreCanvas();
});

createCanvas();

// Draw What is Stored in drawn array
function restoreCanvas() {
    for (let j = 0; j <= currentDrawState; j++) {
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

function storeDrawn(x, y, size, color, erase, h, w) {
    const line = {
        x, y, size, color, erase, h, w,
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
        h: boundaries.height,
        w: boundaries.width
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

    // Store the data untill the mouse is up
    eachStateArray = [];
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
            isEraser,
            currentPosition.h,
            currentPosition.w,
        );
    }
})

// unclicked to stop the drawing
canvas.addEventListener('mouseup', (event) => {
    // console.log("mend");
    if (eachStateArray.length !== 0) {

        // Avoid Small Bug That When We Get single object for which we cant draw anything so we add one more object
        // One For The Reference of the start from where to start 
        if (eachStateArray.length === 1) {
            const tempObj = { ...eachStateArray[0] };
            tempObj.x += 0.0001;
            eachStateArray.push(tempObj);
            console.log(eachStateArray);
        }
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
        h: boundaries.height,
        w: boundaries.width
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

    // Store the data untill the touch is end
    eachStateArray = [];
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
            isEraser,
            currentPosition.h,
            currentPosition.w,
        );
    }
})

canvas.addEventListener('touchend', (event) => {
    // console.log("tend");
    // console.log("mend");
    if (eachStateArray.length !== 0) {

        // Avoid Small Bug That When We Get single object for which we cant draw anything so we add one more object
        // One For The Reference of the start from where to start 
        if (eachStateArray.length === 1) {
            const tempObj = { ...eachStateArray[0] };
            tempObj.x += 0.0001;
            eachStateArray.push(tempObj);
            console.log(eachStateArray);
        }
        drawnArray.push(eachStateArray);
        currentDrawState = drawnArray.length - 1;
    }
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