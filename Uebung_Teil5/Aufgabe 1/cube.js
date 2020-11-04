/**
 * Return vertices for cube
 * @returns {number[]} array of vertices
 */
function getCubeVertices() {
    // each side of the cube has 4 vertices, the cube has 6 sides, so 24 vertices
    var cubeVertices = [
        // X, Y, Z           R, G, B
        // Top
        -1.0, 1.0, -1.0,   1.0, 0, 0,
        -1.0, 1.0, 1.0,    1.0, 0, 0,
        1.0, 1.0, 1.0,     1.0, 0, 0,
        1.0, 1.0, -1.0,    1.0, 0, 0,

        // Left
        -1.0, 1.0, 1.0,    0, 1.0, 0,
        -1.0, -1.0, 1.0,   0, 1.0, 0,
        -1.0, -1.0, -1.0,  0, 1.0, 0,
        -1.0, 1.0, -1.0,   0, 1.0, 0,

        // Right
        1.0, 1.0, 1.0,    0, 0, 1.0,
        1.0, -1.0, 1.0,   0, 0, 1.0,
        1.0, -1.0, -1.0,  0, 0, 1.0,
        1.0, 1.0, -1.0,   0, 0, 1.0,

        // Front
        1.0, 1.0, 1.0,    1.0, 1.0, 0,
        1.0, -1.0, 1.0,   1.0, 1.0, 0,
        -1.0, -1.0, 1.0,  1.0, 1.0, 0,
        -1.0, 1.0, 1.0,   1.0, 1.0, 0,

        // Back
        1.0, 1.0, -1.0,    0, 1.0, 1.0,
        1.0, -1.0, -1.0,   0, 1.0, 1.0,
        -1.0, -1.0, -1.0,  0, 1.0, 1.0,
        -1.0, 1.0, -1.0,   0, 1.0, 1.0,

        // Bottom
        -1.0, -1.0, -1.0,   1.0, 0, 1.0,
        -1.0, -1.0, 1.0,    1.0, 0, 1.0,
        1.0, -1.0, 1.0,     1.0, 0, 1.0,
        1.0, -1.0, -1.0,    1.0, 0, 1.0,
    ];

    return cubeVertices;
}

/**
 * Return indices for cube
 * @returns {number[]} array of indices
 */
function getCubeIndices() {
    // webGL can only draw triangles, so we need to tell it which vertices make a triangle
    // One side of the cube consists of 2 triangles
    var indices = [
            // Top
            0, 1, 2,
            0, 2, 3,

            // Left
            5, 4, 6,
            6, 4, 7,

            // Right
            8, 9, 10,
            8, 10, 11,

            // Front
            13, 12, 14,
            15, 14, 12,

            // Back
            16, 17, 18,
            16, 18, 19,

            // Bottom
            21, 20, 22,
            22, 20, 23
        ];

    return indices;
}