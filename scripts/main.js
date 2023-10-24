import { createShaderProgram } from "./shaders.js";
import { keyboardInput, mouseInput, toRadians } from "./input.js";
import { cubePositions, g_cameraValues, g_indices, g_ubo, g_vertices, setDeltaTime } from "./globalVariables.js";

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
        setDeltaTime(timeStamp - start);
        start = timeStamp;
        //elapsed += g_deltaTime;

        // Set clear color to black, fully opaque
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0); // Clear everything
        // Clear the color buffer with specified clear color
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(programData.shaderProgram);
        gl.bindVertexArray(programData.vertexArray);

        // glMatrix.mat4.identity(g_ubo.model);
        // glMatrix.mat4.translate(g_ubo.model, g_ubo.model, g_cameraValues.axis);
        
        glMatrix.mat4.identity(g_ubo.model);
        glMatrix.vec3.add(temp, g_cameraValues.center, g_cameraValues.eye);
        glMatrix.mat4.lookAt(g_ubo.view, g_cameraValues.eye, temp, g_cameraValues.up);
        glMatrix.mat4.perspective(g_ubo.proj, toRadians(g_cameraValues.fovy), programData.width / programData.height, g_cameraValues.near, g_cameraValues.far);

        let modelLocation = gl.getUniformLocation(programData.shaderProgram, "model");
        let viewLocation = gl.getUniformLocation(programData.shaderProgram, "view");
        let projLocation = gl.getUniformLocation(programData.shaderProgram, "proj");
        gl.uniformMatrix4fv(viewLocation, gl.FALSE, g_ubo.view);
        gl.uniformMatrix4fv(projLocation, gl.FALSE, g_ubo.proj);

        const timeUniform = gl.getUniformLocation(programData.shaderProgram, "u_time");
        gl.uniform1f(timeUniform, timeStamp / 1000);

        for (let i = 0; i < cubePositions.length; i++)
        {
            glMatrix.mat4.identity(g_ubo.model);
            glMatrix.mat4.translate(g_ubo.model, g_ubo.model, cubePositions[i]);
            gl.uniformMatrix4fv(modelLocation, gl.FALSE, g_ubo.model);
            gl.drawElements(gl.TRIANGLES, g_indices.length, gl.UNSIGNED_INT, 0);
          }

        requestAnimationFrame(mainLoop);
    }

    requestAnimationFrame(mainLoop);
}

function initialize() {
    const canvas = document.querySelector("#glcanvas");

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    // Initialize the GL context
    const gl = canvas.getContext("webgl2");

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
        );
        return null;
    }

    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    gl.enable(gl.CULL_FACE); // Enable face culling
    gl.cullFace(gl.FRONT);

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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(g_vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, programData.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(g_indices), gl.STATIC_DRAW);

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
        mouseInput(event, g_cameraValues);
    };

    const keyDownHandler = function (event) {
        keyboardInput(event, g_cameraValues);
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
