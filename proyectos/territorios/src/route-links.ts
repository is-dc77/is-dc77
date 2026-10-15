export function hasGps(lat: unknown, lng: unknown): boolean {
    return typeof lat === 'number' && Number.isFinite(lat) && lat >= -90 && lat <= 90 && typeof lng === 'number' && Number.isFinite(lng) && lng >= -180 && lng <= 180;
}
export function googleRoute(lat: number, lng: number): string {
    const params = new URLSearchParams({ api: '1', destination: `${lat},${lng}`, travelmode: 'driving', dir_action: 'navigate' });
    return 'https://www.google.com/maps/dir/?' + params;
}
export function googlePlace(lat: number, lng: number): string {
    return 'https://www.google.com/maps/search/?' + new URLSearchParams({ api: '1', query: `${lat},${lng}` });
}
export function appleRoute(lat: number, lng: number): string {
    return 'https://maps.apple.com/directions?' + new URLSearchParams({ destination: `${lat},${lng}`, mode: 'driving' });
}
export function googleIOSRoute(lat: number, lng: number): string {
    return 'comgooglemaps://?' + new URLSearchParams({ saddr: '', daddr: `${lat},${lng}`, directionsmode: 'driving' });
}
export function appleIOSRoute(lat: number, lng: number): string {
    return 'maps://?' + new URLSearchParams({ daddr: `${lat},${lng}`, dirflg: 'd' });
}
