var currentHour = 0;
var currentdiners = 0;
var data = {};
const limitHour = 250;
const numberTables = 5;
var m1 = [0, 2];//mesero 1: posicion 0 estado disponible u ocupado, position 2, tiempo de atension
var m2 = [0, 3];//mesero 2: posicion 0 estado disponible u ocupado, position 2, tiempo de atension
var dinersPlate = []; //seleccion por cada plato.
var dinersQualified = []; //comensales que calificaron cada plato
var valueCalifications = [];
var globalDiners = [];
var hours = [0];
var tables = [];
var currentTimeDiners = [];

begin = async () => {
    hours = await whitOutNumberLimit(10, 12, hours)
    globalDiners = await whitNumberLimit(200, 300, hours.length)
    for (let i = 0; i < hours.length; i++) {
        await emptyTables(); //empezar cada dia con mesas desocupadas
        currentTimeDiners = await whitNumberLimit(15, 30, globalDiners[i])//tiempos de los comensales en ese dia.
        await beginSimulation(hours[i] * 60)
    }
}

beginSimulation = async (minutes) => {
    let i = 0;
    console.log("*****************")
    console.log("comensales en el dia",currentTimeDiners.length)
    console.log("tiempo total de comensales",currentTimeDiners.reduce((a,b)=>a+b))
    while (i < minutes && currentTimeDiners.length) {
        currentEmptyTables = await checkTables() //mesas desocupadas
        if (currentEmptyTables.length) {
            await occupyTable(currentEmptyTables)
        }
        await attendTables()
        await tablesInTimeAttend()
        i++;
    }
    console.log("comensales que no alcansaron a comer",currentTimeDiners.length)
}

attendTables = async () => {
    for (let i = 0; i < numberTables; i++) {
        if (tables[i][0] === 1) {//si la mesa esta esperando para ser atendida
            await availableWiter(i)
        }
    }
}

tablesInTimeAttend = async () => {
    for (let i = 0; i < numberTables; i++) {
        if (tables[i][0] === 3) { //si la mesa esta en un estado de Comiendo.
            if (tables[i][2] <= 0) {
                tables[i][0] = 0; // aqui ya terminaron de comer y se desocupa nuevamente la mesa.
            } else {
                tables[i][2] = tables[i][2] - 1; //se le resta un minuto al tiempo de atension.
            }
        } else if (tables[i][0] === 2) { //determina esta siendo atendida
            //la mesa ya fue atendida
            //la mesa pasa a un estado de comiendo 
            //se le resta un minuto al tiempo de atension.
            if (tables[i][3] <= 0) {
                tables[i][0] = 3;
                (tables[i][4] === 1) ? m1[0] = 0 : m2[0] = 0;
            } else {
                tables[i][3]--;
            }
        }
    }
}

availableWiter = async (table) => { //disponibilidad de los meseros
    if (m1[0] === 0) {
        await beginAttended(m1[1], 1, table)
        m1[0] = 1;
    } else if (m2[0] === 0) {
        await beginAttended(m2[1], 2, table)
        m2[0] = 1;
    }
}

beginAttended = async (mTime, waiter, table) => {//define el inicio para atender la mesa 
    tables[table][0] = 2; //cambia la mesa a un estado de esta siendo atendida
    tables[table][3] = mTime; //cuanto tiempo va a durar en este estado
    tables[table][4] = waiter; //mesero que atendio la mesa
    tables[table][5] = await selectPlates(table)
}

occupyTable = async (emptyTables) => {
    for (let i = 0; i < emptyTables.length; i++) {
        if (currentTimeDiners.length) {
            let dinersForTable = (currentTimeDiners.length >= 3) ? await generateRandom(1, 3) : currentTimeDiners.length;
            let timeForTable = await maxTimeEat(dinersForTable)
            tables[emptyTables[i]][0] = 1;
            tables[emptyTables[i]][1] = dinersForTable;
            tables[emptyTables[i]][2] = timeForTable;
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
 * position 4 =  mesero que atendio
 * position 5 =  platos por cada comensal
 *
 */

emptyTables = async () => {//[tiempo ocupada, estado de la mesa 0 =  libre 1 = en espera,2 atendiendo,  3 comiendo ]
    tables = [];
    m1[0]=0;m2[0]=0;
    for (let i = 0; i < numberTables; i++) {
        tables[i] = [0, 0, 0, 0, []];
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

//el plato que escogio cada comensal
selectPlates = async (table) => {
    let array = [], diners = tables[table][1], value
    while (array.length < diners) {
        value = await generateRandom(1, 4)
        if (!array.includes(value)) {
            array.push(value)
        }
    }
    return array
}
// (tables[table][1] > 1) ? await whitNumberLimit(1, 4, tables[table][1]) : [await generateRandom(1, 3)]
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