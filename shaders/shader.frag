#version 300 es
precision mediump float;

uniform float u_time;

in vec3 outColor;
in mat4 pos;

out vec4 fragColor;

in vec2 TexCoord;

uniform sampler2D ourTexture;

void main()
{
    //fragColor = vec4(color, 1.0f);
    fragColor = texture(ourTexture, TexCoord);
}