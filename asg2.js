// Vertex shader program
var VSHADER_SOURCE =
  `attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_GlobalScaleMatrix;
  void main() {
    gl_Position = u_GlobalScaleMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
let u_GlobalScaleMatrix;
let u_ModelMatrix = [];
let leg_vertical_movement = 0;
let arm_vertical_movement = 0;
let arm_horizontal_movement = 0;
let neck_front_back = 0;
let left_forearm_rotation = 0;
let left_forearm_scale = 100;
let hand_open_close_movement = 0;
let hand_rotation = 0;
let upper_neck_rotation = 0;
let global_scale = 100;
let special_shift_animation = 0;
let mouse_rotate_x = 0;
let mouse_rotate_y = 0;
let mouse_rotate_z = 0;

// global animation variables
let hello_animation_state = 0;
let animation_leg_rotation = 0;
// // this will listen to all sliders
// this is slowing down the program
function AddActionsToHtmlUI() {
  // listener for camera angle
  document.getElementById("camera_angle").addEventListener('mousemove', function() {g_globalAngle = this.value; renderScene();});
  document.getElementById("camera_angle2").addEventListener('mousemove', function() {g_globalAngleVertical = this.value; renderScene();});
  document.getElementById("wall_e_leg_vertical").addEventListener('mousemove', function() {leg_vertical_movement = this.value; scaleVerticalLegMovement();});
  document.getElementById("arm_vertical").addEventListener('mousemove', function() {arm_vertical_movement = this.value; scaleVerticalArmMovement();});
  document.getElementById("neck_front_back").addEventListener('mousemove', function() {neck_front_back = this.value; renderScene();});
  document.getElementById("left_forearm").addEventListener('mousemove', function() {left_forearm_rotation = this.value; renderScene();});
  document.getElementById("left_forearm_scale").addEventListener('mousemove', function() {left_forearm_scale = this.value; renderScene();});
  document.getElementById("hands_open_close").addEventListener('mousemove', function() {hand_open_close_movement = this.value; renderScene();});
  document.getElementById("hands_rotate").addEventListener('mousemove', function() {hand_rotation = this.value; renderScene();});
  document.getElementById("neck_upper_rotate").addEventListener('mousemove', function() {upper_neck_rotation = this.value; renderScene();});
  document.getElementById("global_scale").addEventListener('mousemove', function() {global_scale = this.value; renderScene();});
  document.getElementById("hello_animation_on").addEventListener('mousedown', function() {hello_animation_state = 1; ticker = 0;});
  document.getElementById("hello_animation_off").addEventListener('mousedown', function() {hello_animation_state = 0; ticker = 0;});
  // trying to add the shift ket animation
  document.addEventListener('mousedown', function (ev) {special_shift_animation = ev.shiftKey; ticker = 0;});
}

function scaleVerticalLegMovement() {
  leg_vertical_movement -= 50;
  leg_vertical_movement /= 300;
  // setting an upper limit
  if (leg_vertical_movement > 0.09) {
    leg_vertical_movement = 0.09;
  }
  renderScene();
}
//
function scaleVerticalArmMovement() {
  renderScene();
}

// Function to render all shapes stored in g_points_array
// we need a way to store how and when exactly was the butterfly drawn
function renderScene() {
  // Clear the canvas
  // console.log("Came here, going to draw the body: ", shift_animation_rotation);
  // checkig for the leg movement - if it is not the default
  var start_time = performance.now();
  var combined_x_rotation = parseFloat(g_globalAngle) + parseFloat(shift_animation_rotation) + parseFloat(mouse_rotate_x);
  var combined_y_rotation = parseFloat(g_globalAngleVertical) + parseFloat(mouse_rotate_y);

  // console.log("x axis rotation: ", g_globalAngle, shift_animation_rotation, mouse_rotate_x);
  // console.log("y axis rotation: ", combined_y_rotation, g_globalAngleVertical, mouse_rotate_y/10);
  // var globalRotate = new Matrix4().rotate(g_globalAngle + shift_animation_rotation + mouse_rotate_x, 0, 1, 0);
  var globalRotate = new Matrix4().rotate(combined_x_rotation, 0, 1, 0);

  // then rotate it vertically
  // globalRotate.rotate(g_globalAngleVertical + mouse_rotate_y, 1, 0, 0);
  globalRotate.rotate(combined_y_rotation, 1, 0, 0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotate.elements);

  // setting up the scaling
  var scaling_mat = new Matrix4().scale((global_scale / 100) * annimation_zoom, (global_scale / 100) * annimation_zoom, (global_scale / 100) * annimation_zoom);
  gl.uniformMatrix4fv(u_GlobalScaleMatrix, false, scaling_mat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // console.log(global_scale);
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

  var battery_screen = new Cube();
  battery_screen.color = [0.0, 0.0, 0.0, 1.0];
  battery_screen.matrix.setTranslate(-0.15, -0.15, -0.53);
  battery_screen.matrix.scale(0.08, 0.12, 0.05);
  battery_screen.render();

  var battery_bar_1 = new Cube();
  battery_bar_1.color = [224/255, 231/255, 34/255, 1.0];
  battery_bar_1.matrix.translate(-0.128, -0.14, -0.54);
  battery_bar_1.matrix.scale(0.04, 0.01, 0.01);
  battery_bar_1.render();

  var battery_bar_2 = new Cube();
  battery_bar_2.color = [224/255, 231/255, 34/255, 1.0];
  battery_bar_2.matrix.translate(-0.128, -0.12, -0.54);
  battery_bar_2.matrix.scale(0.04, 0.01, 0.01);
  battery_bar_2.render();

  var battery_bar_3 = new Cube();
  battery_bar_3.color = [224/255, 231/255, 34/255, 1.0];
  battery_bar_3.matrix.translate(-0.128, -0.10, -0.54);
  battery_bar_3.matrix.scale(0.04, 0.01, 0.01);
  battery_bar_3.render();

  var red_button = new Cylinder();
  red_button.color = [1, 0, 0, 1.0];
  red_button.matrix.translate(-0.2, -0.129, -0.53);
  red_button.matrix.scale(0.04, 0.04, 0.01);
  red_button.render();

  var body_grill = new Cube();
  body_grill.color = [94/255, 110/255, 115/255, 1.0];
  body_grill.matrix.translate(-0.3, -0.095, -0.53);
  body_grill.matrix.scale(0.12, 0.06, 0.01);
  body_grill.render();

  var grill_bar_1 = new Cube();
  grill_bar_1.color = [0.0, 0.0, 0.0, 1.0];
  grill_bar_1.matrix.translate(-0.28, -0.088, -0.54);
  grill_bar_1.matrix.scale(0.037, 0.01, 0.001);
  grill_bar_1.render();

  var grill_bar_2 = new Cube();
  grill_bar_2.color = [0.0, 0.0, 0.0, 1.0];
  grill_bar_2.matrix.translate(-0.23, -0.088, -0.54);
  grill_bar_2.matrix.scale(0.037, 0.01, 0.001);
  grill_bar_2.render();

  var grill_bar_3 = new Cube();
  grill_bar_3.color = [0.0, 0.0, 0.0, 1.0];
  grill_bar_3.matrix.translate(-0.28, -0.074, -0.54);
  grill_bar_3.matrix.scale(0.037, 0.01, 0.001);
  grill_bar_3.render();

  var grill_bar_4 = new Cube();
  grill_bar_4.color = [0.0, 0.0, 0.0, 1.0];
  grill_bar_4.matrix.translate(-0.23, -0.074, -0.54);
  grill_bar_4.matrix.scale(0.037, 0.01, 0.001);
  grill_bar_4.render();

  var grill_bar_5 = new Cube();
  grill_bar_5.color = [0.0, 0.0, 0.0, 1.0];
  grill_bar_5.matrix.translate(-0.28, -0.06, -0.54);
  grill_bar_5.matrix.scale(0.037, 0.01, 0.001);
  grill_bar_5.render();

  var grill_bar_6 = new Cube();
  grill_bar_6.color = [0.0, 0.0, 0.0, 1.0];
  grill_bar_6.matrix.translate(-0.23, -0.06, -0.54);
  grill_bar_6.matrix.scale(0.037, 0.01, 0.001);
  grill_bar_6.render();

  var black_lining_front = new Cube();
  black_lining_front.color = [51/255, 53/255, 54/255, 1.0];
  black_lining_front.matrix.translate(-0.5, -0.02, -0.53);
  black_lining_front.matrix.scale(0.50, 0.02, 0.02);
  black_lining_front.render();

  var black_lining_right = new Cube();
  black_lining_right.color = [51/255, 53/255, 54/255, 1.0];
  black_lining_right.matrix.translate(-0.52, -0.021, 0);
  black_lining_right.matrix.rotate(90, 0, 1, 0);
  black_lining_right.matrix.scale(0.50, 0.02, 0.02);
  black_lining_right.render();

  var black_lining_left = new Cube();
  black_lining_left.color = [51/255, 53/255, 54/255, 1.0];
  black_lining_left.matrix.translate(0.0, -0.021, 0);
  black_lining_left.matrix.rotate(90, 0, 1, 0);
  black_lining_left.matrix.scale(0.50, 0.02, 0.02);
  black_lining_left.render();

  // making text on Wall-E's body - | of W
  // writing W
  var wall_e_letter_scale = 0.8;
  var wall_e_z_axis_offset
  var w_1 = new Cube();
  w_1.color = [0,0,0, 1.0];
  w_1.matrix.setTranslate(-0.36, -0.45, -0.51);
  w_1.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  w_1.render();

  var w_2 = new Cube();
  w_2.color = [0,0,0, 1.0];
  w_2.matrix.setTranslate(-0.34, -0.45, -0.51);
  w_2.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  w_2.render();

  var w_3 = new Cube();
  w_3.color = [0,0,0, 1.0];
  w_3.matrix.setTranslate(-0.32, -0.45, -0.51);
  w_3.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  w_3.render();

  var w_4 = new Cube();
  w_4.color = [0,0,0, 1.0];
  w_4.matrix.setTranslate(-0.32, -0.45, -0.51);
  w_4.matrix.rotate(90, 0, 0, 1);
  w_4.matrix.scale(0.010 * wall_e_letter_scale, 0.04 * wall_e_letter_scale, 0.01);
  w_4.render();

  // writing A in WALL-E
  // first vertical line for A
  var a_1 = new Cube();
  a_1.color = [0,0,0, 1.0];
  a_1.matrix.setTranslate(-0.29, -0.45, -0.51);
  a_1.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  a_1.render();

  // second vertical line for A
  var a_2 = new Cube();
  a_2.color = [0,0,0, 1.0];
  a_2.matrix.setTranslate(-0.25, -0.45, -0.51);
  a_2.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  a_2.render();

  // upper top horizontal line for A
  var a_3 = new Cube();
  a_3.color = [0,0,0, 1.0];
  a_3.matrix.setTranslate(-0.247, -0.42, -0.51);
  a_3.matrix.rotate(90, 0, 0, 1);
  a_3.matrix.scale(0.010 * wall_e_letter_scale, 0.045 * wall_e_letter_scale, 0.01);
  a_3.render();

  // middle bar for A
  var a_4 = new Cube();
  a_4.color = [0,0,0, 1.0];
  a_4.matrix.setTranslate(-0.247, -0.44, -0.51);
  a_4.matrix.rotate(90, 0, 0, 1);
  a_4.matrix.scale(0.010 * wall_e_letter_scale, 0.045 * wall_e_letter_scale, 0.01);
  a_4.render();


  // now going to make the first L
  var l1_1 = new Cube();
  l1_1.color = [0,0,0, 1.0];
  l1_1.matrix.setTranslate(-0.22, -0.45, -0.51);
  l1_1.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  l1_1.render();

  var l1_2 = new Cube();
  l1_2.color = [0,0,0, 1.0];
  l1_2.matrix.setTranslate(-0.175, -0.45, -0.51);
  l1_2.matrix.rotate(90, 0, 0, 1);
  l1_2.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  l1_2.render();


  // now going to make the second L
  var l2_1 = new Cube();
  l2_1.color = [0,0,0, 1.0];
  l2_1.matrix.setTranslate(-0.16, -0.45, -0.51);
  l2_1.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  l2_1.render();

  var l2_2 = new Cube();
  l2_2.color = [0,0,0, 1.0];
  l2_2.matrix.setTranslate(-0.115, -0.45, -0.51);
  l2_2.matrix.rotate(90, 0, 0, 1);
  l2_2.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  l2_2.render();

  // making the dot
  var dot = new Cube();
  dot.color = [0,0,0, 1.0];
  dot.matrix.setTranslate(-0.09, -0.44, -0.51);
  dot.matrix.rotate(90, 0, 0, 1);
  dot.matrix.scale(0.02 * wall_e_letter_scale, 0.02 * wall_e_letter_scale, 0.01);
  dot.render();

  var e_circle = new Cylinder();
  e_circle.matrix.setTranslate(-0.043, -0.43, -0.51);
  e_circle.matrix.scale(0.09 * wall_e_letter_scale, 0.09 * wall_e_letter_scale, 0.01);
  e_circle.render();
  // now making the E of Wall E
  var e_1 = new Cube();
  e_1.color = [1,1,1, 1.0];
  e_1.matrix.setTranslate(-0.0225, -0.45, -0.5102);
  e_1.matrix.rotate(90, 0, 0, 1);
  e_1.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  e_1.render();

  var e_2 = new Cube();
  e_2.color = [1,1,1, 1.0];
  e_2.matrix.setTranslate(-0.025, -0.435, -0.5102);
  e_2.matrix.rotate(90, 0, 0, 1);
  e_2.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  e_2.render();

  var e_3 = new Cube();
  e_3.color = [1,1,1, 1.0];
  e_3.matrix.setTranslate(-0.025, -0.42, -0.5102);
  e_3.matrix.rotate(90, 0, 0, 1);
  e_3.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  e_3.render();

  var e_4 = new Cube();
  e_4.color = [1,1,1, 1.0];
  e_4.matrix.setTranslate(-0.065, -0.45, -0.5102);
  e_4.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
  e_4.render();

  // we will be defining all code related to Wall-e's legs here
  // right leg
  var leg_r = new Triangle3D();
  leg_r.color = [111/255, 115/255, 117/255, 1.0];
  leg_r.matrix.setTranslate(0.2, -0.65 + leg_vertical_movement + animation_leg_rotation + shift_leg_rotation, 0.1);
  // body.matrix.rotate(90, 1, 0, 0);
  leg_r.matrix.rotate(98, 0, 0, 1); // decides if it is inward or outward
  leg_r_reference_matrix = new Matrix4(leg_r.matrix);
  leg_r.matrix.rotate(45, 0, 1, 0);
  leg_r.matrix.rotate(-85, 1, 0, 0);
  leg_r.matrix.scale(0.5, 0.5, 0.15);
  leg_r.render();

  // // adding cylinders in wheels
  // var wheel_r_1 = new Cylinder()
  // wheel_r_1.color = [104/255, 86/255, 75/255, 1.0]
  // wheel_r_1.matrix = leg_r_reference_matrix;
  // wheel_r_1.matrix.translate(0.12, 0.0, -0.4);
  // wheel_r_1.matrix.rotate(90, 1, 0, 0);
  // wheel_r_1.matrix.scale(0.2, 0.2, 0.01);
  // wheel_r_1.render();
  // left leg
  var leg_l = new Triangle3D();
  leg_l.color = [111/255, 115/255, 117/255, 1.0];
  leg_l.matrix.setTranslate(-0.50, -0.66 + leg_vertical_movement + shift_leg_rotation, 0.1);
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
  // trying animation here
  left_arm.matrix.rotate(-annimation_raise_hand, 1, 0, 0);
  // adding animation here
  left_arm.matrix.rotate(shift_animation_hands_up, 1, 0, 0);
  // left_arm.matrix.rotate(arm_horizontal_movement, 0, 1, 0);
  var left_arm_reference_matrix = new Matrix4(left_arm.matrix);
  left_arm.matrix.scale(0.06, 0.05, 0.12);
  left_arm.render();

  // Wall-e's hands2
  // left forearm part 1
  var left_forearm_1 = new Cube();
  left_forearm_1.color = [213/255, 162/255, 135/255, 1.0];
  left_forearm_1.matrix = left_arm_reference_matrix;
  left_forearm_1.matrix.translate(0.0, 0.0, 0.12);
  left_forearm_1.matrix.rotate(90, 0, 1, 0);
  left_forearm_1.matrix.rotate(-25, 0, 1, 0);
  // rotation based upon the slider
  left_forearm_1.matrix.rotate(left_forearm_rotation, 0, 1, 0);
  // trying animation here
  left_forearm_1.matrix.rotate(-annimation_open_hand, 0, 1, 0);
  // adding shift animation here
  left_forearm_1.matrix.rotate(- shift_forearm_rotation, 0, 1, 0);
  var left_forearm_1_reference_matrix = new Matrix4(left_forearm_1.matrix);
  left_forearm_1.matrix.scale(0.06, 0.05, 0.20);
  left_forearm_1.render();

  // left forearm part 2
  var left_forearm_2 = new Cube();
  left_forearm_2.color = [83/255, 122/255, 143/255, 1.0];
  left_forearm_2.matrix = left_forearm_1_reference_matrix;
  left_forearm_2.matrix.translate(0.009, 0.009, 0.198);
  left_forearm_2.matrix.rotate(hand_rotation, 0, 0, 1);
  var left_forearm_2_reference_matrix = new Matrix4(left_forearm_2.matrix);
  var left_forearm_2_reference_matrix_2 = new Matrix4(left_forearm_2.matrix);
  left_forearm_2.matrix.scale(0.03, 0.03, 0.12 * (left_forearm_scale / 100));
  left_forearm_2.render();

  // we need to add the scaling to the hand as well: left_forearm_scale

  // going to make the left hand now
  var left_hand_1 = new Cube();
  left_hand_1.color = [61/255, 85/255, 117/255, 1.0];
  left_hand_1.matrix = left_forearm_2_reference_matrix;
  left_hand_1.matrix.translate(0.00, 0.016, 0.12 * (left_forearm_scale / 100));
  // this is somehow also controlling the movement for left_hand_2
  // I suspect this is because we are reusing the left_forearm_2_reference_matrix
  // and it is getting passed by pointers and changing
  left_hand_1.matrix.rotate(hand_open_close_movement, 0, 1, 0);
  // adding user controlled hand rotation here
  // left_hand_1.matrix.rotate(hand_rotation, 0, 0, 1);
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
  left_hand_3.matrix.translate(0.01, -0.01, 0.12 * (left_forearm_scale / 100));
  left_hand_3.matrix.rotate(45, 0, 1, 0);
  left_hand_3.matrix.rotate(-hand_open_close_movement, 0, 1, 0);
  // left_hand_3.matrix.rotate(-hand_rotation, 1, 0, 0);
  left_hand_3.matrix.scale(0.01, 0.05, 0.11);
  left_hand_3.render()

  // going to make right arm, fore-arm and right hand
  var right_arm = new Cube();
  right_arm.color = [206/255, 189/255, 180/255, 1.0];
  right_arm.matrix.setTranslate(-0.46, -0.166, -0.2);
  right_arm.matrix.rotate(90, 0, 1, 0);
  right_arm.matrix.rotate(180, 1, 0, 0);
  right_arm.matrix.rotate(- arm_vertical_movement, 1, 0, 0);
  // adding shift animation
  right_arm.matrix.rotate(- shift_animation_hands_up, 1, 0, 0);
  var right_arm_reference_matrix = new Matrix4(right_arm.matrix);
  right_arm.matrix.scale(0.06, 0.05, 0.12);
  right_arm.render();

  // right forearm - part 1
  var right_forearm_1 = new Cube()
  right_forearm_1.color = [213/255, 162/255, 135/255, 1.0];
  right_forearm_1.matrix = right_arm_reference_matrix;
  right_forearm_1.matrix.translate(0.0, 0.0, 0.11);
  right_forearm_1.matrix.rotate(90, 0, 1, 0);
  right_forearm_1.matrix.rotate(-25, 0, 1, 0);
  // rotation based upon the left slider: adding this just for now
  right_forearm_1.matrix.rotate(left_forearm_rotation, 0, 1, 0);
  // shift animation here
  right_forearm_1.matrix.rotate(shift_forearm_rotation, 1, 0, 0);
  var right_forearm_1_reference_matrix = new Matrix4(right_forearm_1.matrix);
  right_forearm_1.matrix.scale(0.06, 0.05, 0.20);
  right_forearm_1.render();

  // right forearm - part 2
  var right_forearm_2 = new Cube();
  right_forearm_2.color = [83/255, 122/255, 143/255, 1.0];
  right_forearm_2.matrix = right_forearm_1_reference_matrix;
  right_forearm_2.matrix.translate(0.009, 0.009, 0.198);
  right_forearm_2.matrix.rotate(-hand_rotation, 0, 0, 1);
  var right_forearm_2_reference_matrix = new Matrix4(right_forearm_2.matrix);
  var right_forearm_2_reference_matrix_2 = new Matrix4(right_forearm_2.matrix);
  // using the left one just to check: this can later have its own parameter "right_forearm_scale"
  right_forearm_2.matrix.scale(0.03, 0.03, 0.12 * (left_forearm_scale / 100));
  right_forearm_2.render();

  // now going to make the right hand
  var right_hand_1 = new Cube();
  right_hand_1.color = [61/255, 85/255, 117/255, 1.0];
  right_hand_1.matrix = right_forearm_2_reference_matrix;
  // for now we are using the left forearm scale
  right_hand_1.matrix.translate(0.00, 0.016, 0.12 * (left_forearm_scale / 100));
  // this is somehow also controlling the movement for left_hand_2
  // I suspect this is because we are reusing the left_forearm_2_reference_matrix
  // and it is getting passed by pointers and changing
  right_hand_1.matrix.rotate(hand_open_close_movement, 0, 1, 0);
  right_hand_1.matrix.scale(0.01, 0.05, 0.11);
  right_hand_1.render();

  var right_hand_2 = new Cube();
  right_hand_2.color = [61/255, 85/255, 117/255, 1.0];
  right_hand_2.matrix = right_forearm_2_reference_matrix;
  right_hand_2.matrix.translate(0.0, -1.1, 0.0);
  right_hand_2.render();

  var right_hand_3 = new Cube();
  right_hand_3.color = [125/255, 143/255, 165/255, 1.0];
  right_hand_3.matrix = right_forearm_2_reference_matrix_2;
  // for now we are using the left_forearm_scale
  right_hand_3.matrix.translate(0.01, -0.01, 0.12 * (left_forearm_scale / 100));
  right_hand_3.matrix.rotate(45, 0, 1, 0);
  right_hand_3.matrix.rotate(-hand_open_close_movement, 0, 1, 0);
  right_hand_3.matrix.scale(0.01, 0.05, 0.11);
  right_hand_3.render()

  // making Wall-E's neck
  var neck_1 = new Cube();
  neck_1.color = [145/255, 103/255, 79/255, 1.0];
  neck_1.matrix.setTranslate(-0.27, -0.05, -0.2);
  neck_1.matrix.rotate(-25, 1, 0, 0);
  neck_1.matrix.rotate(neck_front_back, 1, 0, 0);
  // animation here
  neck_1.matrix.rotate(animation_neck_lower, 1, 0, 0);
  // adding shift animation here
  neck_1.matrix.rotate(shift_animation_neck, 1, 0, 0);
  var neck_1_reference_matrix = new Matrix4(neck_1.matrix);
  neck_1.matrix.scale(0.07, 0.128, 0.07);
  neck_1.render();

  var neck_2 = new Cube();
  neck_2.color = [171/255, 113/255, 74/255, 1.0];
  neck_2.matrix = neck_1_reference_matrix;
  neck_2.matrix.translate(0, 0.127, 0);
  neck_2.matrix.rotate(45, 1, 0, 0);
  neck_2.matrix.rotate(upper_neck_rotation, 1, 0, 0);
  // animation here
  neck_2.matrix.rotate(-animation_neck_upper, 1, 0, 0);
  var neck_2_reference_matrix = new Matrix4(neck_2.matrix);
  var neck_2_reference_matrix_2 = new Matrix4(neck_2.matrix);
  neck_2.matrix.scale(0.07, 0.128, 0.07);
  neck_2.render();

  var right_eye = new Cylinder();
  right_eye.color = [127/255, 131/255, 135/255, 1.0];
  right_eye.matrix = neck_2_reference_matrix;
  right_eye.matrix.translate(-0.025, 0.165, 0.0);
  right_eye.matrix.scale(0.1, 0.1, 0.16);
  var right_eye_reference_matrix = new Matrix4(right_eye.matrix);
  right_eye.render();

  var right_inner_eye = new Cylinder();
  right_inner_eye.color = [193/255, 194/255, 188/255, 1.0];
  right_inner_eye.matrix = right_eye_reference_matrix;
  right_inner_eye.matrix.translate(0.0, 0.0, -0.001);
  right_inner_eye.matrix.scale(0.8, 0.8, 0.001);
  var right_inner_eye_reference_matrix = new Matrix4(right_inner_eye.matrix);
  right_inner_eye.render();

  var right_eye_cornea = new Cylinder();
  right_eye_cornea.color = [9/255, 24/255, 49/255, 1.0];
  right_eye_cornea.matrix = right_inner_eye_reference_matrix;
  right_eye_cornea.matrix.translate(0.07, 0.07, -0.05);
  right_eye_cornea.matrix.scale(0.55, 0.55, 0.002);
  right_eye_cornea.render();

  var right_eyebrow = new Cube();
  right_eyebrow.color = [241/255, 180/255, 129/255, 1.0];
  right_eyebrow.matrix = right_eye_reference_matrix;
  right_eyebrow.matrix.translate(-0.7, 0.56 + animation_eyebrow, 0.5); // animation here
  right_eyebrow.matrix.rotate(15, 0, 0, 1);
  right_eyebrow.matrix.scale(1.2, 0.1, 0.1);
  right_eyebrow.render();

  var left_eye = new Cylinder();
  left_eye.color = [127/255, 131/255, 135/255, 1.0];
  left_eye.matrix = neck_2_reference_matrix_2;
  left_eye.matrix.translate(0.09, 0.165, 0.0);
  left_eye.matrix.scale(0.1, 0.1, 0.16);
  var left_eye_reference_matrix = new Matrix4(left_eye.matrix);
  left_eye.render();

  var left_inner_eye = new Cylinder();
  left_inner_eye.color = [193/255, 194/255, 188/255, 1.0];
  left_inner_eye.matrix = left_eye_reference_matrix;
  left_inner_eye.matrix.translate(0.0, 0.0, -0.001);
  left_inner_eye.matrix.scale(0.8, 0.8, 0.001);
  var left_inner_eye_reference_matrix = new Matrix4(left_inner_eye.matrix);
  left_inner_eye.render();

  var left_eye_cornea = new Cylinder();
  left_eye_cornea.color = [9/255, 24/255, 49/255, 1.0];
  left_eye_cornea.matrix = left_inner_eye_reference_matrix;
  left_eye_cornea.matrix.translate(-0.07, 0.07, -0.05);
  left_eye_cornea.matrix.scale(0.55, 0.55, 0.002);
  left_eye_cornea.render();

  var left_eyebrow = new Cube();
  left_eyebrow.color = [241/255, 180/255, 129/255, 1.0];
  left_eyebrow.matrix = left_eye_reference_matrix;
  left_eyebrow.matrix.translate(-0.60, 0.89 + animation_eyebrow, 0.5); // animation here
  left_eyebrow.matrix.rotate(-15, 0, 0, 1);
  left_eyebrow.matrix.scale(1.2, 0.1, 0.1);
  left_eyebrow.render();

  // calculating the performance in the very end;
  var duration = performance.now() - start_time;
  sendTextToHTML("fps = " + Math.floor(10000/duration), "fps");

}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  htmlElm.innerHTML = text;
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

  u_GlobalScaleMatrix = gl.getUniformLocation(gl.program, "u_GlobalScaleMatrix");
  if (!u_GlobalScaleMatrix) {
    console.log("Failed to get the storage location of u_GlobalScaleMatrix");
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
  gl.uniformMatrix4fv(u_GlobalScaleMatrix, false, identityM.elements);
}
function click(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var z = ev.clientZ;
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  // console.log(x, y);
}

// drag functionality
var mouse_down = 0;
var mouse_up = 0;
var drag = 0;
var initial_x = 0;
var initial_y = 0;

function main() {
  // Setting up WebGL
  setupWebGL();
  connectVariablesToGLSL();
  // Initialize shaders
  AddActionsToHtmlUI();
  canvas.onmousedown = function(ev) {
    mouse_down = 1;
    mouse_up = 0;
    initial_x = ev.clientX;
    initial_y = ev.clientY;
  };
  // canvas.onmouseup = function(ev) {
  canvas.onmousemove = function(ev){
  if (ev.buttons == 1) {
    mouse_up = 1;
    mouse_down = 0;
    final_x = ev.clientX;
    final_y = ev.clientY;

    if ((final_x != initial_x) && (final_y != initial_y)) {
      drag = 1;
    } else {
      drag = 0;
    }

    // if the user dragged on canvas, then we rotate
    if (drag == 1) {
      // rotate along the x axis
      if (final_x - initial_x > 0) {
        // then it means the user went from right to left
        mouse_rotate_x = - (final_x - initial_x);
      } else {
        mouse_rotate_x = initial_x - final_x;
      }

      // now we will rotate along the y axis
      if (final_y - initial_y > 0) {
        mouse_rotate_y = - (final_y - initial_y);
      } else {
        mouse_rotate_y = initial_y - final_y;
      }
    }
  }
  }
  // canvas.onmousemove = function(ev){if (ev.buttons == 1) {click(ev)}};
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the canvas
  // gl.clear(gl.COLOR_BUFFER_BIT);

  // renderScene();
  requestAnimationFrame(tick);
}

var start_time = performance.now() / 1000.0;
var seconds = performance.now() / 1000.0 - start_time;
var ticker = 0;
function tick() {
  seconds = performance.now() / 1000.0 - start_time;
  ticker += 1;
  // console.log(performance.now());

  setAnnimationAngles();

  renderScene();

  requestAnimationFrame(tick);
}

// TODO: shift these variables to the top
var animation_arm_movement = 0;
var animation_forearm_movement = 0;
var animation_fingers_movement = 0;
var animation_neck_lower = 0;
var animation_neck_upper = 0;
var animation_eyebrow = 0;
var annimation_zoom = 1;
var annimation_raise_hand = 0;
var annimation_open_hand = 0;

// variables for shift animation
var shift_animation_rotation = 0;
var shift_animation_hands_up = 0;
var shift_animation_neck = 0;
var shift_forearm_rotation = 0;
var shift_leg_rotation = 0;

function setAnnimationAngles() {
  // trying to say a hello in the animation
  if (hello_animation_state == 1) {
    // then wall-e should bend its eyes down
    if (ticker < 30) {
      animation_neck_lower -= 1; // move lower neck down
    }
    if ((30 < ticker) && (ticker < 60)) {
      animation_neck_upper += 1; // move lower neck up
    }
    if ((60 < ticker) && (ticker < 80)) {
      animation_neck_upper -= 2;
    }
    if ((80 < ticker) && (ticker < 160)) {
      annimation_zoom += 0.01
    }
    if ((160 < ticker) && (ticker < 190)) {
      // wait for 30 ticks
    }
    if ((190 < ticker) && (ticker < 210)) {
      // now move your eyebrows to represent that wall-e's happy
      animation_eyebrow -= 0.007;
    }
    if ((210 < ticker) && (ticker < 240)) {
      // wait for 30 ticks and do nothing in between
    }
    if ((240 < ticker) && (ticker < 260)) {
      // now move your eyebrows to represent that wall-e noticed the user
      animation_eyebrow += 0.007;
    }
    if ((260 < ticker) && (ticker < 280)) {
      // now move your eyebrows to represent that wall-e's happy
      animation_eyebrow -= 0.007;
    }
    if ((280 < ticker) && (ticker < 310)) {
      // wait for 30 ticks and do nothing in between
    }
    if ((310 < ticker) && (ticker < 330)) {
      // now move your eyebrows to represent that wall-e noticed the user
      animation_eyebrow += 0.007;
    }
    if ((330 < ticker) && (ticker < 430)) {
      if (annimation_zoom > 1.000) {
        annimation_zoom -= 0.01
      }
    }
    // finanly wave
    if ((430 < ticker) && (ticker < 460)) {
      annimation_open_hand += 2;
    }
    if ((460 < ticker) && (ticker < 490)) {
      annimation_raise_hand += 2;
    }
    // now we will do a hello for 20 ticks
    if ((490 < ticker) && (ticker < 510)) {
      annimation_raise_hand -= 1;
    }
    if ((510 < ticker) && (ticker < 530)) {
      annimation_raise_hand += 1;
    }
    if ((530 < ticker) && (ticker < 550)) {
      annimation_raise_hand -= 1;
    }
    if ((550 < ticker) && (ticker < 570)) {
      annimation_raise_hand += 1;
    }

    if ((570 < ticker) && (ticker < 600)) {
      annimation_raise_hand -= 2;
    }
    // hello done - now resume back to normal position
    if ((600 < ticker) && (ticker < 630)) {
      annimation_open_hand -= 2;
    }

    // return back to the original position of the neck
    if ((630 < ticker) && (ticker < 660)) {
      animation_neck_lower += 1;
    }

    if ((660 < ticker) && (ticker < 670)) {
      animation_neck_upper += 1;
    }

    if (ticker > 700) {
      // at this point 1 set of animation is complete, and we can loop over this again
      // reset
      ticker = 0;
      animation_neck_lower = 0;
      animation_neck_upper = 0;
      animation_eyebrow = 0;
      // annimation_zoom = 1;
    }
  } else {
    annimation_raise_hand = 0;
    annimation_open_hand = 0;
    animation_arm_movement = 0;
    animation_neck_lower = 0;
    animation_neck_upper = 0;
    animation_eyebrow = 0;
    annimation_zoom = 1;
  }
  if (special_shift_animation == true) {
    // in this animation, we can rotate WallE quickly and then let it do a quick thing
    // console.log(special_shift_animation)
    if ((0 < ticker) && (ticker < 60)) {
      shift_animation_rotation += 3;
      shift_animation_hands_up += 1;
      shift_animation_neck += 1;
      shift_forearm_rotation += 0.5;
      shift_leg_rotation += 0.0009;
    } else if ((60 < ticker) && (ticker < 120)) {
      shift_animation_rotation += 3;
      shift_animation_hands_up -= 1;
      shift_animation_neck -= 1;
      shift_forearm_rotation -= 0.5;
      shift_leg_rotation -= 0.0009;
    } else if (ticker > 120) { // end this animation
      special_shift_animation = false;
      shift_animation_neck = 0;
      shift_animation_hands_up = 0;
      shift_animation_rotation = 0;
      shift_forearm_rotation = 0;
      shift_leg_rotation = 0;
    }
  }
}
