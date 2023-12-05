#version 300 es
layout (location = 0) in vec3 aVertexPosition;

uniform mat4 model;
uniform mat4 view;
uniform mat4 proj;

void main()
{
    gl_Position = proj * view * model * vec4(aVertexPosition.x, aVertexPosition.y, aVertexPosition.z, 1.0f);
}