import { useMemo, useRef, useState } from "react";
import { Copy, Grid3X3, Minus, Plus, Redo2, RotateCw, Trash2, Undo2 } from "lucide-react";
import {
  polygonAreaMm2,
  validateGeometry,
  type CanonicalPieceGeometry,
  type Point2D,
} from "./domain/geometry/canonical";

type EditorPiece = {
  id: string;
  name: string;
  x: number;
  y: number;
  rotationDeg: number;
  geometry: CanonicalPieceGeometry;
};
type Snapshot = EditorPiece[];\ntype DragState = { id: string; pointerX: number; pointerY: number; pieceX: number; pieceY: number; before: Snapshot; vertexIndex?: number; centerX?: number; centerY?: number };

const VIEW_W = 1600;
const VIEW_H = 1000;
const GRID = 10;

function lGeometry(): CanonicalPieceGeometry {\n  return { schemaVersion: 1, units: "mm", coordinateSystem: "piece-local", toleranceMm: 0.01, thicknessMm: 20, outer: { points: [{ x: 0, y: 0 }, { x: 1400, y: 0 }, { x: 1400, y: 500 }, { x: 600, y: 500 }, { x: 600, y: 900 }, { x: 0, y: 900 }] }, holes: [] };\n}\n\nfunction rectangleGeometry(width: number, height: number, thickness = 20): CanonicalPieceGeometry {
  return {
    schemaVersion: 1,
    units: "mm",
    coordinateSystem: "piece-local",
    toleranceMm: 0.01,
    thicknessMm: thickness,
    outer: { points: [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height }] },
    holes: [],
  };
}

function bounds(geometry: CanonicalPieceGeometry) {
  const xs = geometry.outer.points.map(point => point.x);
  const ys = geometry.outer.points.map(point => point.y);
  return {
    minX: Math.min(...xs), maxX: Math.max(...xs),
    minY: Math.min(...ys), maxY: Math.max(...ys),
  };
}

function scaleGeometry(geometry: CanonicalPieceGeometry, width: number, height: number): CanonicalPieceGeometry {
  const box = bounds(geometry);
  const oldWidth = Math.max(1, box.maxX - box.minX);
  const oldHeight = Math.max(1, box.maxY - box.minY);
  const sx = width / oldWidth;
  const sy = height / oldHeight;
  const scaleRing = (ring: { points: Point2D[] }) => ({
    points: ring.points.map(point => ({
      x: (point.x - box.minX) * sx,
      y: (point.y - box.minY) * sy,
    })),
  });
  return { ...geometry, outer: scaleRing(geometry.outer), holes: geometry.holes.map(scaleRing) };
}

function worldPoints(piece: EditorPiece, ring: { points: Point2D[] }) {
  const box = bounds(piece.geometry);
  const cx = (box.minX + box.maxX) / 2;
  const cy = (box.minY + box.maxY) / 2;
  const angle = piece.rotationDeg * Math.PI / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return ring.points.map(point => {
    const dx = point.x - cx;
    const dy = point.y - cy;
    return {
      x: piece.x + cx + dx * cos - dy * sin,
      y: piece.y + cy + dx * sin + dy * cos,
    };
  });
}

function pointsAttribute(points: Point2D[]) {
  return points.map(point => `${point.x},${point.y}`).join(" ");
}

function snap(value: number) {
  return Math.round(value / GRID) * GRID;
}

const initialPieces: EditorPiece[] = [
  { id: "piece-1", name: "Bancada principal", x: 180, y: 180, rotationDeg: 0, geometry: rectangleGeometry(1800, 620) },
  { id: "piece-2", name: "Saia", x: 220, y: 850, rotationDeg: 0, geometry: rectangleGeometry(900, 120) },
  { id: "piece-3", name: "Ilha", x: 850, y: 500, rotationDeg: 0, geometry: rectangleGeometry(900, 650) },
];

