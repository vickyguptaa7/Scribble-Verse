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

const canvas = document.createElement('canvas');
canvas.id = 'canvas';
const context = canvas.getContext('2d');

let currentPenSize = 10;
let currBucketColor = '#fff';
let currPenColor = '#000000';
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];
let currentDrawState = {};
let isTouched = false;
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
    for (let i = 1; i < drawnArray.length; i++) {
        context.beginPath();

        // we first move where we have to start the drawing
        context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);

        // Setting Up The initials 
        context.lineWidth = drawnArray[i - 1].size;
        context.lineCap = 'round';
        if (drawnArray[i - 1].erase) {
            context.strokeStyle = bucketColor;
        } else {
            context.strokeStyle = drawnArray[i - 1].color;
        }

        // Drawing the line
        context.lineTo(drawnArray[i].x, drawnArray[i].y);
        // adding stroke to lines
        context.stroke();
    }
}

function storeDrawn(x, y, size, color, erase) {
    const line = {
        x, y, size, color, erase,
    };
    // console.log(line);
    drawnArray.push(line);
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
    storeDrawn(undefined);
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
    else {
        storeDrawn(undefined);
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