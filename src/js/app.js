import cursorPenImg from "../Img/pen.png";
import cursorEraserImg from "../Img/eraser.png";

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
const diffShapes = document.querySelector('.diff-shapes');
const diffShapesContainer = document.querySelector('.diff-shapes-container');
const allShapesBtn = document.querySelectorAll('.shape');



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
let currShapeDraw = 'pen';
let previewStateArray = [];


// shows msg to the top left
function showMessage(msg) {
    selectedTool.textContent = msg;
}

// Remove The highlighted
function removeHighlightedTool() {
    allTools.forEach(tool => {
        if (tool.classList.contains('selected-icon-style')) {
            tool.classList.remove('selected-icon-style');
        }
    });
}

// diff shapes container will pop out
diffShapes.addEventListener('click', () => {
    diffShapesContainer.classList.toggle('invisible');
    diffShapesContainer.classList.toggle('scale-0');
    diffShapesContainer.classList.toggle('-translate-x-[70%]');
})

// selecting the shape from the shape container
allShapesBtn.forEach(shapeBtn => {
    shapeBtn.addEventListener('click', () => {

        removeHighlightedTool();

        // Add highlight to the current tool shapes
        diffShapes.classList.add('selected-icon-style');
        isEraser = false;
        canvas.style.cursor = 'crosshair';
        currentPenSize = 10;
        currPenColor = penColor.firstElementChild.value;
        penWidth.firstElementChild.value = currentPenSize;
        currShapeDraw = shapeBtn.getAttribute('data-value');

        // Show msg to the top left which shape selected
        showMessage(shapeBtn.getAttribute('data-value'));
    })
})

// Setting background color
bucketColor.addEventListener('input', () => {
    currBucketColor = bucketColor.firstElementChild.value;
    if (isEraser) currPenColor = currBucketColor;
    createCanvas();
    restoreCanvas();
})

// Setting pen color
penColor.addEventListener('input', () => {
    currPenColor = penColor.firstElementChild.value;
})

//Setting Eraser 
eraser.addEventListener('click', () => {
    showMessage('Eraser');
    isEraser = true;
    canvas.style.cursor = `url(${cursorEraserImg}) 12 25, auto`;
    currShapeDraw = 'pen';
    removeHighlightedTool();
    eraser.classList.add('selected-icon-style');
    currPenColor = currBucketColor;
    currentPenSize = 20;
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

// From Keybaord To Undo and Redo
window.document.addEventListener('keydown', (event) => {
    if ((event.metaKey && event.shiftKey && event.key === 'z') || (event.ctrlKey && event.key === 'y')) {
        redoOperations();
    }
    else if ((event.ctrlKey && event.key === 'z') || (event.metaKey && event.key === 'z')) {
        undoOperation();
    }
})


// Undo Functions
function undoOperation() {
    if (currentDrawState < 0) {
        return;
    }
    currentDrawState--;
    createCanvas();
    restoreCanvas();
    showMessage('Undo');

    // in this style of passing the func bcoz i have to pass the arguments also
    if (isEraser)
        setTimeout(() => showMessage('eraser'), 1000);
    else
        setTimeout(() => showMessage(currShapeDraw), 1000);
}

// redoOperations
function redoOperations() {
    if (drawnArray.length - 1 === currentDrawState) {
        return
    }
    currentDrawState++;
    createCanvas();
    restoreCanvas();
    showMessage('Redo');
    // in this style of passing the func bcoz i have to pass the arguments also
    if (isEraser)
        setTimeout(() => showMessage('eraser'), 1000);
    else
        setTimeout(() => showMessage(currShapeDraw), 1000);
}

// Switch From Eraser To Pen
function switchToPen() {
    currShapeDraw = 'pen';
    isEraser = false;
    showMessage('pen');
    canvas.style.cursor = `url(${cursorPenImg}) 0 60,auto`;
    currPenColor = penColor.firstElementChild.value;
    currentPenSize = 10;
    removeHighlightedTool();
    pen.classList.add('selected-icon-style');
    penWidth.firstElementChild.value = currentPenSize;
}

// Create Canvas
function createCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.fillStyle = currBucketColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    forCanvas.appendChild(canvas);
}

// this function will avoid the hiding of the drawn object when canvas is resized.
function restoreDataDueToResize() {
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
        }
    }
}

// resize the canvas as the browser resizes 
window.addEventListener('resize', () => {
    createCanvas();
    console.log("Hello");
    restoreDataDueToResize();
    restoreCanvas();
});

createCanvas();
switchToPen();

