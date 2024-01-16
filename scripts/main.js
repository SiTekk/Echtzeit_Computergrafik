import { createShaderProgram } from "./shaders.js";
import { keyboardInput, mouseInput, toRadians } from "./input.js";
import { AttributeDescription, GameObject, global } from "./globalVariables.js";
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

    //const modelLocation = gl.getUniformLocation(programData.shaderProgram, "model");
    const viewLocation = gl.getUniformLocation(programData.shaderProgram, "view");
    const projLocation = gl.getUniformLocation(programData.shaderProgram, "proj");
    const lightViewLocationMain = gl.getUniformLocation(programData.shaderProgram, "lightView");
    const lightProjLocationMain = gl.getUniformLocation(programData.shaderProgram, "lightProj");

    const timeUniformLocation = gl.getUniformLocation(programData.shaderProgram, "u_time");
    const lightColorLocation = gl.getUniformLocation(programData.shaderProgram, "lightColor");
    const lightPosLocation = gl.getUniformLocation(programData.shaderProgram, "lightPos");
    const viewPosLocation = gl.getUniformLocation(programData.shaderProgram, "viewPos");

    const skyboxViewLocation = gl.getUniformLocation(programData.skyboxShaderProgram, "view");
    const skyboxProjLocation = gl.getUniformLocation(programData.skyboxShaderProgram, "proj");

    const lightModelLocation = gl.getUniformLocation(programData.lightShaderProgram, "model");
    const lightViewLocation = gl.getUniformLocation(programData.lightShaderProgram, "view");
    const lightProjLocation = gl.getUniformLocation(programData.lightShaderProgram, "proj");

    function mainLoop(timeStamp)
    {
        global.deltaTime = timeStamp - start;
        start = timeStamp;
        //elapsed += global.deltaTime;

        // glMatrix.mat4.identity(global.ubo.model);
        // glMatrix.mat4.translate(global.ubo.model, global.ubo.model, global.cameraValues.axis);
        
        renderShadowDepthMap(gl, programData);

        glMatrix.mat4.identity(global.ubo.model);
        glMatrix.vec3.add(temp, global.cameraValues.center, global.cameraValues.eye);
        glMatrix.mat4.lookAt(global.ubo.view, global.cameraValues.eye, temp, global.cameraValues.up);
        //glMatrix.mat4.ortho(global.ubo.proj, -10, 10, -10, 10, 0.001, global.cameraValues.far);
        glMatrix.mat4.perspective(global.ubo.proj, toRadians(global.cameraValues.fovy), programData.width / programData.height, global.cameraValues.near, global.cameraValues.far);

        gl.bindFramebuffer(gl.FRAMEBUFFER, programData.postProcessingFrameBuffer);

        // Set clear color to black, fully opaque
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0); // Clear everything
        // Clear the color buffer with specified clear color
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(programData.shaderProgram);

        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(gl.getUniformLocation(programData.shaderProgram, "ourTexture"), 0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, programData.texture);
        gl.activeTexture(gl.TEXTURE0 + 1);
        gl.uniform1i(gl.getUniformLocation(programData.shaderProgram, "shadowMap"), 1);
        gl.bindTexture(gl.TEXTURE_2D, programData.frameBufferTexture);
        
        gl.bindVertexArray(programData.vertexArray);

        gl.uniformMatrix4fv(viewLocation, gl.FALSE, global.ubo.view);
        gl.uniformMatrix4fv(projLocation, gl.FALSE, global.ubo.proj);
        gl.uniformMatrix4fv(lightViewLocationMain, gl.FALSE, global.ubo.lightView);
        gl.uniformMatrix4fv(lightProjLocationMain, gl.FALSE, global.ubo.lightProj);

        gl.uniform1f(timeUniformLocation, timeStamp / 1000);
        gl.uniform3fv(lightColorLocation, [1.0, 1.0, 1.0]);
        gl.uniform3fv(lightPosLocation, global.lightPosition);
        gl.uniform3fv(viewPosLocation, global.cameraValues.eye);

        // Draw Cubes
        gl.drawElementsInstanced(gl.TRIANGLES, global.indices.length, gl.UNSIGNED_INT, 0, programData.instances.length);
        
        for(const gameObject of programData.tree)
        {
            gl.bindVertexArray(gameObject.vao);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, gameObject.texture);
            gl.drawElementsInstanced(gl.TRIANGLES, global.indices.length, gl.UNSIGNED_INT, 0, gameObject.coordinates.length);
        }

        // Draw light source
        gl.useProgram(programData.lightShaderProgram);
        gl.bindVertexArray(programData.lightVAO);

        gl.uniformMatrix4fv(lightViewLocation, gl.FALSE, global.ubo.view);
        gl.uniformMatrix4fv(lightProjLocation, gl.FALSE, global.ubo.proj);

        glMatrix.mat4.identity(global.ubo.model);

        global.lightPosition[0] = global.lightPosition[0] + global.deltaTime * 0.01;

        if(global.lightPosition[0] > 100)
        {
            global.lightPosition[0] = -100;
        }

        global.lightPosition[1] = (-(0.1 * global.lightPosition[0] - 100) * (0.1 * global.lightPosition[0] + 100)) - 9900;

        glMatrix.mat4.translate(global.ubo.model, global.ubo.model, global.lightPosition);
        glMatrix.mat4.scale(global.ubo.model, global.ubo.model, [5.0, 5.0, 5.0]);
        gl.uniformMatrix4fv(lightModelLocation, gl.FALSE, global.ubo.model);
        gl.drawElements(gl.TRIANGLES, global.indices.length, gl.UNSIGNED_INT, 0);

        // Draw cubeMap last
        gl.disable(gl.CULL_FACE)

        gl.useProgram(programData.skyboxShaderProgram);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, programData.cubeMapTexture);
        gl.bindVertexArray(programData.skyBoxVAO);
 
        gl.uniformMatrix4fv(skyboxViewLocation, gl.FALSE, global.ubo.view);
        gl.uniformMatrix4fv(skyboxProjLocation, gl.FALSE, global.ubo.proj);

        gl.drawElements(gl.TRIANGLES, global.unitBoxIndices.length, gl.UNSIGNED_INT, 0);
        //gl.drawArrays(gl.TRIANGLES, 0, 36);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        
        postProcessing(gl, programData);

        gl.enable(gl.CULL_FACE);

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
        depthShaderProgram: await createShaderProgram(gl, `${document.location.origin}/shaders/depthShader.vert`, `${document.location.origin}/shaders/depthShader.frag`),
        bloomShaderProgram: await createShaderProgram(gl, `${document.location.origin}/shaders/postProcessingShader.vert`, `${document.location.origin}/shaders/bloomShader.frag`),
        postProcessingShaderProgram: await createShaderProgram(gl, `${document.location.origin}/shaders/postProcessingShader.vert`, `${document.location.origin}/shaders/postProcessingShader.frag`),
        vertexArray: gl.createVertexArray(),
        vertexBuffer: gl.createBuffer(),
        indexBuffer: gl.createBuffer(),
        skyBoxVAO: gl.createVertexArray(),
        skyBoxVBO: gl.createBuffer(),
        skyBoxIBO: gl.createBuffer(),
        quadVAO: gl.createVertexArray(),
        texture: await createCubeMapTexture(gl, global.dirtBlockUrls),
        cubeMapTexture: await createCubeMapTexture(gl, global.skyBoxUrls),
        lightVAO: gl.createVertexArray(),
        frameBuffer: gl.createFramebuffer(),
        frameBufferTexture: gl.createTexture(),
        postProcessingFrameBuffer: gl.createFramebuffer(),
        postProcessingFrameBufferTexture: gl.createTexture(),
        postProcessingFrameBufferTextureBrightColor: gl.createTexture(),
        bloomFrameBuffers: [gl.createFramebuffer(), gl.createFramebuffer()],
        bloomTextures: [gl.createTexture(), gl.createTexture()],
        instances: [],
        tree:
        [
            new GameObject( gl.createVertexArray(),
                [
                    0,1,0,
                    0,2,0,
                    0,3,0,
                    0,4,0
                ], await createCubeMapTexture(gl, global.treeBlockUrls)),
            new GameObject( gl.createVertexArray(),
                [
                    0,5,0,
                    0,5,1,
                    0,5,-1,
                    1,5,0,
                    1,5,1,
                    1,5,-1,
                    -1,5,0,
                    -1,5,1,
                    -1,5,-1
                ], await createCubeMapTexture(gl, global.leaveBlockUrls))
        ]
    };

    console.log(`Width: ${programData.width}`)
    console.log(`Height: ${programData.height}`)
    console.log(`Aspect: ${programData.width / programData.height}`)

    for(let x = -15; x < 16; x++)
    {
        for(let z = -15; z < 16; z++)
        {
            programData.instances.push(x);
            programData.instances.push(0);
            programData.instances.push(z);
        }
    }

    setupVertexArray(gl, programData.vertexArray, programData.vertexBuffer, global.vertices, programData.indexBuffer, global.indices, programData.instances, global.attributeDescriptors, 48); // For a normal cube
    setupVertexArray(gl, programData.skyBoxVAO, programData.skyBoxVBO, global.unitBoxVertices, programData.skyBoxIBO, global.unitBoxIndices, null, [new AttributeDescription(0, 3, 0)], 12); // For the skybox
    setupVertexArray(gl, programData.lightVAO, gl.createBuffer(), global.vertices, gl.createBuffer(), global.indices, null, [new AttributeDescription(0,3,0)], 48);
    setupVertexArray(gl, programData.quadVAO, gl.createBuffer(), global.quadVertices, null, null, null, [new AttributeDescription(0,2,0), new AttributeDescription(1,2,8)], 16);

    for(const gameObject of programData.tree)
    {
        setupVertexArray(gl, gameObject.vao, gl.createBuffer(), global.vertices, gl.createBuffer(), global.indices, gameObject.coordinates, global.attributeDescriptors, 48);
    }

    setupFrameBuffers(gl, programData);

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

