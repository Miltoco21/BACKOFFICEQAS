import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Client from "../../../Models/Client";
import ClientFormDialog from "./ClientFormDialog";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import IngresoCL from "../../Proveedores/IngresoCL"

const SearchListClients = () => {
  const {
    showMessage,
    showConfirm,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para edición y eliminación
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 15;
  const [paginatedClients, setPaginatedClients] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    setLoading(true);
    showLoading("Cargando clientes...");
    
    const clientModel = new Client();
    clientModel.getAllFromServer(
      (data) => {
        setClients(data);
        setFilteredClients(data);
        setLoading(false);
        hideLoading();
      },
      (errorMsg) => {
        setError(errorMsg);
        setLoading(false);
        hideLoading();
        setSnackbar({ open: true, message: `Error: ${errorMsg}`, severity: "error" });
      }
    );
  };

  // Aplicar búsqueda
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client => 
        (client.nombre && client.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.apellido && client.apellido.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.rut && client.rut.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  // Paginar resultados
  useEffect(() => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginated = filteredClients.slice(startIndex, endIndex);
    setPaginatedClients(paginated);
    
    const totalPages = Math.ceil(filteredClients.length / perPage);
    setTotalPages(totalPages);
  }, [filteredClients, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOpenEdit = (client) => {
    setSelectedClient(client);
    setShowEditDialog(true);
  };

  const handleCloseEdit = () => {
    setShowEditDialog(false);
    setSelectedClient(null);
  };

  const handleOpenDelete = (client) => {
    setSelectedClient(client);
    setShowDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setShowDeleteDialog(false);
    setSelectedClient(null);
  };

  const handleDelete = () => {
    if (!selectedClient) return;
    
    showConfirm(`¿Eliminar al cliente ${selectedClient.nombre} ${selectedClient.apellido}?`, () => {
      showLoading("Eliminando cliente...");
      
      // Aquí debes implementar la lógica para eliminar el cliente usando el modelo Client
      // Por ejemplo: 
      // const clientModel = new Client();
      // clientModel.delete(selectedClient.codigoCliente, ...)
      // Por ahora, simulamos una eliminación exitosa
      setTimeout(() => {
        hideLoading();
        // Filtramos el cliente eliminado
        const updatedClients = clients.filter(c => c.codigoCliente !== selectedClient.codigoCliente);
        setClients(updatedClients);
        setSnackbar({ open: true, message: "Cliente eliminado correctamente", severity: "success" });
        handleCloseDelete();
      }, 1000);
    });
  };

  const handleSaveSuccess = () => {
    loadClients();
    setSnackbar({ open: true, message: "Cliente actualizado correctamente", severity: "success" });
    handleCloseEdit();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && clients.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="error">Error: {error}</Typography>
        <Button variant="contained" onClick={loadClients} sx={{ mt: 2 }}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Campo de búsqueda */}
      <Box mb={3}>
        <TextField 
          fullWidth
          placeholder="Buscar por nombre, apellido o RUT..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {filteredClients.length === 0 ? (
        <Box p={3} textAlign="center" border={1} borderColor="#eee" borderRadius={1}>
          <Typography>No hay clientes que coincidan con la búsqueda</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Código</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>RUT</TableCell>
                {/* <TableCell sx={{ fontWeight: "bold" }}>Razón Social</TableCell> */}
                <TableCell sx={{ fontWeight: "bold" }}>Dirección</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Teléfono</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Correo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Giro</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedClients.map((client) => (
                <TableRow key={client.codigoCliente}>
                  <TableCell>{client.codigoCliente}</TableCell>
                  <TableCell>
                    <span style={{ fontWeight: 500 }}>{client.nombre}</span>
                    <br />
                    <span>{client.apellido}</span>
                  </TableCell>
                  <TableCell>{client.rut || "-"}</TableCell>
                  {/* <TableCell>{client.razonSocial || "-"}</TableCell> */}
                  <TableCell>{client.direccion || "-"}</TableCell>
                  <TableCell>{client.telefono || "-"}</TableCell>
                  <TableCell>{client.correo || "-"}</TableCell>
                  <TableCell>{client.giro || "-"}</TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleOpenEdit(client)}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleOpenDelete(client)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Siguiente
          </Button>
        </Box>
      </Box>

      {/* Diálogo de Edición */}
    

      {/* Diálogo de Eliminación */}
      <Dialog open={showDeleteDialog} onClose={handleCloseDelete}>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Confirmar Eliminación</Typography>
            <IconButton onClick={handleCloseDelete}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar al cliente: 
            <br />
            <strong>{selectedClient?.nombre} {selectedClient?.apellido}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={2}>
            ID: {selectedClient?.codigoCliente}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {showEditDialog && selectedClient && (
  <IngresoCL
    openDialog={showEditDialog}
    setOpendialog={setShowEditDialog}
    isEdit={true}
    editData={selectedClient}
    onClose={() => setShowEditDialog(false)}
  />
)}

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SearchListClients;