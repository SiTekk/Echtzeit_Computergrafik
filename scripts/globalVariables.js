export const vertices =
    [
        -0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
        0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
        0.5, 0.5, 0.0, 1.0, 0.0, 0.0,
        -0.5, 0.5, 0.0, 1.0, 0.0, 0.0,

        -0.5, -0.5, -1.0, .0, 1.0, 0.0,
        0.5, -0.5, -1.0, 0.0, 1.0, 0.0,
        0.5, 0.5, -1.0, 0.0, 1.0, 0.0,
        -0.5, 0.5, -1.0, 0.0, 1.0, 0.0
    ];

export const indices =
    [
        0, 2, 1, 0, 3, 2,
        0, 7, 3, 0, 4, 7,
        1, 4, 0, 1, 5, 4,
        2, 5, 1, 2, 6, 5,
        3, 6, 2, 3, 7, 6,
        4, 6, 7, 4, 5, 6
    ];

export let ubo = {
    model: glMatrix.mat4.create(),
    view: glMatrix.mat4.create(),
    proj: glMatrix.mat4.create()
};

// Variable that holds the values for the camera
export let cameraValues = {
    angle: 0.0,
    axis: glMatrix.vec3.fromValues(0.0, 0.5, 1.5),
    eye: glMatrix.vec3.fromValues(0.0, 0.0, 0.0),
    center: glMatrix.vec3.fromValues(0.0, 0.0, 1.0),
    up: glMatrix.vec3.fromValues(0.0, 1.0, 0.0),
    fovy: 90.0,
    near: 0.1,
    far: 1000.0
};