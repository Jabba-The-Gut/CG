//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    aVertexColorId: -1,
    aVertexNormalId: -1,
    uModelViewMatrixId: -1,
    uProjectionMatrixId: -1,
    uNormalMatrixId: -1,
    uLightPositionId: -1,
    uLightColorId: -1,
    uEnableLightingId: -1
};

// objects that will be drawn
var objectsToDraw = {
    cube: null,
    sphere: null
}

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("canvas");
    gl = createGLContext(canvas);
    initGL();
    draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShaderLightingExercise.glsl');
    setUpAttributesAndUniforms();

    // define objects to be drawn
    objectsToDraw.cube = new SolidCube(gl,
        [1.0, 0.0, 1.0],
        [1.0, 0.0, 1.0],
        [0.0, 0.0, 1.0],
        [1.0, 1.0, 0.0],
        [0.0, 1.0, 1.0],
        [0.0, 1.0, 0.0]);
    objectsToDraw.sphere = new SolidSphere(gl, 50, 50);

    // enable z buffer
    gl.enable(gl.DEPTH_TEST);

    // set the clear color here
    gl.clearColor(0.2, 0.2, 0.2, 1.0);

}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aVertexNormalId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal");
    ctx.uModelViewMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMatrix");
    ctx.uProjectionMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
    ctx.uNormalMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uNormalMatrix");
    ctx.uLightPositionId = gl.getUniformLocation(ctx.shaderProgram, "uLightPosition");
    ctx.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, "uLightColor");
    ctx.uEnableLightingId = gl.getUniformLocation(ctx.shaderProgram, "uEnableLighting");
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

    // create matrices
    var modelViewMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var projectionMatrix = mat4.create();
    var normalMatrix = mat3.create();

    // set matrix for eye, center and up positions
    mat4.lookAt(viewMatrix, [0, 3, -4], [0, 0, 0], [0, 1, 0]);

    // set matrix for perspective
    mat4.perspective(projectionMatrix, glMatrix.toRadian(40), gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 30.0);

    // setup light
    gl.uniform1i(ctx.uEnableLightingId, 1) // enable lightning
    gl.uniform3fv(ctx.uLightPositionId, [4, 4, -7]) // light position
    gl.uniform3fv(ctx.uLightColorId, [1, 1, 1]) // color of light (white)

    gl.uniformMatrix4fv(ctx.uProjectionMatrixId, false, projectionMatrix);

    // do the translation and rotation for the cube
    mat4.translate(modelViewMatrix, viewMatrix, [1.0, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, 0, [0, 1, 0]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);

    // draw solid cube
    objectsToDraw.cube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexNormalId)

    // do the translation and rotation for the sphere
    mat4.translate(modelViewMatrix, viewMatrix, [0.0, 0.0, -1.0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, 0, [0, 1, 0]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [0.5, 0.5, 0.5]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);

    // draw sphere
    objectsToDraw.sphere.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexNormalId);
}