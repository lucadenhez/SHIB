var inLoop1 = false;
var inLoop2 = false;

window.onload = function () {
    getPrice();
    checkForTokens();
};

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

            document.getElementById("price").innerText = "$" + price.substr(0, 10);
            console.log("[Status] Successfully Got SHIB Price [$" + price + "]");
        }
        else if (this.readyState == 4 && this.status != 200) {
            document.getElementById("price").innerText = "Unable to Fetch Price";

            console.log("[Status] Failed to get SHIB Price | Code: " + client.status)
        }
        _callback();
    };

    client.open("GET", "https://www.coinbase.com/api/v2/assets/prices/d6031388-71ab-59c7-8a15-a56ec20d6080?base=USD", true);
    client.send();
}

function getPrice() {
    var client = new XMLHttpRequest();

    client.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(client.responseText);
            var price = json.data.prices.latest;

            document.getElementById("price").innerText = "$" + price.substr(0, 10);
            console.log("[Status] Successfully Got SHIB Price [$" + price + "]");
        }
        else if (this.readyState == 4 && this.status != 200) {
            document.getElementById("price").innerText = "Unable to Fetch Price";

            console.log("[Status] Failed to get SHIB Price | Code: " + client.status)
        }
    };

    client.open("GET", "https://www.coinbase.com/api/v2/assets/prices/d6031388-71ab-59c7-8a15-a56ec20d6080?base=USD", true);
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
            price = price.innerText.substr(1, price.innerText.length);
            var balance = (parseFloat(price) * parseInt(tokensOwned)).toString().substr(0, 10);
            document.getElementById("value").innerText = "Balance - $" + balance;
            console.log("[Status] Set Balance to $" + balance);
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
