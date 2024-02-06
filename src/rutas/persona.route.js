import { Router } from "express";
import {guardarPersona,obtenerPersona,obtenerPersonas,ActualizarPersona,EliminarPersona,montarFoto,obtenerImagen} from "../controlador/persona.controller.js"
import multer from "multer"; // se encarga subir archivos o imagenes al servidor 

const routerPersona = Router()

// Configuracion de suvida
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/imagenes/avatares/");
    },
    filename:(req, file, cb) => {
        cb(null, "avatar-"+Date.now()+"-"+file.originalname);
    }
});

const subida = multer({storage:almacenamiento});


routerPersona.get("/persona/obtener/:id",obtenerPersona);
routerPersona.get("/persona/empleados",obtenerPersonas);
routerPersona.post('/persona/crear',guardarPersona)
routerPersona.patch('/persona/actualizar/:id',ActualizarPersona)
routerPersona.patch('/persona/eliminar/:id',EliminarPersona)
routerPersona.post('/persona/montarfoto/:id',[subida.single("file0")],montarFoto)
routerPersona.get("/persona/obtenerimagen/:file",obtenerImagen);

export default routerPersona;