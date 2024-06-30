document.addEventListener('DOMContentLoaded', () => {
    let buy_me_coffee = document.createElement('script');
    buy_me_coffee.setAttribute('src', 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js');
    buy_me_coffee.dataset.name = "BMC-Widget";
    buy_me_coffee.dataset.cfasync = "false";
    buy_me_coffee.dataset.id = "fanmixco";
    try {
        buy_me_coffee.dataset.description = lngObject.buyMeACoffee;
        buy_me_coffee.dataset.message = lngObject.buyMeACoffeeMsg;
    } catch {
        buy_me_coffee.dataset.description = "Support me on Buy me a coffee!";
        buy_me_coffee.dataset.message = "Empower me to improve this incredible app! Buy me a coffee!";
    }
    buy_me_coffee.dataset.color = "#5F7FFF";
    buy_me_coffee.dataset.position = "Right";
    buy_me_coffee.dataset.x_margin = "18";
    buy_me_coffee.dataset.y_margin = "18";

    buy_me_coffee.onload = () => {
        console.log('Buy Me A Coffee widget loaded successfully.');
    };

    document.body.appendChild(buy_me_coffee);
});