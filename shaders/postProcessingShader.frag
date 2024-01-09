#version 300 es
precision mediump float;

out vec4 fragColor;

in vec2 texCoords;

uniform sampler2D uInputTex;

int uGhosts = 2; // number of ghost samples
float uGhostDispersal = 0.99; // dispersion factor
float uGhostThreshold = 0.001;

vec4 ApplyThreshold(vec4 _rgb, float _threshold)
{
    return max(_rgb - vec4(_threshold), vec4(0.0));
}

void main()
{
    vec2 texcoord = texCoords;
    vec2 texelSize = 1.0 / vec2(textureSize(uInputTex, 0));

    // ghost vector to image centre:
    vec2 ghostVec = (vec2(0.5) - texcoord) * uGhostDispersal;
   
    // sample ghosts:
    vec4 result = vec4(0.0);

    for (int i = 0; i < uGhosts; ++i)
    {
        vec2 suv = fract(texcoord + ghostVec * vec2(i));
        float d = distance(suv, vec2(0.5));
        float weight = 1.0 - smoothstep(0.0, 0.75, d); // reduce contributions from samples at the screen edge
        vec4 s = texture(uInputTex, texCoords);
        s = ApplyThreshold(s, uGhostThreshold);
        result += s * weight;
    }

    fragColor = result;
}