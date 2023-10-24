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
precision mediump float;

uniform float u_time;

in vec3 outColor;

const vec2 resolution = vec2(256.0, 256.0);

out vec4 fragColor;

float random (in vec2 t) {
    return fract(sin(dot(t.xy, vec2(12.9898,78.233)))*43758.5453123);
  }

  float noise (in vec2 t) {
    vec2 i = floor(t);
    vec2 f = fract(t);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
  }

  float fbm (in vec2 t) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; ++i) {
      v += a * noise(t);
      t = rot * t * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 st = gl_FragCoord.xy/resolution.xy*3.;
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*u_time);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0 * q + vec2(1.7,9.2) + 0.15 * u_time );
    r.y = fbm( st + 1.0 * q + vec2(8.3,2.8) + 0.126 * u_time);

    float f = fbm(st+r);

    color = mix(vec3(0.101961,0.619608,0.666667),
                vec3(0.666667,0.666667,0.498039),
                clamp((f*f)*4.0, 0.0, 1.0));

    color = mix(color,
                vec3(0,0,0.164706),
                clamp(length(q), 0.0, 1.0));

    color = mix(color,
                vec3(0.666667,1,1),
                clamp(length(r.x), 0.0, 1.0));

    fragColor = vec4((f*f*f+.6*f*f+.5*f)*color,1.);
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