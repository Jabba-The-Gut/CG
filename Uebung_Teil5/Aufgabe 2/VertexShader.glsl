precision mediump float;

attribute vec3 vertexPosition;
attribute vec2 verTextCoordinates;
varying vec2 fragTextCoordinates;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;

void main () {
    fragTextCoordinates = verTextCoordinates;
    gl_Position = projMatrix * viewMatrix * worldMatrix * vec4(vertexPosition, 1.0);
}