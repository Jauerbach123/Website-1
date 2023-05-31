//Start of Tweakpane
const PARAMS = {
  Universe: "false",
  Collisions: true,
  Show_names: false,
  Show_trails: true,
  Show_vectors: false,
  Alerts: true,
};

const pane = new Tweakpane.Pane({
  title: "Settings",
  expanded: false,
});

pane
  .addInput(PARAMS, "Universe", {
    options: { Infinite: false, Limit_to_screen: true },
  })
  .on("change", (ev) => {
    detectEdge = ev.value;
  });

pane.addInput(PARAMS, "Collisions").on("change", (ev) => {
  detectCollisions = ev.value;
});

pane.addInput(PARAMS, "Show_names").on("change", (ev) => {
  showPlanetNames = ev.value;
});

pane.addInput(PARAMS, "Show_trails").on("change", (ev) => {
  showPlanetTrails = !showPlanetTrails;
  ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
});

pane.addInput(PARAMS, "Show_vectors").on("change", (ev) => {
  showVectors = !showVectors;
});

pane.addSeparator();

pane.addInput(PARAMS, "Alerts").on("change", (ev) => {
  notifications = [];
  showNotifications = !showNotifications;
});

pane.addSeparator();

const btn = pane.addButton({
  title: "Pause",
});

pane.addSeparator();

const btn2 = pane.addButton({
  title: "Reset",
});

btn.on("click", () => {
  paused = !paused;
});

btn2.on("click", () => {
  resetScene();
});
//End of Tweakpane

//set up canvas
let canvas = document.getElementById("canvas1");
let ctx = canvas.getContext("2d");
//for planet trails
let canvas2 = document.getElementById("canvas2");
let ctx2 = canvas2.getContext("2d");

//animation frames
let secondsPassed;
let oldTimeStamp;
let fps;

//scale canvas
function resizeCanvas() {
  ctx.canvas.height = window.innerHeight;
  ctx.canvas.width = window.innerWidth;
  centerX = ctx.canvas.width / 2;
  centerY = ctx.canvas.height / 2;
  ctx2.canvas.height = window.innerHeight;
  ctx2.canvas.width = window.innerWidth;
}

//settings
let detectEdge = false;
let detectCollisions = true;
let showPlanetTrails = true;
let showPlanetNames = false;
let paused = false;
let showVectors = false;

//do not change these
let centerX, centerY;
let clicked = false;
let p = [];
let sunCollision = 0;
let recentPlanet = false;
let notifications = [];
let notificationShown = false;
let showNotifications = true;

