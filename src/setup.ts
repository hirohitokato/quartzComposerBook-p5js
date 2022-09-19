import p5 from "p5";
import { Transformation3D } from "./quartz-composer/consumer/3d-transformation";
import { Gradient, GradientDirection } from "./quartz-composer/consumer/gradient";
import { Sprite } from "./quartz-composer/consumer/sprite";
import { Consumer } from "./quartz-composer/core/consumer";
import { Provider } from "./quartz-composer/core/provider";
import { Image } from "./quartz-composer/provider/image";
import { Interpolation } from "./quartz-composer/provider/interpolation";
import { WaveGenerator, WaveType } from "./quartz-composer/provider/lfo";

export let images: { [name: string]: Image } = {};
export let providers: Provider[] = [];
export let consumers: Consumer[] = [];

export const preload = (p: p5): void => {
  console.log("preload");
  images["volvox"] = new Image(p, "assets/chapter2/basic_01/volvox.png");
};

export let shader: p5.Shader;

/** This is a setup function. */
export const setup = (p: p5): void => {
  console.log("setup");

  p.createCanvas(800, 600, p.WEBGL) as any;

  p.noStroke();
  p.setAttributes("preserveDrawingBuffer", true);
  p.setAttributes("premultipliedAlpha", false);
  p.setAttributes("alpha", true);
  shader = p.createShader(vert, frag);

  let gradient_background = new Gradient(p);
  gradient_background.layer = 0;
  gradient_background.color1.setDefaultValue(p.color(134, 148, 150));
  gradient_background.color2.setDefaultValue(p.color(32, 56, 56));
  gradient_background.color3.setDefaultValue(p.color(0));
  gradient_background.direction = GradientDirection.Vertical_UpsideDown;

  let volvox = new Sprite(p);
  volvox.layer = 0;
  volvox.image.bind(images["volvox"]!.image);
  volvox.xPosition.setDefaultValue(100);

  let group = new Transformation3D(p);
  group.layer = 1;
  group.addConsumer(volvox);

  consumers.push(gradient_background, group);

  let lfo_x = new WaveGenerator(p);
  lfo_x.type.setDefaultValue(WaveType.Sin);
  lfo_x.period.setDefaultValue(10);
  lfo_x.amplitude.setDefaultValue(0.5);
  volvox.xPosition.bind(lfo_x.result);
  providers.push(lfo_x);

  let lfo_y = new WaveGenerator(p);
  lfo_y.type.setDefaultValue(WaveType.Cos);
  lfo_y.period.setDefaultValue(10);
  lfo_y.amplitude.setDefaultValue(0.5);
  volvox.yPosition.bind(lfo_y.result);
  providers.push(lfo_y);

  let lfo_wh = new WaveGenerator(p);
  lfo_wh.type.setDefaultValue(WaveType.Sin);
  lfo_wh.period.setDefaultValue(0.1);
  lfo_wh.amplitude.setDefaultValue(0.01);
  lfo_wh.offset.setDefaultValue(0.8);
  volvox.widthScale.bind(lfo_wh.result);
  volvox.heightScale.bind(lfo_wh.result);
  providers.push(lfo_wh);

  let interpolation = new Interpolation(p);
  interpolation.startValue.setDefaultValue(0);
  interpolation.endValue.setDefaultValue(360);
  interpolation.duration.setDefaultValue(20);
  volvox.zRotation.bind(interpolation.result);
  providers.push(interpolation);
};

