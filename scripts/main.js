import { createShaderProgram } from "./shaders.js";
import { keyboardInput, mouseInput, toRadians } from "./input.js";
import * as global from "./globalVariables.js";

main();

function main() {
    const [gl, programData] = initialize();

    initializeEventListener();

    if (programData === null) {
        return;
    }

    let start = 0;
    let elapsed = 0;
    let temp = glMatrix.vec3.create();

    function mainLoop(timeStamp) {
        const deltaTime = timeStamp - start;
        start = timeStamp;
        elapsed += deltaTime;

        // Set clear color to black, fully opaque
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        // Clear the color buffer with specified clear color
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(programData.shaderProgram);
        gl.bindVertexArray(programData.vertexArray);

        glMatrix.mat4.identity(global.ubo.model);
        glMatrix.mat4.translate(global.ubo.model, global.ubo.model, global.cameraValues.axis);

        glMatrix.vec3.add(temp, global.cameraValues.center, global.cameraValues.eye);
        glMatrix.mat4.lookAt(global.ubo.view, global.cameraValues.eye, temp, global.cameraValues.up);
        glMatrix.mat4.perspective(global.ubo.proj, toRadians(global.cameraValues.fovy), programData.width / programData.height, global.cameraValues.near, global.cameraValues.far);

        let modelLocation = gl.getUniformLocation(programData.shaderProgram, "model");
        let viewLocation = gl.getUniformLocation(programData.shaderProgram, "view");
        let projLocation = gl.getUniformLocation(programData.shaderProgram, "proj");
        gl.uniformMatrix4fv(modelLocation, gl.FALSE, global.ubo.model);
        gl.uniformMatrix4fv(viewLocation, gl.FALSE, global.ubo.view);
        gl.uniformMatrix4fv(projLocation, gl.FALSE, global.ubo.proj);

        gl.drawElements(gl.TRIANGLES, global.indices.length, gl.UNSIGNED_INT, 0);

        requestAnimationFrame(mainLoop);
    }

    requestAnimationFrame(mainLoop);
}

function initialize() {
    const canvas = document.querySelector("#glcanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl2");

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
        );
        return null;
    }

    // Object that holds important handles
    const programData = {
        width: document.querySelector("#glcanvas").width,
        height: document.querySelector("#glcanvas").height,
        shaderProgram: createShaderProgram(gl),
        vertexArray: gl.createVertexArray(),
        vertexBuffer: gl.createBuffer(),
        indexBuffer: gl.createBuffer()
    };

    console.log(`Width: ${programData.width}`)
    console.log(`Height: ${programData.height}`)
    console.log(`Aspect: ${programData.width / programData.height}`)

    // bind the Vertex Array Object first, then bind and set vertex buffer(s), and then configure vertex attributes(s).
    gl.bindVertexArray(programData.vertexArray);

    gl.bindBuffer(gl.ARRAY_BUFFER, programData.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(global.vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, programData.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(global.indices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0); // Position
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12); // Color
    gl.enableVertexAttribArray(1);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    return [gl, programData];
}

function initializeEventListener() {
    const canvas = document.querySelector("#glcanvas");

    const mouseMoveHandler = function (event) {
        mouseInput(event, global.cameraValues);
    };

    const keyDownHandler = function (event) {
        keyboardInput(event, global.cameraValues);
    };

    document.addEventListener('pointerlockchange', function () {
        if (document.pointerLockElement === canvas) {
            canvas.addEventListener('mousemove', mouseMoveHandler, false);
            document.addEventListener('keydown', keyDownHandler, false);
        }
        else {
            canvas.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('keydown', keyDownHandler);
        }
    }, false);

    canvas.addEventListener("click", async () => {
        await canvas.requestPointerLock({
            unadjustedMovement: true,
        });
    });
}
