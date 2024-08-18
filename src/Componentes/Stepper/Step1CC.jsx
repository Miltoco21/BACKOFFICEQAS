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
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const Step1CC = ({ data, onNext, setStepData }) => {
  const {
    userData, 
    showMessage
  } = useContext(SelectedOptionsContext);

  const apiUrl = ModelConfig.get().urlBase;

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    data.selectedCategoryId
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(
    data.selectedSubCategoryId
  );
  const [selectedFamilyId, setSelectedFamilyId] = useState(
    data.selectedFamilyId
  );
  const [selectedSubFamilyId, setSelectedSubFamilyId] = useState(
    data.selectedSubFamilyId
  );
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);
  const [nombre, setNombre] = useState(data.nombre || "");
  const [marca, setMarca] = useState(data.marca || "");
  const [codigoBarras, setCodigoBarras] = useState(data.codBarra || "");
  const [descripcionCorta, setDescripcionCorta] = useState(data.DescCorta || "");

  const validateFields = () => {

    if (codigoBarras==="") {
      showMessage("Falta completar codigo.");
      return false;
    }

    if (selectedCategoryId === "") {
      showMessage("Debe seleccionar una Categoría.");
      return false;
    }
    if (selectedSubCategoryId === "") {
      showMessage("Debe seleccionar una Subcategoría.");
      return false;
    }
    if (selectedFamilyId === "") {
      showMessage("Debe seleccionar una Familia.");
      return false;
    }
    if (selectedSubFamilyId === "") {
      showMessage("Debe seleccionar una Subfamilia.");
      return false;
    }
    if (nombre==="") {
      showMessage("Falta completar la descricion.");
      return false;
    }

    if (!/^[a-zA-Z0-9\s]*[a-zA-Z0-9][a-zA-Z0-9\s]*$/.test(nombre.trim()) || /^\s{1,}/.test(nombre)) {
      showMessage("Ingresar nombre válido.");
      return false;
    }
    
    
        if (descripcionCorta==="") {
          showMessage("Falta completar la descripcion corta.");
          return false;
        }
    
    if (marca==="") {
      showMessage("Falta completar marca.");
      return false;
    }



    if (!/^[a-zA-Z0-9\s]*[a-zA-Z0-9][a-zA-Z0-9\s]*$/.test(marca.trim()) || /^\s{1,}/.test(marca)) {
      showMessage("Ingresar marca válida.");
      return false;
    }
   
    
    // Si todos los campos están llenos y se ha seleccionado al menos una opción para cada nivel, limpiar los mensajes de error
    setSelectionErrorMessage("");
    showMessage("");
    return true;
  };
  

 

  const handleNext = () => {
    const isValid = validateFields();
    if (isValid) {
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
      setStepData((prevData) => ({ ...prevData, ...step1Data }));
      onNext();
    }
  };
  
  
  const handleCloseDialog1 = () => {
    setOpenDialog1(false);
  };
  // const handleOpenDialog2 = () => {
  //   setOpenDialog2(true);
  // };
  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };
  // const handleOpenDialog3 = () => {
  //   setOpenDialog3(true);
  // };
  const handleCloseDialog3 = () => {
    setOpenDialog3(false);
  };
  // const handleOpenDialog4 = () => {
  //   setOpenDialog4(true);
  // };
  const handleCloseDialog4 = () => {
    setOpenDialog4(false);
  };

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setStepData((prevData) => ({ ...prevData, [name]: value }));
  // };

  // Funciones de Seleccion
  const handleCategorySelect = (categoryId) => {
    // Si se selecciona "Sin categoría", establece el valor como 0; de lo contrario, utiliza el valor seleccionado normalmente
    setSelectedCategoryId(categoryId === '' ? 0 : categoryId);
  };
  

  const handleSubCategorySelect = (subCategoryId) => {
    setSelectedSubCategoryId(subCategoryId === '' ? 0 :subCategoryId);
  };

  const handleFamilySelect = (familyId) => {
    setSelectedFamilyId(familyId === '' ? 0 :familyId);
  };

  const handleSubFamilySelect = (subFamilyId) => {
    setSelectedSubFamilyId(subFamilyId === '' ? 0 :subFamilyId);
  };
  const handleCreateCategory = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog1(false);
  };
  const handleCreateSubCategory = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog2(false);
  };
  const handleCreateFamily = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog3(false);
  };
  const handleCreateSubFamily = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog4(false);
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(
          `${apiUrl}/NivelMercadoLogicos/GetAllCategorias`
        );
        setCategories(response.data.categorias);
      } catch (error) {
        console.log(error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedCategoryId !== "") {
        try {
          const response = await axios.get(
            `${apiUrl}/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=${selectedCategoryId}`
          );
          setSubCategories(response.data.subCategorias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubCategories();
  }, [selectedCategoryId]);

  useEffect(() => {
    const fetchFamilies = async () => {
      if (selectedSubCategoryId !== "" && selectedCategoryId !== "") {
        try {
          const response = await axios.get(
            `${apiUrl}/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?SubCategoriaID=${selectedSubCategoryId}&CategoriaID=${selectedCategoryId}`
          );
          setFamilies(response.data.familias);
        } catch (error) {
          console.error("Error fetching families:", error);
        }
      }
    };

    fetchFamilies();
  }, [selectedCategoryId, selectedSubCategoryId]);

  useEffect(() => {
    const fetchSubFamilies = async () => {
      if (
        selectedFamilyId !== "" &&
        selectedCategoryId !== "" &&
        selectedSubCategoryId !== ""
      ) {
        try {
          const response = await axios.get(
            `${apiUrl}/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?FamiliaID=${selectedFamilyId}&SubCategoriaID=${selectedSubCategoryId}&CategoriaID=${selectedCategoryId}`
          );
          setSubFamilies(response.data.subFamilias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubFamilies();
  }, [selectedFamilyId, selectedCategoryId, selectedSubCategoryId]);

  const handleKeyDown = (event, field) => {
    const handleKeyDown = (event, field) => {
      if (field === "nombre" ) {
        const regex = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\s]+$/;// Al menos un carácter alfanumérico
        if (
          !regex.test(event.key) &&
          event.key !== "Backspace" &&
          event.key !== " "
        ) {
          event.preventDefault();
          showMessage("El nombre no puede consistir únicamente en espacios en blanco.");
          setSnackbarOpen(true);
        }
      }
      if ( field === "marca") {
        const regex = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\s]*$/; // Al menos un carácter alfanumérico
        if (
          !regex.test(event.key) &&
          event.key !== "Backspace" &&
          event.key !== " "
        ) {
          event.preventDefault();
          showMessage("La marca no puede consistir únicamente en espacios en blanco.");
          setSnackbarOpen(true);
        }
      }
      
      if (field === "telefono") {
        if (event.key === "-" && formData.telefono === "") {
          event.preventDefault();
        }
      }
    };
  
    // if (field === "nombre" || field === "marca") {
    //   const regex = /^[a-zA-Z0-9\s]*$/; // Permitir letras, números y espacios en blanco
    //   if (
    //     !regex.test(event.key) &&
    //     event.key !== "Backspace" &&
    //     event.key !== " "
    //   ) {
    //     event.preventDefault();
    //   }
    // }
    
    if (field === "telefono") {
      // Validar si la tecla presionada es un signo menos
      if (event.key === "-" && formData.telefono === "") {
        event.preventDefault(); // Prevenir ingreso de número negativo
      }
    }
  };

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
        <InputLabel>C&oacute;digo</InputLabel>
        <TextField
          fullWidth
          label="Ingresar c&oacute;digo"
          value={codigoBarras}
          onChange={(e) => setCodigoBarras(e.target.value)}
          onKeyDown={(event) => handleKeyDown(event, "codigoBarras")}
        />
        </Grid>


        <Grid item xs={12} md={6}>
          <InputLabel>Seleccionar Categoría</InputLabel>
          <Select
            fullWidth
            value={selectedCategoryId === 0 ? 0 : selectedCategoryId}
            onChange={(e) => handleCategorySelect(e.target.value)}
            label="Seleccionar Categoría"
          >
            <MenuItem value={0}>Sin categoría</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.idCategoria} value={category.idCategoria}>
                {category.descripcion}
              </MenuItem>
            ))}
          </Select>
        </Grid>

    

        <Grid item xs={12} md={6}>
          <InputLabel>Seleccionar Subcategoría</InputLabel>
          <Select
            fullWidth
            value={selectedSubCategoryId === 0 ? 0 : selectedSubCategoryId}
           
            onChange={(e) => handleSubCategorySelect(e.target.value)}
            label="Seleccionar Sub-Categoría"
          >
            <MenuItem value={0}>Sin subcategoría</MenuItem>
            {subcategories.map((subcategory) => (
              <MenuItem
                key={subcategory.idSubcategoria}
                value={subcategory.idSubcategoria}
              >
                {subcategory.descripcion}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel>Seleccionar Familia</InputLabel>
          <Select
            fullWidth
            value={selectedFamilyId=== 0 ? 0 :selectedFamilyId}
            onChange={(e) => handleFamilySelect(e.target.value)}
            label="Seleccionar Familia"
          >
            {" "}
            <MenuItem value={0}>Sin familia</MenuItem>
            {families.map((family) => (
              <MenuItem key={family.idFamilia} value={family.idFamilia}>
                {family.descripcion}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel>Seleccionar Subfamilia</InputLabel>
          <Select
            fullWidth
            value={selectedSubFamilyId=== 0 ? 0 :selectedSubFamilyId}
            onChange={(e) => handleSubFamilySelect(e.target.value)}
            label="Seleccionar Subfamilia"
          >
            <MenuItem value={0}>Sin subfamilia</MenuItem>
            {subfamilies.map((subfamily) => (
              <MenuItem
                key={subfamily.idSubFamilia}
                value={subfamily.idSubFamilia}
              >
                {subfamily.descripcion}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={12}>
        <InputLabel>Descripci&oacute;n</InputLabel>
          <TextField
            fullWidth
            label="Ingresar Descripci&oacute;n"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(event) => handleKeyDown(event, "nombre")}
          />
        </Grid>

        <Grid item xs={12} md={6}>
        <InputLabel>Desc. corta</InputLabel>
          <TextField
            fullWidth
            label="Ingresar Desc. corta"
            value={descripcionCorta}
            onChange={(e) => setDescripcionCorta(e.target.value)}
            onKeyDown={(event) => handleKeyDown(event, "descripcionCorta")}
          />
        </Grid>

        <Grid item xs={12} md={6}>
        <InputLabel>Marca</InputLabel>
          <TextField
            fullWidth
            type="text"
            label="Ingresar Marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            onKeyDown={(event) => handleKeyDown(event, "marca")}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleNext}
            fullWidth
          >
            Continuar
          </Button>
        </Grid>
      </Grid>

    </Paper>
  );
};

export default Step1CC;