let systemName;
let nameList = [];
nameList[0] = [
  "ACLITE",
  "ADIEA",
  "AETIS",
  "APHALOX",
  "APOLLO",
  "ARCIX",
  "ARDA",
  "ARRAKIS",
  "ASOGI",
  "AXIO",
  "BETA MU",
  "BAXIRIA",
  "CALADAN",
  "CAPRICA",
  "CELIA",
  "CENOR",
  "CERES",
  "CHANTU",
  "CHERON",
  "CHORA",
  "CION",
  "CIULEA",
  "CORVUS",
  "CRIEA",
  "DALEA",
  "DION",
  "DRYRIA",
  "ELIA",
  "ELON",
  "ENDOR",
  "EPSILON",
  "GAGARIN",
  "GARVIS",
  "GATHEA",
  "GEIDI",
  "GLACIA",
  "GNYPSO",
  "HARA",
  "HEDRAX",
  "HELA",
  "HELION",
  "HOTH",
  "ILEXO",
  "ILLIUM",
  "IO",
  "KAPPA",
  "KEPLER",
  "KRONIN",
  "KRYPTON",
  "LETO",
  "LORIA",
  "LUXOS",
  "MAERA",
  "MARCAB",
  "MINDU",
  "MIRI",
  "NABOO",
  "NIRON",
  "NULL",
  "OA",
  "OMICRON",
  "OXEBUS",
  "OZUNA",
  "PANDORA",
  "PELEA",
  "PERSEI",
  "PHAELON",
  "PETHION",
  "PHILON",
  "QUADRA",
  "RHEA",
  "RISA",
  "SAGAN",
  "SALUSA",
  "SEDNA",
  "SOLARIS",
  "STELOS",
  "TACIRU",
  "TAU CETI",
  "TERMINUS",
  "TERRA",
  "TETHEA",
  "THEAMIA",
  "THORE",
  "TYCHO",
  "VEDAKA",
  "VOON",
  "VORA",
  "VORTIS",
  "VULCAN",
  "XANDAR",
  "XALIA",
  "XENALIS",
  "XENU",
  "XERON",
  "ZOTH",
];
nameList[1] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "16",
  "1F",
  "1A",
  "2E",
  "2C",
  "23",
  "3-P",
  "3A",
  "30",
  "4S",
  "4Z-9",
  "42",
  "5-B",
  "5P",
  "51",
  "6-C",
  "6Q",
  "6X",
  "7A",
  "77",
  "7K1",
  "8-V",
  "85",
  "8E",
  "94",
  "9-CL",
  "9R",
  "F-6",
  "N4",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "X",
  "X2",
  "M83",
  "X72",
  "RP6",
  "SL9",
  "FG3",
  "RJ4",
  "R01",
  "RX7",
  "JF2",
  "L49",
  "3FE",
  "CA1",
  "N1",
  "P1",
  "X-134",
  "X-76",
  "X-49",
  "X-27",
  "C-1",
  "J1",
  "E1",
  "T1",
  "N80F",
  "006B",
  "3-7E",
  "521",
  "A2C",
  "SP7",
  "7SO",
  "59TC",
  "7NG",
  "C79",
  "464",
  "3S6",
  "43L",
  "9U-L",
  "C-95 O1",
  "DC-01",
  "",
  "",
  "",
  "",
];
nameList[2] = [
  "SYSTEM",
  "CLUSTER",
  "REGION",
  "SUPERCLUSTER",
  "SECTOR",
  "ZONE",
  "NEBULA",
  "QUADRANT",
];

//track mouse
let mouseX, mouseY, clickX, clickY;
let mouseDown = 0;
function mousemove(event) {
  if (event.clientX) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
}
canvas.addEventListener("mousemove", mousemove);

canvas.onmousedown = function () {
  if (mouseDown) --mouseDown;
  ++mouseDown;
  clicked = true;
  clickX = mouseX;
  clickY = mouseY;
};

canvas.onmouseup = function () {
  --mouseDown;
  if (recentPlanet === false) {
    addParticle(
      clickX,
      clickY,
      getRandom(6, 15),
      (mouseX - clickX) / 20,
      (mouseY - clickY) / 20,
      getRandom(0, 359),
      getRandomName("planet")
    );
    recentPlanet = true;
    setTimeout(() => {
      recentPlanet = false;
    }, 500);
  }
};

canvas.addEventListener(
  "touchstart",
  function (e) {
    if (mouseDown) --mouseDown;
    ++mouseDown;
    clicked = true;
    clickX = mouseX = e.touches[0].clientX;
    clickY = mouseY = e.touches[0].clientY;
  },
  false
);

canvas.addEventListener(
  "touchmove",
  function (e) {
    mouseX = e.changedTouches[0].clientX;
    mouseY = e.changedTouches[0].clientY;
  },
  false
);

canvas.addEventListener(
  "touchend",
  function (e) {
    mouseX = e.changedTouches[0].clientX;
    mouseY = e.changedTouches[0].clientY;

    if (recentPlanet === false) {
      addParticle(
        clickX,
        clickY,
        getRandom(6, 15),
        (mouseX - clickX) / 20,
        (mouseY - clickY) / 20,
        getRandom(0, 359),
        getRandomName("planet")
      );
      recentPlanet = true;
      setTimeout(() => {
        recentPlanet = false;
      }, 500);
    }
    --mouseDown;
  },
  false
);

document.body.onkeydown = function (e) {
  if (e.key == "r" || e.code == "KeyR" || e.keyCode == 82) {
    resetScene();
  }
  if (e.key == "p" || e.code == "KeyP" || e.keyCode == 80) {
    paused = !paused;
  }
};

function resetScene() {
  ctx2.clearRect(0, 0, canvas.width, canvas.height);
  resizeCanvas();

  clicked = false;
  mouseDown = 0;

  notifications = [];
  p = [];

  addParticle(centerX, centerY, 40, 0, 0, getRandom(0, 359), "SOL"); //
  systemName = getRandomName("system");

  if (paused) {
    paused = !paused;
  }
}

