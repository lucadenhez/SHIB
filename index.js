var inLoop1 = false;
var inLoop2 = false;

var currency = "USD";
var currencySymbol = "$";

window.onload = function () {
    Particles.init({
        selector: ".background",
        speed: 0.2,
        color: "#FFFFFF",
        sizeVariations: 5
    });
    getPrice();
    checkForTokens();
};

function changeCurrency() {
    var radios = document.getElementsByName("currency");

    for (i = 0; i , radios.length; i++) {
        if (radios[i].checked) {
            currency = radios[i].id;

            if (currency == "USD") {
                currencySymbol = "$";
            }
            else if (currency == "GBP") {
                currencySymbol = "£";
            }
            else if (currency == "CAD") {
                currencySymbol = "C$";
            }
            else {
                currencySymbol = "€";
            }
            break
        }
    }

    console.log("Set currency to: " + currency);
    getPrice(currency);
    
    var tokensOwned = Cookies.get("tokens");

    if (typeof tokensOwned === "undefined") {
        console.log("[Status] No cookie detected. Waiting for input...");
    }
    else {
        console.log("[Status] Cookie detected. Tokens Owned: " + tokensOwned);
        document.getElementById("enterTokens").value = tokensOwned;

        getBalance(tokensOwned)
    }
}

function setTokens() {
    var tokens = document.getElementById("enterTokens");

    if (tokens.value != "" || null) {
        console.log("[Status] Detected Tokens Amount of " + tokens.value)
        try {

            if (tokens.value.includes(",")) {
                document.getElementById("enterTokens").value = "No Commas Please";
            }

            Cookies.set('tokens', tokens.value);
            console.log("[Status] Set Tokens Cookie");

            getPrice();
            getBalance(tokens.value)

            inLoop2 = true;

            var stopLoop1 = window.setInterval(function () {
                if (inLoop1 == true && inLoop2 == true) {
                    clearInterval(stopLoop1);
                }
                getBalance(tokens.value)
            }, 10000);
        }
        catch (ex) {
            console.log("[Status] An error occured.")
            console.error(ex)
            tokens = document.getElementById("enterTokens");

            tokens.value = "An Error Occured";
        }
    }
    else {
        console.log("[Status] Couldn't detect tokens")
        document.getElementById("usd").innerText = "Please Enter Tokens Amount";
    }
}

function getPriceCallback(_callback) {
    var client = new XMLHttpRequest();

    client.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(client.responseText);
            var price = json.data.prices.latest;

            document.getElementById("price").innerText = currencySymbol + price.substr(0, 10);
            console.log("[Status] Successfully Got SHIB Price [" + currencySymbol + price + "]");
        }
        else if (this.readyState == 4 && this.status != 200) {
            document.getElementById("price").innerText = "Unable to Fetch Price";

            console.log("[Status] Failed to get SHIB Price | Code: " + client.status)
        }
        _callback();
    };

    client.open("GET", "https://www.coinbase.com/api/v2/assets/prices/d6031388-71ab-59c7-8a15-a56ec20d6080?base=" + currency, true);
    client.send();
}

function getPrice(currency) {
    var client = new XMLHttpRequest();

    client.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(client.responseText);
            var price = json.data.prices.latest;

            document.getElementById("price").innerText = currencySymbol + price.substr(0, 10);
            console.log("[Status] Successfully Got SHIB Price [" + currencySymbol + price + "]");
        }
        else if (this.readyState == 4 && this.status != 200) {
            document.getElementById("price").innerText = "Unable to Fetch Price";

            console.log("[Status] Failed to get SHIB Price | Code: " + client.status)
        }
    };

    client.open("GET", "https://www.coinbase.com/api/v2/assets/prices/d6031388-71ab-59c7-8a15-a56ec20d6080?base=" + currency, true);
    client.send();
}

function checkForTokens() {
    var tokensOwned = Cookies.get("tokens");

    if (typeof tokensOwned === "undefined") {
        console.log("[Status] No cookie detected. Waiting for input...");
    }
    else {
        console.log("[Status] Cookie detected. Tokens Owned: " + tokensOwned);
        document.getElementById("enterTokens").value = tokensOwned;

        getBalance(tokensOwned)

        inLoop1 = true;

        var stopLoop = window.setInterval(function () {
            if (inLoop1 == true && inLoop2 == true) {
                clearInterval(stopLoop);
            }
            else {
                getBalance(tokensOwned)
            }

        }, 10000);
    }
}
function getBalance(tokensOwned) {
    console.log("[Note] If you see some weird repeating stuff, I just need to fix the async mechanics.");
    getPriceCallback(function () {
        var price = document.getElementById("price");
        try {
            if (currency == "CAD") {
                price = price.innerText.substr(2, price.innerText.length);
            }
            else {
                price = price.innerText.substr(1, price.innerText.length);
            }
            var balance = (parseFloat(price) * parseInt(tokensOwned)).toString().substr(0, 10);
            document.getElementById("value").innerText = "Balance - " + currencySymbol + balance;
            console.log("[Status] Set Balance to " + currencySymbol + balance);
        }
        catch (ex) {
            document.getElementById("usd").innerText = "Balance - Unable to Calculate Balance";
            console.log("[Status] An error occured getting the balance");
            console.error(ex);
        }
    }, 3000);
}

function check(ele) {
    if (event.key === 'Enter') {
        setTokens();
    }
}
