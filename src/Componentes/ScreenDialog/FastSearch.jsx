import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import Product from "../../Models/Product";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import TableSelecProduct from "../BoxOptionsLite/TableSelect/TableSelecProduct";
import ModelConfig from "../../Models/ModelConfig";
import LongClick from "../../Helpers/LongClick";

const FastSearch = ({openDialog,setOpenDialog}) => {

  const {
    userData,
    addToSalesData,
    showConfirm,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [prods, setProds] = useState([])
  const [showSearchProduct, setShowSearchProduct] = useState(false)
  const [findedProduct, setFindedProduct] = useState(null)
  const [settingProduct, setSettingProduct] = useState(null)
  
  const [isChanging, setIsChanging] = useState(false)

  useEffect(()=>{
    if(!openDialog) return
    setProds([])
    getProducts()
  },[openDialog]);


  const getProducts = ()=>{
    setProds([])
    Product.getInstance().getProductsFastSearch((productosServidor)=>{
      setProds(productosServidor)
      completarBotonesFaltantes(productosServidor)
    },()=>{
      setProds([])
    })
  }

  const completarBotonesFaltantes = (productosServidor)=>{
    const configs = ModelConfig.get();
    const cantConfig = parseInt(configs.cantidadProductosBusquedaRapida)
    var botonesByBotonNum = []
    const hay = productosServidor.length
    productosServidor.forEach(prodSer => {
      if(prodSer.boton <= cantConfig)
      botonesByBotonNum[ prodSer.boton ] = prodSer
    });

    for (let i = 1; i <= cantConfig; i++) {
      if(botonesByBotonNum[i] == undefined){
        botonesByBotonNum[i] = {
          boton: i,
          codigoProducto : 0,
          nombre : "Boton " + i,
        }
      }
    }
    setProds(botonesByBotonNum)
  }

  const onSelect = (product)=>{
    setIsChanging(false)
    if(product.codigoProducto){//si tiene codigo 0 o null es un boton sin asignar
      product.idProducto = product.codigoProducto
      addToSalesData(product)
      setOpenDialog(false)
    }else{
      showConfirm("No esta configurado este boton, desea configurarlo ahora?",()=>{
        // console.log("configurando el boton " + product.boton)
        setSettingProduct(product)
        setShowSearchProduct(true)
      })
    }
  }

  const handleSelectProduct = (findedProductx)=>{
    // console.log("producto encontrado:")
    // console.log(findedProductx)
    setShowSearchProduct(false)
    setFindedProduct(findedProductx)

    findedProductx.codigoProducto = findedProductx.idProducto
    findedProductx.codigoUsuario = userData.codigoUsuario
    findedProductx.codigoSucursal = 0
    findedProductx.puntoVenta = "0000",
    findedProductx.boton = settingProduct.boton
    
    // console.log("para enviar:")
    // console.log(findedProductx)
    if(isChanging){
      findedProductx.id = settingProduct.id,
      Product.getInstance().changeProductFastSearch(findedProductx,(response)=>{
        showMessage("Se ha modificado correctamente")
        setProds([])
        getProducts()
      },()=>{
        showMessage("No se pudo modificar")
      })
    }else{
      Product.getInstance().addProductFastSearch(findedProductx,(response)=>{
        showMessage("Se agrego correctamente")
        setProds([])
        getProducts()
      },()=>{
        showMessage("No se pudo agregar")
      })
    }
  }


  return (
      <Dialog open={openDialog} onClose={()=>{
        setOpenDialog(false)
      }}
      maxWidth="md"
      
      >
        <DialogContent>
        <Grid container spacing={2} style={{
              padding: "10px",

            }}>

        <Grid item xs={12} sm={5} md={10} lg={10} style={{
          display: (!showSearchProduct ?"block" : "none")
        }}>

          {prods.length>0 && prods.map((product, index)=>{
            var styles = {
              minHeight:"80px"
            }

            if(!product.codigoProducto){
              styles.backgroundColor = "#465379"
            }

            const longBoleta = new LongClick(2);
            longBoleta.onClick(()=>{
              onSelect(product)
            })
            longBoleta.onLongClick(()=>{
              setIsChanging(true)
              var txtCambioBoton = ""
              if(product.codigoProducto){
                txtCambioBoton = "Cambiar el boton " + product.nombre + " ?"
              }else{
                txtCambioBoton = "No esta configurado este boton, desea configurarlo ahora?"
              }
              showConfirm(txtCambioBoton,()=>{
                console.log("configurando el boton " + product.boton)
                setSettingProduct(product)
                setShowSearchProduct(true)
              })
              
            })


            return(
              <SmallButton key={index} textButton={product.nombre} 
                onTouchStart={()=>{longBoleta.onStart()}}
                onMouseDown={()=>{longBoleta.onStart()}}
                onTouchEnd={()=>{longBoleta.onEnd()}}
                onMouseUp={()=>{longBoleta.onEnd()}}
                onMouseLeave={()=>{longBoleta.cancel()}}
                onTouchMove={()=>{longBoleta.cancel()}}
              // actionButton={()=>{
              //   onSelect(product);
              // }}
              style={styles}
              />
            )})
          }
          </Grid>

          <TableSelecProduct
          show={showSearchProduct}
          onSelect={handleSelectProduct}
          />
        </Grid>
        </DialogContent>
        <DialogActions>

          {showSearchProduct && (
            <Button onClick={()=>{
              setShowSearchProduct(false)
            }}>volver</Button>
          )}
          <Button onClick={()=>{
            setOpenDialog(false)
          }}>cerrar</Button>



        </DialogActions>
      </Dialog>
  );
};

export default FastSearch;
