precision mediump float;

attribute vec3 vertexPosition;
attribute vec3 vertexColor;
varying vec3 fragmentColor;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;

void main () {
    fragmentColor = vertexColor;
    gl_Position = projMatrix * viewMatrix * worldMatrix * vec4(vertexPosition, 1.0);
}