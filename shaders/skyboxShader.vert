#version 300 es

precision highp float;

uniform mat3 u_viewRotationMatrix;
uniform mat4 u_projectionMatrix;

in vec3 a_pos;

out vec3 f_texCoord;

void main()
{
    // Use the local position of the vertex as texture coordinate.
    f_texCoord = a_pos;

    // By setting Z == W, we ensure that the vertex is projected onto the
    // far plane, which is exactly what we want for the background.
    vec4 ndcPos = u_projectionMatrix * inverse(mat4(u_viewRotationMatrix)) * vec4(a_pos, 1.0);
    gl_Position = ndcPos.xyww;
}