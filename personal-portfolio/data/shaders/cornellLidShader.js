export const cornellLidVertexShader = `varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUV;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  vUV = uv;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export const cornellLidFragShader = `uniform samplerCube envMap;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float mixRatio;
uniform float time;
uniform float refractionRatio;
uniform float fresnelPower;
uniform float glossiness;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUV;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(-vPosition);
  
  vec3 reflectDir = reflect(viewDir, normal);
  vec3 envColor = textureCube(envMap, reflectDir).rgb;
  vec3 refractDir = refract(viewDir, normal, refractionRatio);
  vec3 refractColor = textureCube(envMap, refractDir).rgb;
  
  // Gem effect with fresnel (reflect + refracty thingie)
  float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), fresnelPower);
  vec3 combinedColor = mix(refractColor, envColor, fresnel);
  
  vec4 tex1 = texture2D(texture1, vUV);
  vec4 tex2 = texture2D(texture2, vUV);
  vec3 mixedTex = mix(tex1.rgb, tex2.rgb, mixRatio);
  
  // Combine environment and texture
  vec3 finalColor = 10.0 * combinedColor * mixedTex.rgb * mixedTex.rgb + 0.2 * mixedTex.rgb;
  
  // Specular Highlights
  float spec = pow(max(dot(normal, vec3(1.0,0.5,0)), 0.0), glossiness);
  finalColor += vec3(1.0) * spec;
  
  gl_FragColor = vec4(finalColor, 1.0);
}`;