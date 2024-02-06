// importar modelos 
import { Empleado } from "../modelo/persona.models.js";
import { validate } from "../helper/validar.js"
import fs from "fs";
import path from "path";



// obtener empleados

export const obtenerPersonas = (req, res) => {

    // Consulta para sacar los datos del usuario con estado igual a 1
    Empleado.find({ estado: "1" }).then(async (empleados) => {
        if (!empleados) {
            return res.status(404).json({
                status: "Error",
                message: "Personas no existe"
            });
        }

        // devolver el resultado
        return res.status(200).json({
            status: "success",
            empleados
        });
    }).catch(error => {
        return res.status(404).json({
            status: "Error",
            message: "No existe los empleados" + error
        });
    });
    // Devolver el resultado

}

// obtener persona id

export const obtenerPersona = (req, res) => {
    // Recibir  el parametro del id de usuario por la url
    const id = req.params.id;

    // Consulta para sacar los datos del usuario con estado igual a 1
    Empleado.findOne({ _id: id, estado: "1" }).then(async (empleadoId) => {
        if (!empleadoId) {
            return res.status(404).json({
                status: "Error",
                message: "Persona no existe"
            });
        }

        // devolver el resultado
        return res.status(200).json({
            status: "success",
            empleadoId
        });
    }).catch(error => {
        return res.status(404).json({
            status: "Error",
            message: "No existe el empleado" + error
        });
    });
    // Devolver el resultado

}


// Registro de persona
export const guardarPersona = (req, res) => {
    // Recoger datos de la peticion
    let parametros = req.body;

    // Comprobar que me llega bien (+ validacion)
    if (!parametros.nombre || !parametros.email || !parametros.apellido || !parametros.apodo) {
        // devolver resultado
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    // Validacion avansada
    try {
        validate(parametros);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: "Validacion no superada"
        });
    }


    // Control de usuarios duplicados 
    Empleado.find({
        $or: [
            { email: parametros.email.toLowerCase() },
            { nick: parametros.apodo.toLowerCase() },
        ]
    }).then(async (empleados) => {
        if (empleados && empleados.length >= 1) {
            return res.status(400).json({
                status: "error",
                message: "El susuario ya existe"
            });
        }

        // Crear Objeto del usuario
        let empleadoGuardar = new Empleado(parametros);

        // Guardar usuario en la base de datos

        empleadoGuardar.save().then(empleado => {
            // devolver resultado
            return res.status(200).json({
                status: "success",
                message: "Usuario registrado con exito",
                empleado: {
                    _id: empleado._id,
                    nombre: empleado.nombre,
                    apellido: empleado.apellido,
                    apodo: empleado.apodo,
                    image: empleado.image,
                    created_at: empleado.created_at
                }
            });
        }).catch(error => {
            return res.status(500).json({
                status: "error",
                message: "Error al guardado el empleado " + error
            });
        });
    }).catch(error => {
        if (error) return res.status(500).json({ status: "error", message: "Error en la consulta" });
    });
}


export const ActualizarPersona = (req, res) => {
    // Recoger id
    let id = req.params.id;

    // Recoger info del body
    let UsuarioActualizar = req.body;

    // Comprobar si el usuario ya existe 
    Empleado.findOne({ _id: id }).then(async (empleado) => {
        if (!empleado) {
            return res.status(404).json({
                status: "error",
                message: "No se encontró el empleado"
            });
        }

        // Preparar objeto con los campos a actualizar
        let camposActualizar = {};
        for (let campo in UsuarioActualizar) {
            if (empleado[campo] !== undefined) {
                camposActualizar[campo] = UsuarioActualizar[campo];
            }
        }

        // Actualizar empleado
        Empleado.findOneAndUpdate({ _id: id }, camposActualizar, { new: true }).then((usuarioActualizado) => {
            if (!usuarioActualizado) {
                return res.status(500).json({
                    status: "error",
                    message: "Error al actualizar el empleado"
                });
            }
            // Devolver respuesta
            return res.status(200).json({
                status: "success",
                message: "Empleado actualizado",
                empleadoActualizado: usuarioActualizado
            });
        }).catch(error => {
            return res.status(500).json({
                status: "error",
                message: "Error al actualizar el empleado: " + error
            });
        });
    }).catch(error => {
        return res.status(500).json({
            status: "error",
            message: "Error al encontrar el empleado: " + error
        });
    });
};

export const EliminarPersona = (req, res) => {
    // Recoger id
    let id = req.params.id;

    // Comprobar si el usuario ya existe 
    Empleado.findOne({ _id: id }).then(async (empleado) => {
        if (!empleado) {
            return res.status(404).json({
                status: "error",
                message: "No se encontró el empleado"
            });
        }

        // Preparar objeto con el campo estado actualizado
        let camposActualizar = { estado: 0 };

        // Actualizar estado
        Empleado.findOneAndUpdate({ _id: id }, camposActualizar, { new: true }).then((empleadoEliminado) => {
            if (!empleadoEliminado) {
                return res.status(500).json({
                    status: "error",
                    message: "Error al eliminar el empleado"
                });
            }
            // Devolver respuesta
            return res.status(200).json({
                status: "success",
                message: "Empleado eliminado",
            });
        }).catch(error => {
            return res.status(500).json({
                status: "error",
                message: "Error al actualizar el empleado: " + error
            });
        });
    }).catch(error => {
        return res.status(500).json({
            status: "error",
            message: "Error al encontrar el empleado: " + error
        });
    });
};

export const montarFoto = (req,res) =>{

    // recoger el parametro de la ruta
    let id = req.params.id;

    // Recoger el fichero de imagen subido y comprobar que exixte
    let archivo = req.file;
    console.log(archivo)
    if(!archivo && !req.file){
        return res.status(404).json({
            status:"Error",
            message:"Favor cargar la imagen"
        })
    }

    // conseguir el nombre del archivo 
    let nombreArchivo = archivo.originalname;

    // sacar la extension del archivo

    let extensionArch_split = nombreArchivo.split("\.");
    let extension = extensionArch_split[1];

    // Comprobar extension correcta
    if(extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif"){
        // Borrar archivo y dar respuesta
        const filePath = req.file.path;
        const fileDeleted= fs.unlinkSync(filePath);
        return res.status(400).json({
            status:"error",
            message:"Imagen invalida"
        });
    }else{
        // Si todo va bien, actualizar el articulo
        Empleado.findOneAndUpdate({_id:id},{image:req.file.filename},{new:true}).exec().then(empleadoAdtualizado => {
            // Devolver respuesta
            if(empleadoAdtualizado){
                return res.status(200).json({
                    status: "success",
                    empleadoAdtualizado,
                    fichero:req.file,
                });
            }else{
                return res.status(500).json({
                    status: "error",
                    message: "Usuario no encontrado!!"
                });
            }
          })
          .catch(error => {
            return res.status(400).json({
                status: "error",
                message: "No se ha actualizado el Usuario "+error
            });
          });
    }

}

export const obtenerImagen = (req,res) =>{

    // Sacar el parametro de la url
    let file = req.params.file;

    // Montar el paht real de la imagen
    let ruta_fisica = "./src/imagenes/avatares/"+file;

    // Comprobar si el archivo existe 

    fs.stat(ruta_fisica, (error, existe) =>{
        if(existe){
            // Devolver un file
            return res.sendFile(path.resolve(ruta_fisica));
        }else{
            return res.status(404).json({
                status: "error",
                message: "La imagen no existe"
            });
        }
    });
} // fin imagen

