const vsSource = `#version 300 es
layout (location = 0) in vec3 aVertexPosition;
layout (location = 1) in vec3 aColor;

uniform mat4 model;
uniform mat4 view;
uniform mat4 proj;

out vec3 outColor;
out mat4 pos;

void main()
{
    gl_Position = proj * view * model * vec4(aVertexPosition.x, aVertexPosition.y, aVertexPosition.z, 1.0f);
    outColor = aColor;
    pos = model;
}
`;

const fsSource = `#version 300 es
precision mediump float;

uniform float u_time;

in vec3 outColor;
in mat4 pos;

out vec4 fragColor;

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

void main()
{
    vec2 i = gl_FragCoord.xy;

    vec4 vecRand;

    vecRand.x = random(i);
    vecRand.y = random(i + vec2(1.0, 0.0));
    vecRand.z = random(i + vec2(0.0, 1.0));
    vecRand.w = random(i + vec2(1.0, 1.0));

    vec4 color = vec4(sin(outColor.x + u_time + pos[3][0]), cos(outColor.y + u_time + pos[3][1]), sin(outColor.z + u_time + pos[3][2]), 1.0f);

    fragColor = mix(color, vecRand, 0.5f);
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