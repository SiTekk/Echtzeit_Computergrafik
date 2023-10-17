function toRadians(degree) {
    return degree * Math.PI / 180;
}

function keyboardInput(event, cameraValues) {
    if (event.keyCode == 87) { // W
        glMatrix.vec3.add(cameraValues.axis, cameraValues.axis, [0.0, +0.1, 0]);
    }
    else if (event.keyCode == 65) { // A
        glMatrix.vec3.add(cameraValues.axis, cameraValues.axis, [-0.1, 0, 0]);
    }
    else if (event.keyCode == 83) { // S
        glMatrix.vec3.add(cameraValues.axis, cameraValues.axis, [0.0, -0.1, 0]);
    }
    else if (event.keyCode == 68) { // D
        glMatrix.vec3.add(cameraValues.axis, cameraValues.axis, [+0.1, 0, 0]);
    }
}

let oldX = 0.0;
let oldY = 0.0;
let yaw = 0.0;
let pitch = 0.0;
const sensitivity = 0.1;

function mouseInput(event, cameraValues) {
    //console.log("mouse location:", event.clientX, event.clientY)

    let delta_x = (oldX - event.clientX) * sensitivity;
    let delta_y = (oldY - event.clientY) * sensitivity;

    oldX = event.clientX;
    oldY = event.clientY;

    yaw += delta_x;
    pitch += delta_y;

    if (pitch > 89.0) {
        pitch = 89.0;
    }
    else if (pitch < -89.0) {
        pitch = -89.0;
    }

    let direction = glMatrix.vec3.create();
    glMatrix.vec3.set(direction, Math.cos(toRadians(yaw)) * Math.cos(toRadians(pitch)), -1.0 * Math.sin(toRadians(pitch)), Math.sin(toRadians(yaw)) * Math.cos(toRadians(pitch)))
    glMatrix.vec3.normalize(direction, direction);

    cameraValues.center = direction;
    console.log("mouse location:", cameraValues.center);
}

export { keyboardInput, mouseInput, toRadians };