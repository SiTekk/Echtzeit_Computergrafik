#version 300 es
precision mediump float;

out vec4 fragColor;

in vec2 texCoords;

uniform sampler2D uInputTexture;

uniform bool depth;

void main()
{
    if(depth)
    {
        fragColor = vec4(texture(uInputTexture, texCoords).rrr, 1.0);
    }
    else
    {
        fragColor = vec4(texture(uInputTexture, texCoords).rgb, 1.0);
    }
}