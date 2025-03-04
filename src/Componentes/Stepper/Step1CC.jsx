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
  InputAdornment,
} from "@mui/material";

import ModelConfig from "../../Models/ModelConfig";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ProductStepper from "../../Models/ProductStepper";
import Product from "../../Models/Product";
import { Check, Dangerous, Percent } from "@mui/icons-material";
import Model from "../../Models/Model";
import InputCodigoBarras from "../Elements/Compuestos/InputCodigoBarras";
import SelectFetchDependiente from "../Elements/Compuestos/SelectFetchDependiente";
import SelectFetch from "../Elements/Compuestos/SelectFetch";
import InputName from "../Elements/Compuestos/InputName";
import System from "../../Helpers/System";

const Step1CC = ({
  data,
  onNext,
  setStepData
}) => {
  const {
    userData,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(-1);
  const [selectedFamilyId, setSelectedFamilyId] = useState(-1);
  const [selectedSubFamilyId, setSelectedSubFamilyId] = useState(-1);

  const [nombre, setNombre] = useState(data.nombre || "");
  const [marca, setMarca] = useState(data.marca || "");
  const [codigoBarras, setCodigoBarras] = useState(data.codBarra || "");
  const [descripcionCorta, setDescripcionCorta] = useState(data.DescCorta || "");

  const [puedeAvanzar, setPuedeAvanzar] = useState(false);
  const [cambioAlgo, setCambioAlgo] = useState(false);

  var validatorStates = {
    codigoBarras: useState(null),
    nombre: useState(null),
    descripcionCorta: useState(null),
    marca: useState(null),
    categoryId: useState(null),
    subCategoryId: useState(null),
    familyId: useState(null),
    subFamilyId: useState(null),
  };

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
      codBarra: codigoBarras,
      descripcionCorta,
      nombre,
    };
    ProductStepper.getInstance().sesion.guardar({
      "step1": step1Data
    })
    setStepData((prevData) => ({ ...prevData, ...step1Data }));

    const sesion = Model.getInstance().sesion
    console.log("sesion", sesion)
    var sesion1 = sesion.cargar(1)
    if (!sesion1) sesion1 = {
      id: 1
    }
    sesion1.ultimaCategoriaGuardada = selectedCategoryId
    sesion1.ultimaSubcategoriaGuardada = selectedSubCategoryId
    sesion1.ultimaFamiliaGuardada = selectedFamilyId
    sesion1.ultimaSubfamiliaGuardada = selectedSubFamilyId
    sesion1.ultimaMarcaGuardada = marca
    sesion.guardar(sesion1)

    onNext();

  };

  const cargaAnteriorDeSesion = async (funSet, propiedad) => {
    // console.log("cargaAnteriorDeSesion")
    const anterior = await Model.getInstance().cargarDeSesion1(propiedad)
    if (anterior !== null) {
      // console.log("devuelvo", anterior)
      funSet(anterior)
    }
  }

  useEffect(() => {

    if(window.location.href.indexOf("stockmobile")>-1){
      cargaAnteriorDeSesion(setCodigoBarras, "ultimaBusquedaStockMobile")
    }

    cargaAnteriorDeSesion(setMarca, "ultimaMarcaGuardada")
  }, [])


  useEffect(() => {
    if (nombre.length <= 50) {
      setDescripcionCorta(nombre)
    }
  }, [nombre])


  return (
    <Paper
      elevation={3}
      sx={{
        padding: "16px",
        width: "100%",
      }}
    >
      <Grid container spacing={2} item xs={12} md={12}>

        <Grid item xs={12} md={12}>
          <InputCodigoBarras
            inputState={[codigoBarras, setCodigoBarras]}
            validationState={validatorStates.codigoBarras}
            fieldName="codigoBarras"
            required={true}
          />
        </Grid>

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

        <Grid item xs={12} md={12}>
          <InputName
            inputState={[nombre, setNombre]}
            validationState={validatorStates.nombre}
            fieldName={"descripcion"}
            maxLength={50}
            required={true}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <InputName
            inputState={[descripcionCorta, setDescripcionCorta]}
            validationState={validatorStates.descripcionCorta}
            fieldName={"Desc. Corta"}
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
            // fullWidth
            variant="contained"
            color="secondary"
            onClick={handleNext}
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
      </Grid>

    </Paper>
  );
};

export default Step1CC;
