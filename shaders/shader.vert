#version 300 es
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