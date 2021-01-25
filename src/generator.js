function generarFichas(){
    let fichas = new Array();
    let counter = 0;

    for(let i=0; i<7; i++){
        for(let j=0; j<7; j++){
            let handler = true;

            for(value of fichas){
                if(value.left.value == j && value.right.value == i){
                    handler = false;
                }
            }
            if(handler){
                fichas.push(
                    {
                        id: counter,
                        left: {
                            value: i,
                            used: false
                        },
                        right: {
                            value: j,
                            used: false
                        }
                    }
                );
                counter++;
            }
        }
    }

    return fichas;
}

let a = generarFichas();

for(value of a){
    console.log(`${value.left.value}|${value.right.value}`);
}
