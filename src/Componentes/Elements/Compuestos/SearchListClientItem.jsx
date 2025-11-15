import React, { useState } from "react";
import {
  TableCell,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Client from "../../../Models/Client";
import EditarClienteForm from "./EditarClienteForm"; // Componente para editar cliente
import ClienteRepartidor from "../../ScreenDialog/ClienteRepartidor";

const SearchListClientItem = ({ cliente, onRefresh, showMessage }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [asociarOpen, setAsociarOpen] = useState(false);
  const [asociacionSuccess, setAsociacionSuccess] = useState(null);

  const handleOpenAsociar = () => {
    setAsociarOpen(true);
  };

  const handleCloseAsociar = () => {
    setAsociarOpen(false);
  };



  const handleOpenEdit = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
  };

  const handleOpenDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    // Lógica para eliminar el cliente (debes implementarla en el modelo Client)
    // Ejemplo: 
    // Client.getInstance().delete(cliente.id, 
    //   () => { 
    //     showMessage("Cliente eliminado");
    //     onRefresh();
    //   },
    //   (error) => showMessage("Error: " + error)
    // );
    handleCloseDelete();
  };
  const handleAsociarSuccess = (data) => {
    setAsociacionSuccess(data);
    
    // Determinar el tipo de mensaje basado en la acción
    if (data.action === 'associate') {
      showMessage(`Asociación creada con éxito`);
      // showMessage(`Asociación creada con éxito: ${data.repartidor.nombre}`);
    } 
    else if (data.action === 'disassociate') {
      showMessage(`Desasociación realizada con éxito `);
      // showMessage(`Desasociación realizada con éxito: ${data.repartidor.nombre}`);
    }
    else {
      showMessage(`Operación realizada con éxito`);
    }
    
    onRefresh();
  };


  return (
    <>
      <TableRow>
        <TableCell>{cliente.codigoCliente}</TableCell>
        <TableCell>{cliente.nombre} {cliente.apellido}</TableCell>
        <TableCell>{cliente.rut}</TableCell>
        <TableCell>{cliente.direccion}</TableCell>
        <TableCell>{cliente.telefono}</TableCell>
        <TableCell>{cliente.correo}</TableCell>
        <TableCell>
          {/* <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleOpenEdit}
            sx={{ mr: 1 }}
          >
            Editar
          </Button> */}
          <Button
            variant="contained"
            color="primary"
            //startIcon={<DeleteIcon />}
            //onClick={handleOpenDelete}
            onClick={handleOpenAsociar}
          >
           Asociar
          </Button>
        </TableCell>
      </TableRow>

      <ClienteRepartidor
        cliente={cliente}
        open={asociarOpen}
        onClose={handleCloseAsociar}
        onAsociarSuccess={handleAsociarSuccess}
      />

      {/* Diálogo de Edición */}
      <Dialog open={openEditDialog} onClose={handleCloseEdit} fullWidth maxWidth="md">
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent>
          <EditarClienteForm 
            cliente={cliente} 
            onClose={handleCloseEdit} 
            onRefresh={onRefresh}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDelete}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar al cliente {cliente.nombre} {cliente.apellido}?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SearchListClientItem;