
import React, { useState, useEffect } from 'react';
import Client from '../../Models/Client';
import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Box,
  Avatar,
  InputAdornment,
  Container,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import { AttachMoney, Person, Search, Edit, Refresh } from '@mui/icons-material';
import InputNumber from "../Elements/Compuestos/InputNumber"

const PreciosPorClientes = () => {
  const [busqueda, setBusqueda] = useState('');
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [preciosCliente, setPreciosCliente] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoProductos, setCargandoProductos] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [openAsignarPrecio, setOpenAsignarPrecio] = useState(false);
  const [nuevoPrecio, setNuevoPrecio] = useState(0);

  // Obtener todos los clientes al montar
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = () => {
    setCargando(true);
    const clientModel = Client.getInstance();
    clientModel.getAllFromServer(
      (clientes) => {
        setClientes(clientes);
        setCargando(false);
        setMensaje({ texto: '', tipo: '' });
      },
      (error) => {
        console.error("Error al obtener clientes:", error);
        setCargando(false);
        setMensaje({ texto: `Error al cargar clientes: ${error}`, tipo: 'error' });
      }
    );
  };

  // Filtrar clientes por búsqueda
  const clientesFiltrados = busqueda
    ? clientes.filter(cliente => {
        return (
          (cliente.nombre && cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
          (cliente.apellido && cliente.apellido.toLowerCase().includes(busqueda.toLowerCase())) ||
          (cliente.rut && cliente.rut.toLowerCase().includes(busqueda.toLowerCase()))
        );
      })
    : clientes;

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setCargandoProductos(true);
    const clientModel = Client.getInstance();
    
    const codigoSucursal = cliente.clienteSucursal ?? 0;
    
    clientModel.getClientPrices(
      codigoSucursal,
      cliente.codigoCliente,
      (precios) => {
        setPreciosCliente(precios);
        setCargandoProductos(false);
        setMensaje({ texto: '', tipo: '' });
      },
      (error) => {
        console.error("Error al obtener precios:", error);
        setCargandoProductos(false);
        setMensaje({ texto: `Error al cargar precios: ${error}`, tipo: 'error' });
      }
    );
  };

  const handleSelect = (price) => {
    setSelectedPrice(price);
    setNuevoPrecio(price.precio);
    setOpenAsignarPrecio(true);
  };

  const handleAsignPrice = () => {
    if (!selectedPrice) return;
    
    const precioActualizado = {
      ...selectedPrice,
      precio: nuevoPrecio
    };

    // Actualizar el estado local
    setPreciosCliente(prev => 
      prev.map(p => p.idProducto === selectedPrice.idProducto ? precioActualizado : p)
    );

    // Guardar en el servidor
    guardarPrecioIndividual(precioActualizado);
    
    setOpenAsignarPrecio(false);
  };

  const guardarPrecioIndividual = async (precio) => {
    if (!clienteSeleccionado) {
      setMensaje({ texto: "Por favor, selecciona un cliente primero.", tipo: 'error' });
      return;
    }

    // Estructura de datos corregida según el endpoint
    const datosParaGuardar = {
      codigoCliente: clienteSeleccionado.codigoCliente,
      codigoClienteSucursal: clienteSeleccionado.clienteSucursal ?? 0,
      preciosProductos: [
        {
          idProducto: precio.idProducto,
          precio: precio.precio
        }
      ]
    };

    setCargando(true);
    const clientModel = Client.getInstance();
    clientModel.saveClientPrices(
      datosParaGuardar,
      (respuesta) => {
        setCargando(false);
        setMensaje({ texto: "¡Precio actualizado con éxito!", tipo: 'exito' });
      },
      (error) => {
        setCargando(false);
        setMensaje({ texto: `Error al guardar: ${error.message || JSON.stringify(error)}`, tipo: 'error' });
      }
    );
  };

  const filteredPrices = searchTerm
    ? preciosCliente.filter(price => 
        price.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    : preciosCliente;

  // Función para formatear valores monetarios
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardHeader 
          title="Editor de Precios por Cliente" 
          titleTypographyProps={{ variant: 'h4', fontWeight: 'bold' }}
       
        />
        
        <Snackbar open={mensaje.texto !== ''} autoHideDuration={6000} onClose={() => setMensaje({ texto: '', tipo: '' })}>
          <Alert onClose={() => setMensaje({ texto: '', tipo: '' })} severity={mensaje.tipo === 'exito' ? 'success' : 'error'}>
            {mensaje.texto}
          </Alert>
        </Snackbar>

        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Buscar cliente"
                placeholder="Nombre, apellido o RUT..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Seleccionar Cliente
              </Typography>
              <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                {cargando ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : clientesFiltrados.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="textSecondary">
                      No se encontraron clientes
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {clientesFiltrados.map((cliente, index) => (
                      <React.Fragment key={index}>
                        <ListItem 
                          button 
                          onClick={() => seleccionarCliente(cliente)}
                          sx={{
                            backgroundColor: clienteSeleccionado?.codigoCliente === cliente.codigoCliente 
                              ? 'action.selected' 
                              : 'background.paper',
                            '&:hover': {
                              backgroundColor: 'action.hover'
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <Person />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${cliente.nombre} ${cliente.apellido}`}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" display="block">
                                  RUT: {cliente.rut}
                                </Typography>
                                <Typography component="span" variant="body2" display="block">
                                  {cliente.direccion}, {cliente.comuna}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        {index < clientesFiltrados.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>

            {clienteSeleccionado && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardHeader 
                    title={
                      <Typography variant="h5">
                        Precios para: 
                        <Box component="span" color="primary.main" ml={1}>
                          {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
                        </Box>
                      </Typography>
                    }
                  />
                  
                  <CardContent>
                    {cargandoProductos ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                        <Typography variant="body1" sx={{ ml: 2 }}>
                          Cargando precios del cliente...
                        </Typography>
                      </Box>
                    ) : preciosCliente.length === 0 ? (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1" color="textSecondary">
                          Este cliente no tiene precios asignados
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              label="Buscar productos"
                              placeholder="Nombre del producto..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Search />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        </Grid>

                        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                          <Table stickyHeader size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Precio Actual</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Acciones</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {filteredPrices.length > 0 ? (
                                filteredPrices.map((price, index) => (
                                  <TableRow
                                    key={price.idProducto + index}
                                    hover
                                    sx={{
                                      backgroundColor: selectedPrice?.idProducto === price.idProducto
                                        ? 'action.selected'
                                        : 'inherit',
                                    }}
                                  >
                                    <TableCell>{price.nombre}</TableCell>
                                    <TableCell>
                                      <Chip 
                                        label={formatCurrency(price.precio)} 
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                      />
                                    </TableCell>
                                    <TableCell align="right">
                                      <Button 
                                        onClick={() => handleSelect(price)} 
                                        variant="outlined" 
                                        color="primary"
                                        startIcon={<Edit />}
                                        size="small"
                                      >
                                        Cambiar
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={3} align="center">
                                    <Typography variant="body2" color="textSecondary">
                                      No se encontraron productos con ese nombre
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Diálogo para asignar precio */}
      <Dialog open={openAsignarPrecio} onClose={() => setOpenAsignarPrecio(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Edit sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Cambiar Precio</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPrice && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Producto: <strong>{selectedPrice.nombre}</strong>
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="body1">Precio actual:</Typography>
                <Chip 
                  label={formatCurrency(selectedPrice.precio)} 
                  color="primary"
                  size="medium"
                  sx={{ ml: 1, fontWeight: 'bold' }}
                />
              </Box>
              <InputNumber
                  fieldName="nuevoPrecio"
                  label="Nuevo Precio"
                  required={true}
                  autoFocus={true}
                  inputState={[nuevoPrecio, setNuevoPrecio]}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    ),
                  }}
                />
              {/* <TextField
                autoFocus
                margin="dense"
                label="Nuevo Precio"
                type="number"
                fullWidth
                variant="outlined"
                value={nuevoPrecio}
                onChange={(e) => setNuevoPrecio(parseFloat(e.target.value) || 0)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              /> */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAsignarPrecio(false)} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleAsignPrice} variant="contained" color="primary" startIcon={<Edit />}>
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PreciosPorClientes;