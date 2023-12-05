#version 300 es
precision highp float;

layout (location = 0) in vec3 aVertexPosition;
layout (location = 1) in vec3 aNormalPosition;
layout (location = 2) in vec3 aColor;
layout (location = 3) in vec2 aTexCoord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 proj;

out vec3 outColor;
out vec2 texCoord;
out vec3 normal;
out vec3 fragPos;

void main()
{
    gl_Position = proj * view * model * vec4(aVertexPosition.x, aVertexPosition.y, aVertexPosition.z, 1.0f);
    outColor = aColor;
    texCoord = aTexCoord;
    normal = mat3(transpose(inverse(model))) * aNormalPosition;
    fragPos = vec3(model * vec4(aVertexPosition, 1.0));
}