class Media {
    normalizar(n_i) {
        let min = this.getMin(n_i);
        let max = this.getMax(n_i);
        let nor = [];
        n_i.forEach(element => {
            nor.push((element - min) / (max - min));
        });
        return nor;
    }

    //obtener el valor minimo
    getMin(list) {
        return Math.min(...list);
    }

    // Obtener el valor maximo
    getMax(list) {
            return Math.max(...list);
        }
        //Obtener la media
    getMedia(data) {
        return data.reduce((previus, current) => current += previus) / data.length;
    }

    getZ(v) {
        var acumulador = 0.00000028666;
        let i;
        for (i = -5; acumulador < v; i = i + 0.00001) {
            acumulador += (0.00001 * this.calculaz(i - 0.000005));
        }
        return i;
    }

    calculaz(v) { // funcion de densidad de probabilidad normal
        return Math.exp(-Math.pow(v, 2) / 2) / Math.sqrt(2 * Math.PI);
    }

    getLI(z, n) {
        return (0.5) - (z * (1 / Math.sqrt(12 * n)));
    }

    getLS(z, n) {
        return (0.5) + (z * (1 / Math.sqrt(12 * n)));
    }

    prueba(r, li, ls) {
        return (r >= li && r < ls);
    }

    createMatrix(aceptacion, a, n, media, aux, z, li, ls) {
        return [
            [aceptacion, a, n, media, aux, z, li, ls]
        ];
    }
}

callMethodMedias = (data) => {
    var me = new Media();
    let r_i = me.normalizar(data);
    let aceptacion = 0.95;
    let a = (1 - aceptacion).toFixed(3);
    // # de datos
    let n = r_i.length;
    //Media
    let media = me.getMedia(r_i).toFixed(5);
    // 1 - (a/2);
    let aux = 1 - (a / 2);
    let z = me.getZ(aux).toFixed(8);

    // Limite inferior
    let li = me.getLI(z, n).toFixed(8);
    //Limite superior
    let ls = me.getLS(z, n).toFixed(8);

    let prueba = me.prueba(media, li, ls);
    return prueba;
}