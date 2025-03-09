/* eslint-disable react/prop-types */

/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

import {

  CssBaseline,
  Paper,
  TextField,

  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar
} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ModelConfig from "../../Models/ModelConfig";
import Product from "../../Models/Product";
import InputName from "../Elements/Compuestos/InputName";
import System from "../../Helpers/System";

const theme = createTheme();


const FormSubFamilia = ({
  onSubmitSuccess,
  isEdit = false,
  editData = null
}) => {


  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  var states = {
    nombre: useState(""),
  };

  var validatorStates = {
    nombre: useState(null),
  };

  const handleSubmit = async () => {
    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false;
    }

    const actionDo = !isEdit ? Product.addSubFamily : Product.editSubFamily

    const dataRequest = {
      idCategoria: states.selectedCategoryId[0],
      idSubcategoria: states.selectedSubCategoryId[0],
      idFamilia: states.selectedFamilyId[0],
      descripcionFamilia: states.nombre[0]
    }
    if (isEdit) dataRequest.idSubFamilia = editData.idSubFamilia

    showLoading("Guardando categoria...")
    actionDo(dataRequest, (responseData) => {
      const creado = responseData.subfamilias[0]

      showMessage("Realizado correctamente")
      onSubmitSuccess(creado)
      hideLoading()
    }, (err) => {
      showMessage(err)
      hideLoading()
    })
  };
  

  useEffect(()=>{
    if(isEdit && editData){
      states.nombre[1](editData.descripcion)
    }
  },[ isEdit, editData ])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <h4>{!isEdit ? "Ingreso" : "Editar"} SubFamilia</h4>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={12}>
            <InputName
              inputState={states.nombre}
              validationState={validatorStates.nombre}
              fieldName="Descripcion"
              required={true}
            />
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            // disabled={!puedeAvanzar}
            sx={{
              width: "50%",
              height: "55px",
              margin: "0 25%"
            }}
          >
            Continuar
          </Button>


        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default FormSubFamilia;
