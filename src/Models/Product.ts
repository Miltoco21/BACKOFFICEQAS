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

    static initLogica(product){

        product.ivaPorcentaje = ModelConfig.get().iva

        // if(!product.ivaPorcentaje) {
        //     // console.log("no tiene valor product.ivaPorcentaje")
        //     product.ivaPorcentaje = 19
        // }
            if(!product.ivaValor) {
            // console.log("no tiene valor product.ivaValor")
            product.ivaValor = 0
        }
            if(!product.gananciaPorcentaje) {
            // console.log("no tiene valor product.gananciaPorcentaje")
            product.gananciaPorcentaje = 30
        }
            if(!product.gananciaValor) {
            // console.log("no tiene valor product.gananciaValor")
            product.gananciaValor = 0
        }

        // if(product.precioNeto>0 && product.precioVenta>0){
        //     product.ivaValor = product.precioVenta - product.precioNeto
        //     product.ivaPorcentaje = product.ivaValor * 100 / product.precioNeto
        // }

        if(product.precioNeto>0 && product.precioCosto>0){
            product.gananciaValor = product.precioNeto - product.precioCosto
            product.gananciaPorcentaje = product.gananciaValor * 100 / product.precioCosto
            product.gananciaPorcentaje = parseInt(product.gananciaPorcentaje)
        }


    }
    
    //direccion indica si se calcula para el lado del costo o del precio final
    static logicaPrecios(product, direccion = "final"){
        // console.log("logicaPrecios " + direccion + " para ")
        // console.log(product)
        if(!product.gananciaPorcentaje) Product.initLogica(product)
        if(product.ivaPorcentaje) product.ivaPorcentaje = ModelConfig.get().iva
        // if(product.precioVenta <= 0 && product.precioCosto > 0){
        if( direccion == 'final' ){
            // console.log("calculando sin precio de venta y con precio de costo")
        
            // console.log("product.precioCosto")
            // console.log(product.precioCosto)
            // console.log("product.gananciaPorcentaje")
            // console.log(product.gananciaPorcentaje)
            // console.log("product.ivaPorcentaje")
            // console.log(product.ivaPorcentaje)
        
            const sumGan = (product.precioCosto) * ( (product.gananciaPorcentaje) / 100)
            // console.log("sumGan")
            // console.log(sumGan)
            
            const neto = parseFloat(product.precioCosto) + sumGan
            
            
            // console.log("neto")
            // console.log(neto)
            
            const sumIva = (neto) * ((product.ivaPorcentaje) / 100)
            
            // console.log("sumIva")
            // console.log(sumIva)
            
            
            
            const final = ((neto + sumIva))
            
            // console.log("final")
            // console.log(final)
            
            product.precioVenta = final
            product.precioNeto = neto
            product.gananciaValor = sumGan
            product.ivaValor = sumIva
        
        // }else if(product.precioVenta >0 && product.precioCosto <= 0){
        }else if(direccion == "costo"){
        
            // console.log("calculando sin precio de costo y con precio de venta")
        
            // console.log("product.precioCosto")
            // console.log(product.precioCosto)
            // console.log("product.gananciaPorcentaje")
            // console.log(product.gananciaPorcentaje)
            // console.log("product.ivaPorcentaje")
            // console.log(product.ivaPorcentaje)
            
            const neto = parseFloat(product.precioVenta) / (1  + (parseInt(product.ivaPorcentaje) / 100) )
            // console.log("neto")
            // console.log(neto)
            const costo = neto / (1 + parseInt(product.gananciaPorcentaje) / 100)
        
            // console.log("costo")
            // console.log(costo)
            
            var sumGan = neto - costo
            // console.log("sumGan")
            // console.log(sumGan)
            var sumIva = product.precioVenta - neto
            // console.log("sumIva")
            // console.log(sumIva)

            product.precioCosto = costo
            product.precioNeto = neto
            product.gananciaValor = sumGan
            product.ivaValor = sumIva


            }
        
        // console.log(product)
    }

    static calcularMargen(product){
// console.log("calculando sin precio de costo y con precio de venta")
        
            // console.log("product.precioCosto")
            // console.log(product.precioCosto)
            // console.log("product.gananciaPorcentaje")
            // console.log(product.gananciaPorcentaje)
            // console.log("product.ivaPorcentaje")
            // console.log(product.ivaPorcentaje)
            
            const neto = parseFloat(product.precioVenta) / (1  + (parseInt(product.ivaPorcentaje) / 100) )
            // console.log("neto")
        const sumGan = neto - product.precioCosto
        const porMar = ((neto - product.precioCosto) * 100) / product.precioCosto

        var sumIva = product.precioVenta - neto
        product.ivaValor = sumIva
        product.gananciaPorcentaje = porMar
        product.precioNeto = neto
        product.gananciaValor = sumGan
    }
    
    static calcularMargenPorVenta(product){
    // console.log("calculando sin precio de costo y con precio de venta")
        
            // console.log("product.precioCosto")
            // console.log(product.precioCosto)
            // console.log("product.gananciaPorcentaje")
            // console.log(product.gananciaPorcentaje)
            // console.log("product.ivaPorcentaje")
            // console.log(product.ivaPorcentaje)
            
            const sumGan = (product.precioCosto) * ( (product.gananciaPorcentaje) / 100)
            // console.log("sumGan")
            // console.log(sumGan)
            
            const neto = parseFloat(product.precioCosto) + sumGan

            // console.log("neto")
        const dsumGan = neto - product.precioCosto
        const porMar = ((neto - product.precioCosto) * 100) / product.precioCosto

        var sumIva = product.precioVenta - neto
        product.ivaValor = sumIva
        product.gananciaPorcentaje = porMar
        product.precioNeto = neto
        product.gananciaValor = sumGan
    }

    async getAll(callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase + "/ProductosTmp/GetProductos"
            url = url.replace("/api","/api")

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

    async findByDescription({description, codigoCliente},callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase +
            "/ProductosTmp/GetProductosByDescripcion?descripcion=" + (description+"")
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

    async findByDescriptionPaginado({
        description,
        codigoCliente,
        canPorPagina = 10,
        pagina = 1
    },callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase +
            "/ProductosTmp/GetProductosByDescripcionPaginado?descripcion=" + (description+"")
            if(codigoCliente){
                url += "&codigoCliente=" + codigoCliente
            }
            url += "&pageNumber=" + pagina
            url += "&rowPage=" + canPorPagina
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

    async findByCodigo({codigoProducto, codigoCliente},callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase +
            "/ProductosTmp/GetProductosByCodigo?idproducto=" + codigoProducto
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

    async findByCodigoBarras({codigoProducto, codigoCliente},callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase +
            "/ProductosTmp/GetProductosByCodigoBarra?codbarra=" + codigoProducto
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

    async update(data,callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase +
            "/ProductosTmp/UpdateProducto"
           
            const response = await axios.put(url,data);
            if(
                response.data.statusCode == 200
                || response.data.statusCode == 201

            ){
                callbackOk(response.data, response);
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
            + "/NivelMercadoLogicos/GetAllCategorias"
            
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
            + "/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=" + categoriaId

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

      


    async getFamiliaBySubCat({
        categoryId,
        subcategoryId
    }, callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
            +"/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?" +
            "CategoriaID=" + categoryId +
            "&SubCategoriaID=" + subcategoryId
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

    async getSubFamilia({
        categoryId,
        subcategoryId,
        familyId
    }, callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
            +"/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?" + 
            "CategoriaID=" + categoryId +
            "&SubCategoriaID=" + subcategoryId +
            "&FamiliaID=" + familyId

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
            + "/ProductosTmp/GetProductosByIdNML?idcategoria=" + catId
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
            + "/ProductosTmp/ProductosVentaRapidaGet"
            
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
            + "/ProductosTmp/ProductosVentaRapidaPost"
            
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
            + "/ProductosTmp/ProductosVentaRapidaPut"
            
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
            + "/ProductosTmp/UpdateProductoPrecio"

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
            + "/ProductosTmp/AddProductoNoEncontrado"

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
            + "/ProductosTmp/GetProductoTipos"

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