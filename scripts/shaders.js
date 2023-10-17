const vsSource = `#version 300 es
layout (location = 0) in vec3 aVertexPosition;
layout (location = 1) in vec3 aColor;

uniform mat4 model;
uniform mat4 view;
uniform mat4 proj;

out vec3 outColor;

void main()
{
    gl_Position = proj * view * model * vec4(aVertexPosition.x, aVertexPosition.y, aVertexPosition.z, 1.0f);
    outColor = aColor;
}
`;

const fsSource = `#version 300 es
precision highp float;

in vec3 outColor;

out vec4 fragColor;

void main()
{
    fragColor = vec4(outColor.x, outColor.y, outColor.z, 1.0f);
} 
`;

function createShaderProgram(gl) {

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
            `Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram,)}`,
        );
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source) {

    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        if (type === gl.VERTEX_SHADER) {
            alert(
                `An error occurred compiling the vertex shader: ${gl.getShaderInfoLog(shader)}`,
            );
        }

        else {
            alert(
                `An error occurred compiling the fragment shader: ${gl.getShaderInfoLog(shader)}`,
            );
        }

        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

export { createShaderProgram };