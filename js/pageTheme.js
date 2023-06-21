const root = document.documentElement;
const setColors = document.querySelectorAll('.theme')
const themeColors = [
    'rgb(252, 89, 25)',
    'rgb(151, 66, 255)',
    'rgb(226, 34, 69)',
    'rgb(0, 230, 200)',
    'rgb(0, 230, 122)',
]

setColors.forEach(setColor => {
    const p = setColor.getAttribute("color-value");
    setColor.style.background = themeColors[p];
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
        const clr = theme.querySelector('.theme');
        clr.classList.add('active-color');
        root.style.setProperty('--themeColor', themeColors[clr.getAttribute("color-value")]);
    });
});
