import validator from "validator";


export const validate = (parametros) =>{
    let nombre = !validator.isEmpty(parametros.nombre) && 
                validator.isLength(parametros.nombre, {min:3, max:undefined}) &&
                validator.isAlpha(parametros.nombre, "es-ES");

    let apellido = !validator.isEmpty(parametros.apellido) && 
                   validator.isLength(parametros.apellido, {min:3, max:undefined}) &&
                   validator.isAlpha(parametros.apellido, "es-ES");

    let apodo = !validator.isEmpty(parametros.apodo) && 
                validator.isLength(parametros.apodo, {min:2, max:undefined});

    let email = !validator.isEmpty(parametros.email) && 
                 validator.isEmail(parametros.email);

    
    if(!nombre || !apellido || !apodo || !email){
        throw new Error("No se ha superado la validacion");
    }else{
        console.log("Validacion superada");
    }
}

