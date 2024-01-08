#version 300 es
precision mediump float;

uniform float u_time;
uniform vec3 lightPos;
uniform vec3 lightColor;
uniform vec3 viewPos;
//uniform sampler2D ourTexture;
uniform samplerCube ourTexture;
uniform sampler2D shadowMap;

in vec3 outColor;
in vec3 texCoord;
in vec3 normal;
in vec3 fragPos;
in vec4 fragPosLightSpace;

out vec4 fragColor;

float shadowCalculation(vec4 fragPosLS)
{
    vec3 projCoords = fragPosLS.xyz / fragPosLS.w;
    projCoords = projCoords * 0.5 + 0.5;

    float closestDepth = texture(shadowMap, projCoords.xy).r;
    float currentDepth = projCoords.z;

    vec3 norm = normalize(normal);
    vec3 lightDir = normalize(lightPos - fragPos);
    float bias = 0.0005;
    // check whether current frag pos is in shadow
    // float shadow = currentDepth - bias > closestDepth  ? 1.0 : 0.0;
    // PCF
    float shadow = 0.0;
    vec2 texelSize = 1.0 / vec2(textureSize(shadowMap, 0));
    for(int x = -1; x <= 1; ++x)
    {
        for(int y = -1; y <= 1; ++y)
        {
            float pcfDepth = texture(shadowMap, projCoords.xy + vec2(x, y) * texelSize).r; 
            shadow += currentDepth - bias > pcfDepth  ? 1.0 : 0.0;        
        }    
    }
    shadow /= 9.0;
    
    // keep the shadow at 0.0 when outside the far_plane region of the light's frustum.
    if(projCoords.z > 1.0)
        shadow = 0.0;
        
    return shadow;
}

void main()
{
    // Ambient
    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * lightColor;

    // Diffuse
    vec3 norm = normalize(normal);
    vec3 lightDir = normalize(lightPos - fragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;

    // Specular
    float specularStrength = 0.5;
    vec3 viewDir = normalize(viewPos - fragPos);
    vec3 halfWay = normalize(lightDir + viewDir);
    float specularIntensity = dot(normal, halfWay);

    specularIntensity = pow(max(specularIntensity, 0.0), 32.0);
    vec3 specular = (specularStrength * specularIntensity) * lightColor;

    // Shadow
    float shadow = shadowCalculation(fragPosLightSpace);

    vec3 result = (ambient + (1.0 - shadow) * (diffuse + specular));// * outColor;
    
    //fragColor = vec4(result, 1.0f);
    fragColor = texture(ourTexture, texCoord) * vec4(result, 1.0f);

    // vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    // projCoords = projCoords * 0.5 + 0.5;
    // fragColor = vec4(vec3(texture(shadowMap, projCoords.xy).r), 1.0);
}