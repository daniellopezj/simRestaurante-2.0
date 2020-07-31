var currentHour = 0;
var currentdiners = 0;
var data = {};
const limitHour = 25;
const numberTables = 5;
var m1 = [0, 6];//mesero 1: posicion 0 estado disponible u ocupado, position 2, tiempo de atension
var m2 = [0, 7];//mesero 2: posicion 0 estado disponible u ocupado, position 2, tiempo de atension
var dinersPlate = []; //seleccion por cada plato.
var dinersQualified = []; //comensales que calificaron cada plato
var valueCalifications = [];
var globalDiners = [];
var hours = [0];
var tables = [];
var currentTimeDiners = [];

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
        await attendTables()

        i++;
    }
}

attendTables = async () => {
    for (let i = 0; i < numberTables; i++) {
        if (tables[i][0] === 1) {//si la mesa esta esperando para ser atendida
            await availableWiter(i)
        }
    }
}

availableWiter = async (table) => { //disponibilidad de los meseros
    if (m1[0] === 0) {
        tables[table][0] = 2;
        tables[table][3] = m1[1];
        m1[0] = 1;
    } else if (m2[0] === 0) {
        tables[table][0] = 2;
        tables[table][3] = m2[1];
        m2[0] = 1;
    }
}

occupyTable = async (emptyTables) => {
    for (let i = 0; i < emptyTables.length; i++) {
        if (currentTimeDiners.length) {
            let dinersForTable = (currentTimeDiners.length >= 3) ? await generateRandom(1, 3) : currentTimeDiners.length;
            let timeForTable = await maxTimeEat(dinersForTable)
            tables[emptyTables[i]] = [1, dinersForTable, timeForTable, 0];
        }
    }
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
    for (let i = 0; i < numberTables; i++) {
        if (tables[i][0] === 0) {
            array.push(i)
        }
    }
    // console.log(array)
    return array;
}

/**
 * 
 * Valores en array de mesas 
 * position 0 =  estado de la mesa
 *      estado 0 = mesa libre
 *      estado 1 = mesa en espera
 *      estado 2 = mesa siendo atendida
 *      estado 3 = mesa comiendo
 * position 1 =  numero de comensales
 * position 2 =  tiempo maximo que se demoran los clientes
 * position 3 =  tiempo de atension
 * 
 *   
 */

emptyTables = async () => {//[tiempo ocupada, estado de la mesa 0 =  libre 1 = en espera,2 atendiendo,  3 comiendo ]
    tables = [];
    for (let i = 0; i < numberTables; i++) {
        tables[i] = [0, 0, 0, 0];
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