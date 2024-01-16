#version 300 es
precision mediump float;

out vec4 fragColor;

in vec2 texCoords;

uniform sampler2D uInputTex;
uniform bool horizontal;

float weight[5] = float[] (0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);
float scale = 1.0;

void main()
{
    vec2 tex_offset = 1.0 / vec2(textureSize(uInputTex, 0));
    vec3 result = texture(uInputTex, texCoords).rgb * weight[0];

    if(horizontal)
    {
        for(int i = 1; i < 5; ++i)
        {
            result += texture(uInputTex, texCoords + vec2(tex_offset.x * float(i), 0.0)).rgb * weight[i] * scale;
            result += texture(uInputTex, texCoords - vec2(tex_offset.x * float(i), 0.0)).rgb * weight[i] * scale;
        }
    }
    else
    {
        for(int i = 1; i < 5; ++i)
        {
            result += texture(uInputTex, texCoords + vec2(0.0, tex_offset.y * float(i))).rgb * weight[i] * scale;
            result += texture(uInputTex, texCoords - vec2(0.0, tex_offset.y * float(i))).rgb * weight[i] * scale;
        }
    }

    fragColor = vec4(result, 1.0);
}