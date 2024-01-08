#version 300 es
precision highp float;

layout (location = 0) in vec3 aVertexPosition;
layout (location = 1) in vec3 aNormalPosition;
layout (location = 2) in vec3 aColor;
layout (location = 3) in vec3 aTexCoord;
layout (location = 4) in vec3 aOffset;

uniform mat4 view;
uniform mat4 proj;

void main()
{
    mat4 model = mat4(
        vec4(1.0, 0.0, 0.0, 0.0),
        vec4(0.0, 1.0, 0.0, 0.0),
        vec4(0.0, 0.0, 1.0, 0.0),
        vec4(aOffset, 1.0));

    gl_Position = proj * view * model * vec4(aVertexPosition, 1.0f);
}