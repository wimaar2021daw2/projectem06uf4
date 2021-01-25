 function main(){
    const http = require('http');
    const port = 8080;
    const host = 'localhost';
    const fs = require('fs');
    const url = require('url');
    const querystring = require('querystring');

    const requestListener = function (req, res) {
        let idPartida = Math.random().toString(36).substr(2, 9);
        var pathname = url.parse(req.url).pathname;
        var consulta = url.parse(req.url).query;
        let fileURL;

        console.log('Ruta obtenida: '+pathname);
        
        if(consulta != null){ 
            console.log(consulta);
            var QStringValue = querystring.parse(consulta);
        }

        if(pathname == '/'){
            fileURL = './src/html/index.html';
        }else if(allowedFile(pathname)){
            fileURL = './src'+pathname;
        }else if(pathname == '/game_generate'){
            partida.push(new Partida(idPartida));
            fileURL = 'redirect';
        }else if(pathname == '/consulta_partida'){
            fileURL = 'fetch';
        }else if(pathname == '/registrar'){
            let dataPosting = '';
            console.log('Intento 1 de recibir Mediante método POST');
            req.setEncoding('utf8');
            req.addListener('data', function(data){
                dataPosting += data;
                console.log('Posting: '+ dataPosting);
            });
            
            req.addListener('end', () => {
                var MongoClient = require('mongodb').MongoClient;
                var assert = require('assert'); //utilitzem assercions

                var ObjectId = require('mongodb').ObjectID;
                var ruta = 'mongodb://localhost:27017/domino';

                let toInsert = querystring.parse(dataPosting);
                let newUser = {
                    id: Math.random().toString(36).substr(2, 9),
                    username: toInsert.username,
                    password: toInsert.password,
                    wins: 0
                }

                MongoClient.connect(ruta, function (err, db) {
                    assert.equal(null, err);
                    console.log("Connexión correcta");
                    console.log(`Insertando nuevo usuario: ${newUser.username}`);
                    db.collection('users').insertOne(newUser);
                    /*var cursor = db.collection('users').find();
                    cursor.each(function (err, doc) {
                        assert.equal(err, null);
                        if (doc != null) {
                            console.log(doc.nom);
                        }
                    });*/
                });
            });

            fileURL = 'retornar';
        }else if(pathname == '/sesion'){
            fileURL = 'sesion';
        }else{
            fileURL = './src/html'+pathname+'.html';
        }

        console.log('Retornando recurso: '+fileURL);

        res.writeHead(200, {
            "Content-Type" : "text/html; charset=utf-8"
        });

        if(fileURL == 'redirect'){
            res.writeHead(200, {
                'Content-Type' : 'text/html'
            });
            res.write(`<script>location.href = '/partida?id=${idPartida}';</script>`);
            res.end();
        }else if(fileURL == 'fetch'){
            res.writeHead(200, {
                'Content-Type' : 'text/plain'
            });
            res.write(`${JSON.stringify(partida.find(element => element.id == QStringValue.id))}`);
            res.end();
        }else if(fileURL == 'retornar'){
            res.writeHead(200, {
                'Content-Type' : 'text/html'
            });
            res.write(`<script>location.href = '/login';</script>`);
            res.end();
        }else{
            fs.readFile(fileURL, (err, data) => {
                if(err){
                    res.writeHead(404, {
                        "Content-Type" : "text/html; charset=utf-8"
                    });
                    data = "404 NOT FOUND";
                    res.write(data);
                    res.end();
                }else{
                    res.writeHead(200, {
                        'Content-Type' : 'text/html'
                    });
                    res.write(data);
                    res.end();
                }
            });
        }
    };

    const server = http.createServer(requestListener);
    server.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
}
//Functions
function allowedFile(string){
    allowed = [
        '.png',
        '.jpg',
        '.jpeg',
        '.css',
        '.js',
        '.svg'
    ];

    let fileType = '';
    let handler;

    for(let i=0; i<string.length; i++){
        if(string[i] == '.') handler = true;
        if(handler) fileType += string[i];
    }

    for(let value of allowed){
        if(fileType == value) return true;
    }

    return false;
}

//Classes
class Partida{
    constructor(id, admin){
        this.id = id;
        this.admin = admin;
        this.jugadores = [];
        this.fichas = this.generarFichas();
        this.tabla = [];
    }

    generarFichas(){
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
}

class Jugador{
    constructor(id, nombre, wins){
        this.id = id;
        this.nombre = nombre;
        this.wins = wins;
        this.slot = [];
        this.partida = null;
    }
}
//MongoDB

exports.main = main;