import Model from './Model';
import ModelConfig from './ModelConfig';
import axios from "axios";

class UnidadPesaje extends Model {
    codigo: number;
    descripcion: string;
    peso: number;
    unidad: string;

    static instance: UnidadPesaje | null = null;
    
    static getInstance(): UnidadPesaje {
        if (!UnidadPesaje.instance) {
            UnidadPesaje.instance = new UnidadPesaje();
        }
        return UnidadPesaje.instance;
    }

    fill(values: any) {
        for (const campo in values) {
            if (Object.prototype.hasOwnProperty.call(values, campo)) {
                this[campo] = values[campo];
            }
        }
    }

    async create(descripcion: string, peso: number, unidad: string, callbackOk: (response: any) => void, callbackWrong: (error: any) => void) {
        try {
            const configs = ModelConfig.get();
            const url = `${configs.urlBase}/ProductosTmp/PostProductoPesaje`;
            
            const payload = {
                descripcion: descripcion,
                peso: peso,
                unidad: unidad
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
            console.error("Error al crear unidad de pesaje:", error);
            callbackWrong(this.handleError(error));
        }
    }

    async getAll(callbackOk: (unidades: any[]) => void, callbackWrong: (error: any) => void) {
        try {
            const configs = ModelConfig.get();
            const url = `${configs.urlBase}/ProductosTmp/GetProductoPesaje`;
            
            const response = await axios.get(url);
            
            if (response.data && Array.isArray(response.data.productoPesajes)) {
                callbackOk(response.data.productoPesajes);
            } else {
                callbackWrong("Formato de respuesta inválido");
            }
        } catch (error) {
            console.error("Error al obtener unidades de pesaje:", error);
            callbackWrong(this.handleError(error));
        }
    }

    // ✅ Método update actualizado según la documentación de la API
    async update(codigo: number, descripcion: string, peso: number, unidad: string, callbackOk: (response: any) => void, callbackWrong: (error: any) => void) {
        try {
            const configs = ModelConfig.get();
            // ✅ Usar la misma URL que para POST según la documentación
            const url = `${configs.urlBase}/ProductosTmp/PostProductoPesaje`;
            
            const payload = {
                codigo: codigo,         // ✅ Incluir código para identificar el registro a actualizar
                descripcion: descripcion,
                peso: peso,
                unidad: unidad
            };

            // ✅ Usar PUT method según la documentación del curl
            const response = await axios.put(url, payload, {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json'
                }
            });
            
            // ✅ Verificar tanto status 200 como 201 según la respuesta del servidor
            if (response.status === 200 || response.status === 201) {
                callbackOk(response.data);
            } else {
                callbackWrong(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error al actualizar unidad de pesaje:", error);
            callbackWrong(this.handleError(error));
        }
    }

    // ✅ Método delete actualizado según la documentación de la API
    async delete(codigo: number, callbackOk: (response: any) => void, callbackWrong: (error: any) => void) {
        try {
            const configs = ModelConfig.get();
            const url = `${configs.urlBase}/ProductosTmp/DeleteProductoPesaje`;
            
            // ✅ Enviar código en el body como JSON según la documentación
            const payload = {
                codigo: codigo
            };

            const response = await axios.delete(url, {
                data: payload, // ✅ Usar 'data' para el body en DELETE requests
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json'
                }
            });
            
            // ✅ Verificar tanto status 200 como 201 según la respuesta del servidor
            if (response.status === 200 || response.status === 201) {
                callbackOk(response.data);
            } else {
                callbackWrong(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error al eliminar unidad de pesaje:", error);
            callbackWrong(this.handleError(error));
        }
    }

    // ✅ Método ExecuteClear si necesitas limpiar todas las unidades
    async executeClear(callbackOk: (response: any) => void, callbackWrong: (error: any) => void) {
        try {
            const configs = ModelConfig.get();
            const url = `${configs.urlBase}/ProductosTmp/ExecuteClear`; // Ajusta la URL según tu API
            
            const response = await axios.delete(url, {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 200 || response.status === 201) {
                callbackOk(response.data);
            } else {
                callbackWrong(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error al ejecutar clear:", error);
            callbackWrong(this.handleError(error));
        }
    }

    private handleError(error: any): string {
        if (error.response) {
            // ✅ Mejor manejo de errores para mostrar información más específica
            const errorMessage = error.response.data?.descripcion || 
                                error.response.data?.message || 
                                error.response.statusText ||
                                `Error ${error.response.status}`;
            return errorMessage;
        } else if (error.request) {
            return "No se recibió respuesta del servidor";
        } else {
            return `Error de configuración: ${error.message}`;
        }
    }
}

export default UnidadPesaje;