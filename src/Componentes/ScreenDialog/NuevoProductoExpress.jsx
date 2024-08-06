/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
  Grid,
  Typography,
  TextField
} from "@mui/material";
import SystemHelper from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import System from "../../Helpers/System";
import TecladoPrecio from "../Teclados/TecladoPrecio";
import Product from "../../Models/Product";
import Validator from "../../Helpers/Validator";


const NuevoProductoExpress = ({
  openDialog,
  setOpenDialog,
  onComplete,
  codigoIngresado
}) => {


  const [nombre, setNombre] = useState("")
  const [precioVenta, setPrecioVenta] = useState(0)
  const [tipos, setTipos] = useState([])
  const [tipoSel, setTipoSel] = useState(0)


  useEffect(()=>{
    if(!openDialog) return

    Product.getInstance().getTipos((tipos)=>{
      setTipos(tipos)
      setTipoSel(1)
    },()=>{
      setTipos([])
    })

  }, [openDialog])

  const handlerSaveAction = ()=>{
    if(nombre.trim() == ""){
      alert("Debe ingresar un nombre");
      return;
    }

    if(precioVenta == 0){
      alert("Debe ingresar un precio");
      return;
    }

    if(tipoSel == 0){
      alert("Debe ingresar un tipo de producto");
      return;
    }

    onComplete({
      codSacanner: codigoIngresado,
      nombre: nombre,
      precioVenta: precioVenta + "",
      tipoVenta: tipoSel
    })
    setOpenDialog(false)
  }
  
  return (
    <Dialog open={openDialog} onClose={()=>{}} maxWidth="lg">
        <DialogTitle>
          Nuevo producto
        </DialogTitle>
        <DialogContent>

        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="body4" color="black">
              Crear un producto con el codigo '{codigoIngresado}'
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={5}>
              <TextField
                margin="normal"
                fullWidth
                label="Nombre"
                type="text" // Cambia dinámicamente el tipo del campo de contraseña
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />

            <TextField
                margin="normal"
                fullWidth
                label="Monto del ingreso"
                type="number" // Cambia dinámicamente el tipo del campo de contraseña
                value={precioVenta}
                onChange={(e) => {
                  if(Validator.isMonto(e.target.value))
                  setPrecioVenta(e.target.value)
                }}
              />

            <select placeholder="Tipo" style={{
              width:"100%",
              height:"50px",
              padding:"10px"
            }}
            onChange={(e)=>setTipoSel(e.target.value)}>
              {
                tipos.length>0 ? (
                  tipos.map((tipo,index)=>{
                    return(
                      <option key={index} value={tipo.idTipo}>{tipo.descripcion}</option>
                    )
                  })
                ):(
                  <>
                  <option value="0">Seleccionar tipo</option>
                  <option value="1">Normal</option>
                  </>
                )
              }
            </select>
          </Grid>
          <Grid item xs={12} sm={12} md={7} lg={7}>
              <TecladoPrecio
              maxValue={100000}
              showFlag={true}
              varValue={precioVenta}
              varChanger={setPrecioVenta}
              onEnter={handlerSaveAction}
              />
          </Grid>
        </Grid>

        </DialogContent>
        <DialogActions>
          <SmallButton textButton="Confirmar" actionButton={handlerSaveAction}/>
          <Button onClick={()=>{
            setOpenDialog(false)
          }}>No agregar</Button>
        </DialogActions>
      </Dialog>
  );
};

export default NuevoProductoExpress;
