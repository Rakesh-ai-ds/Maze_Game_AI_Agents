"use client"

export default function LoadingScreen() {
  return (
    <mesh>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0} />
    </mesh>
  )
}