function setupFrameBuffers(gl, programData)
{
    /*
        Depth Frame Buffer
    */
    gl.bindFramebuffer(gl.FRAMEBUFFER, programData.frameBuffer);

    gl.bindTexture(gl.TEXTURE_2D, programData.frameBufferTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, programData.width, programData.height, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, programData.frameBufferTexture, 0);
    
    gl.readBuffer(gl.NONE);
    gl.drawBuffers([gl.NONE]);

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
    {
        console.log("FrameBuffer Status:", gl.checkFramebufferStatus(gl.FRAMEBUFFER));
    }

    /*
        Post Processing Frame Buffer
    */
    gl.bindFramebuffer(gl.FRAMEBUFFER, programData.postProcessingFrameBuffer);

    gl.bindTexture(gl.TEXTURE_2D, programData.postProcessingFrameBufferTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, programData.width, programData.height, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, programData.postProcessingFrameBufferTexture, 0);

    gl.bindTexture(gl.TEXTURE_2D, programData.postProcessingFrameBufferTextureBrightColor);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, programData.width, programData.height, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, programData.postProcessingFrameBufferTextureBrightColor, 0);

    let rbo = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH24_STENCIL8, programData.width, programData.height);

    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, rbo);

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
    {
        console.log("FrameBuffer Status:", gl.checkFramebufferStatus(gl.FRAMEBUFFER));
    }

    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]); // Tell OpenGL to draw to both textures

    /*
        Bloom Frame Buffers
    */
    for(let i = 0; i < programData.bloomFrameBuffers.length; i++)
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, programData.bloomFrameBuffers[i]);
        gl.bindTexture(gl.TEXTURE_2D, programData.bloomTextures[i]);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, programData.width, programData.height, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, programData.bloomTextures[i], 0);

        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
        {
            console.log("FrameBuffer Status:", gl.checkFramebufferStatus(gl.FRAMEBUFFER));
        }
    }

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function setupVertexArray(gl, vertexArray, vertexBuffer, vertices, indexBuffer, indices, instances, attributeDescriptors, stride)
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

    if (instances !== null)
    {
        let instanceBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(instances), gl.STATIC_DRAW);
        gl.vertexAttribPointer(4, 3, gl.FLOAT, gl.FALSE, 0, 0);
        gl.vertexAttribDivisor(4, 1);
        gl.enableVertexAttribArray(4);
    }

    for(const attributeDescription of attributeDescriptors)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        gl.vertexAttribPointer(attributeDescription.location, attributeDescription.size, gl.FLOAT, gl.FALSE, stride, attributeDescription.offset);
        gl.enableVertexAttribArray(attributeDescription.location);

        if(attributeDescription.isInstanced)
        {
            gl.vertexAttribDivisor(attributeDescription.location, 1);
        }
    }

    // Unbind everything to reset state machine
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
}

