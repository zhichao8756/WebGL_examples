#version 100
// Vertex shader program

attribute vec4 a_Position;
// texture
attribute vec2 a_TexCoord;

uniform mat4 u_MvpMatrix;
varying vec2 v_TexCoord;
void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_TexCoord = a_TexCoord;
    // v_Color = vec4(0.5, 1.0, 1.0, 1.0);

}