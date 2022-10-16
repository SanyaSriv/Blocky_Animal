class Cube {
  constructor() {
    this.color = [1.0, 0.0, 0.0, 1.0];
    this.type = "cube";
    this.matrix = new Matrix4();
  }
  render() {
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      // Draw
    // front
    drawTriangles3D([0.0,0.0,0.0,  1.0,1.0,0.0,   1.0,0.0,0.0]);
    drawTriangles3D([0.0,0.0,0.0,  0.0,1.0,0.0,   1.0,1.0,0.0]);

    // top
    gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
    drawTriangles3D([0.0,1.0,0.0,  0.0,1.0,1.0,   1.0,1.0,1.0]);
    drawTriangles3D([0.0,1.0,0.0,  1.0,1.0,1.0,   1.0,1.0,0.0]);

    // left
    gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
    drawTriangles3D([0.0,0.0,0.0,  0.0,0.0,1.0,   0.0,1.0,1.0]);
    drawTriangles3D([0.0,0.0,0.0,  0.0,1.0,0.0,   0.0,1.0,1.0]);

    // right
    gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
    drawTriangles3D([0.0,0.0,1.0,  0.0,1.0,1.0,   1.0,1.0,1.0]);
    // gl.uniform4f(u_FragColor, rgba[0] * 0.3, rgba[1] * 0.3, rgba[2] * 0.3, rgba[3]);
    drawTriangles3D([1.0,0.0,1.0,  0.0,0.0,1.0,   1.0,1.0,1.0]);

    // bottom
    gl.uniform4f(u_FragColor, 0, 1, 0, rgba[3]);
    drawTriangles3D([1.0,0.0,0.0,  1.0,1.0,1.0,   1.0,1.0,0.0]);
    // gl.uniform4f(u_FragColor, rgba[0] * 0.3, rgba[1] * 0.3, rgba[2] * 0.3, rgba[3]);
    drawTriangles3D([1.0,0.0,0.0,  1.0,0.0,1.0,   1.0,1.0,1.0]);
    //
    // botton
    gl.uniform4f(u_FragColor, 1, 1, 0, rgba[3]);
    drawTriangles3D([0.0,0.0,0.0,  1.0,0.0,0.0,   1.0,0.0,1.0]);
    // gl.uniform4f(u_FragColor, rgba[0] * 0.3, rgba[1] * 0.3, rgba[2] * 0.3, rgba[3]);
    drawTriangles3D([0.0,0.0,0.0,  0.0,0.0,1.0,   1.0,0.0,1.0]);
  }

  // }
}
