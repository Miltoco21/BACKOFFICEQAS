import React, { useState } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material';

const DescuentoUnidadAgrupado = ({ onClose }) => {
  const [tipoDescuento, setTipoDescuento] = useState('unidad');
  const [porcentajeDescuento, setPorcentajeDescuento] = useState('');
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  const handleGuardar = () => {
    // Lógica para guardar la oferta
    console.log('Guardando oferta de descuento:', {
      tipoDescuento,
      porcentajeDescuento,
      productosSeleccionados
    });
    onClose();
  };

  return (
    <>
      <DialogTitle>Descuento por Unidad o Agrupado</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Descuento</InputLabel>
            <Select
              value={tipoDescuento}
              label="Tipo de Descuento"
              onChange={(e) => setTipoDescuento(e.target.value)}
            >
              <MenuItem value="unidad">Por Unidad</MenuItem>
              <MenuItem value="agrupado">Agrupado</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Porcentaje de Descuento (%)"
            type="number"
            value={porcentajeDescuento}
            onChange={(e) => setPorcentajeDescuento(e.target.value)}
            fullWidth
          />

          <Typography variant="body2" color="textSecondary">
            {tipoDescuento === 'unidad' 
              ? 'Aplicar descuento a productos individuales'
              : 'Aplicar descuento a grupos de productos'}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleGuardar} variant="contained">
          Guardar Oferta
        </Button>
      </DialogActions>
    </>
  );
};

export default DescuentoUnidadAgrupado;