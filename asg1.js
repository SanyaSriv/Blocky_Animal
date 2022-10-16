// Vertex shader program
var VSHADER_SOURCE =
  `attribute vec4 a_Position;
  uniform float u_PointSize;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_PointSize;
  }`;

// Fragment shader program
var FSHADER_SOURCE =
  `precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

// declaring the global variables
let canvas;
let gl;
let a_Position;
let u_PointSize;
let u_FragColor;
let size_of_shape; // this will store the size of the shape extracted from the slider
let red_color, blue_color, green_color; // these will store the color information extracted from the slider
let number_of_segments; // this will store the number of segments information extracted from the slider
let transparency; // this will store the transparency information extracted from the slider

// we will be replacing all the arrays with one singular array
let g_points_array = [] // this will store all the shapes to be rendered

// for knowing which shape to draw
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const PIZZA = 3;
// we will be starting with default: point (square shape)
let G_SHAPE_TYPE = POINT

// this will store all the image related stuff
// so when we click, the image does not dissapear
let image_array = []
// format of the image array = [ [[rgb array], [points_array for calling drawTraingles()]],
//                               [[rgb array], [points_array for calling drawTraingles()]], ...]

// this denotes the time after which point and
// before which point we need to draw the butterfly
let DRAW_BUTTERFLY_NOW = -1;

// this function will be used for clearing the canvas
function clearCanvas() {
  image_array = []
  g_points_array = []
  renderAllShapes();
}

// Function to render all shapes stored in g_points_array
// we need a way to store how and when exactly was the butterfly drawn
function renderAllShapes() {
  // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT);
  // // check if we also need to draw the image: butterfly so butterfly does not get erased when we are painting over it
  // var len = g_points_array.length;
  // for(var i = 0; i < len; i++) {
  //   if (g_points_array[i] == DRAW_BUTTERFLY_NOW) {
  //     // we need to draw the butterfly now
  //     for (var j = 0; j < image_array.length; j ++) {
  //       gl.uniform4f(u_FragColor, image_array[j][0][0], image_array[j][0][1], image_array[j][0][2], image_array[j][0][3]);
  //       drawTriangles(image_array[j][1]);
  //     }
  //   } else {
  //     // we need to draw the user clicked point
  //     g_points_array[i].render();
  //   }
  // }
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
  drawTriangles3D([-1.0,0.0,0.0, -0.5,-1.0,0.0,  0.0,0.0,0.0]);

  var body = new Cube();
  body.color = [1.0, 0.0, 0.0, 1.0];
  body.render();
}

// for selecting the right color and adding it to g_colors
// TODO: Change this approach
function selectColor() {
  red_color = document.getElementById("color_red").value;
  blue_color = document.getElementById("color_blue").value;
  green_color = document.getElementById("color_green").value;

  red_color = red_color / 100;
  blue_color = blue_color / 100;
  green_color = green_color / 100;

}

// For getting the transparency level selected by the user
function selectTransparency() {
  transparency = document.getElementById("Transparency").value;
}

// for getting the size selected by the user
function selectSize() {
  size_of_shape = document.getElementById("shape_size").value;
}

// for getting the number of segments in case of circles
function selectSegment() {
  number_of_segments = document.getElementById("segment_size").value;
}

// set the current shape type to triangle
function ChangeShapeToTriangle() {
  G_SHAPE_TYPE = TRIANGLE;
}

// set the current shape to square
function ChangeShapeToSquare() {
  // square in our case is represented by a point;
  G_SHAPE_TYPE = POINT;
}

// set the current shape to circle
function ChangeShapeToCircle() {
  G_SHAPE_TYPE = CIRCLE;
}

function ChangeShapeToPizza() {
  G_SHAPE_TYPE = PIZZA;
}

// this function does everything when something is clicked
function click(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  // extracting all the things needed
  selectColor(); // extract the colours
  selectSize(); // get the size
  selectSegment(); // get the segments
  selectTransparency(); // getting transparency

  // make a new point or tiangle
  let new_point;

  if (G_SHAPE_TYPE == POINT) {
    new_point = new Point();
    new_point.type = "point";
  } else if (G_SHAPE_TYPE == TRIANGLE) {
    new_point = new Triangle();
    new_point.type = "Triangle";
  } else if (G_SHAPE_TYPE == CIRCLE) {
    new_point = new Circle();
    new_point.type = "Circle";
    new_point.segments = number_of_segments;
  } else if (G_SHAPE_TYPE == PIZZA) {
    pizza(x, y);
    return;
  }

  new_point.position[0] = x;
  new_point.position[1] = y;
  new_point.color[0] = red_color;
  new_point.color[1] = green_color;
  new_point.color[2] = blue_color;
  new_point.color[3] = 1 - (transparency / 100);
  new_point.size = size_of_shape;

  g_points_array.push(new_point); // pushing the shape into an array

  renderAllShapes();

}

function pizza(x, y) {

  let point = new Pizza();
  point.size = size_of_shape;
  point.position[0] = x;
  point.position[1] = y;
  g_points_array.push(point);
  renderAllShapes();
}
// // this will listen to all sliders
// this is slowing down the program
// function AddActionsToHtmlUI() {
//   // listener for colors
//   document.getElementById("color_red").addEventListener('mouseup', function() {red_color = this.value / 100});
//   document.getElementById("color_blue").addEventListener('mouseup', function() {blue_color = this.value / 100});
//   document.getElementById("color_green").addEventListener('mouseup', function() {green_color = this.value / 100});
//
//   // listener for transparency
//   // document.getElementById("Transparency").addEventListener('mouseup', function() {transparency = this.value});
// }

// extract the canvas and initialize WebGL
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", {preserveDrawingBuffer : true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

// compile the shader programs, attach the javascript variables to the GLSL variables
function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // get the storage location of u_PointSize
  u_PointSize = gl.getUniformLocation(gl.program, 'u_PointSize');
  if (u_PointSize < 0) {
    console.log('Failed to get the storage location of u_PointSize');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // for transparency - TODO: Can shift these somewhere else
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function main() {
  // Setting up WebGL
  setupWebGL();
  // Initialize shaders
  connectVariablesToGLSL();

  // listener function call
  // AddActionsToHtmlUI(); // removing event listeners because it is massively slowing down the program

  // Register function (event handler) to be called on a mouse press
  // canvas.onmousedown = function(ev){ click(ev) };
  // canvas.onmousemove = function(ev){if (ev.buttons == 1) {click(ev)}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT);
  renderAllShapes();
}
