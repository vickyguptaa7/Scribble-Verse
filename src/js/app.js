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

// diff shapes
diffShapes.addEventListener('click', () => {
    diffShapesContainer.classList.toggle('invisible');
    diffShapesContainer.classList.toggle('scale-0');
    diffShapesContainer.classList.toggle('-translate-x-[70%]');
})

allShapesBtn.forEach(shapeBtn => {
    shapeBtn.addEventListener('click', () => {
        switchToPen();
        currShapeDraw = shapeBtn.getAttribute('data-value');
        selectedTool.textContent = shapeBtn.getAttribute('data-value');
    })
})

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
    currShapeDraw = 'pen';
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
    canvas.width = window.innerWidth * (0.95);
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
                console.log(drawnArray[j]);
            }
        }
    }
}

// Clear Canvas
clearCanvas.addEventListener('click', () => {
    createCanvas();
    drawnArray = [];
    selectedTool.textContent = 'Canvas Cleared';
    setTimeout(switchToPen, 1500);
});

function storeDrawn(x, y, size, color, erase, h, w, shape) {
    const line = {
        x, y, size, color, erase, h, w, shape,
    };
    // console.log(line);
    if (drawnArray.length != currentDrawState) {
        drawnArray = drawnArray.splice(0, currentDrawState + 1);
    }
    eachStateArray.push(line);
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
    if (currShapeDraw !== 'pen') {
        // console.log("mdwn", currShapeDraw);
        storeDrawn(
            currentPosition.x,
            currentPosition.y,
            currentPenSize,
            currPenColor,
            isEraser,
            currentPosition.h,
            currentPosition.w,
            currShapeDraw,
        )
    }
})

// while clicked move to draw
canvas.addEventListener('mousemove', (event) => {
    // console.log("mmove");
    if (isMouseDown && currShapeDraw === 'pen') {
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
            currShapeDraw,
        );
    }
})

function selectedShapeDraw(shapeToDraw, x, y, w, h, color) {

    switch (shapeToDraw) {
        case 'rectangle-stroke': {
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
            console.log(color);
            context.arc(x, y, Math.max(h, w), 0, 2 * Math.PI, true);
            context.stroke();
            break;
        }
        case 'circle-fill': {
            context.fillStyle = color;
            context.arc(x, y, Math.max(h, w), 0, 2 * Math.PI, true);
            context.fill();
            break;
        }
        case 'line': {
            context.lineTo(x, y);
            context.stroke();
            break;
        }
        case 'pen': {
            context.lineTo(x, y);
            context.stroke();
            break;
        }
        default: console.log('Something Went Wrong! The Chosen Shape Is Not In Option');
    }
}

// This Function will draw the shapes other than free hand
function drawShapes(stateArray) {
    if (stateArray.length < 2) return;
    let prevPosition = { x: stateArray[0].x, y: stateArray[0].y };
    let currPosition = { x: stateArray[1].x, y: stateArray[1].y };
    let color = stateArray[0].color;
    let shape = stateArray[0].shape;
    let width = (currPosition.x - prevPosition.x);
    let height = (currPosition.y - prevPosition.y);
    context.lineWidth = stateArray[0].size;
    // Now Sign Of Above H and W plays crucial role because according to which we decide in which direction is made 
    // context.strokeRect(eachStateArray[0].x, eachStateArray[0].y, width, height);

    // To set the starting position as it is required 
    if (shape === 'line' || shape === 'pen')
        context.moveTo(prevPosition.x, prevPosition.y);

    // if (shape === 'pen'){
    //     selectedShapeDraw(shape,currPosition.x,currPosition.y,width,height,color);
    //     return;
    // }

    if (!shape.includes('rectangle')) {
        selectedShapeDraw(shape, currPosition.x, currPosition.y, Math.abs(width), Math.abs(height), color);
        return;
    }
    if (height > 0 && width > 0) {
        selectedShapeDraw(shape, prevPosition.x, prevPosition.y, width, height, color);
    }
    else if (height > 0) {
        selectedShapeDraw(shape, currPosition.x, prevPosition.y, Math.abs(width), height, color);
        // context.strokeRect(currPosition.x, prevPosition.y, Math.abs(width), height);
    }
    else if (width > 0) {
        selectedShapeDraw(shape, prevPosition.x, currPosition.y, width, Math.abs(height), color);
        // context.strokeRect(prevPosition.x, currPosition.y, width, Math.abs(height));
    }
    else {
        selectedShapeDraw(shape, currPosition.x, currPosition.y, Math.abs(width), Math.abs(height), color);
        // context.strokeRect(currPosition.x, currPosition.y, Math.abs(width), Math.abs(height));
    }
}

// unclicked to stop the drawing
canvas.addEventListener('mouseup', (event) => {
    // console.log("mend");
    if (currShapeDraw !== 'pen') {
        // If the shape is not free hand then 
        console.log('rectangle');
        let currentPosition = getMousePosition(event);
        storeDrawn(
            currentPosition.x,
            currentPosition.y,
            currentPenSize,
            currPenColor,
            isEraser,
            currentPosition.h,
            currentPosition.w,
            currShapeDraw,
        );
        drawShapes(eachStateArray);
        drawnArray.push(eachStateArray);
        currentDrawState = drawnArray.length - 1;
    }
    else if (eachStateArray.length !== 0) {
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
    // console.log(event);
    return {
        x: event.changedTouches[0].clientX - boundaries.left,
        y: event.changedTouches[0].clientY - boundaries.top,
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
    if (currShapeDraw !== 'pen') {
        // console.log("mdwn", currShapeDraw);
        storeDrawn(
            currentPosition.x,
            currentPosition.y,
            currentPenSize,
            currPenColor,
            isEraser,
            currentPosition.h,
            currentPosition.w,
            currShapeDraw,
        )
    }
})

canvas.addEventListener('touchmove', (event) => {
    console.log("tmove");
    if (isTouched && currShapeDraw === 'pen') {
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
            currShapeDraw,
        );
    }
})

canvas.addEventListener('touchend', (event) => {
    // console.log("tend");
    if (currShapeDraw !== 'pen') {
        // If the shape is not free hand then 
        // console.log('rectangle');
        let currentPosition = getTouchPosition(event);
        storeDrawn(
            currentPosition.x,
            currentPosition.y,
            currentPenSize,
            currPenColor,
            isEraser,
            currentPosition.h,
            currentPosition.w,
            currShapeDraw,
        );
        drawShapes(eachStateArray);
        drawnArray.push(eachStateArray);
        currentDrawState = drawnArray.length - 1;
    }
    else if (eachStateArray.length !== 0) {

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

/*
Shapes

-> freeHand
-> circle fill stroke
-> rectangle fill stroke
-> line fill stroke

*/ 