function renderShadowDepthMap(gl, programData)
{
    gl.bindFramebuffer(gl.FRAMEBUFFER, programData.frameBuffer);

    glMatrix.mat4.lookAt(global.ubo.lightView, global.lightPosition, [0.0, 3.0, 0.0], [0.0, 1.0, 0.0]);
    glMatrix.mat4.ortho(global.ubo.lightProj, -25.0, 25.0, -25.0, 25.0, global.cameraValues.near, global.cameraValues.far);

    const viewLocation = gl.getUniformLocation(programData.depthShaderProgram, "view");
    const projLocation = gl.getUniformLocation(programData.depthShaderProgram, "proj");

    gl.useProgram(programData.depthShaderProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, programData.texture);

    gl.uniformMatrix4fv(viewLocation, gl.FALSE, global.ubo.lightView);
    gl.uniformMatrix4fv(projLocation, gl.FALSE, global.ubo.lightProj);

    gl.clearDepth(1.0); // Clear everything
    gl.clear(gl.DEPTH_BUFFER_BIT);

    gl.bindVertexArray(programData.vertexArray);

    // Draw Cubes
    gl.drawElementsInstanced(gl.TRIANGLES, global.indices.length, gl.UNSIGNED_INT, 0, programData.instances.length);

    for(const gameObject of programData.tree)
    {
        gl.bindVertexArray(gameObject.vao);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, gameObject.texture);
        gl.drawElementsInstanced(gl.TRIANGLES, global.indices.length, gl.UNSIGNED_INT, 0, gameObject.coordinates.length);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function postProcessing(gl, programData)
{
    gl.useProgram(programData.bloomShaderProgram);

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.bindVertexArray(programData.quadVAO);
    gl.disable(gl.DEPTH_TEST);

    let horizontal = true;
    let amount = 10;
    
    gl.activeTexture(gl.TEXTURE0);

    for(let i = 0; i < amount; i++)
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, programData.bloomFrameBuffers[i % 2]);

        if(i === 0)
        {
            gl.bindTexture(gl.TEXTURE_2D, programData.postProcessingFrameBufferTextureBrightColor);
        }
        else
        {
            gl.bindTexture(gl.TEXTURE_2D, programData.bloomTextures[(i + 1) % 2]);
        }

        gl.uniform1f(gl.getUniformLocation(programData.bloomShaderProgram, "horizontal"), horizontal);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        horizontal = !horizontal;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.useProgram(programData.postProcessingShaderProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(gl.getUniformLocation(programData.postProcessingShaderProgram, "uInputTexture"), 0);
    gl.bindTexture(gl.TEXTURE_2D, programData.postProcessingFrameBufferTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.uniform1i(gl.getUniformLocation(programData.postProcessingShaderProgram, "bloomTexture"), 1);
    gl.bindTexture(gl.TEXTURE_2D, programData.bloomTextures[(amount + 1) % 2]);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.enable(gl.DEPTH_TEST);
}