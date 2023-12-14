#version 300 es
precision mediump float;

uniform float u_time;
uniform vec3 lightPos;
uniform vec3 lightColor;
uniform vec3 viewPos;
// uniform sampler2D ourTexture;
uniform samplerCube ourTexture;

in vec3 outColor;
in vec3 texCoord;
in vec3 normal;
in vec3 fragPos;

out vec4 fragColor;

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

    vec3 result = (ambient + diffuse + specular);// * outColor;
    //fragColor = vec4(result, 1.0f);
    fragColor = texture(ourTexture, texCoord) * vec4(result, 1.0f);
}