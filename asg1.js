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

  var globalRotate = new Matrix4().rotate(g_globalAngle, g_globalAngleVertical, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotate.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var body = new Cube();
  body.color = [1.0, 0.0, 0.0, 1.0];
  body.matrix.setTranslate(0.0, 0.0, 0.0);
  // body.matrix.rotate(45, 0, 0, 1);
  body.matrix.scale(0.6, 0.6, 0.6);
  body.render();

}

// // this will listen to all sliders
// this is slowing down the program
function AddActionsToHtmlUI() {
  // listener for camera angle
  document.getElementById("camera_angle").addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes();});
  document.getElementById("camera_angle2").addEventListener('mousemove', function() {g_globalAngleVertical = this.value; renderAllShapes();});

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

function main() {
  // Setting up WebGL
  setupWebGL();
  connectVariablesToGLSL();
  // Initialize shaders
  AddActionsToHtmlUI();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the canvas
  // gl.clear(gl.COLOR_BUFFER_BIT);

  renderAllShapes();
}
