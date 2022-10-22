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
let leg_vertical_movement = 0;
let arm_vertical_movement = 0;
let arm_horizontal_movement = 0;
let neck_front_back = 0;
let left_forearm_rotation = 0;
let left_forearm_scale = 100;
let hand_open_close_movement = 0;
// // this will listen to all sliders
// this is slowing down the program
function AddActionsToHtmlUI() {
  // listener for camera angle
  document.getElementById("camera_angle").addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes();});
  document.getElementById("camera_angle2").addEventListener('mousemove', function() {g_globalAngleVertical = this.value; renderAllShapes();});
  document.getElementById("wall_e_leg_vertical").addEventListener('mousemove', function() {leg_vertical_movement = this.value; scaleVerticalLegMovement();});
  document.getElementById("arm_vertical").addEventListener('mousemove', function() {arm_vertical_movement = this.value; scaleVerticalArmMovement();});
  document.getElementById("neck_front_back").addEventListener('mousemove', function() {neck_front_back = this.value; renderAllShapes();});
  document.getElementById("left_forearm").addEventListener('mousemove', function() {left_forearm_rotation = this.value; renderAllShapes();});
  document.getElementById("left_forearm_scale").addEventListener('mousemove', function() {left_forearm_scale = this.value; renderAllShapes();});
  document.getElementById("hands_open_close").addEventListener('mousemove', function() {hand_open_close_movement = this.value; renderAllShapes();});

}
// function setRotation() {
//   // first rotate it horizontally
//   var globalRotate = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
//   // then rotate it vertically
//   globalRotate.rotate(g_globalAngleVertical, 1, 0, 0);
//
//   gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotate.elements);
//   renderAllShapes();
// }
//
function scaleVerticalLegMovement() {
  leg_vertical_movement -= 50;
  leg_vertical_movement /= 300;
  // setting an upper limit
  if (leg_vertical_movement > 0.09) {
    leg_vertical_movement = 0.09;
  }
  renderAllShapes();
}
//
function scaleVerticalArmMovement() {
  // arm_vertical_movement -= 50;
  // arm_vertical_movement /= 300;
  renderAllShapes();
}
// Function to render all shapes stored in g_points_array
// we need a way to store how and when exactly was the butterfly drawn
function renderAllShapes() {
  // Clear the canvas
  // console.log("Came here, going to draw the body");

  // checkig for the leg movement - if it is not the default

  var globalRotate = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  // then rotate it vertically
  globalRotate.rotate(g_globalAngleVertical, 1, 0, 0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotate.elements);


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
  var wall_e_letter_scale = 0.8;
  var wall_e_z_axis_offset
  var w_1 = new Cube();
  w_1.color = [1,0,0, 1.0];
  w_1.matrix.setTranslate(-0.36, -0.45, -0.51);
  w_1.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  w_1.render();

  var w_2 = new Cube();
  w_2.color = [1,0,0, 1.0];
  w_2.matrix.setTranslate(-0.34, -0.45, -0.51);
  w_2.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  w_2.render();

  var w_3 = new Cube();
  w_3.color = [1,0,0, 1.0];
  w_3.matrix.setTranslate(-0.32, -0.45, -0.51);
  w_3.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  w_3.render();

  var w_4 = new Cube();
  w_4.color = [1,0,0, 1.0];
  w_4.matrix.setTranslate(-0.32, -0.45, -0.51);
  w_4.matrix.rotate(90, 0, 0, 1);
  w_4.matrix.scale(0.010 * wall_e_letter_scale, 0.04 * wall_e_letter_scale, 0.01);
  w_4.render();

  // writing A in WALL-E
  // first vertical line for A
  var a_1 = new Cube();
  a_1.color = [1,0,0, 1.0];
  a_1.matrix.setTranslate(-0.29, -0.45, -0.51);
  a_1.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  a_1.render();

  // second vertical line for A
  var a_2 = new Cube();
  a_2.color = [1,0,0, 1.0];
  a_2.matrix.setTranslate(-0.25, -0.45, -0.51);
  a_2.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  a_2.render();

  // upper top horizontal line for A
  var a_3 = new Cube();
  a_3.color = [1,0,0, 1.0];
  a_3.matrix.setTranslate(-0.247, -0.42, -0.51);
  a_3.matrix.rotate(90, 0, 0, 1);
  a_3.matrix.scale(0.010 * wall_e_letter_scale, 0.045 * wall_e_letter_scale, 0.01);
  a_3.render();

  // middle bar for A
  var a_4 = new Cube();
  a_4.color = [1,0,0, 1.0];
  a_4.matrix.setTranslate(-0.247, -0.44, -0.51);
  a_4.matrix.rotate(90, 0, 0, 1);
  a_4.matrix.scale(0.010 * wall_e_letter_scale, 0.045 * wall_e_letter_scale, 0.01);
  a_4.render();


  // now going to make the first L
  var l1_1 = new Cube();
  l1_1.color = [1,0,0, 1.0];
  l1_1.matrix.setTranslate(-0.22, -0.45, -0.51);
  l1_1.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  l1_1.render();

  var l1_2 = new Cube();
  l1_2.color = [1,0,0, 1.0];
  l1_2.matrix.setTranslate(-0.175, -0.45, -0.51);
  l1_2.matrix.rotate(90, 0, 0, 1);
  l1_2.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  l1_2.render();


  // now going to make the second L
  var l2_1 = new Cube();
  l2_1.color = [1,0,0, 1.0];
  l2_1.matrix.setTranslate(-0.16, -0.45, -0.51);
  l2_1.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  l2_1.render();

  var l2_2 = new Cube();
  l2_2.color = [1,0,0, 1.0];
  l2_2.matrix.setTranslate(-0.115, -0.45, -0.51);
  l2_2.matrix.rotate(90, 0, 0, 1);
  l2_2.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  l2_2.render();

  // making the dot
  var dot = new Cube();
  dot.color = [1,0,0, 1.0];
  dot.matrix.setTranslate(-0.09, -0.44, -0.51);
  dot.matrix.rotate(90, 0, 0, 1);
  dot.matrix.scale(0.02 * wall_e_letter_scale, 0.02 * wall_e_letter_scale, 0.01);
  dot.render();


  // now making the E of Wall E
  var e_1 = new Cube();
  e_1.color = [1,0,0, 1.0];
  e_1.matrix.setTranslate(-0.03, -0.45, -0.51);
  e_1.matrix.rotate(90, 0, 0, 1);
  e_1.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  e_1.render();

  var e_2 = new Cube();
  e_2.color = [1,0,0, 1.0];
  e_2.matrix.setTranslate(-0.03, -0.435, -0.51);
  e_2.matrix.rotate(90, 0, 0, 1);
  e_2.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  e_2.render();

  var e_3 = new Cube();
  e_3.color = [1,0,0, 1.0];
  e_3.matrix.setTranslate(-0.03, -0.42, -0.51);
  e_3.matrix.rotate(90, 0, 0, 1);
  e_3.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  e_3.render();

  var e_4 = new Cube();
  e_4.color = [1,0,0, 1.0];
  e_4.matrix.setTranslate(-0.07, -0.45, -0.51);
  e_4.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  e_4.render();

  // we will be defining all code related to Wall-e's legs here
  // right leg
  var leg_r = new Triangle3D();
  leg_r.color = [111/255, 115/255, 117/255, 1.0];
  leg_r.matrix.setTranslate(0.2, -0.65 + leg_vertical_movement, 0.1);
  // body.matrix.rotate(90, 1, 0, 0);
  leg_r.matrix.rotate(98, 0, 0, 1); // decides if it is inward or outward
  leg_r.matrix.rotate(45, 0, 1, 0);
  leg_r.matrix.rotate(-85, 1, 0, 0);
  leg_r.matrix.scale(0.5, 0.5, 0.15);
  leg_r.render();

  // left leg
  var leg_l = new Triangle3D();
  leg_l.color = [111/255, 115/255, 117/255, 1.0];
  leg_l.matrix.setTranslate(-0.50, -0.66 + leg_vertical_movement, 0.1);
  // body.matrix.rotate(90, 1, 0, 0);
  leg_l.matrix.rotate(91, 0, 0, 1); // decides if it is inward or outward
  leg_l.matrix.rotate(45, 0, 1, 0);
  leg_l.matrix.rotate(-85, 1, 0, 0);
  leg_l.matrix.scale(0.5, 0.5, 0.15);
  leg_l.render();

  // todo: add movement in arms
  // going to make Wall-E's arms
  // making left arm
  // TODO: Fix horizontal rotation
  var left_arm = new Cube();
  left_arm.color = [206/255, 189/255, 180/255, 1.0];
  left_arm.matrix.setTranslate(-0.04, -0.21, -0.2);
  left_arm.matrix.rotate(90, 0, 1, 0);
  left_arm.matrix.rotate(arm_vertical_movement, 1, 0, 0);
  // left_arm.matrix.rotate(arm_horizontal_movement, 0, 1, 0);
  var left_arm_reference_matrix = new Matrix4(left_arm.matrix);
  left_arm.matrix.scale(0.06, 0.05, 0.12);
  left_arm.render();

  var right_arm = new Cube();
  right_arm.color = [206/255, 189/255, 180/255, 1.0];
  right_arm.matrix.setTranslate(-0.47, -0.21, -0.2);
  right_arm.matrix.rotate(270, 0, 1, 0);
  right_arm.matrix.rotate(arm_vertical_movement, 1, 0, 0);
  // right_arm.matrix.rotate(- arm_horizontal_movement, 0, 1, 0);
  var right_arm_reference_matrix = new Matrix4(right_arm.matrix);
  right_arm.matrix.scale(0.06, 0.05, 0.12);
  right_arm.render();

  // Wall-e's hands2
  // left forearm part 1
  var left_forearm_1 = new Cube()
  left_forearm_1.color = [213/255, 162/255, 135/255, 1.0];
  left_forearm_1.matrix = left_arm_reference_matrix;
  left_forearm_1.matrix.translate(0.0, 0.0, 0.12);
  left_forearm_1.matrix.rotate(90, 0, 1, 0);
  left_forearm_1.matrix.rotate(-25, 0, 1, 0);
  // rotation based upon the slider
  left_forearm_1.matrix.rotate(left_forearm_rotation, 0, 1, 0);
  var left_forearm_1_reference_matrix = new Matrix4(left_forearm_1.matrix);
  left_forearm_1.matrix.scale(0.06, 0.05, 0.20);
  left_forearm_1.render();

  // left forearm part 2
  var left_forearm_2 = new Cube()
  left_forearm_2.color = [83/255, 122/255, 143/255, 1.0];
  left_forearm_2.matrix = left_forearm_1_reference_matrix;
  left_forearm_2.matrix.translate(0.009, 0.009, 0.198);
  var left_forearm_2_reference_matrix = new Matrix4(left_forearm_2.matrix);
  var left_forearm_2_reference_matrix_2 = new Matrix4(left_forearm_2.matrix);
  left_forearm_2.matrix.scale(0.03, 0.03, 0.12 * (left_forearm_scale / 100));
  left_forearm_2.render();

  // going to make the left hand now
  var left_hand_1 = new Cube();
  left_hand_1.color = [61/255, 85/255, 117/255, 1.0];
  left_hand_1.matrix = left_forearm_2_reference_matrix;
  left_hand_1.matrix.translate(0.00, 0.016, 0.12);
  // this is somehow also controlling the movement for left_hand_2
  // I suspect this is because we are reusing the left_forearm_2_reference_matrix
  // and it is getting passed by pointers and changing
  left_hand_1.matrix.rotate(hand_open_close_movement, 0, 1, 0);
  left_hand_1.matrix.scale(0.01, 0.05, 0.11);
  left_hand_1.render();

  var left_hand_2 = new Cube();
  left_hand_2.color = [61/255, 85/255, 117/255, 1.0];
  left_hand_2.matrix = left_forearm_2_reference_matrix;
  left_hand_2.matrix.translate(0.0, -1.1, 0.0);
  left_hand_2.render();

  var left_hand_3 = new Cube();
  left_hand_3.color = [125/255, 143/255, 165/255, 1.0];
  left_hand_3.matrix = left_forearm_2_reference_matrix_2;
  left_hand_3.matrix.translate(0.01, -0.01, 0.12);
  left_hand_3.matrix.rotate(45, 0, 1, 0);
  left_hand_3.matrix.rotate(-hand_open_close_movement, 0, 1, 0);
  left_hand_3.matrix.scale(0.01, 0.05, 0.11);
  left_hand_3.render()

  // var right_forearm_1 = new Cube()
  // right_forearm_1.matrix = right_arm_reference_matrix;
  // right_forearm_1.render();

  // making Wall-E's neck
  var neck_1 = new Cube();
  neck_1.color = [145/255, 103/255, 79/255, 1.0];
  neck_1.matrix.setTranslate(-0.27, -0.05, -0.2);
  neck_1.matrix.rotate(-25, 1, 0, 0);
  neck_1.matrix.rotate(neck_front_back, 1, 0, 0);
  var neck_1_reference_matrix = new Matrix4(neck_1.matrix);
  neck_1.matrix.scale(0.07, 0.128, 0.07);
  neck_1.render();

  var neck_2 = new Cube();
  neck_2.color = [149/255, 102/255, 72/255, 1.0];
  neck_2.matrix = neck_1_reference_matrix;
  neck_2.matrix.translate(0, 0.127, 0);
  neck_2.matrix.rotate(45, 1, 0, 0);
  neck_2.matrix.scale(0.07, 0.128, 0.07);
  neck_2.render();
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
