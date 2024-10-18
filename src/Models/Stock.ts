import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import System from '../Helpers/System.ts';


class Stock extends Model{
    static instance: Stock | null = null;
    static getInstance():Stock{
        if(Stock.instance == null){
            Stock.instance = new Stock();
        }

        return Stock.instance;
    }

    static async ajusteInventario(data,callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
            +"/StockMovimientos/StockMovimientoAjuste"
  
            const response = await axios.post(url, data);
            if (response.data.statusCode === 200
             || response.data.statusCode === 201) {
              callbackOk(response.data)
            } else {
              callbackWrong("Error al realizar la operacion")
            }
          } catch (error) {
            callbackWrong(error)
          }
    }
};



export default Stock;