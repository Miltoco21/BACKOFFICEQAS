import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';


export default class ReporteVenta extends Model{
  static instance: ReporteVenta | null = null;
    sesion: StorageSesion;

    constructor(){
      super()
      this.sesion = new StorageSesion("client");
    }

    static getInstance():ReporteVenta{
      if(ReporteVenta.instance == null){
          ReporteVenta.instance = new ReporteVenta();
      }

      return ReporteVenta.instance;
    }

    /**
     * 
     * @param fechadesde "YYYY-MM-DD"
     * @param fechahasta "YYYY-MM-DD"
     * @param tipoComprobante 0,1,2"
     */
    async searchInServer(data:{
      fechadesde:string,
      fechahasta: string,
      tipoComprobante: string
    },callbackOk, callbackWrong){
      try{
          const configs = ModelConfig.get()
          var url = configs.urlBase
          +"/ReporteVentas/ReporteLibroIVA"

          const params = { ...data };

          const response = await axios.get(url, { params });

          if (
            response.data.statusCode === 200
            || response.data.statusCode === 201
          ) {
            // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
            callbackOk(response)
          } else {
            callbackWrong("Respuesta desconocida del servidor")
          }
      }catch(error){
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
            } else if(error.message != ""){
              callbackWrong(error.message)
            }else {
              callbackWrong(
                "Error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde."
              );
            }
      }
  }
};