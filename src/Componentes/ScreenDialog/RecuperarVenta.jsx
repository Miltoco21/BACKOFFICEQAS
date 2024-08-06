import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TableContainer,
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  DialogTitle
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import TableSelecRecuperarVenta from "../BoxOptionsLite/TableSelect/TableSelecRecuperarVenta";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Suspender from "../../Models/Suspender";
import Product from "../../Models/Product";
import MainButton from "../Elements/MainButton";


const RecuperarVenta = ({openDialog,setOpenDialog}) => {
  const {
    userData,
    salesData,
    addToSalesData,
    showConfirm,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [selectedSale, setSelectedSale] = useState(null)


  useEffect(()=>{
    if(!openDialog) return
    setSelectedSale(null)
  },[openDialog])

  const onSelect = (selectedSalex)=>{
    setSelectedSale(selectedSalex)
  }


  const onConfirm = ()=>{
    if(!selectedSale){
      showMessage("Elegir una opcion de la lista")
      return
    }

    selectedSale.ventaSuspenderDetalle.forEach((product)=>{
      product.idProducto = parseInt(product.codProducto)
      addToSalesData(product)
    })
    Suspender.getInstance().recuperar(selectedSale.id, ()=>{
      showMessage("Recuperado correctamete")
      setOpenDialog(false)
    }, ()=>{
      showMessage("No se pudo recuperar")
    })
  }

  return (
      <Dialog open={openDialog} onClose={()=>{
        setOpenDialog(false)
      }}
      >
        <DialogTitle>Recuperar Venta</DialogTitle>
        <DialogContent>
        <Grid container item xs={12} spacing={2}>
          
              <Grid item xs={12} lg={12}>
              <Grid container spacing={2}>

              <TableSelecRecuperarVenta 
              onSelect={onSelect}
              selectedItem={selectedSale}
              setSelectedItem={setSelectedSale}
              />
              </Grid>
              </Grid>
              
        </Grid>
        </DialogContent>
        <DialogActions>

          <SmallButton
            actionButton={onConfirm}
            textButton="Recuperar"
          />

          <Button onClick={()=>{
            setOpenDialog(false)
          }}>Atras</Button>


        </DialogActions>
      </Dialog>
  );
};

export default RecuperarVenta;
