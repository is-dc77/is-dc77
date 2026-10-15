export type LocationFailure = 'denied' | 'unavailable' | 'timeout';
// The independent deadline also covers browsers that never invoke a GPS callback.
export function requestLocation(geo: Pick<Geolocation, 'getCurrentPosition'> | undefined, onPosition: (p: GeolocationPosition) => void, onFailure: (reason: LocationFailure) => void) {
    let done = false;
    const finish = (action: () => void) => { if (done)
        return; done = true; clearTimeout(deadline); action(); };
    const deadline = setTimeout(() => finish(() => onFailure('timeout')), 12000);
    if (!geo) {
        finish(() => onFailure('unavailable'));
        return () => { };
    }
    ;
    try {
        geo.getCurrentPosition(p => finish(() => onPosition(p)), e => finish(() => onFailure(e.code === 1 ? 'denied' : e.code === 3 ? 'timeout' : 'unavailable')), { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 });
    }
    catch {
        finish(() => onFailure('unavailable'));
    }
    return () => { done = true; clearTimeout(deadline); };
}
