#version 300 es
precision highp float;

layout (location = 0) in vec3 aVertexPosition;
layout (location = 1) in vec3 aNormalPosition;
layout (location = 2) in vec3 aColor;
layout (location = 3) in vec3 aTexCoord;
layout (location = 4) in vec3 aOffset;

//uniform mat4 model;
uniform mat4 view;
uniform mat4 proj;

out vec3 outColor;
out vec3 texCoord;
out vec3 normal;
out vec3 fragPos;

void main()
{
    mat4 model = mat4(
        vec4(1.0, 0.0, 0.0, 0.0),
        vec4(0.0, 1.0, 0.0, 0.0),
        vec4(0.0, 0.0, 1.0, 0.0),
        vec4(aOffset, 1.0));

    gl_Position = proj * view * model * vec4(aVertexPosition, 1.0f);
    outColor = aColor;
    texCoord = aTexCoord;
    normal = mat3(transpose(inverse(model))) * aNormalPosition;
    fragPos = vec3(model * vec4(aVertexPosition, 1.0));
}