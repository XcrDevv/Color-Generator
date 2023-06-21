const copyButton = document.getElementById('copy-btn');
const checkIco = document.getElementById('check-ico');
const box = document.getElementById('box');

copyButton.addEventListener('click', async () => {
    box.select();
    try {
        const copyText = new String(box.value);
        await navigator.clipboard.writeText(copyText);
        window.getSelection().removeAllRanges();

        checkIco.classList.remove('check-ico-0');
        checkIco.classList.add('check-ico-1');
        
        setTimeout(() => {
            checkIco.classList.remove('check-ico-1');
            checkIco.classList.add('check-ico-0');
        }, 1000);

    } catch (err) {
        alert(' - Error al copiar el texto, Puede copiar el texto manualmente - ', err);
    }
});