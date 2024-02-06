import {Schema,model} from "mongoose";


const ModelsUserSchema = Schema({
    nombre:{
        type:String,
        required:true
    },
    apellido:String,
    apodo:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"default.png"
    },
    estado:{
        type:String,
        default:"1"
    },
    created_at:{
        type:Date,
        default:Date.now
    }
});

export const Empleado = model("Empleado",ModelsUserSchema,"empleados")