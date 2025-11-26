
import React, { useState, useEffect, useContext } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import Ofertas from "../../Models/Ofertas";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchListOffers from "./SearchListOfertas";
import DialogEditarOfertaNxM from "./DialogEditarOfertaNxM";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

/**
 * Componente principal para gestión de ofertas tipo N x M (Lleva N, Paga M)
 * Permite crear nuevas ofertas y visualizar/editar/eliminar ofertas existentes
 */
const OfertasNxM = ({ onClose,tipoOferta = 2  }) => {
  const { showLoading, hideLoading, showMessage, showConfirm } = useContext(SelectedOptionsContext);

  // Estados del formulario de creación
  const [refresh, setRefresh] = useState(false);
  const [nombreOferta, setNombreOferta] = useState("");
  const [lleva, setlleva] = useState(null);
  const [paga, setpaga] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [diasSemana, setDiasSemana] = useState([true, true, true, true, true, true, true]);

  // Estados para la lista de ofertas
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ofertasFiltradas, setOfertasFiltradas] = useState([]);

  // Estados para el diálogo de edición
  const [dialogEditarOpen, setDialogEditarOpen] = useState(false);
  const [ofertaParaEditar, setOfertaParaEditar] = useState(null);

  const nombresDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  // Cargar ofertas al montar el componente y cuando refresh cambie
  useEffect(() => {
    loadOfertas();
  }, [refresh]);

  useEffect(() => {
    if (ofertas.length > 0) {
      const filtradas = ofertas.filter(oferta => oferta.codigoTipo === tipoOferta);
      setOfertasFiltradas(filtradas);
    } else {
      setOfertasFiltradas([]);
    }
  }, [ofertas, tipoOferta]);

  /**
   * Carga todas las ofertas desde el backend
   */
  const loadOfertas = () => {
    setLoading(true);
    setError(null);

    Ofertas.getAllOfertas(
      (data, response) => {
        setOfertas(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error al cargar ofertas:", error);
        setError("Error al cargar las ofertas");
        setLoading(false);
      }
    );
  };

  /**
   * Convierte array de booleanos a string de días (ej: [true,false,...] -> "1011111")
   */
  const convertirDiasAString = (diasArray) => {
    return diasArray.map((dia) => (dia ? "1" : "0")).join("");
  };

  /**
   * Maneja el cambio de selección de un día específico
   */
  const handleDiaChange = (index) => {
    const nuevosDias = [...diasSemana];
    nuevosDias[index] = !nuevosDias[index];
    setDiasSemana(nuevosDias);
  };

  /**
   * Selecciona o deselecciona todos los días de la semana
   */
  const handleTodosLosDias = (seleccionar) => {
    setDiasSemana(new Array(7).fill(seleccionar));
  };

  /**
   * Agrega un producto a la lista de productos seleccionados
   */
  const handleProductoSeleccionado = (producto) => {
    const yaExiste = productosSeleccionados.some((p) => p.codbarra === producto.codbarra);

    if (yaExiste) {
      showMessage("Este producto ya ha sido agregado");
      return;
    }

    const nuevoProducto = {
      codbarra: producto.codbarra || producto.idProducto?.toString(),
      descripcionProducto: producto.nombre || producto.descripcion,
      cantidad: 0,
      porcDescuento: 0,
      precioVenta: producto.precioVenta || 0,
    };

    setProductosSeleccionados((prev) => [...prev, nuevoProducto]);
  };

  /**
   * Elimina un producto de la lista de productos seleccionados
   */
  const handleEliminarProducto = (codbarra) => {
    setProductosSeleccionados((prev) => prev.filter((p) => p.codbarra !== codbarra));
  };

  /**
   * Calcula el valor de descuento para la oferta N x M
   * CASO 1: Si hay un solo producto, se descuenta el valor de UNA unidad
   * CASO 2: Si hay múltiples productos, se descuenta el valor del producto de menor precio
   */
  const calcularValorDescuento = () => {
    if (productosSeleccionados.length === 0 || !lleva || !paga) return 0;

    // CASO 1: Un solo producto repetido
    if (productosSeleccionados.length === 1) {
      const producto = productosSeleccionados[0];
      const precioUnitario = producto.precioVenta || 0;
      
      // El descuento es el valor de UNA unidad (porque se aplica por unidad)
      const descuento = precioUnitario;
      
      console.log(`CASO 1 - Producto único:`);
      console.log(`  Precio unitario: $${precioUnitario}`);
      console.log(`  Lleva: ${lleva}, Paga: ${paga}`);
      console.log(`  Descuento por unidad: $${descuento}`);
      
      return descuento;
    }
    
    // CASO 2: Múltiples productos diferentes
    // El descuento es el valor del producto de menor precio
    const precioMenor = Math.min(...productosSeleccionados.map(p => p.precioVenta || 0));
    
    console.log(`CASO 2 - Productos múltiples:`);
    console.log(`  Productos: ${productosSeleccionados.length}`);
    console.log(`  Precios: ${productosSeleccionados.map(p => `$${p.precioVenta}`).join(', ')}`);
    console.log(`  Precio menor: $${precioMenor}`);
    console.log(`  Descuento por unidad: $${precioMenor}`);
    
    return precioMenor;
  };

  /**
   * Obtiene el detalle del cálculo para mostrar en el resumen
   */
  const obtenerDetalleCalculo = () => {
    if (productosSeleccionados.length === 0 || !lleva || !paga) return null;

    // CASO 1: Un solo producto
    if (productosSeleccionados.length === 1) {
      const producto = productosSeleccionados[0];
      const precioUnitario = producto.precioVenta || 0;
      const unidadesGratis = lleva - paga;
      const totalSinDescuento = precioUnitario * lleva;
      const descuentoPorUnidad = precioUnitario;
      const descuentoTotal = descuentoPorUnidad * unidadesGratis;
      const totalConDescuento = precioUnitario * paga;

      return {
        tipo: 'producto_unico',
        producto: producto.descripcionProducto,
        codbarra: producto.codbarra,
        precioUnitario,
        lleva,
        paga,
        unidadesGratis,
        totalSinDescuento,
        totalConDescuento,
        descuentoPorUnidad,
        descuentoTotal
      };
    }

    // CASO 2: Múltiples productos
    const precios = productosSeleccionados.map(p => p.precioVenta || 0);
    const totalSinDescuento = precios.reduce((sum, precio) => sum + precio, 0);
    const precioMenor = Math.min(...precios);
    const productoMenor = productosSeleccionados.find(p => p.precioVenta === precioMenor);
    const descuentoPorUnidad = precioMenor;
    const descuentoTotal = descuentoPorUnidad * 1; // siempre 1 unidad con descuento
    const totalConDescuento = totalSinDescuento - descuentoTotal;

    return {
      tipo: 'productos_multiples',
      productos: productosSeleccionados.map(p => ({
        codbarra: p.codbarra,
        descripcion: p.descripcionProducto,
        precio: p.precioVenta,
        esMenor: p.precioVenta === precioMenor
      })),
      totalSinDescuento,
      precioMenor,
      productoMenor: productoMenor?.descripcionProducto,
      codbarraMenor: productoMenor?.codbarra,
      totalConDescuento,
      descuentoPorUnidad,
      descuentoTotal,
      lleva,
      paga
    };
  };

  /**
   * Valida que todos los campos obligatorios estén completos
   */
  const validarFormulario = () => {
    if (productosSeleccionados.length === 0) {
      showMessage("Debe seleccionar al menos un producto");
      return false;
    }
    if (!nombreOferta.trim()) {
      showMessage("Debe ingresar un nombre para la oferta");
      return false;
    }
    if (!startDate || !endDate) {
      showMessage("Debe seleccionar las fechas de inicio y término");
      return false;
    }
    if (!startTime || !endTime) {
      showMessage("Debe seleccionar la hora de inicio y término");
      return false;
    }
    if (!lleva || lleva <= 0) {
      showMessage("Debe ingresar una cantidad válida de productos a llevar");
      return false;
    }
    if (!paga || paga <= 0) {
      showMessage("Debe ingresar una cantidad válida de productos a pagar");
      return false;
    }
    if (paga >= lleva) {
      showMessage("La cantidad a pagar debe ser menor que la cantidad a llevar");
      return false;
    }
    return true;
  };

  /**
   * Guarda una nueva oferta N x M con cálculo mejorado
   */
  const handleGuardar = () => {
    if (!validarFormulario()) {
      return;
    }

    // Calcular el valor de descuento según el caso
    const valorDescuentoUnitario = calcularValorDescuento();
    const detalleCalculo = obtenerDetalleCalculo();

    let oferta_ListaCanasta = [];

    // CASO 1: Producto único - se repite en la lista
    if (productosSeleccionados.length === 1) {
      const producto = productosSeleccionados[0];
      const unidadesGratis = lleva - paga;
      
      // Crear entrada por cada unidad que se lleva
      for (let i = 0; i < lleva; i++) {
        // Las últimas unidades (las gratis) tienen 100% descuento
        const esUnidadGratis = i >= paga;
        
        oferta_ListaCanasta.push({
          codbarra: producto.codbarra,
          descripcionProducto: producto.descripcionProducto,
          cantidad: 1, // Siempre 1 por cada entrada
          porcDescuento: esUnidadGratis ? 100 : 0, // 100% descuento en unidades gratis
        });
      }
      
      console.log(`CASO 1 - Lista generada:`);
      console.log(`  Total de entradas: ${oferta_ListaCanasta.length}`);
      console.log(`  Unidades con pago: ${paga}`);
      console.log(`  Unidades con 100% descuento: ${unidadesGratis}`);
    } 
    // CASO 2: Múltiples productos diferentes
    else {
      const precioMenor = Math.min(...productosSeleccionados.map(p => p.precioVenta || 0));
      
      // Agregar cada producto una vez
      productosSeleccionados.forEach((producto) => {
        const esProductoMenor = producto.precioVenta === precioMenor;
        
        oferta_ListaCanasta.push({
          codbarra: producto.codbarra,
          descripcionProducto: producto.descripcionProducto,
          cantidad: 1, // Siempre 1 unidad de cada producto
          porcDescuento: esProductoMenor ? 100 : 0, // 100% descuento al de menor valor
        });
      });
      
      console.log(`CASO 2 - Lista generada:`);
      console.log(`  Total de productos: ${oferta_ListaCanasta.length}`);
      console.log(`  Producto con 100% descuento: ${oferta_ListaCanasta.find(p => p.porcDescuento === 100)?.descripcionProducto}`);
    }

    // Construir el objeto de la oferta
    const nuevaOferta = {
      codigoTipo: 2, 
      descripcion: nombreOferta,
      fechaInicial: startDate.toISOString(),
      fechaFinal: endDate.toISOString(),
      horaInicio: startTime ? startTime.format("HH:mm") : "",
      horaFin: endTime ? endTime.format("HH:mm") : "",
      diasSemana: convertirDiasAString(diasSemana),
      fAplicaMix: productosSeleccionados.length > 1, // true si hay múltiples productos
      oferta_Regla: {
        signo: "=",
        cantidad: 1, // Siempre 1 porque se aplica por unidad
        tipoDescuento: "$", // Descuento en pesos
        valor: valorDescuentoUnitario, // Valor del descuento por unidad
        aplicacion: "Unidad", // Se aplica por unidad
      },
      oferta_ListaCanasta: oferta_ListaCanasta,
    };

    console.log("=== GUARDANDO OFERTA N x M ===");
    console.log("Tipo de oferta:", productosSeleccionados.length === 1 ? "CASO 1 (Producto único)" : "CASO 2 (Productos múltiples)");
    console.log(`Lleva: ${lleva}, Paga: ${paga}`);
    console.log(`Descuento por unidad: $${valorDescuentoUnitario}`);
    console.log("oferta_ListaCanasta:", JSON.stringify(oferta_ListaCanasta, null, 2));
    console.log("Objeto completo:", JSON.stringify(nuevaOferta, null, 2));
    
    showLoading();

    Ofertas.addOferta(
      nuevaOferta,
      (data, response) => {
        hideLoading();
        showMessage("Oferta creada exitosamente");
        setRefresh(!refresh);
        limpiarFormulario();
      },
      (error) => {
        hideLoading();
        console.error("Error al guardar oferta:", error);
        const mensajeError = error?.message || error?.descripcion || "Error desconocido";
        showMessage(`Error al guardar la oferta: ${mensajeError}`);
      }
    );
  };

  /**
   * Limpia todos los campos del formulario de creación
   */
  const limpiarFormulario = () => {
    setNombreOferta("");
    setlleva(null);
    setpaga(null);
    setStartDate(null);
    setEndDate(null);
    setStartTime(null);
    setEndTime(null);
    setProductosSeleccionados([]);
    setDiasSemana([true, true, true, true, true, true, true]);
  };

  /**
   * Abre el diálogo de edición con los datos de la oferta seleccionada
   */
  const handleEdit = (oferta) => {
    setOfertaParaEditar(oferta);
    setDialogEditarOpen(true);
  };

  /**
   * Cierra el diálogo de edición
   */
  const handleCloseDialogEditar = () => {
    setDialogEditarOpen(false);
    setOfertaParaEditar(null);
  };

  /**
   * Callback ejecutado cuando se actualiza una oferta exitosamente
   */
  const handleOfertaActualizada = () => {
    setRefresh(!refresh);
  };

  /**
   * Elimina una oferta (baja lógica)
   */
  const handleDelete = (oferta) => {
    if (!oferta || !oferta.codigoOferta) {
      showMessage("Error: No se pudo identificar la oferta a eliminar");
      console.error("Oferta inválida:", oferta);
      return;
    }

    const mensajeConfirmacion = `¿Está seguro de eliminar la oferta "${oferta.descripcion}"?\nCódigo: ${oferta.codigoOferta}`;

    showConfirm(
      mensajeConfirmacion,
      () => {
        showLoading();

        Ofertas.deleteOferta(
          oferta.codigoOferta,
          (data, response) => {
            hideLoading();
            showMessage("Oferta eliminada exitosamente");
            setRefresh(!refresh);
          },
          (error) => {
            hideLoading();
            console.error("Error al eliminar oferta:", error);
            const mensajeError = error?.message || error?.descripcion || "Error desconocido";
            showMessage(`Error al eliminar la oferta: ${mensajeError}`);
          }
        );
      },
      () => {
        console.log("Eliminación cancelada por el usuario");
      }
    );
  };

  /**
   * Maneja cambios en campos numéricos
   */
  const handleNumericChange = (setter, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "" || numericValue === "0") {
      setter(null);
    } else {
      setter(parseInt(numericValue));
    }
  };

  const descuentoCalculado = calcularValorDescuento();
  const detalleCalculo = obtenerDetalleCalculo();

  /**
   * Componente JSX para mostrar el resumen del cálculo
   */
  const ResumenCalculo = () => {
    if (!lleva || !paga || !detalleCalculo) return null;

    // CASO 1: Producto único
    if (detalleCalculo.tipo === 'producto_unico') {
      return (
        <Box sx={{ mt: 2, p: 2, backgroundColor: "#f0f7ff", borderRadius: 1, border: "1px solid #2196f3" }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            <strong>📊 Resumen del Cálculo - Producto Único</strong>
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            • Producto: <strong>{detalleCalculo.producto}</strong>
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            • Código: <strong>{detalleCalculo.codbarra}</strong>
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            • Precio unitario: <strong>${detalleCalculo.precioUnitario}</strong>
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            • El cliente lleva: <strong>{detalleCalculo.lleva}</strong> unidades
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            • El cliente paga: <strong>{detalleCalculo.paga}</strong> unidades
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            • Unidades gratis (100% descuento): <strong>{detalleCalculo.unidadesGratis}</strong>
          </Typography>
          
          <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #2196f3' }}>
            <Typography variant="body2" gutterBottom>
              <strong>Estructura de oferta_ListaCanasta:</strong>
            </Typography>
            <Box sx={{ ml: 2, p: 1, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
              <Typography variant="caption" display="block">
                - {detalleCalculo.paga} entrada(s) con cantidad: 1, porcDescuento: 0%
              </Typography>
              <Typography variant="caption" display="block">
                - {detalleCalculo.unidadesGratis} entrada(s) con cantidad: 1, porcDescuento: 100%
              </Typography>
              <Typography variant="caption" display="block" fontWeight="bold" color="primary">
                Total: {detalleCalculo.lleva} entradas en la lista
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #2196f3' }}>
            <Typography variant="body2">
              • Descuento por unidad: <strong>${detalleCalculo.descuentoPorUnidad}</strong>
            </Typography>
            <Typography variant="body2">
              • Total sin descuento: <strong>${detalleCalculo.totalSinDescuento}</strong>
            </Typography>
            <Typography variant="body2">
              • Total a pagar: <strong>${detalleCalculo.totalConDescuento}</strong>
            </Typography>
            <Typography variant="body2" color="success.main" fontWeight="bold" sx={{ mt: 1 }}>
              💰 Descuento total: ${detalleCalculo.descuentoTotal}
            </Typography>
          </Box>
          
          <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
            oferta_Regla: cantidad = 1, valor = ${detalleCalculo.descuentoPorUnidad}, aplicacion = "Unidad"
          </Typography>
        </Box>
      );
    }

    // CASO 2: Múltiples productos
    if (detalleCalculo.tipo === 'productos_multiples') {
      return (
        <Box sx={{ mt: 2, p: 2, backgroundColor: "#fff8e1", borderRadius: 1, border: "1px solid #ffa726" }}>
          <Typography variant="subtitle2" color="warning.dark" gutterBottom>
            <strong>📊 Resumen del Cálculo - Productos Múltiples</strong>
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            • Productos en la oferta: <strong>{detalleCalculo.productos.length}</strong>
          </Typography>
          
          <Box sx={{ ml: 2, my: 1 }}>
            {detalleCalculo.productos.map((prod, idx) => (
              <Typography 
                key={idx} 
                variant="caption" 
                display="block" 
                color={prod.esMenor ? "success.main" : "textSecondary"}
                fontWeight={prod.esMenor ? "bold" : "normal"}
              >
                {prod.esMenor ? "✓ " : "- "}{prod.descripcion}: ${prod.precio}
                {prod.esMenor && " (100% descuento)"}
              </Typography>
            ))}
          </Box>
          
          <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #ffa726' }}>
            <Typography variant="body2" gutterBottom>
              <strong>Estructura de oferta_ListaCanasta:</strong>
            </Typography>
            <Box sx={{ ml: 2, p: 1, backgroundColor: '#fff3e0', borderRadius: 1 }}>
              {detalleCalculo.productos.map((prod, idx) => (
                <Typography key={idx} variant="caption" display="block">
                  - {prod.descripcion}: cantidad: 1, porcDescuento: {prod.esMenor ? "100%" : "0%"}
                </Typography>
              ))}
              <Typography variant="caption" display="block" fontWeight="bold" color="warning.dark" sx={{ mt: 0.5 }}>
                Total: {detalleCalculo.productos.length} entradas en la lista
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #ffa726' }}>
            <Typography variant="body2">
              • Producto con menor valor: <strong>{detalleCalculo.productoMenor}</strong>
            </Typography>
            <Typography variant="body2">
              • Descuento por unidad: <strong>${detalleCalculo.descuentoPorUnidad}</strong>
            </Typography>
            <Typography variant="body2">
              • Total sin descuento: <strong>${detalleCalculo.totalSinDescuento}</strong>
            </Typography>
            <Typography variant="body2">
              • Total a pagar: <strong>${detalleCalculo.totalConDescuento}</strong>
            </Typography>
            <Typography variant="body2" color="success.main" fontWeight="bold" sx={{ mt: 1 }}>
              💰 Descuento total: ${detalleCalculo.descuentoTotal}
            </Typography>
          </Box>
          
          <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
            oferta_Regla: cantidad = 1, valor = ${detalleCalculo.descuentoPorUnidad}, aplicacion = "Unidad"
          </Typography>
        </Box>
      );
    }

    return null;
  };

  return (
    <>
      <DialogTitle>Ofertas N x M (Lleva N, Paga M)</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {/* Campo de nombre de oferta */}
          <TextField
            label="Nombre de la Oferta"
            type="text"
            value={nombreOferta}
            onChange={(e) => setNombreOferta(e.target.value)}
            fullWidth
            placeholder="Ej: 3x2 en productos seleccionados"
          />

          {/* Componente de búsqueda de productos */}
          <SearchListOffers
            refresh={refresh}
            setRefresh={setRefresh}
            onProductoSeleccionado={handleProductoSeleccionado}
          />

          {/* Tabla de productos seleccionados */}
          {productosSeleccionados.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Productos Seleccionados ({productosSeleccionados.length})
              </Typography>
              <TableContainer component={Paper} elevation={2}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                      <TableCell><strong>Código</strong></TableCell>
                      <TableCell><strong>Descripción</strong></TableCell>
                      <TableCell align="center"><strong>Precio de Venta</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productosSeleccionados.map((producto) => (
                      <TableRow key={producto.codbarra} hover>
                        <TableCell>
                          <Chip label={producto.codbarra} size="small" color="primary" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{producto.descripcionProducto}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            ${producto.precioVenta}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleEliminarProducto(producto.codbarra)}
                            title="Eliminar"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Resumen de cálculo mejorado */}
              <ResumenCalculo />
            </Box>
          )}

          {/* Fechas */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha Inicio"
                value={startDate}
                onChange={setStartDate}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha Término"
                value={endDate}
                onChange={setEndDate}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Box>

          {/* Horas */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeField
          label="Hora de Inicio"
          // defaultValue={dayjs('2022-04-17T15:30')}
          format="HH:mm"
          value={startTime}
          onChange={setStartTime}
          slotProps={{ textField: { fullWidth: true } }}
        />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeField
                label="Hora de Término"
                  // defaultValue={dayjs('2022-04-17T15:30')}
          format="HH:mm"
                value={endTime}
                onChange={setEndTime}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Box>

          {/* Cantidad Lleva y Paga */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Lleva (N)"
              type="text"
              value={lleva || ""}
              onChange={(e) => handleNumericChange(setlleva, e.target.value)}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
              fullWidth
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              helperText="Cantidad que se lleva el cliente"
            />
            <TextField
              label="Paga (M)"
              type="text"
              value={paga || ""}
              onChange={(e) => handleNumericChange(setpaga, e.target.value)}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
              fullWidth
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              helperText="Cantidad que paga el cliente"
            />
          </Box>

          {/* Días de la semana */}
          <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, backgroundColor: "#fafafa" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Días de la Semana
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button size="small" variant="outlined" onClick={() => handleTodosLosDias(true)}>
                  Todos
                </Button>
                <Button size="small" variant="outlined" onClick={() => handleTodosLosDias(false)}>
                  Ninguno
                </Button>
              </Box>
            </Box>

            <FormGroup row sx={{ display: "flex", justifyContent: "space-between" }}>
              {nombresDias.map((dia, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={diasSemana[index]}
                      onChange={() => handleDiaChange(index)}
                      color="primary"
                    />
                  }
                  label={dia}
                />
              ))}
            </FormGroup>
          </Box>

          {/* Tabla de ofertas existentes */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Todas las Ofertas
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : ofertasFiltradas.length > 0 ? (
              <TableContainer component={Paper} elevation={2}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell><strong>Código</strong></TableCell>
                      <TableCell><strong>Descripción</strong></TableCell>
                      <TableCell><strong>Productos</strong></TableCell>
                    
                      <TableCell align="center"><strong>Descuento</strong></TableCell>
                      <TableCell align="center"><strong>Vigencia</strong></TableCell>
                      <TableCell align="center"><strong>Estado</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ofertasFiltradas.map((oferta, index) => (
                      <TableRow
                        key={oferta.codigoOferta || index}
                        hover
                        sx={{
                          backgroundColor: oferta.bajaLogica ? "#ffebee" : "inherit",
                          opacity: oferta.bajaLogica ? 0.6 : 1,
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {oferta.codigoOferta}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">{oferta.descripcion}</Typography>
                          {oferta.codigoTipo && (
                            <Chip label={`Tipo ${oferta.codigoTipo}`} size="small" variant="outlined" sx={{ mt: 0.5 }} />
                          )}
                        </TableCell>

                        <TableCell>
                          {oferta.products && oferta.products.length > 0 ? (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                              {oferta.products.map((prod, idx) => (
                                <Typography key={idx} variant="caption" color="textSecondary">
                                  {prod.descripcion}
                                </Typography>
                              ))}
                            </Box>
                          ) : (
                            <Chip label="Sin productos" size="small" color="default" />
                          )}
                        </TableCell>

                      

                       

                        <TableCell align="center">
                          {oferta.oferta_Regla && (
                            <Typography variant="body2" color="success.main" fontWeight="bold">
                              ${oferta.oferta_Regla.valor}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell align="center">
                          <Typography variant="caption" display="block">
                            {new Date(oferta.fechaInicial).toLocaleDateString("es-CL")}
                          </Typography>
                          <Typography variant="caption" display="block" color="textSecondary">
                            hasta
                          </Typography>
                          <Typography variant="caption" display="block">
                            {new Date(oferta.fechaFinal).toLocaleDateString("es-CL")}
                          </Typography>
                          {oferta.diasSemana && oferta.diasSemana !== "1111111" && (
                            <Chip label="Días específicos" size="small" sx={{ mt: 0.5, fontSize: "0.7rem" }} />
                          )}
                        </TableCell>

                        <TableCell align="center">
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, alignItems: "center" }}>
                            <Chip
                              label={oferta.activo ? "Activa" : "Inactiva"}
                              size="small"
                              color={oferta.activo ? "success" : "default"}
                            />
                            {oferta.bajaLogica && (
                              <Chip label="Eliminada" size="small" color="error" variant="outlined" />
                            )}
                          </Box>
                        </TableCell>

                        <TableCell align="center">
                          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(oferta)}
                              title="Editar"
                              disabled={oferta.bajaLogica}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            {!oferta.bajaLogica && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(oferta)}
                                title="Eliminar"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="textSecondary">
                  No hay ofertas registradas
                </Typography>
              </Paper>
            )}

            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" color="textSecondary">
                Total: {ofertas.length} oferta{ofertas.length !== 1 ? "s" : ""}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Activas: {ofertas.filter((o) => !o.bajaLogica && o.activo).length} | Inactivas:{" "}
                {ofertas.filter((o) => !o.bajaLogica && !o.activo).length} | Eliminadas:{" "}
                {ofertas.filter((o) => o.bajaLogica).length}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleGuardar} variant="contained" disabled={productosSeleccionados.length === 0}>
          Crear Oferta
        </Button>
      </DialogActions>

      {/* Diálogo de edición */}
      <DialogEditarOfertaNxM
        open={dialogEditarOpen}
        onClose={handleCloseDialogEditar}
        ofertaEditar={ofertaParaEditar}
        onOfertaActualizada={handleOfertaActualizada}
      />
    </>
  );
};

export default OfertasNxM;