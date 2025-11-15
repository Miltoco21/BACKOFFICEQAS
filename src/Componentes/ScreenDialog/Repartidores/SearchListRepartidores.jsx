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
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
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
import User from "../../../Models/User";
//import UserFormDialog from "./UserFormDialog";
import RepartidorFormDialog from "./RepartidorFormDialog";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import BoxSelectList from "../../Proveedores/BoxSelectList";

const SearchListRepartidores = () => {
  const {
    showMessage,
    showConfirm,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [repartidores, setRepartidores] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para los filtros
  const [filtroTodos, setFiltroTodos] = useState(true);
  const [filtroInternos, setFiltroInternos] = useState(false);
  const [filtroExternos, setFiltroExternos] = useState(false);

  // Estados para edición y eliminación
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRepartidor, setSelectedRepartidor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    loadRepartidores();
  }, []);

  const loadRepartidores = () => {
    setLoading(true);
    showLoading("Cargando repartidores...");
    
    User.getRepartidores(
      (data) => {
        setRepartidores(data);
        setFiltrados(data);
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

  // Aplicar filtros cuando cambian los estados de los checkboxes
  useEffect(() => {
    
    
    let filtered = repartidores;
  
    if (filtroInternos) {
      filtered = filtered.filter(r => r.rol === '5');
    }
    else if (filtroExternos) {
      filtered = filtered.filter(r => r.rol === '6');
    }
    
    // Aplicar filtros
  
    
    setFiltrados(filtered);
  }, [filtroTodos, filtroInternos, filtroExternos, repartidores]);


  const handleOpenEdit = (repartidor) => {
    setSelectedRepartidor(repartidor);
    setShowEditDialog(true);
  };

  const handleCloseEdit = () => {
    setShowEditDialog(false);
    setSelectedRepartidor(null);
  };

  const handleOpenDelete = (repartidor) => {
    setSelectedRepartidor(repartidor);
    setShowDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setShowDeleteDialog(false);
    setSelectedRepartidor(null);
  };

  const handleDelete = () => {
    if (!selectedRepartidor) return;
    
    showConfirm(`¿Eliminar al repartidor ${selectedRepartidor.nombres} ${selectedRepartidor.apellidos}?`, () => {
      showLoading("Eliminando repartidor...");
      
      User.delete(selectedRepartidor.codigoUsuario, 
        () => {
          hideLoading();
          loadRepartidores();
          setSnackbar({ open: true, message: "Repartidor eliminado correctamente", severity: "success" });
        }, 
        (error) => {
          hideLoading();
          setSnackbar({ open: true, message: `Error al eliminar: ${error}`, severity: "error" });
        }
      );
      
      handleCloseDelete();
    });
  };

  const handleSaveSuccess = () => {
    loadRepartidores();
    setSnackbar({ open: true, message: "Repartidor actualizado correctamente", severity: "success" });
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

  if (error && repartidores.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="error">Error: {error}</Typography>
        <Button variant="contained" onClick={loadRepartidores} sx={{ mt: 2 }}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Controles de filtro */}
      <Box mb={3} p={2} bgcolor="#f5f5f5" borderRadius={1}>
        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
          Filtrar por tipo:
        </Typography>
        {(() => {
    const filterOptions = [
      "Todos",
      "Repartidores Internos",
      "Repartidores Externos"
    ];
    
    // Determinar índice seleccionado basado en los filtros
    const selectedIndex = 
      filtroTodos ? 0 : 
      filtroInternos ? 1 : 
      filtroExternos ? 2 : 0;
    
    // Nueva función para manejar cambios exclusivos
    const handleExclusiveFilter = (index) => {
      switch(index) {
        case 0: // Todos
          setFiltroTodos(true);
          setFiltroInternos(false);
          setFiltroExternos(false);
          break;
        case 1: // Internos
          setFiltroTodos(false);
          setFiltroInternos(true);
          setFiltroExternos(false);
          break;
        case 2: // Externos
          setFiltroTodos(false);
          setFiltroInternos(false);
          setFiltroExternos(true);
          break;
        default:
          setFiltroTodos(true);
          setFiltroInternos(false);
          setFiltroExternos(false);
      }
    };

    return (
      <BoxSelectList 
        listValues={filterOptions}
        selected={selectedIndex}
        setSelected={handleExclusiveFilter}
      />
    );
  })()}
        
        <Typography variant="body2" mt={1} color="text.secondary">
          Mostrando: {filtrados.length} repartidores
        </Typography>
      </Box>

      {filtrados.length === 0 ? (
        <Box p={3} textAlign="center" border={1} borderColor="#eee" borderRadius={1}>
          <Typography>No hay repartidores que coincidan con los filtros seleccionados</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Código</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>RUT</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Teléfono</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Correo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtrados.map((repartidor) => (
                <TableRow key={repartidor.codigoUsuario}>
                  <TableCell>{repartidor.codigoUsuario}</TableCell>
                  <TableCell>
                    <span style={{ fontWeight: 500 }}>{repartidor.nombres}</span>
                    <br />
                    <span>{repartidor.apellidos}</span>
                  </TableCell>
                  <TableCell>{repartidor.rut || "-"}</TableCell>
                  <TableCell>{repartidor.telefono || "-"}</TableCell>
                  <TableCell>{repartidor.correo || "-"}</TableCell>
                  <TableCell>
                    {repartidor.rol === "5" ? (
                      <Box component="span" color="#1976d2" fontWeight="bold">
                        Interno
                      </Box>
                    ) : (
                      <Box component="span" color="#d32f2f" fontWeight="bold">
                        Externo
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleOpenEdit(repartidor)}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleOpenDelete(repartidor)}
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

      {/* Diálogo de Edición */}
      <Dialog 
        open={showEditDialog} 
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Editar Repartidor</Typography>
            <IconButton onClick={handleCloseEdit}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedRepartidor && (
            <RepartidorFormDialog
              isEdit={true}
              editInfo={selectedRepartidor}
              openDialog={showEditDialog}
              setOpendialog={setShowEditDialog}
              onSave={handleSaveSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

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
            ¿Estás seguro de eliminar al repartidor: 
            <br />
            <strong>{selectedRepartidor?.nombres} {selectedRepartidor?.apellidos}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={2}>
            ID: {selectedRepartidor?.codigoUsuario}
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

export default SearchListRepartidores;