export const g_vertices =
    [
        0.0, 0.0, 0.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 0.0, 1.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 1.0, 0.0, 0.0,

        0.0, 0.0, -1.0, 0.0, 1.0, 0.0,
        1.0, 0.0, -1.0, 0.0, 1.0, 0.0,
        1.0, 1.0, -1.0, 0.0, 1.0, 0.0,
        0.0, 1.0, -1.0, 0.0, 1.0, 0.0
    ];

export const g_indices =
    [
        0, 2, 1, 0, 3, 2,
        0, 7, 3, 0, 4, 7,
        1, 4, 0, 1, 5, 4,
        2, 5, 1, 2, 6, 5,
        3, 6, 2, 3, 7, 6,
        4, 6, 7, 4, 5, 6
    ];

export const cubePositions =
    [
        [0.0, 0.0, 0.0],
        [2.0, 5.0, 15.0],
        [-1.5, -2.2, 2.5],
        [-3.8, -2.0, 12.3],
        [2.4, -0.4, 3.5],
        [-1.7, 3.0, 7.5],
        [1.3, -2.0, 2.5],
        [1.5, 2.0, 2.5],
        [1.5, 0.2, 1.5],
        [-1.3, 1.0, 1.5]
    ]

export let g_ubo = {
    model: glMatrix.mat4.create(),
    view: glMatrix.mat4.create(),
    proj: glMatrix.mat4.create()
};

// Variable that holds the values for the camera
export let g_cameraValues = {
    angle: 0.0,
    axis: glMatrix.vec3.fromValues(0.0, 0.0, 0.0),
    eye: glMatrix.vec3.fromValues(0.0, 0.0, 2.0),
    center: glMatrix.vec3.fromValues(0.0, 0.0, -1.0),
    up: glMatrix.vec3.fromValues(0.0, 1.0, 0.0),
    fovy: 60.0,
    near: 0.1,
    far: 1000.0
};

let deltaTime = 'initial value';

export const getDeltaTime = () => deltaTime;
export const setDeltaTime = (val) => (deltaTime = val);
