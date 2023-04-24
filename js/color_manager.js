const actualColor = [0, 0, 0, 0];
const colorModes = {
    rgba: { a: 0, b: 0, c: 0, d: 0 },
    hsva: { a: 0, b: 0, c: 0, d: 0 },
    hsla: { a: 0, b: 0, c: 0, d: 0 },
    hex:  { a: 0, b: 0, c: 0, d: 0 }
};

const formatTxt = 'Format: '
const formatsSelector = ['F(n°)', 'n°', 'n', ' F(n)']
let formatPointer = 0

const themeColors = [
    'rgb(252, 89, 25)',
    'rgb(151, 66, 255)',
    'rgb(226, 34, 69)',
    'rgb(0, 230, 200)',
    'rgb(0, 230, 122)',
]

colorModes.hsva = convertToHsva(...Object.values(colorModes.rgba));
colorModes.hsla = convertToHsla(...Object.values(colorModes.rgba));
colorModes.hex  = convertToHex(...Object.values(colorModes.rgba));
setGradients()

let actualMode = current_page = document.querySelector('.modes .mode.is-active').dataset.mode;
const sliders = document.querySelectorAll('input[type="range"]');
const tab_switchers = document.querySelectorAll('[data-switcher]');
const circle = document.getElementById('circle');

const box = document.getElementById('box');
const copyButton = document.getElementById('copy-btn');
const checkIco = document.getElementById('check-ico');

const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const formatText = document.getElementById('format');
const root = document.documentElement;



const setColors = document.querySelectorAll('.theme')
setColors.forEach(setColor => {
    p = setColor.getAttribute("color-value")
    setColor.style.background = themeColors[p]
});



const themesC = document.querySelectorAll('.theme-c')
themesC.forEach(theme => {
    theme.addEventListener('mouseover', ()=> {
        theme.querySelector('.theme').classList.add('hover-color');
    });

    theme.addEventListener('mouseout', ()=> {
        theme.querySelector('.theme').classList.remove('hover-color');
    });

    theme.addEventListener('click', ()=> {
        document.querySelector('.active-color').classList.remove('active-color');
        clr = theme.querySelector('.theme');
        clr.classList.add('active-color');
        root.style.setProperty('--themeColor', themeColors[clr.getAttribute("color-value")]);
    });
});




setTextFormat();
prevButton.addEventListener('click', () => {
    formatPointer = (formatPointer === 0) ? formatsSelector.length - 1 : formatPointer - 1;
    updateSelectors();
});
  
nextButton.addEventListener('click', () => {
    formatPointer = (formatPointer === formatsSelector.length - 1) ? 0 : formatPointer + 1;
    updateSelectors();
});

function updateSelectors(){
    setTextFormat();
    setActualMode();
}

copyButton.addEventListener('click', async () => {
    box.select();
    try {
        copyText = new String(box.value);
        await navigator.clipboard.writeText(copyText);
        window.getSelection().removeAllRanges();

        checkIco.classList.remove('check-ico-0');
        checkIco.classList.add('check-ico-1');
        
        setTimeout(() => {
            checkIco.classList.remove('check-ico-1');
            checkIco.classList.add('check-ico-0');
        }, 1000);

    } catch (err) {
        alert('Error al copiar el texto: ', err);
    }
});



tab_switchers.forEach(tab_switcher => {
    tab_switcher.addEventListener('click', ()=> {
        setTimeout(() => {
            const current_page = document.querySelector('.modes .mode.is-active');
            actualMode = current_page.dataset.mode;
            setActualMode()
        }, 1);
    });
});




const modes = {
    1: (a, b, c, d) => {a.value = actualColor[0]; b.value = actualColor[1]; c.value = actualColor[2]; d.value = actualColor[3];},
    2: (a, b, c, d) => {new_color = convertToHsva(actualColor[0], actualColor[1], actualColor[2], actualColor[3]); a.value = new_color.a; b.value = new_color.b; c.value = new_color.c; d.value = new_color.d;},
    3: (a, b, c, d) => {new_color = convertToHsla(actualColor[0], actualColor[1], actualColor[2], actualColor[3]); a.value = new_color.a; b.value = new_color.b; c.value = new_color.c; d.value = new_color.d;},
    4: (a, b, c, d) => {a.value = actualColor[0]; b.value = actualColor[1]; c.value = actualColor[2]; d.value = actualColor[3];}
}
sliders.forEach(slider => {
    slider.addEventListener('input', () => {
        setActualMode()
        inactive_modes = document.querySelectorAll('.modes .mode:not(.is-active)');
        
        inactive_modes.forEach(inactive_mode => {
            inactive_mode_mode = inactive_mode.dataset.mode;
            const i_a = inactive_mode.querySelector('#a');
            const i_b = inactive_mode.querySelector('#b');
            const i_c = inactive_mode.querySelector('#c');
            const i_d = inactive_mode.querySelector('#d');
            modes[inactive_mode_mode](i_a, i_b, i_c, i_d);
        });
        circle.style.background = `rgba(${actualColor[0]}, ${actualColor[1]}, ${actualColor[2]}, ${actualColor[3]})`;
        setGradients()
    });
});

