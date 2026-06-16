/* eslint-disable */
import React, { useEffect, useRef } from 'react';

interface Pointer {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  moved: boolean;
  color: { r: number; g: number; b: number };
}

interface SmokeCanvasProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function SmokeCanvas({ containerRef }: SmokeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animationFrameId: number;

    const config = {
      SIM_RESOLUTION: 120,
      DYE_RESOLUTION: 600,
      DENSITY_DISSIPATION: 1.55,
      VELOCITY_DISSIPATION: 1.05,
      PRESSURE: 0.20,
      PRESSURE_ITERATIONS: 38,
      CURL: 28.5,
      SPLAT_RADIUS: 0.30,
      SPLAT_FORCE: 4300,
      SHADING: true,
    };

    const NORMAL_DISSIPATION = 1.55;
    const NORMAL_VEL_DISSIPATION = 1.05;
    const FAST_DISSIPATION = 6.0;
    const FAST_VEL_DISSIPATION = 3.0;

    const pointers: Pointer[] = [{
      id: -1,
      texcoordX: 0,
      texcoordY: 0,
      prevTexcoordX: 0,
      prevTexcoordY: 0,
      deltaX: 0,
      deltaY: 0,
      moved: false,
      color: { r: 0.5, g: 0.5, b: 0.5 },
    }];

    let mouseInsideHero = false;

    // --- WebGL context and setup ---
    const getWebGLContext = (canvasElement: HTMLCanvasElement) => {
      const params = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
      };
      let gl = canvasElement.getContext('webgl2', params) as WebGL2RenderingContext | null;
      const isWebGL2 = !!gl;
      if (!isWebGL2) {
        gl = (canvasElement.getContext('webgl', params) || canvasElement.getContext('experimental-webgl', params)) as any;
      }

      if (!gl) return { gl: null, ext: { supportLinearFiltering: false, halfFloatTexType: 0, formatRGBA: null, formatRG: null, formatR: null } };

      let halfFloat: any, supportLinearFiltering: any;
      if (isWebGL2) {
        gl.getExtension('EXT_color_buffer_float');
        supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
      } else {
        halfFloat = (gl as any).getExtension('OES_texture_half_float');
        supportLinearFiltering = (gl as any).getExtension('OES_texture_half_float_linear');
      }
      gl.clearColor(0, 0, 0, 0);

      const halfFloatTexType = isWebGL2 ? (gl as any).HALF_FLOAT : halfFloat?.HALF_FLOAT_OES;
      let formatRGBA: any, formatRG: any, formatR: any;

      if (isWebGL2) {
        formatRGBA = getSupportedFormat(gl, (gl as any).RGBA16F, (gl as any).RGBA, halfFloatTexType, !!supportLinearFiltering);
        formatRG   = getSupportedFormat(gl, (gl as any).RG16F,   (gl as any).RG,   halfFloatTexType, !!supportLinearFiltering);
        formatR    = getSupportedFormat(gl, (gl as any).R16F,    (gl as any).RED,  halfFloatTexType, !!supportLinearFiltering);
      } else {
        formatRGBA = getSupportedFormat(gl, (gl as any).RGBA, (gl as any).RGBA, halfFloatTexType, !!supportLinearFiltering);
        formatRG   = getSupportedFormat(gl, (gl as any).RGBA, (gl as any).RGBA, halfFloatTexType, !!supportLinearFiltering);
        formatR    = getSupportedFormat(gl, (gl as any).RGBA, (gl as any).RGBA, halfFloatTexType, !!supportLinearFiltering);
      }

      return {
        gl,
        ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering: !!supportLinearFiltering,
        },
      };
    };

    function getSupportedFormat(gl: any, internalFormat: number, format: number, type: number, supportLinearFiltering: boolean): { internalFormat: number; format: number } | null {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        switch (internalFormat) {
          case gl.R16F:  return getSupportedFormat(gl, gl.RG16F, gl.RG, type, supportLinearFiltering);
          case gl.RG16F: return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type, supportLinearFiltering);
          default: return null;
        }
      }
      return { internalFormat, format };
    }

    function supportRenderTextureFormat(gl: any, internalFormat: number, format: number, type: number): boolean {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;

      // immediate cleanup of temporary test assets
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fbo);
      gl.deleteTexture(texture);

      return status;
    }

    const { gl, ext } = getWebGLContext(canvas);
    if (!gl) {
      console.warn("WebGL/WebGL2 not supported on this device/browser.");
      return;
    }

    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 512;
      config.SHADING = false;
    }

    // List of resources to delete upon unbinding
    const shadersCreated: WebGLShader[] = [];
    const programsCreated: WebGLProgram[] = [];
    const texturesCreated: WebGLTexture[] = [];
    const framebuffersCreated: WebGLFramebuffer[] = [];
    const buffersCreated: WebGLBuffer[] = [];

    function trackShader(shader: WebGLShader) {
      shadersCreated.push(shader);
      return shader;
    }

    function trackProgram(prog: WebGLProgram) {
      programsCreated.push(prog);
      return prog;
    }

    function resizeCanvasToHero() {
      const rect = container.getBoundingClientRect();
      const pr = window.devicePixelRatio || 1;
      const w = Math.max(2, Math.floor(rect.width * pr));
      const h = Math.max(2, Math.floor(rect.height * pr));

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        return true;
      }
      return false;
    }

    // Material system
    class Material {
      vertexShader: WebGLShader;
      fragmentShaderSource: string;
      programs: Record<number, WebGLProgram>;
      activeProgram: WebGLProgram | null;
      uniforms: Record<string, WebGLUniformLocation | null>;

      constructor(vertexShader: WebGLShader, fragmentShaderSource: string) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
        this.programs = {};
        this.activeProgram = null;
        this.uniforms = {};
      }
      setKeywords(keywords: string[]) {
        let hash = 0;
        for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]);
        let program = this.programs[hash];
        if (!program) {
          const frag = compileShader(gl!.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
          program = createProgram(this.vertexShader, frag);
          this.programs[hash] = program;
        }
        if (program === this.activeProgram) return;
        this.uniforms = getUniforms(program);
        this.activeProgram = program;
      }
      bind() {
        gl!.useProgram(this.activeProgram);
      }
    }

    class Program {
      program: WebGLProgram;
      uniforms: Record<string, WebGLUniformLocation | null>;

      constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.program = createProgram(vertexShader, fragmentShader);
        this.uniforms = getUniforms(this.program);
      }
      bind() {
        gl!.useProgram(this.program);
      }
    }

    function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      const p = gl!.createProgram();
      if (!p) throw new Error("Could not create dynamic program");
      gl!.attachShader(p, vertexShader);
      gl!.attachShader(p, fragmentShader);
      gl!.linkProgram(p);
      if (!gl!.getProgramParameter(p, gl!.LINK_STATUS)) {
        console.error(gl!.getProgramInfoLog(p));
      }
      trackProgram(p);
      return p;
    }

    function getUniforms(p: WebGLProgram) {
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const count = gl!.getProgramParameter(p, gl!.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const info = gl!.getActiveUniform(p, i);
        if (info) {
          uniforms[info.name] = gl!.getUniformLocation(p, info.name);
        }
      }
      return uniforms;
    }

    function compileShader(type: number, source: string, keywords?: string[]) {
      source = addKeywords(source, keywords);
      const shader = gl!.createShader(type);
      if (!shader) throw new Error("Could not create WebGL shader");
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(shader));
      }
      trackShader(shader);
      return shader;
    }

    function addKeywords(source: string, keywords?: string[]) {
      if (!keywords) return source;
      return keywords.map(k => `#define ${k}\n`).join('') + source;
    }

    function hashCode(s: string) {
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    }

    // --- Vertex and Fragment Shader Sources ---
    const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main(){
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);

    const copyShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main(){ gl_FragColor = texture2D(uTexture, vUv); }
    `);

    const clearShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main(){ gl_FragColor = value * texture2D(uTexture, vUv); }
    `);

    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;

      void main(){
        vec3 c = texture2D(uTexture, vUv).rgb;

        #ifdef SHADING
          vec3 lc = texture2D(uTexture, vL).rgb;
          vec3 rc = texture2D(uTexture, vR).rgb;
          vec3 tc = texture2D(uTexture, vT).rgb;
          vec3 bc = texture2D(uTexture, vB).rgb;
          float dx = length(rc) - length(lc);
          float dy = length(tc) - length(bc);
          vec3 n = normalize(vec3(dx, dy, length(texelSize)));
          vec3 l = vec3(0.0, 0.0, 1.0);
          float diffuse = clamp(dot(n,l) + 0.72, 0.72, 1.0);
          c *= diffuse;
        #endif

        float maxC = max(c.r, max(c.g, c.b));
        float a = pow(maxC, 0.85) * 2.5; // Density
        a = clamp(a, 0.0, 1.0);
        
        // Recover pure hue so colors don't wash out or look muddy on white background
        vec3 pureColor = c / (maxC + 0.0001); 
        gl_FragColor = vec4(pureColor * a, a);
      }
    `;

    const splatShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main(){
        vec2 p = vUv - point;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p,p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `);

    const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;

      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a,b,fuv.x), mix(c,d,fuv.x), fuv.y);
      }

      void main(){
        #ifdef MANUAL_FILTERING
          vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
          vec4 result = bilerp(uSource, coord, dyeTexelSize);
        #else
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          vec4 result = texture2D(uSource, coord);
        #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }
    `, ext.supportLinearFiltering ? undefined : ['MANUAL_FILTERING']);

    const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main(){
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) L = -C.x;
        if (vR.x > 1.0) R = -C.x;
        if (vT.y > 1.0) T = -C.y;
        if (vB.y < 0.0) B = -C.y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `);

    const curlShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main(){
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `);

    const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main(){
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel += force * dt;
        vel = min(max(vel, -700.0), 700.0);
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }
    `);

    const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main(){
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `);

    const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main(){
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }
    `);

    // Blitting setups
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) throw new Error("Could not create WebGLBuffer");
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    buffersCreated.push(vertexBuffer);

    const indexBuffer = gl.createBuffer();
    if (!indexBuffer) throw new Error("Could not create WebGLBuffer");
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    buffersCreated.push(indexBuffer);

    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const blit = (target: any, clear = false) => {
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      if (clear) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };

    function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
      gl!.activeTexture(gl!.TEXTURE0);
      const tex = gl!.createTexture();
      if (!tex) throw new Error("Could not create dynamic texture");
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
      texturesCreated.push(tex);

      const fbo = gl!.createFramebuffer();
      if (!fbo) throw new Error("Could not create database FBO");
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0);
      gl!.viewport(0, 0, w, h);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      framebuffersCreated.push(fbo);

      return {
        texture: tex,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1.0 / w,
        texelSizeY: 1.0 / h,
        attach(id: number) {
          gl!.activeTexture(gl!.TEXTURE0 + id);
          gl!.bindTexture(gl!.TEXTURE_2D, tex);
          return id;
        },
      };
    }

    function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() { return fbo1; },
        set read(v) { fbo1 = v; },
        get write() { return fbo2; },
        set write(v) { fbo2 = v; },
        swap() {
          const t = fbo1;
          fbo1 = fbo2;
          for (let key in fbo2) {
            // keep structure updated
          }
          fbo2 = t;
        },
      };
    }

    function resizeFBO(target: any, w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
      const newFBO = createFBO(w, h, internalFormat, format, type, param);
      copyProgram.bind();
      gl!.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
      blit(newFBO);
      return newFBO;
    }

    function resizeDoubleFBO(target: any, w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
      if (target.width === w && target.height === h) return target;
      target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1.0 / w;
      target.texelSizeY = 1.0 / h;
      return target;
    }

    const copyProgram = new Program(baseVertexShader, copyShader);
    const clearProgram = new Program(baseVertexShader, clearShader);
    const splatProgram = new Program(baseVertexShader, splatShader);
    const advectionProgram = new Program(baseVertexShader, advectionShader);
    const divergenceProgram = new Program(baseVertexShader, divergenceShader);
    const curlProgram = new Program(baseVertexShader, curlShader);
    const vorticityProgram = new Program(baseVertexShader, vorticityShader);
    const pressureProgram = new Program(baseVertexShader, pressureShader);
    const gradientSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
    const displayMaterial = new Material(baseVertexShader, displayShaderSource);

    let dye: any;
    let velocity: any;
    let divergence: any;
    let curl: any;
    let pressure: any;

    function getResolution(resolution: number) {
      let aspect = gl!.drawingBufferWidth / gl!.drawingBufferHeight;
      if (aspect < 1) aspect = 1 / aspect;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspect);
      if (gl!.drawingBufferWidth > gl!.drawingBufferHeight) return { width: max, height: min };
      return { width: min, height: max };
    }

    function initFramebuffers() {
      const simRes = getResolution(config.SIM_RESOLUTION);
      const dyeRes = getResolution(config.DYE_RESOLUTION);

      const texType = ext.halfFloatTexType;
      const rgba = ext.formatRGBA;
      const rg = ext.formatRG;
      const r = ext.formatR;
      const filtering = ext.supportLinearFiltering ? gl!.LINEAR : gl!.NEAREST;

      gl!.disable(gl!.BLEND);

      dye = dye ? resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering)
                : createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);

      velocity = velocity ? resizeDoubleFBO(velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering)
                          : createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);

      divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl!.NEAREST);
      curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl!.NEAREST);
      pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl!.NEAREST);

      updateKeywords();
    }

    function updateKeywords() {
      const kw = [];
      if (config.SHADING) kw.push("SHADING");
      displayMaterial.setKeywords(kw);
    }

    // --- Soft Color Palette (Pink, Blue, Orange, Red) ---
    const palette = [
      { r: 1.0, g: 0.176, b: 0.49 },   // Pink
      { r: 0.435, g: 0.482, b: 1.0 },  // Blue
      { r: 1.0, g: 0.588, b: 0.196 },  // Orange
      { r: 1.0, g: 0.196, b: 0.196 },  // Red
    ];

    function pickColorSoft() {
      const c = palette[(Math.random() * palette.length) | 0];
      const strength = 0.7 + Math.random() * 0.3; // Increased strength for white background
      return { r: c.r * strength, g: c.g * strength, b: c.b * strength };
    }

    function correctRadius(radius: number) {
      let aspect = canvas!.width / canvas!.height;
      if (aspect > 1) radius *= aspect;
      return radius;
    }

    function splat(x: number, y: number, dx: number, dy: number, color: { r: number; g: number; b: number }) {
      splatProgram.bind();

      gl!.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl!.uniform1f(splatProgram.uniforms.aspectRatio, canvas!.width / canvas!.height);
      gl!.uniform2f(splatProgram.uniforms.point, x, y);
      gl!.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
      gl!.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100.0));
      blit(velocity.write);
      velocity.swap();

      gl!.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      gl!.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    }

    function step(dt: number) {
      gl!.disable(gl!.BLEND);

      curlProgram.bind();
      gl!.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      vorticityProgram.bind();
      gl!.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl!.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      gl!.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl!.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceProgram.bind();
      gl!.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearProgram.bind();
      gl!.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      gl!.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      pressureProgram.bind();
      gl!.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl!.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gradientSubtractProgram.bind();
      gl!.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      gl!.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      advectionProgram.bind();
      gl!.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (!ext.supportLinearFiltering) gl!.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      const velId = velocity.read.attach(0);
      gl!.uniform1i(advectionProgram.uniforms.uVelocity, velId);
      gl!.uniform1i(advectionProgram.uniforms.uSource, velId);
      gl!.uniform1f(advectionProgram.uniforms.dt, dt);
      gl!.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      if (!ext.supportLinearFiltering) gl!.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      gl!.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl!.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      gl!.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    function render() {
      gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
      gl!.enable(gl!.BLEND);

      displayMaterial.bind();
      if (config.SHADING) gl!.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / gl!.drawingBufferWidth, 1.0 / gl!.drawingBufferHeight);
      gl!.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
      blit(null);
    }

    function updatePointerMove(pointer: Pointer, clientX: number, clientY: number) {
      const rect = container!.getBoundingClientRect();
      const pr = window.devicePixelRatio || 1;

      const x = (clientX - rect.left) * pr;
      const y = (clientY - rect.top) * pr;

      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;

      pointer.texcoordX = x / canvas!.width;
      pointer.texcoordY = 1.0 - (y / canvas!.height);

      const dx = pointer.texcoordX - pointer.prevTexcoordX;
      const dy = pointer.texcoordY - pointer.prevTexcoordY;

      pointer.deltaX = dx;
      pointer.deltaY = dy;
      pointer.moved = (Math.abs(dx) + Math.abs(dy)) > 0.00002;
    }

    // --- Interactive Mouse Listeners attached directly to containers ---
    const handleMouseEnter = () => {
      mouseInsideHero = true;
      config.DENSITY_DISSIPATION = NORMAL_DISSIPATION;
      config.VELOCITY_DISSIPATION = NORMAL_VEL_DISSIPATION;
    };

    const handleMouseLeave = () => {
      mouseInsideHero = false;

      // fast fade-out so it does NOT keep burning in place
      config.DENSITY_DISSIPATION = FAST_DISSIPATION;
      config.VELOCITY_DISSIPATION = FAST_VEL_DISSIPATION;

      // reset pointer carry
      const p = pointers[0];
      p.moved = false;
      p.deltaX = 0;
      p.deltaY = 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseInsideHero) return;
      const p = pointers[0];
      updatePointerMove(p, e.clientX, e.clientY);

      if (p.moved) {
        const speed = Math.min(1.0, Math.sqrt(p.deltaX * p.deltaX + p.deltaY * p.deltaY) * 90.0);
        const force = config.SPLAT_FORCE * (0.35 + 0.65 * speed);
        const dx = p.deltaX * force;
        const dy = p.deltaY * force;
        const color = pickColorSoft();
        splat(p.texcoordX, p.texcoordY, dx, dy, color);
        p.moved = false;
      }
    };

    // Touch event helpers
    const handleTouchStart = (e: TouchEvent) => {
      if (e.targetTouches.length > 0) {
        handleMouseEnter();
        const touch = e.targetTouches[0];
        const p = pointers[0];
        updatePointerMove(p, touch.clientX, touch.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.targetTouches.length > 0) {
        const touch = e.targetTouches[0];
        const p = pointers[0];
        updatePointerMove(p, touch.clientX, touch.clientY);

        if (p.moved) {
          const speed = Math.min(1.0, Math.sqrt(p.deltaX * p.deltaX + p.deltaY * p.deltaY) * 90.0);
          const force = config.SPLAT_FORCE * (0.35 + 0.65 * speed);
          const dx = p.deltaX * force;
          const dy = p.deltaY * force;
          const color = pickColorSoft();
          splat(p.texcoordX, p.texcoordY, dx, dy, color);
          p.moved = false;
        }
      }
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousemove', handleMouseMove);

    // Support touch devices elegantly
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleMouseLeave);

    // --- Main loop logic ---
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.016, (now - last) / 1000);
      last = now;

      const resized = resizeCanvasToHero();
      if (resized) initFramebuffers();
      if (!dye) initFramebuffers();

      step(dt);
      render();

      animationFrameId = requestAnimationFrame(loop);
    };

    resizeCanvasToHero();
    initFramebuffers();
    animationFrameId = requestAnimationFrame(loop);

    const handleResize = () => {
      if (resizeCanvasToHero()) initFramebuffers();
    };
    window.addEventListener('resize', handleResize);

    // --- Strict WebGL Resource cleanup on component unmount ---
    return () => {
      cancelAnimationFrame(animationFrameId);

      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleMouseMove);

      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleMouseLeave);

      window.removeEventListener('resize', handleResize);

      // clean WebGL resources
      try {
        shadersCreated.forEach(s => gl.deleteShader(s));
        programsCreated.forEach(p => gl.deleteProgram(p));
        texturesCreated.forEach(t => gl.deleteTexture(t));
        framebuffersCreated.forEach(f => gl.deleteFramebuffer(f));
        buffersCreated.forEach(b => gl.deleteBuffer(b));
      } catch (err) {
        console.warn("Exception during WebGL cleanup: ", err);
      }
    };
  }, [containerRef]);

  return (
    <canvas
      id="fluid"
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none smoke-canvas"
      style={{ display: 'block' }}
    />
  );
}