// Draw What is Stored in drawn array
function restoreCanvas() {
    // Traversing on the main array
    for (let j = 0; j <= currentDrawState; j++) {

        // if any of the array of main array is undefined we just dont process it
        if (!drawnArray[j]) continue;

        // traversing on the array of objects
        for (let i = 1; i < drawnArray[j].length; i++) {

            if (drawnArray[j][i].shape === 'pen') {
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
            else {
                context.moveTo(drawnArray[j][i - 1].x, drawnArray[j][i - 1].y);
                context.beginPath();
                drawShapes(drawnArray[j]);
                // console.log(drawnArray[j]);
            }
        }
    }
}

// Clear Canvas
clearCanvas.addEventListener('click', () => {
    createCanvas();
    drawnArray = [];
    showMessage('Canvas Cleared');
    if (isEraser)
        setTimeout(() => showMessage('eraser'), 1000);
    else
        setTimeout(() => showMessage(currShapeDraw), 1000);
});

// store the object in state
function storeDrawn(x, y, size, color, erase, h, w, shape, StateArray) {
    const drawnObjectData = {
        x, y, size, color, erase, h, w, shape,
    };

    // this is to avoid the undo's which we have make and then we draw something so we dont that 
    // undo changes in redo so we remove that changes
    // this drawnArray Length will be equal to current Draw state Only when we does'nt do any undo's 
    if (drawnArray.length !== currentDrawState) {
        drawnArray = drawnArray.splice(0, currentDrawState + 1);
    }
    StateArray.push(drawnObjectData);
}

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

// Touch 
// Get Touch Position
function getTouchPosition(event) {
    const boundaries = canvas.getBoundingClientRect();
    return {
        x: event.changedTouches[0].clientX - boundaries.left,
        y: event.changedTouches[0].clientY - boundaries.top,
        h: boundaries.height,
        w: boundaries.width
    };
}

// The shape which was selected will be drawn 
function selectedShapeDraw(shapeToDraw, x, y, w, h, color) {

    switch (shapeToDraw) {
        case 'rectangle-stroke': {
            context.strokeStyle = color;
            context.strokeRect(x, y, w, h);
            break;
        }
        case 'rectangle-fill': {
            context.fillStyle = color;
            // console.log(color);
            context.fillRect(x, y, w, h);
            break;
        }
        case 'circle-stroke': {
            // console.log(color);
            context.lineCap = 'round';
            context.arc(x, y, Math.max(h, w), 0, 2 * Math.PI, true);
            context.strokeStyle = color;
            context.stroke();
            break;
        }
        case 'circle-fill': {
            context.lineCap = 'round';
            context.fillStyle = color;
            context.arc(x, y, Math.max(h, w), 0, 2 * Math.PI, true);
            context.fill();
            break;
        }
        case 'line': {
            context.lineCap = 'round';
            context.strokeStyle = color;
            context.lineTo(x, y);
            context.stroke();
            break;
        }
        default: console.log('Something Went Wrong! The Chosen Shape Is Not In Option');
    }
    context.closePath();
}

// This Function will draw the shapes other than free hand
function drawShapes(stateArray) {
    if (stateArray.length < 2) return;
    let prevPosition = { x: stateArray[0].x, y: stateArray[0].y };
    let currPosition = { x: stateArray[stateArray.length - 1].x, y: stateArray[stateArray.length - 1].y };
    let color = stateArray[0].color;
    let shape = stateArray[0].shape;
    let width = (currPosition.x - prevPosition.x);
    let height = (currPosition.y - prevPosition.y);
    context.lineWidth = stateArray[0].size;
    // Now Sign Of Above H and W plays crucial role because according to which we decide in which direction is made 
    // context.strokeRect(eachStateArray[0].x, eachStateArray[0].y, width, height);

    // To set the starting position as it is required 
    if (shape === 'line') {
        context.moveTo(prevPosition.x, prevPosition.y);
        selectedShapeDraw(shape, currPosition.x, currPosition.y, width, height, color);
        return;
    }

    if (shape.includes('circle')) {
        width = Math.abs(width);
        height = Math.abs(height);
        let radius = Math.sqrt(height * height + width * width);
        // This Code is added to remove the circle + line issue which we can face during the making
        // circle stroke 
        context.moveTo(prevPosition.x + radius, prevPosition.y);
        selectedShapeDraw(shape, prevPosition.x, prevPosition.y, radius, 0, color);
        return;
    }

    if (height > 0 && width > 0) {
        selectedShapeDraw(shape, prevPosition.x, prevPosition.y, width, height, color);
    }
    else if (height > 0) {
        selectedShapeDraw(shape, currPosition.x, prevPosition.y, Math.abs(width), height, color);
    }
    else if (width > 0) {
        selectedShapeDraw(shape, prevPosition.x, currPosition.y, width, Math.abs(height), color);
    }
    else {
        selectedShapeDraw(shape, currPosition.x, currPosition.y, Math.abs(width), Math.abs(height), color);
    }
}



// trigger when mouse/touch down
// isMouse true -> mouse activity 
// isMouse false then there is touch activity

function startDraw(event, isMouse) {
    // console.log("mstrt");
    isMouseDown = isMouse;
    isTouched = !isMouse;
    const currentPosition = (isMouse) ? getMousePosition(event) : getTouchPosition(event);
    context.moveTo(currentPosition.x, currentPosition.y);
    context.beginPath();
    context.lineWidth = currentPenSize;
    context.lineCap = 'round';
    context.strokeStyle = currPenColor;
    if (isEraser)
        context.strokeStyle = currBucketColor;

    // Store the data untill the mouse is up
    eachStateArray = [];
    if (currShapeDraw !== 'pen') {
        // console.log("mdwn", currShapeDraw);
        previewStateArray = [];
        storeDrawn(
            currentPosition.x,
            currentPosition.y,
            currentPenSize,
            currPenColor,
            isEraser,
            currentPosition.h,
            currentPosition.w,
            currShapeDraw,
            eachStateArray
        );
        storeDrawn(
            currentPosition.x,
            currentPosition.y,
            currentPenSize,
            currPenColor,
            isEraser,
            currentPosition.h,
            currentPosition.w,
            currShapeDraw,
            previewStateArray
        );
    }
    // while clicked move to draw
    if (isMouse)
        canvas.addEventListener('mousemove', currentDraw);
    else
        canvas.addEventListener('touchmove', currentDraw);
}

function currentDraw(event) {
    // console.log("mmove");
    const currentPosition = (isMouseDown) ? getMousePosition(event) : getTouchPosition(event);
    if (currShapeDraw === 'pen') {
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
            currShapeDraw,
            eachStateArray
        );
        return;
    }
    else {
        // Drawing Shapes other than pen
        storeDrawn(
            currentPosition.x,
            currentPosition.y,
            currentPenSize,
            currPenColor,
            isEraser,
            currentPosition.h,
            currentPosition.w,
            currShapeDraw,
            previewStateArray
        );
        createCanvas();
        restoreCanvas();
        // starting the path To Fix Small Issue Which Is if we draw circle stroke and then circle fill the for one instanse the circle stroke bcom circle fill 
        context.beginPath();
        context.moveTo(currentPosition.x, currentPosition.y);
        drawShapes(previewStateArray);
    }
}

