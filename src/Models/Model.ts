import StorageSesion from '../Helpers/StorageSesion.ts';
import Sale from './Sale.ts';
import Sales from './Sales.ts';

import BaseConfig from "../definitions/BaseConfig.ts";
import Singleton from './Singleton.ts';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class Model extends Singleton{
    sesion: StorageSesion;

    constructor(){
        super()
        this.sesion = new StorageSesion(eval("this.__proto__.constructor.name"));
    }

    fill(values:any){
        for(var campo in values){
            const valor = values[campo]
            this[campo] = valor;
        }
    }

    getFillables(){
        var values:any = {};
        for(var prop in this){
            if(typeof(this[prop]) != 'object'
                && this[prop] != undefined
            ){
                values[prop] = this[prop]
            }
        }
        return values
    }

    static async getConexion(callbackOk, callbackWrong){
        const url = ModelConfig.get("urlBase") + "/Cajas/EstadoApi"
        EndPoint.sendGet(url,(responseData, response)=>{
          callbackOk(responseData.sucursals, response)
        },callbackWrong)
      }


};

export default Model;