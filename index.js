let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let jsonParser = bodyParser.json();
let app = express();
let { StudentList } = require("./model");
let server;

app.use(express.static("public"));

app.use(morgan("dev"));


let estudiantes = [{
    nombre : "Miguel",
    apellido : "Angeles",
    matricula: 01335

},
{
    nombre : "Erick",
    apellido: "Gonzales",
    matricula: 10398529
},{
    nombre: "Victor",
    apellido: "Villareal",
    matricula: 103940
},{
    nombre: "Victor",
    apellido:"Cardenas",
    matricula: 121212
}];


app.get("/api/students",(req,res)=>{
    
    StudentList.getAll()
    .then(StudentList =>{
        return res.status(200).json(StudentList);
    })
    .catch( error => {
        console.log(error);
        res.statusMessage= "Hubo un error de conexion con la base de datos"; 
        return res.status(500).send();
    });
});

app.get("/api/getById",(req,res)=>{
    let id =req.query.id;

    let result = estudiantes.find( (elements ) => {
        if(elements.matricula == id){
            return elements;
        }
    });

    if (result ){
        return res.status(200).json(result);
    
    } else{
        res.statusMessage = "El alumno no se encuentra en la lista";
        return res.status(404).send();
    }
    
});

app.get("/api/getByName/:name",(req,res)=>{
    let name = req.params.name;

    let result = estudiantes.filter( (elements ) => {
        if(elements.nombre === name){
            return elements;
        }
    });

    if (result.length > 0 ){
        return res.status(200).json(result);
    
    } else{
        res.statusMessage = "El alumno no se encuentra en la lista";
        return res.status(404).send();
    }
    
});

app.post("/api/newStudent", jsonParser , (req , res) => {
    
    StudentList.getAll()
    .then(StudentList =>{
        return res.status(200).json(StudentList);
    })
    .catch( error => {
        console.log(error); 
        res.statusMessage= "Hubo un error de conexion con la base de datos"; 
        return res.status(500).send();
    });

    /*
    let {nombre,apellido,id} = estudiante;
    let  result = student.filter((elements) =>{
        if(elements.student === 3){
            return res.status(200).json({});
        }
    }) 
    if (req.body.length <= 3 ) {
        console.log("Falta algun elemento");
        return res.status(406).json({});
    } else {
        console.log( req.body );
        return res.status(200).json({});
    };

    if(id === req.body[2]){
        return res.status(201).json();
    }else{
        return res.status(400).json();
    }

    return res.status(201).json(student);
    */

});

app.put("/api/updateStudent/:id" , jsonParser, (req,res) =>{
    let id = req.params.id;


});

app.delete("/api/updateStudent/" , jsonParser, (req,res) =>{
    let id = req.params.id;


});

/*
app.listen(8080, () =>{
    console.log("Servidor corriendo en puerto 8080");
});
*/


function runServer(port, databaseUrl){
    return new Promise( (resolve, reject ) => {
        mongoose.connect(databaseUrl, response => {
            if ( response ){
                return reject(response);
            }
            else{
                server = app.listen(port, () => {
                console.log( "App is running on port " + port );
                resolve();
            })
            .on( 'error', err => {
                mongoose.disconnect();
                return reject(err);
                })
            }
        });
    });
}
   
function closeServer(){
    return mongoose.disconnect()
    .then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing the server');
            server.close( err => {
                if (err){
                    return reject(err);
                }
                else{
                    resolve();
                }
            });
        });
    });
}

runServer(8080, "mongodb://localHost/university");

module.exports = (app, runServer, closeServer);