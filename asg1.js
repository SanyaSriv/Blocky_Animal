// Vertex shader program
var VSHADER_SOURCE =
  `attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
let g_globalAngle = 0;
let g_globalAngleVertical = 0;
let u_GlobalRotateMatrix;
let u_ModelMatrix = [];


// Function to render all shapes stored in g_points_array
// we need a way to store how and when exactly was the butterfly drawn
function renderAllShapes() {
  // Clear the canvas
  // console.log("Came here, going to draw the body");

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // main body
  var body = new Cube();
  body.color = [254/255, 175/255, 52/255, 1.0];
  body.matrix.setTranslate(-0.5, -0.5, -0.5);
  body.matrix.scale(0.5, 0.5, 0.5);
  body.render();

  //body detail
  var body_detail = new Cube();
  body.color = [207/255,167/255,105/255, 1.0];
  body.matrix.setTranslate(-0.35, -0.20, -0.52);
  body.matrix.scale(0.35, 0.2, 0.03);
  body.render();

  // making text on Wall-E's body - | of W
  // writing W
  var w_1 = new Cube();
  w_1.color = [1,0,0, 1.0];
  w_1.matrix.setTranslate(-0.29, -0.45, -0.6);
  w_1.matrix.scale(0.010, 0.05, 0.01);
  w_1.render();

  var w_2 = new Cube();
  w_2.color = [1,0,0, 1.0];
  w_2.matrix.setTranslate(-0.27, -0.45, -0.6);
  w_2.matrix.scale(0.010, 0.05, 0.01);
  w_2.render();

  var w_3 = new Cube();
  w_3.color = [1,0,0, 1.0];
  w_3.matrix.setTranslate(-0.25, -0.45, -0.6);
  w_3.matrix.scale(0.010, 0.05, 0.01);
  w_3.render();

  var w_4 = new Cube();
  w_4.color = [1,0,0, 1.0];
  w_4.matrix.setTranslate(-0.25, -0.45, -0.6);
  w_4.matrix.rotate(90, 0, 0, 1);
  w_4.matrix.scale(0.010, 0.04, 0.01);
  w_4.render();

  // right leg
  var leg_r = new Triangle3D();
  leg_r.color = [111/255, 115/255, 117/255, 1.0];
  leg_r.matrix.setTranslate(0.2, -0.65, 0.1);
  // body.matrix.rotate(90, 1, 0, 0);
  leg_r.matrix.rotate(98, 0, 0, 1); // decides if it is inward or outward
  leg_r.matrix.rotate(45, 0, 1, 0);
  leg_r.matrix.rotate(-85, 1, 0, 0);
  leg_r.matrix.scale(0.5, 0.5, 0.15);
  leg_r.render();

  // left leg
  var leg_l = new Triangle3D();
  leg_l.color = [111/255, 115/255, 117/255, 1.0];
  leg_l.matrix.setTranslate(-0.50, -0.66, 0.1);
  // body.matrix.rotate(90, 1, 0, 0);
  leg_l.matrix.rotate(91, 0, 0, 1); // decides if it is inward or outward
  leg_l.matrix.rotate(45, 0, 1, 0);
  leg_l.matrix.rotate(-85, 1, 0, 0);
  leg_l.matrix.scale(0.5, 0.5, 0.15);
  leg_l.render();
  // var body = new Cylinder();
  // body.color = [249/255, 189/255, 60/255, 1.0];
  // body.matrix.setTranslate(-0.5, -0.5, -0.5);
  // // body.matrix.rotate(45, 0, 0, 1);
  // body.matrix.scale(0.5, 0.5, 0.5);
  // body.render();

}

// // this will listen to all sliders
// this is slowing down the program
function AddActionsToHtmlUI() {
  // listener for camera angle
  document.getElementById("camera_angle").addEventListener('mousemove', function() {g_globalAngle = this.value; setRotation();});
  document.getElementById("camera_angle2").addEventListener('mousemove', function() {g_globalAngleVertical = this.value; setRotation();});

}

function setRotation() {
  // first rotate it horizontally
  var globalRotate = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  // then rotate it vertically
  globalRotate.rotate(g_globalAngleVertical, 1, 0, 0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotate.elements);
  renderAllShapes();
}
// extract the canvas and initialize WebGL
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", {preserveDrawingBuffer : true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
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

  // get the storage location of u_PointSize
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_PointSize');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, identityM.elements);
}
function click(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var z = ev.clientZ;
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  console.log(x, y);
}
function main() {
  // Setting up WebGL
  setupWebGL();
  connectVariablesToGLSL();
  // Initialize shaders
  AddActionsToHtmlUI();
  canvas.onmousedown = function(ev){ click(ev) };
  canvas.onmousemove = function(ev){if (ev.buttons == 1) {click(ev)}};
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the canvas
  // gl.clear(gl.COLOR_BUFFER_BIT);

  renderAllShapes();
}
