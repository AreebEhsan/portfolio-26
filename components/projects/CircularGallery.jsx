"use client";

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef } from "react";

import "./CircularGallery.css";

/*
 * Vendored from React Bits (CircularGallery, JS + CSS variant).
 *
 * The rendering core — bend maths, ripple vertex shader, rounded-box SDF
 * fragment shader, infinite wrap — is unchanged. The event and lifecycle layer
 * is deliberately rewritten, because the upstream version binds to `window`:
 *
 *   - `wheel` on window meant any scroll anywhere on the page spun the
 *     gallery. On a single-page portfolio with eight sections, simply scrolling
 *     past this section scrambled it.
 *   - `mousedown/mousemove/mouseup` and `touchstart/touchmove/touchend` on
 *     window meant a drag or swipe anywhere on the page — including text
 *     selection in another section — dragged the gallery.
 *   - The rAF loop ran for the lifetime of the page, rendering WebGL even when
 *     the section was far off-screen or the tab was hidden.
 *
 * Fixes here: pointer and wheel input are scoped to the container; touch locks
 * to the dominant axis on first move so vertical page scrolling still works;
 * rendering pauses when off-screen or hidden; fonts are taken from the host
 * page instead of being fetched from Google.
 */

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function getFontSize(font) {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function createTextTexture(gl, text, font = "bold 30px monospace", color = "black") {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(getFontSize(font) * 1.2);
  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  constructor({ gl, plane, text, textColor = "#545050", font = "30px sans-serif" }) {
    this.gl = gl;
    this.plane = plane;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor,
    );
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = this.plane.scale.y * 0.15;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.05;
    this.mesh.setParent(this.plane);
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
    textureCache,
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.textureCache = textureCache;
    this.createShader();
    this.createMesh();
    // The card face already carries the project title, so a caption mesh would
    // just duplicate it. Callers opt in by passing a non-empty label.
    if (this.text) this.createTitle();
    this.onResize();
  }

  createShader() {
    // The gallery duplicates its item list to fake an infinite loop, so every
    // texture is requested twice. Sharing the GPU upload between the two halves
    // halves both VRAM and decode work.
    let entry = this.textureCache.get(this.image);
    if (!entry) {
      const texture = new Texture(this.gl, { generateMipmaps: true });
      entry = { texture, size: null, waiting: [] };
      this.textureCache.set(this.image, entry);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.onload = () => {
        texture.image = img;
        entry.size = [img.naturalWidth, img.naturalHeight];
        entry.waiting.forEach((program) => {
          program.uniforms.uImageSizes.value = entry.size;
        });
        entry.waiting.length = 0;
      };
      img.src = this.image;
    }

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);

          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);

          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);

          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: entry.texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: entry.size ?? [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });

    if (!entry.size) entry.waiting.push(this.program);
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    });
  }

  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [
          this.viewport.width,
          this.viewport.height,
        ];
      }
    }
    this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  constructor(
    container,
    {
      items,
      bend = 3,
      textColor = "#ffffff",
      borderRadius = 0,
      font = "bold 30px sans-serif",
      scrollSpeed = 2,
      scrollEase = 0.05,
      onActiveChange,
    } = {},
  ) {
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0, position: 0 };
    this.onActiveChange = onActiveChange;
    this.activeIndex = -1;
    this.itemCount = items?.length ?? 0;
    this.textureCache = new Map();
    this.running = false;
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.addEventListeners();
    // With an IntersectionObserver attached, inView starts false and the
    // observer's first callback decides — so an off-screen gallery renders zero
    // frames. Only start eagerly when there is no observer to defer to.
    if (this.inView) this.start();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
  }

  createMedias(items, bend, textColor, borderRadius, font) {
    const galleryItems = items && items.length ? items : [];
    // Duplicated so the strip can wrap seamlessly in both directions.
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
        textureCache: this.textureCache,
      });
    });
  }

  /* ----- input, scoped to the container ----- */

  onPointerDown(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    this.isDown = true;
    this.axis = e.pointerType === "mouse" ? "x" : null;
    this.scroll.position = this.scroll.current;
    this.startX = e.clientX;
    this.startY = e.clientY;
    try {
      this.container.setPointerCapture?.(e.pointerId);
    } catch {
      // Capture is an optimisation for drags that leave the element, not a
      // requirement.
    }
  }

  onPointerMove(e) {
    if (!this.isDown) return;

    // Touch and pen: decide on first movement whether this gesture belongs to
    // the gallery or to the page. Without this, any vertical swipe starting on
    // the canvas would drag the gallery sideways and fight the page scroll.
    if (this.axis === null) {
      const dx = Math.abs(e.clientX - this.startX);
      const dy = Math.abs(e.clientY - this.startY);
      if (dx < 6 && dy < 6) return;
      this.axis = dx > dy ? "x" : "y";
    }
    if (this.axis === "y") return;

    if (e.cancelable) e.preventDefault();
    const distance = (this.startX - e.clientX) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }

  onPointerUp(e) {
    if (!this.isDown) return;
    this.isDown = false;
    this.axis = null;
    try {
      // A pointercancel (the browser taking over for a scroll) has already
      // released capture, and releasing twice throws.
      if (e?.pointerId != null) this.container.releasePointerCapture?.(e.pointerId);
    } catch {
      // Already released.
    }
    this.onCheck();
  }

  onWheel(e) {
    // Horizontal intent only. Upstream advanced the strip on vertical wheel
    // too, which meant that on a scrolling page the gallery lurched every time
    // the cursor happened to be over it — the section occupies most of the
    // viewport, so that is most of the time. Vertical wheel belongs to the page.
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || !e.deltaX) return;
    if (e.cancelable) e.preventDefault();
    this.scroll.target += (e.deltaX > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }

  onKeyDown(e) {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        this.scroll.target += this.medias?.[0]?.width ?? this.scrollSpeed * 5;
        this.onCheckDebounce();
        break;
      case "ArrowLeft":
        e.preventDefault();
        this.scroll.target -= this.medias?.[0]?.width ?? this.scrollSpeed * 5;
        this.onCheckDebounce();
        break;
      case "Home":
        e.preventDefault();
        this.scroll.target = 0;
        this.onCheckDebounce();
        break;
      default:
        break;
    }
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
    this.reportActive(itemIndex);
  }

  /** Publishes which project is centred, so the page can label it in the DOM. */
  reportActive(rawIndex) {
    if (!this.itemCount || !this.onActiveChange) return;
    const normalised = ((rawIndex % this.itemCount) + this.itemCount) % this.itemCount;
    if (normalised === this.activeIndex) return;
    this.activeIndex = normalised;
    this.onActiveChange(normalised);
  }

  onResize() {
    // Never leave screen/viewport undefined: onResize runs once before the
    // medias exist, and if the container had no layout yet (hidden, or measured
    // before paint) an early return would leave Media.onResize dereferencing
    // undefined. Degenerate 1x1 is harmless — the ResizeObserver corrects it as
    // soon as real dimensions land.
    const width = this.container.clientWidth || 1;
    const height = this.container.clientHeight || 1;

    this.screen = { width, height };
    this.renderer.setSize(width, height);
    this.camera.perspective({ aspect: width / height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const viewportHeight = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const viewportWidth = viewportHeight * this.camera.aspect;
    this.viewport = { width: viewportWidth, height: viewportHeight };
    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport }),
      );
    }
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.boundUpdate);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.raf = window.requestAnimationFrame(this.boundUpdate);
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    window.cancelAnimationFrame(this.raf);
  }

  addEventListeners() {
    this.boundUpdate = this.update.bind(this);
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnPointerDown = this.onPointerDown.bind(this);
    this.boundOnPointerMove = this.onPointerMove.bind(this);
    this.boundOnPointerUp = this.onPointerUp.bind(this);
    this.boundOnKeyDown = this.onKeyDown.bind(this);
    this.boundOnVisibility = () => {
      if (document.hidden) this.stop();
      else if (this.inView) this.start();
    };

    window.addEventListener("resize", this.boundOnResize);
    document.addEventListener("visibilitychange", this.boundOnVisibility);

    this.container.addEventListener("wheel", this.boundOnWheel, { passive: false });
    this.container.addEventListener("pointerdown", this.boundOnPointerDown);
    this.container.addEventListener("pointermove", this.boundOnPointerMove, {
      passive: false,
    });
    this.container.addEventListener("pointerup", this.boundOnPointerUp);
    this.container.addEventListener("pointercancel", this.boundOnPointerUp);
    this.container.addEventListener("keydown", this.boundOnKeyDown);

    // Keeps the container sized correctly inside a responsive layout without
    // relying on window resize alone.
    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(this.boundOnResize);
      this.resizeObserver.observe(this.container);
    }

    // Render only while the section is actually on screen.
    if ("IntersectionObserver" in window) {
      this.inView = false;
      this.intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          this.inView = entry.isIntersecting;
          if (this.inView && !document.hidden) this.start();
          else this.stop();
        },
        { rootMargin: "200px 0px" },
      );
      this.intersectionObserver.observe(this.container);
    } else {
      this.inView = true;
    }
  }

  destroy() {
    this.stop();

    window.removeEventListener("resize", this.boundOnResize);
    document.removeEventListener("visibilitychange", this.boundOnVisibility);

    this.container.removeEventListener("wheel", this.boundOnWheel);
    this.container.removeEventListener("pointerdown", this.boundOnPointerDown);
    this.container.removeEventListener("pointermove", this.boundOnPointerMove);
    this.container.removeEventListener("pointerup", this.boundOnPointerUp);
    this.container.removeEventListener("pointercancel", this.boundOnPointerUp);
    this.container.removeEventListener("keydown", this.boundOnKeyDown);

    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();

    const canvas = this.renderer?.gl?.canvas;
    if (canvas?.parentNode) canvas.parentNode.removeChild(canvas);

    // Release the GPU context explicitly — React Strict Mode mounts effects
    // twice in development, and browsers cap live WebGL contexts.
    this.renderer?.gl?.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = "600 30px Geist, system-ui, sans-serif",
  scrollSpeed = 2,
  scrollEase = 0.05,
  onActiveChange,
  ariaLabel = "Project gallery. Use left and right arrow keys to browse.",
}) {
  const containerRef = useRef(null);
  const activeChangeRef = useRef(onActiveChange);

  useEffect(() => {
    activeChangeRef.current = onActiveChange;
  }, [onActiveChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !items?.length) return;

    let app;
    try {
      app = new App(container, {
        items,
        bend,
        textColor,
        borderRadius,
        font,
        scrollSpeed,
        scrollEase,
        onActiveChange: (index) => activeChangeRef.current?.(index),
      });
    } catch (error) {
      // No WebGL, or context creation refused. The caller renders a fallback.
      console.warn("CircularGallery: WebGL unavailable", error);
      return;
    }

    return () => app.destroy();
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase]);

  return (
    <div
      className="circular-gallery"
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label={ariaLabel}
    />
  );
}
