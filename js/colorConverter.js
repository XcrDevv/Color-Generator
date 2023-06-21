export function convertToHsva (r, g, b, a) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return { a: Math.round(h * 360), b: Math.round(percentRoundFn(s * 100)), c: Math.round(percentRoundFn(v * 100)), d: a};
}

export function convertToHsla(r, g, b, a) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h, s;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
    h /= 6;
    }
    return { a: Math.round(h*360), b: Math.round(s*100), c: Math.round(l*100), d: a}
}

export function convertToHex(r, g, b, a) {
    const alpha = Math.round(a * 255);
    const hex = (r << 16 | g << 8 | b).toString(16);
    const paddedHex = ('000000' + hex).slice(-6);
    const alphaHex = ('00' + alpha.toString(16)).slice(-2);
    const result = [paddedHex.slice(0,2), paddedHex.slice(2,4), paddedHex.slice(4), alphaHex];
    return result;
}

export function convertHsvaToRgba(h, s, v, a) {
    h = (h % 360) / 360;
    s = s / 100;
    v = v / 100; 
    let c = v * s;
    let x = c * (1 - Math.abs((h * 6) % 2 - 1));
    let m = v - c;
    let r, g, b;
    if (h < 1 / 6) {
        r = c;
        g = x;
        b = 0;
    } else if (h < 2 / 6) {
        r = x;
        g = c;
        b = 0;
    } else if (h < 3 / 6) {
        r = 0;
        g = c;
        b = x;
    } else if (h < 4 / 6) {
        r = 0;
        g = x;
        b = c;
    } else if (h < 5 / 6) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    a = Math.max(0, Math.min(1, a));
    return { a: r, b: g, c: b, d: a };
}

export function convertHslaToRgba(h, s, l, a) {
    h /= 360;
    s /= 100;
    l /= 100;  
    let r, g, b;
    if (s === -0) {
        r = g = b = l;
    } else {
        const hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };      
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = Math.round(255 * hue2rgb(p, q, h + 1 / 3));
        g = Math.round(255 * hue2rgb(p, q, h));
        b = Math.round(255 * hue2rgb(p, q, h - 1 / 3));
    }
    return { a: r, b: g, c: b, d: a };
}

export const convertAllToRgba = {
    rgba: (obj) => (obj), 
    hsva: (obj) => (convertHsvaToRgba(...Object.values(obj))), 
    hsla: (obj) => (convertHslaToRgba(...Object.values(obj))), 
    hex:  (obj) => (obj),  
};

export const convertRgbaToModes = {
    rgba: (obj) => (obj), 
    hsva: (obj) => (convertToHsva(...Object.values(obj))), 
    hsla: (obj) => (convertToHsla(...Object.values(obj))), 
    hex:  (obj) => (obj),  
}