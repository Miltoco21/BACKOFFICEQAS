import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  CircularProgress,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  TextField,
  IconButton,
  Collapse,
  Card,
  CardContent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import ModelConfig from "../../Models/ModelConfig";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const SearchByLevels = ({ 
  onProductoSeleccionado, 
  clearSearch,
  refresh 
}) => {
  const apiUrl = ModelConfig.get().urlBase;

  // Estados de búsqueda
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [tipo, setTipo] = useState("Productos");
  const [data, setData] = useState([]);
  const [dataResult, setDataResult] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Estados de paginación y filtros
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filtrarTexto, setFiltrarTexto] = useState("");
  
  // Estado de expansión del panel
  const [expanded, setExpanded] = useState(true);

  // Limpiar búsqueda cuando clearSearch cambie
  useEffect(() => {
    if (clearSearch) {
      limpiarBusqueda();
    }
  }, [clearSearch]);

  const fetchData = async () => {
    setLoading(true);

    const params = {
      fechadesde: startDate ? startDate.format("YYYY-MM-DD") : "",
      fechahasta: endDate ? endDate.format("YYYY-MM-DD") : "",
      tipo: tipo.toString(),
    };

    try {
      const url = apiUrl + `/ReporteVentas/ReporteVentasRankingProductoGET`;
      const response = await axios.get(url, { params });

      if (response.data && response.data.cantidad > 0 && response.data.reporteVentaRankingProductos) {
        setData(response.data.reporteVentaRankingProductos);
        setDataResult(response.data.reporteVentaRankingProductos);
        setPage(0);
      } else {
        setData([]);
        setDataResult([]);
      }
    } catch (error) {
      console.error("Error al buscar datos:", error);
      setData([]);
      setDataResult([]);
    }

    setLoading(false);
  };

  const handleBuscarClick = () => {
    if (!startDate || !endDate) {
      alert("Por favor, seleccione ambas fechas.");
      return;
    }

    if (dayjs(startDate).isAfter(endDate)) {
      alert("La fecha de inicio no puede ser mayor que la fecha de término.");
      return;
    }

    fetchData();
  };

  const filtrar = () => {
    if (!filtrarTexto.trim()) {
      setData(dataResult);
      return;
    }

    const dataFiltrada = dataResult.filter((item) =>
      item.descripcion.toLowerCase().includes(filtrarTexto.toLowerCase())
    );
    setData(dataFiltrada);
    setPage(0);
  };

  const quitarFiltro = () => {
    setFiltrarTexto("");
    setData(dataResult);
    setPage(0);
  };

  const limpiarBusqueda = () => {
    setData([]);
    setDataResult([]);
    setFiltrarTexto("");
    setPage(0);
    setStartDate(dayjs());
    setEndDate(dayjs());
    setTipo("Productos");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSeleccionarProducto = (producto) => {
    // Convertir el producto del ranking al formato esperado
    const productoFormateado = {
      idProducto: producto.codigoProducto,
      codbarra: producto.codigoProducto,
      nombre: producto.descripcion,
      descripcion: producto.descripcion,
      precioVenta: producto.precioVenta,
      precioCosto: producto.precioCosto,
      stockActual: producto.stockActual,
    };

    onProductoSeleccionado(productoFormateado);
  };

  const formatCLP = (valor) => {
    if (valor == null || isNaN(valor)) return "$0";
    return `$${valor.toLocaleString("es-CL")}`;
  };

  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" component="div">
            Búsqueda por Niveles (Ranking de Ventas)
          </Typography>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Filtros de búsqueda */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha Inicio"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  format="DD/MM/YYYY"
                  slotProps={{ 
                    textField: { 
                      size: "small",
                      sx: { minWidth: 180 }
                    } 
                  }}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha Término"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  format="DD/MM/YYYY"
                  slotProps={{ 
                    textField: { 
                      size: "small",
                      sx: { minWidth: 180 }
                    } 
                  }}
                />
              </LocalizationProvider>

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={tipo}
                  label="Tipo"
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <MenuItem value="Productos">Productos</MenuItem>
                  <MenuItem value="Marca">Marca</MenuItem>
                  <MenuItem value="Familia">Familia</MenuItem>
                  <MenuItem value="SubFamilia">Sub Familia</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={handleBuscarClick}
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </Box>

            {/* Filtro de texto */}
            {data.length > 0 && (
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                  size="small"
                  fullWidth
                  label="Filtrar por descripción"
                  value={filtrarTexto}
                  onChange={(e) => setFiltrarTexto(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && filtrar()}
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={filtrar}
                  size="small"
                  sx={{ minWidth: 100 }}
                >
                  Filtrar
                </Button>
                {filtrarTexto && (
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={quitarFiltro}
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    Quitar Filtro
                  </Button>
                )}
              </Box>
            )}

            {/* Tabla de resultados */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : data.length === 0 ? (
              <Box sx={{ p: 2, textAlign: "center", backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                <Typography color="textSecondary">
                  {dataResult.length === 0 
                    ? "Realice una búsqueda para ver productos" 
                    : "No se encontraron resultados con ese filtro"}
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} elevation={1}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                        <TableCell><strong>Código</strong></TableCell>
                        <TableCell><strong>Descripción</strong></TableCell>
                        <TableCell align="right"><strong>Precio Venta</strong></TableCell>
                        <TableCell align="right"><strong>Stock</strong></TableCell>
                        <TableCell align="right"><strong>Cantidad Vendida</strong></TableCell>
                        <TableCell align="right"><strong>Total Ventas</strong></TableCell>
                        <TableCell align="center"><strong>Ranking</strong></TableCell>
                        <TableCell align="center"><strong>Acción</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((producto, index) => (
                          <TableRow key={producto.codigoProducto || index} hover>
                            <TableCell>
                              <Typography variant="body2" color="primary">
                                {producto.codigoProducto}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {producto.descripcion}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                {formatCLP(producto.precioVenta)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                {producto.stockActual.toLocaleString("es-CL")}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" color="secondary">
                                {producto.cantidad.toLocaleString("es-CL")}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="bold">
                                {formatCLP(producto.sumaTotal)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  backgroundColor: "#ffd54f",
                                  borderRadius: 1,
                                  px: 1,
                                  fontWeight: "bold"
                                }}
                              >
                                #{producto.ranking}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleSeleccionarProducto(producto)}
                                title="Seleccionar producto"
                              >
                                <AddCircleIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={data.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                  labelRowsPerPage="Filas por página"
                  labelDisplayedRows={({ from, to, count }) => 
                    `${from}-${to} de ${count}`
                  }
                />
              </>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default SearchByLevels;