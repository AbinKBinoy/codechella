import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { GRID, toCell, inBounds } from "./lib/grid";

export default function GodPanel() {
  const players = useQuery(api.game.players) ?? [];
  const drop = useMutation(api.game.drop);

  const occupied = new Set(
    players
      .map((p) => toCell(p.x, p.z))
      .filter(({ cx, cz }) => inBounds(cx, cz))
      .map(({ cx, cz }) => `${cx},${cz}`)
  );

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${GRID}, 1fr)`,
      gap: 2, width: "min(90vw, 480px)", aspectRatio: "1",
    }}>
      {Array.from({ length: GRID * GRID }, (_, i) => {
        const cx = i % GRID, cz = Math.floor(i / GRID);
        return (
          <button
            key={i}
            onClick={() => drop({ kind: "boulder", x: cx, z: cz })}
            style={{
              background: occupied.has(`${cx},${cz}`) ? "#e33" : "#222",
              border: "1px solid #444",
            }}
          />
        );
      })}
    </div>
  );
}