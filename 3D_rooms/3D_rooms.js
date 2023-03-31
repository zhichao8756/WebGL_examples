// 3D_rooms.js (c) 2023 zack
import { readShaderFile } from '../lib/utils.js';

let VSHADER_SOURCE = null;
let FSHADER_SOURCE = null;

export async function main() {
  const canvas = document.getElementById('webgl');
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  VSHADER_SOURCE = await readShaderFile('3D_rooms.vert');
  FSHADER_SOURCE = await readShaderFile('3D_rooms.frag');
  if (VSHADER_SOURCE && FSHADER_SOURCE) start(gl, canvas);
}

function start(gl, canvas) {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  const n = initVertexBuffers(gl);
  // 初始化纹理
  initTextures(gl);
  const mvpMatrix = new Matrix4();
  console.log(canvas.width)
  mvpMatrix.setPerspective(30, canvas.width/canvas.height, 10, 100);

  mvpMatrix.lookAt(3, 3, 10, 0, 0, 0, 0, 1, 0);
  const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  gl.uniformMatrix4fv(u_MvpMatrix, false,  mvpMatrix.elements);
  gl.clearColor(0.0,0.0,0.0,1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}
function initVertexBuffers(gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  const vertices = new Float32Array([   // Vertex coordinates
    1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
    1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
  ]);

  // Indices of the vertices
  const indices = new Uint8Array([
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);
  // texture coord
/*  const textureCoord = new Float32Array([
    0.125, 1.0,   0.0, 1.0,   0.0, 0.0,   0.125, 0.0,    // v0-v1-v2-v3 front
    0.125, 1.0,   0.125, 0.0,   0.25, 0.0,   0.25, 0.25,    // v0-v3-v4-v5 right
    0.375, 0.0,   0.375, 0.375,   0.25, 1.0,   0.25, 0.0,    // v0-v5-v6-v1 up
    0.625, 0.625,   0.5, 1.0,   0.5, 0.0,   0.625, 0.0,    // v1-v6-v7-v2 left
    0.375, 1.0,   0.5, 1.0,   0.5, 0.0,   0.375, 0.0,    // v7-v4-v3-v2 down
    0.625, 0.0,   0,75, 0.0,   0.75, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
  ]);*/
  var texCoords = new Float32Array([   // Texture coordinates
    1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
    0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
    1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
    1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
    0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
    0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
  ]);

  const indexBuffer = gl.createBuffer();
  // Write vertex information to buffer object
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) return -1; // Vertex coordinates
  if (!initArrayBuffer(gl, texCoords, 2, gl.FLOAT, 'a_TexCoord')) return -1;// Texture coordinates
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  return indices.length;
}
function initArrayBuffer(gl, data, num, type, attribute) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment to a_attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}
/*function initArrayBuffer(gl, vertices, num, attribute) {
  console.log(vertices)
  const verticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  // Assign the buffer object to a_Position variable
  const a_attribute = gl.getAttribLocation(gl.program, attribute);
  console.log(a_attribute)
  gl.vertexAttribPointer(a_attribute, num, gl.FLOAT, false, 0 ,0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_attribute);

}*/
function initTextures(gl) {
  const texture = gl.createTexture();
  const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_Sampler) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }
  const image = new Image();
  image.src = 'sky.jpg';
  image.onload = () => {
    loadTexture(gl, texture, u_Sampler, image);
  }
}
function loadTexture(gl, tex, sampler, image) {
  console.log(image)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image );
  console.log(sampler)

  gl.uniform1i(sampler, 0);
}