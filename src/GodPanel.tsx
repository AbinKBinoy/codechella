import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { GRID, toCell, inBounds } from "./lib/grid";

const HAZARDS = [
  { id: "boulder", label: "Boulder", color: "#a5473c" },
  { id: "misc",   label: "Misc",   color: "#2ce253" },
  { id: "shards", label: "Shards", color: "#5b8dd6" },
];

export default function GodPanel() {
  const players = useQuery(api.game.players) ?? [];
  const drop = useMutation(api.game.drop);
  
  // This tracks which button is currently selected
  const [kind, setKind] = useState("boulder");

  const occupied = new Set(
    players
      .map((p) => toCell(p.x, p.z))
      .filter(({ cx, cz }) => inBounds(cx, cz))
      .map(({ cx, cz }) => `${cx},${cz}`)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "min(90vw, 480px)" }}>
      
      {/* The New Toolbar */}
      <div style={{ display: "flex", gap: 8 }}>
        {HAZARDS.map((h) => (
          <button
            key={h.id}
            onClick={() => setKind(h.id)}
            style={{
              flex: 1, padding: "12px 8px", cursor: "pointer",
              background: kind === h.id ? h.color : "#222",
              color: kind === h.id ? "#000" : "#888",
              border: `2px solid ${kind === h.id ? h.color : "#333"}`,
              fontWeight: kind === h.id ? 700 : 400,
            }}
          >
            {h.label}
          </button>
        ))}
      </div>

      {/* The Existing Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID}, 1fr)`,
        gap: 2, aspectRatio: "1",
      }}>
        {Array.from({ length: GRID * GRID }, (_, i) => {
          const cx = i % GRID, cz = Math.floor(i / GRID);
          return (
            <button
              key={i}
              // Notice how this now passes the dynamic `kind` state!
              onClick={() => drop({ kind, x: cx, z: cz })} 
              style={{
                background: occupied.has(`${cx},${cz}`) ? "#e33" : "#222",
                border: "1px solid #444",
              }}
            />
          );
        })}
      </div>
      
    </div>
  );
}