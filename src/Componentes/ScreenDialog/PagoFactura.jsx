import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
  Typography
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import Boxfactura from "../BoxOptionsLite/BoxFactura";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import InfoClienteFactura from "../Forms/InfoClienteFactura";
import Client from "../../Models/Client";



const PagoFactura = ({
  openDialog,
  setOpenDialog
}) => {
  const {
    cliente,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [clienteOk, setClienteOk] = useState(null)
  const [title, setTitle] = useState("Pagar factura")

  useEffect(() => {
    if(openDialog)
    checkCliente()
  }, [openDialog]);

  const checkCliente = ()=>{
    if(!cliente){
      showMessage("Seleccionar un cliente antes de hacer el pago");
      setOpenDialog(false)
    }

    if(cliente && !Client.completoParaFactura(cliente)){
      setClienteOk(false)
      setTitle("Informacion incompleta del cliente")
      return
    }
    
    setTitle("Pagar factura")
    setClienteOk(true)

    console.log("cliente ok")
    console.log(cliente)
  }

  return (
    <Dialog open={openDialog} onClose={()=>{setOpenDialog(false)}} maxWidth={"lg"}>
      <DialogTitle>{title}</DialogTitle>
        <DialogContent onClose={()=>{setOpenDialog(false)}}>

          {clienteOk === true &&(
            <Boxfactura onClose={()=>{setOpenDialog(false)}}/>
          )}

          {clienteOk === false &&(
            <InfoClienteFactura onFinish={()=>{

            }}
            initialInfo={cliente}
            />
          )}

          {clienteOk === null &&(
            <Typography>Chequando informacion del cliente...</Typography>
          )}


        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{setOpenDialog(false)}}>Cerrar</Button>
        </DialogActions>
      </Dialog>
  );
};

export default PagoFactura;