function endDraw(event, isMouse) {
    // console.log("mend");
    if (currShapeDraw !== 'pen') {
        // If the shape is not free hand then 
        const currentPosition = (isMouse) ? getMousePosition(event) : getTouchPosition(event);
        storeDrawn(
            currentPosition.x,
            currentPosition.y,
            currentPenSize,
            currPenColor,
            isEraser,
            currentPosition.h,
            currentPosition.w,
            currShapeDraw,
            eachStateArray
        );
        drawnArray.push(eachStateArray);
        currentDrawState = drawnArray.length - 1;

        createCanvas();
        restoreCanvas();
    }
    else if (eachStateArray.length !== 0) {
        // Avoid Small Bug That When We Get single object for which we cant draw anything so we add one more object
        // One For The Reference of the start from where to start 
        if (eachStateArray.length === 1) {
            const tempObj = { ...eachStateArray[0] };
            tempObj.x += 0.0001;
            eachStateArray.push(tempObj);
            // console.log(eachStateArray);
        }
        drawnArray.push(eachStateArray);
        currentDrawState = drawnArray.length - 1;
    }
    if (isMouse)
        canvas.removeEventListener('mousemove', currentDraw);
    else
        canvas.removeEventListener('touchmove', currentDraw);
}

// mouse click to start the drawing
canvas.addEventListener('mousedown', (event) => startDraw(event, true));

// unclicked to stop the drawing
canvas.addEventListener('mouseup', (event) => endDraw(event, true));


// Same for smartphone touch
canvas.addEventListener('touchstart', (event) => startDraw(event, false));

canvas.addEventListener('touchend', (event) => endDraw(event, false));



// Local Storage
// save to local storage
saveStorage.addEventListener('click', () => {
    localStorage.setItem('saveCanvas', JSON.stringify(drawnArray));
    showMessage('Canvas Saved');
    if (isEraser)
        setTimeout(() => showMessage('eraser'), 1000);
    else
        setTimeout(() => showMessage(currShapeDraw), 1000);
})

// load from local storage
loadStorage.addEventListener('click', () => {
    if (localStorage.getItem('saveCanvas')) {
        drawnArray = JSON.parse(localStorage.saveCanvas);
        currentDrawState = drawnArray.length - 1;
        showMessage('Canvas Loaded');
        restoreCanvas();
        if (isEraser)
            setTimeout(() => showMessage('eraser'), 1000);
        else
            setTimeout(() => showMessage(currShapeDraw), 1000);
    }
    else {
        showMessage('Canvas Not Found');
        if (isEraser)
            setTimeout(() => showMessage('eraser'), 1000);
        else
            setTimeout(() => showMessage(currShapeDraw), 1000);
    }

})

// clear local storage
deleteStorage.addEventListener('click', () => {
    localStorage.removeItem('saveCanvas');
    showMessage('Cleared Local Storage');
    if (isEraser)
        setTimeout(() => showMessage('eraser'), 1000);
    else
        setTimeout(() => showMessage(currShapeDraw), 1000);
})


// Save Canvas As Image
saveImage.addEventListener('click', () => {
    saveImage.firstElementChild.href = canvas.toDataURL('image/jpeg', 1);
    saveImage.firstElementChild.download = 'paint-example.jpeg';
    showMessage('Image File Saved');
    if (isEraser)
        setTimeout(() => showMessage('eraser'), 1000);
    else
        setTimeout(() => showMessage(currShapeDraw), 1000);
})

/*
Shapes

-> freeHand
-> circle fill stroke
-> rectangle fill stroke
-> line fill stroke

*/ 