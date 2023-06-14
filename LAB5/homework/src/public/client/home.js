const a = (2 * Math.PI) / 6;
const r = 10;
const b = 2 * Math.PI;
let ctx;
let chart;
var canvas;
let cmd_input;
let submit_btn;
let ifChart;
let allElements;
let interavlID = -1;
let cnt = 0;
let changing = 0;
let timeoutID = -1;
let last = -1;

const main = () => {
  prepareDOMElements();
  creatingCanvas();
};

const prepareDOMElements = () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  allElements = document.querySelectorAll(".card");
  console.log(allElements);
};

//switching colors
let flag = 1;
const switchColor = () => {};

//drawing_canvas

const creatingCanvas = () => {
  drawHexagon(r, r);
  drawCircle(b);
  drawTriangle();
};

function drawHexagon(x, y) {
  ctx.beginPath();
  ctx.strokeStyle = "#ff7400";
  ctx.fillStyle = "#e76f51";
  for (var i = 0; i < 6; i++) {
    ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }
  ctx.fill();
  ctx.closePath();
  ctx.stroke();
}

function drawCircle(R) {
  ctx.beginPath();
  ctx.strokeStyle = "#ffc100";
  ctx.fillStyle = "#ffc100";
  ctx.arc(10, 12, 5, 0, R);
  ctx.fill();
  ctx.closePath();
  ctx.stroke();
}

function drawTriangle() {
  ctx.moveTo(2, 6);
  ctx.lineTo(10, 2);
  ctx.lineTo(20, 6);

  ctx.fill();
}

const changeState = (flag) => {
  console.log("flag: %i", flag);
  if (flag === 0) {
    console.log("intervalID: %i", interavlID);
    if (interavlID < 0) {
      return;
    }
    cnt += 1;
    console.log("Zatrzymałem interwal i tyle razy to zrobiłem: %i: ", cnt);
    clearInterval(interavlID);
  }
  interavlID = setInterval(changeRandomCard, 2000);
};

const changeRandomCard = () => {
  let max = allElements.length - 1;
  console.log("maxxx: %i", max);
  let random = Math.floor(Math.random() * max);
  if (last >= 0) {
    allElements[last].style.backgroundColor = "#ffffff";
  }
  allElements[random].style.backgroundColor = "#000000";
  last = random;
};

const stopChanging = () => {
  cnt += 1;
  changing = 0;
  console.log("stop: ", cnt);
  if (interavlID > 0) {
    clearInterval(interavlID);
  }
};

document.addEventListener("DOMContentLoaded", main);

document.addEventListener("mousemove", (event) => {
  if (changing === 0) {
    cnt = 0;
    changing = 1;
    interavlID = setInterval(changeRandomCard, 500);
  }
  if (timeoutID > 0) {
    clearTimeout(timeoutID);
  }
  timeoutID = setTimeout(stopChanging, 1000);
});
