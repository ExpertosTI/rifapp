"use client";
import { Canvas } from "@react-three/fiber";
import { ParticleField } from "./ParticleField";
import { Stars, Float } from "@react-three/drei";

const SceneCanvas = () => {
    return (
        <Canvas camera={{ position: [0, 0, 1] }}>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <ParticleField />
            </Float>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            {/* Ambient colored lights for the "Cyber" look */}
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#8b5cf6" />
            <pointLight position={[-10, -10, -10]} intensity={1.5} color="#06b6d4" />
        </Canvas>
    );
};

export default SceneCanvas;
