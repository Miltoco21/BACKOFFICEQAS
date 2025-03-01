import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.ts';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class User extends Model {
    codigoUsuario: number;
    rut: string;
    clave: string;

    deudaIds: any
    idUsuario: number

    static instance: User | null = null;

    static getInstance(): User {
        if (User.instance == null) {
            User.instance = new User();
        }

        return User.instance;
    }

    saveInSesion(data) {
        this.sesion.guardar(data)
        // localStorage.setItem('userData', JSON.stringify(data));
        return data;
    }

    getFromSesion() {
        return this.sesion.cargar(1)
        // var dt = localStorage.getItem('userData') || "{}";
        // return JSON.parse(dt);
    }

    setRutFrom = (input: string) => {
        if (input.indexOf("-") > -1) {
            this.rut = input;
        } else {
            this.rut = "";
        }
        return this.rut;
    }

    setUserCodeFrom = (input: string) => {
        if (input.indexOf("-") == -1) {
            this.codigoUsuario = parseInt(input);
        } else {
            this.codigoUsuario = 0;
        }
        return this.codigoUsuario;
    }

    async doLogoutInServer(callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/Usuarios/LoginUsuarioSetInactivo"

            const data = this.getFillables()
            data.puntoVenta = parseInt(data.puntoVenta) + ""

            const response = await axios.post(
                url,
                data
            );

            if (response.data.status == 200) {
                callbackOk(response)
            } else {
                callbackOk(response.data.descripcion)
            }
        } catch (error) {
            console.log(error)
            if (error.response) {
                callbackWrong(
                    "Credenciales incorrectas. Por favor, verifica tu nombre de usuario y contraseña." +
                    error.message
                );
            } else if (error.response && error.response.status === 500) {
                callbackWrong(
                    "Error interno del servidor. Por favor, inténtalo de nuevo más tarde."
                );
            } else if (error.message != "") {
                callbackWrong(error.message)
            } else {
                callbackWrong(
                    "Error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde."
                );
            }
        }
    }

    async existRut({ rut }, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/Usuarios/GetUsuarioByRut?rutUsuario=" + rut
            const response = await axios.get(url);
            if (
                response.data.statusCode === 200
                || response.data.statusCode === 201
            ) {
                // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
                callbackOk(response.data.usuarios, response)
            } else {
                callbackWrong("Respuesta desconocida del servidor")
            }
        } catch (error) {
            callbackWrong(error)
        }
    }

    async add(data, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/Usuarios/AddUsuario"
            const response = await axios.post(url, data);
            if (
                response.status === 200
                || response.status === 201
            ) {
                // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
                callbackOk(response.data.usuarios, response)
            } else {
                callbackWrong("Respuesta desconocida del servidor")
            }
        } catch (error) {
            if (error.response && error.response.status && error.response.status === 409) {
                callbackWrong(error.response.descripcion)
            } else {
                callbackWrong(error.message)
            }


        }
    }

    async edit(data, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/Usuarios/UpdateUsuario"
            const response = await axios.put(url, data);
            if (
                response.data.statusCode === 200
                || response.data.statusCode === 201
            ) {
                // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
                callbackOk(response.data, response)
            } else {
                callbackWrong("Respuesta desconocida del servidor")
            }
        } catch (error) {
            if (error.response && error.response.status && error.response.status === 409) {
                callbackWrong(error.response.descripcion)
            } else {
                callbackWrong(error.message)
            }


        }
    }

    static async getAll(callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/Usuarios/GetAllUsuarios"

        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.usuarios, response);
        }, callbackWrong)
    }

    async getAll(callbackOk, callbackWrong) {
        User.getAll(callbackOk, callbackWrong)
    }


    static async doLoginServer(data, callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/Usuarios/LoginUsuario"

        EndPoint.sendPost(url, data, (responseData, response) => {
            if (response.data.responseUsuario && response.data.responseUsuario.codigoUsuario !== -1) {
                callbackOk(responseData, response);
            } else {
                if (responseData.descripcion) {
                    callbackWrong(responseData.descripcion)
                } else {
                    callbackWrong("Usuario incorrecto")
                }
            }
        }, callbackWrong)
    }

    static async getActivos(callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/Usuarios/GetUsuariosActivos"

        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.usuariosActivos, response);
        }, callbackWrong)
    }

    static async getRoles(callbackOk, callbackWrong) {

        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/Usuarios/GetAllRolUsuario"

        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.usuarios, response);
        }, callbackWrong)
    }

};

export default User;