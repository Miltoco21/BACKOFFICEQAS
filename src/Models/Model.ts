import StorageSesion from '../Helpers/StorageSesion.ts';
import Sale from './Sale.ts';
import Sales from './Sales.ts';

import BaseConfig from "../definitions/BaseConfig.ts";
import Singleton from './Singleton.ts';


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


};

export default Model;