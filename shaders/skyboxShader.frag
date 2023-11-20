#version 300 es

precision mediump float;

uniform samplerCube u_skybox;

in vec3 f_texCoord;

out vec4 FragColor;

void main()
{
    // The fragment color is simply the color of the skybox at the given
    // texture coordinate (local coordinate) of the fragment on the cube.
    FragColor = texture(u_skybox, f_texCoord);
}