function setTextFormat() {
    formatText.textContent = formatTxt + formatsSelector[formatPointer];
}

function setActualMode(){
    const current_mode = document.querySelector(`[data-mode="${actualMode}"]`);

    const c_a = current_mode.querySelector('#a');
    const c_b = current_mode.querySelector('#b');
    const c_c = current_mode.querySelector('#c');
    const c_d = current_mode.querySelector('#d');
    
    if (actualMode == 1) {
        actualColor[0] = parseInt(c_a.value);
        actualColor[1] = parseInt(c_b.value);
        actualColor[2] = parseInt(c_c.value);
        actualColor[3] = parseFloat(c_d.value);
        c = actualColor
        switch (formatPointer) {
            case 0: 
                box.value = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;
                break;
            case 1:
                box.value = `${c[0]}, ${c[1]}, ${c[2]}, ${c[3]}`;
                break;
            case 2:
                box.value = `${c[0]} ${c[1]} ${c[2]} ${c[3]}`;
                break;
            case 3:
                box.value = `rgba(${c[0]} ${c[1]} ${c[2]} ${c[3]})`;
                break;
        }
    }
    else if (actualMode == 2) {
        tc = [parseInt(c_a.value), parseInt(c_b.value), parseInt(c_c.value), parseFloat(c_d.value)]
        new_color = convertHsvaToRgba(parseInt(c_a.value), parseInt(c_b.value), parseInt(c_c.value), parseFloat(c_d.value));
        actualColor[0] = new_color.a;
        actualColor[1] = new_color.b;
        actualColor[2] = new_color.c;
        actualColor[3] = new_color.d;
        c = actualColor
        switch (formatPointer) {
            case 0: 
                box.value = `hsva(${tc[0]}°, ${tc[1]}%, ${tc[2]}%, ${tc[3]})`;
                break;
            case 1:
                box.value = `${tc[0]}°, ${tc[1]}%, ${tc[2]}%, ${tc[3]}`;
                break;
            case 2:
                box.value = `${tc[0]} ${tc[1]} ${tc[2]} ${tc[3]}`;
                break;
            case 3:
                box.value = `hsva(${tc[0]} ${tc[1]} ${tc[2]} ${tc[3]})`;
                break;
        }
    }
    else if (actualMode == 3) {
        tc = [parseInt(c_a.value), parseInt(c_b.value), parseInt(c_c.value), parseFloat(c_d.value)]
        new_color = convertHslaToRgba(parseInt(c_a.value), parseInt(c_b.value), parseInt(c_c.value), parseFloat(c_d.value));
        actualColor[0] = new_color.a;
        actualColor[1] = new_color.b;
        actualColor[2] = new_color.c;
        actualColor[3] = new_color.d;
        c = actualColor
        switch (formatPointer) {
            case 0: 
                box.value = `hsla(${tc[0]}°, ${tc[1]}%, ${tc[2]}%, ${tc[3]})`;
                break;
            case 1:
                box.value = `${tc[0]}°, ${tc[1]}%, ${tc[2]}%, ${tc[3]}`;
                break;
            case 2:
                box.value = `${tc[0]} ${tc[1]} ${tc[2]} ${tc[3]}`;
                break;
            case 3:
                box.value = `hsla(${tc[0]} ${tc[1]} ${tc[2]} ${tc[3]})`;
                break;
        }
    }
    else if (actualMode == 4) {
        actualColor[0] = parseInt(c_a.value);
        actualColor[1] = parseInt(c_b.value);
        actualColor[2] = parseInt(c_c.value);
        actualColor[3] = parseFloat(c_d.value);
        pre_c = actualColor
        c = convertToHex(parseInt(pre_c[0]), parseInt(pre_c[1]), parseInt(pre_c[2]), parseFloat(pre_c[3]))
        switch (formatPointer) {
            case 0: 
                box.value = `hex(#${c[0]}${c[1]}${c[2]}${c[3]})`;
                break;
            case 1:
                box.value = `#${c[0]}${c[1]}${c[2]}${c[3]}`;
                break;
            case 2:
                box.value = `#${c[0]} ${c[1]} ${c[2]} ${c[3]}`;
                break;
            case 3:
                box.value = `hex(#${c[0]} ${c[1]} ${c[2]} ${c[3]})`;
                break;
        }
    }
}

