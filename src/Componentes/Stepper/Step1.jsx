/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Button,
  Dialog,
  Typography,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import ModelConfig from "../../Models/ModelConfig";
import Model from "../../Models/Model";
import Product from "../../Models/Product";
import SelectFetch from "../Elements/Compuestos/SelectFetch";
import SelectFetchDependiente from "../Elements/Compuestos/SelectFetchDependiente";
import InputName from "../Elements/Compuestos/InputName";
import System from "../../Helpers/System";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";


const Step1Component = ({
  dataSteps = null,
  onNext = () => { },
  isActive,
  setStepData = () => { }
}) => {

  const {
    showLoading,
    hideLoading,
    showLoadingDialog,
    showMessage
  } = useContext(SelectedOptionsContext);



  var validatorStates = {
    nombre: useState(null),
    marca: useState(null),
    categoryId: useState(null),
    subCategoryId: useState(null),
    familyId: useState(null),
    subFamilyId: useState(null),
  };

  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(-1);
  const [selectedFamilyId, setSelectedFamilyId] = useState(-1);
  const [selectedSubFamilyId, setSelectedSubFamilyId] = useState(-1);

  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");

  const handleNext = () => {

    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false;
    }


    // Resto del código para continuar si los campos son válidos
    const step1Data = {
      selectedCategoryId,
      selectedSubCategoryId,
      selectedFamilyId,
      selectedSubFamilyId,
      marca,
      nombre,
    };

    setStepData((prevData) => ({ ...prevData, ...step1Data }));

    const sesion = Model.getInstance().sesion
    var sesion1 = sesion.cargar(1)
    console.log("sesion", sesion1)
    if (!sesion1) sesion1 = {
      id: 1
    }
    sesion1.ultimaCategoriaGuardada = selectedCategoryId
    sesion1.ultimaSubcategoriaGuardada = selectedSubCategoryId
    sesion1.ultimaFamiliaGuardada = selectedFamilyId
    sesion1.ultimaSubfamiliaGuardada = selectedSubFamilyId
    sesion1.ultimaMarcaGuardada = marca
    sesion.guardar(sesion1)


    onNext(step1Data);

  };


  const [cambioAlgo, setCambioAlgo] = useState(false)

  const cargaAnteriorDeSesion = async (funSet, propiedad) => {
    // console.log("cargaAnteriorDeSesion")
    if (!cambioAlgo) {
      const anterior = await Model.getInstance().cargarDeSesion1(propiedad)
      if (anterior !== null) {
        // console.log("devuelvo", anterior)
        funSet(anterior)
      }
    }
  }

  useEffect(() => {
    cargaAnteriorDeSesion(setMarca, "ultimaMarcaGuardada")
  }, [])


  useEffect(() => {
    if (isActive) {
      // console.log("activo paso 1 .. dataSteps",dataSteps)
    }
  }, [isActive])

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "16px",
        width: "100%",
      }}
    >
      <Grid container spacing={2} item xs={12} md={12}>

        <Grid item xs={12} md={6}>
          <SelectFetch
            inputState={[selectedCategoryId, setSelectedCategoryId]}
            validationState={validatorStates.categoryId}
            fetchFunction={Product.getInstance().getCategories}
            fetchDataShow={"descripcion"}
            fetchDataId={"idCategoria"}
            fieldName={"Categoria"}
            required={true}

            onFinishFetch={async () => {
              cargaAnteriorDeSesion(setSelectedCategoryId, "ultimaCategoriaGuardada")
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <SelectFetchDependiente
            inputState={[selectedSubCategoryId, setSelectedSubCategoryId]}
            inputOtherState={[selectedCategoryId, setSelectedCategoryId]}
            validationState={validatorStates.subCategoryId}
            fetchFunction={(cok, cwr) => {
              Product.getInstance().getSubCategories(selectedCategoryId, cok, cwr)
            }}
            fetchDataShow={"descripcion"}
            fetchDataId={"idSubcategoria"}
            fieldName={"SubCategoria"}
            required={true}
            onFinishFetch={async () => {

              cargaAnteriorDeSesion(setSelectedSubCategoryId, "ultimaSubcategoriaGuardada")
            }}
          />

        </Grid>


        <Grid item xs={12} md={6}>
          <SelectFetchDependiente
            inputState={[selectedFamilyId, setSelectedFamilyId]}
            inputOtherState={[selectedSubCategoryId, setSelectedCategoryId]}
            validationState={validatorStates.familyId}
            fetchFunction={(cok, cwr) => {
              Product.getInstance().getFamiliaBySubCat({
                categoryId: selectedCategoryId,
                subcategoryId: selectedSubCategoryId
              }, cok, cwr)
            }}
            fetchDataShow={"descripcion"}
            fetchDataId={"idFamilia"}
            fieldName={"Familia"}
            required={true}

            onFinishFetch={async () => {
              cargaAnteriorDeSesion(setSelectedFamilyId, "ultimaFamiliaGuardada")
            }}
          />

        </Grid>


        <Grid item xs={12} md={6}>
          <SelectFetchDependiente
            inputState={[selectedSubFamilyId, setSelectedSubFamilyId]}
            inputOtherState={[selectedFamilyId, setSelectedFamilyId]}
            validationState={validatorStates.subFamilyId}
            fetchFunction={(cok, cwr) => {
              Product.getInstance().getSubFamilia({
                categoryId: selectedCategoryId,
                subcategoryId: selectedSubCategoryId,
                familyId: selectedFamilyId
              }, cok, cwr)
            }}
            fetchDataShow={"descripcion"}
            fetchDataId={"idSubFamilia"}
            fieldName={"Sub Familia"}
            required={true}

            onFinishFetch={async () => {
              cargaAnteriorDeSesion(setSelectedSubFamilyId, "ultimaSubfamiliaGuardada")
            }}
          />
        </Grid>


        <Grid item xs={12} md={6}>
          <InputName
            inputState={[nombre, setNombre]}
            validationState={validatorStates.nombre}
            fieldName={"nombre"}
            maxLength={50}
            required={true}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <InputName
            inputState={[marca, setMarca]}
            validationState={validatorStates.marca}
            fieldName={"Marca"}
            maxLength={50}
            required={true}
          />
        </Grid>


        <Grid item xs={12} md={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleNext}
            fullWidth
          >
            Guardar y continuar
          </Button>
        </Grid>

      </Grid>

    </Paper>
  );
};

export default Step1Component;
