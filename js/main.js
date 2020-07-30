var currentHour = 0;
var currentdiners = 0;
var data = {};
const limitHour = 150;
const numberTables = 5;
const m1 = 6;
const m2 = 7;
var dinersPlate = []; //seleccion por cada plato.
var dinersQualified = []; //comensales que calificaron cada plato
var valueCalifications = [];
var globalDiners = [];
var hours = [0];
var tables = [];

var day = 0;

begin = async () => {
    await loadArrayHours()
    globalDiners = await whitNumberLimit(200, 300, hours.length)
    for (let i = 0; i < hours.length; i++) {
        await emptyTables(); //empezar cada dia con mesas desocupadas
        let currentTimeDiners = await whitNumberLimit(15, 30, globalDiners[i])
        await beginSimulation(hours[i] * 60, currentTimeDiners)
    }
    // let auxDinnerPlates, auxSumCalification;
    // for (let i = 0; i < hours.length; i++) {
    //     auxDinnerPlates = await beginMethodGeneral(0, 4, diners[i])
    //     dinersPlate[i] = await selectPlates(auxDinnerPlates)
    //     dinersQualified[i] = await selectDinersCalifications(dinersPlate[i])
    //     auxSumCalification = await generateCalifications(dinersQualified[i])
    //     valueCalifications[i] = auxSumCalification
    // }
}

beginSimulation = async (minutes, diners) => {
    // for (let i = 0; i < minutes; i++) {
        currentEmptyTables = await checkTables()
        console.log(currentEmptyTables)
    // }
}

checkTables = async () => {
    let array = []
    for (let i = 0; i < numberTables; i++) {
        if (tables[i][1] === 0) {
            array.push(i)
        }
    }
    return array
}

emptyTables = async () => {
    for (let i = 0; i < numberTables; i++) {
        tables.push([0, 0])
    }
}

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

loadArrayHours = async () => {
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

refreshPage = async () => {
    window.location.href = window.location.href;
}