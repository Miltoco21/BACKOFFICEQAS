import React, { useState, useEffect, useContext } from "react";

import {
  Grid,
  Paper,
  Box,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  InputLabel,
  Snackbar,
  IconButton,
  InputAdornment 
} from "@mui/material";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ModelConfig from "../../Models/ModelConfig";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

import InputRutUsuario from "../Elements/Compuestos/InputRutUsuario";
import Validator from "../../Helpers/Validator";
import InputName from "../Elements/Compuestos/InputName";
import InputEmail from "../Elements/Compuestos/InputEmail";
import InputPhone from "../Elements/Compuestos/InputPhone";
import InputNumber from "../Elements/Compuestos/InputNumber";
import InputPassword from "../Elements/Compuestos/InputPassword";
import SelectList from "../Elements/Compuestos/SelectList";
import SelectUserRoles from "../Elements/Compuestos/SelectUserRoles";
import SelectRegion from "../Elements/Compuestos/SelectRegion";
import SelectComuna from "../Elements/Compuestos/SelectComuna";
import SendingButton from "../Elements/SendingButton";
import { margin } from "@mui/system";
import User from "../../Models/User";
import System from "../../Helpers/System";
export const defaultTheme = createTheme();

export default function IngresoUsuarios({ onClose}) {
  const {
    showLoading,
    hideLoading,
    showLoadingDialog,
    userData, 
    showMessage
  } = useContext(SelectedOptionsContext);


  const [reset,setReset] = useState(false)

  var states = {
    rut: useState(""),
    nombre: useState(""),
    apellido: useState(""),
    correo: useState(""),
    phone: useState(""),
    userCode: useState(""),
    direccion: useState(""),
    region: useState(-1),
    comuna: useState(-1),
    rol: useState(-1),
    postalCode: useState(""),
    clave: useState(""),
    remuneracionTipo: useState(-1),
    credit: useState(""),
  }
  


  
  var validatorStates = {
    rut: useState(null),
    nombre : useState(null),
    apellido : useState(null),
    correo : useState(null),
    phone : useState(null),
    userCode : useState(null),
    direccion : useState(null),
    postalCode : useState(null),
    credit : useState(null),
    clave : useState(null),
    remuneracionTipo : useState(null),
    rol : useState(null),
    region : useState(null),
    comuna : useState(null),
  }

  const handleSubmit = async () => {
    //Validaciones
    
    if(!System.allValidationOk(validatorStates,showMessage)){
      return false
    }
    // console.log(rut)
    // console.log(nombre)
    const usuario = {
      rut: states.rut[0],
      nombres: states.nombre[0],
      apellidos: states.apellido[0],
      correo: states.correo[0],
      telefono: states.phone[0],
      codigoUsuario: states.userCode[0],
      direccion: states.direccion[0],
      rol: states.rol[0],
      codigoPostal: states.postalCode[0],
      clave: states.clave[0],
      remuneracion: states.remuneracionTipo[0],
      region: states.region[0],
      comuna: states.comuna[0],
      credito: states.credit[0],
    }
      
      console.log("Datos antes de enviar:", usuario);
      showLoading("Enviando...")
      User.getInstance().add(usuario,(res)=>{
        console.log("llego al callok")
        hideLoading()
        showMessage("Usuario creado exitosamente");
        setTimeout(() => {
          onClose();
        }, 2000);
      },(error)=>{
        console.log("llego al callwrong", error)
        hideLoading()
        showMessage(error)
      })
  };

  return (
    <div style={{ overflow: "auto" }}>
        <Paper elevation={16} square>
          <Grid container spacing={2} sx={{ padding: "2%" }}>
            <Grid item xs={12}>
              <h2>Ingreso Usuario</h2>
            </Grid>

            <Grid item xs={12} md={4}>
              <InputRutUsuario 
                inputState={states.rut}
                validationState={validatorStates.rut}
                required={true}
                autoFocus={true}
              />
              
            </Grid>
            <Grid item xs={12} md={4}>
              <InputName
                inputState={states.nombre}
                fieldName="nombre"
                required={true}
                validationState={validatorStates.nombre}
              />

            </Grid>
            <Grid item xs={12} md={4}>

            <InputName
              inputState={states.apellido}
              required={true}
              fieldName="apellido"
              validationState={validatorStates.apellido}
            />

            </Grid>
            <Grid item xs={12} md={4}>


            <InputEmail
              inputState={states.correo}
              required={true}
              fieldName="correo"
              validationState={validatorStates.correo}
            />

            </Grid>
            <Grid item xs={12} md={4}>
            <InputPhone
              inputState={states.phone}
              required={true}
              fieldName="telefono"
              validationState={validatorStates.phone}
            />


              
            </Grid>
            <Grid item xs={12} md={4}>

            <InputNumber
              inputState={states.userCode}
              required={true}
              fieldName="codigoUsuario"
              label="Codigo usuario"
              validationState={validatorStates.userCode}
            />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputName
                inputState={states.direccion}
                fieldName="direccion"
                required={true}
                maxLength={30}
                validationState={validatorStates.direccion}
              />

            </Grid>
            <Grid item xs={12} md={4}>

              <SelectRegion
                inputState={states.region}
                fieldName="region"
                required={true}
                validationState={validatorStates.region}
              />
              
            </Grid>
            <Grid item xs={12} md={4}>

              <SelectComuna
                inputState={states.comuna}
                inputRegionState={states.region}
                fieldName="comuna"
                required={true}
                validationState={validatorStates.comuna}
              />

            </Grid>
            <Grid item xs={12} md={4}>
              <SelectUserRoles
                inputState={states.rol}
                fieldName="rol"
                required={true}
                validationState={validatorStates.rol}
              />

            </Grid>
            <Grid item xs={12} md={4}>
              <InputNumber
                inputState={states.postalCode}
                required={true}
                fieldName="codigoPostal"
                label="Codigo Postal"
                validationState={validatorStates.postalCode}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputPassword
                inputState={states.clave}
                fieldName="clave"
                required={true}
                maxLength={30}
                validationState={validatorStates.clave}
              />

              
            </Grid>
            <Grid item xs={12} md={4}>
              <SelectList
                inputState={states.remuneracionTipo}
                selectItems={[
                  "Diario",
                  "Semanal",
                  "Mensual",
                ]}
                fieldName="remuneracion"
                required={true}
                validationState={validatorStates.remuneracionTipo}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputNumber
                inputState={states.credit}
                required={true}
                fieldName="credito"
                validationState={validatorStates.credit}
              />
            </Grid>
          <Grid item xs={12}>

            <SendingButton
              textButton="Registrar usuario"
              actionButton={handleSubmit}
              sending={showLoadingDialog}
              sendingText=""
              style={{
                width:"50%",
                margin: "0 25%",
                backgroundColor:"#950198"
              }}
            />

          </Grid>
          </Grid>
        </Paper>
      
    </div>
  );
}
