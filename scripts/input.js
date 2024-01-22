import { global } from "./globalVariables.js";

function toRadians(degree) {
    return degree * Math.PI / 180;
}

let temp = glMatrix.vec3.create();

function keyboardInput(event, cameraValues) {

    const scale = 0.01 * global.deltaTime;

    //console.log("deltaTime:", getDeltaTime());

    if (event.keyCode == 87) { // W
        glMatrix.vec3.copy(temp, cameraValues.center);
        glMatrix.vec3.scale(temp, temp, scale);
        glMatrix.vec3.add(cameraValues.eye, cameraValues.eye, temp);
    }
    if (event.keyCode == 65) { // A
        glMatrix.vec3.cross(temp, cameraValues.center, cameraValues.up);
        glMatrix.vec3.normalize(temp, temp);
        glMatrix.vec3.scale(temp, temp, scale);
        glMatrix.vec3.subtract(cameraValues.eye, cameraValues.eye, temp);
    }
    if (event.keyCode == 83) { // S
        glMatrix.vec3.copy(temp, cameraValues.center);
        glMatrix.vec3.scale(temp, temp, scale);
        glMatrix.vec3.subtract(cameraValues.eye, cameraValues.eye, temp);
    }
    if (event.keyCode == 68) { // D
        glMatrix.vec3.cross(temp, cameraValues.center, cameraValues.up);
        glMatrix.vec3.normalize(temp, temp);
        glMatrix.vec3.scale(temp, temp, scale);
        glMatrix.vec3.add(cameraValues.eye, cameraValues.eye, temp);
    }
    if (event.keyCode == 32) { // Space
        glMatrix.vec3.cross(temp, cameraValues.center, cameraValues.up);
        glMatrix.vec3.cross(temp, cameraValues.center, temp);
        glMatrix.vec3.normalize(temp, temp);
        glMatrix.vec3.scale(temp, temp, scale);
        glMatrix.vec3.subtract(cameraValues.eye, cameraValues.eye, temp);
    }
    if (event.keyCode == 17) { // Left Control
        glMatrix.vec3.cross(temp, cameraValues.center, cameraValues.up);
        glMatrix.vec3.cross(temp, cameraValues.center, temp);
        glMatrix.vec3.normalize(temp, temp);
        glMatrix.vec3.scale(temp, temp, scale);
        glMatrix.vec3.add(cameraValues.eye, cameraValues.eye, temp);
    }
    if (event.keyCode == 96) {
        global.textureLevel = 0;
    }
    if (event.keyCode == 97) {
        global.textureLevel = 1;
    }
    if (event.keyCode == 98) {
        global.textureLevel = 2;
    }
    if (event.keyCode == 99) {
        global.textureLevel = 3;
    }
    if (event.keyCode == 100) {
        global.textureLevel = 4;
    }
}

let yaw = 0.0;
let pitch = 0.0;
const sensitivity = 0.1;

function mouseInput(event, cameraValues) {

    let delta_x = event.movementX * sensitivity;
    let delta_y = event.movementY * sensitivity;

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

    glMatrix.vec3.copy(cameraValues.center, direction);
    //console.log("mouse location:", cameraValues.center);
}

export { keyboardInput, mouseInput, toRadians };