export default function Editor2DPanel() {
  const [pieces, setPieces] = useState<EditorPiece[]>(initialPieces);
  const [selectedId, setSelectedId] = useState<string | null>("piece-1");
  const [past, setPast] = useState<Snapshot[]>([]);
  const [future, setFuture] = useState<Snapshot[]>([]);
  const [zoom, setZoom] = useState(1);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [notice, setNotice] = useState("Geometria em milímetros. Arraste uma peça para reposicioná-la.");
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<DragState | null>(null);

  const selected = pieces.find(piece => piece.id === selectedId) ?? null;
  const selectedBounds = selected ? bounds(selected.geometry) : null;
  const width = selectedBounds ? Math.round(selectedBounds.maxX - selectedBounds.minX) : 0;
  const height = selectedBounds ? Math.round(selectedBounds.maxY - selectedBounds.minY) : 0;
  const valid = useMemo(() => selected ? validateGeometry(selected.geometry) : null, [selected]);
  const area = selected ? polygonAreaMm2(selected.geometry) : 0;

  const commit = (next: Snapshot) => {
    setPast(current => [...current.slice(-49), pieces]);
    setFuture([]);
    setPieces(next);
  };
  const updateSelected = (update: (piece: EditorPiece) => EditorPiece) => {
    if (!selected) return;
    commit(pieces.map(piece => piece.id === selected.id ? update(piece) : piece));
  };
  const addPiece = () => {
    const id = `piece-${Date.now()}`;
    const next = [...pieces, { id, name: `Peça ${pieces.length + 1}`, x: 240 + pieces.length * 40, y: 240 + pieces.length * 40, rotationDeg: 0, geometry: rectangleGeometry(800, 500) }];
    commit(next);
    setSelectedId(id);
    setNotice("Nova peça retangular criada. Ajuste suas dimensões no painel.");
  };
  const addLPiece = () => {\n    const id = `piece-${Date.now()}`;\n    const next = [...pieces, { id, name: `Bancada em L ${pieces.length + 1}`, x: 180, y: 160, rotationDeg: 0, geometry: lGeometry() }];\n    commit(next);\n    setSelectedId(id);\n    setNotice("Peça em L criada. Ajuste sua posição e dimensões.");\n  };\n  const duplicate = () => {
    if (!selected) return;
    const id = `piece-${Date.now()}`;
    commit([...pieces, { ...selected, id, name: `${selected.name} — cópia`, x: selected.x + 80, y: selected.y + 80, geometry: structuredClone(selected.geometry) }]);
    setSelectedId(id);
    setNotice("Cópia criada.");
  };
  const remove = () => {
    if (!selected) return;
    commit(pieces.filter(piece => piece.id !== selected.id));
    setSelectedId(null);
    setNotice("Peça removida da sessão de desenho.");
  };
  const undo = () => {
    if (!past.length) return;
    const previous = past[past.length - 1];
    setFuture(current => [pieces, ...current]);
    setPast(current => current.slice(0, -1));
    setPieces(previous);
    setSelectedId(previous[0]?.id ?? null);
  };
  const redo = () => {
    if (!future.length) return;
    const next = future[0];
    setPast(current => [...current, pieces]);
    setFuture(current => current.slice(1));
    setPieces(next);
    setSelectedId(next[0]?.id ?? null);
  };
  const pointerPosition = (event: React.PointerEvent<SVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: ((event.clientX - rect.left) / rect.width) * (VIEW_W / zoom),
      y: ((event.clientY - rect.top) / rect.height) * (VIEW_H / zoom),
    };
  };
  const startDrag = (event: React.PointerEvent<SVGPolygonElement>, piece: EditorPiece) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedId(piece.id);
    const point = pointerPosition(event);
    dragRef.current = { id: piece.id, pointerX: point.x, pointerY: point.y, pieceX: piece.x, pieceY: piece.y, before: pieces };
    svgRef.current?.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: React.PointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const point = pointerPosition(event);
    const dx = point.x - drag.pointerX;
    const dy = point.y - drag.pointerY;
    const x = snapEnabled ? snap(drag.pieceX + dx) : drag.pieceX + dx;
    const y = snapEnabled ? snap(drag.pieceY + dy) : drag.pieceY + dy;
    setPieces(current => current.map(piece => piece.id === drag.id ? { ...piece, x, y } : piece));
  };
  const startVertexDrag = (event: React.PointerEvent<SVGCircleElement>, piece: EditorPiece, vertexIndex: number) => {\n    event.preventDefault();\n    event.stopPropagation();\n    setSelectedId(piece.id);\n    const point = pointerPosition(event);\n    const box = bounds(piece.geometry);\n    dragRef.current = { id: piece.id, pointerX: point.x, pointerY: point.y, pieceX: piece.x, pieceY: piece.y, before: pieces, vertexIndex, centerX: (box.minX + box.maxX) / 2, centerY: (box.minY + box.maxY) / 2 };\n    svgRef.current?.setPointerCapture(event.pointerId);\n  };\n  const endDrag = () => {
    if (!dragRef.current) return;
    const before = dragRef.current.before;
    setPast(current => [...current.slice(-49), before]);
    setFuture([]);
    dragRef.current = null;
  };

  return (
    <section className="module-stack editor2d">
      <div className="module-actions">
        <div><span className="eyebrow">ENGENHARIA · DESENHO TÉCNICO</span><h2>Editor 2D interativo</h2></div>
        <div className="editor-toolbar">
          <button className="secondary" onClick={undo} disabled={!past.length} title="Desfazer"><Undo2 size={15}/></button>
          <button className="secondary" onClick={redo} disabled={!future.length} title="Refazer"><Redo2 size={15}/></button>
          <button className="secondary" onClick={() => setZoom(value => Math.max(.5, value - .1))} title="Diminuir zoom"><Minus size={15}/></button>
          <button className="secondary" onClick={() => setZoom(value => Math.min(1.5, value + .1))} title="Aumentar zoom"><Plus size={15}/></button>
          <button className="secondary" onClick={addLPiece}>Peça em L</button><button className="primary" onClick={addPiece}><Plus size={15}/>Peça retangular</button>
        </div>
      </div>
      <div className="editor-notice"><Grid3X3 size={16}/><span>{notice} <strong>Prévia de trabalho — não libera fabricação.</strong></span></div>
      <div className="editor-layout">
        <div className="editor-canvas-wrap">
          <div className="editor-canvas-head"><span>PLANTA · MILÍMETROS</span><span>{Math.round(zoom * 100)}% · grade {GRID} mm</span></div>
          <svg ref={svgRef} className="editor-canvas" viewBox={`0 0 ${VIEW_W / zoom} ${VIEW_H / zoom}`} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onPointerDown={() => setSelectedId(null)} role="img" aria-label="Área de desenho 2D interativa">
            <defs>
              <pattern id="ferraz-grid-small" width={GRID} height={GRID} patternUnits="userSpaceOnUse"><path d={`M ${GRID} 0 L 0 0 0 ${GRID}`} fill="none" stroke="#ecece8" strokeWidth="1"/></pattern>
              <pattern id="ferraz-grid-large" width={GRID * 10} height={GRID * 10} patternUnits="userSpaceOnUse"><rect width={GRID * 10} height={GRID * 10} fill="url(#ferraz-grid-small)"/><path d={`M ${GRID * 10} 0 L 0 0 0 ${GRID * 10}`} fill="none" stroke="#d8d8d2" strokeWidth="1.4"/></pattern>
            </defs>
            <rect width={VIEW_W} height={VIEW_H} fill="#fbfbf9"/>
            <rect width={VIEW_W} height={VIEW_H} fill="url(#ferraz-grid-large)"/>
            {pieces.map(piece => {
              const outer = worldPoints(piece, piece.geometry.outer);
              const isSelected = piece.id === selectedId;
              return <g key={piece.id}>
                <polygon points={pointsAttribute(outer)} fill={isSelected ? "#d6e1e4" : "#ded8cb"} stroke={isSelected ? "#263e48" : "#77736b"} strokeWidth={isSelected ? 5 : 3} onPointerDown={event => startDrag(event, piece)} style={{ cursor: "move" }}/>
                {piece.geometry.holes.map((hole, index) => <polygon key={index} points={pointsAttribute(worldPoints(piece, hole))} fill="#fbfbf9" stroke="#77736b" strokeWidth="3" pointerEvents="none"/>)}
                <text x={piece.x + (selectedBounds && isSelected ? width / 2 : (bounds(piece.geometry).maxX - bounds(piece.geometry).minX) / 2)} y={piece.y + (bounds(piece.geometry).maxY - bounds(piece.geometry).minY) / 2} textAnchor="middle" dominantBaseline="middle" fontSize="30" fill="#333" pointerEvents="none">{piece.name}</text>
                {isSelected && <><polygon points={pointsAttribute(outer)} fill="none" stroke="#263e48" strokeWidth="2" strokeDasharray="12 8" pointerEvents="none"/>{outer.map((point, vertexIndex) => <circle key={vertexIndex} cx={point.x} cy={point.y} r="12" fill="#fff" stroke="#263e48" strokeWidth="4" style={{ cursor: "crosshair" }} onPointerDown={event => startVertexDrag(event, piece, vertexIndex)}/>)}</>}
              </g>;
            })}
            <text x="24" y="38" fontSize="18" fill="#999">ORIGEM 0,0 · mm</text>
          </svg>
          <div className="editor-canvas-foot"><span>Arraste as peças para mover · encaixe {snapEnabled ? "ativado" : "desativado"}</span><button className="text-button" onClick={() => setSnapEnabled(value => !value)}>{snapEnabled ? "Desativar grade" : "Ativar grade"}</button></div>
        </div>
        <aside className="panel editor-properties">
          <div className="panel-head"><div><span className="eyebrow">PROPRIEDADES</span><h2>{selected ? selected.name : "Nenhuma seleção"}</h2></div></div>
          {!selected ? <div className="nesting-empty"><strong>Selecione uma peça</strong><span>Clique em uma peça no desenho para editar suas propriedades.</span></div> : <>
            <label className="editor-field">Nome<input value={selected.name} onChange={event => updateSelected(piece => ({ ...piece, name: event.target.value }))}/></label>
            <div className="editor-field-grid">
              <label className="editor-field">Posição X (mm)<input type="number" value={Math.round(selected.x)} onChange={event => updateSelected(piece => ({ ...piece, x: Number(event.target.value) || 0 }))}/></label>
              <label className="editor-field">Posição Y (mm)<input type="number" value={Math.round(selected.y)} onChange={event => updateSelected(piece => ({ ...piece, y: Number(event.target.value) || 0 }))}/></label>
              <label className="editor-field">Largura (mm)<input key={selected.id + "-width-" + width} type="number" min="1" defaultValue={width} onBlur={event => { const next = Number(event.target.value); if (next > 0 && next !== width) updateSelected(piece => ({ ...piece, geometry: scaleGeometry(piece.geometry, next, height) })); }}/></label>
              <label className="editor-field">Altura (mm)<input key={selected.id + "-height-" + height} type="number" min="1" defaultValue={height} onBlur={event => { const next = Number(event.target.value); if (next > 0 && next !== height) updateSelected(piece => ({ ...piece, geometry: scaleGeometry(piece.geometry, width, next) })); }}/></label>
              <label className="editor-field">Espessura (mm)<input type="number" min="1" value={selected.geometry.thicknessMm} onChange={event => updateSelected(piece => ({ ...piece, geometry: { ...piece.geometry, thicknessMm: Math.max(1, Number(event.target.value) || 1) } }))}/></label>
              <label className="editor-field">Rotação<input value={`${selected.rotationDeg}°`} readOnly/></label>
            </div>
            <div className="editor-actions">
              <button className="secondary" onClick={() => updateSelected(piece => ({ ...piece, rotationDeg: (piece.rotationDeg + 90) % 360 }))}><RotateCw size={14}/>Girar 90°</button>
              <button className="secondary" onClick={duplicate}><Copy size={14}/>Duplicar</button>
              <button className="secondary danger-action" onClick={remove}><Trash2 size={14}/>Excluir</button>
            </div>
            <div className="editor-validation">
              <strong>{valid?.valid ? "Geometria válida" : "Geometria com pendências"}</strong>
              <span>Área: {(area / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 3 })} m²</span>
              <span>Contorno: {selected.geometry.outer.points.length} vértices · {selected.geometry.holes.length} furos</span>
              {valid?.issues.map((issue, index) => <small key={index}>{issue.message}</small>)}
            </div>
          </>}
          <p className="editor-disclaimer">As alterações existem apenas nesta sessão do navegador. Não estão vinculadas a projeto, não são persistidas e exigem conferência dimensional e aprovação técnica antes de qualquer uso industrial.</p>
        </aside>
      </div>
    </section>
  );
}
