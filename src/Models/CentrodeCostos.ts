import Model from './Model.ts';
import ModelConfig from './ModelConfig.ts';
import axios from "axios";

export  class CentrodeCostos extends Model {
 
    descripcion: string;
  

    static instance: CentrodeCostos | null = null;
    
    static getInstance(): CentrodeCostos {
        if (!CentrodeCostos.instance) {
            CentrodeCostos.instance = new CentrodeCostos();
        }
        return CentrodeCostos.instance;
    }

    fill(values: any) {
        for (const campo in values) {
            if (Object.prototype.hasOwnProperty.call(values, campo)) {
                this[campo] = values[campo];
            }
        }
    }

    async create(descripcion: string, callbackOk: (response: any) => void, callbackWrong: (error: any) => void) {
        try {
            const configs = ModelConfig.get();
            const url = `${configs.urlBase}/CentroDeCosto/AddCentroDeCosto`;
            
            const payload = {
                descripcion: descripcion
            };

            const response = await axios.post(url, payload, {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                callbackOk(response.data);
            } else {
                callbackWrong(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error al crear centro de costo:", error);
            callbackWrong(this.handleError(error));
        }
    }

    async getAll(callbackOk: (centers: any[]) => void, callbackWrong: (error: any) => void) {
        try {
            const configs = ModelConfig.get();
            const url = `${configs.urlBase}/CentroDeCosto/GetCentroDeCosto`;
            
            const response = await axios.get(url);
            
            if (response.data && Array.isArray(response.data.centroDeCosto)) {
                callbackOk(response.data.centroDeCosto);
            } else {
                callbackWrong("Formato de respuesta inválido");
            }
        } catch (error) {
            console.error("Error al obtener centros de costo:", error);
            callbackWrong(this.handleError(error));
        }
    }

    async update(id: number, descripcion: string, callbackOk: (response: any) => void, callbackWrong: (error: any) => void) {
        try {
            const configs = ModelConfig.get();
            const url = `${configs.urlBase}/CentroDeCosto/PutCentroDeCosto`;
            
            const payload = {
                id: id,
                descripcion: descripcion
            };
    
            const response = await axios.put(url, payload, {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 200) {
                callbackOk(response.data);
            } else {
                callbackWrong(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error al actualizar centro de costo:", error);
            callbackWrong(this.handleError(error));
        }
    }

    async delete(id: number, callbackOk: (response: any) => void, callbackWrong: (error: any) => void) {
        try {
            const configs = ModelConfig.get();
            const url = `${configs.urlBase}/CentroDeCosto/DeleteCentroDeCosto`;
            
            const response = await axios.delete(url, {
                data: { id: id },  // Enviar ID en el cuerpo
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 200) {
                callbackOk(response.data);
            } else {
                callbackWrong(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error al eliminar centro de costo:", error);
            callbackWrong(this.handleError(error));
        }
    }

    private handleError(error: any): string {
        if (error.response) {
            return `Error ${error.response.status}: ${error.response.data}`;
        } else if (error.request) {
            return "No se recibió respuesta del servidor";
        } else {
            return `Error de configuración: ${error.message}`;
        }
    }
}

export default CentrodeCostos;