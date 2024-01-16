#version 300 es
precision mediump float;

layout (location = 0) out vec4 fragColor;
layout (location = 1) out vec4 brightColor;

void main()
{
    fragColor = vec4(0); // set all 4 vector values to 1.0
    brightColor = vec4(1.0, 1.0, 0.8, 1.0); // set all 4 vector values to 1.0
}