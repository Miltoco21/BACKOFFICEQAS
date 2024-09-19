import React, { useState, useEffect, useContext } from "react";

import { Grid, Paper, Dialog } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";


import InputName from "../Elements/Compuestos/InputName";
import InputPage from "../Elements/Compuestos/InputPage";
import SendingButton from "../Elements/SendingButton";
import User from "../../Models/User";
// import Sucursal from "../../../Models/Sucursal";

import System from "../../Helpers/System";
export const defaultTheme = createTheme();

export default function IngresoUrl({ onClose, openDialog, setOpendialog }) {
  const { showLoading, hideLoading, showLoadingDialog, showMessage } =
    useContext(SelectedOptionsContext);

  var states = {

    url: useState(""),
    metodoImpresion: useState(""),
    
   
  };

  var validatorStates = {
    
    url: useState(null),
    direccion: useState(null),
    metodoImpresion: useState(null), 
    
  };

  // const handleSubmit = async () => {
  //   //Validaciones

  //   if (!System.allValidationOk(validatorStates, showMessage)) {
  //     return false;
  //   }
  //   // console.log(rut)
  //   // console.log(nombre)
  //   const usuario = {
  //     rut: states.rut[0],
  //     nombres: states.nombre[0],
  //     apellidos: states.apellido[0],
  //     correo: states.correo[0],
  //     telefono: states.phone[0],
  //     codigoUsuario: states.userCode[0],
  //     direccion: states.direccion[0],
  //     codigoPostal: states.postalCode[0],
  //     clave: states.clave[0],
  //     remuneracion: states.remuneracionTipo[0],
  //     rol: states.rol[0] + "",
  //     region: states.region[0] + "",
  //     comuna: states.comuna[0] + "",
  //     credito: states.credit[0],
  //   };

  //   console.log("Datos antes de enviar:", usuario);
  //   showLoading("Enviando...");
  //   User.getInstance().add(
  //     usuario,
  //     (res) => {
  //       console.log("llego al callok");
  //       hideLoading();
  //       showMessage("Usuario creado exitosamente");
  //       setTimeout(() => {
  //         onClose();
  //       }, 2000);
  //     },
  //     (error) => {
  //       console.log("llego al callwrong", error);
  //       hideLoading();
  //       showMessage(error);
  //     }
  //   );
  // };

  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        setOpendialog(false);
        onClose();
      }}
      maxWidth={"lg"}
    >
      <Paper elevation={16} square>
        <Grid container spacing={2} sx={{ padding: "2%" }}>
          <Grid item xs={12}>
            <h2>Ingreso Url</h2>
          </Grid>

        
          <Grid container item xs={12} md={4} columns={2}>
            <InputName
              inputState={states.url}
              fieldName="Url de Caja"
              required={true}
              validationState={validatorStates.url}
            />
          </Grid>
          <Grid  container item xs={12} md={4} columns={2}>
            <InputName
              inputState={states.metodoImpresion}
              required={true}
              fieldName="método de impresión"
              validationState={validatorStates.metodoImpresion}
            />
          </Grid>
         

          <SendingButton
            textButton="Ingresar Url"
            // actionButton={handleSubmit}
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
