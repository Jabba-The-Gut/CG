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
    uColorId: -1
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    posBuffer: -1,
    colBuffer: -1
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
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
    setUpAttributesAndUniforms();
    setUpBuffers();

    // set the clear color here
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    
    // add more necessary commands here
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");

}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";

    rectangleObject.posBuffer = gl.createBuffer();
    var posBuffer = [
        -0.5,0.5,
        0.5,0.5,
        0.5,-0.5,
        -0.5,-0.5,
    ]

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(posBuffer), gl.STATIC_DRAW);

    rectangleObject.colBuffer = gl.createBuffer();
    var colorBuffer = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.5, 0.5, 1.0,
    ]

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.colBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorBuffer), gl.STATIC_DRAW);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);
    // add drawing routines here

    // vertex positions
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.posBuffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);
    console.log(ctx.aVertexPositionId);

    // color
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.colBuffer);
    gl.vertexAttribPointer(ctx.uColorId, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.uColorId);


    gl.drawArrays(gl.TRIANGLE_FAN,0,4);
}