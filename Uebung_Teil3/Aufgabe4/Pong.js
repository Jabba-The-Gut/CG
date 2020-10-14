//
// DI Computer Graphics
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
    uColorId: -1,
    uProjectionMatId: -1,
    uModelMatId: -1
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1
};

// coordinates of game elements
var game = {
    ball : {
        position: [-300, 0],
        size: [10,10]
    },
    paddle_left : {
        position: [-380, 0],
        size: [10,100],
        direction:1
    },
    paddle_right : {
        position: [380, 0],
        size: [10, 100],
        direction: 1
    },
    middle_lane : {
        position: [-2,300],
        size: [4, 1200]
    }
};


/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);
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
    setUpWorldCoordinates();

    gl.clearColor(0.1, 0.1, 0.1, 1);
}

/**
 * Set up the coordinates system for the canvas
 */
function setUpWorldCoordinates() {
    // Set up the world coordinates
    var projectionMat = mat3.create();
    mat3.fromScaling(projectionMat , [2.0/gl.drawingBufferWidth , 2.0/gl.
        drawingBufferHeight]);
    gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectionMat);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram,"uProjectionMat");
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    var vertices = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5];
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

/**
 * Draw shape using model matrix
 */
function drawShape(shape) {
    // draw rectangle using model matrix
    var modelMat = mat3.create();
    mat3.fromTranslation(modelMat, shape.position);
    mat3.scale(modelMat, modelMat, shape.size);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

/**
 * Calculate movements of the different shapes
 */
function calculateMovements() {
    // left paddle
    if (Math.abs(game.paddle_left.position[1]) > (300 - game.paddle_left.size[1]/2)) {
        game.paddle_left.position[1] < 0 ? game.paddle_left.direction = 1 : game.paddle_left.direction = -1;
    }
    game.paddle_left.position[1] += (game.paddle_left.direction * 5);

    // right paddle
    if (Math.abs(game.paddle_right.position[1]) > (300 - game.paddle_right.size[1]/2)) {
        game.paddle_right.position[1] < 0 ? game.paddle_right.direction = 1 : game.paddle_right.direction = -1;
    }
    game.paddle_right.position[1] += (game.paddle_right.direction * 5);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);

    // enable position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    // set the color of the shapes
    gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);

    // calculate movements
    calculateMovements()

    // draw shapes
    drawShape(game.middle_lane);
    drawShape(game.paddle_left);
    drawShape(game.paddle_right);
    drawShape(game.ball);

    // animation loop
    requestAnimationFrame(draw);
}

// Key Handling
var key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

function isDown (keyCode) {
    return key._pressed[keyCode];
}

function onKeydown(event) {
    key._pressed[event.keyCode] = true;
}

function onKeyup(event) {
    delete key._pressed[event.keyCode];
}
