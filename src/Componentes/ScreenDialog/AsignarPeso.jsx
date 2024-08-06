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
import TecladoPeso from "../Teclados/TecladoPeso";
import InputPeso from "../Elements/InputPeso";
import Validator from "../../Helpers/Validator";


const AsignarPeso = ({
  openDialog,
  setOpenDialog,
  product,
  title = "Asignar Peso",
  currentWight = 0,
  onAsignWeight
}) => {


  const [peso, setPeso] = useState(0)

  useEffect(()=>{
    setPeso(currentWight)
  }, [openDialog])

  const handlerSaveAction = ()=>{
    if(peso == 0){
      alert("Debe ingresar un peso");
      return;
    }

    onAsignWeight(peso)
    setOpenDialog(false)
    
  }

  const checkChangeWeight = (newWeight)=>{
    if(Validator.isPeso(newWeight))
      setPeso(newWeight)
  }
  
  return (
    <Dialog open={openDialog} onClose={()=>{}} maxWidth="lg">
        <DialogTitle>
          { title }
        </DialogTitle>
        <DialogContent>

        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="body4" color="black">
              Ingrese el peso del producto {product? product.nombre : ""}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={5}>
              <InputPeso
                inputValue={peso}
                funChanger={checkChangeWeight}
              />


          </Grid>
          <Grid item xs={12} sm={12} md={7} lg={7}>
              <TecladoPeso
              maxValue={100000}
              showFlag={true}
              varValue={peso}
              varChanger={checkChangeWeight}
              onEnter={handlerSaveAction}
              />
          </Grid>
        </Grid>

        </DialogContent>
        <DialogActions>
          <SmallButton textButton="Confirmar" actionButton={handlerSaveAction}/>
          <Button onClick={()=>{
            setOpenDialog(false)
          }}>Cancelar</Button>
        </DialogActions>
      </Dialog>
  );
};

export default AsignarPeso;
