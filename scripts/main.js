import Particle from "./Particle.js";

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

const imgEle = new Image();
imgEle.src = "../images/target1.png";

let imgX;
let imgY;
let imgW;
let imgH;
let imgData;
let particles;
let particle;

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  imgW = canvas.width / 3;
  imgH = imgW * (imgEle.height / imgEle.width);
  imgX = (canvas.width - imgW) / 2;
  imgY = imgH * 0.2;
}

function init() {
  setCanvasSize();
  ctx.drawImage(imgEle, imgX, imgY, imgW, imgH);
  imgData = ctx.getImageData(imgX, imgY, imgW, imgH);
  particles = [];
  for (let y = 0; y < imgData.height; y++) {
    for (let x = 0; x < imgData.width; x++) {
      if (imgData.data[x * 4 + y * 4 * imgData.width + 3] > 125) {
        particle = new Particle({
          color: `rgb(
  						${imgData.data[x * 4 + y * 4 * imgData.width]},
  						${imgData.data[x * 4 + y * 4 * imgData.width + 1]},
  						${imgData.data[x * 4 + y * 4 * imgData.width + 2]})`,
          x: x + imgX,
          y: y + imgY,
          originX: x + imgX,
          originY: y + imgY,
          speed: Math.random() * 3,
          radian: (Math.random() * 360 * Math.PI) / 180,
        });
        particles.push(particle);
      }
    }
  }
}

function scrollHandler() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scrollRatio =
    window.pageYOffset / (document.body.clientHeight - window.innerHeight);
  const particleSize = 5 + 50 * scrollRatio;

  particles.forEach(({ x, originX, y, originY, color, radian, speed }, idx) => {
    if (idx % 100 === 0) {
      x = originX + Math.cos(radian) * window.pageYOffset * scrollRatio * speed;
      y = originY + Math.sin(radian) * window.pageYOffset * scrollRatio * speed;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, particleSize, particleSize);
      ctx.strokeRect(x, y, particleSize, particleSize);
    }
  });

  if (window.pageYOffset < 10) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgEle, imgX, imgY, imgW, imgH);
  }
}

window.addEventListener("load", init);
window.addEventListener("resize", init);
window.addEventListener("scroll", scrollHandler);
