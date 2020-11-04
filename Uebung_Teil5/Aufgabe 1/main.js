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
    canvas: null,
    shaderProgram: -1,
    vPositionAttributeLocation: -1,
    vColorAttributeLocation: -1,
    wMatrixUniformLocation: -1,
    viewMatrixUniformLocation: -1,
    projMatrixUniformLocation: -1,
};


/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    ctx.canvas = document.getElementById("myCanvas");
    gl = createGLContext(ctx.canvas);
    initGL();
    draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";

    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');

    // make background of canvas grey
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    setUpBuffers();
    setUpAttributesAndUniforms();
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms() {
    "use strict";

    // get vertex shader attribute for vertex position
    ctx.vPositionAttributeLocation = gl.getAttribLocation(ctx.shaderProgram, "vertexPosition");
    gl.vertexAttribPointer(ctx.vPositionAttributeLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(ctx.vPositionAttributeLocation);

    // get vertex shader attribute for vertex color
    ctx.vColorAttributeLocation = gl.getAttribLocation(ctx.shaderProgram, "vertexColor");
    gl.vertexAttribPointer(ctx.vColorAttributeLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT)
    gl.enableVertexAttribArray(ctx.vColorAttributeLocation);

    // get uniform attributes for matrices
    ctx.wMatrixUniformLocation = gl.getUniformLocation(ctx.shaderProgram, "worldMatrix");
    ctx.viewMatrixUniformLocation = gl.getUniformLocation(ctx.shaderProgram, "viewMatrix");
    ctx.projMatrixUniformLocation = gl.getUniformLocation(ctx.shaderProgram, "projMatrix");
}

/**
 * Setup the buffers to use.
 */
function setUpBuffers(){
    "use strict";

    // bind and fill buffer for vertices
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getCubeVertices()), gl.STATIC_DRAW);

    // bind and fill buffer for indices
    var indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(getCubeIndices()), gl.STATIC_DRAW);

}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");

    // matrices
    var worldMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var projMatrix = mat4.create();
    var matrix = mat4.create();

    // rotation matrices
    var xRotation = mat4.create();
    var zRotation = mat4.create();

    // make the world matrix an identity matrix (means no operation is done)
    mat4.identity(worldMatrix);
    // define the point of the viewer/camera using a matrix
    mat4.lookAt(viewMatrix, [2, -4, 3], [0, 0 ,0], [0, 0, 1])
    // define the projection matrix used to project the 3d shape to the 2D canvas
    mat4.perspective(projMatrix, glMatrix.toRadian(45), ctx.canvas.clientWidth / ctx.canvas.clientHeight, 0.1, 1000.0);

    gl.uniformMatrix4fv(ctx.wMatrixUniformLocation, false, worldMatrix);
    gl.uniformMatrix4fv(ctx.viewMatrixUniformLocation, false, viewMatrix);
    gl.uniformMatrix4fv(ctx.projMatrixUniformLocation, false, projMatrix);

    mat4.identity(matrix)

    // this controls how much the cube is rotated (in given axis)
    var xAngle = 0;
    var zAngle = 0;

    var rotate = function() {
        xAngle = performance.now() / 1000 / Math.PI;
        zAngle = performance.now() / 1000 / Math.PI;

        // rotate
        mat4.rotate(xRotation, matrix, xAngle, [1, 0, 0]);
        mat4.rotate(zRotation, matrix, zAngle, [0, 0, 1]);

        mat4.mul(worldMatrix, xRotation, zRotation);

        gl.clearColor(0.8, 0.8, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.uniformMatrix4fv(ctx.wMatrixUniformLocation, false, worldMatrix);
        gl.drawElements(gl.TRIANGLES, getCubeIndices().length, gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(rotate);
    }
    requestAnimationFrame(rotate);
}
