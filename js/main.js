var currentHour = 0;
var currentdiners = 0;
var data = {};
const limitHour = 150;
var dinersPlate = []; //seleccion por cada plato.
var dinersQualified = []; //comensales que calificaron cada plato
var valueCalifications = [];
var diners = [];
var hours = [0];
const columns = 15;
var res = new Array(columns)
for (let i = 0; i < columns; i++) {
    res[i] = 0;
}

var day = 0;

begin = async() => {
   await loadArrayHours()
    diners = await whitNumberLimit(200, 300, hours.length)
    console.log(diners)
    // let auxDinnerPlates, auxSumCalification;
    // for (let i = 0; i < hours.length; i++) {
    //     auxDinnerPlates = await beginMethodGeneral(0, 4, diners[i])
    //     dinersPlate[i] = await selectPlates(auxDinnerPlates)
    //     dinersQualified[i] = await selectDinersCalifications(dinersPlate[i])
    //     auxSumCalification = await generateCalifications(dinersQualified[i])
    //     valueCalifications[i] = auxSumCalification
    // }
}

// /**METODO CUADRADOS */
// generateCalifications = async(array) => {
//     otherArray = [];
//     for (let i = 0; i < array.length; i++) {
//         otherArray[i] = await beginMethodGeneral(0, 6, array[i]);
//         otherArray[i] = otherArray[i].reduce((a, b) => a + b)
//     }
//     //primero se suman despues se truncan
//     let p = otherArray.map(a => parseFloat(a.toFixed(4)))
//     return p;
// }

// selectDinersCalifications = async(array) => {
//     otherArray = [];
//     for (let i = 0; i < array.length; i++) {
//         otherArray[i] = await calificatePlates(array[i]);
//     }
//     return otherArray;
// }


// getExtrat = (string) => {
//     string = `${string}`
//     charactersPow = string.toString().length
//     objectiveLenght = seed.toString().length * 2;
//     if (charactersPow !== objectiveLenght) {
//         let diference = objectiveLenght - charactersPow;
//         string = '0'.repeat(diference) + string
//     }
//     return string.substring(objectiveLenght / 2 - k, objectiveLenght / 2 + k);
// }

loadArrayHours = async() => {
    await whitOutNumberLimit(10, 12, hours)
    return hours;
}

// selectPlates = async(numberDiners) => { //el plato que escogio cada comensal
//     let array = [0, 0, 0, 0];
//     let integer;
//     for (let i = 0; i < numberDiners.length; i++) {
//         integer = parseInt(numberDiners[i])
//         array[integer] = array[integer] + 1;
//     }
//     return array;
// }

// calificatePlates = async(plate) => { // si el comensal califico o no el plato
//     let dinersCalificate = 0
//     for (let i = 0; i < plate; i++) {
//         dinersCalificate += generateRandom(0, 1)
//     }
//     return dinersCalificate;
// }

refreshPage = async() => {
    window.location.href = window.location.href;
}