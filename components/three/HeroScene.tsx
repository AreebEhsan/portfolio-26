"use client";

import Globe from "react-globe.gl";
import { useEffect, useMemo, useRef, useState } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type ArcDatum = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
};

const arcsData: ArcDatum[] = [
  // Atlanta to various tech hubs
  { startLat: 33.749, startLng: -84.388, endLat: 37.7749, endLng: -122.4194, color: ["#22d3ee", "#6366f1"] }, // SF
  { startLat: 33.749, startLng: -84.388, endLat: 47.6062, endLng: -122.3321, color: ["#22d3ee", "#22c55e"] }, // Seattle
  { startLat: 33.749, startLng: -84.388, endLat: 40.7128, endLng: -74.006, color: ["#22d3ee", "#facc15"] }, // NYC
  { startLat: 33.749, startLng: -84.388, endLat: 51.5074, endLng: -0.1278, color: ["#38bdf8", "#a855f7"] }, // London
  { startLat: 33.749, startLng: -84.388, endLat: 48.8566, endLng: 2.3522, color: ["#38bdf8", "#22c55e"] }, // Paris
  { startLat: 33.749, startLng: -84.388, endLat: 35.6762, endLng: 139.6503, color: ["#22d3ee", "#fb923c"] }, // Tokyo
  { startLat: 33.749, startLng: -84.388, endLat: 37.5665, endLng: 126.978, color: ["#22d3ee", "#f97316"] }, // Seoul
];

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState({ width: 400, height: 260 });
  const reduceMotion = prefersReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      setSize({ width: clientWidth, height: clientHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !globeRef.current) return;

    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = !reduceMotion;
      controls.autoRotateSpeed = 0.6;
      controls.enablePan = false;
      controls.enableZoom = false;
    }

    globeRef.current.pointOfView({ lat: 25, lng: -20, altitude: 2.4 }, 0);
  }, [mounted, reduceMotion]);

  const arcs = useMemo(() => arcsData, []);

  return (
    <div ref={containerRef} className="relative h-[260px] w-full md:h-[340px]">
      {mounted && (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-dark.jpg"
          arcsData={arcs}
          arcColor={(d: ArcDatum) => d.color}
          arcStroke={0.7}
          arcDashLength={0.4}
          arcDashGap={0.25}
          arcDashAnimateTime={reduceMotion ? 0 : 4000}
          arcsTransitionDuration={0}
        />
      )}
    </div>
  );
}
