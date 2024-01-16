#version 300 es
precision mediump float;

out vec4 fragColor;

in vec2 texCoords;

uniform sampler2D uInputTexture;
uniform sampler2D bloomTexture;

void main()
{
    const float gamma = 2.2;
    vec3 hdrColor = texture(uInputTexture, texCoords).rgb;
    vec3 bloomColor = texture(bloomTexture, texCoords).rgb;
    
    //vec3 result = vec3(1.0) - exp(-hdrColor * exposure);

    //result = pow(result, vec3(1.0 / gamma));
    fragColor = vec4( hdrColor + bloomColor, 1.0);
}