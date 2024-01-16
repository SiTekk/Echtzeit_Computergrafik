#version 300 es

precision mediump float;

uniform samplerCube u_skybox;

in vec3 f_texCoord;

layout (location = 0) out vec4 fragColor;
layout (location = 1) out vec4 brightColor;

void main()
{
    // The fragment color is simply the color of the skybox at the given
    // texture coordinate (local coordinate) of the fragment on the cube.
    fragColor = texture(u_skybox, f_texCoord);

    fragColor = fragColor * 0.3;

    // Extract bright Colors
    float brightness = dot(fragColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    if(brightness > 0.5)
        brightColor = vec4(fragColor.rgb, 1.0);
    else
        brightColor = vec4(0.0, 0.0, 0.0, 1.0);
}