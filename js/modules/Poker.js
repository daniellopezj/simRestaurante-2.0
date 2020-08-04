class Poker {
    getPoker(data) {
        let D = 0, O = 0, T = 0, S = 0, F = 0, P = 0, Q = 0;
        let proD = 0.30240, proO = 0.50400, proT = 0.10800, proS = 0.07200, proF = 0.00900, proP = 0.00450, proQ = 0.00100;
        let eiD = (proD / data.length), eiO = (proO / data.length), eiT = (proT / data.length), eiS = (proS / data.length), eiF = (proF / data.length), eiP = (proP / data.length), eiQ = (proQ / data.length);

        data.forEach(element => {
            switch (this.getValue(element)) {
                case "D":
                    D++;
                    break;
                case "O":
                    O++;
                    break;
                case "T":
                    T++;
                    break;
                case "S":
                    S++;
                    break;
                case "F":
                    F++;
                    break;
                case "P":
                    P++;
                    break;
                case "Q":
                    Q++;
                    break;
            }
        });

        let Ei = (Math.pow(eiD - D, 2) / eiD) + (Math.pow(eiO - O, 2) / eiO) + (Math.pow(eiT - T, 2) / eiT) +
            (Math.pow(eiS - S, 2) / eiS) + (Math.pow(eiF - F, 2) / eiF) + (Math.pow(eiP - P, 2) / eiP) + (Math.pow(eiQ - Q, 2) / eiQ);
        return Ei < this.chi2Invert(0.05, 6.0);
    }

    chi2Invert(probabilidad, degreesOfLivertad) {
        let raiz = Math.sqrt(2 / (9 * degreesOfLivertad));
        let z = this.calculateNormInv(1 - probabilidad);
        return degreesOfLivertad * Math.pow(1 - (2 / (9 * degreesOfLivertad)) + (z * raiz), 3);
    }

    calculateNormInv(v) { // Funcion de distribucion de probabilidad normal inversa
        var acumulador = 0.00000028666;
        var i;
        for (i = -5; acumulador < v; i = i + 0.00001) {
            acumulador = acumulador + (0.00001 * this.calculaz(i - 0.000005));
        }
        return i;
    }

    calculaz(v) { // funcion de densidad de probabilidad normal
        return Math.exp(-Math.pow(v, 2) / 2) / Math.sqrt(2 * Math.PI);
    }

    getValue(element) {
        let exit = "";
        let cero = 0, uno = 0, dos = 0, tres = 0, cuatro = 0, cinco = 0, seis = 0, siete = 0, ocho = 0, nueve = 0;

        let value = (element * 100000) + "";
        for (let j = 0; j < value.length; j++) {
            if ((value.charAt(j) + "") == "0") {
                cero++;
            }
            if ((value.charAt(j) + "") == ("1")) {
                uno++;
            }
            if ((value.charAt(j) + "") == ("2")) {
                dos++;
            }
            if ((value.charAt(j) + "") == ("3")) {
                tres++;
            }
            if ((value.charAt(j) + "") == ("4")) {
                cuatro++;
            }
            if ((value.charAt(j) + "") == ("5")) {
                cinco++;
            }
            if ((value.charAt(j) + "") == ("6")) {
                seis++;
            }
            if ((value.charAt(j) + "") == ("7")) {
                siete++;
            }
            if ((value.charAt(j) + "") == ("8")) {
                ocho++;
            }
            if ((value.charAt(j) + "") == ("9")) {
                nueve++;
            }

        }
        var valuesTwo = [];
        let values = { cero, uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve };
        for (let j = 0; j < values.length; j++) {
            if (values[j] != 0) {
                valuesTwo.push(values[j]);
            }
        }

        if (valuesTwo.length == 5) {
            exit = "D";
        } else if (valuesTwo.length == 4) {
            exit = "O";
        } else if (valuesTwo.length == 3) {
            exit = "T";
            for (let K = 0; K < valuesTwo.length; K++) {
                if (valuesTwo.get(K) == 3) {
                    exit = "S";
                }
            }
        } else if (valuesTwo.length == 2) {
            exit = "F";
            for (let K = 0; K < valuesTwo.length; K++) {
                if (valuesTwo.get(K) == 4) {
                    exit = "P";
                }
            }

        } else if (valuesTwo.length == 1) {
            exit = "Q";
        }
        return exit;
    }
}

pokerTest = (data) => {
    var poker = new Poker();
    var result = poker.getPoker(data);
    return result;
}

