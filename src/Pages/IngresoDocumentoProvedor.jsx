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
  Snackbar,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  DialogActions,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import SideBar from "../Componentes/NavBar/SideBar";
import Add from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchListDocumento from "./../Componentes/SearchlistDocumento/SearchListDocumento";
import ModelConfig from "../Models/ModelConfig";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import Product from "../Models/Product";
import Proveedor from "../Models/Proveedor";
import { SelectedOptionsContext } from "./../Componentes/Context/SelectedOptionsProvider";
import Validator from "../Helpers/Validator";
import BoxSelectTipo from "../Componentes/Proveedores/BoxSelectTipo";
import PreciosGeneralesProducItem from "../Componentes/Card-Modal/PreciosGeneralesProducItem";
import AjustePrecios from "../Componentes/ScreenDialog/AjustePrecios";
import System from "../Helpers/System";

const IngresoDocumentoProveedor = () => {

  const {
    showLoading,
    hideLoading,
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const apiUrl = ModelConfig.get().urlBase;

  const [open, setOpen] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [folioDocumento, setFolioDocumento] = useState("");
  const [fecha, setFecha] = useState(dayjs());
  const [searchText, setSearchText] = useState("");
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarOpen200, setSnackbarOpen200] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchSnackbarOpen, setSearchSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTermProd, setSearchTermProd] = useState("");
  const [searchCodProv, setSearchCodProv] = useState("");
  const [searchDescProv, setSearchDescProv] = useState("");
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  const [showPanel, setShowPanel] = useState(true);
  const [tipoBuscar, setTipoBuscar] = useState(0);
  const TIPOS_BUSCAR = {
    CODIGO_SEGUN_PROVEEDOR : 0,
    DESCRIPCION_SEGUN_PROVEEDOR : 1,
    CODIGO_BARRAS : 2,
    DESCRIPCION : 3,
  }
  const [associating, setAssociating] = useState(null)
  const [countPackage, setCountPackage] = useState(0);
  
  const [showAjustePrecios, setShowAjustePrecios] = useState(false);
  const [productoSel, setProductoSel] = useState(null);


  const ajustarPrecio = (producto, index)=>{
    producto.index = index
    setProductoSel(producto)
    setShowAjustePrecios(true)
  }
  // console.log("selectedProveedor", selectedProveedor);

  const setOpenSnackbar = (value) => {
    setSnackbarOpen(value);
  };

  const handleQuantityChange = (value, index) => {
    const updatedProducts = [...selectedProducts];
    // Parse the input value to an integer
    const parsedValue = parseInt(value);

    // Check if the parsed value is NaN or less than zero
    if (isNaN(parsedValue) || parsedValue < 0) {
      showMessage("valor incorrecto")
      return
      // If it's NaN or less than zero, set quantity and total to zero
      // updatedProducts[index].cantidad = 0;
      // updatedProducts[index].total = 0;
    } else {
      // Otherwise, update quantity and calculate total
      updatedProducts[index].cantidad = parsedValue;
      updatedProducts[index].total = calcularTotal(
        updatedProducts[index].precioCosto,
        parsedValue,
        updatedProducts[index].cantidadProveedor
      )

    }

    setSelectedProducts(updatedProducts);
  };
  
  const handleCostoChange = (value, index) => {
    const updatedProducts = [...selectedProducts];
    console.log("updatedProduct")
    console.log(updatedProducts[index])
    // // Parse the input value to an integer
    const parsedValue = parseInt(value);

    // Check if the parsed value is NaN or less than zero
    if (isNaN(parsedValue) || parsedValue < 0) {

      showMessage("valor incorrecto")
      // If it's NaN or less than zero, set quantity and total to zero
      // updatedProducts[index].cantidad = 0;
      // updatedProducts[index].precioCosto = 0;
      // updatedProducts[index].precio = 0;
      // updatedProducts[index].total = 0;
      return
    } else {
      // Otherwise, update quantity and calculate total

      updatedProducts[index].precioCosto = parsedValue;
      const prod = updatedProducts[index]
      updatedProducts[index] = Product.logicaPrecios(prod,"final")
      // updatedProducts[index].precio = parsedValue;
      updatedProducts[index].total = calcularTotal(
        parsedValue,
        updatedProducts[index].cantidad,
        updatedProducts[index].cantidadProveedor
      )
    }

    setSelectedProducts(updatedProducts);
  };


  const calcularTotal = (costo,cantidad, cantidadProveedor)=>{
    console.log("calcularTotal..costo", costo, "..cantidad:", cantidad,"..cantidad proveedor:",cantidadProveedor)
    return parseInt(costo + "") * parseInt(cantidad + "") * parseInt(cantidadProveedor + "")
  }

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
    console.log("datos para asociar:", data)
    Proveedor.getInstance().asociateProduct(data, (res)=>{
      handleAddProductToSales(product)
    },()=>{
      showMessage("No se pudo asociar")
    })
  }

  const handleAddProductToSales = (product) => {
    
    const existingProductIndex = selectedProducts.findIndex(
      (p) => (p.id === product.idProducto && p.codigoInternoProveedor == product.codigoInternoProveedor)
    );

    if (existingProductIndex !== -1) {
      // Producto ya existe, incrementar la cantidad
      const updatedProducts = selectedProducts.map((p, index) => {
        if (index === existingProductIndex) {
          const updatedQuantity = p.cantidad + 1;
          return {
            ...p,
            cantidad: updatedQuantity,
            total: calcularTotal(
              p.precioCosto,
              updatedQuantity,
              p.cantidadProveedor
            )


          };
        }
        return p;
      });
      setSelectedProducts(updatedProducts);
    } else {
      // Producto no existe, agregar como nuevo
      const newProduct = {
        // id: product.idProducto,
        // nombre: product.nombre,
        // cantidad: 1,
        // precio: product.precioCosto,
        // precioVenta: product.precioCosto,
        // total: product.precioCosto,
        // precioCosto: product.precioCosto,
      };
      product.id = product.idProducto
      product.cantidad = 1
      // product.precioVenta = product.precioCosto
      if(product.cantidadProveedor === undefined){
        product.cantidadProveedor = countPackage
      }
      if(product.cantidadProveedor === 0){
        product.cantidadProveedor = 1
      }

      product = Product.iniciarLogicaPrecios(product)
      
      product.total = calcularTotal(product.precioCosto,product.cantidad,product.cantidadProveedor)
      product.impuestosValor = Product.calcularImpuestos(product)
      
      // if(!product.precioVenta){
      //   product.precioVenta = Math.round(product.precioCosto * 1.3 * (1+(product.impuestosValor / 100) ))
      // }

      console.log("agregado queda asi:", System.clone(product))
      // setSelectedProducts([...selectedProducts, newProduct]);
      console.log("seleccionados:",[...selectedProducts, product]);
      setSelectedProducts([...selectedProducts, product]);
    }

    setSearchedProducts([]);
    setAssociating(false)
    setErrorMessage("");
  };

  useEffect(() => {
    Proveedor.getInstance().getAll((provs)=>{
      setProveedores(provs);
    },()=>{})
  }, []);

  const abrirModalIngresoDocumento = () => {
    setOpen(true);
    setSelectedProveedor("");
  };

  const cerrarModalIngresoDocumento = () => {
    setOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarOpen200(false);
  };

  const buscarProveedor = () => {
    setSelectedProveedor("");
    if (searchText.trim() === "") {
      setSnackbarMessage("Campo vacío, ingresa proveedor ...");
      setSnackbarOpen(true);
    } else {
      setSnackbarOpen(false);
      const filteredResults = proveedores.filter((proveedor) =>
        proveedor.razonSocial.toLowerCase().includes(searchText.toLowerCase()) ||
        proveedor.rut.toLowerCase().includes(searchText.toLowerCase())
      );
      setProveedoresFiltrados(filteredResults);
  
      if (filteredResults.length === 0) {
        setSearchSnackbarOpen(true);
      } else {
        setSearchSnackbarOpen(false);
      }
    }
  };

  const clickEnProveedor = (result) => {
    setSelectedProveedor(result);
    setProveedoresFiltrados([]);
    setSearchText("");
    setShowPanel(false)
  };

  const hoy = dayjs();
  const inicioRango = dayjs().subtract(1, "week");

  const buscarProductosGeneralesPorCodigoBarras = (callbackFail)=>{
    showLoading("Buscando por codigo barra")

    Product.getInstance().findByCodigoBarras({codigoProducto:searchTermProd},(prods,res)=>{
      if(res.data.cantidadRegistros>0){
        hideLoading()
        handleSearchSuccess(res, "PLU");
      }else{
        hideLoading()
        callbackFail()
      }
    },()=>{})
  }

  const buscarProductosGeneralesPorDescripcion = (callbackFail)=>{
    showLoading("Buscando por descripcion")
    Product.getInstance().findByDescription({description:searchTermProd},(prods,res2)=>{
      if(res2.data.cantidadRegistros>0){
        hideLoading()
        handleSearchSuccess(res2, "Descripción");
      }else{
        hideLoading()
      callbackFail()
    }
    },()=>{})
  }

  const buscarProductosGeneral = (callbackFail = ()=>{})=>{
    buscarProductosGeneralesPorCodigoBarras(()=>{
      buscarProductosGeneralesPorDescripcion(()=>{
        setSnackbarMessage(
          `No se encontraron resultados para "${searchTermProd}"`
        );
        setOpenSnackbar(true);
        setTimeout(() => {
          setOpenSnackbar(false);
        }, 3000);

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
    },()=>{})
  }

  const buscarProductosProvPorDescripcion = (callbackFail)=>{
    showLoading("Buscando por descripcion interna proveedor")

    Proveedor.getInstance().findProductsByDescription({
      description:searchTermProd,
      codigoProveedor:selectedProveedor.codigoProveedor
    },(prods,res)=>{
      hideLoading()
      if(res.data.cantidadRegistros>0){
        handleSearchSuccess(res, "Descripcion proveedor");
      }else{
        hideLoading()
        callbackFail()
      }
    },()=>{})
  }

  const buscarProductos = async () => {
    if (searchTermProd.trim() === "") {
      setSearchedProducts([]);
      setSnackbarMessage("El campo de búsqueda está vacío");
      setSnackbarOpen(true);
      return;
    }

    if(!selectedProveedor){
      setSearchedProducts([]);
      setSnackbarMessage("Seleccionar un proveedor");
      setSnackbarOpen(true);
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
          setSnackbarMessage(
            `No se encontraron resultados por codigo de barras`
          );
          setOpenSnackbar(true);
          setTimeout(() => {
            setOpenSnackbar(false);
          }, 3000);
        })

      break
      case TIPOS_BUSCAR.DESCRIPCION:
        buscarProductosGeneralesPorDescripcion(()=>{
          setSnackbarMessage(
            `No se encontraron resultados descripcion`
          );
          setOpenSnackbar(true);
          setTimeout(() => {
            setOpenSnackbar(false);
          }, 3000);

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
      setSnackbarOpen(true);
      setSnackbarMessage(`Productos encontrados (${searchType})`);
      setTimeout(() => {
        setSnackbarOpen200(false);
      }, 3000);
    } else if (response.data && response.data.cantidadRegistros === 0) {
      setSnackbarMessage(`No se encontraron resultados (${searchType})`);
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
    } else {
      setSnackbarMessage(`Error al buscar el producto (${searchType})`);
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (!tipoDocumento) {
        setErrorMessage("Por favor complete tipo de documento.");
        setLoading(false);
        return;
      }

      if (!folioDocumento) {
        setErrorMessage("Por favor complete campo folio.");
        setLoading(false);
        return;
      }else if (folioDocumento){
        setErrorMessage("");
      }

      if (!selectedProveedor) {
        setErrorMessage("No se ha seleccionado ningún proveedor.");
        setLoading(false);
        return;
      }
      if (selectedProducts.length === 0) {
        setErrorMessage("No se han seleccionado productos.");
        setLoading(false);
        return;
      }

      // Calculating total
      let total = 0;
      selectedProducts.forEach((product) => {
        total += product.total;
      });
      if (total === 0) {
        setErrorMessage("El total no puede ser cero.");
        setLoading(false);
        return;
      }
  

      const proveedorCompraDetalles = selectedProducts.map((product) => ({
        codProducto: product.id,
        descripcionProducto: product.nombre,
        cantidad: product.cantidad,
        precioUnidad: product.precioVenta,
        costo: product.total,
      }));

      const dataToSend = {
        fechaIngreso: fecha.toISOString(),
        tipoDocumento: tipoDocumento,
        folio: folioDocumento,
        codigoProveedor: selectedProveedor.codigoProveedor,
        total: total,
        proveedorCompraDetalles,
      };

      console.log("Datos a enviar al servidor:", dataToSend);

      const response = await axios.post(
        apiUrl + "/Proveedores/AddProveedorCompra",
        dataToSend
      );

      console.log("Datos enviados al servidor:", response.data);

      setSnackbarMessage(response.data.descripcion);
      setSnackbarOpen(true);

      setTipoDocumento("");
      setFolioDocumento("");
      setFecha(dayjs());
      setSearchText("");
      setSelectedProveedor(null);
      setSelectedProducts([]);
      setProveedoresFiltrados([]);

      setErrorMessage("");
      setTimeout(() => {
        cerrarModalIngresoDocumento();
      }, "2000");
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      setSnackbarMessage("Error al guardar los datos.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  const handleFolioChange = (e) => {
    // Obtener la tecla presionada
    const keyPressed = e.key;

    if(Validator.isTeclaControl(e)){
      return
    }

    if(!Validator.isNumeric(keyPressed)){
      showMessage("valor incorrecto")
      e.preventDefault();
      return
    }
  };
  const grandTotal = selectedProducts.reduce(
    (total, product) => total + product.total,
    0
  );

  const handleDeleteProduct = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{ my: 1, mx: 2 }}
          startIcon={<Add />}
          onClick={abrirModalIngresoDocumento}
        >
          Ingresa Documento de Compra
        </Button>

        <SearchListDocumento></SearchListDocumento>
        <Dialog open={open} fullWidth minHeight={"lg"} maxWidth={"md"}
          PaperProps={{
            sx: {
              height: "90%"
            }
          }}>
            
          <DialogContent>
            <Box sx={{
              backgroundColor:"#f0f0f0",
              borderRadius:"3px",
              position:"relative",
              border:"1px solid #b9b5b5",
              padding:"20px"
            }}>
          <Grid container spacing={2}>
              <Button sx={{
                position:"absolute",
                bottom: 0,
                color:"#fff",
                right:"10px",
                backgroundColor:"#b9b5b5",
                padding:"4px 10px",

                borderRadius:(showPanel ? "20px 0 0 0" : "0 0 0 20px"),
                top:(showPanel ? "" : "0px"),
                marginRight:"-10px",
                "&:hover": {
                  backgroundColor: "#000 ",
                  color: "white",
                },
              }} onClick={()=>{
                setShowPanel(!showPanel)
              }}
              endIcon={ showPanel ? (<ArrowUpward />) : (<ArrowDownward/>)}>
              { showPanel ? "Ocultar panel" : "Ver panel"}
              </Button>
            { showPanel && 
            (<>
            <Grid item xs={12} sm={12} md={6} lg={6}>
          
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}
            <TextField
              select
              label="Tipo de documento"
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="Factura">Factura</MenuItem>
              <MenuItem value="Boleta">Boleta</MenuItem>
              <MenuItem value="Ticket">Ticket</MenuItem>
              <MenuItem value="Ingreso Interno">Ingreso Interno</MenuItem>
            </TextField>

            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
            

            <TextField
              name="folioDocumento"
              label="Folio documento"
              value={folioDocumento}
              onKeyDown={handleFolioChange}
              onChange={(e) => setFolioDocumento(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />

            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de ingreso"
                value={fecha}
                onChange={(newValue) => setFecha(newValue)}
                renderInput={(params) => (
                  <TextField {...params} sx={{ mb: 2 }} />
                )}
                format="DD/MM/YYYY"
                minDate={inicioRango}
                maxDate={hoy}
                sx={{ 
                  width:"100%"
                }}
              />
            </LocalizationProvider>
              </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>

            <TextField
              fullWidth
              sx={{ mb: 2 }}
              placeholder="Nombre o RUT de Proveedor"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
              if(e.key == "Enter"){
                buscarProveedor()
              }
              }}
            />
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              
            <Button onClick={buscarProveedor} variant="contained" sx={{
              width:"100%",
              height:"55px"
            }}>
              Buscar
            </Button>

            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              {proveedoresFiltrados.map((result) => (
                <Chip
                  key={result.codigoProveedor}
                  label={`${result.razonSocial} ${result.rut}`}
                  onClick={() => clickEnProveedor(result)}
                  sx={{
                    backgroundColor: "#2196f3",
                    margin: "5px",
                  }}
                />
              ))}
              </Grid>
              </>
            )}
            </Grid>
            </Box>

            <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12}>
            <Box
              sx={{ 
                flexWrap: "nowrap", 
                overflowX: "auto",

                position:"relative",
                top: "-50px",
                display:"inline-block",
                marginBottom:"-40px"
              }}
            >
              {selectedProveedor && (
                <ListItem key={selectedProveedor.codigoCliente}
                sx={{
                  
                }}>
                  <Chip
                    label={`${selectedProveedor.razonSocial} ${selectedProveedor.rut}`}
                    icon={<CheckCircleIcon />}
                    sx={{
                      backgroundColor: "#A8EB12",
                      margin: "5px",
                    }}
                  />

                {associating && (
                  <Chip
                  label={"Asociando"}
                  icon={<CheckCircleIcon />}
                  sx={{
                    backgroundColor: (associating ? "#1DB8FF" : "#fff"),
                    margin: "5px",
                  }}

                  onClick={()=>{

                    showConfirm("Cancelar asociacion?",()=>{
                      setAssociating(false)
                    },()=>{})
                  }}
                  />
                )}
                </ListItem>
              )}

            </Box>

            <div style={{ 
              alignItems: "center", 
              marginTop:"-20px"
              }}>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
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
              </Grid>


              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                sx={{
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
                {(tipoBuscar == 0 || tipoBuscar == 1 || associating) &&(

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
              {/* Agregar el bloque de código para los resultados de la búsqueda de productos */}
              <TableContainer
                component={Paper}
                style={{ overflowX: "auto", maxHeight: 200, marginBottom:10 }}
              >
                <Table>
                  <TableBody key={123132}>
                    {searchedProducts.map((product) => (
                      <TableRow key={product.id}>
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

              {/* Fin del bloque de código para los resultados de la búsqueda de productos */}
              <TableContainer
                component={Paper}
                style={{ overflowX: "auto", height: 250 }}
              >
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "23%" }}>Descripción</TableCell>
                      <TableCell sx={{ width: "23%" }}>Precio Costo</TableCell>
                      <TableCell sx={{ width: "23%" }}>Cantidad</TableCell>
                      <TableCell sx={{ }}>Total</TableCell>
                      <TableCell  sx={{  }}>P. Venta sugerido</TableCell>
                      <TableCell colSpan={2} sx={{ width: "20%" }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{
                    minHeight:"250px",
                    overflow:"scroll"
                  }}>
                    {selectedProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography>{product.nombre}</Typography>
                          {product.codigoInternoProveedor && (
                            <Typography sx={{
                              backgroundColor:"#ebffcc",
                              display:"inline-block",
                              padding:"10px"
                            }}>Int.{product.codigoInternoProveedor}</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {/* {product.precioCosto} */}

                        <TextField
                            value={product.precioCosto}
                            onChange={(e) =>
                              handleCostoChange(e.target.value, index)
                            }
                            />
                            </TableCell>
                        <TableCell>
                          
                          <TextField
                            value={product.cantidad}
                            onChange={(e) =>
                              handleQuantityChange(e.target.value, index)
                            }
                            sx={{
                              width:"50%",
                              display:"inline-block"

                            }}
                          />
                          {product.cantidadProveedor > 1 && (
                            <Typography sx={{
                              marginLeft:"10px",
                              position:"relative",
                              top:"15px",
                              display:"inline-block"
                            }}> x {product.cantidadProveedor}</Typography>
                          )}
                        </TableCell>
                        <TableCell>{product.total}</TableCell>
                        <TableCell>{product.precioVenta}</TableCell>
                        <TableCell>
                        <Button
                            onClick={() => {ajustarPrecio(product,index)
                            }}
                            variant="contained"
                            color="error"
                          >
                            Ajuste precios
                          </Button>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            
                            onClick={() => handleDeleteProduct(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                        
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TextField
                label="Total"
                value={grandTotal}
                sx={{ mt: 3 }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
          </Grid>
          </Grid>

          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              Guardar
            </Button>
            <Button onClick={() => {
              showConfirm("Realmente quiere salir?",()=>{
                cerrarModalIngresoDocumento()

                setProductoSel(null)
                setCountPackage(0)
                setAssociating(null)
                setTipoBuscar(0)
                setShowPanel(true)
                setSelectedProducts([])
                setSearchedProducts([])
                setSearchDescProv("")
                setSearchCodProv("")
                setSearchTermProd("")
                setSelectedProveedor(null)
                setProveedores([])
                setTipoDocumento("")
                setFolioDocumento("")
                
              },()=>{})
              }} color="primary">
              Salir
          </Button>
          </DialogActions>
          </DialogContent>
        </Dialog>


        <AjustePrecios 
          openDialog={showAjustePrecios}
          setOpenDialog={setShowAjustePrecios}
          productoSel={productoSel}
          onChange={(changed)=>{
            console.log("el changed es", changed)
            changed.total = calcularTotal(changed.precioCosto, changed.cantidad, changed.cantidadProveedor)
            System.addAllInArr(setSelectedProducts,selectedProducts,changed.index, changed)
          }}
        />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
        <Snackbar
          open={snackbarOpen200}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={errorMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
        <Snackbar
          open={searchSnackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSearchSnackbarOpen(false)}
          message="No se encontraron resultados"
        />
      </Box>
    </div>
  );
};

export default IngresoDocumentoProveedor;
