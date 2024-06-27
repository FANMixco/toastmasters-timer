//Translator
load();

//Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-8XCS79V4BL');

setTimeout(() => {
    const about3 = document.getElementById('about3');

    about3.innerHTML = about3.innerHTML.replace('{0}', new Date().getFullYear());
}, 1500);