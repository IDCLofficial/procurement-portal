import geoip from 'geoip-lite';
import { LoginHistory } from 'src/types/types';

export async function parseUserAgent(userAgent: string) {
    const deviceType = /mobile/i.test(userAgent) ? 'Mobile' 
        : /tablet/i.test(userAgent) ? 'Tablet' 
        : 'Desktop';

    let device = 'Unknown Device';
    
    if (/Windows/i.test(userAgent)) device = 'Windows PC';
    else if (/Macintosh/i.test(userAgent)) device = 'Mac';
    else if (/iPhone/i.test(userAgent)) device = 'iPhone';
    else if (/iPad/i.test(userAgent)) device = 'iPad';
    else if (/Android/i.test(userAgent)) device = 'Android Device';
    else if (/Linux/i.test(userAgent)) device = 'Linux PC';

    return { device, deviceType };
}


export async function enrichWithLocation(
    loginData: Partial<LoginHistory>
): Promise<Partial<LoginHistory>> {
    const geo = geoip.lookup(loginData.ip || '');
    
    const location = geo 
        ? `${geo.city || 'Unknown'}, ${geo.country || 'Unknown'}`
        : 'Unknown Location';

    return {
        ...loginData,
        location
    };
}