window.onload = function () {
  resizeCanvas();
  systemName = getRandomName("system");

  //star
  addParticle(centerX, centerY, 40, 0, 0, getRandom(0, 359), "SOL");

  //planets
  addParticle(
    centerX,
    centerY - 180,
    12,
    6.3,
    0,
    getRandom(0, 359),
    getRandomName("planet")
  );
  addParticle(
    centerX,
    centerY + 180,
    12,
    -6.3,
    0,
    getRandom(0, 359),
    getRandomName("planet")
  );
  addParticle(
    centerX + 120,
    centerY,
    15,
    0,
    5,
    getRandom(0, 359),
    getRandomName("planet")
  );
  addParticle(
    centerX - 120,
    centerY,
    15,
    0,
    -5,
    getRandom(0, 359),
    getRandomName("planet")
  );

  window.requestAnimationFrame(gameLoop);
};

function addParticle(
  xPosition,
  yPosition,
  size,
  xVelocity,
  yVelocity,
  color,
  name
) {
  p.push({
    x: xPosition,
    y: yPosition,
    size: size,
    xv: xVelocity,
    yv: yVelocity,
    color: color,
    name: name,
  });
}

function draw() {
  //draw sun
  if (sunCollision > 0) {
    ctx.fillStyle = ctx.shadowColor = `hsl(${p[0].color}, 100%, 70%)`;
    ctx.shadowBlur = getRandom(30, 35) + sunCollision * 5;
    sunCollision--;
  } else {
    ctx.fillStyle = ctx.shadowColor = `hsl(${p[0].color}, 100%, 90%)`;
    ctx.shadowBlur = getRandom(20, 25);
  }
  ctx.beginPath();
  ctx.arc(p[0].x, p[0].y, p[0].size, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.shadowBlur = "0";

  //draw planets
  for (let i = 1; i < p.length; i++) {
    //all this trigonomety is to calculate planet shadows
    let angle = Math.atan2(p[i].x - p[0].x, p[i].y - p[0].y);
    let hypotenuse = getDistance(p[i].x, p[i].y, p[0].x, p[0].y) + p[i].size;
    let adj = Math.sin(angle) * hypotenuse;
    let opp = Math.cos(angle) * hypotenuse;
    let gradient = ctx.createLinearGradient(
      p[0].x + adj,
      p[0].y + opp,
      2 * p[i].x - (p[0].x + adj),
      2 * p[i].y - (p[0].y + opp)
    );
    gradient.addColorStop(0.45, `hsl(${p[i].color}, 100%, 9%)`);
    gradient.addColorStop(1, `hsl(${p[i].color}, 100%, 50%)`);
    ctx.fillStyle = gradient;
    //single fill color: ctx.fillStyle = `hsl(${p[i].color}, 100%, 50%)`;
    ctx.beginPath();
    ctx.arc(p[i].x, p[i].y, p[i].size, 0, 2 * Math.PI, false);
    ctx.fill();

    if (showVectors === true) {
      ctx.strokeStyle = `hsl(${p[i].color}, 100%, 75%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p[i].x, p[i].y);
      ctx.lineTo(p[i].x + p[i].xv * 6, p[i].y + p[i].yv * 6);
      ctx.stroke();
    }

    if (showPlanetTrails === true && paused === false) {
      //planet trails - change color based on velocity (slow = blue, fast = red)
      let totalVelocity = Math.sqrt(p[i].xv ** 2 + p[i].yv ** 2);
      let velocityColor = 230 + totalVelocity * 5;
      if (velocityColor > 359) {
        velocityColor = 359; //max red
      }
      ctx2.strokeStyle = `hsl(${velocityColor}, 100%, 50%)`;
      ctx2.lineWidth = 0.2;
      ctx2.beginPath();
      ctx2.moveTo(p[i].x, p[i].y);
      ctx2.lineTo(p[i].px, p[i].py);
      ctx2.stroke();
    }
  }
  if (showPlanetNames === true || paused === true) {
    for (let i = 1; i < p.length; i++) {
      //planet names
      ctx.textAlign = "left";
      ctx.fillStyle = "white";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 10;
      ctx.font = "20px Unica One, sans-serif";
      ctx.fillText(p[i].name, p[i].x + 15, p[i].y - 15);
      ctx.font = "12px Unica One, sans-serif";
      ctx.fillStyle = `hsl(${p[i].color}, 100%, 75%)`;

      ctx.fillText(
        `VELOCITY: ${calcVelocity(p[i].xv, p[i].yv)}`,
        p[i].x + 20,
        p[i].y - 3
      );
      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.moveTo(p[i].x, p[i].y);
      ctx.lineTo(p[i].x + 14, p[i].y - 14);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  //draw line w/ mouse
  if (mouseDown) {
    //line
    ctx.lineWidth = 2;
    ctx.strokeStyle = ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
    ctx.lineTo(clickX, clickY);
    ctx.moveTo(clickX, clickY);
    ctx.stroke();
    ctx.closePath();
    //circle
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.arc(clickX, clickY, 12, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
    //text
    ctx.fillStyle = "yellow";
    ctx.font = "14px Unica One, sans-serif";
    ctx.fillText(
      `VELOCITY: ${calcVelocity(
        (mouseX - clickX) / 20,
        (mouseY - clickY) / 20
      )}`,
      mouseX + 10,
      mouseY - 10
    );
  }

  //show title + instructions
  if (clicked === false || paused === true) {
    ctx.shadowColor = "rgb(100,0,255)";
    ctx.shadowBlur = "20";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "45px Unica One, sans-serif";
    ctx.fillText("MiNi SOLAR SySTEM", centerX, 70);
    ctx.shadowBlur = "12";
    ctx.shadowColor = "rgb(0,0,0)";
    ctx.font = "20px Unica One, sans-serif";
    ctx.fillStyle = "rgb(220,220,200)";
    ctx.fillText("CLICK AND DRAG TO ADD PLANETS", centerX, 100);
    ctx.fillText("RESET: PRESS R     PAUSE: PRESS P", centerX, 120);
    ctx.fillText(`CURRENTLY IN`, centerX, centerY * 2 - 120);
    ctx.fillStyle = "yellow";
    ctx.font = "25px Unica One, sans-serif";
    ctx.fillText(systemName, centerX, centerY * 2 - 95);
    ctx.shadowBlur = "0";
  }

  if (paused) {
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "40px Unica One, sans-serif";
    ctx.fillText("PAUSED", centerX, centerY * 2 - 40);
  }

  //total planet count
  ctx.textAlign = "left";
  ctx.fillStyle = "white";
  ctx.font = "20px Unica One, sans-serif";
  ctx.fillText(`PLANETS: ${p.length - 1}`, 10, centerY * 2 - 10);

  if (showNotifications) {
    if (notifications.length > 0) {
      ctx.textAlign = "right";
      ctx.fillText(`${notifications[0]}`, centerX * 2 - 10, centerY * 2 - 10);
      if (notificationShown === false) {
        notificationShown = true;
        setTimeout(function () {
          notifications.shift();
          notificationShown = false;
        }, 3000);
      }
    }
  }
}

function updatePos() {
  //start at p[1] because p[0] is the sun
  for (let i = 1; i < p.length; i++) {
    if (detectCollisions === true) {
      //collision text w/ other planets (from spicyyoghurt.com)
      for (j = 1; j < p.length; j++) {
        if (j === i) continue;
        if (
          getDistance(p[i].x, p[i].y, p[j].x, p[j].y) <
          p[j].size + p[i].size
        ) {
          let vCollision = { x: p[j].x - p[i].x, y: p[j].y - p[i].y };
          let vDistance = getDistance(p[j].x, p[j].y, p[i].x, p[i].y);
          let vCollisionNorm = {
            x: vCollision.x / vDistance,
            y: vCollision.y / vDistance,
          };
          let vRelativeVelocity = {
            x: p[j].xv - p[i].xv,
            y: p[j].yv - p[i].yv,
          };
          let speed =
            vRelativeVelocity.x * vCollisionNorm.x +
            vRelativeVelocity.y * vCollisionNorm.y;

          //without mass
          // p[j].xv -= speed * vCollisionNorm.x;
          // p[j].yv -= speed * vCollisionNorm.y;
          // p[i].xv += speed * vCollisionNorm.x;
          // p[i].yv += speed * vCollisionNorm.y;

          //with mass (using "area of circle" instead of "volume of sphere")
          let mass1 = p[j].size ** 2 * Math.PI;
          let mass2 = p[i].size ** 2 * Math.PI;
          let impulse = (2 * speed) / (mass1 + mass2);

          p[j].xv -= impulse * mass2 * vCollisionNorm.x;
          p[j].yv -= impulse * mass2 * vCollisionNorm.y;
          p[i].xv += impulse * mass1 * vCollisionNorm.x;
          p[i].yv += impulse * mass1 * vCollisionNorm.y;
        }
      }
    }

    let totalMass = p[0].size * p[i].size;
    let distanceSquared = getDistance(p[0].x, p[0].y, p[i].x, p[i].y) ** 2;
    let totalForce = totalMass / distanceSquared;

    //update previous position
    p[i].px = p[i].x;
    p[i].py = p[i].y;

    let diffX, diffY;
    diffX = p[0].x - p[i].x;
    diffY = p[0].y - p[i].y;

    //change in velocity (due to gravity)
    p[i].xv += (totalForce / p[i].size) * diffX;
    p[i].yv += (totalForce / p[i].size) * diffY;

    //update current position
    p[i].x += p[i].xv;
    p[i].y += p[i].yv;

    if (detectEdge === true) {
      //edge detection
      let edge;
      if (p[i].x < 0) {
        p[i].x += ctx.canvas.width;
        edge = true;
      } else if (p[i].x > ctx.canvas.width) {
        p[i].x = p[i].x % ctx.canvas.width;
        edge = true;
      }
      if (p[i].y < 0) {
        p[i].y += ctx.canvas.height;
        edge = true;
      } else if (p[i].y > ctx.canvas.height) {
        p[i].y = p[i].y % ctx.canvas.height;
        edge = true;
      }
      if (edge === true) {
        p[i].px = p[i].x; //reset previous x & y
        p[i].py = p[i].y;
        p[i].xv *= 0.75; //reduce velocity so particles dont hit lightspeed
        p[i].yv *= 0.75;
      }
    }

    let removeThisPlanet = false;

    //collision detection w/ sun
    if (getDistance(p[i].x, p[i].y, p[0].x, p[0].y) - p[i].size < p[0].size) {
      sunCollision += 5;
      p[0].size++;
      console.log(`Planet "${p[i].name}" was destroyed by the sun.`);
      notifications.push(`'${p[i].name}' WAS DESTROYED.`);
      removeThisPlanet = true;
    }

    //planet too far
    let interstellar = 20000;
    if (
      p[i].x < -interstellar ||
      p[i].x > interstellar ||
      p[i].y < -interstellar ||
      p[i].y > interstellar
    ) {
      console.log(`Planet ${p[i].name} was lost in space.`);
      notifications.push(`'${p[i].name}' WAS LOST IN SPACE.`);
      removeThisPlanet = true;
    }

    if (removeThisPlanet === true) {
      p.splice(i, 1);
    }
  }
}

function gameLoop(timeStamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!paused) {
    updatePos();
  }
  draw();
  window.requestAnimationFrame(gameLoop);

  // Calculate the number of seconds passed since the last frame
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;
  // Calculate fps
  fps = Math.round(1 / secondsPassed);
  // Draw number to the screen
  ctx.fillStyle = "rgb(200,200,200)";
  ctx.textAlign = "left";
  ctx.font = "20px Unica One, sans-serif";
  ctx.fillText("FPS: " + fps, 10, 25);
}

function getDistance(x1, y1, x2, y2) {
  let y = x2 - x1;
  let x = y2 - y1;
  return Math.sqrt(x * x + y * y);
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function calcVelocity(a, b) {
  let c = Math.sqrt(a * a + b * b);
  return Math.round(c * 10) / 10;
}

function getRandomName(nameType) {
  let randomName;
  if (nameType === "system") {
    randomName = `THE ${nameList[0][getRandom(0, nameList[0].length - 1)]} ${
      nameList[2][getRandom(0, nameList[2].length - 1)]
    }`;
  } else if (nameType === "planet") {
    randomName = `${nameList[0][getRandom(0, nameList[0].length - 1)]} ${
      nameList[1][getRandom(0, nameList[1].length - 1)]
    }`;
    if (randomName.charAt(randomName.length - 1) == " ") {
      randomName = randomName.slice(0, -1);
    }
  }
  return randomName;
}
