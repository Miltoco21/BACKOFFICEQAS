
import axios from "axios";
import Model from "./Model.ts";
import ModelConfig from "./ModelConfig.ts";

type TypePuntoVentaConfiguracions = {
  fechaIngreso: string
  fechaUltAct: string
  idCaja: number
  grupo: string
  entrada: string
  valor: string
}

class Pasarela extends Model {
    idCaja: number
    idSucursal: number
    puntoVenta: string
    idSucursalPvTipo: number
    fechaIngreso: string
    fechaUltAct: string
    puntoVentaConfiguracions: TypePuntoVentaConfiguracions[]

    tipo: number //esta propiedad la tienen que sobreescribir sus hijos

    async add(data,callbackOk, callbackWrong){
      data.idSucursalPvTipo = this.tipo
      console.log("vamos a hacer el add")
      return
      try {
          const configs = ModelConfig.get()
          var url = configs.urlBase
          + "/SucursalCajaes/AddSucursalCaja"
          const response = await axios.post(url,data);
          if (
          response.status === 200
          || response.status === 201
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
}

export default Pasarela;
