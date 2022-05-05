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
let currBucketColor = '#efefef';
let currPenColor = '#A51DAB';
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];
let currentDrawState = {};
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
    currPenColor = bucketColor;
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
    for (let i = 0; i < drawnArray.length - 1; i++) {
        context.beginPath();
        context.moveTo(drawnArray[i].x, drawnArray[i].y);
        context.lineWidth = drawnArray[i].size;
        context.lineCap = 'round';
        if (drawnArray[i].erase) {
            context.strokeStyle = bucketColor;
        } else {
            context.strokeStyle = drawnArray[i].color;
        }
        context.lineTo(drawnArray[i + 1].x, drawnArray[i + 1].y);
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

canvas.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    const currentPosition = getMousePosition(event);
    context.moveTo(currentPosition.x, currentPosition.y);
    context.beginPath();
    context.lineWidth = currentPenSize;
    context.lineCap = 'round';
    context.strokeStyle = currPenColor;
})

canvas.addEventListener('mousemove', (event) => {
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
    else {
        storeDrawn(undefined);
    }
})

canvas.addEventListener('mouseup', (event) => {
    isMouseDown = false;

})


// Touch 
// Get Touch Position
function getTouchPosition(event) {
    const boundaries = canvas.getBoundingClientRect();
    // console.log(event.touches);
    return {
        x: event.touches[0].clientX - boundaries.left,
        y: event.touches[0].clientY - boundaries.top,
    };
}

canvas.addEventListener('touchstart', (event) => {
    isMouseDown = true;
    const currentPosition = getTouchPosition(event);
    context.moveTo(currentPosition.x, currentPosition.y);
    context.beginPath();
    context.lineWidth = currentPenSize;
    context.lineCap = 'round';
    context.strokeStyle = currPenColor;
    // console.log(currentPosition);
})

canvas.addEventListener('touchmove', (event) => {
    if (isMouseDown) {
        const currentPosition = getTouchPosition(event);
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
    isMouseDown = false;

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