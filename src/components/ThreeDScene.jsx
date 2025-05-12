import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const XShape = ({ position, isWinning }) => {
  const groupRef = useRef();
  const cylinderRef1 = useRef();
  const cylinderRef2 = useRef();
  const [rotationAngle, setRotationAngle] = useState(0);
  
  useFrame(() => {
    if (groupRef.current && isWinning) {
      groupRef.current.rotation.y += 0.02;
      
      setRotationAngle((prev) => prev + 0.05);
      
      if (cylinderRef1.current && cylinderRef2.current) {
        // Color animation
        const hue = (Date.now() % 3000) / 3000;
        cylinderRef1.current.material.color.setHSL(hue, 0.7, 0.5);
        cylinderRef2.current.material.color.setHSL((hue + 0.5) % 1, 0.7, 0.5);
        
        const offset = Math.sin(rotationAngle) * 0.05;
        cylinderRef1.current.position.y = offset;
        cylinderRef2.current.position.x = offset;
      }
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      {/* First cylinder for X (horizontal) */}
      <mesh ref={cylinderRef1} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
        <meshStandardMaterial color={isWinning ? "#4fc3f7" : "#3498db"} />
      </mesh>
      
      {/* Second cylinder for X (vertical) */}
      <mesh ref={cylinderRef2} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
        <meshStandardMaterial color={isWinning ? "#4fc3f7" : "#3498db"} />
      </mesh>
    </group>
  );
};

const OShape = ({ position, isWinning }) => {
  const torusRef = useRef();
  const [pulseDirection, setPulseDirection] = useState(1);
  const [scale, setScale] = useState(1);
  
  useFrame(() => {
    if (torusRef.current && isWinning) {
      // Rotation animation
      torusRef.current.rotation.z += 0.02;
      torusRef.current.rotation.y += 0.01;
      
      // Pulsing animation
      if (scale > 1.15) setPulseDirection(-1);
      if (scale < 0.85) setPulseDirection(1);
      
      const newScale = scale + (0.005 * pulseDirection);
      setScale(newScale);
      
      torusRef.current.scale.set(newScale, newScale, newScale);
      
      const hue = (Date.now() % 2000) / 2000;
      torusRef.current.material.color.setHSL(hue, 0.8, 0.6);
    }
  });
  
  return (
    <mesh ref={torusRef} position={position}>
      <torusGeometry args={[0.25, 0.08, 16, 32]} />
      <meshStandardMaterial color={isWinning ? "#ff6b6b" : "#e74c3c"} />
    </mesh>
  );
};

const VictoryParticles = ({ position, color }) => {
  const particlesRef = useRef();
  const count = 25; // Number of particles
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return pos;
  }, [count]);
  
  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.01;
      
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] += positions[i3] * 0.01;
        positions[i3 + 1] += positions[i3 + 1] * 0.01;
        positions[i3 + 2] += positions[i3 + 2] * 0.01;
        
        const distance = Math.sqrt(
          positions[i3] ** 2 + 
          positions[i3 + 1] ** 2 + 
          positions[i3 + 2] ** 2
        );
        
        if (distance > 2) {
          positions[i3] = (Math.random() - 0.5) * 0.5;
          positions[i3 + 1] = (Math.random() - 0.5) * 0.5;
          positions[i3 + 2] = (Math.random() - 0.5) * 0.5;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.1} 
        color={color} 
        transparent 
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

const Cell = ({ index, value, onClick, position, isWinning }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  
  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
  };
  
  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
  };
  
  const handleClick = (e) => {
    e.stopPropagation();
    if (!value) {
      onClick(index);
    }
  };
  
  return (
    <group position={position}>
      {/* Background cell */}
      <mesh 
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        position={[0, 0, -0.1]}
      >
        <boxGeometry args={[0.85, 0.85, 0.1]} />
        <meshStandardMaterial 
          color={isWinning ? "#c8e6c9" : (hovered && !value ? "#f0f0f0" : "#d0d0d0")}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Cell content */}
      {value === 'X' && <XShape position={[0, 0, 0.1]} isWinning={isWinning} />}
      {value === 'O' && <OShape position={[0, 0, 0.1]} isWinning={isWinning} />}
      
      {/* Victory particles */}
      {isWinning && value === 'X' && <VictoryParticles position={[0, 0, 0.1]} color="#4fc3f7" />}
      {isWinning && value === 'O' && <VictoryParticles position={[0, 0, 0.1]} color="#ff6b6b" />}
    </group>
  );
};

// Grid lines
const GridLines = () => {
  return (
    <group>
      {/* Horizontal grid lines */}
      <mesh position={[0, 1, -0.2]}>
        <boxGeometry args={[3, 0.03, 0.01]} />
        <meshStandardMaterial color="#95a5a6" />
      </mesh>
      <mesh position={[0, -1, -0.2]}>
        <boxGeometry args={[3, 0.03, 0.01]} />
        <meshStandardMaterial color="#95a5a6" />
      </mesh>
      
      {/* Vertical grid lines */}
      <mesh position={[1, 0, -0.2]}>
        <boxGeometry args={[0.03, 3, 0.01]} />
        <meshStandardMaterial color="#95a5a6" />
      </mesh>
      <mesh position={[-1, 0, -0.2]}>
        <boxGeometry args={[0.03, 3, 0.01]} />
        <meshStandardMaterial color="#95a5a6" />
      </mesh>
    </group>
  );
};

// Background plane
const Background = () => {
  return (
    <mesh rotation={[0, 0, 0]} position={[0, 0, -0.3]}>
      <planeGeometry args={[3.2, 3.2]} />
      <meshStandardMaterial color="#ecf0f1" />
    </mesh>
  );
};

// Main board component
const GameBoard = ({ board, onCellClick, winningLine }) => {
  const isWinningCell = (index) => {
    return winningLine ? winningLine.includes(index) : false;
  };
  
  const getCellPosition = (index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return [(col - 1) * 1, (1 - row) * 1, 0];
  };
  
  return (
    <group>
      <Background />
      <GridLines />
      
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
        <Cell
          key={index}
          index={index}
          value={board[index]}
          onClick={onCellClick}
          position={getCellPosition(index)}
          isWinning={isWinningCell(index)}
        />
      ))}
      
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 5]} intensity={0.9} />
      <directionalLight position={[-3, -5, 5]} intensity={0.3} />
    </group>
  );
};

// Main component 
const ThreeDScene = ({ board, onCellClick, winningLine }) => {
  return (
    <div className="three-d-scene">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ borderRadius: '12px' }}
      >
        <color attach="background" args={['#f8f9fa']} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          rotateSpeed={0.5}
        />
        <GameBoard 
          board={board} 
          onCellClick={onCellClick}
          winningLine={winningLine}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDScene;