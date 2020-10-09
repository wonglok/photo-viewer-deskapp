// import { ShaderChunk } from 'three/src/renderers/shaders/ShaderLib'
import { mergeUniforms } from 'three/src/renderers/shaders/UniformsUtils.js'
import { UniformsLib } from 'three/src/renderers/shaders/UniformsLib.js'
import { ShaderMaterial } from 'three'

let glsl = (v, ...args) => {
  let str = ''
  v.forEach((e, i) => {
    str += e + (args[i] || '')
  })
  return str
}

export class EnvMapMatCapMaterial extends ShaderMaterial {
  constructor ({ ...props }) {
    super({
      uniforms: mergeUniforms( [
        UniformsLib.common,
        UniformsLib.bumpmap,
        UniformsLib.normalmap,
        UniformsLib.displacementmap,
        UniformsLib.fog,
        {
          matcap: { value: null }
        }
      ] ),
      vertexShader: EnvMapMatCapMaterial.vertexShader,
      fragmentShader: EnvMapMatCapMaterial.fragmentShader
    })
    this.uniforms.matcap = { value: props.matcap }
    this.uniforms.tCube = { value: props.tCube }
  }
  get tCube () {
    return this.uniforms.tCube.value
  }
  set tCube (v) {
    this.uniforms.tCube.value = v
  }
  get matcap () {
    return this.uniforms.matcap.value
  }
  set matcap (v) {
    this.uniforms.matcap.value = v
  }
  static vertexShader = glsl`
    #define MATCAP
    varying vec3 vViewPosition;
    #ifndef FLAT_SHADED
      varying vec3 vNormal;
    #endif
    #include <common>
    #include <uv_pars_vertex>
    #include <color_pars_vertex>
    #include <displacementmap_pars_vertex>
    #include <fog_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>

    varying vec3 vReflect;
    varying vec3 vRefract[3];
    varying float vReflectionFactor;
    // uniform sampler2D tCube;

    void main() {
      #include <uv_vertex>
      #include <color_vertex>
      #include <beginnormal_vertex>
      #include <morphnormal_vertex>
      #include <skinbase_vertex>
      #include <skinnormal_vertex>
      #include <defaultnormal_vertex>
      #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED
        vNormal = normalize( transformedNormal );
      #endif
      #include <begin_vertex>

      #include <worldpos_vertex>

      #include <morphtarget_vertex>
      #include <skinning_vertex>
      #include <displacementmap_vertex>
      #include <project_vertex>
      #include <logdepthbuf_vertex>
      #include <clipping_planes_vertex>
      #include <fog_vertex>
      vViewPosition = - mvPosition.xyz;


      float mFresnelBias = 0.1;
      float mRefractionRatio = 1.02;
      float mFresnelPower = 0.7;
      float mFresnelScale = 0.6;

      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
      vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

      vec3 I = worldPosition.xyz - cameraPosition;

      vReflect = reflect( I, worldNormal );
      vRefract[0] = refract( normalize( I ), worldNormal, mRefractionRatio );
      vRefract[1] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.99 );
      vRefract[2] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.98 );


      vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );
    }
  `
  static fragmentShader = glsl`
    #define MATCAP
    uniform vec3 diffuse;
    uniform float opacity;
    uniform sampler2D matcap;
    varying vec3 vViewPosition;
    #ifndef FLAT_SHADED
      varying vec3 vNormal;
    #endif
    #include <common>
    #include <dithering_pars_fragment>
    #include <color_pars_fragment>
    #include <uv_pars_fragment>
    #include <map_pars_fragment>
    #include <alphamap_pars_fragment>
    #include <fog_pars_fragment>
    #include <bumpmap_pars_fragment>
    #include <normalmap_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    #include <clipping_planes_pars_fragment>

    varying vec3 vReflect;
    varying vec3 vRefract[3];
    varying float vReflectionFactor;
    // varying vec2 vUv;
    uniform samplerCube tCube;

    void main() {
      #include <clipping_planes_fragment>
      vec4 diffuseColor = vec4( diffuse, opacity );
      #include <logdepthbuf_fragment>
      #include <map_fragment>
      #include <color_fragment>
      #include <alphamap_fragment>
      #include <alphatest_fragment>
      #include <normal_fragment_begin>
      #include <normal_fragment_maps>
      vec3 viewDir = normalize( vViewPosition );
      vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
      vec3 y = cross( viewDir, x );
      vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks
      #ifdef USE_MATCAP
        vec4 matcapColor = texture2D( matcap, uv );

        matcapColor = matcapTexelToLinear( matcapColor );
      #else
        vec4 matcapColor = vec4( 1.0 );
      #endif

      vec3 tRefract0 = vRefract[0];
      vec3 tRefract1 = vRefract[1];
      vec3 tRefract2 = vRefract[2];
      vec4 reflectedColor = textureCube( tCube, vec3( vReflect.x, vReflect.y, vReflect.z ) );
      vec4 refractedColor = vec4(1.0);

      refractedColor.r = textureCube( tCube, vec3( tRefract0.x, tRefract0.yz ) ).r;
      refractedColor.g = textureCube( tCube, vec3( tRefract1.x, tRefract1.yz ) ).g;
      refractedColor.b = textureCube( tCube, vec3( tRefract2.x, tRefract2.yz ) ).b;

      vec4 outColor = mix( reflectedColor, refractedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );

      vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb * outColor.rgb;

      gl_FragColor = vec4( outgoingLight, diffuseColor.a );
      #include <tonemapping_fragment>
      #include <encodings_fragment>
      #include <fog_fragment>
      #include <premultiplied_alpha_fragment>
      #include <dithering_fragment>
    }
  `
}