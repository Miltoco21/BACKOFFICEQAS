import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.ts';
import ModelConfig from './ModelConfig.ts';

class AjusteInventario extends Model {
    
    usuarioResponsable: number;
    stockSistema: string;//number
    stockFisico: string;//number
    fechaAjuste: string;//number

    static instance: AjusteInventario | null = null;

    static getInstance(): AjusteInventario {
        if (AjusteInventario.instance == null) {
            AjusteInventario.instance = new AjusteInventario();
        }
        return AjusteInventario.instance;
    }

    saveInSesion(data) {
        this.sesion.guardar(data);
        return data;
    }

    getFromSesion() {
        return this.sesion.cargar(1);
    }

    async add(data, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get();
            var url = configs.urlBase + "/Inventario/AddAjusteInventario";
            const response = await axios.post(url, data);
            if (response.status === 200 || response.status === 201) {
                callbackOk(response.data.ajusteInventario, response);
            } else {
                callbackWrong("Respuesta desconocida del servidor");
            }
        } catch (error) {
            if (error.response && error.response.status && error.response.status === 409) {
                callbackWrong(error.response.descripcion);
            } else {
                callbackWrong(error.message);
            }
        }
    }

   
}

export default AjusteInventario;
