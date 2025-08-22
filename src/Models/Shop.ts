import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.ts';
import ModelConfig from './ModelConfig.ts';
import ModelSingleton from './ModelSingleton.ts';
import EndPoint from './EndPoint.ts';
import SoporteTicket from './SoporteTicket.ts';


class Shop extends ModelSingleton {


    static async prepare(infoComercio, callbackOk, callbackWrong) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/create-or-search-shop-from-commerce"

        const ant = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, infoComercio, (responseData, response) => {
            callbackOk(responseData, response);
            SoporteTicket.reportarError = ant
        }, (err) => {
            callbackWrong(err)
            SoporteTicket.reportarError = ant
        })
    }

    static async enviarImagen(fileInput, infoComercio, callbackOk, callbackWrong) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/update-image"

        var formData = new FormData();
        formData.append('image', fileInput);
        formData.append('id', infoComercio.id);

        const ant = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, formData, (responseData, response) => {
            callbackOk(responseData, response);
            SoporteTicket.reportarError = ant
        }, (err) => {
            callbackWrong(err)
            SoporteTicket.reportarError = ant
        }, {
            headers: {
                'Content-Type': 'multipart/form-data', // El servidor debe procesar esto
            },
        })
    }

    static async getLinkMp(infoComercio, callbackOk, callbackWrong) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/get-link-connect-mp"

        const ant = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, {
            id: infoComercio.id
        }, (responseData, response) => {
            callbackOk(responseData, response);
            SoporteTicket.reportarError = ant
        }, (err) => {
            callbackWrong(err)
            SoporteTicket.reportarError = ant
        })
    }
    
    static async checkConeccionMP(infoComercio, callbackOk, callbackWrong) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/is-connected-mp"

        const ant = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, {
            id: infoComercio.id
        }, (responseData, response) => {
            callbackOk(responseData, response);
            SoporteTicket.reportarError = ant
        }, (err) => {
            callbackWrong(err)
            SoporteTicket.reportarError = ant
        })
    }

};

export default Shop;