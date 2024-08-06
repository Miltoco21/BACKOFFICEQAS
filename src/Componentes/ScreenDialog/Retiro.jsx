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
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

import BoxRetiro from "../BoxOptionsLite/Retiro/BoxRetiro";
import System from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import Retiro from "../../Models/Retiro";
import Proveedor from "../../Models/Proveedor";

const PantallaRetiro = ({openDialog, setOpenDialog}) => {
  const {
    userData
  } = useContext(SelectedOptionsContext);

  const [tabNumber, setTabNumber] = useState(0);
  const [infoRetiro, setInfoRetiro] = useState({})
  const tipo = ["caja","pagodefactura","anticipotrabajador"]

  useEffect(()=>{
    if(!openDialog) return

  },[openDialog])


  const handlerSaveAction = ()=>{
    if(tipo[tabNumber] == "caja"){
      if(!infoRetiro.motivo || infoRetiro.motivo.trim()=="" || !infoRetiro.monto){
        alert("Ingrese los datos para continuar");
        return
      }
      const retiro = new Retiro()
      retiro.codigoUsuario = userData.codigoUsuario
      retiro.codigoSucursal = 0
      retiro.puntoVenta = "0000"
      retiro.fechaIngreso = System.getInstance().getDateForServer()
      retiro.idTurno = userData.idTurno
      
      retiro.fill(infoRetiro);
      retiro.retiroDeCaja( ()=>{
        alert("Realizado correctamente");
        setOpenDialog(false)
      },()=>{
        alert("No se pudo realizar.");

      })
    }else if(tipo[tabNumber] == "anticipotrabajador"){
      if(!infoRetiro.codigoUsuario){
        alert("Seleccionar trabajador para continuar");
        return
      }
      if(parseFloat(infoRetiro.monto)<=0){
        alert("Ingrese monto para continuar");
        return
      }
      
      const retiro = new Retiro()
      retiro.fill(infoRetiro);
      retiro.codigoUsuario = userData.codigoUsuario
      retiro.codigoSucursal = 0
      retiro.observacion = infoRetiro.codigoUsuario + ""
      retiro.puntoVenta = "0000"
      retiro.fechaIngreso = System.getInstance().getDateForServer()
      retiro.idTurno = userData.idTurno
      
      retiro.anticipoTrabajador( ()=>{
        alert("Realizado correctamente");
        setOpenDialog(false)
      },()=>{
        alert("No se pudo realizar.");

      })
    }else if(tipo[tabNumber] == "pagodefactura"){
      console.log("infoRetiro:")
      console.log(infoRetiro)
      if(!infoRetiro.proveedor || !infoRetiro.monto || !infoRetiro.deudas || infoRetiro.deudas.length<1){
        alert("Completar los datos");
        return
      }
      const prv = new Proveedor()
      prv.fechaIngreso = System.getInstance().getDateForServer()
      prv.codigoUsuario = userData.codigoUsuario
      prv.codigoSucursal = "0"
      prv.puntoVenta = "0000"
      prv.compraDeudaIds = []

      infoRetiro.deudas.forEach((deuda)=>{
        prv.compraDeudaIds.push({
          idProveedorCompraCabecera : deuda.id,
          total : deuda.total
        })
      })
      prv.montoPagado = infoRetiro.monto
      prv.metodoPago = "EFECTIVO"
      prv.pagarDeuda(()=>{
        alert("Realizado correctamente");
        setOpenDialog(false)
      },()=>{
        alert("No se pudo realizar.");
      })
    }
  }
  
  return (
    <Dialog open={openDialog} onClose={()=>{setOpenDialog(false)}}
      maxWidth="md">
        <DialogTitle>
          Retiros
        </DialogTitle>
        <DialogContent>
          <BoxRetiro 
            tabNumber={tabNumber}
            setTabNumber={setTabNumber}
            infoRetiro={infoRetiro} 
            setInfoRetiro={setInfoRetiro}
          />
        </DialogContent>
        <DialogActions>
          <SmallButton textButton="Retirar" actionButton={handlerSaveAction}/>
          <Button onClick={()=>{setOpenDialog(false)}}>cerrar</Button>
        </DialogActions>
      </Dialog>
  );
};

export default PantallaRetiro;
