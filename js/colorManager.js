import { convertToHsva, convertToHsla, convertToHex, convertHsvaToRgba, convertHslaToRgba, convertAllToRgba, convertRgbaToModes } from "./colorConverter.js";

const globalColor = { a: 0, b: 0, c: 0, d: 1 };
const colorModes = {
    rgba: { a: 0, b: 0, c: 0, d: 1 },
    hsva: { a: 0, b: 0, c: 0, d: 1 },
    hsla: { a: 0, b: 0, c: 0, d: 1 },
    hex:  { a: 0, b: 0, c: 0, d: 1 }
};

const listModes = ['rgba', 'hsva', 'hsla', 'hex'];
const formatsSelector = ['F(n°)', 'n°', 'n', 'F(n)']
let formatPointer = 0
let isAlphaFormatActive = false

// Elements 
let actualMode = document.querySelector('.modes .mode.is-active').dataset.mode;
const sliders = document.querySelectorAll('input[type="range"]');
const tab_switchers = document.querySelectorAll('[data-switcher]');
const circle = document.getElementById('circle');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const formatText = document.getElementById('format');
const alphaCheck = document.getElementById('alpla-check');
const box = document.getElementById('box');

// Format Text
updateSelectors();
prevButton.addEventListener('click', () => {
    formatPointer = (formatPointer === 0) ? formatsSelector.length - 1 : formatPointer - 1;
    updateSelectors();
});
  
nextButton.addEventListener('click', () => {
    formatPointer = (formatPointer === formatsSelector.length - 1) ? 0 : formatPointer + 1;
    updateSelectors();
});

alphaCheck.addEventListener('change', (e) => {
    isAlphaFormatActive = e.target.checked;
    updateSelectors();
});

function updateSelectors(){
    formatText.textContent = 'Format: ' + formatsSelector[formatPointer];

    let textBox = '';

    const setAlpha = (mode, sep) => {
        if (isAlphaFormatActive) {
            if (mode == 'hex') { return sep + Math.round(colorModes[mode].d*255).toString(16).padStart(2, '0') }
            return sep + colorModes[mode].d;
        }
        else { return '' }
    }

    const fa = [
        () => {
            const arr = Object.values(colorModes.rgba).slice(0,-1)
            return arr.join(' ')
        },
        () => {
            const arr = Object.values(colorModes.hsva).slice(0,-1)
            return arr.join(' ')
        },
        () => {
            const arr = Object.values(colorModes.hsla).slice(0,-1)
            return arr.join(' ')
        },
        () => {
            const arr = (Object.values(colorModes.hex).slice(0,-1)).map(x => x.toString(16).padStart(2, '0'))
            return arr.join(' ')
        },
    ]

    const fb = [
        () => {
            const arr = Object.values(colorModes.rgba).slice(0,-1)
            arr[2] += (isAlphaFormatActive) ? ', ' : '';
            return arr.join(', ')
        },
        () => {
            const arr = Object.values(colorModes.hsva).slice(0,-1)
            arr[0] += '°'
            arr[1] += '%'
            arr[2] += '%'
            arr[2] += (isAlphaFormatActive) ? ', ' : '';
            return arr.join(', ')
        },
        () => {
            const arr = Object.values(colorModes.hsla).slice(0,-1)
            arr[0] += '°'
            arr[1] += '%'
            arr[2] += '%'
            arr[2] += (isAlphaFormatActive) ? ', ' : '';
            return arr.join(', ')
        },
        () => {
            const arr = (Object.values(colorModes.hex).slice(0,-1)).map(x => x.toString(16).padStart(2, '0'))
            return '#' + arr.join('')
        },
    ]

    const fc = [
        fb[0],
        fb[1],
        fb[2],
        () => {
            const arr = (Object.values(colorModes.hex).slice(0,-1)).map(x => x.toString(16).padStart(2, '0'))
            return '#' + arr.join('')
        },
    ]

    const y = {
        'F(n°)': (mode) => {
            textBox += (mode == 'hex') ? mode + '(' : mode.slice(0, -1) + '(';
            textBox += fb[actualMode-1]()
            textBox += setAlpha(mode, '')
            textBox += ')'
        },
        'n°': (mode) => {
            textBox += fc[actualMode-1]()
            textBox += setAlpha(mode, '')
        },
        'n': (mode) => {
            textBox += fa[actualMode-1]()
            textBox += setAlpha(mode, ' ')
        },
        'F(n)': (mode) => {
            textBox += (mode == 'hex') ? mode + '(' : mode.slice(0, -1) + '(';
            textBox += fa[actualMode-1]()
            textBox += setAlpha(mode, ' ')
            textBox += ')'
        },
    }
    y[formatsSelector[formatPointer]](listModes[actualMode - 1]);
    box.value = textBox;
}


