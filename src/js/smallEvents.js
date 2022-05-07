const bucketSet = document.querySelector('.bucket-set');
const bucketColorWrapper = document.querySelector('.bucket-color-wrapper');
const penTools = document.querySelector('.pen-tool');
const penToolsWrapper = document.querySelector('.pen-tools-wrapper');

console.log(bucketColorWrapper, bucketSet);

bucketSet.addEventListener('click', () => {
    bucketColorWrapper.classList.toggle('invisible');
    bucketColorWrapper.classList.toggle('scale-0');
    bucketColorWrapper.classList.toggle('-translate-x-[100%]');
})

penTools.addEventListener('click',()=>{
    penToolsWrapper.classList.toggle('invisible');
    penToolsWrapper.classList.toggle('scale-0');
    penToolsWrapper.classList.toggle('-translate-x-[70%]');
})