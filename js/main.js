// import * as medias from '../js/modules/Medias'
var totalHours = 0;
var currentHour = 0;
var currentdiners = 0;
var data = {};
const limitHour = 250;
var dinersPlate = []; //seleccion por cada plato.
var dinersQualified = []; //comensales que calificaron cada plato
var valueCalifications = [];
var diners = [];
const columns = 15;
let seed = 5456;
const divisor = 10000
const k = 2;
var hours = [0];

var res = new Array(columns)
for (let i = 0; i < columns; i++) {
    res[i] = 0;
}

var day = 0;
generateRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

begin = async() => {
    await loadArrayHours()
    diners = await beginMethodGeneral(50, 131, hours.length)
    let auxDinnerPlates, auxSumCalification;
    for (let i = 0; i < hours.length; i++) {

        auxDinnerPlates = await beginMethodGeneral(0, 4, diners[i])

        dinersPlate[i] = await selectPlates(auxDinnerPlates)

        dinersQualified[i] = await selectDinersCalifications(dinersPlate[i])

        auxSumCalification = await generateCalifications(dinersQualified[i])

        valueCalifications[i] = auxSumCalification
    }
    await drawTable()


    await addRowResults()


    await drawResult()
}

/**METODO CUADRADOS */
generateCalifications = async(array) => {
    otherArray = [];
    for (let i = 0; i < array.length; i++) {
        otherArray[i] = await beginMethodGeneral(0, 6, array[i]);
        otherArray[i] = otherArray[i].reduce((a, b) => a + b)
    }
    //primero se suman despues se truncan
    let p = otherArray.map(a => parseFloat(a.toFixed(4)))
    return p;
}

selectDinersCalifications = async(array) => {
    otherArray = [];
    for (let i = 0; i < array.length; i++) {
        otherArray[i] = await calificatePlates(array[i]);
    }
    return otherArray;
}

beginMethodForOur = async(min, max, array) => {
    do {
        let auxSeed = seed;
        let pow, extrat, ri;
        passTest = false;
        while (array.reduce((a, b) => a + b) < limitHour) {
            pow = Math.pow(auxSeed, 2)
            extrat = await parseInt(getExtrat(pow))
            auxSeed = extrat
            ri = extrat / divisor;
            array.push(getNi(min, max, ri))
        }
        array.shift()
        if (await callMethodMedias(array)) {
            if (await callMethodChi2(array, min, max)) {
                if (await callVarianze(array)) {
                    passTest = true
                }
            }
        }
        if (!passTest) {
            array = [0]
            seed = generateRandom(1000, 9999)
        }
    } while (!passTest);
    return array;
}

beginMethodGeneral = async(min, max, limit) => {
    let array = []
    do {
        array = []
        auxSeed = seed;
        let pow, extrat, ri;
        passTest = false;
        for (let i = 0; i < limit; i++) {
            pow = Math.pow(auxSeed, 2)
            extrat = await parseInt(getExtrat(pow))
            auxSeed = extrat
            ri = extrat / divisor;
            array.push(getNi(min, max, ri))
        }
        if (await callMethodMedias(array)) {
            if (await callMethodMedias(array)) {
                if (array.length > 2) {
                    if (await callVarianze(array)) {
                        passTest = true
                    }
                } else {
                    passTest = true
                }
            }
        }
        if (!passTest) {
            seed = generateRandom(1000, 9999)
        }
    } while (!passTest);
    return array;
}

getExtrat = (string) => {
    string = `${string}`
    charactersPow = string.toString().length
    objectiveLenght = seed.toString().length * 2;
    if (charactersPow !== objectiveLenght) {
        let diference = objectiveLenght - charactersPow;
        string = '0'.repeat(diference) + string
    }
    return string.substring(objectiveLenght / 2 - k, objectiveLenght / 2 + k);
}

getNi = (a, b, ri) => a + (b - a) * ri;

loadArrayHours = async() => {
    await beginMethodForOur(8, 10, hours)
    return hours;
}

selectPlates = async(numberDiners) => { //el plato que escogio cada comensal
    let array = [0, 0, 0, 0];
    let integer;
    for (let i = 0; i < numberDiners.length; i++) {
        integer = parseInt(numberDiners[i])
        array[integer] = array[integer] + 1;
    }
    return array;
}

calificatePlates = async(plate) => { // si el comensal califico o no el plato
    let dinersCalificate = 0
    for (let i = 0; i < plate; i++) {
        dinersCalificate += generateRandom(0, 1)
    }
    return dinersCalificate;
}

addRowResults = () => {
    var string = ''
    string += `<tr class="result"><td></td>`;

    for (let i = 1; i < res.length; i++) {
        string += stringSingleData(res[i], 'restot', 0)
    }
    string += `</tr>`;
    $('#tableData  tr:last')
        .after(
            `<tr class="result">
            ${string}
    </tr>`);
}

drawTable = () => {
    var string = ''
    var openTr = `<tr class="">`;
    var closeTr = `</tr>`;
    for (let i = 0; i < hours.length; i++) {
        string += openTr;
        string += stringSingleData(i + 1, 'day', 0)
        string += stringSingleData(hours[i], 'hours', 1)
        string += stringSingleData(diners[i], 'diners', 2)
        string += stringObjects(dinersPlate[i], 3)
        string += stringObjects(dinersQualified[i], 7)
        string += stringObjects(valueCalifications[i], 11)
        string += closeTr;
    }
    $('#tableData  tr:last')
        .after(string);
}

stringSingleData = (value, sendClass, i, type = null) => {
    if (!type) {
        res[i] = res[i] + value;
    }
    return `<td class="${sendClass}">${parseFloat(value.toFixed(4))}</td>`
};

stringObjects = (array, beginPosition) => {
    var string = '';
    array.map((a, index) => { string += stringSingleData(a, `index${index}`, beginPosition + index) })
    return string;
}

refreshPage = async() => {
    window.location.href = window.location.href;
}

drawResult = async() => {
    let result = await results();
    string = '';
    let best = 0;
    let position = 0
    for (let i = 0; i < result.length; i++) {
        if (result[i] > best) {
            best = result[i]
            position = i
        }
        string += `<h5 class="prom${i + 1}"> El plato P${i + 1} obtuvo un promedio de <strong>${result[i]}</strong> </h5> `;
    }
    string += `<h4>El plato mas amado por los clientes fue  <strong>p${position + 1}</strong> con un puntaje de <strong>${best}</strong></h4>`
    $("#results").show().html(string);
}

results = () => {
    change = 4;
    let array = new Array(change);
    beginpositionSc = 11;
    for (let i = 0; i < change; i++) {
        array[i] = (res[beginpositionSc + i] / res[beginpositionSc + i - change]).toFixed(4)
    }
    return array;
}