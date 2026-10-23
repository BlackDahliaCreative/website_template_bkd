import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./SphereHero.scss";
import SEOHead from "../components/SEOHead/SEOHead";

type Sphere = {
    id: string;
    size: number;     // px
    x: number;        // %
    y: number;        // %
    blur: number;     // px
    opacity: number;  // 0..1
    z: number;        // px
    duration: number; // seconds
    delay: number;    // seconds
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n))
}

// Deterministic-ish random (so it doesn’t reshuffle on every hot reload)
function seededRand(seed: number) {
    let t = seed + 0x6d2b79f5;
    return () => {
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

const makeSpheres = (count: number, seed = 50): Sphere[] => {
    const r = seededRand(seed)
    return Array.from({ length: count }).map((_, i) => {
        const size = Math.round(90 + r() * 140) // 60..200
        const x = Math.round(10 + r() * 80)    // 10%..90%
        const y = Math.round(12 + r() * 70)    // 12%..82%
        const z = Math.round(30 + r() * 180)   // 30..210
        const blur = Math.round(r() * 1.5)     // 0..2-ish
        const opacity = clamp(0.25 + r() * 0.55, 0.2, 0.8)
        const duration = clamp(7 + r() * 9, 7, 16)
        const delay = clamp(r() * 2.5, 0, 2.5)

        return {
            id: `sphere-${i}`,
            size,
            x,
            y,
            z,
            blur,
            opacity,
            duration,
            delay,
        }
    })
}

export default function SphereHero() {
  const prefersReducedMotion = useReducedMotion();

  // Generate once (no re-renders needed for animation)
  const spheres = useMemo(() => makeSpheres(11, 100), []);

  return (
    <section className="hero">
      <SEOHead path="/page-2" />
      {/* Background spheres layer */}
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__perspective">
          {spheres.map((s, idx) => {
            const floatY = Math.round(20 + (idx % 4) * 10)      // variety
            const driftX = Math.round(-50 + (idx % 6) * 8)
            const tilt = (idx % 2 === 0 ? 1 : -1) * (0 + (idx % 5))

            return (
              <motion.div
                key={s.id}
                className="sphere"
                style={{
                    width: s.size,
                    height: s.size,
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    opacity: s.opacity,
                    filter: `
                        ${s.blur ? `blur(${s.blur}px)` : ""}
                        hue-rotate(${200 + idx * 6}deg)
                    `,
                }}

                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
                animate={
                  prefersReducedMotion
                    ? { opacity: s.opacity }
                    : {
                        y: [0, -floatY, 0],
                        x: [0, driftX, 0],
                        rotateX: [0, tilt, 0],
                        rotateY: [0, -tilt, 0],
                        z: [0, s.z, 0], // pop toward camera
                        opacity: [s.opacity * 0.9, s.opacity, s.opacity * 0.9],
                      }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : {
                        duration: s.duration,
                        delay: s.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                }
              />

            )
          })}
        </div>
      </div>

    </section>
  )
}
