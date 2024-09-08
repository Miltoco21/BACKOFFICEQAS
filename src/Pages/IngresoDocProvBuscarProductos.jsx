import React, { useState, useEffect, useContext } from "react";
import {
  Paper,
  Grid,
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  ListItem,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputLabel,
  Alert,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  DialogActions,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ModelConfig from "../Models/ModelConfig";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import Product from "../Models/Product";
import Proveedor from "../Models/Proveedor";
import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";
import Validator from "../Helpers/Validator";
import BoxSelectTipo from "../Componentes/Proveedores/BoxSelectTipo";
import System from "../Helpers/System";

const IngresoDocProvBuscarProductos = ({
  selectedProveedor,
  associating,
  setAssociating,
  onAddProduct,
}) => {

  const {
    showLoading,
    hideLoading,
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const [searchText, setSearchText] = useState("");

  const [searchTermProd, setSearchTermProd] = useState("");
  const [searchCodProv, setSearchCodProv] = useState("");
  const [searchDescProv, setSearchDescProv] = useState("");
  const [searchedProducts, setSearchedProducts] = useState([]);
  
  const [tipoBuscar, setTipoBuscar] = useState(0);
  const TIPOS_BUSCAR = {
    CODIGO_SEGUN_PROVEEDOR : 0,
    DESCRIPCION_SEGUN_PROVEEDOR : 1,
    CODIGO_BARRAS : 2,
    DESCRIPCION : 3,
  }
  const [countPackage, setCountPackage] = useState(0);
  
  const handleAsocAndAddProductToSales = (product) => {
    if(countPackage<1){
      showMessage("Ingresar la cantidad de cada paquete")
      return
    }
    // console.log("producto:", product)
    // console.log("searchCodProv:", searchCodProv)
    // console.log("searchDescProv:", searchDescProv)
    const data = [{
      codigoProveedor: selectedProveedor.codigoProveedor,
      codigoSegunProveedor: "",
      descripcionSegunProveedor: "",
      codBarra: product.idProducto,
      cantidadProveedor: parseInt(countPackage + ""),
      cantidadProducto: 1,
    }]
    
    data[0].codigoSegunProveedor = searchCodProv
    data[0].descripcionSegunProveedor = searchDescProv
    
    product.cantidadProveedor = data[0].cantidadProveedor
    product.codigoSegunProveedor = data[0].codigoSegunProveedor
    product.descripcionSegunProveedor = data[0].descripcionSegunProveedor
    
    console.log("datos para asociar:", data)
    Proveedor.getInstance().asociateProduct(data, (res)=>{
      handleAddProductToSales(product)
    },()=>{
      showMessage("No se pudo asociar")
    })
  }

  const handleAddProductToSales = (product) => {
    // console.log("addProduct:", product)
    onAddProduct(product)
    setSearchedProducts([])
  };

  const buscarProductosGeneralesPorCodigoBarras = (callbackFail)=>{
    showLoading("Buscando por codigo barra")

    Product.getInstance().findByCodigoBarras({codigoProducto:searchTermProd}
      ,(prods,resx)=>{
        hideLoading()
        if(resx.data.cantidadRegistros>0){
          const res = resx
  
          if(associating){
            if (searchCodProv!= ""){
              res.data.productos.forEach((pro,ix)=>{
                res.data.productos[ix].codigoInternoProveedor = searchCodProv
              })
            }else if(searchDescProv!= ""){
              res.data.productos.forEach((pro,ix)=>{
                res.data.productos[ix].codigoInternoProveedor = searchDescProv
              })
            }
          }
        handleSearchSuccess(res, "PLU");
      }else{
        hideLoading()
        callbackFail()
      }
    },()=>{
      console.log("error")
      hideLoading()
      showMessage("No se pudo buscar")
    })
  }

  const buscarProductosGeneralesPorDescripcion = (callbackFail)=>{
    showLoading("Buscando por descripcion")
    Product.getInstance().findByDescription({description:searchTermProd}
      ,(prods,resx)=>{
        hideLoading()
        if(resx.data.cantidadRegistros>0){
          const res = resx
  
          if(associating){
            if (searchCodProv!= ""){
              res.data.productos.forEach((pro,ix)=>{
                res.data.productos[ix].codigoInternoProveedor = searchCodProv
              })
            }else if(searchDescProv!= ""){
              res.data.productos.forEach((pro,ix)=>{
                res.data.productos[ix].codigoInternoProveedor = searchDescProv
              })
            }
          }
        handleSearchSuccess(res, "PLU");
      }else{
        hideLoading()
        callbackFail()
      }
    },()=>{
      console.log("error")
      hideLoading()
      showMessage("No se pudo buscar")
    })
  }

  const buscarProductosGeneral = (callbackFail = ()=>{})=>{
    buscarProductosGeneralesPorCodigoBarras(()=>{
      buscarProductosGeneralesPorDescripcion(()=>{
        showMessage(
          `No se encontraron resultados para "${searchTermProd}"`
        );
        callbackFail()
      })
    })
  }


  const buscarProductosProvPorCodigo = (callbackFail)=>{
    showLoading("Buscando por codigo interno proveedor")

    Proveedor.getInstance().findProductsByCodigo({
      codigoBuscar:searchTermProd,
      codigoProveedor:selectedProveedor.codigoProveedor
    },(prods,resx)=>{
      hideLoading()
      if(resx.data.cantidadRegistros>0){
        const res = resx
        
        res.data.productos.forEach((pro,ix)=>{
          res.data.productos[ix].codigoInternoProveedor = searchTermProd
        })
        handleSearchSuccess(res, "Codigo Proveedor");
      }else{
        hideLoading()
        callbackFail()
      }
    },()=>{
      console.log("error")
      hideLoading()
      showMessage("No se pudo buscar")
    })
  }

  const buscarProductosProvPorDescripcion = (callbackFail)=>{
    showLoading("Buscando por descripcion interna proveedor")

    Proveedor.getInstance().findProductsByDescription({
      description:searchTermProd,
      codigoProveedor:selectedProveedor.codigoProveedor
    },(prods,resx)=>{
      hideLoading()
      if(resx.data.cantidadRegistros>0){
        const res = resx

        res.data.productos.forEach((pro,ix)=>{
          res.data.productos[ix].codigoInternoProveedor = searchTermProd
        })

        handleSearchSuccess(res, "Descripcion proveedor");
      }else{
        hideLoading()
        callbackFail()
      }
    },()=>{
      console.log("error")
      hideLoading()
      showMessage("No se pudo buscar")
    })
  }

  const buscarProductos = async () => {
    if (searchTermProd.trim() === "") {
      setSearchedProducts([]);
      showMessage("El campo de búsqueda está vacío");
      return;
    }

    if(!selectedProveedor){
      setSearchedProducts([]);
      showMessage("Seleccionar un proveedor");
      return;
    }

    switch(tipoBuscar){
      case TIPOS_BUSCAR.CODIGO_SEGUN_PROVEEDOR:
        setSearchCodProv(searchTermProd)
        setSearchDescProv("")
        buscarProductosProvPorCodigo(()=>{
          showConfirm("Quiere asociar el codigo " + searchTermProd + " con algun producto a este proveedor?",
            ()=>{
              setTipoBuscar(TIPOS_BUSCAR.DESCRIPCION)
              setSearchTermProd("")
              setCountPackage(0)
              setSearchedProducts([])
              setAssociating(true)
            },()=>{
              setTipoBuscar(TIPOS_BUSCAR.DESCRIPCION)
              setSearchTermProd("")
              setAssociating(false)
          })
        })
      break

      case TIPOS_BUSCAR.DESCRIPCION_SEGUN_PROVEEDOR:
        setSearchCodProv("")
        setSearchDescProv(searchTermProd)
        buscarProductosProvPorDescripcion(()=>{
          showConfirm("Quiere asociar la descripcion " + searchTermProd + " con algun producto a este proveedor?",
            ()=>{
              setSearchTermProd("")
              setAssociating(true)
              setCountPackage(0)
              setSearchedProducts([])
              setTipoBuscar(TIPOS_BUSCAR.DESCRIPCION)
            },()=>{
              setTipoBuscar(TIPOS_BUSCAR.DESCRIPCION)
              setSearchTermProd("")
              setAssociating(false)
          })
        })
      break
      case TIPOS_BUSCAR.CODIGO_BARRAS:
        buscarProductosGeneralesPorCodigoBarras(()=>{
          showMessage(
            `No se encontraron resultados por codigo de barras`
          );
        })

      break
      case TIPOS_BUSCAR.DESCRIPCION:
        buscarProductosGeneralesPorDescripcion(()=>{
          showMessage(
            `No se encontraron resultados descripcion`
          );
          callbackFail()
        })

      break

      default:
        showConfirm("Quiere asociar algun producto a este proveedor?",
          ()=>{
            setAssociating(true)
            buscarProductosGeneral()
          },()=>{
            setAssociating(false)
            buscarProductosGeneral()
        })
      break
    }

    
    
  };

  const handleSearchSuccess = (response, searchType) => {
    if (response.data && response.data.cantidadRegistros > 0) {
      setSearchedProducts(response.data.productos);
      console.log("Productos encontrados", response.data.productos);
      setSearchTermProd("");
      showMessage(`Productos encontrados (${searchType})`);
    } else if (response.data && response.data.cantidadRegistros === 0) {
      showMessage(`No se encontraron resultados (${searchType})`);
    } else {
      showMessage(`Error al buscar el producto (${searchType})`);
    }
  };

  return (
    <>
        <Grid item xs={12} sm={12} md={12} lg={12}
          sx={{ display: "flex", margin: "15px 0" }}
        >
          <InputLabel
            sx={{
              display: "flex",
              alignItems: "center",
              margin: 1,
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            Buscador de productos
          </InputLabel>
          <BoxSelectTipo
          tipoElegido={tipoBuscar}
          setTipoElegido={setTipoBuscar}
          />

          {associating && (searchCodProv!= "" || searchDescProv!="") &&(
            <Typography sx={{
              position:"relative",
              top:"15px",
              display:"inline-block",
              padding:"0 5px",
              height:"30px",
              textAlign:"center",
              overflowX:"scroll",
              width:"130px",
              // backgroundColor:"red"
            }}>Int.{searchCodProv || searchDescProv}</Typography>
          )}
        </Grid>


        <Grid item xs={12} md={12} lg={12} sx={{
            margin: "15px 0",
            display: "flex",
            // justifyContent: { xs: "flex-start", md: "flex-end" },
          }}
        >
          <TextField
            sx={{
              backgroundColor: "white",
              borderRadius: "5px",
            }}
            fullWidth
            placeholder={(tipoBuscar == 0 || tipoBuscar ==2) ? "Ingresa Código" : "Ingresar Descripción"}
            value={searchTermProd}
            onChange={(e) => setSearchTermProd(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                buscarProductos();
              }
            }}
          />
          {(associating) &&(

            <TextField
            sx={{
              backgroundColor: "white",
              margin:"0 5px",
              borderRadius: "5px",
            }}
            type="number"
            label= "Cant cada paquete"
            value={countPackage}
            onChange={(e) => setCountPackage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "e") {
                e.preventDefault()
              }
            }}
            />
          )}

          <Button
            variant="contained"
            onClick={buscarProductos}
            sx={{
              minWidth:"200px"
            }}
          >
            Buscar
          </Button>
        </Grid>
        <Grid item xs={12} md={12} lg={12} sx={{
            margin: "15px 0",
            display: "flex",
            // justifyContent: { xs: "flex-start", md: "flex-end" },
          }}
        >
        {/* Agregar el bloque de código para los resultados de la búsqueda de productos */}
        <TableContainer
          component={Paper}
          style={{ overflowX: "auto", maxHeight: 200, marginBottom:10 }}
        >
          <Table>
            <TableBody>
              {searchedProducts.map((product,ix) => (
                <TableRow key={ix}>
                  <TableCell sx={{ width: "33%" }}>
                    {product.nombre}
                  </TableCell>
                  <TableCell sx={{ width: "21%" }}>
                    Plu: {product.idProducto}
                  </TableCell>
                  <TableCell sx={{ width: "21%" }}>
                    Precio Costo: {product.precioCosto}
                  </TableCell>
                  <TableCell>
                    {associating ? (
                      <Button
                      onClick={() => handleAsocAndAddProductToSales(product)}
                      variant="contained"
                      color="primary"
                      >
                      Asociar y Agregar
                      </Button>
                    ) : (
                      <Button
                      onClick={() => handleAddProductToSales(product)}
                      variant="contained"
                      color="secondary"
                      >
                      Agregar
                      </Button>
                    )} 


                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      </>
  );
};

export default IngresoDocProvBuscarProductos;
