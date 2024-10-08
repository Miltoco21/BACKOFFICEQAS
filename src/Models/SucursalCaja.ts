import TiposPasarela from "../definitions/TiposPasarela.ts";
import Pasarela from "./Pasarela.ts";

class SucursalCaja extends Pasarela {
  tipo = TiposPasarela.CAJA

  static actualizar(data, callbackOk, callbackWrong){
    
  }
}

export default SucursalCaja;
