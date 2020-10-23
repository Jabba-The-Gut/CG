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
    shaderProgram: -1, //wird unten wieder überschrieben
    aVertexPositionId: -1,
    aVertexColorId: -1,
    uProjMatId: -1,
    uViewMatId: -1,
    uWorldMatId: -1,
};

// we keep all the parameters for drawing a specific object together
var cubes = {
    wireFrameCube: -1,
};

var canvas;

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    setUpAttributesAndUniforms();
    setUpBuffers();

    gl.clearColor(0.8, 0.8, 0.8, 1.0);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    // finds the index of the variable in the program || überschreibt ctx.aVertexPositionId
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");

    ctx.uProjMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjMat");
    ctx.uViewMatId = gl.getUniformLocation(ctx.shaderProgram, "uViewMat");
    ctx.uWorldMatId = gl.getUniformLocation(ctx.shaderProgram, "uWorldMat");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";

    cubes.wireFrameCube = WireFrameCube(gl, [1.0, 1.0, 1.0, 0.5]);

    // set paramter of kamera
    var viewMat = mat4.create();
    mat4.lookAt(
        viewMat,
        [0, -5, 0], // define position of viewer
        [0, 0, 0], // define point where viewer is looking
        [0, 0, 1], // vector that is pointing up
    );

    // projection matrix with given bounds (project 3d cube to 2d area)
    var projMat = mat4.create();
    mat4.perspective(
        projMat,
        glMatrix.toRadian(45), // fovy
        canvas.clientWidth / canvas.clientHeight,  // aspect
        0.1, // near
        1000, // far
    );

    // set matrices for vertex shader
    gl.uniformMatrix4fv(ctx.uViewMatId, false, viewMat);
    gl.uniformMatrix4fv(ctx.uProjMatId, false, projMat);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");

    var worldMat = new Float32Array(16);
    var matrix = new Float32Array(16);
    var xRotation = new Float32Array(16);
    var yRotation = new Float32Array(16);
    var zRotation = new Float32Array(16);

    // transform matrices to identity matrices
    mat4.identity(worldMat);
    mat4.identity(matrix);

    // this controls how much the cube is rotated (in given axis)
    var xAngle = 0;
    var yAngle = 0;
    var zAngle = 0;

    // rotate around specified axis
    mat4.rotate(xRotation, matrix, xAngle, [1, 0, 0]);
    mat4.rotate(yRotation, matrix, yAngle, [0, 1, 0]);
    mat4.rotate(zRotation, matrix, zAngle, [0, 0, 1]);

    // multiply the world mat with the rotation matrices
    mat4.mul(worldMat, xRotation, worldMat);
    mat4.mul(worldMat, yRotation, worldMat);
    mat4.mul(worldMat, zRotation, worldMat);

    gl.uniformMatrix4fv(ctx.uWorldMatId, false, worldMat);

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    cubes.wireFrameCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId);

    console.log("done");
}
