'use client';
import { useState, useEffect } from 'react';
import { demoData } from './demo-data';
import OfflineMap from './offline-map';
import { matchesGroup } from './group-preference';
import { hasGps } from './route-links';
import { MapPin, Clock, Users, Map, CalendarDays, RefreshCw } from 'lucide-react';
type Salida = {
    id: string;
    territory: string;
    sector: string;
    captain: string;
    group: string;
    meeting: string;
    date: string;
    time: string;
    lat: number | null;
    lng: number | null;
    map: string;
    notes: string;
    directions?: string;
};
function day(offset = 0) { const s = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); const d = new Date(s + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + offset); return d.toISOString().slice(0, 10); }
function format(s: string) { return new Intl.DateTimeFormat('es-CL', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(s + 'T12:00:00Z')); }
export default function Home() {
    const [items, setItems] = useState<Salida[]>([]), [date, setDate] = useState(day()), [large, setLarge] = useState(false), [loading, setLoading] = useState(true), [error, setError] = useState(''), [month, setMonth] = useState(day().slice(0, 7)), [mapOpen, setMapOpen] = useState(0), [mapTerritory, setMapTerritory] = useState(''), [mapMeeting, setMapMeeting] = useState<{
        lat: number | null;
        lng: number | null;
        name: string;
    } | null>(null), [offline, setOffline] = useState(false), [savedAt, setSavedAt] = useState(''), [offlineReady, setOfflineReady] = useState(false), [offlineNote, setOfflineNote] = useState(''), [offlineFailed, setOfflineFailed] = useState(false), [myGroup, setMyGroup] = useState('');
    async function load() { setLoading(true); setError(''); setItems(demoData()); setOffline(!navigator.onLine); setSavedAt(new Date().toISOString()); setLoading(false); }
    async function prepareOffline() { setOfflineFailed(false); setOfflineNote('Guardando app y mapa…'); try {
        if (!('serviceWorker' in navigator))
            throw Error('unsupported');
        const reg = await navigator.serviceWorker.register('/sw.js');
        await Promise.race([navigator.serviceWorker.ready, new Promise((_, reject) => setTimeout(() => reject(Error('timeout')), 30000))]);
        const worker = reg.active;
        if (!worker)
            throw Error('not active');
        const ch = new MessageChannel();
        await new Promise<void>((resolve, reject) => { const timer = setTimeout(() => reject(Error('timeout')), 20000); ch.port1.onmessage = e => { clearTimeout(timer); e.data.ok ? resolve() : reject(Error('cache')); }; worker.postMessage({ type: 'CHECK_OFFLINE' }, [ch.port2]); });
        setOfflineReady(true);
        setOfflineNote('App y mapa guardados en este celular.');
        try {
            localStorage.setItem('territorios-demo-offline-ready', 'yes');
        }
        catch { }
    }
    catch (e) {
        setOfflineReady(false);
        setOfflineFailed(true);
        setOfflineNote('No se pudo guardar la app en este navegador. Abre el enlace en Safari o Chrome e inténtalo allí. También puedes guardar una imagen del mapa.');
        console.info('Offline preparation failed', e instanceof Error ? e.message : 'unknown');
    } }
    useEffect(() => { try {
        const group = localStorage.getItem('territorios-demo-my-group');
        if (group && /^[1-6]$/.test(group))
            setMyGroup(group);
    }
    catch { } load(); setOffline(!navigator.onLine); const on = () => { setOffline(false); load(); }, off = () => setOffline(true); window.addEventListener('online', on); window.addEventListener('offline', off); if (navigator.onLine)
        prepareOffline();
    else {
        try {
            setOfflineReady(localStorage.getItem('territorios-demo-offline-ready') === 'yes');
        }
        catch { }
    } return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); }; }, []);
    const first = new Date(month + '-01T12:00:00Z');
    const blanks = (first.getUTCDay() + 6) % 7;
    const totalDays = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    const monthName = new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(first);
    function changeMonth(offset: number) { const d = new Date(month + '-01T12:00:00Z'); d.setUTCMonth(d.getUTCMonth() + offset); const m = d.toISOString().slice(0, 7); setMonth(m); setDate(m + '-01'); setMapTerritory(''); setMapMeeting(null); }
    function showMap(i: Salida) { setMapOpen(n => n + 1); setMapTerritory(i.territory.match(/^Territorio (\d+[A-Z]?)$/i)?.[1].toUpperCase() || ''); setMapMeeting({ lat: i.lat, lng: i.lng, name: i.meeting }); }
    function chooseGroup(group: string) { setMyGroup(group); setMapTerritory(''); setMapMeeting(null); try {
        localStorage.setItem('territorios-demo-my-group', group);
    }
    catch { } }
    const shown = items.filter(i => i.date === date && matchesGroup(i.group, myGroup)).sort((a, b) => a.time.localeCompare(b.time));
    return <div className={large ? 'app large' : 'app'}><header><div className="header-inner"><div className="brand"><MapPin size={27}/><span>Territorios · Demo</span></div><button className="text-size" onClick={() => setLarge(!large)} aria-pressed={large}>A<span>+</span><small>Letra</small></button></div></header><main><><div className="heading"><span className="section-label">PREDICACIÓN</span><h1>Salidas a la predicación</h1><p>Datos ficticios para explorar el calendario, los grupos y el mapa. No usar para coordinar salidas reales.</p></div><details className="offline-banner"><summary><span>{offline ? 'Sin conexión · mostrando lo guardado' : offlineReady ? 'Mapa disponible sin conexión' : offlineFailed ? 'Guardado sin conexión pendiente' : 'Preparando uso sin conexión…'}</span></summary>{savedAt && <small>Salidas guardadas: {new Date(savedAt).toLocaleString('es-CL')}</small>}{offlineNote && <small>{offlineNote}</small>}<button disabled={offline} onClick={prepareOffline}>Guardar para usar sin conexión</button>{offlineFailed && <a className="external-app" href="/" target="_blank" rel="noopener">Abrir app fuera de esta vista</a>}</details><div className="group-preference"><label htmlFor="my-group">Mi grupo<select id="my-group" value={myGroup} onChange={e => chooseGroup(e.target.value)}><option value="">Todos los grupos</option>{[1, 2, 3, 4, 5, 6].map(g => <option key={g} value={String(g)}>Grupo {g}</option>)}</select></label><p>{myGroup ? 'Ves las salidas del grupo ' + myGroup + ' y las salidas generales.' : 'Elige tu grupo para encontrar sus salidas más rápido.'}</p></div><div className="calendar"><div className="month-nav"><button onClick={() => changeMonth(-1)} aria-label="Mes anterior">‹</button><h2>{monthName}</h2><button onClick={() => changeMonth(1)} aria-label="Mes siguiente">›</button></div><div className="calendar-grid">{['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => <span className="weekday" key={d}>{d}</span>)}{Array.from({ length: blanks }, (_, i) => <span key={'blank' + i}/>)}{Array.from({ length: totalDays }, (_, i) => { const d = month + '-' + String(i + 1).padStart(2, '0'); const count = items.filter(r => r.date === d && matchesGroup(r.group, myGroup)).length; return <button key={d} aria-label={format(d) + ', ' + count + ' salidas'} aria-pressed={date === d} className={(date === d ? 'selected ' : '') + (d === day() ? 'today' : '')} onClick={() => { setDate(d); setMapTerritory(''); setMapMeeting(null); }}>{i + 1}<span className={count ? 'dot' : 'no-dot'} aria-hidden="true"/></button>; })}</div><p className="calendar-caption">Los días con punto tienen salidas programadas.</p></div><OfflineMap territory={mapTerritory} meeting={mapMeeting} openRequest={mapOpen}/><div className="date-heading"><h2>{format(date)}</h2><button className="refresh" onClick={load} aria-label="Actualizar salidas"><RefreshCw size={19}/></button></div>{loading ? <div className="empty">Cargando salidas…</div> : error ? <div className="empty"><p role="alert">{error}</p><button className="primary" onClick={load}>Volver a intentar</button></div> : shown.length === 0 ? <div className="empty"><CalendarDays size={42}/><h3>No hay salidas programadas para este día.</h3><p>{myGroup ? 'No hay salidas registradas para el grupo ' + myGroup + ' en esta fecha.' : 'Las salidas aparecerán aquí cuando la administradora las agregue.'}</p>{myGroup && <button className="secondary" onClick={() => chooseGroup('')}>Ver todos los grupos</button>}</div> : <div className="cards">{shown.map(i => <article className="card" key={i.id}><div className="card-top"><span className="group"><Users size={17}/>{i.group}</span><span className="time"><Clock size={20}/>{i.time} h</span></div><h3>{i.territory}</h3><p className="sector">{i.sector}</p><div className="meeting"><MapPin /><div><span className="label">Punto de encuentro</span><strong>{i.meeting}</strong></div></div><div className="captain"><Users /><div><span className="label">Capitán de grupo</span><strong>{i.captain}</strong></div></div>{i.directions && <div className="arrival-directions"><span className="label">Indicaciones para llegar</span><p>{i.directions}</p></div>}{i.notes && <p className="notes">{i.notes}</p>}{i.meeting !== 'Zoom' && <button className="primary" onClick={() => showMap(i)}><Map size={23}/>Ver mapa</button>}{!hasGps(i.lat, i.lng) && <p className="label gps-pending">{i.meeting === 'Zoom' ? 'Reunión por Zoom.' : 'Ubicación GPS por confirmar.'}</p>}</article>)}</div>}</><footer><span>Demostración · Datos ficticios</span></footer></main></div>;
}