setGradients();

tab_switchers.forEach(tab_switcher => {
    tab_switcher.addEventListener('click', ()=> {
        setTimeout(() => {
            const current_page = document.querySelector('.modes .mode.is-active');
            actualMode = current_page.dataset.mode;
            updateSelectors()
        }, 1);
    });
});

sliders.forEach(slider => {
    slider.addEventListener('input', () => {
        const mode = slider.getAttribute('mode');

        colorModes[mode][slider.id] = parseFloat(slider.value);
        
        const rgbaColor = convertAllToRgba[mode](colorModes[mode]);
        Object.assign(globalColor, rgbaColor);

        circle.style.background = `rgba(${rgbaColor.a}, ${rgbaColor.b}, ${rgbaColor.c}, ${rgbaColor.d})`;
        setGradients();
        updateModeValues(listModes[actualMode-1]);
        updateSelectors();
    });
});

function updateModeValues(viewerMode) {
    sliders.forEach(slider => {
        if (viewerMode != slider.getAttribute('mode')) {
            const colorValue = convertRgbaToModes[slider.getAttribute('mode')](globalColor)[slider.id];
            slider.value = colorValue;
            colorModes[slider.getAttribute('mode')][slider.id] = colorValue;
        }
    });
}

function setGradients() {
    document.querySelectorAll('.mode').forEach(mode => {
        const groupMode = parseInt(mode.dataset.mode)

        const sldr = [mode.querySelector('#a'), mode.querySelector('#b'), mode.querySelector('#c')]

        let hueString = '';
        const hue = [[1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 1, 1], [0, 0, 1], [1, 0, 1]];
        hue.forEach(vector => {hueString += `rgb(${vector[0]*255}, ${vector[1]*255}, ${vector[2]*255}),`})
        const c = Object.values(globalColor)

        const rgb = () => {
            sldr[0].style.background = `linear-gradient(90deg, rgb(${0}, ${c[1]}, ${c[2]}), rgb(${255}, ${c[1]}, ${c[2]})`;
            sldr[1].style.background = `linear-gradient(90deg, rgb(${c[0]}, ${0}, ${c[2]}), rgb(${c[0]}, ${255}, ${c[2]})`;
            sldr[2].style.background = `linear-gradient(90deg, rgb(${c[0]}, ${c[1]}, ${0}), rgb(${c[0]}, ${c[1]}, ${255})`;
        }

        const gradientMode = [
            () => { rgb() },
            () => {
                const b_0 = convertHsvaToRgba(sldr[0].value, 0, sldr[2].value, 1);
                const b_1 = convertHsvaToRgba(sldr[0].value, 100, sldr[2].value, 1);
                const c_0 = convertHsvaToRgba(sldr[0].value, sldr[1].value, 0, 1);
                const c_1 = convertHsvaToRgba(sldr[0].value, sldr[1].value, 100, 1);
                sldr[0].style.background = `linear-gradient(90deg, ${hueString} rgb(255, 0, 0)`;
                sldr[1].style.background = `linear-gradient(90deg, rgb(${b_0.a}, ${b_0.b}, ${b_0.c}), rgb(${b_1.a}, ${b_1.b}, ${b_1.c}))`;
                sldr[2].style.background = `linear-gradient(90deg, rgb(${c_0.a}, ${c_0.b}, ${c_0.c}), rgb(${c_1.a}, ${c_1.b}, ${c_1.c}))`;
            },
            () => {
                const b_0 = convertHslaToRgba(sldr[0].value, 1, sldr[2].value, 1);
                const b_1 = convertHslaToRgba(sldr[0].value, 100, sldr[2].value, 1);
                const c_0 = convertHslaToRgba(sldr[0].value, sldr[1].value, 0, 1);
                const c_1 = convertHslaToRgba(sldr[0].value, sldr[1].value, 50, 1);
                const c_2 = convertHslaToRgba(sldr[0].value, sldr[1].value, 100, 1);
                sldr[0].style.background = `linear-gradient(90deg, ${hueString} rgb(255, 0, 0)`;
                sldr[1].style.background = `linear-gradient(90deg, rgb(${b_0.a}, ${b_0.b}, ${b_0.c}), rgb(${b_1.a}, ${b_1.b}, ${b_1.c}))`;
                sldr[2].style.background = `linear-gradient(90deg, rgb(${c_0.a}, ${c_0.b}, ${c_0.c}), rgb(${c_1.a}, ${c_1.b}, ${c_1.c}), rgb(${c_2.a}, ${c_2.b}, ${c_2.c}))`;
            },
            () => { rgb() },
        ]
        gradientMode[groupMode - 1]();
    });
}