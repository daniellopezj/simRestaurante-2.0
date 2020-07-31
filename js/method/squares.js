
const divisor = 10000
const k = 2;
let seed = 3652;

whitOutNumberLimit = async(min, max, array) => {
    seed = generateRandom(1000, 9999)
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

whitNumberLimit = async(min, max, limit) => {
    let array = []
    seed = generateRandom(1000, 9999)
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

getNi = (a, b, ri) => a + (b - a) * ri;

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


generateRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
