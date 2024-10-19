import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import System from '../Helpers/System.ts';
import EndPoint from './EndPoint.ts';


class Stock extends Model{
    static instance: Stock | null = null;
    static getInstance():Stock{
        if(Stock.instance == null){
            Stock.instance = new Stock();
        }

        return Stock.instance;
    }

  static async ajusteInventario(data,callbackOk, callbackWrong){
    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/StockMovimientos/StockMovimientoAjuste"
    EndPoint.sendPost(url,data,(responseData, response)=>{
      callbackOk(responseData, response)
    },callbackWrong)

  }
};



export default Stock;