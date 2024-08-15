/* eslint-disable no-redeclare */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  Select,
  Grid,
  Typography,
} from "@mui/material";
import ModelConfig from "../../Models/ModelConfig";

const Editp2 = ({ product, open, handleClose }) => {
  const apiUrl = ModelConfig.get().urlBase;

  const [editedProduct, setEditedProduct] = useState({});
  const [refresh, setRefresh] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [selectedSubFamilyId, setSelectedSubFamilyId] = useState("");
  const [subcategories, setSubCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);

  const [marcas, setMarcas] = useState([]);
  const [selectedBodegaId, setSelectedBodegaId] = useState("");
  const [selectedProveedorId, setSelectedProveedorId] = useState("");

  const [bodegas, setBodegas] = useState([]);
  const [proveedor, setProveedor] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [selectedMarcaId, setSelectedMarcaId] = useState("");

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  //INICIADOR DE DATOS
  useEffect(() => {
    // Initialize editedProduct when the component mounts
    setEditedProduct(product);
  }, []);

  const fetchCategories = async() =>{
    console.log("fetchCategories")
    try {
      const response = await axios.get(
      `${apiUrl}/NivelMercadoLogicos/GetAllCategorias`
      );
      console.log("categorias"); // Add this line
      console.log(response.data); // Add this line
      setCategories(response.data.categorias);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);


  const fetchSubCategories = async () => {
    console.log("fetchSubCategories")

    if (selectedCategoryId && categories.length>0 ) {
      try {
        const categoriaCoincide = categories.find(categoria=> categoria.descripcion ===selectedCategoryId);
        // console.log("categoriaCoincide:")
        // console.log(categoriaCoincide)
        const response = await axios.get(
          `${apiUrl}/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=${categoriaCoincide.idCategoria}`
        );
        
        console.log("subCategorias");
        console.log(response.data.subCategorias);
        setSubCategories(response.data.subCategorias);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    // }else{
    //   setTimeout(() => {
    //     fetchSubCategories()
    //   }, 100);
    }
  };

  useEffect(() => {

    console.log("cambio selectedCategoryId")
    console.log(selectedCategoryId)



    fetchSubCategories();
  }, [selectedCategoryId]);


  const fetchFamilies = async () => {
    console.log("fetchFamilies")

    if (selectedSubCategoryId !== "" && selectedCategoryId !== "" && subcategories.length>0) {
      try {
        // console.log("selectedSubCategoryId", selectedSubCategoryId)
        // console.log("subcategories", subcategories)
        const SubCategoriaFind = subcategories.find(sc=> sc.descripcion === selectedSubCategoryId);
        // console.log("idCategoriaFind", SubCategoriaFind)

        const response = await axios.get(
          `${apiUrl}/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?SubCategoriaID=${editedProduct.idsubCategoria}&CategoriaID=${editedProduct.idCategoria}`
        );

        console.log("familias")
        console.log(response.data.familias);
        setFamilies(response.data.familias);
      } catch (error) {
        console.error("Error fetching Families:", error);
      }
    // }else{
    //   setTimeout(() => {
    //     fetchFamilies()
    //   }, 100);
    }
  };

  useEffect(() => {
    console.log("cambio selectedSubCategoryId")
    console.log(selectedSubCategoryId)



    fetchFamilies();
  }, [selectedSubCategoryId]);

  const fetchSubFamilies = async () => {
    console.log("fetchSubFamilies")

    if (
      selectedFamilyId !== "" &&
      selectedCategoryId !== "" &&
      selectedSubCategoryId !== "" &&
      families.length>0
    ) {
      try {
        // console.log("selectedFamilyId", selectedFamilyId)
        // console.log("families", families)
        const familiaFind = families.find(f=> f.descripcion === selectedFamilyId)
        // console.log("familiaFind", familiaFind)

        const response = await axios.get(
          `${apiUrl}/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?FamiliaID=${editedProduct.idFamilia}&SubCategoriaID=${editedProduct.idsubCategoria}&CategoriaID=${editedProduct.idCategoria}`
        );

        console.log("subFamilias:");
        console.log(response.data.subFamilias);
        setSubFamilies(response.data.subFamilias);
      } catch (error) {
        console.error("Error fetching SubFamilies:", error);
      }
    // }else{
    //   setTimeout(() => {
    //     fetchSubFamilies()
    //   }, 100);
    }
  };

  useEffect(() => {

    console.log("cambio selectedFamilyId")
    console.log(selectedFamilyId)


    fetchSubFamilies();
  }, [selectedFamilyId]);

  // useEffect(() => {
  //   const fetchProveedores = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://www.easyposdev.somee.com/api/Proveedores/GetAllProveedores"
  //       );
  //       console.log("API response:", response.data.proveedores);
  //       setProveedores(response.data.proveedores);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchProveedores();
  // }, []);

  // useEffect(() => {
  //   const fetchMarcas = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://www.easyposdev.somee.com/api/Marcas/GetAllMarcas"
  //       );
  //       setMarcas(response.data.marcas);
  //       console.log(response.data.marcas);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchMarcas();
  // }, [refresh]);

  ////Datos iniciales de edicion

  // useEffect(() => {
  //   setSelectedMarcaId(editedProduct.marca || "");
  // }, [editedProduct]);

  // useEffect(() => {
  //   setSelectedProveedorId(editedProduct.proveedor || "");
  // }, [editedProduct]);

  useEffect(() => {
    // console.log("cambio editedproducto o categories.length")
    
    if(categories.length>0 && Object.keys(editedProduct).length>0){
      setSelectedCategoryId(editedProduct.categoria || "");
    }

    if(subcategories.length>0 && Object.keys(editedProduct).length>0){
      setSelectedSubCategoryId(editedProduct.subCategoria || "");
      // setSelectedFamilyId(editedProduct.familia || "");
      // setSelectedSubFamilyId(editedProduct.subFamilia || "");
        // console.log("cambio producto")
        // console.log(editedProduct)
        
        // console.log("categories:")
        // console.log(categories)
    }

    if(families.length>0 && Object.keys(editedProduct).length>0){
      setSelectedFamilyId(editedProduct.familia || "");
    }

    if(subfamilies.length>0 && Object.keys(editedProduct).length>0){
      setSelectedSubFamilyId(editedProduct.subFamilia || "");
    }

  }, [
    editedProduct, categories.length,
    subcategories.length,
    families.length,
    subfamilies.length,


  ]);



  // useEffect(() => {
  //   setSelectedSubCategoryId(editedProduct.subCategoria || "");
  // }, [editedProduct]);

  // useEffect(() => {
  //   setSelectedFamilyId(editedProduct.familia || "");
  // }, [editedProduct]);

  // useEffect(() => {
  //   setSelectedSubFamilyId(editedProduct.subFamilia || "");
  // }, [editedProduct]);

  
 
  
 

  const handleFieldChange = (e) => {
    // Update the edited product state on field change
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const closeSuccessDialog = () => {
    setOpenErrorDialog(false);
  };

  const handleSave = async (event) => {

    
    event.preventDefault();
    console.log("editedProduct")
    console.log(editedProduct)    

    console.log("categories")
    console.log(categories)    


    console.log("subcategories")
    console.log(subcategories)    


    console.log("families")
    console.log(families)    


    console.log("subfamilies")
    console.log(subfamilies)    

    if(categories.length<1 ||
      subcategories.length<1 ||
      families.length<1 ||
      subfamilies.length<1 ){
        alert("Completar las familias")
        return
    }

    const idCategoria = categories.find(categoria=> categoria.descripcion ===editedProduct.categoria);
    const idSubCategoriaFind = subcategories.find(scategoria=> scategoria.descripcion === editedProduct.subCategoria);
    const idFamiliaFind = families.find(fam=> fam.descripcion === editedProduct.familia);
    const idSubFamiliaFind = subfamilies.find(sf=> sf.descripcion === editedProduct.subFamilia)
    console.log("idSubFamiliaFind")
    console.log(idSubFamiliaFind)

    if(idCategoria){
      const idCategoriaFil = idCategoria.idCategoria;
      const idSubCategoriaFil = idSubCategoriaFind.idSubcategoria;
      const idFamiliaFil = idFamiliaFind.idFamilia;
      const idSubFamiliaFil = idSubFamiliaFind.idSubFamilia;


      var nuevoObjetoActualizado = {
        ...editedProduct,
        categoria: idCategoriaFil,
        subCategoria: idSubCategoriaFil,
        familia: idFamiliaFil,
        subFamilia: idSubFamiliaFil

      };
      console.log("putnuevoobjeto", nuevoObjetoActualizado);
    }else{
      var nuevoObjetoActualizado = {
        ...editedProduct,
      };
    }

    

    try {
      const response = await axios.put(
      `${apiUrl}/ProductosTmp/UpdateProducto`, nuevoObjetoActualizado
      );
      console.log("API Response:", response.data);

      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        console.log("Producto updated successfully:", response.data);
        // setIsEditSuccessful(true);
        setSuccessDialogOpen(true);
        setSuccessMessage(response.data.message);
        setRefresh((prevRefresh) => !prevRefresh);
        handleClose();
        window.location.reload(1)
      }
    } catch (error) {
      console.error("Error updating producto:", error);
      console.log("Full error object:", error);
      console.log("Validation Errors:", error.response.data.errors);

      if (error.response) {
        console.log("Server Response:", error.response.data);
      }

      setErrorMessage(error.message);
      setOpenErrorDialog(true);
    }

    console.log("Edited Product:", editedProduct);
    // Additional logic to update the product in the database can be added here
  };

  return (
    //fullScreen
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Editar Producto</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{
          marginTop:"-10px"
        }}>
          <Grid item xs={8}>
            <TextField
              name="nombre"
              label="Nombre Producto"
              value={editedProduct.nombre || ""}
              onChange={(e) => {
                // setSelectedCategoryId(e.target.value);
                // // setEditedProduct.categoria=e.target.value;
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  nombre: e.target.value,
                }));
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Selecciona Categoría</InputLabel>
            <Select
              fullWidth
              value={selectedCategoryId}
              key={selectedCategoryId}
              
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                 
                  categoria: e.target.value,
                  // categoriaDes: e.target.name, // Update the categoria property
                }));
              }}
              label="Selecciona Categoría"
            >
              <MenuItem
                  key={selectedCategoryId}
                  value={editedProduct.categoria || ""}
                  name={editedProduct.categoria}
              >
                {editedProduct.categoria}
              </MenuItem>
              {categories.map((category) => (
                <MenuItem
                  key={category.idCategoria}
                  value={category.descripcion}
                >
                  {category.descripcion}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Selecciona Sub-Categoría</InputLabel>
            <Select
              fullWidth
              value={editedProduct.subCategoria || ""}
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  subCategoria: e.target.value,
                }));
              }}
              label="Selecciona Sub-Categoría"
            >
              <MenuItem
                key={editedProduct.id}
                value={editedProduct.subCategoria || ""}
              >
                {editedProduct.subCategoria}
              </MenuItem>
              {subcategories.map((subcategory) => (
                <MenuItem
                  key={subcategory.idSubcategoria}
                  value={subcategory.descripcion}
                >
                  {subcategory.descripcion}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Selecciona Familia</InputLabel>
            <Select
              fullWidth
              value={selectedFamilyId}
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  familia: e.target.value,
                }));
              }}
              label="Selecciona Familia"
            >
              <MenuItem
                key={editedProduct.id}
                value={editedProduct.familia || ""}
              >
                {editedProduct.familia}
              </MenuItem>
              {families.map((family) => (
                <MenuItem 
                key={family.idFamilia} 
                value={family.descripcion}>
                  {family.descripcion}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Selecciona Sub Familia</InputLabel>
            <Select
              fullWidth
              value={selectedSubFamilyId}
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  subFamilia: e.target.value,
                }));
              }}
              label="Selecciona SubFamilia"
            >
              <MenuItem
                key={editedProduct.id}
                value={editedProduct.subFamilia || ""}
              >
                {editedProduct.subFamilia}
              </MenuItem>
              {subfamilies.map((subfamily) => (
                <MenuItem
                  key={subfamily.idSubFamilia}
                  value={subfamily.descripcion}
                >
                  {subfamily.descripcion}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Marca</InputLabel>
            <Grid item xs={6}>
              <TextField
                name="marca"
                label=""
                value={editedProduct.marca || ""}
                onChange={(e) => {
                  // setSelectedCategoryId(e.target.value);
                  // // setEditedProduct.categoria=e.target.value;
                  setEditedProduct((prevProduct) => ({
                    ...prevProduct,
                    marca: e.target.value,
                  }));
                }}
                fullWidth
              />
            </Grid>



            {/* <Select
              fullWidth
              value={selectedMarcaId}
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  marca: e.target.value,
                }));
              }}
              label="Selecciona Marca"
            >
              <MenuItem
                key={editedProduct.id}
                value={editedProduct.marca || ""}
              >
                {editedProduct.marca}
              </MenuItem>
              {marcas.map((marca) => (
                <MenuItem key={marca.id} value={marca.nombre}>
                  {marca.nombre}
                </MenuItem>
              ))}
            </Select> */}




          </Grid>

          <Grid item xs={6}>
            <InputLabel>Ingresa Proveedor</InputLabel>
            <Select
              fullWidth
              value={selectedProveedorId}
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  proveedor: e.target.value,
                }));
              }}
              label="Selecciona Proveedor"
            >
              <MenuItem value={editedProduct.id || ""}>
                {editedProduct.proveedor}
              </MenuItem>
              {proveedores.map((proveedor) => (
                <MenuItem
                  key={proveedor.id}
                  value={proveedor.nombreResponsable}
                >
                  {proveedor.nombreResponsable}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="precioCosto"
              label="Precio Costo"
              value={editedProduct.precioCosto || ""}
              onChange={(e) => {
                // setSelectedCategoryId(e.target.value);
                // // setEditedProduct.categoria=e.target.value;
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  precioCosto: e.target.value,
                }));
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="precioVenta"
              label="Precio Venta"
              value={editedProduct.precioVenta || ""}
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  precioVenta: e.target.value,
                }));
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              name="stockInicial"
              label="Stock Inicial"
              value={editedProduct.stockInicial || ""}
              onChange={(e) => {
                // setSelectedCategoryId(e.target.value);
                // // setEditedProduct.categoria=e.target.value;
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  stockInicial: e.target.value,
                }));
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              name="stockActual"
              label="Stock actual"
              value={editedProduct.stockActual || ""}
              onChange={(e) => {
                // setSelectedCategoryId(e.target.value);
                // // setEditedProduct.categoria=e.target.value;
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  stockActual: e.target.value,
                }));
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              name="stockCritico"
              label="Stock Critico"
              value={editedProduct.stockCritico || ""}
              onChange={(e) => {
                // setSelectedCategoryId(e.target.value);
                // // setEditedProduct.categoria=e.target.value;
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  stockCritico: e.target.value,
                }));
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Guardar
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Cerrar
            </Button>
          </Grid>
        </Grid>
      </DialogContent>

      <Dialog open={successDialogOpen} onClose={closeSuccessDialog}>
        <DialogTitle> Edición Exitosa </DialogTitle>
        <DialogContent>
          <Typography>{successMessage}</Typography>{" "}
          {/* Aquí se muestra el mensaje de éxito */}
        </DialogContent>
      </Dialog>

      <Dialog open={openErrorDialog} onClose={closeSuccessDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
          <DialogContentText>
            Ingrese uno nuevo y repita el proceso
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSuccessDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default Editp2;
