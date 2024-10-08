import React, { useState, useEffect, useContext } from "react";

import { Grid, Paper, Dialog } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";


import InputName from "../Elements/Compuestos/InputName";
import InputFile from "../Elements/Compuestos/InputFile"
import SelectPasarela from "../Elements/Compuestos/SelectPasarela"
import SelectImpresora from "../Elements/Compuestos/SelectImpresora";

import SendingButton from "../Elements/SendingButton";
import User from "../../Models/User";
import System from "../../Helpers/System";
import Pasarela from "../../Models/Pasarela";
import SelectSucursal from "../Elements/Compuestos/SelectSucursal";
import TiposPasarela from "../../definitions/TiposPasarela";
import SucursalCaja from "../../Models/SucursalCaja";

export default function IngresoCajaSucursal({ 
  onClose,
  openDialog,
  setOpendialog
}) {
  const { showLoading, hideLoading, showLoadingDialog, showMessage } =
    useContext(SelectedOptionsContext);

  var states = {
    nombre:useState(""),
    sucursal:useState(""),
    tipoImpresion:useState(""),
    certificado:useState(""),
    pasarela:useState(""),
  
   
  };

  var validatorStates = {
    
    nombre: useState(null),
    sucursal: useState(null),
    // certificado: useState(null),
    // tipoImpresion: useState(null),
    // pasarela: useState(null),
    
    
  };

  const handleSubmit = async () => {
  //   //Validaciones

    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false;
    }
  
    const data = {
      "idCaja": 0,
      "idSucursal": states.sucursal[0],
      "puntoVenta": states.nombre[0],
      "idSucursalPvTipo": TiposPasarela.CAJA,
      "fechaIngreso": System.getInstance().getDateForServer(),
      "fechaUltAct": System.getInstance().getDateForServer(),
      "puntoVentaConfiguracions": [
      ]
    };

    // console.log("Datos antes de enviar:", data);
    showLoading("Enviando...");
    const caj = new SucursalCaja()
    caj.add(data,(responseData)=>{
      hideLoading();
      showMessage(responseData.descripcion)
    },(error)=>{
      hideLoading();
      showMessage(error)
    })
  };

  useEffect(()=>{
  },[])

  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        setOpendialog(false);
        onClose();
      }}
      maxWidth={"md"}
    >
      <Paper elevation={16} square>
        <Grid container spacing={2} sx={{ padding: "2%" }} >
          <Grid item xs={12}>
            <h2>Ingreso Caja Sucursal</h2>
          </Grid>

          <Grid item xs={12} md={6}>
          <InputName
              inputState={states.nombre}
              label="Descripcion"
              required={true}
              validationState={validatorStates.nombre}
            />
          </Grid>

          <Grid item xs={12} md={6}>
          <SelectSucursal
              inputState={states.sucursal}
              label="Seleccionar sucursal"
              required={true}
              validationState={validatorStates.sucursal}
            />
          </Grid>


          {/* <Grid item xs={12} md={6}>
            <InputFile
              inputState={states.certificado}
              fieldName="Certificado Digital"
              required={true}
              validationState={validatorStates.certificado}
            />
          </Grid> */}


          {/* <Grid item xs={12} md={6}>
            <SelectImpresora
              inputState={states.tipoImpresion}
              label="Selecciona tipo de impresion"
              required={true}
              validationState={validatorStates.tipoImpresion}
            />
          </Grid> */}
          
          {/* <Grid item xs={12} md={6}sx={{marginBottom:"6px"}}>
            <SelectPasarela
              inputState={states.pasarela}
              fieldName="Selecciona Pasarela"
              required={true}
              validationState={validatorStates.pasarela}
              
            />

            <br/>
            <br/>
          </Grid> */}
         

          <SendingButton
            textButton="Guardar Caja"
            actionButton={handleSubmit}
            sending={showLoadingDialog}
            sendingText="Registrando..."
            style={{
              width: "50%",
              margin: "0 25%",
              backgroundColor: "#950198",
            }}
          />
        </Grid>
      </Paper>
    </Dialog>
  );
}
