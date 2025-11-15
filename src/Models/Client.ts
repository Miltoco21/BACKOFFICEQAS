import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.ts';
import { useState } from 'react';
import ModelConfig from './ModelConfig.ts';


class Client extends Model {
    id: number;
    codigoCliente: number;
    rut: string;
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
    region: string;
    comuna: string;
    correo: string;
    giro: string;
    urlPagina: string;
    clienteSucursal: number;
    formaPago: string;
    usaCuentaCorriente: number;
    fechaIngreso: string;
    fechaUltAct: string;
    bajaLogica: boolean;

    codigoClienteSucursal:number | null | undefined
    data:any

    static instance: Client | null = null;
    


    static getInstance():Client{
      if(Client.instance == null){
          Client.instance = new Client();
      }

      return Client.instance;
    }

    saveInSesion(data){
      this.sesion.guardar(data)
      // localStorage.setItem('userData', JSON.stringify(data));
      return data;
    }

    getFromSesion(){
        return this.sesion.cargar(1)
        // var dt = localStorage.getItem('userData') || "{}";
        // return JSON.parse(dt);
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

    async searchInServer(searchText,callbackOk, callbackWrong){
      try {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        + `/api/Clientes/GetClientesByNombreApellido?nombreApellido=${searchText}`

        const response = await axios.get(
          url
        );
        if (Array.isArray(response.data.clienteSucursal)) {
          callbackOk(response.data.clienteSucursal);
        } else {
          callbackOk([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        callbackWrong(error);
      }
    }

    async asociarRepartidor(
    codigoUsuario: number,
    callbackOk: (response: any) => void,
    callbackWrong: (error: string) => void
  ) {
    // Verificar que tenemos los datos necesarios
    if (!this.codigoCliente) {
      callbackWrong("Cliente no tiene código asignado");
      return;
    }

    // Si clienteSucursal es null o undefined, usamos 0
    const codigoSucursal = this.clienteSucursal ?? 0;

    const data = {
      codigoCliente: [this.codigoCliente],
      codigoClienteSucursal: codigoSucursal,
      codigoUsuario: codigoUsuario
    };

    try {
      const configs = ModelConfig.get();
      const url = `${configs.urlBase}/Clientes/PostClientesAsociarUsuario`;

      const response = await axios.post(url, data, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        callbackOk(response.data.descripcion);
      } else {
        callbackWrong(`Error en la respuesta: ${response.status}`);
      }
    } catch (error) {
      console.error("Error en asociarRepartidor:", error);
      if (error.response) {
        // El servidor respondió con un status fuera de 2xx
        callbackWrong(`Error ${error.response.status}: ${error.response.data}`);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        callbackWrong("No se recibió respuesta del servidor");
      } else {
        // Algo pasó al configurar la solicitud
        callbackWrong("Error al configurar la solicitud: " + error.message);
      }
    }
  }

  
  async desasociarRepartidor(
    codigoUsuario: number,
    callbackOk: (response: any) => void,
    callbackWrong: (error: string) => void
  ) {
    if (!this.codigoCliente) {
      callbackWrong("Cliente no tiene código asignado");
      return;
    }
  
    const codigoSucursal = this.clienteSucursal ?? 0;
  
    // Crear el objeto de datos con la estructura exacta que espera el servidor
    const data = {
      codigoCliente: this.codigoCliente,
      codigoClienteSucursal: codigoSucursal,
      codigoUsuario: codigoUsuario
    };
  
    console.log("Datos de desasociación:", data);
  
    try {
      const configs = ModelConfig.get();
      const url = `${configs.urlBase}/Clientes/DeleteClientesAsociarUsuario`;
  
      // Usar axios.delete con el cuerpo JSON
      const response = await axios.delete(url, {
        data: data, // Enviar datos en el cuerpo
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 200) {
        callbackOk(response.data.descripcion);
      } else {
        callbackWrong(`Error en la respuesta: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error en desasociarRepartidor:", error);
      
      let errorMessage = "Error desconocido";
      if (error.response) {
        // Proporcionar más detalles del error
        errorMessage = `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        errorMessage = "No se recibió respuesta del servidor";
      } else {
        errorMessage = "Error al configurar la solicitud: " + error.message;
      }
      
      callbackWrong(errorMessage);
    }
  }

    async getAllFromServer(callbackOk, callbackWrong) {
      try {
        const configs = ModelConfig.get();
        const url = `${configs.urlBase}/Clientes/GetAllClientes`;
        
        console.log("Solicitando clientes en:", url);
        const response = await axios.get(url);
        console.log("Respuesta del servidor:", response.data);
    
        // Modificación importante: verifica la estructura real de la respuesta
        const clientes = response.data.cliente || response.data.data || response.data;
        
        if (Array.isArray(clientes)) {
          callbackOk(clientes);
        } else {
          callbackWrong("Formato de respuesta inválido");
        }
      } catch (error) {
        console.error("Error en getAllFromServer:", error);
        callbackWrong(error.message || "Error al obtener clientes");
      }
    }
    async findById(id,callbackOk, callbackWrong){
      this.getAllFromServer((clientes)=>{
        var clienteEncontrado = null
        clientes.forEach((cl)=>{
          if(cl.codigoCliente == id){
            clienteEncontrado = cl
            return
          }else{
            // console.log("no coincide con " + cl.codigoCliente)
          }
        })
        if(clienteEncontrado){
          callbackOk(clienteEncontrado)
        }else{
          callbackWrong("No hay coincidencia")
        }
      },callbackWrong)
    }

    async getDeudasByMyId(callbackOk, callbackWrong){
        if(!this.id){
            console.log("Client. getDeudasByMyId. No se asigno un id para buscar deudas del cliente");
            return
        }

        this.clienteSucursal = 0;
        try{
            const configs = ModelConfig.get()
            var url = configs.urlBase
            + "/api/Clientes/GetClientesDeudasByIdCliente"
            + "?codigoClienteSucursal=" + this.clienteSucursal 
            + "&codigoCliente=" + this.id

            const response = await axios.get(
                url
            );

            // console.log("Respuesta del servidor:", response.data);
            if (
                response.data.statusCode == 200

            ) {
                callbackOk(response.data.clienteDeuda);
            }else{
                callbackWrong(response.data.descripcion);
            }
            
        }catch(error){
            callbackWrong(error);
        }
    }

    async pagarFiado(callbackOk, callbackWrong){
        if(!this.data){
            console.log("falta asignar la data para enviar")
            return
        }
        // console.log("enviando al servidor, esta informacion:");
        // console.log(this.data)
        // setTimeout(()=>{
        //   callbackOk({
        //     descripcion:"todo ok"
        //   }
        //   )
        // },2000)
        // return
          try {
              const configs = ModelConfig.get()
              var url = configs.urlBase
              +"/api/Clientes/PostClientePagarDeudaByIdClienteFlujoCaja"

              const response = await axios.post(url, this.data);
        
              // console.log("Response:", response.data);
  
              if (response.data.statusCode === 201
                || response.data.statusCode === 200
              ) {
                // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
                callbackOk(response.data)
              } else {
                callbackWrong("Error de servidor")
              }
            } catch (error) {
              callbackWrong(error)
            }
      }

    async getLastSale(callbackOk, callbackWrong){
        if(!this.codigoClienteSucursal && this.clienteSucursal)
            this.codigoClienteSucursal = this.clienteSucursal
        if(
            this.codigoClienteSucursal == undefined
            || this.codigoCliente == undefined
            ){
            console.log("Modelo Client.definir clienteSucursal y codigo cliente como propiedad");
            return
        }
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
            +"/api/Clientes/GetClienteUltimaVentaByIdCliente" + 
            "?codigoClienteSucursal=" + this.codigoClienteSucursal + 
            "&codigoCliente=" +this.codigoCliente

            const response = await axios.get(url);
            const { ticketBusqueda } = response.data; // Extraer la sección de ticket de la respuesta
            var result:any = []
            // Verificar si hay información de tickets antes de procesarla
            if (Array.isArray(ticketBusqueda) && ticketBusqueda.length > 0) {
              ticketBusqueda.forEach((ticket) => {
                const products = ticket.products; // Extraer la matriz de productos del ticket
      
                // Verificar si hay productos antes de enviarlos a addToSalesData
                if (Array.isArray(products) && products.length > 0) {
                  products.forEach((product) => {
                    result.push(product);
                  });
                }
              });

              callbackOk(result)
            } else {
              callbackWrong("Formato erroneo del servidor")
            }
          } catch (error) {
            callbackWrong(error);
          }
    }

    async getRegions (callbackOk,callbackWrong){
      try {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        +"/RegionComuna/GetAllRegiones"

        const response = await axios.get(url);
        if (response.data.statusCode === 201
          || response.data.statusCode === 200
        ) {
          // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
          callbackOk(response.data.regiones)
        } else {
          callbackWrong("Error de servidor")
        }
      } catch (error) {
        console.error(error);
        callbackWrong(error)
      }
    };


    async getComunasFromRegion(regionId, callbackOk, callbackWrong){
      try {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        +"/RegionComuna/GetComunaByIDRegion?IdRegion=" + regionId
        const response = await axios.get(url);
        if (response.data.statusCode === 201
          || response.data.statusCode === 200
        ) {
          // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
          callbackOk(response.data.comunas)
        } else {
          callbackWrong("Error de servidor")
        }
      } catch (error) {
        console.error(error);
        callbackWrong(error)
      }
    }


    async create(data,callbackOk,callbackWrong){
      try {
        data.usaCuentaCorriente = 0

        const configs = ModelConfig.get()
        var url = configs.urlBase
        +"/Clientes/AddCliente"

        const response = await axios.post(url,data);

        if (response.status === 201
          || response.status === 200
        ) {
          // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
          callbackOk(response.data)
        } else {
          callbackWrong("Error de servidor")
        }
      } catch (error) {
        if (error.response) {
          callbackWrong(error.message);
        } else if (error.response && error.response.status === 500) {
          callbackWrong("Error interno del servidor. Por favor, inténtalo de nuevo más tarde.");
        } else if(error.message != ""){
          callbackWrong(error.message)
        }else {
          callbackWrong(error);
        }
        // console.error(error);
      }
    };

    async existRut(rut,callbackOk,callbackWrong){
      try {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        +"/Clientes/GetClientesByRut?rut=" + rut

        const response = await axios.get(url);

        if (response.data.statusCode === 201
          || response.data.statusCode === 200
        ) {
          // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
          callbackOk(response.data)
        } else {
          callbackWrong("Error de servidor")
        }
      } catch (error) {
        console.error(error);
        callbackWrong(error)
      }
    };

    static completoParaFactura(info){
      // console.log("revisando si esta para facturar")
      // console.log(info)
      return (
        info.rutResponsable && info.rutResponsable.length>0 &&
        info.razonSocial && info.razonSocial.length>0 &&
        info.nombreResponsable && info.nombreResponsable.length>0 &&
        info.apellidoResponsable && info.apellidoResponsable.length>0 &&
        info.direccion && info.direccion.length>0 &&
        info.region && info.region.length>0 &&
        info.comuna && info.comuna.length>0 &&
        info.giro && info.giro.length>0
      )
    }

    async getClientPrices(
      codigoClienteSucursal,
      codigoCliente,
      callbackOk,
      callbackWrong
    ) {
      try {
        const configs = ModelConfig.get();
        const url = `${configs.urlBase}/Clientes/GetClientesProductoPrecioByIdCliente?codigoClienteSucursal=${codigoClienteSucursal}&codigoCliente=${codigoCliente}`;
  
        const response = await axios.get(url);
  
        if (response.data.statusCode === 200) {
          callbackOk(response.data.clientesProductoPrecioMostrar);
        } else {
          callbackWrong(
            response.data.descripcion ||
              "Error al obtener los precios del cliente"
          );
        }
        console.log()
      } catch (error) {
        console.error("Error fetching client prices:", error);
        callbackWrong(error);
      }
    }
  
    async saveClientPrices(data, callbackOk, callbackWrong) {
    try {
      const configs = ModelConfig.get();
      const url = `${configs.urlBase}/Clientes/PutClientesProductoActualizarPrecioByIdCliente`;
  
      // Hacer la solicitud al endpoint con los datos proporcionados
      const response = await axios.put(url, data);
      console.log("precios clientes",response)
  
      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        callbackOk(response.data);
        console.log("precios clientes",response.data)

      } else {
        callbackWrong(
          response.data.descripcion ||
            "Error al actualizar los precios del cliente"
        );
      }
    } catch (error) {
      console.error("Error updating client prices:", error);
      callbackWrong(error);
    }
    
  }  
  // En tu modelo Client.js
  async update(clientId, data, callbackOk, callbackWrong) {
    try {
      const configs = ModelConfig.get();
      const url = `${configs.urlBase}/Clientes/PutClienteCliente`;
      
      // Asegurarse de incluir el ID del cliente en los datos
      const payload = {
        ...data,
        codigoCliente: clientId
      };
  
      const response = await axios.put(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
  
      if (response.status === 200) {
        callbackOk(response.data);
      } else {
        callbackWrong(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error en update:", error);
      
      let errorMessage = "Error desconocido";
      if (error.response) {
        // El servidor respondió con un status fuera de 200-299
        errorMessage = `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        errorMessage = "No se recibió respuesta del servidor";
      } else {
        // Error al configurar la solicitud
        errorMessage = `Error de configuración: ${error.message}`;
      }
      
      callbackWrong(errorMessage);
    }
  }
};

export default Client;