import { createShaderProgram } from "./shaders.js";
import { keyboardInput, mouseInput, toRadians } from "./input.js";
import { AttributeDescription, global } from "./globalVariables.js";
import { createCubeMapTexture, createTexture } from "./textures.js";

main();

async function main() {
    const [gl, programData] = await initialize();

    initializeEventListener();

    if (programData === null) {
        return;
    }

    let start = 0;
    let elapsed = 0;
    let temp = glMatrix.vec3.create();

    const modelLocation = gl.getUniformLocation(programData.shaderProgram, "model");
    const viewLocation = gl.getUniformLocation(programData.shaderProgram, "view");
    const projLocation = gl.getUniformLocation(programData.shaderProgram, "proj");

    const timeUniformLocation = gl.getUniformLocation(programData.shaderProgram, "u_time");
    const lightColorLocation = gl.getUniformLocation(programData.shaderProgram, "lightColor");
    const lightPosLocation = gl.getUniformLocation(programData.shaderProgram, "lightPos");
    const viewPosLocation = gl.getUniformLocation(programData.shaderProgram, "viewPos");

    const skyboxViewLocation = gl.getUniformLocation(programData.skyboxShaderProgram, "view");
    const skyboxProjLocation = gl.getUniformLocation(programData.skyboxShaderProgram, "proj");

    const lightModelLocation = gl.getUniformLocation(programData.lightShaderProgram, "model");
    const lightViewLocation = gl.getUniformLocation(programData.lightShaderProgram, "view");
    const lightProjLocation = gl.getUniformLocation(programData.lightShaderProgram, "proj");

    gl.activeTexture(gl.TEXTURE0 + 0);
    gl.bindTexture(gl.TEXTURE_2D, programData.texture);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, programData.cubeMapTexture);

    function mainLoop(timeStamp) {
        global.deltaTime = timeStamp - start;
        start = timeStamp;
        //elapsed += g_deltaTime;

        // glMatrix.mat4.identity(global.ubo.model);
        // glMatrix.mat4.translate(global.ubo.model, global.ubo.model, global.cameraValues.axis);
        
        glMatrix.mat4.identity(global.ubo.model);
        glMatrix.vec3.add(temp, global.cameraValues.center, global.cameraValues.eye);
        glMatrix.mat4.lookAt(global.ubo.view, global.cameraValues.eye, temp, global.cameraValues.up);
        glMatrix.mat4.perspective(global.ubo.proj, toRadians(global.cameraValues.fovy), programData.width / programData.height, global.cameraValues.near, global.cameraValues.far);

        // Set clear color to black, fully opaque
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0); // Clear everything
        // Clear the color buffer with specified clear color
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(programData.shaderProgram);
        gl.bindTexture(gl.TEXTURE_2D, programData.texture);
        gl.bindVertexArray(programData.vertexArray);

        gl.uniformMatrix4fv(viewLocation, gl.FALSE, global.ubo.view);
        gl.uniformMatrix4fv(projLocation, gl.FALSE, global.ubo.proj);

        gl.uniform1f(timeUniformLocation, timeStamp / 1000);
        gl.uniform3fv(lightColorLocation, [1.0, 1.0, 1.0]);
        gl.uniform3fv(lightPosLocation, global.lightPosition);
        gl.uniform3fv(viewPosLocation, global.cameraValues.eye);

        // Draw Cubes
        for (let i = 0; i < global.cubePositions.length; i++)
        {
            glMatrix.mat4.fromTranslation(global.ubo.model, global.cubePositions[i]);
            gl.uniformMatrix4fv(modelLocation, gl.FALSE, global.ubo.model);
            gl.drawElements(gl.TRIANGLES, global.indices.length, gl.UNSIGNED_INT, 0);
        }

        // Draw light source
        gl.useProgram(programData.lightShaderProgram);
        gl.bindVertexArray(programData.lightVAO);

        gl.uniformMatrix4fv(lightViewLocation, gl.FALSE, global.ubo.view);
        gl.uniformMatrix4fv(lightProjLocation, gl.FALSE, global.ubo.proj);

        glMatrix.mat4.identity(global.ubo.model);
        glMatrix.mat4.translate(global.ubo.model, global.ubo.model, global.lightPosition);
        glMatrix.mat4.scale(global.ubo.model, global.ubo.model, [0.2, 0.2, 0.2]);
        gl.uniformMatrix4fv(lightModelLocation, gl.FALSE, global.ubo.model);
        gl.drawElements(gl.TRIANGLES, global.indices.length, gl.UNSIGNED_INT, 0);

        // Draw cubeMap last
        gl.disable(gl.CULL_FACE)

        gl.useProgram(programData.skyboxShaderProgram);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, programData.cubeMapTexture);
        gl.bindVertexArray(programData.skyBoxVAO);
 
        gl.uniformMatrix4fv(skyboxViewLocation, gl.FALSE, global.ubo.view);
        gl.uniformMatrix4fv(skyboxProjLocation, gl.FALSE, global.ubo.proj);
 
        gl.drawElements(gl.TRIANGLES, global.unitBoxIndices.length, gl.UNSIGNED_INT, 0);
        //gl.drawArrays(gl.TRIANGLES, 0, 36);
 
        gl.enable(gl.CULL_FACE)

        requestAnimationFrame(mainLoop);
    }

    requestAnimationFrame(mainLoop);
}

