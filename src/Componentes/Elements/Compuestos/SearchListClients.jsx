import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  Snackbar,
} from "@mui/material";
import SideBar from "../../NavBar/SideBar";
import ModelConfig from "../../../Models/ModelConfig";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import Client from "../../../Models/Client"; // Importamos el modelo de Cliente
import SearchListClientItem from "./SearchListClientItem"; // Componente para cada item

const SearchListClients = ({ refresh = false }) => {
  const { showMessage } = useContext(SelectedOptionsContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [clientes, setClientes] = useState([]);
  const [doRefresh, setDoRefresh] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const perPage = 15;

  // Estados para paginación
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [paginatedClientes, setPaginatedClientes] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // Obtener clientes
  const fetchClientes = async () => {
    Client.getInstance().getAllFromServer(
      (clientes) => {
        setClientes(clientes);
        filtrarClientes(clientes);
      },
      (error) => {
        showMessage("Error al cargar clientes: " + error);
      }
    );
  };

  useEffect(() => {
    fetchClientes();
  }, [doRefresh]);

  // Filtrar clientes basado en searchTerm
  const filtrarClientes = (clientesList) => {
    const filtered = clientesList.filter(
      (cliente) =>
        cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.rut?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClientes(filtered);

    // Calcular paginación
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginated = filtered.slice(startIndex, endIndex);
    setPaginatedClientes(paginated);
    setTotalPages(Math.ceil(filtered.length / perPage));
  };

  // Efecto para filtrar cuando cambia searchTerm o currentPage
  useEffect(() => {
    filtrarClientes(clientes);
  }, [searchTerm, currentPage, clientes]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <Button color="inherit" size="small" onClick={handleSnackbarClose}>
            Cerrar
          </Button>
        }
      />

      <TextField
        fullWidth
        placeholder="Buscar cliente por nombre, apellido o RUT..."
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>RUT</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedClientes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No se encontraron clientes
              </TableCell>
            </TableRow>
          ) : (
            paginatedClientes.map((cliente, index) => (
              <SearchListClientItem
                key={index}
                cliente={cliente}
                onRefresh={() => setDoRefresh(!doRefresh)}
                showMessage={showMessage}
              />
            ))
          )}
        </TableBody>
      </Table>

      {/* Paginación */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Typography variant="body2">
          Página {currentPage} de {totalPages}
        </Typography>
        <Box>
          <Button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Anterior
          </Button>
          <Button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Siguiente
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchListClients;