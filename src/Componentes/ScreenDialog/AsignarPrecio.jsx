/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useContext } from "react";
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


const AsignarPrecio = ({
  openDialog,
  setOpenDialog,
  product,
  onAsignPrice
}) => {


  const [precioVenta, setPrecioVenta] = useState(0)
  const handlerSaveAction = ()=>{
    if(precioVenta == 0){
      alert("Debe ingresar un monto inicial");
      return;
    }

    onAsignPrice(precioVenta)
    setOpenDialog(false)
    
    // var ac = new AperturaCaja();
    // ac.codigoUsuario = userData.codigoUsuario
    // ac.codigoSucursal = 0
    // ac.puntoVenta = "0000"
    // ac.fechaIngreso = System.getInstance().getDateForServer()
    // ac.tipo = "INGRESO"
    // ac.detalleTipo = "INICIOCAJA"
    // ac.observacion = ""
    // ac.monto = precioVenta
    // ac.idTurno = userData.idTurno

    // console.log("para enviar:");
    // console.log(ac.getFillables());
    // ac.sendToServer(()=>{
    //   var user2 = userData
    //   user2.inicioCaja = true;
    //   updateUserData(user2)
    //   setOpenDialog(false)
    // },(error)=>{
    //   alert(error);
    // })

  }
  
  return (
    <Dialog open={openDialog} onClose={()=>{}} maxWidth="lg">
        <DialogTitle>
          Asignar Precio
        </DialogTitle>
        <DialogContent>

        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="body4" color="black">
              Ingrese el monto del producto {product? product.nombre : ""}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={5}>
              <TextField
                margin="normal"
                fullWidth
                label="Monto del ingreso"
                type="number" // Cambia dinámicamente el tipo del campo de contraseña
                value={precioVenta}
                onChange={(e) => setPrecioVenta(e.target.value)}
              />
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

export default AsignarPrecio;
