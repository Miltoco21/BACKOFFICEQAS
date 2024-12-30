import React, { useState, useEffect, useContext } from "react";

import Tooltip from "@mui/material/Tooltip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { saveAs } from "file-saver";
import * as xlsx from "xlsx/xlsx.mjs";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Grid,
  Paper,
  Box,
  TextField,
  IconButton,
  Button,
  CircularProgress,
  MenuItem,
  InputLabel,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ModelConfig from "../../Models/ModelConfig";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Proveedor from "../../Models/Proveedor";
import { Check, Dangerous } from "@mui/icons-material";
import System from "../../Helpers/System";
import InputRutProveedor from "../Elements/Compuestos/InputRutProveedor";
import InputName from "../Elements/Compuestos/InputName";
import InputEmail from "../Elements/Compuestos/InputEmail";
import InputPhone from "../Elements/Compuestos/InputPhone";
import SelectRegion from "../Elements/Compuestos/SelectRegion";
import SelectComuna from "../Elements/Compuestos/SelectComuna";
import InputPage from "../Elements/Compuestos/InputPage";

const IngresoProveedor = ({
  openDialog,
  setOpenDialog,
  onClose,
  onFinish
}) => {

  var states = {
    rut: useState(""),
    nombreResponsable: useState(""),
    email: useState(""),
    correoResponsable: useState(""),
    razonSocial: useState(""),
    telefono: useState(""),
    telefonoResponsable: useState(""),
    direccion: useState(""),
    region: useState(-1),
    comuna: useState(-1),
    giro: useState(""),
    formaPago: useState(""),
    pagina: useState(""),
    sucursal: useState(""),
  };


  var validatorStates = {
    rut: useState(""),
    nombreResponsable: useState(""),
    email: useState(""),
    correoResponsable: useState(""),
    razonSocial: useState(""),
    telefono: useState(""),
    telefonoResponsable: useState(""),
    direccion: useState(""),
    region: useState(-1),
    comuna: useState(-1),
    giro: useState(""),
    formaPago: useState(""),
    pagina: useState(""),
    sucursal: useState(""),
  };

  const theme = createTheme();

  const {
    userData,
    showMessage
  } = useContext(SelectedOptionsContext);

  useEffect(() => {
    console.log("cargando componente IngresoProveedor..openDialog es", openDialog)
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false;
    }
    const proveedor = {
      rut: states.rut[0],
      nombreResponsable: states.nombreResponsable[0],
      email: states.email[0],
      correoResponsable: states.correoResponsable[0],
      razonSocial: states.razonSocial[0],
      telefono: states.telefono[0],
      telefonoResponsable: states.telefonoResponsable[0],
      direccion: states.direccion[0],
      region: states.region[0] + "",
      comuna: states.comuna[0] + "",
      giro: states.giro[0],
      formaPago: states.formaPago[0],
      pagina: states.pagina[0],
      sucursal: states.sucursal[0]
    };

    console.log("Datos a enviar:", proveedor); // Aquí se muestran los datos en la consola

    Proveedor.crearNuevo(proveedor, (responseData, response) => {
      setRazonSocial("");
      setGiro("");
      setEmail("");
      setDireccion("");
      setTelefono("");
      setSucursal("");
      setSelectedRegion("");
      setSelectedComuna("");
      setUlrPagina("");
      setFormaPago("");
      setRut("");
      setNombreResponsable("");
      setcorreoResponsable("");
      setTelefonoResponsable("");

      setTimeout(() => {
        onClose(); ////Cierre Modal al finalizar
      }, 2000);

      onFinish(responseData)
    }, showMessage)

  };

  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        setOpenDialog(false);
        onClose();
      }}
      maxWidth={"lg"}
    >

      <ThemeProvider theme={theme}>
        <CssBaseline />
          <Paper
            elevation={3}
            sx={{ p: 2, borderRadius: 2, maxWidth: 1200, width: "100%" }}
          >
            {/* <form onSubmit={handleSubmit}> */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <h2>Ingreso Proveedores</h2>
                </Grid>

                <Grid item xs={12} sm={4}>

                  <InputRutProveedor
                    inputState={states.rut}
                    validationState={validatorStates.rut}
                    required={true}
                    autoFocus={true}
                  />

                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputName
                    inputState={states.razonSocial}
                    required={true}
                    fieldName="Razón Social"
                    validationState={validatorStates.razonSocial}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputName
                    inputState={states.giro}
                    fieldName="giro"
                    required={true}
                    maxLength={30}
                    validationState={validatorStates.giro}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputEmail
                    inputState={states.email}
                    required={true}
                    fieldName="Email"
                    validationState={validatorStates.email}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputPhone
                    inputState={states.telefono}
                    required={true}
                    fieldName="Telefono"
                    validationState={validatorStates.telefono}
                  />

                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputName
                    inputState={states.direccion}
                    fieldName="Direccion"
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


                <Grid item xs={12} sm={4}>

                  <InputName
                    inputState={states.sucursal}
                    fieldName="Sucursal"
                    required={true}
                    maxLength={30}
                    validationState={validatorStates.sucursal}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputPage
                    inputState={states.pagina}
                    fieldName="Pagina Web"
                    required={true}
                    maxLength={100}
                    validationState={validatorStates.pagina}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputName
                    inputState={states.formaPago}
                    fieldName="Forma de pago"
                    required={true}
                    maxLength={30}
                    validationState={validatorStates.formaPago}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputName
                    inputState={[states.nombreResponsable[0], states.nombreResponsable[1]]}
                    fieldName="nombreResponsable"
                    required={true}
                    validationState={validatorStates.nombreResponsable}
                  />



                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputEmail
                    inputState={states.correoResponsable}
                    required={true}
                    fieldName="correoResponsable"
                    validationState={validatorStates.correoResponsable}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>


                  <InputPhone
                    inputState={states.telefonoResponsable}
                    required={true}
                    fieldName="telefonoResponsable"
                    validationState={validatorStates.telefonoResponsable}
                  />

                </Grid>
                <Grid item xs={12}>
                  <Button
                  onClick={handleSubmit}
                  // type="submit" 
                  // disabled={loading}
                  variant="contained"
                    sx={{
                      height: "50px",
                      width: "50%",
                      minWidth: "100px",
                      margin: "0 25%"
                    }}
                  >
                    {/* {loading ? ( */}
                      {/* <>
                        Guardando... <CircularProgress size={24} />
                      </> */}
                    {/* ) : ( */}
                      Guardar
                    {/* )} */}
                  </Button>
                </Grid>
              </Grid>
            {/* </form> */}
          </Paper>
      </ThemeProvider>
    </Dialog>
  );
};

export default IngresoProveedor;
