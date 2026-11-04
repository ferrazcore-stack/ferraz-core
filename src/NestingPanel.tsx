import { useState } from "react";
import { AlertTriangle, Calculator, RotateCcw } from "lucide-react";
import {
  optimizePolygonNesting,
  type PolygonNestingPart,
  type PolygonNestingResult,
  type PolygonNestingSheet,
} from "./domain/nesting/polygon-bottom-left";

const sampleParts = [
  {
    id: "bancada-L",
    outer: [{ x: 0, y: 0 }, { x: 1800, y: 0 }, { x: 1800, y: 600 }, { x: 700, y: 600 }, { x: 700, y: 900 }, { x: 0, y: 900 }],
    materialId: "quartzito-demo",
    thicknessMm: 20,
    allowedRotationsDeg: [0, 90],
  },
  {
    id: "saia-01",
    outer: [{ x: 0, y: 0 }, { x: 900, y: 0 }, { x: 900, y: 120 }, { x: 0, y: 120 }],
    materialId: "quartzito-demo",
    thicknessMm: 20,
    allowedRotationsDeg: [0, 90],
  },
];

const colors = ["#d8d0c2", "#c4d0d4", "#d6c5b9", "#c9cfbf", "#d3c9d9", "#d6d1b5"];

export default function NestingPanel() {
  const [widthMm, setWidthMm] = useState("3200");
  const [heightMm, setHeightMm] = useState("1600");
  const [marginMm, setMarginMm] = useState("20");
  const [kerfMm, setKerfMm] = useState("4");
  const [materialId, setMaterialId] = useState("quartzito-demo");
  const [thicknessMm, setThicknessMm] = useState("20");
  const [partsJson, setPartsJson] = useState(JSON.stringify(sampleParts, null, 2));
  const [defectsJson, setDefectsJson] = useState("[]");
  const [result, setResult] = useState<PolygonNestingResult | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    try {
      const numeric = [widthMm, heightMm, marginMm, kerfMm, thicknessMm].map(Number);
      if (numeric.some(value => !Number.isFinite(value)) ||
          numeric[0] <= 0 || numeric[1] <= 0 || numeric[2] < 0 || numeric[3] < 0 || numeric[4] <= 0) {
        throw new Error("Confira dimensões, margem, kerf e espessura.");
      }
      const parts = JSON.parse(partsJson) as PolygonNestingPart[];
      const defects = JSON.parse(defectsJson) as PolygonNestingSheet["defects"];
      if (!Array.isArray(parts) || !Array.isArray(defects)) throw new Error("Peças e defeitos devem ser listas JSON.");
      const sheet: PolygonNestingSheet = {
        id: "chapa-simulacao-01",
        widthMm: numeric[0],
        heightMm: numeric[1],
        marginMm: numeric[2],
        kerfMm: numeric[3],
        materialId,
        thicknessMm: numeric[4],
        grainDirection: "none",
        defects,
      };
      const normalizedParts = parts.map(part => ({
        ...part,
        materialId: part.materialId || materialId,
        thicknessMm: part.thicknessMm || numeric[4],
      }));
      setResult(optimizePolygonNesting([sheet], normalizedParts));
      setError("");
    } catch (reason) {
      setResult(null);
      setError(reason instanceof Error ? reason.message : "Não foi possível calcular a paginação. Revise os dados informados.");
    }
  };

  const loadExample = () => {
    setPartsJson(JSON.stringify(sampleParts, null, 2));
    setDefectsJson("[]");
    setMaterialId("quartzito-demo");
    setThicknessMm("20");
    setResult(null);
    setError("");
  };

  return (
    <section className="module-stack">
      <div className="module-actions">
        <div><span className="eyebrow">ENGENHARIA · CAD/CAM</span><h2>Paginação de chapas</h2></div>
        <div><button className="secondary" onClick={loadExample}><RotateCcw size={15}/>Carregar exemplo</button><button className="primary" onClick={calculate}><Calculator size={15}/>Calcular paginação</button></div>
      </div>
      <div className="nesting-notice"><AlertTriangle size={17}/><span><strong>Simulação técnica local.</strong> Os dados desta tela não estão vinculados a um projeto nem são salvos. O resultado é estimativo e não libera fabricação.</span></div>
      <div className="nesting-layout">
        <div className="panel nesting-inputs">
          <div className="panel-head"><div><span className="eyebrow">ESTOQUE</span><h2>Dados da chapa</h2></div></div>
          <div className="nesting-fields">
            <label>Largura (mm)<input type="number" min="1" value={widthMm} onChange={event => setWidthMm(event.target.value)}/></label>
            <label>Altura (mm)<input type="number" min="1" value={heightMm} onChange={event => setHeightMm(event.target.value)}/></label>
            <label>Margem (mm)<input type="number" min="0" value={marginMm} onChange={event => setMarginMm(event.target.value)}/></label>
            <label>Kerf (mm)<input type="number" min="0" value={kerfMm} onChange={event => setKerfMm(event.target.value)}/></label>
            <label>Material / código<input value={materialId} onChange={event => setMaterialId(event.target.value)}/></label>
            <label>Espessura (mm)<input type="number" min="0.1" step="0.1" value={thicknessMm} onChange={event => setThicknessMm(event.target.value)}/></label>
          </div>
          <label className="nesting-json-label">Peças em JSON <textarea spellCheck={false} rows={14} value={partsJson} onChange={event => setPartsJson(event.target.value)}/></label>
          <p className="nesting-help">Cada peça usa id, outer (vértices x/y em milímetros), materialId, thicknessMm e, opcionalmente, holes, quantity e allowedRotationsDeg [0, 90, 180, 270].</p>
          <label className="nesting-json-label">Defeitos da chapa em JSON <textarea spellCheck={false} rows={5} value={defectsJson} onChange={event => setDefectsJson(event.target.value)}/></label>
          <p className="nesting-help">Defeitos: lista de objetos com id e outer. As áreas são tratadas como proibidas.</p>
          {error && <div className="nesting-error" role="alert">{error}</div>}
        </div>
        <div className="panel nesting-results">
          <div className="panel-head"><div><span className="eyebrow">RESULTADO</span><h2>Visualização da chapa</h2></div>{result && <span className="status">Estimativa</span>}</div>
          {!result ? <div className="nesting-empty"><Calculator size={26}/><strong>Aguardando cálculo</strong><span>Informe ou carregue as geometrias e calcule para visualizar a distribuição.</span></div> :
            <>
              <div className="nesting-metrics">
                <div><small>Peças alocadas</small><strong>{result.placements.length}</strong></div>
                <div><small>Não alocadas</small><strong>{result.unplaced.length}</strong></div>
                <div><small>Aproveitamento bruto</small><strong>{result.utilizationPercent.toLocaleString("pt-BR")}%</strong></div>
                <div><small>Área alocada</small><strong>{(result.placedAreaMm2 / 1_000_000).toLocaleString("pt-BR",{maximumFractionDigits:3})} m²</strong></div>
              </div>
              {result.sheetsUsed.map(sheet => {
                const placements = result.placements.filter(placement => placement.sheetId === sheet.id);
                return <div className="nesting-sheet" key={sheet.id}>
                  <div className="nesting-sheet-title"><strong>{sheet.id}</strong><span>{sheet.widthMm} × {sheet.heightMm} mm</span></div>
                  <svg className="nesting-svg" viewBox={`0 0 ${sheet.widthMm} ${sheet.heightMm}`} role="img" aria-label={`Distribuição das peças na chapa ${sheet.id}`}>
                    <rect x="0" y="0" width={sheet.widthMm} height={sheet.heightMm} fill="#f8f8f6" stroke="#555" strokeWidth={Math.max(2, sheet.widthMm / 1500)}/>
                    <rect x={sheet.marginMm} y={sheet.marginMm} width={sheet.widthMm - sheet.marginMm * 2} height={sheet.heightMm - sheet.marginMm * 2} fill="none" stroke="#aaa" strokeDasharray="18 12" strokeWidth={Math.max(1, sheet.widthMm / 2200)}/>
                    {sheet.defects.map(defect=><polygon key={defect.id} points={defect.outer.map(point=>`${point.x},${point.y}`).join(" ")} fill="#c96b62" fillOpacity=".55" stroke="#9d3931" strokeWidth={Math.max(2, sheet.widthMm / 1800)}/>)}
                    {placements.map((placement,index)=>{
                      const xs=placement.outer.map(point=>point.x), ys=placement.outer.map(point=>point.y);
                      const centerX=(Math.min(...xs)+Math.max(...xs))/2, centerY=(Math.min(...ys)+Math.max(...ys))/2;
                      return <g key={placement.partId+":"+placement.instance}>
                        <polygon points={placement.outer.map(point=>`${point.x},${point.y}`).join(" ")} fill={colors[index % colors.length]} stroke="#444" strokeWidth={Math.max(2, sheet.widthMm / 1800)} fillRule="evenodd"/>
                        {placement.holes.map((hole,holeIndex)=><polygon key={holeIndex} points={hole.map(point=>`${point.x},${point.y}`).join(" ")} fill="#f8f8f6" stroke="#444" strokeWidth={Math.max(2, sheet.widthMm / 1800)}/>)}
                        <text x={centerX} y={centerY} textAnchor="middle" dominantBaseline="middle" fontSize={Math.max(18, sheet.widthMm / 100)} fill="#292929">{placement.partId}</text>
                      </g>;
                    })}
                  </svg>
                  <div className="nesting-legend"><span><i className="legend-piece"/>Peças</span><span><i className="legend-defect"/>Defeitos / áreas proibidas</span><span><i className="legend-margin"/>Margem</span></div>
                </div>;
              })}
              {result.unplaced.length>0&&<div className="nesting-unplaced"><strong>Peças não alocadas</strong>{result.unplaced.map((item,index)=><p key={item.partId+":"+item.instance}>{item.partId} ({item.instance}) — {item.reason}</p>)}</div>}
              <div className="nesting-warnings"><strong>Limites desta simulação</strong>{result.warnings.map((warning,index)=><p key={index}>• {warning}</p>)}</div>
            </>
          }
        </div>
      </div>
    </section>
  );
}
