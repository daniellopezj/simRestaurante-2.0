var currentHour = 0;
var currentdiners = 0;
var data = {};
const limitHour = 250;
const numberTables = 5;
const m1 = 6;
const m2 = 7;
var dinersPlate = []; //seleccion por cada plato.
var dinersQualified = []; //comensales que calificaron cada plato
var valueCalifications = [];
var globalDiners = [];
var hours = [0];
var tables = [[0,0],[0,0],[0,0],[0,0],[0,0]];
var currentTimeDiners = [];
var day = 0;

begin = async () => {
    await loadArrayHours()
    globalDiners = await whitNumberLimit(20, 30, hours.length)
    for (let i = 0; i < hours.length; i++) {
        await emptyTables(); //empezar cada dia con mesas desocupadas
        currentTimeDiners = await whitNumberLimit(15, 30, globalDiners[i])//tiempos de los comensales en ese dia.
        await beginSimulation(hours[i] * 60)
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

beginSimulation = async (minutes) => {
    let i = 0;
    while (i < minutes && currentTimeDiners.length) {
        currentEmptyTables = await checkTables() //mesas desocupadas
        if (currentEmptyTables.length) {
            await occupyTable(currentEmptyTables)
        }
        i++;
    }
}

occupyTable = async (emptyTables) => {
    for (let i = 0; i < emptyTables.length; i++) {
        if (currentTimeDiners.length) {
            let dinersForTable = (currentTimeDiners.length >= 3) ? await generateRandom(1, 3) : currentTimeDiners.length;
             let timeForTable = await maxTimeEat(dinersForTable)
            tables[emptyTables[i]] = [timeForTable,0];
        }
    }
    console.log(tables)
}

maxTimeEat = async (dinersForTable) => {
    let array = [];
    for (let i = 0; i < dinersForTable; i++) {
        array.push(currentTimeDiners.shift())
    }
    return Math.max.apply(Math, array);

}
checkTables = async () => {
    let array = []
    for (let i = 0; i < tables.length; i++) {
        if (tables[i][0] === 0) {
            array.push(i)
        }
    }
    return array;
}

emptyTables = async () => {//[tiempo ocupada, estado de la mesa 0 =  libre 1 = en espera,  2 comiendo ]
    tables = [];
    for (let i = 0; i < numberTables; i++) {
        tables[i] = [0, 0];
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