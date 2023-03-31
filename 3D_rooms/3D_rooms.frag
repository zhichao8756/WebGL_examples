#version 100
#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D u_Sampler0;

varying vec4 v_Color;
varying vec2 v_TexCoord;
void main() {
       // gl_FragColor = v_Color;
       gl_FragColor = texture2D(u_Sampler0, v_TexCoord);
}