"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF, Bounds } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/rubiks_cube.glb?v=1";

function SpinRig({ children }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.45;
    ref.current.rotation.x = Math.sin(performance.now() * 0.00035) * 0.08;
  });
  return <group ref={ref}>{children}</group>;
}

function Model() {
  const { scene } = useGLTF(MODEL_URL);

  useEffect(() => {
    // Ensure all materials behave nicely under tone mapping
    scene.traverse((o) => {
      if (!o.isMesh) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m) => {
        if (!m) return;
        if ("toneMapped" in m) m.toneMapped = true;
        m.needsUpdate = true;
      });
    });
  }, [scene]);

  return <primitive object={scene} />;
}

function Loader() {
  return (
    <div className="absolute inset-0 grid place-items-center text-xs text-zinc-400">
      Loading 3D…
    </div>
  );
}

export default function Hero3D() {
  return (
    // overflow-hidden just prevents any accidental antialias edge artifacts;
    // it does NOT add a background or border.
    <div className="relative h-[340px] w-full overflow-hidden md:h-[520px]">
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45, near: 0.01, far: 2000 }}
          dpr={[1, 1.5]}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: false,
          }}
          onCreated={({ gl }) => {
            // This is the key: make the renderer truly transparent.
            gl.setClearColor(0x000000, 0);

            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.25; // tweak 1.1–1.5
          }}
          style={{ background: "transparent" }}
        >
          {/* Environment gives that premium reflection/lighting without needing bloom */}
          <Environment preset="city" environmentIntensity={1.2} />

          {/* A couple lights to shape the cube */}
          <ambientLight intensity={0.22} />
          <directionalLight position={[6, 5, 4]} intensity={1.4} />
          <directionalLight position={[-5, -2, 6]} intensity={0.55} />

          <Bounds fit clip margin={1.6}>
            <SpinRig>
              <Model />
            </SpinRig>
          </Bounds>

          {/* Smooth manual rotation (optional) */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.55}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
