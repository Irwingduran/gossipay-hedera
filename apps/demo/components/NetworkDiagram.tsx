'use client'

import { useEffect, useState } from 'react'

interface Node {
  x: number
  y: number
  label: string
  role: string
  color: string
  icon: string
}

const nodes: Node[] = [
  { x: 200, y: 80, label: 'Research', role: 'Market intel', color: '#3B82F6', icon: '🔍' },
  { x: 80, y: 220, label: 'Procurement', role: 'Payments', color: '#22C55E', icon: '⚡' },
  { x: 320, y: 220, label: 'Audit', role: 'HCS logging', color: '#A855F7', icon: '📋' },
]

const connections = [
  [0, 1],
  [0, 2],
  [1, 2],
]

function AgentNode({ node, index }: { node: Node; index: number }) {
  return (
    <g
      className="transition-all duration-500"
      style={{ animationDelay: `${index * 2}s` }}
    >
      <circle
        cx={node.x}
        cy={node.y}
        r={28}
        fill="white"
        stroke={node.color}
        strokeWidth={2}
        className="drop-shadow-sm"
      />
      <circle
        cx={node.x}
        cy={node.y}
        r={28}
        fill="none"
        stroke={node.color}
        strokeWidth={2}
        opacity={0.15}
        className="animate-ping"
        style={{ animationDuration: '3s', animationDelay: `${index * 1}s` }}
      />
      <text x={node.x} y={node.y - 1} textAnchor="middle" fontSize="16" dominantBaseline="central">
        {node.icon}
      </text>
      <text x={node.x} y={node.y + 38} textAnchor="middle" fontSize="11" fill="#525252" fontWeight="600">
        {node.label}
      </text>
      <text x={node.x} y={node.y + 52} textAnchor="middle" fontSize="9" fill="#a3a3a3">
        {node.role}
      </text>
    </g>
  )
}

function AnimatedDot({ from, to, delay }: { from: Node; to: Node; delay: number }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p >= 1 ? 0 : p + 0.005))
    }, 30)
    return () => clearInterval(interval)
  }, [])

  const x = from.x + (to.x - from.x) * progress
  const y = from.y + (to.y - from.y) * progress

  return (
    <circle cx={x} cy={y} r={4} fill="#171717" opacity={0.7}>
      <animate
        attributeName="opacity"
        values="0.7;0.2;0.7"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
  )
}

const edgeRoutes = [
  { from: 0, to: 1, delay: 0 },
  { from: 0, to: 2, delay: 2000 },
  { from: 1, to: 2, delay: 4000 },
]

export function NetworkDiagram() {
  return (
    <div className="w-full max-w-[420px] mx-auto">
      <svg viewBox="0 0 400 300" className="w-full h-auto">
        {/* Edge lines */}
        {connections.map(([i, j]) => (
          <line
            key={`${i}-${j}`}
            x1={nodes[i].x}
            y1={nodes[i].y}
            x2={nodes[j].x}
            y2={nodes[j].y}
            stroke="#e5e5e5"
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
        ))}

        {/* Edge labels */}
        <g fontSize="8" fill="#a3a3a3">
          <text x={135} y={145} textAnchor="middle" transform="rotate(-30, 135, 145)">
            0.5 HBAR
          </text>
          <text x={265} y={145} textAnchor="middle" transform="rotate(30, 265, 145)">
            Logs
          </text>
          <text x={200} y={240} textAnchor="middle">
            Verify
          </text>
        </g>

        {/* Animated dots */}
        {edgeRoutes.map((r) => (
          <AnimatedDot
            key={`dot-${r.from}-${r.to}`}
            from={nodes[r.from]}
            to={nodes[r.to]}
            delay={r.delay}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <AgentNode key={node.label} node={node} index={i} />
        ))}
      </svg>
    </div>
  )
}
