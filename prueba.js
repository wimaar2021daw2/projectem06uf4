class Prueba{
    constructor(name){
        this.name = name;
    }
}

let a = new Prueba('Prueba 1');
a.name += ' Prueba 2';

console.log(a.name);