window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const buy_me_coffee = document.createElement('script');

        buy_me_coffee.setAttribute('src', 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js');
        buy_me_coffee.dataset.name = "BMC-Widget";
        buy_me_coffee.dataset.cfasync = "false";
        buy_me_coffee.dataset.id = "fanmixco";
        buy_me_coffee.dataset.description = lngObject.buyMeACoffee;
        buy_me_coffee.dataset.message = lngObject.buyMeACoffeeMsg;
        buy_me_coffee.dataset.color = "#5F7FFF";
        buy_me_coffee.dataset.position = "Right";
        buy_me_coffee.dataset.x_margin = "18";
        buy_me_coffee.dataset.y_margin = "18";

        document.body.appendChild(buy_me_coffee);
    }, 1000);
});