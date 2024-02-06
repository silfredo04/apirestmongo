import mongoose from "mongoose";
import {PASSCONEXION,NOMBREDB} from "./config.js"


export const conexion = async () =>{
    try{
        await mongoose.connect(`mongodb+srv://sorozcom:${PASSCONEXION}@cluster0.gzalgfi.mongodb.net/${NOMBREDB}?retryWrites=true&w=majority`);
        console.log("Conectado correctamente a la base de datos persona");
    }catch(error){
        console.log(error);
        // lansamos una excepción 
        throw new Error("No se a podido conectar a la base de datos !!")
    }
}