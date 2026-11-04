import { useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { CanonicalPieceGeometry, Point2D } from "./domain/geometry/canonical";

type Props = { name: string; geometry: CanonicalPieceGeometry | null };
type Camera = { azimuth: number; elevation: number; zoom: number };
type Projected = { x: number; y: number; depth: number };

function project(point: Point2D, z: number, center: Point2D, camera: Camera, scale: number): Projected {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const cosA = Math.cos(camera.azimuth);
  const sinA = Math.sin(camera.azimuth);
  const rotatedX = dx * cosA - dy * sinA;
  const rotatedY = dx * sinA + dy * cosA;
  const cosE = Math.cos(camera.elevation);
  const sinE = Math.sin(camera.elevation);
  return {
    x: 400 + rotatedX * scale * camera.zoom,
    y: 255 + (rotatedY * sinE - z * cosE) * scale * camera.zoom,
    depth: rotatedY * cosE + z * sinE,
  };
}

function pointsAttribute(points: Projected[]) {
  return points.map(point => `${point.x},${point.y}`).join(" ");
}

export default function Preview3DPanel({ name, geometry }: Props) {
  const [camera, setCamera] = useState<Camera>({ azimuth: -0.72, elevation: 0.82, zoom: 1 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const scene = useMemo(() => {
    if (!geometry) return null;
    const points = geometry.outer.points;
    const minX = Math.min(...points.map(point => point.x));
    const maxX = Math.max(...points.map(point => point.x));
    const minY = Math.min(...points.map(point => point.y));
    const maxY = Math.max(...points.map(point => point.y));
    const center = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
    const scale = 290 / Math.max(maxX - minX, maxY - minY, 1);
    const bottom = points.map(point => project(point, 0, center, camera, scale));
    const top = points.map(point => project(point, geometry.thicknessMm, center, camera, scale));
    const faces = points.map((point, index) => {
      const next = (index + 1) % points.length;
      const vertices = [bottom[index], bottom[next], top[next], top[index]];
      return { vertices, depth: vertices.reduce((sum, vertex) => sum + vertex.depth, 0) / vertices.length };
    }).sort((a, b) => a.depth - b.depth);
    const holes = geometry.holes.map(hole => hole.points.map(point => project(point, geometry.thicknessMm, center, camera, scale)));
    return { top, faces, holes };
  }, [geometry, camera]);

  const moveCamera = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    drag.current = { x: event.clientX, y: event.clientY };
    setCamera(current => ({
      ...current,
      azimuth: current.azimuth + dx * 0.012,
      elevation: Math.max(0.2, Math.min(1.35, current.elevation + dy * 0.008)),
    }));
  };

  return (
    <section className="panel preview3d-panel">
      <div className="panel-head">
        <div><span className="eyebrow">VISUALIZAÇÃO ESPACIAL</span><h2>Prévia 3D · {name || "Peça selecionada"}</h2></div>
        <div className="preview3d-actions">
          <button className="secondary" onClick={() => setCamera({ azimuth: -0.72, elevation: 0.82, zoom: 1 })} title="Restaurar câmera"><RotateCcw size={14}/></button>
          <button className="secondary" onClick={() => setCamera(current => ({ ...current, zoom: Math.max(0.5, current.zoom - 0.1) }))}>−</button>
          <button className="secondary" onClick={() => setCamera(current => ({ ...current, zoom: Math.min(2, current.zoom + 0.1) }))}>+</button>
        </div>
      </div>
      {scene ? <svg className="preview3d-canvas" viewBox="0 0 800 500" onPointerDown={event => { drag.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={moveCamera} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} role="img" aria-label="Prévia isométrica extrudada da peça; arraste para orbitar a câmera">
        <defs><pattern id="preview3d-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M 25 0 L 0 0 0 25" fill="none" stroke="#e9e9e5" strokeWidth="1"/></pattern></defs>
        <rect width="800" height="500" fill="#fbfbf9"/><rect width="800" height="500" fill="url(#preview3d-grid)"/>
        {scene.faces.map((face, index) => <polygon key={index} points={pointsAttribute(face.vertices)} fill={index % 2 ? "#b7b0a3" : "#c9c2b5"} stroke="#6f6a62" strokeWidth="1.5"/>)}
        <polygon points={pointsAttribute(scene.top)} fill="#e2ddd2" stroke="#4c5556" strokeWidth="2.5"/>
        {scene.holes.map((hole, index) => <polygon key={index} points={pointsAttribute(hole)} fill="#fbfbf9" stroke="#555e5f" strokeWidth="2"/>)}
        <text x="22" y="32" fill="#81817a" fontSize="13">ARRASTE PARA ORBITAR · ZOOM NOS CONTROLES</text>
        <text x="22" y="476" fill="#81817a" fontSize="13">ESPESSURA: {geometry?.thicknessMm ?? 0} mm · PROJEÇÃO ORTOGRÁFICA</text>
      </svg> : <div className="nesting-empty"><strong>Selecione uma peça</strong><span>A prévia extrudada aparece quando houver uma geometria selecionada.</span></div>}
      <p className="editor-disclaimer">Prévia isométrica simplificada da extrusão do contorno. Ainda não é um modelador 3D sólido: não calcula superfícies curvas, colisões, ferramentas, usinagem ou tolerâncias de máquina.</p>
    </section>
  );
}
