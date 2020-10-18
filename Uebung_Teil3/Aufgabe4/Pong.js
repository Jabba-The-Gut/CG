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
        position: [0, 0],
        size: [20,20],
        direction_y: 1,
        direction_x: -1
    },
    paddle_left : {
        position: [-380, 0],
        size: [30, 150],
        direction:1
    },
    paddle_right : {
        position: [380, 0],
        size: [30, 150],
        direction: 1
    },
    middle_lane : {
        position: [-2, 0],
        size: [4, 600]
    },
    score_player_left: 0,
    score_player_right: 0,
    limit: 5
};

// Key Handling
var key = {
    A: 97,
    D: 100,
    SPACE: 32,
};


/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();

    // init score
    document.getElementById("score_l").innerHTML = "Score Player Left: " + game.score_player_left;
    document.getElementById("score_r").innerHTML = "Score Player Right: " + game.score_player_right;

    initBallPosition();
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
 * Randomly place ball on right side of pitch
 */
function initBallPosition(){
    game.ball.direction_x = -1;
    game.ball.position[0] = Math.random() * (250 - 10) + 10
    game.ball.position[1] = Math.random() * (250 + 250) - 250
}

/**
 * Calculate movements of the different shapes
 */
function calculateMovements() {
    // display score
    document.getElementById("score_l").innerHTML = "Player Left: " + game.score_player_left;
    document.getElementById("score_r").innerHTML = "| Player Right: " + game.score_player_right;

    // left paddle
    if (Math.abs(game.paddle_left.position[1]) > (300 - game.paddle_left.size[1]/2)) {
        game.paddle_left.direction *= -1;
    }

    // right paddle
    if (Math.abs(game.paddle_right.position[1]) > (300 - game.paddle_right.size[1]/2)) {
        game.paddle_right.direction *= -1;
    }

    // ball collision top and bottom
    if ((Math.abs(game.ball.position[1]) > (300 - game.ball.size[1]/2)) && (Math.abs(game.ball.position[1]) < (300))) {
        game.ball.direction_y *= -1;
    }

    // collision with paddles
    if((Math.abs(game.ball.position[0]) > 350) && (Math.abs(game.ball.position[0]) < 360)) {
        if(game.ball.direction_x < 0) {
            // we collided left
            if ((game.ball.position[1] < (game.paddle_left.position[1] + (game.paddle_left.size[1]/2) - (game.ball.size[1]/2)))
                && (game.ball.position[1] >
                    (game.paddle_left.position[1] - (game.paddle_left.size[1]/2) + (game.ball.size[1]/2)))) {
                game.ball.direction_x *= -1;
            }
        } else {
            // we collided right
            if ((game.ball.position[1] < (game.paddle_right.position[1] + (game.paddle_right.size[1]/2)) - (game.ball.size[1]/2))
                && (game.ball.position[1] >
                    (game.paddle_right.position[1] - (game.paddle_right.size[1]/2) + (game.ball.size[1]/2 )))) {
                game.ball.direction_x *= -1;
            }
        }
    }

    // ball movement
    game.ball.position[1] += (game.ball.direction_y * 7);
    game.ball.position[0] += (game.ball.direction_x * 7);

    // paddle movement
    game.paddle_right.position[1] += (game.paddle_right.direction * 10);
    game.paddle_left.position[1] += (game.paddle_left.direction * 10);

    // check if ball is out of range, update score
    if(game.ball.position[0] > 420) {
        game.score_player_left += 1;
        document.getElementById("score_l").innerHTML = "Player Left: " + game.score_player_left;
        initBallPosition();
    } else if (game.ball.position[0] < -420) {
        game.score_player_right += 1;
        document.getElementById("score_r").innerHTML = "| Player Right: " + game.score_player_right;
        initBallPosition();
    }
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT);

    // enable position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    // set the color of the shapes
    gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);

    // draw shapes
    drawShape(game.middle_lane);
    drawShape(game.paddle_left);
    drawShape(game.paddle_right);
    drawShape(game.ball);

    // calculate movements
    calculateMovements()

    // check score
    if(game.score_player_right == game.limit) {
        alert("Player Right has won!")
        game.score_player_left = 0;
        game.score_player_right = 0;
    } else if (game.score_player_left == game.limit) {
        alert("Player Left has won!")
        game.score_player_left = 0;
        game.score_player_right = 0;
    }

    // animation loop
    requestAnimationFrame(draw);
}

/**
 * Event listener for key presses
 */
document.addEventListener('keypress', (event) => {
    if(event.keyCode == key.A) {
        if (game.paddle_left.direction < 0) {
            game.paddle_left.direction *= -1;
        }
    } else if (event.keyCode == key.D) {
        if(game.paddle_left.direction > 0) {
            game.paddle_left.direction *= -1;
        }
    } else if(event.keyCode == key.SPACE) {
        alert("You paused the game. Press 'OK' to continue")
    }

}, false);