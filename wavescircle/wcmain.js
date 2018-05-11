console.clear();

var canvas = document.querySelector('#art');
var ctx = canvas.getContext('2d');
var width, height;
var rows = 0;
var scale = 120;
var lines = [];
var dpi = window.devicePixelRatio > 1.5 ? 2 : 1;
var offsetTop = 0;

function init () {
  tl = new TimelineMax({repeat: -1});

  canvas.style.width = "80vmin";
  canvas.style.height = "80vmin";
  
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  
  rows = Math.floor(height / scale);
  
  offsetTop = height - (rows * scale);
  
  width = width * dpi;
  height = height * dpi;
  
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  if (dpi === 2) {
    canvas.style.transform = 'translate(-50%, -50%) scale(0.5)';
  }
  
  lines = [];
  for (var y = 0; y < rows; y++) {
    var dots = [];
    for (var x = 0; x < width / 2; x++) {
      dots.push([x * 2, y * scale + (scale/2) + (offsetTop/2)]);
    }
    dots.push([width, y * scale + (scale/2) + (offsetTop/2)]);
    lines.push(new Line(dots));
  }
}

function Line (dots) {
  this.dots = dots;
  this.animation = 0;
  this.offset = Math.random();
  this.height = Math.random();
  this.speed = (Math.random() + 0.2) * 0.006 * (Math.random() > 0.5 ? 1 : -1);
  this.lines = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
}
Line.prototype.draw = function () {
  this.offset += this.speed;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.moveTo(this.dots[0][0], this.dots[0][1]);
  for (var i = 0; i < this.dots.length; i++) {
    var x = this.dots[i][0];
    var y = this.dots[i][1] + noise.simplex3(x*0.008,0, this.offset) * 40;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  
  for (var k=0;k<5;k++) {
    ctx.globalAlpha = (0.5 - (k/10));
    ctx.beginPath();
    ctx.moveTo(this.dots[0][0], this.dots[0][1]);
    for (var i = 0; i < this.dots.length; i++) {
      var x = this.dots[i][0];
      var y = this.dots[i][1] + noise.simplex3(x*0.008,this.lines[k], this.offset) * 40;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function render () {
  requestAnimationFrame(render);
  
  ctx.clearRect(0, 0, width, height);
  for (var i = 0; i < lines.length; i++) {
    lines[i].draw();
  }
}

var resizeTimeout;
window.addEventListener('resize', () => {
  resizeTimeout = window.clearTimeout(resizeTimeout);
  resizeTimeout = window.setTimeout(init, 500);
})
init();
requestAnimationFrame(render);