let vert = `
precision highp float;
precision highp int;

uniform mat4 uViewMatrix;

uniform bool uUseLighting;

uniform int uAmbientLightCount;
uniform vec3 uAmbientColor[5];

uniform int uDirectionalLightCount;
uniform vec3 uLightingDirection[5];
uniform vec3 uDirectionalDiffuseColors[5];
uniform vec3 uDirectionalSpecularColors[5];

uniform int uPointLightCount;
uniform vec3 uPointLightLocation[5];
uniform vec3 uPointLightDiffuseColors[5];	
uniform vec3 uPointLightSpecularColors[5];

uniform int uSpotLightCount;
uniform float uSpotLightAngle[5];
uniform float uSpotLightConc[5];
uniform vec3 uSpotLightDiffuseColors[5];
uniform vec3 uSpotLightSpecularColors[5];
uniform vec3 uSpotLightLocation[5];
uniform vec3 uSpotLightDirection[5];

uniform bool uSpecular;
uniform float uShininess;

uniform float uConstantAttenuation;
uniform float uLinearAttenuation;
uniform float uQuadraticAttenuation;

const float specularFactor = 2.0;
const float diffuseFactor = 0.73;

struct LightResult {
  float specular;
  float diffuse;
};

float _phongSpecular(
  vec3 lightDirection,
  vec3 viewDirection,
  vec3 surfaceNormal,
  float shininess) {

  vec3 R = reflect(lightDirection, surfaceNormal);
  return pow(max(0.0, dot(R, viewDirection)), shininess);
}

float _lambertDiffuse(vec3 lightDirection, vec3 surfaceNormal) {
  return max(0.0, dot(-lightDirection, surfaceNormal));
}

LightResult _light(vec3 viewDirection, vec3 normal, vec3 lightVector) {

  vec3 lightDir = normalize(lightVector);

  //compute our diffuse & specular terms
  LightResult lr;
  if (uSpecular)
    lr.specular = _phongSpecular(lightDir, viewDirection, normal, uShininess);
  lr.diffuse = _lambertDiffuse(lightDir, normal);
  return lr;
}

void totalLight(
  vec3 modelPosition,
  vec3 normal,
  out vec3 totalDiffuse,
  out vec3 totalSpecular
) {

  totalSpecular = vec3(0.0);

  if (!uUseLighting) {
    totalDiffuse = vec3(1.0);
    return;
  }

  totalDiffuse = vec3(0.0);

  vec3 viewDirection = normalize(-modelPosition);

  for (int j = 0; j < 5; j++) {
    if (j < uDirectionalLightCount) {
      vec3 lightVector = (uViewMatrix * vec4(uLightingDirection[j], 0.0)).xyz;
      vec3 lightColor = uDirectionalDiffuseColors[j];
      vec3 specularColor = uDirectionalSpecularColors[j];
      LightResult result = _light(viewDirection, normal, lightVector);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * lightColor * specularColor;
    }

    if (j < uPointLightCount) {
      vec3 lightPosition = (uViewMatrix * vec4(uPointLightLocation[j], 1.0)).xyz;
      vec3 lightVector = modelPosition - lightPosition;
    
      //calculate attenuation
      float lightDistance = length(lightVector);
      float lightFalloff = 1.0 / (uConstantAttenuation + lightDistance * uLinearAttenuation + (lightDistance * lightDistance) * uQuadraticAttenuation);
      vec3 lightColor = lightFalloff * uPointLightDiffuseColors[j];
      vec3 specularColor = lightFalloff * uPointLightSpecularColors[j];

      LightResult result = _light(viewDirection, normal, lightVector);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * lightColor * specularColor;
    }

    if(j < uSpotLightCount) {
      vec3 lightPosition = (uViewMatrix * vec4(uSpotLightLocation[j], 1.0)).xyz;
      vec3 lightVector = modelPosition - lightPosition;
    
      float lightDistance = length(lightVector);
      float lightFalloff = 1.0 / (uConstantAttenuation + lightDistance * uLinearAttenuation + (lightDistance * lightDistance) * uQuadraticAttenuation);

      vec3 lightDirection = (uViewMatrix * vec4(uSpotLightDirection[j], 0.0)).xyz;
      float spotDot = dot(normalize(lightVector), normalize(lightDirection));
      float spotFalloff;
      if(spotDot < uSpotLightAngle[j]) {
        spotFalloff = 0.0;
      }
      else {
        spotFalloff = pow(spotDot, uSpotLightConc[j]);
      }
      lightFalloff *= spotFalloff;

      vec3 lightColor = uSpotLightDiffuseColors[j];
      vec3 specularColor = uSpotLightSpecularColors[j];
     
      LightResult result = _light(viewDirection, normal, lightVector);
      
      totalDiffuse += result.diffuse * lightColor * lightFalloff;
      totalSpecular += result.specular * lightColor * specularColor * lightFalloff;
    }
  }

  totalDiffuse *= diffuseFactor;
  totalSpecular *= specularFactor;
}

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

varying highp vec2 vVertTexCoord;
varying vec3 vDiffuseColor;
varying vec3 vSpecularColor;

void main(void) {

  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * viewModelPosition;

  vec3 vertexNormal = normalize(uNormalMatrix * aNormal);
  vVertTexCoord = aTexCoord;

  totalLight(viewModelPosition.xyz, vertexNormal, vDiffuseColor, vSpecularColor);

  for (int i = 0; i < 8; i++) {
    if (i < uAmbientLightCount) {
      vDiffuseColor += uAmbientColor[i];
    }
  }
}`;

let frag = `
precision highp float;

uniform vec4 uMaterialColor;
uniform vec4 uTint;
uniform sampler2D uSampler;
uniform bool isTexture;
uniform bool uEmissive;

varying highp vec2 vVertTexCoord;
varying vec3 vDiffuseColor;
varying vec3 vSpecularColor;

void main(void) {
  if(uEmissive && !isTexture) {
    gl_FragColor = uMaterialColor;
  }
  else {
    gl_FragColor = isTexture ? texture2D(uSampler, vVertTexCoord) * (uTint / vec4(255, 255, 255, 255)) : uMaterialColor;
    gl_FragColor.rgb = gl_FragColor.rgb * vDiffuseColor + vSpecularColor;
  }

  if (gl_FragColor.a == 0.0) {
    discard;
  }
}`;
