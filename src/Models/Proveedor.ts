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
    
    async getAllFromServer(callbackOk, callbackWrong){
      try {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        +"/api/Proveedores/GetProveedorCompra"

        const response = await axios.get(url);
        console.log("Response:", response.data);
  
        if (
          response.data.statusCode === 200
        ) {
          // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
          callbackOk(response.data.proveedorCompra.proveedorCompraCabeceras)
        } else {
          callbackWrong("Respuesta desconocida del servidor")
        }
      } catch (error) {
        callbackWrong(error)
      }
    }


    async getAllDeudas(callbackOk, callbackWrong){
      try {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        +"/api/Proveedores/GetProveedorCompra"

        const response = await axios.get(url);
        console.log("Response:", response.data);
  
        if (
          response.data.statusCode === 200
        ) {
          // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
          callbackOk(response.data.proveedorCompra.proveedorCompraCabeceras)
        } else {
          callbackWrong("Respuesta desconocida del servidor")
        }
      } catch (error) {
        callbackWrong(error)
      }
    }

    filterByCodigo(all, funcCadaItem){
      var result = []
      var me = this;
      result = all.filter((item)=>{
        const coinciden = item.codigoProveedor == me.codigoProveedor
        if(coinciden && funcCadaItem!=undefined) funcCadaItem(item)
        return coinciden
      })
      return result
    }


    async pagarDeuda(callbackOk, callbackWrong){
      const data = this.getFillables()
      console.log(this)
      if(data.fechaIngreso == undefined){ console.log("faltan completar fechaIngreso");return }
      if(data.codigoUsuario == undefined){ console.log("faltan completar codigoUsuario");return }
      if(data.codigoSucursal == undefined){ console.log("faltan completar codigoSucursal");return }
      if(data.puntoVenta == undefined){ console.log("faltan completar puntoVenta");return }
      if(this.compraDeudaIds == undefined){ console.log("faltan completar compraDeudaIds");return }
      if(data.montoPagado == undefined){ console.log("faltan completar montoPagado");return }
      if(data.metodoPago == undefined){ console.log("faltan completar metodoPago");return }

      data.compraDeudaIds = this.compraDeudaIds
      try {
          const configs = ModelConfig.get()
          var url = configs.urlBase + 
          "/api/Proveedores/AddProveedorCompraPagar"
          
          const response = await axios.post(url,data);
          //console.log("Response:", response.data);
    
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

export default Proveedor;