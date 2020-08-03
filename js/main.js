const limitHour = 150;
const numberTables = 5;
const numberPlates = 4;
const column = 12;
const prices = [18000, 12000, 20000, 17000]
var currentHour = 0, currentdiners = 0, totalTimePay = 0, pendingTimePay = 0;
var data = {};
var m1 = [0, 2];//mesero 1: posicion 0 estado disponible u ocupado, position 2, tiempo de atension
var m2 = [0, 3];//mesero 2: posicion 0 estado disponible u ocupado, position 2, tiempo de atension
var dinersPlate = []; //seleccion por cada plato.
var dinersQualified = []; //comensales que calificaron cada plato
var valueCalifications = [], globalDiners = [], pendingDiners = [], tables = [], currentTimeDiners = [], calificationDay = [], allCalification = [], allToPay = [];
var hours = [0];
var row = new Array(column);
var diners = new Array(4);
var sumCalification = new Array(4);
diners.fill(0)
sumCalification.fill(0)

begin = async () => {
    hours = await whitOutNumberLimit(10, 12, hours)
    globalDiners = await whitNumberLimit(200, 300, hours.length)
    for (let i = 0; i < hours.length; i++) {
        await startCalification()
        await emptyTables(); //empezar cada dia con mesas desocupadas
        console.log("***************** ")
        console.log("dia", i + 1)
        currentTimeDiners = await whitNumberLimit(30, 40, globalDiners[i])//tiempos de los comensales en ese dia.
        await onlyDataRow(i);
        await beginSimulation(hours[i] * 60)
        allCalification.push(calificationDay);
        allToPay.push(totalTimePay)
        await loadRowArray(5, calificationDay)
        await drawRow()
    }
    await loadResult()
    await drawReport()
    // await drawRowResult()
}

onlyDataRow = (i) => {
    row = new Array(column);
    row[0] = i + 1;
    row[2] = globalDiners[i];
}

beginSimulation = async (minutes) => {
    let i = 0;
    row[1] = minutes;
    console.log("tiempo en minutos", minutes)
    console.log("comensales en el dia", currentTimeDiners.length)
    // console.log("tiempo total de comensales", currentTimeDiners.reduce((a, b) => a + b))
    while (i < minutes) {
        currentEmptyTables = await checkTables() //mesas desocupadas
        if (currentEmptyTables.length) {
            await occupyTable(currentEmptyTables)
        }
        await attendTables()
        await tablesInTimeAttend()
        if (pendingTimePay) {
            pendingTimePay--;
        }
        i++;
    }
    console.log("comensales que no alcanzaron a comer", currentTimeDiners.length)
    row[3] = currentTimeDiners.length;
    row[4] = totalTimePay;
    pendingDiners.push(currentTimeDiners.length);
}


loadRowArray = (position, array) => {
    let positionCalification = position + 4;
    for (let i = 0; i < array.length; i++) {
        row[position + i] = array[i][0]
        row[positionCalification + i] = array[i][1]
    }
}

startCalification = () => {
    calificationDay = [];
    totalTimePay = 0;
    pendingTimePay = 0;
    for (let i = 0; i < numberPlates; i++) {
        calificationDay.push([0, 0])
    }
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
                await generateCalifications(tables[i][5])
                await queuePay()
            } else {
                tables[i][2] = tables[i][2] - 1; //se le resta un minuto al tiempo de atension.
            }
        } else if (tables[i][0] === 2) { //determina esta siendo atendida
            if (tables[i][3] <= 0) {//la mesa ya fue atendida
                tables[i][0] = 3; //la mesa pasa a un estado de comiendo
                (tables[i][4] === 1) ? m1[0] = 0 : m2[0] = 0; //el mesero queda libre
            } else {
                tables[i][3]--;//se le resta un minuto al tiempo de atension.
            }
        }
    }
}

queuePay = async () => {
    let timeiNqueue = await whitNumberLimit(5, 10, 1)
    pendingTimePay += timeiNqueue[0]
    totalTimePay += timeiNqueue[0]
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
    m1[0] = 0; m2[0] = 0;
    for (let i = 0; i < numberTables; i++) {
        tables[i] = [0, 0, 0, 0, []];
    }
}

generateCalifications = async (array) => {
    let califications = await whitNumberLimit(0, 6, array.length)
    for (let i = 0; i < array.length; i++) {
        // if (await generateRandom(0, 1)) {
        calificationDay[array[i] - 1][0]++;
        calificationDay[array[i] - 1][1] += califications[i]
        // }
    }
}

//el plato que escogio cada comensal
selectPlates = async (table) => {
    let array = [], diners = tables[table][1], value
    while (array.length < diners) {
        value = await generateRandom(1, numberPlates)
        if (!array.includes(value)) {
            array.push(value)
        }
    }
    return array;
}
loadResult = async () => {
    row = new Array(column);
    row.fill(0)
    row[2] = await reduce(globalDiners)
    row[3] = await reduce(pendingDiners)
    row[4] = await reduce(allToPay)
    for (let i = 0; i < allCalification.length; i++) {
        for (let j = 0; j < allCalification[i].length; j++) {
            diners[j] += allCalification[i][j][0]
            sumCalification[j] += allCalification[i][j][1]
        }
    }
    for (let i = 0; i < diners.length; i++) {
        row[5 + i] = diners[i]
        row[9 + i] = sumCalification[i]
    }
    await drawRow(true)
}

reduce = (array) => array.reduce((a, b) => a + b)

drawRow = async (res = false) => {
    var string = ''
    string += `<tr class="${(res) ? 'result' : ''}">`;
    for (let i = 0; i < row.length; i++) {
        string += stringSingleData(row[i], `${!res && i > 4 ? `index${i % 4}` : 'data'}`)
    }
    string += `</tr>`;
    $('#tableData  tr:last')
        .after(string);
}

stringSingleData = (value, sendClass) => {
    return `<td class="${sendClass}">${parseFloat(value.toFixed(4))}</td>`
};

drawReport = async () => {
    string = '';
    let best = 0;
    let position = 0;
    let currentUtility = 0;
    for (let i = 0; i < diners.length; i++) {
        currentUtility = await utility(i)
        if (currentUtility > best) {
            best = currentUtility
            position = i
        }
        string += `<h5 class="prom${i + 1}"> El plato P${i + 1} obtuvo una utilidad de <strong>$ ${currentUtility}</strong> pesos </h5> `;
    }
    string += `<h4>El plato mas rentable fue el plato <strong>p${position + 1},</strong> genero una utilidad de <strong>$ ${best}</strong> pesos</h4>`
    $("#results").show().html(string);
}

utility = async (i) => diners[i] * prices[i] * .25

refreshPage = async () => {
    window.location.href = window.location.href;
}