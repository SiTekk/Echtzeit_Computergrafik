#version 300 es

layout (location = 0) in vec3 aPos;

out vec3 f_texCoord;

uniform mat4 proj;
uniform mat4 view;

void main()
{
    f_texCoord = aPos;
    mat4 temp = mat4(mat3(view));
    gl_Position = proj * temp * vec4(aPos, 1.0);
}