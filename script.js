const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

let mouse = {
  x: null,
  y: null,
  radius: 100,
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x + canvas.clientLeft / 2;
  mouse.y = event.y + canvas.clientTop / 2;
});

function drawImage() {
  let imageWidth = png.width;
  let imageHeight = png.height;
  const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  class Particle {
    constructor(x, y, color) {
      this.x = x + canvas.width / 2 - png.width * 2;
      this.y = y + canvas.height / 2 - png.height * 2;
      this.color = color;
      this.size = 2;
      this.baseX = x + canvas.width / 2 - png.width * 2;
      this.baseY = y + canvas.height / 2 - png.height * 2;
      this.density = Math.random() * 10 + 2;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
    update() {
      ctx.fillStyle = this.color;
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;

      const maxDistance = 100;
      // console.log();
      let force = (maxDistance - distance) / maxDistance;
      // console.log(force);
      if (force < 0) force = 0;

      let directionX = forceDirectionX * force * this.density * 0.6;
      let directionY = forceDirectionY * force * this.density * 0.6;

      if (distance < mouse.radius + this.size) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 20;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 20;
        }
      }
      this.draw();
    }
  }
  function init() {
    // particleArray = [];

    for (let y = 0, y2 = data.height; y < y2; y++) {
      for (let x = 0, x2 = data.width; x < x2; x++) {
        if (data.data[y * 4 * data.width + x * 4 + 4] > 128) {
          let positionX = x;
          let positionY = y;
          let color = `rgb(${data.data[y * 4 * data.width + x * 4]},${
            data.data[y * 4 * data.width + x * 4 + 1]
          }, ${data.data[y * 4 * data.width + x * 4 + 2]})`;

          particleArray.push(new Particle(positionX * 4, positionY * 4, color));
        }
      }
    }
  }

  function animate() {
    // console.log("a");
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0,0,0,.05)";
    ctx.fillRect(0, 0, innerWidth, innerHeight);

    // console.log(particleArray.length);
    for (let i = 0; i < particleArray.length; i++) {
      particleArray[i].update();
    }
  }
  init();
  animate();

  window.addEventListener("resize", function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
  });
}

const png = new Image();
png.src =
  "data:image/png;base64,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";

window.addEventListener("load", (e) => {
  console.log("page has loaded");
  ctx.drawImage(png, 0, 0);
  drawImage();
});
