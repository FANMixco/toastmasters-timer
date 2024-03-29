const supLang = ["en", "es", "pl", "cs", "ru", "it", "de", "nl", "zh"];
const langCoffee = {
    "cs": {
        "buyMeACoffee": "Podpořte mě na Kupte mi kávu!",
        "buyMeACoffeeMsg": "Zmocněte mě k vylepšení této neuvěřitelné aplikace! Kup mi kávu!"
    },
    "de": {
        "buyMeACoffee": "Unterstütze mich bei Kauf mir einen Kaffee!",
        "buyMeACoffeeMsg": "Ermächtige mich, diese unglaubliche App zu verbessern! Kauf mir einen Kaffee!"
    },
    "en": {
        "buyMeACoffee": "Support me on Buy me a coffee!",
        "buyMeACoffeeMsg": "Empower me to improve this incredible app! Buy me a coffee!"
    },
    "es": {
        "buyMeACoffee": "¡Apóyame en Cómpreme un café!",
        "buyMeACoffeeMsg": "Empoderame a mejorar esta increíble aplicación! ¡Cómprame un café!"
    },
    "it": {
        "buyMeACoffee": "Supportami su Comprami un caffè!",
        "buyMeACoffeeMsg": "Consentimi di migliorare questa incredibile app! Offrimi un caffè!"
    },
    "nl": {
        "buyMeACoffee": "Steun me op Koop me een koffie!",
        "buyMeACoffeeMsg": "Geef me de mogelijkheid om deze ongelooflijke app te verbeteren! Koop een koffie voor me!"
    },
    "pl": {
        "buyMeACoffee": "Wesprzyj mnie na Kup mi kawę!",
        "buyMeACoffeeMsg": "Daj mi możliwość ulepszenia tej niesamowitej aplikacji! Kup mi kawę!"
    },
    "ru": {
        "buyMeACoffee": "Поддержи меня на Купи мне кофе!",
        "buyMeACoffeeMsg": "Дайте мне возможность улучшить это невероятное приложение! Купи мне кофе!"
    },
    "zh": {
        "buyMeACoffee": "支持我给我买杯咖啡！",
        "buyMeACoffeeMsg": "使我能够改进这个令人难以置信的应用程序！ 给我买杯咖啡！"
    }
};

let lngTemp = navigator.languages
    ? navigator.languages[0]
    : (navigator.language || navigator.userLanguage);

if (lngTemp.includes('-'))
    lngTemp = lngTemp.split('-')[0];

if (!supLang.includes(lngTemp))
    lngTemp = "en";

let buy_me_coffee = document.createElement('script');

buy_me_coffee.setAttribute('src','https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js');
buy_me_coffee.dataset.name = "BMC-Widget";
buy_me_coffee.dataset.cfasync = "false";
buy_me_coffee.dataset.id = "fanmixco";
buy_me_coffee.dataset.description = langCoffee[lngTemp].buyMeACoffee;
buy_me_coffee.dataset.message = langCoffee[lngTemp].buyMeACoffeeMsg;
buy_me_coffee.dataset.color = "#5F7FFF";
buy_me_coffee.dataset.position = "Right";
buy_me_coffee.dataset.x_margin = "18";
buy_me_coffee.dataset.y_margin = "18";

document.body.appendChild(buy_me_coffee);