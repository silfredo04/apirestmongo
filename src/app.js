import express from "express";
import  cors  from "cors";
import {conexion} from "./db.js"
import routerPersona from "./rutas/persona.route.js"

// conectando la base de datos
conexion();

// mensaje de bienvenida

console.log("Api arrancada!!");


// creando servidor node
const app = express();

// Configurar cors
app.use(cors());

// Convertir los datos que lleguen en cada peticion datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// rutas persona

app.use('/api',routerPersona);

//no existe ruta

app.use((req,res,next)=>{
    res.status(404).json({
        status:"Error",
        message:"Esta ruta no existe"
    });
})

export default app;


