let currency = ["BRL", "USD", "EUR"]
let conversions = [{}]

let input1 = document.querySelector("#input1")
let input2 = document.querySelector("#input2")
let tipoMoeda1 = document.querySelector("#tipo-moeda1")
let tipoMoeda2 = document.querySelector("#tipo-moeda2")

let apiUrl = "https://economia.awesomeapi.com.br/json/last/"

// Chama função que busca as cotações das moedas
requestCurrency()

// Eventos
input1.addEventListener('keyup', () => {
    input2.value = convert("1-2", input1.value)
})

input2.addEventListener('keyup', () => {
    input1.value = convert("2-1", input2.value)
})

input1.addEventListener('blur', () => {
    let valueFixed = transformNumber(input1.value)
    input1.value = parseFloat(valueFixed).toFixed(2).replace(".", ",")
})

input2.addEventListener('blur', () => {
    let valueFixed = transformNumber(input2.value)
    input2.value = parseFloat(valueFixed).toFixed(2).replace(".", ",")
})

tipoMoeda1.addEventListener('change', () => {
    input1.value = convert("2-1", input2.value)
})

tipoMoeda2.addEventListener('change', () => {
    input2.value = convert("1-2", input1.value)
})


// Funções
function defineType(input){
    if (input == "1-2"){
        let typeConversion = tipoMoeda1.value + "-" + tipoMoeda2.value
        return typeConversion
    }

    if (input == "2-1"){
        let typeConversion = tipoMoeda2.value + "-" + tipoMoeda1.value
        return typeConversion
    }
}

function transformNumber(value){
    let valueTransformed = value.replace(",", ".")

    valueTransformed = parseFloat(valueTransformed)

    if (valueTransformed > 0) {
        return valueTransformed
    } else {
        return 0
    }
}

function calculation(type, value){
    let conversion = conversions.find(conversion => conversion.currency == type)
    let number = value * conversion.value
    return number
}

function convert(type, value){
    let number = transformNumber(value)
    let typeConversion = defineType(type)
    
    if (type == "1-2"){
        if (number == 0) {
            let result = 0
            return result.toFixed(2).replace(".", ",")
        } else {
            let result = calculation(typeConversion, number)
            result = result.toFixed(2).replace(".", ",")
            return result
        }
    }

    if (type == "2-1"){
        if (number == 0) {
            let result = 0
            return result.toFixed(2).replace(".", ",")
        } else {
            let result = calculation(typeConversion, number)
            result = result.toFixed(2).replace(".", ",")
            return result
        }
    }
}

// Função para requisitar dados de API
async function requestApi(url){
    const response = await fetch(url)
    
    if (response.status == 200){
        const jsonApi = await response.json()

        return jsonApi
    } else {
        console.log("Falha na solicitação a API")
    }
}

function addObjectList(currency){
    conversions.push(currency)
}

async function requestCurrency(){
    for (var i = 0; i < currency.length; i++){
        for (var m = 0; m < currency.length; m++){
            if (currency[i] != currency[m]) {
                let urlCurrency = apiUrl + currency[i] + "-" + currency[m]
                let jsonApi = await requestApi(urlCurrency)

                jsonApi = JSON.stringify(jsonApi)

                let findValue = jsonApi.indexOf("ask")
                let findFinalValue = jsonApi.indexOf(",", findValue)
                let currencyObject = {
                    currency: currency[i] + "-" + currency[m],
                    value: parseFloat(jsonApi.substring(findValue + 6, findFinalValue - 1))
                }

                addObjectList(currencyObject)
            } else {
                let currencyObject = {
                    currency: currency[i] + "-" + currency[m],
                    value: 1
                }

                addObjectList(currencyObject)
            }
        }
    }
}