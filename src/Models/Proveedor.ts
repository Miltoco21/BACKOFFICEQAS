import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';


class Proveedor extends Model{
  codigoProveedor: number
  razonSocial: string
  giro: string
  rut: string
  email: string
  telefono: string
  direccion: string
  comuna: string
  region: string | null
  pagina: string
  formaPago: string
  nombreResponsable: string
  correoResponsable: string
  telefonoResponsable: string
  sucursal: string

  compraDeudaIds:any
  montoPagado:any
  metodoPago:any

  static instance: Proveedor | null = null;

    static getInstance():Proveedor{
        if(Proveedor.instance == null){
            Proveedor.instance = new Proveedor();
        }

        return Proveedor.instance;
    }

    async existRut({rut},callbackOk, callbackWrong){
      try {
          const configs = ModelConfig.get()
          var url = configs.urlBase
          + "/Proveedores/GetProveedorByRut?rutProveedor=" + rut
          const response = await axios.get(url);
          if (
          response.data.statusCode === 200
          || response.data.statusCode === 201
          ) {
          // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
          callbackOk(response.data.proveedores, response)
          } else {
          callbackWrong("Respuesta desconocida del servidor")
          }
      } catch (error) {
          callbackWrong(error)
      }
  }

  async update(data,callbackOk, callbackWrong){
    try {
        const response = await axios.put(
            ModelConfig.get("urlBase") 
            + `/Proveedores/UpdateProveedor`,
          data
        );
  
        if (response.status === 200) {
          callbackOk(response)
        } 
      } catch (error) {
        callbackWrong(error)
      }
  }
};

export default Proveedor;