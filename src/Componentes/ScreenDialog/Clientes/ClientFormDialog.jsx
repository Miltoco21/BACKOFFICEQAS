import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

const ClientFormDialog = ({ isEdit, editInfo, openDialog, setOpendialog, onSave }) => {
  const [formData, setFormData] = useState({
    codigoCliente: "",
    nombre: "",
    apellido: "",
    rut: "",
    direccion: "",
    telefono: "",
    correo: "",
    giro: "",
    region: "",
    comuna: "",
    formaPago: "",
    usaCuentaCorriente: 0
  });

  // Cargar datos cuando se abre en modo edición
  useEffect(() => {
    if (isEdit && editInfo) {
      setFormData({
        codigoCliente: editInfo.codigoCliente || "",
        nombre: editInfo.nombre || "",
        apellido: editInfo.apellido || "",
        rut: editInfo.rut || "",
        direccion: editInfo.direccion || "",
        telefono: editInfo.telefono || "",
        correo: editInfo.correo || "",
        giro: editInfo.giro || "",
        region: editInfo.region || "",
        comuna: editInfo.comuna || "",
        formaPago: editInfo.formaPago || "",
        usaCuentaCorriente: editInfo.usaCuentaCorriente || 0
      });
    }
  }, [isEdit, editInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false;
    }
    
    const cliente = {
      // ... (mismo objeto cliente)
    };
  
    console.log("Datos antes de enviar:", cliente);
    showLoading("Enviando...");
    
    if (isEdit && editData) {
      // Actualizar cliente existente
      Client.getInstance().update(
        editData.codigoCliente, // ID del cliente a actualizar
        cliente,
        (res) => {
          hideLoading();
          showMessage("Cliente actualizado exitosamente");
          setTimeout(() => {
            onClose();
            setOpendialog(false);
          }, 2000);
        },
        (error) => {
          hideLoading();
          showMessage(error);
        }
      );
    } else {
      // Crear nuevo cliente
      Client.getInstance().create(
        cliente,
        (res) => {
          hideLoading();
          showMessage("Cliente creado exitosamente");
          setTimeout(() => {
            onClose();
            setOpendialog(false);
          }, 2000);
        },
        (error) => {
          hideLoading();
          showMessage(error);
        }
      );
    }
  };

  return (
    <Dialog open={openDialog} onClose={() => setOpendialog(false)} fullWidth maxWidth="md">
      <DialogTitle>{isEdit ? "Editar Cliente" : "Crear Nuevo Cliente"}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="RUT"
              name="rut"
              value={formData.rut}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Giro"
              name="giro"
              value={formData.giro}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Región</InputLabel>
              <Select
                value={formData.region}
                onChange={handleChange}
                name="region"
              >
                {/* Opciones de regiones */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Comuna</InputLabel>
              <Select
                value={formData.comuna}
                onChange={handleChange}
                name="comuna"
              >
                {/* Opciones de comunas */}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpendialog(false)} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {isEdit ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientFormDialog;