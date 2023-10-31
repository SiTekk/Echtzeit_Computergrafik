#version 300 es
precision mediump float;

uniform float u_time;

in vec3 outColor;
in mat4 pos;

out vec4 fragColor;

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

void main()
{
    vec2 i = gl_FragCoord.xy;

    vec4 vecRand;

    vecRand.x = random(i);
    vecRand.y = random(i + vec2(1.0, 0.0));
    vecRand.z = random(i + vec2(0.0, 1.0));
    vecRand.w = random(i + vec2(1.0, 1.0));

    vec4 color = vec4(sin(outColor.x + u_time + pos[3][0]), cos(outColor.y + u_time + pos[3][1]), sin(outColor.z + u_time + pos[3][2]), 1.0f);

    fragColor = mix(color, vecRand, 0.5f);
}