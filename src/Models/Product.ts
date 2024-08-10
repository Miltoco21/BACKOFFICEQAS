import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';


class Product extends Model{
    idProducto: number;
    description: string | null;
    price: number;
    precioCosto: string | null | undefined;


    static instance: Product | null = null;
    static getInstance():Product{
        if(Product.instance == null){
            Product.instance = new Product();
        }

        return Product.instance;
    }

    async findByDescription({description, codigoCliente},callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase +
            "/api/ProductosTmp/GetProductosByDescripcion?descripcion=" + (description+"")
            if(codigoCliente){
                url += "&codigoCliente=" + codigoCliente
            }
            const response = await axios.get(url);
            if(
                response.data.statusCode == 200
                || response.data.statusCode == 201

            ){
                callbackOk(response.data.productos, response);
            }else{
               callbackWrong("respuesta incorrecta del servidor") 
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            callbackWrong(error) 
          }
    }

    async findPreVenta(data,callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase +
            "/api/Ventas/PreVentaGET"
            const response = await axios.post(url,data);
            if(
                response.data.statusCode == 200
                || response.data.statusCode == 201

            ){
                callbackOk(response.data.preventa[0].products, response.data);
            }else{
               callbackWrong("respuesta incorrecta del servidor") 
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            callbackWrong(error) 
          }
    }

    async findByCodigo({codigoProducto, codigoCliente},callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase +
            "/api/ProductosTmp/GetProductosByCodigo?idproducto=" + codigoProducto
            if(codigoCliente){
                url += "&codigoCliente=" + codigoCliente
            }
            const response = await axios.get(url);
            if(
                response.data.statusCode == 200
                || response.data.statusCode == 201

            ){
                callbackOk(response.data.productos, response);
            }else{
               callbackWrong("respuesta incorrecta del servidor") 
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            callbackWrong(error) 
          }
    }


    async getCategories(callbackOk, callbackWrong) {
        try {

            const configs = ModelConfig.get()
            var url = configs.urlBase
            + "/api/NivelMercadoLogicos/GetAllCategorias"
            
          const response = await axios.get(
            url
          );

          if(
            response.data.statusCode == 200
            || response.data.statusCode == 201
            ){
                callbackOk(response.data.categorias, response);
            }else{
                callbackWrong("respuesta incorrecta del servidor") 
            }
        } catch (error) {
          console.log(error);
          callbackWrong(error) 
        }
      }


    async getSubCategories(categoriaId, callbackOk, callbackWrong){
          try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
            + "/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=" + categoriaId

            const response = await axios.get(
              url
            );
            
            if(
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ){
                callbackOk(response.data.subCategorias, response);
            }else{
                callbackWrong("respuesta incorrecta del servidor") 
            }
          } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
          }
      }

      


    async getFamiliaBySubCat(subCatId, callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
            +"/api/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?SubCategoriaID=" + subCatId
            const response = await axios.get(
                url
              );
            if(
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ){
                callbackOk(response.data.familias, response);
            }else{
                callbackWrong("respuesta incorrecta del servidor") 
            }
        } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
        }
    }

    async getSubFamilia(famId, callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
            +"/api/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?FamiliaID=" + famId

            const response = await axios.get(
                url
              );
            if(
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ){
                callbackOk(response.data.subFamilias, response);
            }else{
                callbackWrong("respuesta incorrecta del servidor") 
            }
        } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
        }
    }

    async getProductsNML({
        catId,
        subcatId,
        famId,
        subFamId
    }, callbackOk, callbackWrong){

        if(!catId) catId = 1
        if(!subcatId) subcatId = 1

        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
            + "/api/ProductosTmp/GetProductosByIdNML?idcategoria=" + catId
            + "&idsubcategoria=" + subcatId
            + "&idfamilia=" + famId
            + "&idsubfamilia=" + subFamId

            const response = await axios.get(
                url
              );
            if(
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ){
                callbackOk(response.data.productos, response);
            }else{
                callbackWrong("respuesta incorrecta del servidor") 
            }
        } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
        }
    }


    async getProductsFastSearch(callbackOk, callbackWrong){

        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
            + "/api/ProductosTmp/ProductosVentaRapidaGet"
            
            const response = await axios.get(
                url
            );
            if(
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ){
                callbackOk(response.data.productosVentaRapidas, response);
            }else{
                callbackWrong("respuesta incorrecta del servidor") 
            }
        } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
        }
    }

    async addProductFastSearch(product,callbackOk, callbackWrong){

        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
            + "/api/ProductosTmp/ProductosVentaRapidaPost"
            
            const response = await axios.post(
                url
                ,product
            );
            if(
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ){
                callbackOk(response);
            }else{
                callbackWrong("respuesta incorrecta del servidor") 
            }
        } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
        }
    }

    async changeProductFastSearch(product,callbackOk, callbackWrong){

        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
            + "/api/ProductosTmp/ProductosVentaRapidaPut"
            
            const response = await axios.put(
                url
                ,product
            );
            if(
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ){
                callbackOk(response);
            }else{
                callbackWrong("respuesta incorrecta del servidor") 
            }
        } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
        }
    }
    
    async assignPrice(product,callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
            + "/api/ProductosTmp/UpdateProductoPrecio"

            const response = await axios.put(
                url
            ,product);
            if(
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ){
                callbackOk(response.data);
            }else{
                callbackWrong("respuesta incorrecta del servidor") 
            }
        } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
        }
    }
    
    async newProductFromCode(product,callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
            + "/api/ProductosTmp/AddProductoNoEncontrado"

            const response = await axios.post(
                url
                ,product);
                console.log(response)
                console.log(response.data)
            if(
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ){
                callbackOk(response.data);
            }else{
                callbackWrong("respuesta incorrecta del servidor") 
            }
        } catch (error) {
            console.error("Error fetching:");
            console.error(error);
            callbackWrong(error);
        }
    }

    async getTipos(callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
            + "/api/ProductosTmp/GetProductoTipos"

            const response = await axios.get(
                url
            );
            if(
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ){
                callbackOk(response.data.productoTipos);
            }else{
                callbackWrong("respuesta incorrecta del servidor") 
            }
        } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
        }
    }

};



export default Product;