import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const XShape = ({ position, isWinning, scale = 1 }) => {
  const groupRef = useRef();
  useFrame(() => {
    if (isWinning && groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });
  return (
    <group ref={groupRef} position={position} scale={scale} castShadow>
      <mesh castShadow>
        <boxGeometry args={[0.85, 0.2, 0.5]} />
        <meshStandardMaterial
          color={isWinning ? '#00bcd4' : '#3498db'}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[0.85, 0.2, 0.5]} />
        <meshStandardMaterial
          color={isWinning ? '#00bcd4' : '#3498db'}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

const OShape = ({ position, isWinning, scale = 1 }) => {
  const torusRef = useRef();
  useFrame(() => {
    if (isWinning && torusRef.current) {
      torusRef.current.rotation.z += 0.015;
      torusRef.current.rotation.y += 0.01;
    }
  });
  return (
    <mesh ref={torusRef} position={position} castShadow scale={scale}>
      <torusGeometry args={[0.3, 0.12, 32, 64]} />
      <meshStandardMaterial
        color={isWinning ? '#f06292' : '#e74c3c'}
        metalness={0.7}
        roughness={0.2}
      />
    </mesh>
  );
};

const Cell = ({ index, value, onClick, position, isWinning }) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.z = hovered ? 0.05 : 0;
      groupRef.current.scale.setScalar(hovered ? 1.05 : 1);
    }
  });
  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      onClick={(e) => { e.stopPropagation(); if (!value) onClick(index); }}
    >
      <mesh position={[0, 0, -0.05]} receiveShadow>
        <boxGeometry args={[0.95, 0.95, 0.1]} />
        <meshStandardMaterial
          color={isWinning ? '#a5d6a7' : '#eceff1'}
          metalness={0.3}
          roughness={0.6}
        />
      </mesh>
      {value === 'X' && (
        <XShape position={[0, 0, 0]} isWinning={isWinning} />
      )}
      {value === 'O' && (
        <OShape position={[0, 0, 0]} isWinning={isWinning} />
      )}
    </group>
  );
};

const GridPlatform = () => (
  <mesh position={[0, 0, -0.1]} receiveShadow>
    <planeGeometry args={[3.4, 3.4]} />
    <meshStandardMaterial
      color="#ffffff"
      metalness={0.5}
      roughness={0.2}
      transparent
      opacity={0.2}
    />
  </mesh>
);

const GameBoard = ({ board, onCellClick, winningLine }) => {
  const isWinningCell = (index) => winningLine?.includes(index);
  const getCellPosition = (index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return [(col - 1) * 1.1, (1 - row) * 1.1, 0];
  };

  return (
    <group>
      <GridPlatform />
      {board.map((val, index) => (
        <Cell
          key={index}
          index={index}
          value={val}
          onClick={onCellClick}
          position={getCellPosition(index)}
          isWinning={isWinningCell(index)}
        />
      ))}
    </group>
  );
};

const ThreeDScene = ({ board, onCellClick, winningLine }) => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 7.5], fov: 30 }}
      style={{ width: '100%', height: '50rem', borderRadius: '1rem' }}
    >
      <color attach="background" args={["#1a1a1a"]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-3, -3, -3]}
        intensity={0.6}
        castShadow
      />
      <OrbitControls enableZoom enablePan rotateSpeed={0.6} />
      <GameBoard
        board={board}
        onCellClick={onCellClick}
        winningLine={winningLine}
      />
    </Canvas>
  );
};

export default ThreeDScene;