attribute vec2 aVertexPosition;
attribute vec3 aVertexColor;

varying vec3 fragColor;

void main () {
    fragColor = aVertexColor;
    gl_Position = vec4(aVertexPosition, 0, 1);
}
