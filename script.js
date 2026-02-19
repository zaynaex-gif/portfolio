const canvas = document.getElementById("scrollCanvas");
const context = canvas.getContext("2d");

const frameCount = 240;
const images = [];
const imageSeq = {
    frame: 0
};

// Resize canvas properly
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Preload images
for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    const frameNumber = String(i).padStart(3, '0');
    img.src = `frames/ezgif-frame-${frameNumber}.jpg`;
    images.push(img);
}

// Draw image centered
function drawImage(img) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
    );

    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;

    context.drawImage(
        img,
        x,
        y,
        img.width * scale,
        img.height * scale
    );
}

// Update frame on scroll
function updateImage() {
    const scrollTop = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScroll;
    const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
    );

    if (images[frameIndex].complete) {
        drawImage(images[frameIndex]);
    }
}

window.addEventListener("scroll", updateImage);

// Draw first frame once loaded
images[0].onload = () => {
    drawImage(images[0]);
};
