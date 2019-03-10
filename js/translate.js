var langs = ["en", "es"];

function load(){
    let translate = new Translate();
    let lang = navigator.language || navigator.userLanguage;
    if (!langs.includes(lang))
        lang = "en";
    translate.init(lang);
    translate.process(); 
    translate.imageProcess(); 
}

function Translate() {
    //initialization
    this.init =  function(lng){
        this.attribute = "data-tag";
        this.lng = lng;
    }
    
    this.imageProcess = function(){
        _self = this;
        
        var allDom = document.getElementsByTagName("*");
        for(let i =0; i < allDom.length; i++){
            let elem = allDom[i];
            let key = elem.getAttribute("data-img");
            let keyRef = elem.getAttribute("data-ref");

            if(key != null) {
                let imgLoc = "./img/gallery/"+this.lng+"/"+key+".jpg";
                 //console.log(key);
                 elem.src = imgLoc;
            }
            if(keyRef != null) {
                let imgLoc = "./img/gallery/"+this.lng+"/"+keyRef+".jpg";
                 //console.log(key);
                elem.href = imgLoc;
            }
        }        
    }
    
    //translate 
    this.process = function(){
                _self = this;
                let xrhFile = new XMLHttpRequest();
                //load content data 
                xrhFile.open("GET", "./resources/"+this.lng+".json", false);
                xrhFile.onreadystatechange = function ()
                {
                    if(xrhFile.readyState === 4)
                    {
                        if(xrhFile.status === 200 || xrhFile.status == 0)
                        {
                            let LngObject = JSON.parse(xrhFile.responseText);
                            //console.log(LngObject["name1"]);
                            let allDom = document.getElementsByTagName("*");
                            for(let i =0; i < allDom.length; i++){
                                let elem = allDom[i];
                                let key = elem.getAttribute(_self.attribute);
                                 
                                if(key != null) {
                                     //console.log(key);
                                     elem.innerHTML = LngObject[key];
                                }
                            }
                        }
                    }
                }
                xrhFile.send();
    }    
}