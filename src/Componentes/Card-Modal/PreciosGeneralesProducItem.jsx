import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  InputLabel,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ModelConfig from "../../Models/ModelConfig";
import { AttachMoney, Percent } from "@mui/icons-material";
import Validator from "../../Helpers/Validator";
import Product from "../../Models/Product";

export const defaultTheme = createTheme();

const PreciosGeneralesProducItem = ({ 
  product,
  index,
  setProducts,
  onUpdatedOk,
  onUpdatedWrong
 }) => {

  useEffect(()=>{
    init()

    // console.log(product)
  },[])

  const init = ()=>{
    Product.initLogica(product)
    changePriceValue("gananciaValor",product.gananciaValor)
    changePriceValue("precioNeto",product.precioNeto)
    changePriceValue("ivaValor",product.ivaValor)
    changePriceValue("precioVenta",product.precioVenta)
    changePriceValue("precioCosto",product.precioCosto)
    changePercentValue("ivaPorcentaje",product.ivaPorcentaje)
    changePercentValue("gananciaPorcentaje",product.gananciaPorcentaje)

    console.log(product)
  }

  const changePriceValue = (propName,newValue)=>{
    if(newValue == '') newValue = "0"
    newValue = parseFloat(newValue)
    newValue = newValue.toFixed(2)
    newValue = parseFloat(newValue)

    // console.log("changePriceValue para " + propName + ".. nuevo valor : " + newValue)
    if(Validator.isPeso(newValue)){
      // console.log("es valido")
      setProducts((prevProducts) => {
        const updatedProducts = [...prevProducts];
        updatedProducts[index] = {
          ...updatedProducts[index],
        }

        // console.log("el nuevo valor de " + propName + " es:", parseInt(newValue))
        updatedProducts[index][propName] = parseInt(parseFloat(newValue).toFixed(0))
        return updatedProducts;
      });
    }else{
      // console.log("no es valido")
    }
    // console.log(product)
  }

  const changePercentValue = (propName,newValue)=>{
    console.log("changePercentValue para " + propName + ".. nuevo valor : " + newValue)
    if(newValue == '') newValue = "0"
    newValue = parseFloat(newValue)
    newValue = newValue.toFixed(0)
    newValue = parseInt(newValue)


    if(Validator.isCantidad(newValue)){
      setProducts((prevProducts) => {
        const updatedProducts = [...prevProducts];
        updatedProducts[index] = {
          ...updatedProducts[index],
        }
        updatedProducts[index][propName] = newValue
        return updatedProducts;
      });
    }
    // console.log(product)

    return false
  }





  const handleGuardarClick = async () => {
    // console.log("guardando...")
    try {
      // console.log("Datos antes de la actualización:", product);
      if(product.precioNeto <= 0){
        alert("falta calcular valores")
        return
      }
      const editedProduct = {
        ...product,
        categoria: product.idCategoria,
        subCategoria: product.idsubCategoria,
        familia: product.idFamilia,
        subFamilia: product.idSubFamilia,
      };
      const response = await axios.put(
        ModelConfig.get().urlBase + 
        `/ProductosTmp/UpdateProducto`,
        editedProduct
      );
      if (response.data.statusCode === 200) {
        onUpdatedOk()
      }
    } catch (error) {
      onUpdatedWrong(error)
    }
  };


  const calcular = ()=>{
    Product.logicaPrecios(product)

    changePriceValue("gananciaValor",product.gananciaValor)
    changePriceValue("precioNeto",product.precioNeto)
    changePriceValue("ivaValor",product.ivaValor)
    changePriceValue("precioVenta",product.precioVenta)
    changePriceValue("precioCosto",product.precioCosto)
  }

  return (
    <TableRow key={index} sx={{
      backgroundColor: ( index % 2 == 0 ? "whitesmoke" : "#e5e5e5")
    }}>
      <TableCell>{product.nombre}</TableCell>
      <TableCell>
      <InputLabel>Precio compra</InputLabel>
        <TextField
          variant="outlined"
          fullWidth
          value={product.precioCosto}
          onChange={(e) => changePriceValue("precioCosto",e.target.value)}
          InputProps={{
            inputMode: "numeric", // Establece el modo de entrada como numérico
            pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            ),
          }}
        />
      </TableCell>


      <TableCell>
      <InputLabel>Utilidad</InputLabel>

      <TextField
          variant="outlined"
          fullWidth
          value={product.gananciaPorcentaje}
          onChange={(e) => changePercentValue("gananciaPorcentaje",e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Percent />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          name="gananciaValor"
          variant="outlined"
          fullWidth
          disabled={true}

          value={product.gananciaValor}
          onChange={(e) => changePriceValue("gananciaValor",e.target.value)}

          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            ),
          }}
        />
      </TableCell>
      <TableCell>
      <InputLabel>Iva</InputLabel>

      <TextField
          name="ivaPorcentaje"
          variant="outlined"
          fullWidth
          value={product.ivaPorcentaje}
          disabled={true}
          onChange={(e) => changePercentValue("ivaPorcentaje",e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Percent />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          name="ivaValor"
          variant="outlined"
          fullWidth
          disabled={true}

          value={product.ivaValor}
          onChange={(e) => changePriceValue("ivaValor",e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            ),
          }}
        />
      </TableCell>

      <TableCell>
      <InputLabel>Precio final</InputLabel>

      <TextField
          name="precio"
          variant="outlined"
          fullWidth
          value={product.precioVenta}
          onChange={(e) => changePriceValue("precioVenta",e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            ),
          }}
        />
      </TableCell>

      <TableCell>
        <Button
          onClick={() => {
            calcular()
          }}
          disabled = { !Product.puedeRecalcular(product) }
          variant="contained"
          color="primary"
        >
          Calcular
        </Button>
      </TableCell>
      <TableCell>
        <Button
          onClick={() => handleGuardarClick()}
          variant="contained"
          color="secondary"
        >
          Guardar
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default PreciosGeneralesProducItem;
