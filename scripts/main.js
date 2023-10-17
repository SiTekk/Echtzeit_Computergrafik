import { createShaderProgram } from "./shaders.js";
import { vertices, indices } from "./vertices.js";
import { keyboardInput, mouseInput, toRadians } from "./input.js";

main();

function main() {
    const [gl, programData] = initialize();

    if (programData === null) {
        return;
    }

    let ubo = {
        model: glMatrix.mat4.create(),
        view: glMatrix.mat4.create(),
        proj: glMatrix.mat4.create()
    }

    // Variable that holds the values for the camera
    let cameraValues = {
        angle: 0.0,
        axis: glMatrix.vec3.fromValues(0.0, 0.5, 1.5),
        eye: glMatrix.vec3.fromValues(0.0, 0.0, 0.0),
        center: glMatrix.vec3.fromValues(0.0, 0.0, 1.0),
        up: glMatrix.vec3.fromValues(0.0, -1.0, 0.0),
        fovy: 90.0,
        near: 0.1,
        far: 1000.0
    };

    const canvas = document.querySelector("#glcanvas");

    document.addEventListener('pointerlockchange', function() {
        if (document.pointerLockElement === canvas) {
            canvas.addEventListener('mousemove', function (event) {
                mouseInput(event, cameraValues);
            }, false);

            document.addEventListener('keydown', function (event) {
                keyboardInput(event, cameraValues);
            });
        }
    }, false);

    canvas.addEventListener("click", async () => {
        await canvas.requestPointerLock({
            unadjustedMovement: true,
        });
    });

    function mainLoop(now) {
        // Set clear color to black, fully opaque
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        // Clear the color buffer with specified clear color
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(programData.shaderProgram);
        gl.bindVertexArray(programData.vertexArray);

        glMatrix.mat4.identity(ubo.model);
        glMatrix.mat4.translate(ubo.model, ubo.model, cameraValues.axis);
        glMatrix.mat4.lookAt(ubo.view, cameraValues.eye, glMatrix.vec3.add(cameraValues.center, cameraValues.center, cameraValues.eye), cameraValues.up);
        glMatrix.mat4.perspective(ubo.proj, toRadians(cameraValues.fovy), programData.width / programData.height, cameraValues.near, cameraValues.far);

        let modelLocation = gl.getUniformLocation(programData.shaderProgram, "model");
        let viewLocation = gl.getUniformLocation(programData.shaderProgram, "view");
        let projLocation = gl.getUniformLocation(programData.shaderProgram, "proj");
        gl.uniformMatrix4fv(modelLocation, gl.FALSE, ubo.model);
        gl.uniformMatrix4fv(viewLocation, gl.FALSE, ubo.view);
        gl.uniformMatrix4fv(projLocation, gl.FALSE, ubo.proj);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_INT, 0);

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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, programData.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0); // Position
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12); // Color
    gl.enableVertexAttribArray(1);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    return [gl, programData];
}
