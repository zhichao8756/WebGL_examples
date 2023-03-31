#version 100
#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D u_Sampler;

varying vec4 v_Color;
varying vec2 v_TexCoord;
void main() {
         // gl_FragColor = vec4(0.5, 1.0, 1.0, 1.0);
         gl_FragColor = texture2D(u_Sampler, v_TexCoord);
}