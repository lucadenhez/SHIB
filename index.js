var tokensOwned = 3000000;

window.addEventListener('load', function () {
    document.getElementById("tokens").innerText = "Tokens Owned - " + tokensOwned.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    getInfo()

    var loop = window.setInterval(function() {
        getInfo()
      }, 10000);
  })

function getInfo() {
    var client = new XMLHttpRequest();

    client.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(client.responseText);
            var price = json.data.prices.latest;
            document.getElementById("price").innerText = "$" + price.substr(0, 10);
            document.getElementById("usd").innerText = "Balance - $" + (parseFloat(price) * tokensOwned).toString().substr(0, 10);

            console.log("[Status] Successfully Got SHIB Price [" + price + "]")
        }
        if (this.readyState == 4 && this.status != 200) {
            document.getElementById("price").innerText = "Unable to Fetch Price";
            document.getElementById("usd").innerText = "Balance - Unable to Calculate Balance";
            
            console.log("[Status] Failed to get SHIB Price | Code: " + client.status)
        }
    };
    
    client.open("GET", "https://www.coinbase.com/api/v2/assets/prices/d6031388-71ab-59c7-8a15-a56ec20d6080?base=USD", true);
    client.send();
}