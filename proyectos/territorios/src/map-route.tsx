'use client';
import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { googleRoute, appleRoute } from './route-links';
export default function MapRoute({ lat, lng, name }: {
    lat: number;
    lng: number;
    name: string;
}) {
    const [ios, setIOS] = useState(false), [attempted, setAttempted] = useState(false);
    useEffect(() => setIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)), []);
    return <><a className="primary map-directions" target="_blank" rel="noopener noreferrer" onClick={() => setAttempted(true)} href={ios ? appleRoute(lat, lng) : googleRoute(lat, lng)} aria-label={'Cómo llegar a ' + name}><MapPin size={23}/>Cómo llegar</a>{attempted && <p className="map-caption" role="status">Si no se abre, abre Territorios · Demo en Safari o Chrome y toca «Cómo llegar» allí.</p>}</>;
}
