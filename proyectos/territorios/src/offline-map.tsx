'use client';
import { useState, useRef, useEffect } from 'react';
import { Plus, Minus, Maximize, Minimize, LocateFixed, ArrowLeft } from 'lucide-react';
import shapes from './territory-shapes.json';
import base from '../public/roads-data.json';
import MapRoute from './map-route';
import { hasGps } from './route-links';
import { requestLocation } from './current-location';
const project = (lng: number, lat: number) => [lng * 10000, -Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) * 180 / Math.PI * 10000];
const polygons = shapes.map(a => { const rings = a.rings.map(r => r.map(c => project(c[0], c[1]))); const ps = rings.flat(); const xs = ps.map(c => c[0]), ys = ps.map(c => c[1]); const box = [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)]; return { ...a, rings, box, center: [box[0] + box[2] / 2, box[1] + box[3] / 2] }; });
const roads = base.roads.map(r => ({ ...r, points: r.coords.map(c => project(c[0], c[1])) }));
const waters = base.water.map(r => ({ ...r, points: r.coords.map(c => project(c[0], c[1])) }));
const places = base.places.map(p => ({ ...p, point: project(p.coords[0], p.coords[1]) }));
const major = (kind: string) => ['motorway', 'trunk', 'primary', 'secondary', 'tertiary'].includes(kind);
const all = polygons.flatMap(p => p.rings.flat());
const ax = all.map(p => p[0]), ay = all.map(p => p[1]);
const bounds = [Math.min(...ax), Math.min(...ay), Math.max(...ax) - Math.min(...ax), Math.max(...ay) - Math.min(...ay)];
function padded(b: number[], point?: number[]) { let [x, y, w, h] = b; if (point) {
    let right = Math.max(x + w, point[0]), bottom = Math.max(y + h, point[1]);
    x = Math.min(x, point[0]);
    y = Math.min(y, point[1]);
    w = right - x;
    h = bottom - y;
} let size = Math.max(w, h) * 1.25; return [x + w / 2 - size / 2, y + h / 2 - size / 2, size, size]; }
export default function OfflineMap({ territory, meeting, openRequest = 0 }: {
    openRequest?: number;
    territory: string;
    meeting: {
        lat: number | null;
        lng: number | null;
        name: string;
    } | null;
}) {
    const [selected, setSelected] = useState(territory), [box, setBox] = useState(padded(bounds)), [full, setFull] = useState(false), [location, setLocation] = useState<number[] | null>(null), [status, setStatus] = useState(''), [saving, setSaving] = useState(false), [locating, setLocating] = useState(false);
    const cancelLocation = useRef<(() => void) | null>(null);
    const drag = useRef<{
        x: number;
        y: number;
        box: number[];
    } | null>(null);
    const area = useRef<HTMLDivElement>(null);
    const focus = (name: string) => { setSelected(name); const matches = polygons.filter(p => p.name === name || (/^\d+$/.test(name) && new RegExp('^' + name + '[A-Z]$').test(p.name))); const p = matches[0]; const merged = matches.length > 1 ? [Math.min(...matches.map(p => p.box[0])), Math.min(...matches.map(p => p.box[1])), Math.max(...matches.map(p => p.box[0] + p.box[2])) - Math.min(...matches.map(p => p.box[0])), Math.max(...matches.map(p => p.box[1] + p.box[3])) - Math.min(...matches.map(p => p.box[1]))] : p?.box; const pin = meeting?.lat != null && meeting.lng != null ? project(meeting.lng, meeting.lat) : undefined; setBox(padded(merged || bounds, pin)); };
    useEffect(() => { focus(territory); }, [territory, meeting?.lat, meeting?.lng]);
    useEffect(() => { if (openRequest > 0) {
        focus(territory);
        setFull(true);
        setStatus('');
    } }, [openRequest]);
    useEffect(() => { if (!full)
        return; const close = (e: KeyboardEvent) => { if (e.key === 'Escape')
        setFull(false); }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, [full]);
    useEffect(() => { if (!full)
        return; const old = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = old; }; }, [full]);
    useEffect(() => () => cancelLocation.current?.(), []);
    function locate() {
        cancelLocation.current?.();
        setLocating(true);
        setStatus('Buscando tu ubicación…');
        cancelLocation.current = requestLocation(navigator.geolocation, p => {
            setLocating(false);
            const loc = project(p.coords.longitude, p.coords.latitude);
            setLocation(loc);
            setBox(padded([loc[0] - 100, loc[1] - 100, 200, 200]));
            setStatus('Tu ubicación es el punto azul. Precisión aproximada: ' + Math.round(p.coords.accuracy) + ' m.');
        }, reason => { setLocating(false); setStatus(reason === 'denied' ? 'No hay permiso para usar tu ubicación. Permite la ubicación del celular para mostrar el punto azul.' : reason === 'timeout' ? 'No pudimos obtener tu ubicación. El mapa y el punto de encuentro siguen disponibles.' : 'No se pudo obtener tu ubicación. Revisa que la ubicación del celular esté activada.'); });
    }
    const zoom = (scale: number) => setBox(b => [b[0] + b[2] * (1 - scale) / 2, b[1] + b[3] * (1 - scale) / 2, b[2] * scale, b[3] * scale]);
    const unit = box[2] / 550;
    const pin = meeting?.lat != null && meeting.lng != null ? project(meeting.lng, meeting.lat) : null;
    const inBox = (p: number[]) => p[0] > box[0] && p[0] < box[0] + box[2] && p[1] > box[1] && p[1] < box[1] + box[3];
    const detailed = box[2] < 900;
    const taken: {
        x: number;
        y: number;
        w: number;
        h: number;
    }[] = [];
    function labelAllowed(point: number[], text: string, height: number, minWidth = 0) { if (!inBox(point))
        return false; const x = (point[0] - box[0]) / unit, y = (point[1] - box[1]) / unit, w = Math.max(minWidth, text.length * height * .54), h = height + 7; const overlapping = taken.some(t => Math.abs(t.x - x) < (t.w + w) / 2 + 5 && Math.abs(t.y - y) < (t.h + h) / 2 + 5); if (overlapping)
        return false; taken.push({ x, y, w, h }); return true; }
    const townLabels = places.filter(p => ['town', 'village'].includes(p.kind)).filter(p => labelAllowed(p.point, p.name, 14));
    const territoryLabels = [...polygons].sort((a, b) => Number(b.name === selected) - Number(a.name === selected)).filter(p => labelAllowed(p.center, p.name, 17, 44));
    const placeLabels = places.filter(p => !['town', 'village'].includes(p.kind) && (detailed || (!p.name.startsWith('Comunidad') && p.kind === 'hamlet'))).filter(p => labelAllowed(p.point, p.name, 12));
    function inside(point: number[], ring: number[][]) { let yes = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const a = ring[i], b = ring[j];
        if ((a[1] > point[1]) !== (b[1] > point[1]) && point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0])
            yes = !yes;
    } return yes; }
    const lakeLabels = waters.filter(w => w.kind === 'area' && w.name).flatMap(w => { const candidates = []; for (let y = 1; y < 5; y++)
        for (let x = 1; x < 5; x++) {
            const pt = [box[0] + box[2] * x / 5, box[1] + box[3] * y / 5];
            if (inside(pt, w.points))
                candidates.push(pt);
        } const point = candidates[Math.floor(candidates.length / 2)]; return point && labelAllowed(point, w.name, 13) ? [{ name: w.name, point }] : []; });
    const roadNames = new Set<string>();
    const roadLabels = roads.flatMap(r => { const name = r.ref || r.name; if (!name || (!detailed && !major(r.kind)) || roadNames.has(name))
        return []; const visible = r.points.filter(inBox); if (visible.length < 2)
        return []; const middle = visible[Math.floor(visible.length / 2)]; if (!labelAllowed(middle, name, 10))
        return []; roadNames.add(name); return [{ name, point: middle }]; });
    async function saveImage() { setSaving(true); setStatus('Preparando imagen del mapa…'); try {
        const svg = area.current?.querySelector('svg[role="img"]');
        if (!svg)
            throw Error();
        const copy = svg.cloneNode(true) as SVGSVGElement;
        copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        copy.setAttribute('width', '1400');
        copy.setAttribute('height', '1400');
        const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)], { type: 'image/svg+xml;charset=utf-8' }));
        const img = new Image();
        await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = () => reject(Error()); img.src = url; });
        const canvas = document.createElement('canvas');
        canvas.width = 1400;
        canvas.height = 1570;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            throw Error();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1400, 1570);
        ctx.fillStyle = '#365d94';
        ctx.font = 'bold 36px Arial';
        ctx.fillText('Territorios · Demo' + (selected ? ' · Territorio ' + selected : ''), 35, 55);
        ctx.drawImage(img, 0, 85, 1400, 1400);
        ctx.fillStyle = '#40596e';
        ctx.font = '22px Arial';
        ctx.fillText('© OpenStreetMap contributors · ODbL · Límites: mapa de Bordelago', 35, 1520);
        if (meeting?.name) {
            ctx.font = '20px Arial';
            ctx.fillText('Encuentro: ' + meeting.name, 35, 1555);
        }
        URL.revokeObjectURL(url);
        const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(Error()), 'image/png'));
        const file = new File([blob], 'Bordelago-' + (selected || 'todos') + '.png', { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ files: [file], title: 'Mapa de Territorios · Demo' });
            setStatus('Puedes guardar la imagen en Fotos o Archivos para verla sin internet.');
        }
        else {
            const download = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = download;
            a.download = file.name;
            a.click();
            setTimeout(() => URL.revokeObjectURL(download), 30000);
            setStatus('Imagen descargada. Consérvala para ver el mapa sin internet.');
        }
    }
    catch (e) {
        setStatus(e instanceof DOMException && e.name === 'AbortError' ? 'No se guardó la imagen.' : 'No se pudo guardar la imagen. Inténtalo abriendo la app en Safari o Chrome.');
    }
    finally {
        setSaving(false);
    } }
    return <section className={'local-map ' + (full ? 'map-full' : '')} id="mapa-territorios" ref={area}><div className="map-heading"><h2>{selected ? 'Territorio ' + selected : 'Mapa de territorios'}</h2><button onClick={() => setFull(!full)} aria-label={full ? 'Cerrar pantalla completa' : 'Ampliar mapa'}>{full ? <ArrowLeft /> : <Maximize />}<span>{full ? 'Volver' : 'Ampliar mapa'}</span></button></div><details className="map-options"><summary>Elegir otro territorio</summary><div className="map-select"><label>Territorio<select value={selected} onChange={e => focus(e.target.value)}><option value="">Todos los territorios</option>{selected && !polygons.some(p => p.name === selected) && <option value={selected}>Territorio {selected} · por precisar</option>}{polygons.map(p => <option key={p.name} value={p.name}>Territorio {p.name}</option>)}</select></label></div></details><div className="map-canvas"><svg style={{ fontFamily: 'Arial, sans-serif' }} viewBox={box.join(' ')} role="img" aria-label={'Mapa de límites de territorios. ' + (selected ? 'Territorio ' + selected : 'Todos los territorios')} onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, box: [...box] }; }} onPointerMove={e => { if (!drag.current)
        return; const rect = e.currentTarget.getBoundingClientRect(); const d = drag.current; const factor = d.box[2] / Math.min(rect.width, rect.height); setBox([d.box[0] - (e.clientX - d.x) * factor, d.box[1] - (e.clientY - d.y) * factor, d.box[2], d.box[3]]); }} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}><rect x={box[0]} y={box[1]} width={box[2]} height={box[3]} fill="#f1f3ed"/>{waters.map((w, i) => w.kind === 'area' ? <polygon key={'water' + i} points={w.points.map(p => p.join(',')).join(' ')} fill="#b9dced" stroke="#93bfda" strokeWidth={unit * .6}/> : <polyline key={'water' + i} points={w.points.map(p => p.join(',')).join(' ')} fill="none" stroke="#90bbd8" strokeWidth={unit * 1.1}/>)}{polygons.map((p, i) => <g key={p.name}>{p.rings.map((r, j) => <polygon key={j} points={r.map(c => c.join(',')).join(' ')} fill={p.name === selected || (/^\d+$/.test(selected) && new RegExp('^' + selected + '[A-Z]$').test(p.name)) ? '#6b91cb' : '#c1d0de'} fillOpacity={p.name === selected ? .24 : .12} stroke={p.name === selected ? '#244d8a' : '#829ab2'} strokeWidth={unit * (p.name === selected ? 2.8 : 1)}/>)}</g>)}{roads.filter(r => detailed || major(r.kind) || r.kind === 'unclassified').map(r => <g key={r.id}><polyline points={r.points.map(p => p.join(',')).join(' ')} fill="none" stroke={major(r.kind) ? '#c6a36c' : '#b9b8ad'} strokeWidth={unit * (major(r.kind) ? 4 : 2.4)} strokeLinejoin="round" strokeLinecap="round"/><polyline points={r.points.map(p => p.join(',')).join(' ')} fill="none" stroke={major(r.kind) ? '#fff0c7' : '#fff'} strokeWidth={unit * (major(r.kind) ? 2.6 : 1.3)} strokeLinejoin="round" strokeLinecap="round"/></g>)}{territoryLabels.map(p => <g key={'label' + p.name}><rect x={p.center[0] - unit * 22} y={p.center[1] - unit * 13} width={unit * 44} height={unit * 26} rx={unit * 6} fill={p.name === selected ? '#365d94' : 'white'} stroke="#a2b6c9" strokeWidth={unit * .8}/><text x={p.center[0]} y={p.center[1]} textAnchor="middle" dominantBaseline="middle" fontSize={unit * 17} fontWeight="bold" fill={p.name === selected ? 'white' : '#29415d'}>{p.name}</text></g>)}{[...townLabels, ...placeLabels].map(p => <text key={p.name} x={p.point[0]} y={p.point[1]} textAnchor="middle" fontSize={unit * 12} fontWeight="bold" fill="#496149" stroke="#fff" strokeWidth={unit * 3} paintOrder="stroke">{p.name}</text>)}{lakeLabels.map(p => <text key={p.name} x={p.point[0]} y={p.point[1]} textAnchor="middle" fontSize={unit * 13} fontStyle="italic" fill="#35759b" stroke="#e5f5ff" strokeWidth={unit * 2} paintOrder="stroke">{p.name}</text>)}{roadLabels.map((r, i) => <text key={'roadlabel' + i} x={r.point[0]} y={r.point[1]} textAnchor="middle" fontSize={unit * 10} fill="#5b5341" stroke="#fff" strokeWidth={unit * 3} paintOrder="stroke">{r.name}</text>)}{pin && <g><circle cx={pin[0]} cy={pin[1]} r={unit * 12} fill="#b53924" stroke="white" strokeWidth={unit * 3}/><text x={pin[0]} y={pin[1] - unit * 20} textAnchor="middle" fontSize={unit * 14} fontWeight="bold" stroke="white" strokeWidth={unit * 4} paintOrder="stroke" fill="#902719">Encuentro</text></g>}{location && <circle cx={location[0]} cy={location[1]} r={unit * 8} fill="#1474d2" stroke="white" strokeWidth={unit * 3}/>}<text x={box[0] + unit * 20} y={box[1] + unit * 30} fontSize={unit * 16} fontWeight="bold" fill="#40596e">N ↑</text></svg></div><div className="map-controls"><button aria-label="Acercar mapa" onClick={() => zoom(.65)}><Plus /><span>Acercar</span></button><button aria-label="Alejar mapa" onClick={() => zoom(1.5)}><Minus /><span>Alejar</span></button><button aria-label={locating ? "Buscando tu ubicación" : "Mostrar mi ubicación"} aria-busy={locating} disabled={locating} onClick={locate}><LocateFixed /><span>{locating ? 'Buscando…' : 'Mi ubicación'}</span></button></div><div className="map-legend"><span><i className="legend-territory"/>Territorio</span>{pin && <span><i className="legend-meeting"/>Encuentro</span>}{location && <span><i className="legend-location"/>Mi ubicación</span>}</div>{meeting && <div className="map-meeting"><span className="label">Punto de encuentro</span><strong>{meeting.name}</strong>{hasGps(meeting.lat, meeting.lng) ? <><MapRoute lat={meeting.lat!} lng={meeting.lng!} name={meeting.name}/><p className="map-caption">La ruta necesita internet.</p></> : <p className="map-caption">Ubicación GPS por confirmar.</p>}</div>}<p className="map-caption">Mueve el mapa con el dedo. Toca «Acercar» para ver los caminos.{pin && <> Punto rojo: {meeting?.name}.</>}</p><p className="map-caption" role="status">{status || 'Caminos y sectores guardados con el mapa. Puedes consultar este mapa sin internet una vez guardado.'}</p><details className="map-save"><summary>Guardar una imagen del mapa</summary><button className="secondary save-map-image" disabled={saving} onClick={saveImage}>{saving ? 'Preparando imagen…' : 'Guardar imagen del mapa'}</button></details><div className="map-attribution"><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap contributors · ODbL</a> · <a href="/roads-data.json" download>Datos del mapa</a></div></section>;
}
