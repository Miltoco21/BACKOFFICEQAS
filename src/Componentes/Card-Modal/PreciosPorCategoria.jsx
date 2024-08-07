import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  InputLabel,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ModelConfig from "../../Models/ModelConfig";
import { Label } from "@mui/icons-material";

export const defaultTheme = createTheme();

const PreciosPorCategoria = ({ onClose }) => {
  const apiUrl =  ModelConfig.get().urlBase;
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedClientes, setSelectedClientes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchClienteTerm, setSearchClienteTerm] = useState("");
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para mantener el producto seleccionado

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);

  const handleSearchCliente = (e) => {
    setSearchClienteTerm(e.target.value);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, clientes.length);
  const clientesPaginados = clientes.slice(startIndex, endIndex);

  const fetchDataClientes = async () => {
    try {
      const response = await axios.get(
         ModelConfig.get().urlBase + `/Clientes/GetAllClientes`
      );
      setClientes(response.data.cliente);
      console.log("clientes:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {

    fetchDataClientes();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/ProductosTmp/GetProductos`,
        );
        setProducts(response.data.productos);
        console.log(response.data.productos);
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorMessage("Error al buscar el producto por descripción");
        setOpenSnackbar(true);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchButtonClick = async () => {
    if (searchTerm.trim() === "") {
      setErrorMessage("El campo de búsqueda está vacío");
      setOpenSnackbar(true);
      // setProducts([])
      return;
    }
  };

  const handlePrecioChange = (e, index) => {
    const { value } = e.target;
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        precioVenta: value,
      };
      return updatedProducts;
    });
  };

  const handleGuardarClick = async (selectedProduct) => {
    try {
      console.log("Datos antes de la actualización:", selectedProduct);

      const editedProduct = {
        ...selectedProduct,
        categoria:
          selectedProduct.categoria === "" ? 0 : selectedProduct.categoria,
        subCategoria:
          selectedProduct.subCategoria === ""
            ? 0
            : selectedProduct.subCategoria,
        familia: selectedProduct.familia === "" ? 0 : selectedProduct.familia,
        subFamilia:
          selectedProduct.subFamilia === "" ? 0 : selectedProduct.subFamilia,
      };

      const response = await axios.put(
        `${apiUrl}/ProductosTmp/UpdateProducto`,
        {
          idProducto: editedProduct.idProducto,
          nombre: editedProduct.nombre,
          categoria: editedProduct.categoria,
          subCategoria: editedProduct.subCategoria,
          familia: editedProduct.familia,
          subFamilia: editedProduct.subFamilia,
          precioVenta: editedProduct.precioVenta,
          bodega: editedProduct.bodega,
          impuesto: editedProduct.impuesto,
          marca: editedProduct.marca,
          nota: editedProduct.nota,
          proveedor: editedProduct.proveedor,
        }
      );

      console.log("Respuesta del servidor:", response.data);

      if (response.data.statusCode === 200) {
        setSuccessMessage("Precio editado exitosamente");
        setOpenSnackbar(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      setErrorMessage("Error al actualizar el producto");
      setOpenSnackbar(true);
    }
  };

  // Función para manejar el clic del botón "Asociar"
  console.log("selectedproduct", selectedProduct);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container justifyContent="center" sx={{ width: 650 }}>
        <Grid item xs={12} md={10} lg={10}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Precios por categorias
            </Typography>
            <div style={{ alignItems: "center" }}>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                sx={{ display: "flex", margin: 1 }}
              >
                <InputLabel
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    margin: 1,
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  Buscador una categoria
                </InputLabel>
              </Grid>

              <Grid
                item
                xs={10}
                md={10}
                sm={10}
                lg={10}
                sx={{
                  margin: 1,
                  display: "flex",
                  justifyContent: { xs: "flex-start", md: "flex-end" },
                }}
              >
                <TextField
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "5px",
                  }}
                  fullWidth
                  focused
                  placeholder="Ingresar Descripcion"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  sx={{
                    width: "30%",
                    margin: "1px",
                    backgroundColor: " #283048",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1c1b17 ",
                      color: "white",
                    },
                  }}
                  onClick={handleSearchButtonClick}
                >
                  Buscar
                </Button>
              </Grid>
              <Grid item
                xs={10}
                md={10}
                sm={10}
                lg={10}

                sx={{
                  margin: 1,
                }}
                >
                <Typography variant="p">
                  Margen de ganancia(en %)
                </Typography>

                <TextField
                  name="precio"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={"30"}
                  onChange={(e) => {
                    //handlePrecioChange(e, index)
                  }}
                />
              </Grid>
              <Grid
                item
                xs={10}
                md={10}
                sm={10}
                lg={10}
                sx={{
                  margin: 1,
                  display: "flex",
                  justifyContent: { xs: "flex-start", md: "flex-end" },
                }}
              >
              <Button
                onClick={() => {
                  console.log("guardar todo")
                }}
                variant="contained"
                color="secondary"
              >
                Aplicar cambios
              </Button>
              </Grid>
            </div>

            <TableContainer
              component={Paper}
              style={{
                overflowX: "auto",
                marginTop: 20,
                maxHeight: 500
               }}
            >
              <Table>
                <TableBody>
                <TableRow>
                <TableCell colSpan={2}>
                  <Typography variant="h5">
                    Productos afectados
                  </Typography>
                  </TableCell>
                </TableRow>
                  {products.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.nombre}</TableCell>
                      {/* <TableCell>
                        <TextField
                          name="precio"
                          variant="outlined"
                          fullWidth
                          value={product.precioVenta}
                          onChange={(e) => handlePrecioChange(e, index)}
                        />
                      </TableCell> */}
                      <TableCell>
                        
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        {successMessage ? (
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </Alert>
        ) : (
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        )}
      </Snackbar>
    </ThemeProvider>
  );
};

export default PreciosPorCategoria;
