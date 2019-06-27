let langs = ["en", "es", "pl", "cs", "ru", "it", "de"];
let lang = "en";
let lngObject;

function load() {
    let translate = new Translate();
    lang = navigator.language || navigator.userLanguage;
    if (!langs.includes(lang))
        lang = "en";
    translate.init(lang);
    translate.process();
}

function Translate() {
    //initialization
    this.init = function(lng) {
        this.attribute = "data-tag";
        this.lng = lng;
    }

    //translate 
    this.process = function() {
        _self = this;
        fetch(`./js/lang/${this.lng}.json`)
            .then((response) => {
                response.json().then((data) => {
                    lngObject = data;
                    let allDom = document.getElementsByTagName("*");
                    for (let i = 0; i < allDom.length; i++) {
                        let elem = allDom[i];
                        let key = elem.getAttribute(_self.attribute);

                        if (key != null)
                            elem.innerHTML = lngObject[key];
                    }
                });
            })
            .catch((err) => {});
    }
}