async function initialize() {
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
        shaderProgram: await createShaderProgram(gl, `${document.location.origin}/shaders/shader.vert`, `${document.location.origin}/shaders/shader.frag`),
        skyboxShaderProgram: await createShaderProgram(gl, `${document.location.origin}/shaders/skyboxShader.vert`, `${document.location.origin}/shaders/skyboxShader.frag`),
        lightShaderProgram: await createShaderProgram(gl, `${document.location.origin}/shaders/lightShader.vert`, `${document.location.origin}/shaders/lightShader.frag`),
        vertexArray: gl.createVertexArray(),
        vertexBuffer: gl.createBuffer(),
        indexBuffer: gl.createBuffer(),
        skyBoxVAO: gl.createVertexArray(),
        skyBoxVBO: gl.createBuffer(),
        skyBoxIBO: gl.createBuffer(),
        texture: await createTexture(gl, `${document.location.origin}/textures/ETSIs.jpg`),
        cubeMapTexture: await createCubeMapTexture(gl, global.skyBoxUrls),
        lightVAO: gl.createVertexArray(),
    };

    console.log(`Width: ${programData.width}`)
    console.log(`Height: ${programData.height}`)
    console.log(`Aspect: ${programData.width / programData.height}`)
    
    setupVertexArray(gl, programData.vertexArray, programData.vertexBuffer, global.vertices, programData.indexBuffer, global.indices, global.attributeDescriptors, 44); // For a normal cube
    setupVertexArray(gl, programData.skyBoxVAO, programData.skyBoxVBO, global.unitBoxVertices, programData.skyBoxIBO, global.unitBoxIndices, [new AttributeDescription(0, 3, 0)], 12); // For the skybox
    setupVertexArray(gl, programData.lightVAO, gl.createBuffer(), global.vertices, gl.createBuffer(), global.indices, [new AttributeDescription(0,3,0)], 44);

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


function setupVertexArray(gl, vertexArray, vertexBuffer, vertices, indexBuffer, indices, attributeDescriptors, stride)
{
    // bind the Vertex Array Object first, then bind and set vertex buffer(s), and then configure vertex attributes(s).
    gl.bindVertexArray(vertexArray);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    if (indexBuffer !== null)
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
    }

    for(const attributeDescription of attributeDescriptors)
    {
        gl.vertexAttribPointer(attributeDescription.location, attributeDescription.size, gl.FLOAT, gl.FALSE, stride, attributeDescription.offset);
        gl.enableVertexAttribArray(attributeDescription.location);
    }

    // Unbind everything to reset state machine
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
}