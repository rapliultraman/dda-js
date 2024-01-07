window.onload = function () {
  console.log("loaded");
  var c = document.getElementById("canvas");
  const WIDTH = c.width;
  const HEIGHT = c.height;
  console.log("size:" + WIDTH + "x" + HEIGHT);
  var ctx = c.getContext("2d");
  if (!ctx) {
    return console.log("no context");
  }
  ctx.translate(WIDTH / 2, HEIGHT / 2);

  // Add grid
  function drawGrid() {
    ctx.beginPath();
    ctx.strokeStyle = "#eee";
    for (var i = -WIDTH / 2; i < WIDTH / 2; i += 50) {
      ctx.moveTo(i, -HEIGHT / 2);
      ctx.lineTo(i, HEIGHT / 2);
      ctx.stroke();
    }
    for (var i = -HEIGHT / 2; i < HEIGHT / 2; i += 50) {
      ctx.moveTo(-WIDTH / 2, i);
      ctx.lineTo(WIDTH / 2, i);
      ctx.stroke();
    }
    ctx.closePath();
  }

  // Add cartesian axis x and axis y
  function drawAxis() {
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.moveTo(-WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, 0);
    ctx.stroke();
    ctx.moveTo(0, -HEIGHT / 2);
    ctx.lineTo(0, HEIGHT / 2);
    ctx.stroke();
    ctx.fillText("+ x", WIDTH / 2 - 20, -10);
    ctx.fillText("- y", 10, HEIGHT / 2 - 20);
    ctx.fillText("- x", -WIDTH / 2 + 10, -10);
    ctx.fillText("+ y", 10, -HEIGHT / 2 + 20);
    ctx.closePath();
  }

  // add numbers to the axis, but making the scale 50:1
  function drawNumbers() {
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.font = "10px Arial";

    for (var i = -WIDTH / 2; i < WIDTH / 2; i += 50) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 5);
      ctx.stroke();
      ctx.fillText(i / 50, i - 5, 20);
    }
    for (var i = -HEIGHT / 2; i < HEIGHT / 2; i += 50) {
      ctx.moveTo(0, i);
      ctx.lineTo(-5, i);
      ctx.stroke();
      ctx.fillText(-i / 50, -20, i + 5);
    }
    ctx.closePath();
  }

  // create draggable div
  var focalPoint = document.getElementById("focalPoint");
  var mirroredFocalPoint = document.getElementById("mirroredFocalPoint");

  let isDraggingFocalPoint = false;
  let offsetXFocalPoint;

  focalPoint.addEventListener("mousedown", (e) => {
    isDraggingFocalPoint = true;
    offsetXFocalPoint = e.clientX - focalPoint.getBoundingClientRect().left;
    focalPoint.style.cursor = "grabbing";
  });

  realObject = document.getElementById("realObject");
  let isDraggingRealObject = false;
  let offsetXRealObject;
  let offsetYRealObject;

  realObject.addEventListener("mousedown", (e) => {
    isDraggingRealObject = true;
    offsetXRealObject = e.clientX - realObject.getBoundingClientRect().left;
    offsetYRealObject = e.clientY - realObject.getBoundingClientRect().top;
    realObject.style.cursor = "grabbing";
  });

  // add function that takes the value of the draggable div position and draws a line from the focal point to the point (0,10) on the canvas
  // function drawLine() {
  //   var focalLength = focalPoint.offsetLeft - WIDTH / 2;
  //   var mirroredFocalLength = mirroredFocalPoint.offsetLeft - WIDTH / 2;
  //   var realObjectX = realObject.offsetLeft - WIDTH / 2;
  //   var realObjectY = realObject.offsetTop - HEIGHT / 2;
  //   ctx.beginPath();
  //   ctx.strokeStyle = "#000";
  //   ctx.moveTo(realObjectX, realObjectY);
  //   ctx.lineTo(focalLength, 0);
  //   ctx.stroke();
  //   ctx.moveTo(realObjectX, realObjectY);
  //   ctx.lineTo(0, realObjectY);
  //   ctx.lineTo(mirroredFocalLength, 0);
  //   ctx.stroke();
  //   ctx.closePath();
  // }
  //draw infinite line that crosses the focal point and the point (0,10) on the canvas
  function drawLine() {
    var focalLength = focalPoint.offsetLeft - WIDTH / 2;
    var mirroredFocalLength = mirroredFocalPoint.offsetLeft - WIDTH / 2;
    var realObjectX = realObject.offsetLeft - WIDTH / 2;
    var realObjectY = realObject.offsetTop - HEIGHT / 2;
    var point1 = { x: realObjectX, y: realObjectY };
    var point2 = { x: focalLength, y: 0 };
    var point3 = { x: mirroredFocalLength, y: 0 };
    var point4 = { x: 0, y: realObjectY };
    var slope1 = (point2.y - point1.y) / (point2.x - point1.x);
    var slope2 = (point3.y - point4.y) / (point3.x - point4.x);
    var intercept1 = point1.y - slope1 * point1.x;
    var intercept2 = point4.y - slope2 * point4.x;
    // function slope(p1, p2) {
    //   return (p2.y - p1.y) / (p2.x - p1.x);
    // }
    // function intercept(p, m) {
    //   return p.y - m * p.x;
    // }

    function getY(x) {
      return slope1 * x + intercept1;
    }
    function getX(y) {
      return (y - intercept1) / slope1;
    }
    function getX2(y) {
      return (y - intercept2) / slope2;
    }
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.moveTo(getX(-HEIGHT / 2), -HEIGHT / 2);
    ctx.lineTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.lineTo(0, getY(0));
    ctx.lineTo(WIDTH / 2, getY(0));
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(0, point1.y);
    ctx.lineTo(point3.x, point3.y);
    ctx.lineTo(getX2(HEIGHT / 2), HEIGHT / 2);
    ctx.stroke();
    ctx.closePath();
  }

  document.addEventListener("mousemove", (e) => {
    if (isDraggingFocalPoint) {
      const x = e.clientX - offsetXFocalPoint;

      // Set limits to the x position
      const maxX = WIDTH;
      const minX = 0;

      // Ensure the x position stays within the limits
      const clampedXFocalPoint = Math.min(maxX, Math.max(minX, x));
      const clampedXMirroredFocalPoint = Math.min(
        maxX,
        Math.max(minX, WIDTH - x),
      );
      focalPoint.style.left = `${clampedXFocalPoint}px`;
      mirroredFocalPoint.style.left = `${clampedXMirroredFocalPoint}px`;
      drawCanvas();
    }
    if (isDraggingRealObject) {
      const x = e.clientX - offsetXRealObject;
      const y = e.clientY - offsetYRealObject;

      // Set limits to the x position
      const maxX = WIDTH;
      const minX = 0;

      // Set limits to the y position
      const maxY = HEIGHT;
      const minY = 0;

      // Ensure the x position stays within the limits
      const clampedX = Math.min(maxX, Math.max(minX, x));
      const clampedY = Math.min(maxY, Math.max(minY, y));

      realObject.style.left = `${clampedX}px`;
      realObject.style.top = `${clampedY}px`;
      drawCanvas();
    }
  });

  document.addEventListener("mouseup", () => {
    isDraggingFocalPoint = false;
    isDraggingRealObject = false;
    focalPoint.style.cursor = "grab";
  });

  // function to draw canvas
  function drawCanvas() {
    ctx.clearRect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT);
    drawGrid();
    drawAxis();
    drawNumbers();
    drawLine();
  }

  drawCanvas();
};
