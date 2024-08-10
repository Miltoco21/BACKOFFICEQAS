import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import IUser from "./../Types/IUser.ts";
import axios from "axios";
import Model from './Model.ts';
import ModelConfig from './ModelConfig.ts';


class User extends Model implements IUser{
    codigoUsuario: number;
    rut: string;
    clave: string;

    deudaIds: any
    idUsuario:number


    static instance: User | null = null;

    static getInstance():User{
        if(User.instance == null){
            User.instance = new User();
        }

        return User.instance;
    }

    saveInSesion(data){
        this.sesion.guardar(data)
        // localStorage.setItem('userData', JSON.stringify(data));
        return data;
    }

    getFromSesion(){
        return this.sesion.cargar(1)
        // var dt = localStorage.getItem('userData') || "{}";
        // return JSON.parse(dt);
    }

    setRutFrom = (input:string)=>{
        if(input.indexOf("-")>-1){
            this.rut = input;
        }else{
            this.rut = "";
        }
        return this.rut;
    }

    setUserCodeFrom = (input:string)=>{
        if(input.indexOf("-") == -1){
            this.codigoUsuario = parseInt(input);
        }else{
            this.codigoUsuario = 0;
        }
        return this.codigoUsuario;
    }

    async doLoginInServer(callbackOk, callbackWrong){
        try{
            const configs = ModelConfig.get()
            var url = configs.urlBase
            +"/api/Usuarios/LoginUsuario"

            const response = await axios.post(
                url,
                {
                    codigoUsuario: this.codigoUsuario,
                    rut: this.rut,
                    clave: this.clave,
                }
            );

            console.log("Respuesta del servidor:", response.data);
            if (   response.data.responseUsuario 
                && response.data.responseUsuario.codigoUsuario != -1) {
                callbackOk(response.data);
            }else{
                callbackWrong(response.data.descripcion);
            }
            
        }catch(error){

            if (error.response) {
                callbackWrong(
                  "Credenciales incorrectas. Por favor, verifica tu nombre de usuario y contraseña." +
                    error.message
                );
              } else if (error.response && error.response.status === 500) {
                callbackWrong(
                  "Error interno del servidor. Por favor, inténtalo de nuevo más tarde."
                );
              } else {
                callbackWrong(
                  "Error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde."
                );
              }
        }
    }

    async getAllFromServer(callbackOk, callbackWrong){
        try{
            const configs = ModelConfig.get()
            var url = configs.urlBase
            +"/api/Usuarios/GetAllUsuarios"

            const response = await axios.get(
                url
            );

            console.log("Respuesta del servidor:", response.data);
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201

            ) {
                callbackOk(response.data.usuarios);
            }else{
                callbackWrong(response.data.descripcion);
            }
            
        }catch(error){
            callbackWrong(error);
        }
    }


    async getUsuariosDeudas(callbackOk, callbackWrong){
        try{
            const configs = ModelConfig.get()
            var url = configs.urlBase
            +"/api/Usuarios/GetUsuariosDeudas"
            const response = await axios.get(
                url
            );

            console.log("Respuesta del servidor:", response.data);
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201

            ) {
                callbackOk(response.data.usuarioDeudas);
            }else{
                callbackWrong(response.data.descripcion);
            }
            
        }catch(error){
            callbackWrong(error);
        }
    }

    async pargarDeudas(callbackOk, callbackWrong){
        const data = this.getFillables()
        if(data.idUsuario == undefined){ console.log("falta completar idUsuario");return }
        if(data.montoPagado == undefined){ console.log("faltan completar montoPagado");return }
        if(data.metodoPago == undefined){ console.log("faltan completar metodoPago");return }
        if(this.deudaIds == undefined){ console.log("faltan completar deudaIds");return }
        
        data.deudaIds = this.deudaIds
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
            +"/api/Usuarios/PostUsuarioPagarDeudaByIdUsuario"
            const response = await axios.post(url,data);
            if (
            response.data.statusCode === 200
            || response.data.statusCode === 201
            ) {
            // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
            callbackOk(response.data)
            } else {
            callbackWrong("Respuesta desconocida del servidor")
            }
        } catch (error) {
            callbackWrong(error)
        }
    }
    

};

export default User;