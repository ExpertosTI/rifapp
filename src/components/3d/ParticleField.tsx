"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";


export function ParticleField(props: any) {
    const ref = useRef<any>();

    // Generate 5000 random points (5000 * 3 coordinates)
    const sphere = useMemo(() => {
        const data = new Float32Array(5000 * 3);
        const radius = 1.5;
        for (let i = 0; i < data.length; i += 3) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = Math.cbrt(Math.random()) * radius;
            const sinPhi = Math.sin(phi);
            data[i] = r * sinPhi * Math.cos(theta);
            data[i + 1] = r * sinPhi * Math.sin(theta);
            data[i + 2] = r * Math.cos(phi);
        }
        return data;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#3b82f6" // Electric Blue
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}
