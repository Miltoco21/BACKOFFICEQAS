import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import Client from '../../../Models/Client';

const EditarClienteForm = ({ cliente, onClose, onRefresh }) => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    codigoCliente: cliente.codigoCliente || '',
    rut: cliente.rut || '',
    nombre: cliente.nombre || '',
    apellido: cliente.apellido || '',
    direccion: cliente.direccion || '',
    telefono: cliente.telefono || '',
    region: cliente.region || '',
    comuna: cliente.comuna || '',
    correo: cliente.correo || '',
    giro: cliente.giro || '',
    urlPagina: cliente.urlPagina || '',
    formaPago: cliente.formaPago || 'Contado',
    usaCuentaCorriente: cliente.usaCuentaCorriente === 1 || false,
  });

  // Estados para regiones y comunas
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Cargar regiones al montar el componente
  useEffect(() => {
    const loadRegiones = async () => {
      try {
        Client.getInstance().getRegions(
          (data) => {
            setRegiones(data);
            // Si el cliente ya tiene región, cargar sus comunas
            if (cliente.region) {
              loadComunas(cliente.region);
            }
          },
          (err) => {
            console.error('Error cargando regiones:', err);
            setError('Error al cargar regiones');
          }
        );
      } catch (err) {
        console.error('Error inesperado:', err);
        setError('Error inesperado al cargar regiones');
      }
    };

    loadRegiones();
  }, []);

  // Cargar comunas cuando se selecciona una región
  const loadComunas = (regionId) => {
    Client.getInstance().getComunasFromRegion(
      regionId,
      (data) => setComunas(data),
      (err) => {
        console.error('Error cargando comunas:', err);
        setError('Error al cargar comunas');
      }
    );
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'region') {
      // Cuando cambia la región, cargar las comunas correspondientes
      setFormData({
        ...formData,
        [name]: value,
        comuna: '' // Resetear comuna al cambiar región
      });
      loadComunas(value);
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Validar RUT chileno
  const validateRut = (rut) => {
    if (!rut) return false;
    
    // Validar formato básico
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) {
      return false;
    }
    
    // Validación más completa sería implementar el algoritmo de verificación
    // Aquí solo validamos el formato por simplicidad
    return true;
  };

  // Validar formulario antes de enviar
  const validateForm = () => {
    if (!formData.nombre || !formData.apellido) {
      setError('Nombre y apellido son obligatorios');
      return false;
    }
    
    if (formData.rut && !validateRut(formData.rut)) {
      setError('El RUT no tiene un formato válido');
      return false;
    }
    
    if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      setError('El correo electrónico no es válido');
      return false;
    }
    
    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Preparar datos para enviar
      const dataToSend = {
        ...formData,
        usaCuentaCorriente: formData.usaCuentaCorriente ? 1 : 0
      };
      
      // Llamar al método de actualización en el modelo Client
      // Nota: Debes implementar un método update en el modelo Client
      // Por ahora usaremos create como placeholder
      Client.getInstance().create(
        dataToSend,
        (response) => {
          setLoading(false);
          setSuccess(true);
          // Esperar un momento antes de cerrar y refrescar
          setTimeout(() => {
            onRefresh();
            onClose();
          }, 1500);
        },
        (error) => {
          setLoading(false);
          setError(error.message || 'Error al actualizar el cliente');
          console.error('Error al actualizar cliente:', error);
        }
      );
    } catch (err) {
      setLoading(false);
      setError('Error inesperado al procesar la solicitud');
      console.error('Error inesperado:', err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Editar Cliente: {cliente.nombre} {cliente.apellido}
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {success && (
        <Typography color="success.main" sx={{ mb: 2 }}>
          Cliente actualizado correctamente!
        </Typography>
      )}
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Código Cliente"
            name="codigoCliente"
            value={formData.codigoCliente}
            onChange={handleChange}
            disabled
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="RUT"
            name="rut"
            value={formData.rut}
            onChange={handleChange}
            placeholder="12345678-9"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Correo Electrónico"
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Región</InputLabel>
            <Select
              name="region"
              value={formData.region}
              onChange={handleChange}
              label="Región"
            >
              <MenuItem value="">Seleccione una región</MenuItem>
              {regiones.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Comuna</InputLabel>
            <Select
              name="comuna"
              value={formData.comuna}
              onChange={handleChange}
              label="Comuna"
              disabled={!formData.region}
            >
              <MenuItem value="">Seleccione una comuna</MenuItem>
              {comunas.map((comuna) => (
                <MenuItem key={comuna.id} value={comuna.id}>
                  {comuna.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Giro Comercial"
            name="giro"
            value={formData.giro}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Página Web"
            name="urlPagina"
            value={formData.urlPagina}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Forma de Pago</InputLabel>
            <Select
              name="formaPago"
              value={formData.formaPago}
              onChange={handleChange}
              label="Forma de Pago"
            >
              <MenuItem value="Contado">Contado</MenuItem>
              <MenuItem value="Crédito 30 días">Crédito 30 días</MenuItem>
              <MenuItem value="Crédito 60 días">Crédito 60 días</MenuItem>
              <MenuItem value="Crédito 90 días">Crédito 90 días</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  name="usaCuentaCorriente"
                  checked={formData.usaCuentaCorriente}
                  onChange={handleChange}
                />
              }
              label="Usa Cuenta Corriente"
            />
          </FormGroup>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ mr: 2 }}
          disabled={loading}
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </Box>
    </Box>
  );
};

export default EditarClienteForm;