function setGradients() {
    const all_modes = document.querySelectorAll('.mode');
    all_modes.forEach(mode => {
        mm = mode.dataset.mode;

        s_a = mode.querySelector('#a');
        s_b = mode.querySelector('#b');
        s_c = mode.querySelector('#c');
        s_d = mode.querySelector('#d');

        if (mm == 1){
            r = actualColor[0];
            g = actualColor[1];
            b = actualColor[2];
            s_a.style.background = `linear-gradient(90deg, rgb(${0}, ${g}, ${b}), rgb(${255}, ${g}, ${b})`;
            s_b.style.background = `linear-gradient(90deg, rgb(${r}, ${0}, ${b}), rgb(${r}, ${255}, ${b})`;
            s_c.style.background = `linear-gradient(90deg, rgb(${r}, ${g}, ${0}), rgb(${r}, ${g}, ${255})`;
            s_d.style.background = `linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)`;
        }
        else if (mm == 2){
            v = 255;
            r = `rgb(${v}, ${0}, ${0})`;
            y = `rgb(${v}, ${v}, ${0})`;
            g = `rgb(${0}, ${v}, ${0})`;
            c = `rgb(${0}, ${v}, ${v})`;
            a = `rgb(${0}, ${0}, ${v})`;
            m = `rgb(${v}, ${0}, ${v})`;
            s_a.style.background = `linear-gradient(90deg, ${r}, ${y}, ${g}, ${c}, ${a}, ${m}, ${r}`;
            b_0 = convertHsvaToRgba(parseInt(s_a.value), 0, parseInt(s_c.value), 1);
            b_1 = convertHsvaToRgba(parseInt(s_a.value), 100, parseInt(s_c.value), 1);
            s_b.style.background = `linear-gradient(90deg, rgb(${b_0.a}, ${b_0.b}, ${b_0.c}), rgb(${b_1.a}, ${b_1.b}, ${b_1.c}))`;
            c_0 = convertHsvaToRgba(parseInt(s_a.value), parseInt(s_b.value), 0, 1);
            c_1 = convertHsvaToRgba(parseInt(s_a.value), parseInt(s_b.value), 100, 1);
            s_c.style.background = `linear-gradient(90deg, rgb(${c_0.a}, ${c_0.b}, ${c_0.c}), rgb(${c_1.a}, ${c_1.b}, ${c_1.c}))`;
            s_d.style.background = `linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)`;
        }
        else if (mm == 3){
            v = 255;
            r = `rgb(${v}, ${0}, ${0})`;
            y = `rgb(${v}, ${v}, ${0})`;
            g = `rgb(${0}, ${v}, ${0})`;
            c = `rgb(${0}, ${v}, ${v})`;
            a = `rgb(${0}, ${0}, ${v})`;
            m = `rgb(${v}, ${0}, ${v})`;
            s_a.style.background = `linear-gradient(90deg, ${r}, ${y}, ${g}, ${c}, ${a}, ${m}, ${r}`;
            b_0 = convertHslaToRgba(parseInt(s_a.value), 1, parseInt(s_c.value), 1);
            b_1 = convertHslaToRgba(parseInt(s_a.value), 100, parseInt(s_c.value), 1);
            s_b.style.background = `linear-gradient(90deg, rgb(${b_0.a}, ${b_0.b}, ${b_0.c}), rgb(${b_1.a}, ${b_1.b}, ${b_1.c}))`;
            c_0 = convertHslaToRgba(parseInt(s_a.value), parseInt(s_b.value), 0, 1);
            c_1 = convertHslaToRgba(parseInt(s_a.value), parseInt(s_b.value), 50, 1);
            c_2 = convertHslaToRgba(parseInt(s_a.value), parseInt(s_b.value), 100, 1);
            s_c.style.background = `linear-gradient(90deg, rgb(${c_0.a}, ${c_0.b}, ${c_0.c}), rgb(${c_1.a}, ${c_1.b}, ${c_1.c}), rgb(${c_2.a}, ${c_2.b}, ${c_2.c}))`;
            s_d.style.background = `linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)`;
        }
        else if (mm == 4){
            r = actualColor[0];
            g = actualColor[1];
            b = actualColor[2];
            s_a.style.background = `linear-gradient(90deg, rgb(${0}, ${g}, ${b}), rgb(${255}, ${g}, ${b})`;
            s_b.style.background = `linear-gradient(90deg, rgb(${r}, ${0}, ${b}), rgb(${r}, ${255}, ${b})`;
            s_c.style.background = `linear-gradient(90deg, rgb(${r}, ${g}, ${0}), rgb(${r}, ${g}, ${255})`;
            s_d.style.background = `linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)`;
        }
    });
}

// ----------------Color-Functions----------------

function convertToHsva (r, g, b, a) {
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
    return { a: Math.round(h * 360), b: percentRoundFn(s * 100), c: percentRoundFn(v * 100), d: a};
}

function convertToHsla(r, g, b, a) {
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
    return { a: h*360, b: s*100, c: l*100, d: a}
}

function convertToHex(r, g, b, a) {
    const alpha = Math.round(a * 255);
    const hex = (r << 16 | g << 8 | b).toString(16);
    const paddedHex = ('000000' + hex).slice(-6);
    const alphaHex = ('00' + alpha.toString(16)).slice(-2);
    const result = [paddedHex.slice(0,2), paddedHex.slice(2,4), paddedHex.slice(4), alphaHex];
    return result;
}

function convertHsvaToRgba(h, s, v, a) {
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

function convertHslaToRgba(h, s, l, a) {
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