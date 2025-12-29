// // // import React, { useState, useEffect, useContext, useCallback } from "react";
// // // import {
// // //   DialogTitle,
// // //   DialogContent,
// // //   DialogActions,
// // //   Button,
// // //   TextField,
// // //   Box,
// // //   Typography,
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableContainer,
// // //   TableHead,
// // //   TableRow,
// // //   Paper,
// // //   IconButton,
// // //   Chip,
// // //   CircularProgress,
// // //   Checkbox,
// // //   FormControlLabel,
// // //   FormGroup,
// // //   ToggleButton,
// // //   ToggleButtonGroup,
// // //   InputAdornment,
// // // } from "@mui/material";
// // // import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// // // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// // // import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// // // import { TimeField } from "@mui/x-date-pickers/TimeField";
// // // import dayjs from "dayjs";
// // // import Ofertas from "../../Models/Ofertas";
// // // import EditIcon from "@mui/icons-material/Edit";
// // // import DeleteIcon from "@mui/icons-material/Delete";
// // // import SearchByLevels from "./SearchByLevels";
// // // import DialogEditarDescuentoUnidadAgrupado from "./DialogEditarDescuentoUnidadAgrupado";
// // // import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
// // // import PercentIcon from "@mui/icons-material/Percent";
// // // import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// // // const DescuentosProductosAgrupados = ({ onClose, tipoOferta = 1 }) => {
// // //   const { showLoading, hideLoading, showMessage, showConfirm } = useContext(
// // //     SelectedOptionsContext
// // //   );

// // //   // Estados del formulario de creación
// // //   const [refresh, setRefresh] = useState(false);
// // //   const [nombreOferta, setNombreOferta] = useState("");
// // //   const [cantidadOferta, setCantidadOferta] = useState(null);
// // //   const [valorTotalOferta, setValorTotalOferta] = useState(null);
// // //   const [startDate, setStartDate] = useState(null);
// // //   const [endDate, setEndDate] = useState(null);
// // //   const [startTime, setStartTime] = useState(null);
// // //   const [endTime, setEndTime] = useState(null);
// // //   const [productoSeleccionado, setProductoSeleccionado] = useState(null);
// // //   const [diasSemana, setDiasSemana] = useState([
// // //     true,
// // //     true,
// // //     true,
// // //     true,
// // //     true,
// // //     true,
// // //     true,
// // //   ]);
// // //   const [ofertaActiva, setOfertaActiva] = useState(true);
// // //   const [clearSearch, setClearSearch] = useState(false);
// // //   const [ofertasFiltradas, setOfertasFiltradas] = useState([]);
// // //   const [guardando, setGuardando] = useState(false);

// // //   // Estados para el tipo de descuento
// // //   const [tipoDescuento, setTipoDescuento] = useState("$"); // '$' o '%'
// // //   const [descuentoManual, setDescuentoManual] = useState(0);
// // //   const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);

// // //   // Estados calculados / visuales
// // //   const [totalSinDescuento, setTotalSinDescuento] = useState(0);
// // //   const [totalConDescuento, setTotalConDescuento] = useState(0);
// // //   const [descuentoAplicado, setDescuentoAplicado] = useState(0); // Monto en pesos del descuento aplicado

// // //   // Estados para la lista de ofertas
// // //   const [ofertas, setOfertas] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState(null);

// // //   // Estados para el diálogo de edición
// // //   const [dialogEditarOpen, setDialogEditarOpen] = useState(false);
// // //   const [ofertaParaEditar, setOfertaParaEditar] = useState(null);

// // //   const nombresDias = [
// // //     "Lunes",
// // //     "Martes",
// // //     "Miércoles",
// // //     "Jueves",
// // //     "Viernes",
// // //     "Sábado",
// // //     "Domingo",
// // //   ];

// // //   // Cargar ofertas al montar el componente y cuando refresh cambie
// // //   useEffect(() => {
// // //     loadOfertas();
// // //   }, [refresh]);

// // //   useEffect(() => {
// // //     if (ofertas.length > 0) {
// // //       const filtradas = ofertas.filter(
// // //         (oferta) => oferta.codigoTipo === tipoOferta
// // //       );
// // //       setOfertasFiltradas(filtradas);
// // //     } else {
// // //       setOfertasFiltradas([]);
// // //     }
// // //   }, [ofertas, tipoOferta]);

// // //   // Efecto de limpieza al desmontar
// // //   useEffect(() => {
// // //     return () => {
// // //       setGuardando(false);
// // //     };
// // //   }, []);

// // //   // CALCULO PRINCIPAL - MODIFICADO para manejar ambos tipos de descuento
// // //   const calcularTotales = useCallback(() => {
// // //     console.log("=== INICIANDO CÁLCULO ===");
// // //     console.log("Tipo descuento:", tipoDescuento);
// // //     console.log("Producto:", productoSeleccionado);
// // //     console.log("Descuento manual ($):", descuentoManual);
// // //     console.log("Descuento porcentaje (%):", descuentoPorcentaje);

// // //     if (!productoSeleccionado) {
// // //       console.log("No hay producto, reseteando valores");
// // //       setTotalSinDescuento(0);
// // //       setTotalConDescuento(0);
// // //       setDescuentoAplicado(0);
// // //       return;
// // //     }

// // //     // 1) Calcular total sin descuento (precio del producto)
// // //     const totalOriginal = Number(productoSeleccionado.precioVenta || 0);
// // //     console.log("Total original calculado:", totalOriginal);
// // //     setTotalSinDescuento(totalOriginal);

// // //     // 2) Calcular descuento aplicado en pesos según el tipo
// // //     let descuentoEnPesos = 0;

// // //     if (tipoDescuento === "$") {
// // //       // Descuento en monto fijo
// // //       descuentoEnPesos = descuentoManual || 0;
// // //     } else {
// // //       // Descuento en porcentaje
// // //       descuentoEnPesos = totalOriginal * ((descuentoPorcentaje || 0) / 100);
// // //     }

// // //     // Redondear a entero (sin decimales)
// // //     descuentoEnPesos = Math.round(descuentoEnPesos);

// // //     console.log("Descuento en pesos:", descuentoEnPesos);
// // //     setDescuentoAplicado(descuentoEnPesos);

// // //     // 3) Calcular total con descuento
// // //     const totalConDescuentoCalculado = totalOriginal - descuentoEnPesos;
// // //     console.log("Total con descuento:", totalConDescuentoCalculado);

// // //     // Asegurarse de que no sea negativo
// // //     const totalFinal = Math.max(0, totalConDescuentoCalculado);
// // //     setTotalConDescuento(totalFinal);

// // //     // 4) Actualizar valorTotalOferta (que será el total con descuento)
// // //     setValorTotalOferta(totalFinal);
// // //   }, [productoSeleccionado, descuentoManual, descuentoPorcentaje, tipoDescuento]);

// // //   // Ejecutar cálculo cuando cambien las dependencias
// // //   useEffect(() => {
// // //     calcularTotales();
// // //   }, [calcularTotales]);

// // //   /**
// // //    * Carga todas las ofertas desde el backend
// // //    */
// // //   const loadOfertas = () => {
// // //     setLoading(true);
// // //     console.log("Cargando ofertas...");

// // //     Ofertas.getAllOfertas(
// // //       (data, response) => {
// // //         console.log("Ofertas cargadas:", data.length);
// // //         setOfertas(data);
// // //         setLoading(false);
// // //       },
// // //       (error) => {
// // //         console.error("Error al cargar ofertas:", error);
// // //         setLoading(false);
// // //         showMessage("Error al cargar las ofertas");
// // //       }
// // //     );
// // //   };

// // //   /**
// // //    * Convierte array de booleanos a string de días (ej: [true,false,...] -> "1011111")
// // //    */
// // //   const convertirDiasAString = (diasArray) => {
// // //     return diasArray.map((dia) => (dia ? "1" : "0")).join("");
// // //   };

// // //   /**
// // //    * Maneja el cambio de selección de un día específico
// // //    */
// // //   const handleDiaChange = (index) => {
// // //     const nuevosDias = [...diasSemana];
// // //     nuevosDias[index] = !nuevosDias[index];
// // //     setDiasSemana(nuevosDias);
// // //   };

// // //   /**
// // //    * Selecciona o deselecciona todos los días de la semana
// // //    */
// // //   const handleTodosLosDias = (seleccionar) => {
// // //     setDiasSemana(new Array(7).fill(seleccionar));
// // //   };

// // //   /**
// // //    * Reemplaza el producto seleccionado
// // //    */
// // //   const handleProductoSeleccionado = (producto) => {
// // //     const nuevoProducto = {
// // //       codbarra: producto.codbarra || producto.idProducto?.toString(),
// // //       descripcionProducto: producto.nombre || producto.descripcion,
// // //       cantidad: 1,
// // //       precioVenta: Number(producto.precioVenta || 0),
// // //     };

// // //     console.log("Reemplazando producto:", nuevoProducto);
// // //     setProductoSeleccionado(nuevoProducto);
// // //     setClearSearch((prev) => !prev);
// // //   };

// // //   /**
// // //    * Elimina el producto seleccionado
// // //    */
// // //   const handleEliminarProducto = () => {
// // //     console.log("Eliminando producto");
// // //     setProductoSeleccionado(null);
// // //     // Resetear descuentos al eliminar producto
// // //     setDescuentoManual(0);
// // //     setDescuentoPorcentaje(0);
// // //   };

// // //   /**
// // //    * Maneja el cambio del tipo de descuento
// // //    */
// // //   const handleTipoDescuentoChange = (event, newTipo) => {
// // //     if (newTipo !== null) {
// // //       setTipoDescuento(newTipo);
// // //       // Resetear valores al cambiar tipo
// // //       setDescuentoManual(0);
// // //       setDescuentoPorcentaje(0);
// // //     }
// // //   };

// // //   /**
// // //    * Maneja el cambio del descuento manual (monto fijo)
// // //    */
// // //   const handleDescuentoManualChange = (value) => {
// // //     const numericValue = value.replace(/[^0-9]/g, "");

// // //     if (numericValue === "" || numericValue === "0") {
// // //       setDescuentoManual(0);
// // //     } else {
// // //       const descuento = parseInt(numericValue, 10);
// // //       // Validar que el descuento no sea mayor al total
// // //       if (descuento > totalSinDescuento) {
// // //         showMessage("El descuento no puede ser mayor al total del producto");
// // //         setDescuentoManual(totalSinDescuento);
// // //       } else {
// // //         setDescuentoManual(descuento);
// // //       }
// // //     }
// // //   };

// // //   /**
// // //    * Maneja el cambio del descuento en porcentaje
// // //    */
// // //   const handleDescuentoPorcentajeChange = (value) => {
// // //     const numericValue = value.replace(/[^0-9]/g, "");

// // //     if (numericValue === "" || numericValue === "0") {
// // //       setDescuentoPorcentaje(0);
// // //     } else {
// // //       let porcentaje = parseInt(numericValue, 10);
// // //       // Validar que no sea mayor a 100%
// // //       if (porcentaje > 100) {
// // //         showMessage("El porcentaje no puede ser mayor a 100%");
// // //         porcentaje = 100;
// // //       }
// // //       setDescuentoPorcentaje(porcentaje);
// // //     }
// // //   };

// // //   /**
// // //    * Valida que todos los campos obligatorios estén completos
// // //    */
// // //   const validarFormulario = () => {
// // //     if (!productoSeleccionado) {
// // //       showMessage("Debe seleccionar un producto");
// // //       return false;
// // //     }

// // //     if (!nombreOferta.trim()) {
// // //       showMessage("Debe ingresar un nombre para la oferta");
// // //       return false;
// // //     }

// // //     if (!startDate || !endDate) {
// // //       showMessage("Debe seleccionar las fechas de inicio y término");
// // //       return false;
// // //     }

// // //     if (!startTime || !endTime) {
// // //       showMessage("Debe seleccionar la hora de inicio y término");
// // //       return false;
// // //     }

// // //     // Validar que fecha final no sea anterior a fecha inicial
// // //     if (endDate.isBefore(startDate, 'day')) {
// // //       showMessage("La fecha de término no puede ser anterior a la fecha de inicio");
// // //       return false;
// // //     }

// // //     // Validar horas si están en el mismo día
// // //     if (startDate.isSame(endDate, 'day')) {
// // //       if (endTime.isBefore(startTime)) {
// // //         showMessage("La hora de término no puede ser anterior a la hora de inicio");
// // //         return false;
// // //       }
// // //     }

// // //     const totalOriginal = Number(productoSeleccionado.precioVenta || 0);

// // //     if (totalOriginal <= 0) {
// // //       showMessage("El total del producto debe ser mayor que 0");
// // //       return false;
// // //     }

// // //     // Validar descuento según tipo
// // //     if (tipoDescuento === "$") {
// // //       if (descuentoManual < 0) {
// // //         showMessage("El descuento no puede ser negativo");
// // //         return false;
// // //       }

// // //       if (descuentoManual >= totalOriginal) {
// // //         showMessage("El descuento debe ser menor al total del producto");
// // //         return false;
// // //       }
// // //     } else {
// // //       if (descuentoPorcentaje < 0) {
// // //         showMessage("El porcentaje no puede ser negativo");
// // //         return false;
// // //       }

// // //       if (descuentoPorcentaje > 100) {
// // //         showMessage("El porcentaje no puede ser mayor a 100%");
// // //         return false;
// // //       }
// // //     }

// // //     return true;
// // //   };

// // //   /**
// // //    * Guarda una nueva oferta
// // //    */
// // //   const handleGuardar = () => {
// // //     if (guardando) return;

// // //     if (!validarFormulario()) {
// // //       return;
// // //     }

// // //     setGuardando(true);
// // //     showLoading();

// // //     // Calcular valores actualizados
// // //     const totalOriginal = Number(productoSeleccionado.precioVenta || 0);
// // //     const totalConDescuentoCalculado = totalOriginal - descuentoAplicado;

// // //     // Preparar lista para enviar al backend (con un solo producto)
// // //     const listaParaEnviar = [{
// // //       codbarra: productoSeleccionado.codbarra,
// // //       descripcionProducto: productoSeleccionado.descripcionProducto,
// // //       cantidad: 1,
// // //       porcDescuento: tipoDescuento === "%" ? descuentoPorcentaje : 0,
// // //       descuentoMonto: tipoDescuento === "$" ? descuentoManual : 0,
// // //     }];

// // //     // Construir el objeto de la oferta
// // //     const nuevaOferta = {
// // //       codigoTipo: tipoOferta,
// // //       descripcion: nombreOferta.trim(),
// // //       fechaInicial: startDate ? startDate.toISOString() : null,
// // //       fechaFinal: endDate ? endDate.toISOString() : null,
// // //       horaInicio: startTime ? startTime.format("HH:mm") : null,
// // //       horaFin: endTime ? endTime.format("HH:mm") : null,
// // //       diasSemana: convertirDiasAString(diasSemana),
// // //       fAplicaMix: true,
// // //       activo: ofertaActiva,
// // //       oferta_Regla: {
// // //         signo: "=",
// // //         cantidad: 1,
// // //         tipoDescuento: tipoDescuento, // Usar el tipo de descuento seleccionado
// // //         valor: totalConDescuentoCalculado,
// // //         aplicacion: "Total",
// // //       },
// // //       oferta_ListaCanasta: listaParaEnviar,
// // //     };

// // //     console.log("Enviando oferta:", nuevaOferta);

// // //     Ofertas.addOferta(
// // //       nuevaOferta,
// // //       (data, response) => {
// // //         hideLoading();
// // //         setGuardando(false);
// // //         showMessage("Oferta creada exitosamente");
// // //         setRefresh(!refresh);
// // //         limpiarFormulario();
// // //       },
// // //       (error) => {
// // //         hideLoading();
// // //         setGuardando(false);
// // //         console.error("Error al guardar oferta:", error);
// // //         const mensajeError =
// // //           error?.message ||
// // //           error?.descripcion ||
// // //           error?.response?.data?.message ||
// // //           "Error desconocido";
// // //         showMessage(`Error al guardar la oferta: ${mensajeError}`);
// // //       }
// // //     );
// // //   };

// // //   /**
// // //    * Limpia todos los campos del formulario de creación
// // //    */
// // //   const limpiarFormulario = () => {
// // //     setNombreOferta("");
// // //     setCantidadOferta(null);
// // //     setValorTotalOferta(null);
// // //     setDescuentoManual(0);
// // //     setDescuentoPorcentaje(0);
// // //     setTipoDescuento("$");
// // //     setDescuentoAplicado(0);
// // //     setStartDate(null);
// // //     setEndDate(null);
// // //     setStartTime(null);
// // //     setEndTime(null);
// // //     setProductoSeleccionado(null);
// // //     setTotalSinDescuento(0);
// // //     setTotalConDescuento(0);
// // //     setDiasSemana([true, true, true, true, true, true, true]);
// // //     setOfertaActiva(true);
// // //     setClearSearch((prev) => !prev);
// // //     setGuardando(false);
// // //   };

// // //   /**
// // //    * Abre el diálogo de edición con los datos de la oferta seleccionada
// // //    */
// // //   const handleEdit = (oferta) => {
// // //     setOfertaParaEditar(oferta);
// // //     setDialogEditarOpen(true);
// // //   };

// // //   /**
// // //    * Cierra el diálogo de edición
// // //    */
// // //   const handleCloseDialogEditar = () => {
// // //     setDialogEditarOpen(false);
// // //     setOfertaParaEditar(null);
// // //   };

// // //   /**
// // //    * Callback ejecutado cuando se actualiza una oferta exitosamente
// // //    */
// // //   const handleOfertaActualizada = () => {
// // //     setRefresh(!refresh);
// // //   };

// // //   /**
// // //    * Elimina una oferta (baja lógica)
// // //    */
// // //   const handleDelete = (oferta) => {
// // //     if (!oferta || !oferta.codigoOferta) {
// // //       showMessage("Error: No se pudo identificar la oferta a eliminar");
// // //       console.error("Oferta inválida:", oferta);
// // //       return;
// // //     }

// // //     const mensajeConfirmacion = `¿Está seguro de eliminar la oferta "${oferta.descripcion}"?\nCódigo: ${oferta.codigoOferta}`;

// // //     showConfirm(
// // //       mensajeConfirmacion,
// // //       () => {
// // //         showLoading();
// // //         Ofertas.deleteOferta(
// // //           oferta.codigoOferta,
// // //           (data, response) => {
// // //             hideLoading();
// // //             showMessage("Oferta eliminada exitosamente");
// // //             setRefresh(!refresh);
// // //           },
// // //           (error) => {
// // //             hideLoading();
// // //             console.error("Error al eliminar oferta:", error);
// // //             const mensajeError =
// // //               error?.message || error?.descripcion || "Error desconocido";
// // //             showMessage(`Error al eliminar la oferta: ${mensajeError}`);
// // //           }
// // //         );
// // //       },
// // //       () => {
// // //         console.log("Eliminación cancelada por el usuario");
// // //       }
// // //     );
// // //   };

// // //   // Formateo moneda simple (sin decimales)
// // //   const formatCLP = (n) => {
// // //     if (n == null || isNaN(n)) return "$0";
// // //     return `$${n.toLocaleString("es-CL")}`;
// // //   };

// // //   return (
// // //     <>
// // //       <DialogTitle>Descuentos Productos Agrupados</DialogTitle>
// // //       <DialogContent>
// // //         <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
// // //           {/* Formulario de creación */}
// // //           <TextField
// // //             label="Ingresa nombre Oferta"
// // //             type="text"
// // //             value={nombreOferta}
// // //             onChange={(e) => setNombreOferta(e.target.value)}
// // //             fullWidth
// // //           />

// // //           {/* Componente de búsqueda por niveles */}
// // //           <SearchByLevels
// // //             onProductoSeleccionado={handleProductoSeleccionado}
// // //             clearSearch={clearSearch}
// // //             refresh={refresh}
// // //           />

// // //           {/* Mostrar producto único seleccionado con selector de tipo de descuento */}
// // //           {productoSeleccionado && (
// // //             <Box
// // //               sx={{
// // //                 display: "flex",
// // //                 flexDirection: "column",
// // //                 gap: 2,
// // //                 p: 2,
// // //                 backgroundColor: "#f5f5f5",
// // //                 borderRadius: 1,
// // //               }}
// // //             >
// // //               <Typography variant="h6">Producto Seleccionado</Typography>

// // //               {/* Tabla de producto único */}
// // //               <TableContainer component={Paper} elevation={2}>
// // //                 <Table size="small">
// // //                   <TableHead>
// // //                     <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
// // //                       <TableCell>
// // //                         <strong>Código</strong>
// // //                       </TableCell>
// // //                       <TableCell>
// // //                         <strong>Descripción</strong>
// // //                       </TableCell>
// // //                       <TableCell align="center">
// // //                         <strong>Precio Individual</strong>
// // //                       </TableCell>
// // //                       <TableCell align="center">
// // //                         <strong>Acciones</strong>
// // //                       </TableCell>
// // //                     </TableRow>
// // //                   </TableHead>
// // //                   <TableBody>
// // //                     <TableRow hover>
// // //                       <TableCell>
// // //                         <Chip
// // //                           label={productoSeleccionado.codbarra}
// // //                           size="small"
// // //                           color="primary"
// // //                           variant="outlined"
// // //                         />
// // //                       </TableCell>
// // //                       <TableCell>
// // //                         <Typography variant="body2">
// // //                           {productoSeleccionado.descripcionProducto}
// // //                         </Typography>
// // //                       </TableCell>
// // //                       <TableCell align="center">
// // //                         <Typography variant="body2">
// // //                           {formatCLP(productoSeleccionado.precioVenta)}
// // //                         </Typography>
// // //                       </TableCell>
// // //                       <TableCell align="center">
// // //                         <IconButton
// // //                           size="small"
// // //                           color="error"
// // //                           onClick={handleEliminarProducto}
// // //                           title="Eliminar"
// // //                         >
// // //                           <DeleteIcon fontSize="small" />
// // //                         </IconButton>
// // //                       </TableCell>
// // //                     </TableRow>
// // //                   </TableBody>
// // //                 </Table>
// // //               </TableContainer>

// // //               {/* Campos de entrada para valores con selector de tipo de descuento */}
// // //               <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
// // //                 {/* Selector de tipo de descuento */}
// // //                 <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
// // //                   <Typography variant="body1" fontWeight="medium">
// // //                     Tipo de descuento:
// // //                   </Typography>
// // //                   <ToggleButtonGroup
// // //                     value={tipoDescuento}
// // //                     exclusive
// // //                     onChange={handleTipoDescuentoChange}
// // //                     aria-label="tipo de descuento"
// // //                     size="small"
// // //                   >
// // //                     <ToggleButton value="$" aria-label="pesos">
// // //                       <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
// // //                       Pesos
// // //                     </ToggleButton>
// // //                     <ToggleButton value="%" aria-label="porcentaje">
// // //                       <PercentIcon fontSize="small" sx={{ mr: 1 }} />
// // //                       Porcentaje
// // //                     </ToggleButton>
// // //                   </ToggleButtonGroup>
// // //                 </Box>

// // //                 {/* Campos de valores */}
// // //                 <Box sx={{ display: "flex", gap: 2 }}>
// // //                   <TextField
// // //                     label="Valor actual (Precio producto)"
// // //                     value={formatCLP(totalSinDescuento)}
// // //                     fullWidth
// // //                     helperText="Precio del producto"
// // //                     InputProps={{
// // //                       readOnly: true,
// // //                       startAdornment: (
// // //                         <InputAdornment position="start">$</InputAdornment>
// // //                       ),
// // //                     }}
// // //                   />

// // //                   {/* Campo de descuento dinámico según tipo seleccionado */}
// // //                   {tipoDescuento === "$" ? (
// // //                     <TextField
// // //                       label="Descuento aplicado *"
// // //                       type="text"
// // //                       value={descuentoManual || ""}
// // //                       onChange={(e) => handleDescuentoManualChange(e.target.value)}
// // //                       fullWidth
// // //                       helperText="Ingrese el descuento manual en pesos"
// // //                       error={descuentoManual > totalSinDescuento}
// // //                       InputProps={{
// // //                         startAdornment: (
// // //                           <InputAdornment position="start">$</InputAdornment>
// // //                         ),
// // //                       }}
// // //                     />
// // //                   ) : (
// // //                     <TextField
// // //                       label="Descuento aplicado *"
// // //                       type="text"
// // //                       value={descuentoPorcentaje || ""}
// // //                       onChange={(e) => handleDescuentoPorcentajeChange(e.target.value)}
// // //                       fullWidth
// // //                       helperText="Ingrese el descuento en porcentaje"
// // //                       error={descuentoPorcentaje > 100}
// // //                       InputProps={{
// // //                         startAdornment: (
// // //                           <InputAdornment position="start">%</InputAdornment>
// // //                         ),
// // //                       }}
// // //                     />
// // //                   )}

// // //                   <TextField
// // //                     label="Total nuevo"
// // //                     value={formatCLP(totalConDescuento)}
// // //                     fullWidth
// // //                     helperText="Valor final de la oferta"
// // //                     InputProps={{
// // //                       readOnly: true,
// // //                       startAdornment: (
// // //                         <InputAdornment position="start">$</InputAdornment>
// // //                       ),
// // //                     }}
// // //                   />
// // //                 </Box>

// // //                 {/* Información del descuento aplicado */}
// // //                 {descuentoAplicado > 0 && (
// // //                   <Box sx={{
// // //                     display: "flex",
// // //                     flexDirection: "column",
// // //                     gap: 1,
// // //                     p: 1.5,
// // //                     backgroundColor: tipoDescuento === "$" ? "#e8f5e9" : "#e3f2fd",
// // //                     borderRadius: 1,
// // //                     border: `1px solid ${tipoDescuento === "$" ? "#c8e6c9" : "#bbdefb"}`,
// // //                   }}>
// // //                     <Typography variant="body2" fontWeight="medium">
// // //                       Resumen del descuento:
// // //                     </Typography>
// // //                     <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
// // //                       <Typography variant="body2">
// // //                         {tipoDescuento === "$"
// // //                           ? `Descuento fijo: ${formatCLP(descuentoManual)}`
// // //                           : `Porcentaje aplicado: ${descuentoPorcentaje}%`
// // //                         }
// // //                       </Typography>
// // //                       <Typography variant="body2" color="primary" fontWeight="bold">
// // //                         Descuento total: {formatCLP(descuentoAplicado)}
// // //                       </Typography>
// // //                       {tipoDescuento === "%" && (
// // //                         <Typography variant="caption" color="text.secondary">
// // //                           ({formatCLP(descuentoAplicado)} de {formatCLP(totalSinDescuento)})
// // //                         </Typography>
// // //                       )}
// // //                     </Box>
// // //                   </Box>
// // //                 )}
// // //               </Box>
// // //             </Box>
// // //           )}

// // //           {/* Fechas y Horas */}
// // //           <Box sx={{ display: "flex", gap: 2 }}>
// // //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// // //               <DatePicker
// // //                 label="Fecha Inicio"
// // //                 value={startDate}
// // //                 onChange={setStartDate}
// // //                 format="DD/MM/YYYY"
// // //                 slotProps={{ textField: { fullWidth: true } }}
// // //               />
// // //             </LocalizationProvider>
// // //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// // //               <DatePicker
// // //                 label="Fecha Término"
// // //                 value={endDate}
// // //                 onChange={setEndDate}
// // //                 format="DD/MM/YYYY"
// // //                 slotProps={{ textField: { fullWidth: true } }}
// // //               />
// // //             </LocalizationProvider>
// // //           </Box>

// // //           <Box sx={{ display: "flex", gap: 2 }}>
// // //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// // //               <TimeField
// // //                 label="Hora de Inicio"
// // //                 format="HH:mm"
// // //                 value={startTime}
// // //                 onChange={setStartTime}
// // //                 slotProps={{ textField: { fullWidth: true } }}
// // //               />
// // //             </LocalizationProvider>
// // //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// // //               <TimeField
// // //                 label="Hora de Término"
// // //                 format="HH:mm"
// // //                 value={endTime}
// // //                 onChange={setEndTime}
// // //                 slotProps={{ textField: { fullWidth: true } }}
// // //               />
// // //             </LocalizationProvider>
// // //           </Box>

// // //           {/* Días de la semana */}
// // //           <Box
// // //             sx={{
// // //               p: 2,
// // //               border: "1px solid #e0e0e0",
// // //               borderRadius: 1,
// // //               backgroundColor: "#fafafa",
// // //             }}
// // //           >
// // //             <Box
// // //               sx={{
// // //                 display: "flex",
// // //                 justifyContent: "space-between",
// // //                 alignItems: "center",
// // //                 mb: 1,
// // //               }}
// // //             >
// // //               <Typography variant="subtitle1" fontWeight="bold">
// // //                 Días de la Semana
// // //               </Typography>
// // //               <Box sx={{ display: "flex", gap: 1 }}>
// // //                 <Button
// // //                   size="small"
// // //                   variant="outlined"
// // //                   onClick={() => handleTodosLosDias(true)}
// // //                 >
// // //                   Todos
// // //                 </Button>
// // //                 <Button
// // //                   size="small"
// // //                   variant="outlined"
// // //                   onClick={() => handleTodosLosDias(false)}
// // //                 >
// // //                   Ninguno
// // //                 </Button>
// // //               </Box>
// // //             </Box>
// // //             <FormGroup
// // //               row
// // //               sx={{ display: "flex", justifyContent: "space-between" }}
// // //             >
// // //               {nombresDias.map((dia, index) => (
// // //                 <FormControlLabel
// // //                   key={index}
// // //                   control={
// // //                     <Checkbox
// // //                       checked={diasSemana[index]}
// // //                       onChange={() => handleDiaChange(index)}
// // //                       color="primary"
// // //                     />
// // //                   }
// // //                   label={dia}
// // //                 />
// // //               ))}
// // //             </FormGroup>
// // //           </Box>

// // //           {/* Tabla de ofertas existentes */}
// // //           <Box sx={{ mb: 3 }}>
// // //             <Typography variant="h6" gutterBottom>
// // //               Todas las Ofertas
// // //             </Typography>

// // //             {loading ? (
// // //               <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
// // //                 <CircularProgress />
// // //               </Box>
// // //             ) : ofertasFiltradas.length > 0 ? (
// // //               <TableContainer component={Paper} elevation={2}>
// // //                 <Table size="small">
// // //                   <TableHead>
// // //                     <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
// // //                       <TableCell>
// // //                         <strong>Código oferta</strong>
// // //                       </TableCell>
// // //                       <TableCell>
// // //                         <strong>Descripción</strong>
// // //                       </TableCell>
// // //                       <TableCell>
// // //                         <strong>Productos</strong>
// // //                       </TableCell>
// // //                       <TableCell align="center">
// // //                         <strong>Cantidad</strong>
// // //                       </TableCell>
// // //                       <TableCell align="center">
// // //                         <strong>Valor oferta</strong>
// // //                       </TableCell>
// // //                       <TableCell align="center">
// // //                         <strong>Vigencia</strong>
// // //                       </TableCell>
// // //                       <TableCell align="center">
// // //                         <strong>Estado</strong>
// // //                       </TableCell>
// // //                       <TableCell align="center">
// // //                         <strong>Acciones</strong>
// // //                       </TableCell>
// // //                     </TableRow>
// // //                   </TableHead>
// // //                   <TableBody>
// // //                     {ofertasFiltradas.map((oferta, index) => (
// // //                       <TableRow
// // //                         key={oferta.codigoOferta || index}
// // //                         hover
// // //                         sx={{
// // //                           backgroundColor: oferta.bajaLogica
// // //                             ? "#ffebee"
// // //                             : "inherit",
// // //                           opacity: oferta.bajaLogica ? 0.6 : 1,
// // //                         }}
// // //                       >
// // //                         <TableCell>
// // //                           <Typography variant="body2" fontWeight="bold">
// // //                             {oferta.codigoOferta}
// // //                           </Typography>
// // //                         </TableCell>
// // //                         <TableCell>
// // //                           <Typography variant="body2">
// // //                             {oferta.descripcion}
// // //                           </Typography>
// // //                           {oferta.codigoTipo && (
// // //                             <Chip
// // //                               label={`Tipo ${oferta.codigoTipo}`}
// // //                               size="small"
// // //                               variant="outlined"
// // //                               sx={{ mt: 0.5 }}
// // //                             />
// // //                           )}
// // //                         </TableCell>
// // //                         <TableCell>
// // //                           {oferta.products && oferta.products.length > 0 ? (
// // //                             <Box
// // //                               sx={{
// // //                                 display: "flex",
// // //                                 flexDirection: "column",
// // //                                 gap: 0.5,
// // //                               }}
// // //                             >
// // //                               {oferta.products.map((prod, idx) => (
// // //                                 <Typography
// // //                                   key={idx}
// // //                                   variant="caption"
// // //                                   color="textSecondary"
// // //                                 >
// // //                                   {prod.descripcion}
// // //                                 </Typography>
// // //                               ))}
// // //                             </Box>
// // //                           ) : (
// // //                             <Chip
// // //                               label="Sin productos"
// // //                               size="small"
// // //                               color="default"
// // //                             />
// // //                           )}
// // //                         </TableCell>
// // //                         <TableCell align="center">
// // //                           {oferta.oferta_Regla && (
// // //                             <Typography
// // //                               variant="body2"
// // //                               color="secondary"
// // //                               fontWeight="bold"
// // //                             >
// // //                               {oferta.oferta_Regla.cantidad}
// // //                             </Typography>
// // //                           )}
// // //                         </TableCell>
// // //                         <TableCell align="center">
// // //                           {oferta.oferta_Regla && (
// // //                             <Typography
// // //                               variant="body2"
// // //                               color="secondary"
// // //                               fontWeight="bold"
// // //                             >
// // //                               ${oferta.oferta_Regla.valor}
// // //                             </Typography>
// // //                           )}
// // //                         </TableCell>
// // //                         <TableCell align="center">
// // //                           <Typography variant="caption" display="block">
// // //                             {new Date(oferta.fechaInicial).toLocaleDateString(
// // //                               "es-CL"
// // //                             )}
// // //                           </Typography>
// // //                           <Typography
// // //                             variant="caption"
// // //                             display="block"
// // //                             color="textSecondary"
// // //                           >
// // //                             hasta
// // //                           </Typography>
// // //                           <Typography variant="caption" display="block">
// // //                             {new Date(oferta.fechaFinal).toLocaleDateString(
// // //                               "es-CL"
// // //                             )}
// // //                           </Typography>
// // //                           {oferta.diasSemana &&
// // //                             oferta.diasSemana !== "1111111" && (
// // //                               <Chip
// // //                                 label="Días específicos"
// // //                                 size="small"
// // //                                 sx={{ mt: 0.5, fontSize: "0.7rem" }}
// // //                               />
// // //                             )}
// // //                         </TableCell>
// // //                         <TableCell align="center">
// // //                           <Box
// // //                             sx={{
// // //                               display: "flex",
// // //                               flexDirection: "column",
// // //                               gap: 0.5,
// // //                               alignItems: "center",
// // //                             }}
// // //                           >
// // //                             <Chip
// // //                               label={oferta.activo ? "Activa" : "Inactiva"}
// // //                               size="small"
// // //                               color={oferta.activo ? "success" : "default"}
// // //                             />
// // //                             {oferta.bajaLogica && (
// // //                               <Chip
// // //                                 label="Eliminada"
// // //                                 size="small"
// // //                                 color="error"
// // //                                 variant="outlined"
// // //                               />
// // //                             )}
// // //                           </Box>
// // //                         </TableCell>
// // //                         <TableCell align="center">
// // //                           <Box
// // //                             sx={{
// // //                               display: "flex",
// // //                               gap: 0.5,
// // //                               justifyContent: "center",
// // //                             }}
// // //                           >
// // //                             <IconButton
// // //                               size="small"
// // //                               color="primary"
// // //                               onClick={() => handleEdit(oferta)}
// // //                               title="Editar"
// // //                               disabled={oferta.bajaLogica}
// // //                             >
// // //                               <EditIcon fontSize="small" />
// // //                             </IconButton>
// // //                             {!oferta.bajaLogica && (
// // //                               <IconButton
// // //                                 size="small"
// // //                                 color="error"
// // //                                 onClick={() => handleDelete(oferta)}
// // //                                 title="Eliminar"
// // //                               >
// // //                                 <DeleteIcon fontSize="small" />
// // //                               </IconButton>
// // //                             )}
// // //                           </Box>
// // //                         </TableCell>
// // //                       </TableRow>
// // //                     ))}
// // //                   </TableBody>
// // //                 </Table>
// // //               </TableContainer>
// // //             ) : (
// // //               <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
// // //                 <Typography variant="body2" color="textSecondary">
// // //                   No hay ofertas registradas para el tipo {tipoOferta}
// // //                 </Typography>
// // //               </Paper>
// // //             )}
// // //           </Box>
// // //         </Box>
// // //       </DialogContent>
// // //       <DialogActions>
// // //         <Button onClick={onClose} disabled={guardando}>
// // //           Cancelar
// // //         </Button>
// // //         <Button
// // //           onClick={handleGuardar}
// // //           variant="contained"
// // //           disabled={!productoSeleccionado || guardando}
// // //         >
// // //           {guardando ? "Guardando..." : "Crear Oferta"}
// // //         </Button>
// // //       </DialogActions>

// // //       {/* Diálogo de edición */}
// // //       <DialogEditarDescuentoUnidadAgrupado
// // //         open={dialogEditarOpen}
// // //         onClose={handleCloseDialogEditar}
// // //         ofertaEditar={ofertaParaEditar}
// // //         onOfertaActualizada={handleOfertaActualizada}
// // //         clearSearch={clearSearch}
// // //       />
// // //     </>
// // //   );
// // // };

// // // export default DescuentosProductosAgrupados;
// // import React, { useState, useEffect, useContext, useCallback } from "react";
// // import {
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   TextField,
// //   Box,
// //   Typography,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   IconButton,
// //   Chip,
// //   CircularProgress,
// //   Checkbox,
// //   FormControlLabel,
// //   FormGroup,
// //   ToggleButton,
// //   ToggleButtonGroup,
// //   InputAdornment,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   Alert,
// // } from "@mui/material";
// // import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// // import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// // import { TimeField } from "@mui/x-date-pickers/TimeField";
// // import dayjs from "dayjs";
// // import Ofertas from "../../Models/Ofertas";
// // import EditIcon from "@mui/icons-material/Edit";
// // import DeleteIcon from "@mui/icons-material/Delete";
// // import SearchByLevels from "./SearchByLevels";
// // import DialogEditarDescuentoUnidadAgrupado from "./DialogEditarDescuentoUnidadAgrupado";
// // import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
// // import PercentIcon from "@mui/icons-material/Percent";
// // import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// // const DescuentosProductosAgrupados = ({ onClose, tipoOferta = 1 }) => {
// //   const { showLoading, hideLoading, showMessage, showConfirm } = useContext(
// //     SelectedOptionsContext
// //   );

// //   // Estados del formulario de creación
// //   const [refresh, setRefresh] = useState(false);
// //   const [nombreOferta, setNombreOferta] = useState("");
// //   const [startDate, setStartDate] = useState(null);
// //   const [endDate, setEndDate] = useState(null);
// //   const [startTime, setStartTime] = useState(null);
// //   const [endTime, setEndTime] = useState(null);
// //   const [diasSemana, setDiasSemana] = useState([
// //     true,
// //     true,
// //     true,
// //     true,
// //     true,
// //     true,
// //     true,
// //   ]);
// //   const [ofertaActiva, setOfertaActiva] = useState(true);
// //   const [clearSearch, setClearSearch] = useState(false);
// //   const [ofertasFiltradas, setOfertasFiltradas] = useState([]);
// //   const [guardando, setGuardando] = useState(false);

// //   // Estados para el tipo de descuento
// //   const [tipoDescuento, setTipoDescuento] = useState("$"); // '$' o '%'
// //   const [descuentoManual, setDescuentoManual] = useState(0);
// //   const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);

// //   // Estados para familia y subfamilia
// //   const [familias, setFamilias] = useState([]);
// //   const [subfamilias, setSubfamilias] = useState([]);
// //   const [familiaSeleccionada, setFamiliaSeleccionada] = useState("");
// //   const [subfamiliaSeleccionada, setSubfamiliaSeleccionada] = useState("");
// //   const [cargandoNiveles, setCargandoNiveles] = useState(false);
// //   const [aplicaAFamilia, setAplicaAFamilia] = useState(true); // true = familia, false = subfamilia específica

// //   // Estados calculados
// //   const [descuentoAplicado, setDescuentoAplicado] = useState(0);

// //   // Estados para la lista de ofertas
// //   const [ofertas, setOfertas] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);

// //   // Estados para el diálogo de edición
// //   const [dialogEditarOpen, setDialogEditarOpen] = useState(false);
// //   const [ofertaParaEditar, setOfertaParaEditar] = useState(null);

// //   const nombresDias = [
// //     "Lunes",
// //     "Martes",
// //     "Miércoles",
// //     "Jueves",
// //     "Viernes",
// //     "Sábado",
// //     "Domingo",
// //   ];

// //   // Cargar ofertas y familias al montar el componente
// //   useEffect(() => {
// //     loadOfertas();
// //     cargarFamilias();
// //   }, [refresh]);

// //   useEffect(() => {
// //     if (ofertas.length > 0) {
// //       const filtradas = ofertas.filter(
// //         (oferta) => oferta.codigoTipo === tipoOferta
// //       );
// //       setOfertasFiltradas(filtradas);
// //     } else {
// //       setOfertasFiltradas([]);
// //     }
// //   }, [ofertas, tipoOferta]);

// //   // Cargar subfamilias cuando se selecciona una familia
// //   useEffect(() => {
// //     if (familiaSeleccionada) {
// //       cargarSubfamilias(familiaSeleccionada);
// //     } else {
// //       setSubfamilias([]);
// //       setSubfamiliaSeleccionada("");
// //     }
// //   }, [familiaSeleccionada]);

// //   // Efecto de limpieza al desmontar
// //   useEffect(() => {
// //     return () => {
// //       setGuardando(false);
// //     };
// //   }, []);

// //   /**
// //    * Carga todas las ofertas desde el backend
// //    */
// //   const loadOfertas = () => {
// //     setLoading(true);
// //     console.log("Cargando ofertas...");

// //     Ofertas.getAllOfertas(
// //       (data, response) => {
// //         console.log("Ofertas cargadas:", data.length);
// //         setOfertas(data);
// //         setLoading(false);
// //       },
// //       (error) => {
// //         console.error("Error al cargar ofertas:", error);
// //         setLoading(false);
// //         showMessage("Error al cargar las ofertas");
// //       }
// //     );
// //   };

// //   /**
// //    * Carga las familias disponibles
// //    */
// //   const cargarFamilias = () => {
// //     setCargandoNiveles(true);
// //     // Suponiendo que tienes un método para obtener familias
// //     Ofertas.getFamilias(
// //       (data) => {
// //         setFamilias(data);
// //         setCargandoNiveles(false);
// //       },
// //       (error) => {
// //         console.error("Error al cargar familias:", error);
// //         setCargandoNiveles(false);
// //         showMessage("Error al cargar las familias");
// //       }
// //     );
// //   };

// //   /**
// //    * Carga las subfamilias de una familia específica
// //    */
// //   const cargarSubfamilias = (familiaId) => {
// //     setCargandoNiveles(true);
// //     // Suponiendo que tienes un método para obtener subfamilias
// //     Ofertas.getSubfamilias(
// //       familiaId,
// //       (data) => {
// //         setSubfamilias(data);
// //         setCargandoNiveles(false);
// //       },
// //       (error) => {
// //         console.error("Error al cargar subfamilias:", error);
// //         setCargandoNiveles(false);
// //         showMessage("Error al cargar las subfamilias");
// //       }
// //     );
// //   };

// //   /**
// //    * Convierte array de booleanos a string de días (ej: [true,false,...] -> "1011111")
// //    */
// //   const convertirDiasAString = (diasArray) => {
// //     return diasArray.map((dia) => (dia ? "1" : "0")).join("");
// //   };

// //   /**
// //    * Maneja el cambio de selección de un día específico
// //    */
// //   const handleDiaChange = (index) => {
// //     const nuevosDias = [...diasSemana];
// //     nuevosDias[index] = !nuevosDias[index];
// //     setDiasSemana(nuevosDias);
// //   };

// //   /**
// //    * Selecciona o deselecciona todos los días de la semana
// //    */
// //   const handleTodosLosDias = (seleccionar) => {
// //     setDiasSemana(new Array(7).fill(seleccionar));
// //   };

// //   /**
// //    * Maneja el cambio del tipo de descuento
// //    */
// //   const handleTipoDescuentoChange = (event, newTipo) => {
// //     if (newTipo !== null) {
// //       setTipoDescuento(newTipo);
// //       // Resetear valores al cambiar tipo
// //       setDescuentoManual(0);
// //       setDescuentoPorcentaje(0);
// //     }
// //   };

// //   /**
// //    * Maneja el cambio del descuento manual (monto fijo)
// //    */
// //   const handleDescuentoManualChange = (value) => {
// //     const numericValue = value.replace(/[^0-9]/g, "");

// //     if (numericValue === "" || numericValue === "0") {
// //       setDescuentoManual(0);
// //     } else {
// //       const descuento = parseInt(numericValue, 10);
// //       // Validar que el descuento no sea negativo
// //       if (descuento < 0) {
// //         showMessage("El descuento no puede ser negativo");
// //         setDescuentoManual(0);
// //       } else {
// //         setDescuentoManual(descuento);
// //       }
// //     }
// //   };

// //   /**
// //    * Maneja el cambio del descuento en porcentaje
// //    */
// //   const handleDescuentoPorcentajeChange = (value) => {
// //     const numericValue = value.replace(/[^0-9]/g, "");

// //     if (numericValue === "" || numericValue === "0") {
// //       setDescuentoPorcentaje(0);
// //     } else {
// //       let porcentaje = parseInt(numericValue, 10);
// //       // Validar que no sea mayor a 100%
// //       if (porcentaje > 100) {
// //         showMessage("El porcentaje no puede ser mayor a 100%");
// //         porcentaje = 100;
// //       } else if (porcentaje < 0) {
// //         showMessage("El porcentaje no puede ser negativo");
// //         porcentaje = 0;
// //       }
// //       setDescuentoPorcentaje(porcentaje);
// //     }
// //   };

// //   /**
// //    * Valida que todos los campos obligatorios estén completos
// //    */
// //   const validarFormulario = () => {
// //     if (!familiaSeleccionada) {
// //       showMessage("Debe seleccionar una familia");
// //       return false;
// //     }

// //     if (!aplicaAFamilia && !subfamiliaSeleccionada) {
// //       showMessage("Debe seleccionar una subfamilia");
// //       return false;
// //     }

// //     if (!nombreOferta.trim()) {
// //       showMessage("Debe ingresar un nombre para la oferta");
// //       return false;
// //     }

// //     if (!startDate || !endDate) {
// //       showMessage("Debe seleccionar las fechas de inicio y término");
// //       return false;
// //     }

// //     if (!startTime || !endTime) {
// //       showMessage("Debe seleccionar la hora de inicio y término");
// //       return false;
// //     }

// //     // Validar que fecha final no sea anterior a fecha inicial
// //     if (endDate.isBefore(startDate, 'day')) {
// //       showMessage("La fecha de término no puede ser anterior a la fecha de inicio");
// //       return false;
// //     }

// //     // Validar horas si están en el mismo día
// //     if (startDate.isSame(endDate, 'day')) {
// //       if (endTime.isBefore(startTime)) {
// //         showMessage("La hora de término no puede ser anterior a la hora de inicio");
// //         return false;
// //       }
// //     }

// //     // Validar descuento según tipo
// //     if (tipoDescuento === "$") {
// //       if (descuentoManual <= 0) {
// //         showMessage("El descuento debe ser mayor que 0");
// //         return false;
// //       }
// //     } else {
// //       if (descuentoPorcentaje <= 0 || descuentoPorcentaje > 100) {
// //         showMessage("El porcentaje debe estar entre 1 y 100");
// //         return false;
// //       }
// //     }

// //     return true;
// //   };

// //   /**
// //    * Obtiene el nombre de la familia seleccionada
// //    */
// //   const obtenerNombreFamilia = () => {
// //     const familia = familias.find(f => f.id === familiaSeleccionada);
// //     return familia ? familia.descripcion : "Familia no encontrada";
// //   };

// //   /**
// //    * Obtiene el nombre de la subfamilia seleccionada
// //    */
// //   const obtenerNombreSubfamilia = () => {
// //     const subfamilia = subfamilias.find(s => s.id === subfamiliaSeleccionada);
// //     return subfamilia ? subfamilia.descripcion : "Subfamilia no encontrada";
// //   };

// //   /**
// //    * Guarda una nueva oferta con familia/subfamilia
// //    */
// //   const handleGuardar = () => {
// //     if (guardando) return;

// //     if (!validarFormulario()) {
// //       return;
// //     }

// //     setGuardando(true);
// //     showLoading();

// //     // Preparar la lista de NMLs (Nivel-Marca-Línea)
// //     const listaNMLs = [{
// //       categoriaID: 0, // Si no aplica
// //       subCategoriaID: 0, // Si no aplica
// //       familiaID: parseInt(familiaSeleccionada),
// //       subFamiliaID: aplicaAFamilia ? 0 : parseInt(subfamiliaSeleccionada),
// //     }];

// //     // Construir el objeto de la oferta según el nuevo endpoint
// //     const nuevaOferta = {
// //       codigoTipo: tipoOferta,
// //       descripcion: nombreOferta.trim(),
// //       fechaInicial: startDate ? startDate.toISOString() : null,
// //       fechaFinal: endDate ? endDate.toISOString() : null,
// //       horaInicio: startTime ? startTime.format("HH:mm") : null,
// //       horaFin: endTime ? endTime.format("HH:mm") : null,
// //       diasSemana: convertirDiasAString(diasSemana),
// //       fAplicaMix: true,
// //       activo: ofertaActiva,
// //       oferta_Regla: {
// //         signo: "=",
// //         cantidad: 1,
// //         tipoDescuento: tipoDescuento,
// //         valor: tipoDescuento === "$" ? descuentoManual : descuentoPorcentaje,
// //         aplicacion: "Total",
// //       },
// //       oferta_ListaNMLs: listaNMLs,
// //     };

// //     console.log("Enviando oferta NML:", nuevaOferta);

// //     // Usar el nuevo endpoint para ofertas por familia/subfamilia
// //     Ofertas.addOfertaNML(
// //       nuevaOferta,
// //       (data, response) => {
// //         hideLoading();
// //         setGuardando(false);
// //         showMessage("Oferta creada exitosamente");
// //         setRefresh(!refresh);
// //         limpiarFormulario();
// //       },
// //       (error) => {
// //         hideLoading();
// //         setGuardando(false);
// //         console.error("Error al guardar oferta NML:", error);
// //         const mensajeError =
// //           error?.message ||
// //           error?.descripcion ||
// //           error?.response?.data?.message ||
// //           "Error desconocido";
// //         showMessage(`Error al guardar la oferta: ${mensajeError}`);
// //       }
// //     );
// //   };

// //   /**
// //    * Limpia todos los campos del formulario de creación
// //    */
// //   const limpiarFormulario = () => {
// //     setNombreOferta("");
// //     setFamiliaSeleccionada("");
// //     setSubfamiliaSeleccionada("");
// //     setDescuentoManual(0);
// //     setDescuentoPorcentaje(0);
// //     setTipoDescuento("$");
// //     setDescuentoAplicado(0);
// //     setStartDate(null);
// //     setEndDate(null);
// //     setStartTime(null);
// //     setEndTime(null);
// //     setDiasSemana([true, true, true, true, true, true, true]);
// //     setOfertaActiva(true);
// //     setAplicaAFamilia(true);
// //     setClearSearch((prev) => !prev);
// //     setGuardando(false);
// //   };

// //   /**
// //    * Abre el diálogo de edición con los datos de la oferta seleccionada
// //    */
// //   const handleEdit = (oferta) => {
// //     setOfertaParaEditar(oferta);
// //     setDialogEditarOpen(true);
// //   };

// //   /**
// //    * Cierra el diálogo de edición
// //    */
// //   const handleCloseDialogEditar = () => {
// //     setDialogEditarOpen(false);
// //     setOfertaParaEditar(null);
// //   };

// //   /**
// //    * Callback ejecutado cuando se actualiza una oferta exitosamente
// //    */
// //   const handleOfertaActualizada = () => {
// //     setRefresh(!refresh);
// //   };

// //   /**
// //    * Elimina una oferta (baja lógica)
// //    */
// //   const handleDelete = (oferta) => {
// //     if (!oferta || !oferta.codigoOferta) {
// //       showMessage("Error: No se pudo identificar la oferta a eliminar");
// //       console.error("Oferta inválida:", oferta);
// //       return;
// //     }

// //     const mensajeConfirmacion = `¿Está seguro de eliminar la oferta "${oferta.descripcion}"?\nCódigo: ${oferta.codigoOferta}`;

// //     showConfirm(
// //       mensajeConfirmacion,
// //       () => {
// //         showLoading();
// //         Ofertas.deleteOferta(
// //           oferta.codigoOferta,
// //           (data, response) => {
// //             hideLoading();
// //             showMessage("Oferta eliminada exitosamente");
// //             setRefresh(!refresh);
// //           },
// //           (error) => {
// //             hideLoading();
// //             console.error("Error al eliminar oferta:", error);
// //             const mensajeError =
// //               error?.message || error?.descripcion || "Error desconocido";
// //             showMessage(`Error al eliminar la oferta: ${mensajeError}`);
// //           }
// //         );
// //       },
// //       () => {
// //         console.log("Eliminación cancelada por el usuario");
// //       }
// //     );
// //   };

// //   // Formateo moneda simple (sin decimales)
// //   const formatCLP = (n) => {
// //     if (n == null || isNaN(n)) return "$0";
// //     return `$${n.toLocaleString("es-CL")}`;
// //   };

// //   return (
// //     <>
// //       <DialogTitle>Descuentos por Familia/Subfamilia</DialogTitle>
// //       <DialogContent>
// //         <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
// //           {/* Formulario de creación */}
// //           <TextField
// //             label="Ingresa nombre Oferta"
// //             type="text"
// //             value={nombreOferta}
// //             onChange={(e) => setNombreOferta(e.target.value)}
// //             fullWidth
// //           />

// //           {/* Selectores de Familia y Subfamilia */}
// //           <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
// //             <Typography variant="h6">Selección de Familia/Subfamilia</Typography>

// //             {/* Selector de Familia */}
// //             <FormControl fullWidth disabled={cargandoNiveles}>
// //               <InputLabel id="familia-label">Familia *</InputLabel>
// //               <Select
// //                 labelId="familia-label"
// //                 value={familiaSeleccionada}
// //                 label="Familia"
// //                 onChange={(e) => setFamiliaSeleccionada(e.target.value)}
// //               >
// //                 <MenuItem value="">
// //                   <em>Seleccione una familia</em>
// //                 </MenuItem>
// //                 {familias.map((familia) => (
// //                   <MenuItem key={familia.id} value={familia.id}>
// //                     {familia.descripcion || `Familia ${familia.id}`}
// //                   </MenuItem>
// //                 ))}
// //               </Select>
// //             </FormControl>

// //             {/* Selector de aplicación */}
// //             <FormControl fullWidth>
// //               <FormControlLabel
// //                 control={
// //                   <Checkbox
// //                     checked={aplicaAFamilia}
// //                     onChange={(e) => setAplicaAFamilia(e.target.checked)}
// //                     color="primary"
// //                   />
// //                 }
// //                 label="Aplicar a toda la familia"
// //               />
// //             </FormControl>

// //             {/* Selector de Subfamilia (solo si no aplica a toda la familia) */}
// //             {!aplicaAFamilia && (
// //               <FormControl fullWidth disabled={!familiaSeleccionada || cargandoNiveles}>
// //                 <InputLabel id="subfamilia-label">Subfamilia *</InputLabel>
// //                 <Select
// //                   labelId="subfamilia-label"
// //                   value={subfamiliaSeleccionada}
// //                   label="Subfamilia"
// //                   onChange={(e) => setSubfamiliaSeleccionada(e.target.value)}
// //                 >
// //                   <MenuItem value="">
// //                     <em>Seleccione una subfamilia</em>
// //                   </MenuItem>
// //                   {subfamilias.map((subfamilia) => (
// //                     <MenuItem key={subfamilia.id} value={subfamilia.id}>
// //                       {subfamilia.descripcion || `Subfamilia ${subfamilia.id}`}
// //                     </MenuItem>
// //                   ))}
// //                 </Select>
// //               </FormControl>
// //             )}

// //             {/* Información de selección */}
// //             {familiaSeleccionada && (
// //               <Alert
// //                 severity="info"
// //                 sx={{ mt: 1 }}
// //                 action={
// //                   <Button
// //                     size="small"
// //                     color="inherit"
// //                     onClick={() => {
// //                       setFamiliaSeleccionada("");
// //                       setSubfamiliaSeleccionada("");
// //                     }}
// //                   >
// //                     Limpiar
// //                   </Button>
// //                 }
// //               >
// //                 {aplicaAFamilia
// //                   ? `El descuento se aplicará a TODA la familia: ${obtenerNombreFamilia()}`
// //                   : `El descuento se aplicará a la subfamilia: ${obtenerNombreSubfamilia()} (Familia: ${obtenerNombreFamilia()})`
// //                 }
// //               </Alert>
// //             )}
// //           </Box>

// //           {/* Campos de descuento */}
// //           <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2, backgroundColor: "#f0f7ff", borderRadius: 1 }}>
// //             <Typography variant="h6">Configuración del Descuento</Typography>

// //             {/* Selector de tipo de descuento */}
// //             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
// //               <Typography variant="body1" fontWeight="medium">
// //                 Tipo de descuento:
// //               </Typography>
// //               <ToggleButtonGroup
// //                 value={tipoDescuento}
// //                 exclusive
// //                 onChange={handleTipoDescuentoChange}
// //                 aria-label="tipo de descuento"
// //                 size="small"
// //               >
// //                 <ToggleButton value="$" aria-label="pesos">
// //                   <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
// //                   Monto Fijo ($)
// //                 </ToggleButton>
// //                 <ToggleButton value="%" aria-label="porcentaje">
// //                   <PercentIcon fontSize="small" sx={{ mr: 1 }} />
// //                   Porcentaje (%)
// //                 </ToggleButton>
// //               </ToggleButtonGroup>
// //             </Box>

// //             {/* Campo de descuento dinámico según tipo seleccionado */}
// //             <Box sx={{ display: "flex", gap: 2 }}>
// //               {tipoDescuento === "$" ? (
// //                 <TextField
// //                   label="Descuento aplicado *"
// //                   type="text"
// //                   value={descuentoManual || ""}
// //                   onChange={(e) => handleDescuentoManualChange(e.target.value)}
// //                   fullWidth
// //                   helperText="Ingrese el descuento manual en pesos"
// //                   error={descuentoManual < 0}
// //                   InputProps={{
// //                     startAdornment: (
// //                       <InputAdornment position="start">$</InputAdornment>
// //                     ),
// //                   }}
// //                 />
// //               ) : (
// //                 <TextField
// //                   label="Descuento aplicado *"
// //                   type="text"
// //                   value={descuentoPorcentaje || ""}
// //                   onChange={(e) => handleDescuentoPorcentajeChange(e.target.value)}
// //                   fullWidth
// //                   helperText="Ingrese el descuento en porcentaje (0-100)"
// //                   error={descuentoPorcentaje < 0 || descuentoPorcentaje > 100}
// //                   InputProps={{
// //                     startAdornment: (
// //                       <InputAdornment position="start">%</InputAdornment>
// //                     ),
// //                   }}
// //                 />
// //               )}
// //             </Box>

// //             {/* Información del descuento */}
// //             <Alert severity="info">
// //               {tipoDescuento === "$"
// //                 ? `El descuento de ${formatCLP(descuentoManual)} se aplicará a cada producto ${aplicaAFamilia ? 'de la familia' : 'de la subfamilia'} seleccionada`
// //                 : `El descuento del ${descuentoPorcentaje}% se aplicará a cada producto ${aplicaAFamilia ? 'de la familia' : 'de la subfamilia'} seleccionada`
// //               }
// //             </Alert>
// //           </Box>

// //           {/* Fechas y Horas */}
// //           <Box sx={{ display: "flex", gap: 2 }}>
// //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// //               <DatePicker
// //                 label="Fecha Inicio"
// //                 value={startDate}
// //                 onChange={setStartDate}
// //                 format="DD/MM/YYYY"
// //                 slotProps={{ textField: { fullWidth: true } }}
// //               />
// //             </LocalizationProvider>
// //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// //               <DatePicker
// //                 label="Fecha Término"
// //                 value={endDate}
// //                 onChange={setEndDate}
// //                 format="DD/MM/YYYY"
// //                 slotProps={{ textField: { fullWidth: true } }}
// //               />
// //             </LocalizationProvider>
// //           </Box>

// //           <Box sx={{ display: "flex", gap: 2 }}>
// //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// //               <TimeField
// //                 label="Hora de Inicio"
// //                 format="HH:mm"
// //                 value={startTime}
// //                 onChange={setStartTime}
// //                 slotProps={{ textField: { fullWidth: true } }}
// //               />
// //             </LocalizationProvider>
// //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// //               <TimeField
// //                 label="Hora de Término"
// //                 format="HH:mm"
// //                 value={endTime}
// //                 onChange={setEndTime}
// //                 slotProps={{ textField: { fullWidth: true } }}
// //               />
// //             </LocalizationProvider>
// //           </Box>

// //           {/* Días de la semana */}
// //           <Box
// //             sx={{
// //               p: 2,
// //               border: "1px solid #e0e0e0",
// //               borderRadius: 1,
// //               backgroundColor: "#fafafa",
// //             }}
// //           >
// //             <Box
// //               sx={{
// //                 display: "flex",
// //                 justifyContent: "space-between",
// //                 alignItems: "center",
// //                 mb: 1,
// //               }}
// //             >
// //               <Typography variant="subtitle1" fontWeight="bold">
// //                 Días de la Semana
// //               </Typography>
// //               <Box sx={{ display: "flex", gap: 1 }}>
// //                 <Button
// //                   size="small"
// //                   variant="outlined"
// //                   onClick={() => handleTodosLosDias(true)}
// //                 >
// //                   Todos
// //                 </Button>
// //                 <Button
// //                   size="small"
// //                   variant="outlined"
// //                   onClick={() => handleTodosLosDias(false)}
// //                 >
// //                   Ninguno
// //                 </Button>
// //               </Box>
// //             </Box>
// //             <FormGroup
// //               row
// //               sx={{ display: "flex", justifyContent: "space-between" }}
// //             >
// //               {nombresDias.map((dia, index) => (
// //                 <FormControlLabel
// //                   key={index}
// //                   control={
// //                     <Checkbox
// //                       checked={diasSemana[index]}
// //                       onChange={() => handleDiaChange(index)}
// //                       color="primary"
// //                     />
// //                   }
// //                   label={dia}
// //                 />
// //               ))}
// //             </FormGroup>
// //           </Box>

// //           {/* Estado activo/inactivo */}
// //           <FormControlLabel
// //             control={
// //               <Checkbox
// //                 checked={ofertaActiva}
// //                 onChange={(e) => setOfertaActiva(e.target.checked)}
// //                 color="primary"
// //               />
// //             }
// //             label="Oferta activa"
// //           />

// //           {/* Tabla de ofertas existentes */}
// //           <Box sx={{ mb: 3 }}>
// //             <Typography variant="h6" gutterBottom>
// //               Todas las Ofertas
// //             </Typography>

// //             {loading ? (
// //               <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
// //                 <CircularProgress />
// //               </Box>
// //             ) : ofertasFiltradas.length > 0 ? (
// //               <TableContainer component={Paper} elevation={2}>
// //                 <Table size="small">
// //                   <TableHead>
// //                     <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
// //                       <TableCell>
// //                         <strong>Código oferta</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Descripción</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Familia/Subfamilia</strong>
// //                       </TableCell>
// //                       <TableCell align="center">
// //                         <strong>Tipo Descuento</strong>
// //                       </TableCell>
// //                       <TableCell align="center">
// //                         <strong>Valor</strong>
// //                       </TableCell>
// //                       <TableCell align="center">
// //                         <strong>Vigencia</strong>
// //                       </TableCell>
// //                       <TableCell align="center">
// //                         <strong>Estado</strong>
// //                       </TableCell>
// //                       <TableCell align="center">
// //                         <strong>Acciones</strong>
// //                       </TableCell>
// //                     </TableRow>
// //                   </TableHead>
// //                   <TableBody>
// //                     {ofertasFiltradas.map((oferta, index) => (
// //                       <TableRow
// //                         key={oferta.codigoOferta || index}
// //                         hover
// //                         sx={{
// //                           backgroundColor: oferta.bajaLogica
// //                             ? "#ffebee"
// //                             : "inherit",
// //                           opacity: oferta.bajaLogica ? 0.6 : 1,
// //                         }}
// //                       >
// //                         <TableCell>
// //                           <Typography variant="body2" fontWeight="bold">
// //                             {oferta.codigoOferta}
// //                           </Typography>
// //                         </TableCell>
// //                         <TableCell>
// //                           <Typography variant="body2">
// //                             {oferta.descripcion}
// //                           </Typography>
// //                           {oferta.codigoTipo && (
// //                             <Chip
// //                               label={`Tipo ${oferta.codigoTipo}`}
// //                               size="small"
// //                               variant="outlined"
// //                               sx={{ mt: 0.5 }}
// //                             />
// //                           )}
// //                         </TableCell>
// //                         <TableCell>
// //                           {oferta.oferta_ListaNMLs && oferta.oferta_ListaNMLs.length > 0 ? (
// //                             <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
// //                               {oferta.oferta_ListaNMLs.map((nml, idx) => (
// //                                 <Box key={idx}>
// //                                   <Typography variant="caption" display="block">
// //                                     Familia: {nml.familiaID}
// //                                   </Typography>
// //                                   {nml.subFamiliaID > 0 && (
// //                                     <Typography variant="caption" display="block" color="textSecondary">
// //                                       Subfamilia: {nml.subFamiliaID}
// //                                     </Typography>
// //                                   )}
// //                                 </Box>
// //                               ))}
// //                             </Box>
// //                           ) : (
// //                             <Chip label="N/A" size="small" color="default" />
// //                           )}
// //                         </TableCell>
// //                         <TableCell align="center">
// //                           {oferta.oferta_Regla && (
// //                             <Chip
// //                               label={oferta.oferta_Regla.tipoDescuento === "$" ? "Monto" : "Porcentaje"}
// //                               size="small"
// //                               color={oferta.oferta_Regla.tipoDescuento === "$" ? "primary" : "secondary"}
// //                             />
// //                           )}
// //                         </TableCell>
// //                         <TableCell align="center">
// //                           {oferta.oferta_Regla && (
// //                             <Typography variant="body2" fontWeight="bold">
// //                               {oferta.oferta_Regla.tipoDescuento === "$"
// //                                 ? formatCLP(oferta.oferta_Regla.valor)
// //                                 : `${oferta.oferta_Regla.valor}%`
// //                               }
// //                             </Typography>
// //                           )}
// //                         </TableCell>
// //                         <TableCell align="center">
// //                           <Typography variant="caption" display="block">
// //                             {new Date(oferta.fechaInicial).toLocaleDateString("es-CL")}
// //                           </Typography>
// //                           <Typography variant="caption" display="block" color="textSecondary">
// //                             hasta
// //                           </Typography>
// //                           <Typography variant="caption" display="block">
// //                             {new Date(oferta.fechaFinal).toLocaleDateString("es-CL")}
// //                           </Typography>
// //                           {oferta.diasSemana && oferta.diasSemana !== "1111111" && (
// //                             <Chip
// //                               label="Días específicos"
// //                               size="small"
// //                               sx={{ mt: 0.5, fontSize: "0.7rem" }}
// //                             />
// //                           )}
// //                         </TableCell>
// //                         <TableCell align="center">
// //                           <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, alignItems: "center" }}>
// //                             <Chip
// //                               label={oferta.activo ? "Activa" : "Inactiva"}
// //                               size="small"
// //                               color={oferta.activo ? "success" : "default"}
// //                             />
// //                             {oferta.bajaLogica && (
// //                               <Chip
// //                                 label="Eliminada"
// //                                 size="small"
// //                                 color="error"
// //                                 variant="outlined"
// //                               />
// //                             )}
// //                           </Box>
// //                         </TableCell>
// //                         <TableCell align="center">
// //                           <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
// //                             <IconButton
// //                               size="small"
// //                               color="primary"
// //                               onClick={() => handleEdit(oferta)}
// //                               title="Editar"
// //                               disabled={oferta.bajaLogica}
// //                             >
// //                               <EditIcon fontSize="small" />
// //                             </IconButton>
// //                             {!oferta.bajaLogica && (
// //                               <IconButton
// //                                 size="small"
// //                                 color="error"
// //                                 onClick={() => handleDelete(oferta)}
// //                                 title="Eliminar"
// //                               >
// //                                 <DeleteIcon fontSize="small" />
// //                               </IconButton>
// //                             )}
// //                           </Box>
// //                         </TableCell>
// //                       </TableRow>
// //                     ))}
// //                   </TableBody>
// //                 </Table>
// //               </TableContainer>
// //             ) : (
// //               <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
// //                 <Typography variant="body2" color="textSecondary">
// //                   No hay ofertas registradas para el tipo {tipoOferta}
// //                 </Typography>
// //               </Paper>
// //             )}
// //           </Box>
// //         </Box>
// //       </DialogContent>
// //       <DialogActions>
// //         <Button onClick={onClose} disabled={guardando}>
// //           Cancelar
// //         </Button>
// //         <Button
// //           onClick={handleGuardar}
// //           variant="contained"
// //           disabled={!familiaSeleccionada || guardando}
// //         >
// //           {guardando ? "Guardando..." : "Crear Oferta"}
// //         </Button>
// //       </DialogActions>

// //       {/* Diálogo de edición */}
// //       <DialogEditarDescuentoUnidadAgrupado
// //         open={dialogEditarOpen}
// //         onClose={handleCloseDialogEditar}
// //         ofertaEditar={ofertaParaEditar}
// //         onOfertaActualizada={handleOfertaActualizada}
// //         clearSearch={clearSearch}
// //       />
// //     </>
// //   );
// // };

// // export default DescuentosProductosAgrupados;
// import React, { useState, useEffect, useContext, useCallback } from "react";
// import {
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Chip,
//   CircularProgress,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
//   ToggleButton,
//   ToggleButtonGroup,
//   InputAdornment,
//   Grid,
//   Alert,
//   MenuItem,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { TimeField } from "@mui/x-date-pickers/TimeField";
// import dayjs from "dayjs";
// import Ofertas from "../../Models/Ofertas";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import DialogEditarDescuentoUnidadAgrupado from "./DialogEditarDescuentoUnidadAgrupado";
// import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
// import PercentIcon from "@mui/icons-material/Percent";
// import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import Product from "../../Models/Product";

// const DescuentosProductosAgrupados = ({ onClose, tipoOferta = 1 }) => {
//   const { showLoading, hideLoading, showMessage, showConfirm } = useContext(
//     SelectedOptionsContext
//   );

//   // Estados del formulario de creación
//   const [refresh, setRefresh] = useState(false);
//   const [nombreOferta, setNombreOferta] = useState("");
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [startTime, setStartTime] = useState(null);
//   const [endTime, setEndTime] = useState(null);
//   const [diasSemana, setDiasSemana] = useState([
//     true,
//     true,
//     true,
//     true,
//     true,
//     true,
//     true,
//   ]);
//   const [ofertaActiva, setOfertaActiva] = useState(true);
//   const [clearSearch, setClearSearch] = useState(false);
//   const [ofertasFiltradas, setOfertasFiltradas] = useState([]);
//   const [guardando, setGuardando] = useState(false);

//   // Estados para el tipo de descuento
//   const [tipoDescuento, setTipoDescuento] = useState("$"); // '$' o '%'
//   const [descuentoManual, setDescuentoManual] = useState(0);
//   const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);

//   // Estados para la selección jerárquica (NML)
//   const [categorias, setCategorias] = useState([]);
//   const [subcategorias, setSubcategorias] = useState([]);
//   const [familias, setFamilias] = useState([]);
//   const [subfamilias, setSubfamilias] = useState([]);
//   const [cargandoNiveles, setCargandoNiveles] = useState(false);

//   // IDs seleccionados
//   const [categoriaSeleccionadaId, setCategoriaSeleccionadaId] = useState(-1);
//   const [subcategoriaSeleccionadaId, setSubcategoriaSeleccionadaId] = useState(-1);
//   const [familiaSeleccionadaId, setFamiliaSeleccionadaId] = useState(-1);
//   const [subfamiliaSeleccionadaId, setSubfamiliaSeleccionadaId] = useState(-1);

//   // Estado para controlar hasta qué nivel se aplica el descuento
//   const [nivelAplicacion, setNivelAplicacion] = useState("familia"); // "categoria", "subcategoria", "familia", "subfamilia"

//   // Estados para la lista de ofertas
//   const [ofertas, setOfertas] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Estados para el diálogo de edición
//   const [dialogEditarOpen, setDialogEditarOpen] = useState(false);
//   const [ofertaParaEditar, setOfertaParaEditar] = useState(null);

//   const nombresDias = [
//     "Lunes",
//     "Martes",
//     "Miércoles",
//     "Jueves",
//     "Viernes",
//     "Sábado",
//     "Domingo",
//   ];

//   // Cargar ofertas y categorías al montar el componente
//   useEffect(() => {
//     loadOfertas();
//     cargarCategorias();
//   }, [refresh]);

//   useEffect(() => {
//     if (ofertas.length > 0) {
//       const filtradas = ofertas.filter(
//         (oferta) => oferta.codigoTipo === tipoOferta
//       );
//       setOfertasFiltradas(filtradas);
//     } else {
//       setOfertasFiltradas([]);
//     }
//   }, [ofertas, tipoOferta]);

//   // Cargar subcategorías cuando se selecciona una categoría
//   useEffect(() => {
//     if (categoriaSeleccionadaId !== -1) {
//       cargarSubcategorias(categoriaSeleccionadaId);
//       setSubcategoriaSeleccionadaId(-1);
//       setFamiliaSeleccionadaId(-1);
//       setSubfamiliaSeleccionadaId(-1);
//     } else {
//       setSubcategorias([]);
//       setSubcategoriaSeleccionadaId(-1);
//     }
//   }, [categoriaSeleccionadaId]);

//   // Cargar familias cuando se selecciona una subcategoría
//   useEffect(() => {
//     if (categoriaSeleccionadaId !== -1 && subcategoriaSeleccionadaId !== -1) {
//       cargarFamilias(categoriaSeleccionadaId, subcategoriaSeleccionadaId);
//       setFamiliaSeleccionadaId(-1);
//       setSubfamiliaSeleccionadaId(-1);
//     } else {
//       setFamilias([]);
//       setFamiliaSeleccionadaId(-1);
//     }
//   }, [categoriaSeleccionadaId, subcategoriaSeleccionadaId]);

//   // Cargar subfamilias cuando se selecciona una familia
//   useEffect(() => {
//     if (categoriaSeleccionadaId !== -1 && subcategoriaSeleccionadaId !== -1 && familiaSeleccionadaId !== -1) {
//       cargarSubfamilias(categoriaSeleccionadaId, subcategoriaSeleccionadaId, familiaSeleccionadaId);
//       setSubfamiliaSeleccionadaId(-1);
//     } else {
//       setSubfamilias([]);
//       setSubfamiliaSeleccionadaId(-1);
//     }
//   }, [categoriaSeleccionadaId, subcategoriaSeleccionadaId, familiaSeleccionadaId]);

//   // Determinar automáticamente el nivel de aplicación basado en la selección
//   useEffect(() => {
//     // Determinar el nivel más específico que ha sido seleccionado
//     if (subfamiliaSeleccionadaId !== -1) {
//       setNivelAplicacion("subfamilia");
//     } else if (familiaSeleccionadaId !== -1) {
//       setNivelAplicacion("familia");
//     } else if (subcategoriaSeleccionadaId !== -1) {
//       setNivelAplicacion("subcategoria");
//     } else if (categoriaSeleccionadaId !== -1) {
//       setNivelAplicacion("categoria");
//     } else {
//       setNivelAplicacion("familia"); // Por defecto
//     }
//   }, [categoriaSeleccionadaId, subcategoriaSeleccionadaId, familiaSeleccionadaId, subfamiliaSeleccionadaId]);

//   // Efecto de limpieza al desmontar
//   useEffect(() => {
//     return () => {
//       setGuardando(false);
//     };
//   }, []);

//   /**
//    * Carga todas las ofertas desde el backend
//    */
//   const loadOfertas = () => {
//     setLoading(true);
//     console.log("Cargando ofertas...");

//     Ofertas.getAllOfertas(
//       (data, response) => {
//         console.log("Ofertas cargadas:", data.length);
//         setOfertas(data);
//         setLoading(false);
//       },
//       (error) => {
//         console.error("Error al cargar ofertas:", error);
//         setLoading(false);
//         showMessage("Error al cargar las ofertas");
//       }
//     );
//   };

//   /**
//    * Carga las categorías disponibles
//    */
//   const cargarCategorias = () => {
//     setCargandoNiveles(true);
//     Product.getInstance().getCategories(
//       (data) => {
//         setCategorias(data);
//         setCargandoNiveles(false);
//       },
//       (error) => {
//         console.error("Error al cargar categorías:", error);
//         setCargandoNiveles(false);
//         showMessage("Error al cargar las categorías");
//       }
//     );
//   };

//   /**
//    * Carga las subcategorías de una categoría específica
//    */
//   const cargarSubcategorias = (categoriaId) => {
//     setCargandoNiveles(true);
//     Product.getInstance().getSubCategories(
//       categoriaId,
//       (data) => {
//         setSubcategorias(data);
//         setCargandoNiveles(false);
//       },
//       (error) => {
//         console.error("Error al cargar subcategorías:", error);
//         setCargandoNiveles(false);
//         showMessage("Error al cargar las subcategorías");
//       }
//     );
//   };

//   /**
//    * Carga las familias de una subcategoría específica
//    */
//   const cargarFamilias = (categoriaId, subcategoriaId) => {
//     setCargandoNiveles(true);
//     Product.getInstance().getFamiliaBySubCat(
//       { categoryId: categoriaId, subcategoryId: subcategoriaId },
//       (data) => {
//         setFamilias(data);
//         setCargandoNiveles(false);
//       },
//       (error) => {
//         console.error("Error al cargar familias:", error);
//         setCargandoNiveles(false);
//         showMessage("Error al cargar las familias");
//       }
//     );
//   };

//   /**
//    * Carga las subfamilias de una familia específica
//    */
//   const cargarSubfamilias = (categoriaId, subcategoriaId, familiaId) => {
//     setCargandoNiveles(true);
//     Product.getInstance().getSubFamilia(
//       { categoryId: categoriaId, subcategoryId: subcategoriaId, familyId: familiaId },
//       (data) => {
//         setSubfamilias(data);
//         setCargandoNiveles(false);
//       },
//       (error) => {
//         console.error("Error al cargar subfamilias:", error);
//         setCargandoNiveles(false);
//         showMessage("Error al cargar las subfamilias");
//       }
//     );
//   };

//   /**
//    * Convierte array de booleanos a string de días (ej: [true,false,...] -> "1011111")
//    */
//   const convertirDiasAString = (diasArray) => {
//     return diasArray.map((dia) => (dia ? "1" : "0")).join("");
//   };

//   /**
//    * Maneja el cambio de selección de un día específico
//    */
//   const handleDiaChange = (index) => {
//     const nuevosDias = [...diasSemana];
//     nuevosDias[index] = !nuevosDias[index];
//     setDiasSemana(nuevosDias);
//   };

//   /**
//    * Selecciona o deselecciona todos los días de la semana
//    */
//   const handleTodosLosDias = (seleccionar) => {
//     setDiasSemana(new Array(7).fill(seleccionar));
//   };

//   /**
//    * Maneja el cambio del tipo de descuento
//    */
//   const handleTipoDescuentoChange = (event, newTipo) => {
//     if (newTipo !== null) {
//       setTipoDescuento(newTipo);
//       // Resetear valores al cambiar tipo
//       setDescuentoManual(0);
//       setDescuentoPorcentaje(0);
//     }
//   };

//   /**
//    * Maneja el cambio del descuento manual (monto fijo)
//    */
//   const handleDescuentoManualChange = (value) => {
//     const numericValue = value.replace(/[^0-9]/g, "");

//     if (numericValue === "" || numericValue === "0") {
//       setDescuentoManual(0);
//     } else {
//       const descuento = parseInt(numericValue, 10);
//       // Validar que el descuento no sea negativo
//       if (descuento < 0) {
//         showMessage("El descuento no puede ser negativo");
//         setDescuentoManual(0);
//       } else {
//         setDescuentoManual(descuento);
//       }
//     }
//   };

//   /**
//    * Maneja el cambio del descuento en porcentaje
//    */
//   const handleDescuentoPorcentajeChange = (value) => {
//     const numericValue = value.replace(/[^0-9]/g, "");

//     if (numericValue === "" || numericValue === "0") {
//       setDescuentoPorcentaje(0);
//     } else {
//       let porcentaje = parseInt(numericValue, 10);
//       // Validar que no sea mayor a 100%
//       if (porcentaje > 100) {
//         showMessage("El porcentaje no puede ser mayor a 100%");
//         porcentaje = 100;
//       } else if (porcentaje < 0) {
//         showMessage("El porcentaje no puede ser negativo");
//         porcentaje = 0;
//       }
//       setDescuentoPorcentaje(porcentaje);
//     }
//   };

//   /**
//    * Obtiene el nombre de un nivel por su ID
//    */
//   const obtenerNombreNivel = (id, lista, campoDescripcion = "descripcion") => {
//     if (id === -1 || id === 0) return "No seleccionado";
//     const item = lista.find(item =>
//       item.id === id ||
//       item.idCategoria === id ||
//       item.idSubcategoria === id ||
//       item.idFamilia === id ||
//       item.idSubfamilia === id
//     );
//     return item ? item[campoDescripcion] : `ID ${id}`;
//   };

//   /**
//    * Construye el objeto NML según el nivel de aplicación seleccionado
//    */
//   const construirObjetoNML = () => {
//     const objetoBase = {
//       categoriaID: 0,
//       subCategoriaID: 0,
//       familiaID: 0,
//       subFamiliaID: 0,
//     };

//     // Verificar que tengamos al menos los niveles necesarios según el nivel de aplicación
//     switch (nivelAplicacion) {
//       case "categoria":
//         if (categoriaSeleccionadaId !== -1) {
//           objetoBase.categoriaID = categoriaSeleccionadaId;
//         }
//         break;

//       case "subcategoria":
//         if (categoriaSeleccionadaId !== -1 && subcategoriaSeleccionadaId !== -1) {
//           objetoBase.categoriaID = categoriaSeleccionadaId;
//           objetoBase.subCategoriaID = subcategoriaSeleccionadaId;
//         }
//         break;

//       case "familia":
//         if (categoriaSeleccionadaId !== -1 && subcategoriaSeleccionadaId !== -1 && familiaSeleccionadaId !== -1) {
//           objetoBase.categoriaID = categoriaSeleccionadaId;
//           objetoBase.subCategoriaID = subcategoriaSeleccionadaId;
//           objetoBase.familiaID = familiaSeleccionadaId;
//           // SubfamiliaID se mantiene en 0 para aplicar a toda la familia
//         }
//         break;

//       case "subfamilia":
//         if (categoriaSeleccionadaId !== -1 && subcategoriaSeleccionadaId !== -1 &&
//             familiaSeleccionadaId !== -1 && subfamiliaSeleccionadaId !== -1) {
//           objetoBase.categoriaID = categoriaSeleccionadaId;
//           objetoBase.subCategoriaID = subcategoriaSeleccionadaId;
//           objetoBase.familiaID = familiaSeleccionadaId;
//           objetoBase.subFamiliaID = subfamiliaSeleccionadaId; // ¡Esto es lo que estaba faltando!
//         } else {
//           console.warn("No se puede aplicar a subfamilia sin seleccionar todos los niveles anteriores");
//         }
//         break;
//     }

//     console.log("Objeto NML construído:", objetoBase);
//     return objetoBase;
//   };

//   /**
//    * Valida que todos los campos obligatorios estén completos
//    */
//   const validarFormulario = () => {
//     if (!nombreOferta.trim()) {
//       showMessage("Debe ingresar un nombre para la oferta");
//       return false;
//     }

//     // Validar selección según nivel de aplicación
//     switch (nivelAplicacion) {
//       case "categoria":
//         if (categoriaSeleccionadaId === -1) {
//           showMessage("Debe seleccionar una categoría");
//           return false;
//         }
//         break;

//       case "subcategoria":
//         if (categoriaSeleccionadaId === -1 || subcategoriaSeleccionadaId === -1) {
//           showMessage("Debe seleccionar una categoría y subcategoría");
//           return false;
//         }
//         break;

//       case "familia":
//         if (categoriaSeleccionadaId === -1 || subcategoriaSeleccionadaId === -1 || familiaSeleccionadaId === -1) {
//           showMessage("Debe seleccionar categoría, subcategoría y familia");
//           return false;
//         }
//         break;

//       case "subfamilia":
//         if (categoriaSeleccionadaId === -1 || subcategoriaSeleccionadaId === -1 ||
//             familiaSeleccionadaId === -1 || subfamiliaSeleccionadaId === -1) {
//           showMessage("Debe seleccionar categoría, subcategoría, familia y subfamilia");
//           return false;
//         }
//         break;

//       default:
//         showMessage("Debe seleccionar un nivel de aplicación");
//         return false;
//     }

//     if (!startDate || !endDate) {
//       showMessage("Debe seleccionar las fechas de inicio y término");
//       return false;
//     }

//     if (!startTime || !endTime) {
//       showMessage("Debe seleccionar la hora de inicio y término");
//       return false;
//     }

//     // Validar que fecha final no sea anterior a fecha inicial
//     if (endDate.isBefore(startDate, 'day')) {
//       showMessage("La fecha de término no puede ser anterior a la fecha de inicio");
//       return false;
//     }

//     // Validar horas si están en el mismo día
//     if (startDate.isSame(endDate, 'day')) {
//       if (endTime.isBefore(startTime)) {
//         showMessage("La hora de término no puede ser anterior a la hora de inicio");
//         return false;
//       }
//     }

//     // Validar descuento según tipo
//     if (tipoDescuento === "$") {
//       if (descuentoManual <= 0) {
//         showMessage("El descuento debe ser mayor que 0");
//         return false;
//       }
//     } else {
//       if (descuentoPorcentaje <= 0 || descuentoPorcentaje > 100) {
//         showMessage("El porcentaje debe estar entre 1 y 100");
//         return false;
//       }
//     }

//     return true;
//   };

//   /**
//    * Guarda una nueva oferta con NML
//    */
//   const handleGuardar = () => {
//     if (guardando) return;

//     if (!validarFormulario()) {
//       return;
//     }

//     setGuardando(true);
//     showLoading();

//     // Construir el objeto NML
//     const objetoNML = construirObjetoNML();

//     // Preparar la lista de NMLs
//     const listaNMLs = [objetoNML];

//     // Construir el objeto de la oferta según el nuevo endpoint
//     const nuevaOferta = {
//       codigoTipo: tipoOferta,
//       descripcion: nombreOferta.trim(),
//       fechaInicial: startDate ? startDate.toISOString() : null,
//       fechaFinal: endDate ? endDate.toISOString() : null,
//       horaInicio: startTime ? startTime.format("HH:mm") : null,
//       horaFin: endTime ? endTime.format("HH:mm") : null,
//       diasSemana: convertirDiasAString(diasSemana),
//       fAplicaMix: true,
//       activo: ofertaActiva,
//       oferta_Regla: {
//         signo: "=",
//         cantidad: 1,
//         tipoDescuento: tipoDescuento,
//         valor: tipoDescuento === "$" ? descuentoManual : descuentoPorcentaje,
//         aplicacion: "Total",
//       },
//       oferta_ListaNMLs: listaNMLs,
//     };

//     console.log("Enviando oferta NML completa:", nuevaOferta);

//     // Usar el nuevo endpoint para ofertas por NML
//     Ofertas.addOfertaNML(
//       nuevaOferta,
//       (data, response) => {
//         hideLoading();
//         setGuardando(false);
//         showMessage("Oferta creada exitosamente");
//         setRefresh(!refresh);
//         limpiarFormulario();
//       },
//       (error) => {
//         hideLoading();
//         setGuardando(false);
//         console.error("Error al guardar oferta NML:", error);
//         const mensajeError =
//           error?.message ||
//           error?.descripcion ||
//           error?.response?.data?.message ||
//           "Error desconocido";
//         showMessage(`Error al guardar la oferta: ${mensajeError}`);
//       }
//     );
//   };

//   /**
//    * Limpia todos los campos del formulario de creación
//    */
//   const limpiarFormulario = () => {
//     setNombreOferta("");
//     setCategoriaSeleccionadaId(-1);
//     setSubcategoriaSeleccionadaId(-1);
//     setFamiliaSeleccionadaId(-1);
//     setSubfamiliaSeleccionadaId(-1);
//     setDescuentoManual(0);
//     setDescuentoPorcentaje(0);
//     setTipoDescuento("$");
//     setNivelAplicacion("familia");
//     setStartDate(null);
//     setEndDate(null);
//     setStartTime(null);
//     setEndTime(null);
//     setDiasSemana([true, true, true, true, true, true, true]);
//     setOfertaActiva(true);
//     setClearSearch((prev) => !prev);
//     setGuardando(false);
//   };

//   /**
//    * Maneja el cambio manual del nivel de aplicación
//    */
//   const handleNivelAplicacionChange = (nuevoNivel) => {
//     setNivelAplicacion(nuevoNivel);

//     // Si el usuario selecciona un nivel más específico del que tiene seleccionado,
//     // mostrar advertencia
//     if (nuevoNivel === "subfamilia" && subfamiliaSeleccionadaId === -1) {
//       showMessage("Para aplicar a subfamilia, debe seleccionar primero una subfamilia");
//     } else if (nuevoNivel === "familia" && familiaSeleccionadaId === -1) {
//       showMessage("Para aplicar a familia, debe seleccionar primero una familia");
//     } else if (nuevoNivel === "subcategoria" && subcategoriaSeleccionadaId === -1) {
//       showMessage("Para aplicar a subcategoría, debe seleccionar primero una subcategoría");
//     } else if (nuevoNivel === "categoria" && categoriaSeleccionadaId === -1) {
//       showMessage("Para aplicar a categoría, debe seleccionar primero una categoría");
//     }
//   };

//   /**
//    * Abre el diálogo de edición con los datos de la oferta seleccionada
//    */
//   const handleEdit = (oferta) => {
//     setOfertaParaEditar(oferta);
//     setDialogEditarOpen(true);
//   };

//   /**
//    * Cierra el diálogo de edición
//    */
//   const handleCloseDialogEditar = () => {
//     setDialogEditarOpen(false);
//     setOfertaParaEditar(null);
//   };

//   /**
//    * Callback ejecutado cuando se actualiza una oferta exitosamente
//    */
//   const handleOfertaActualizada = () => {
//     setRefresh(!refresh);
//   };

//   /**
//    * Elimina una oferta (baja lógica)
//    */
//   const handleDelete = (oferta) => {
//     if (!oferta || !oferta.codigoOferta) {
//       showMessage("Error: No se pudo identificar la oferta a eliminar");
//       console.error("Oferta inválida:", oferta);
//       return;
//     }

//     const mensajeConfirmacion = `¿Está seguro de eliminar la oferta "${oferta.descripcion}"?\nCódigo: ${oferta.codigoOferta}`;

//     showConfirm(
//       mensajeConfirmacion,
//       () => {
//         showLoading();
//         Ofertas.deleteOferta(
//           oferta.codigoOferta,
//           (data, response) => {
//             hideLoading();
//             showMessage("Oferta eliminada exitosamente");
//             setRefresh(!refresh);
//           },
//           (error) => {
//             hideLoading();
//             console.error("Error al eliminar oferta:", error);
//             const mensajeError =
//               error?.message || error?.descripcion || "Error desconocido";
//             showMessage(`Error al eliminar la oferta: ${mensajeError}`);
//           }
//         );
//       },
//       () => {
//         console.log("Eliminación cancelada por el usuario");
//       }
//     );
//   };

//   // Formateo moneda simple (sin decimales)
//   const formatCLP = (n) => {
//     if (n == null || isNaN(n)) return "$0";
//     return `$${n.toLocaleString("es-CL")}`;
//   };

//   return (
//     <>
//       <DialogTitle>Descuentos por Nivel (NML)</DialogTitle>
//       <DialogContent>
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
//           {/* Formulario de creación */}
//           <TextField
//             label="Ingresa nombre Oferta"
//             type="text"
//             value={nombreOferta}
//             onChange={(e) => setNombreOferta(e.target.value)}
//             fullWidth
//           />

//           {/* Selectores jerárquicos NML */}
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
//             <Typography variant="h6">Selección Jerárquica (NML)</Typography>

//             <Grid container spacing={2}>
//               {/* Selector de Categoría */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   select
//                   label="Categoría *"
//                   value={categoriaSeleccionadaId}
//                   onChange={(e) => setCategoriaSeleccionadaId(Number(e.target.value))}
//                   fullWidth
//                   disabled={cargandoNiveles}
//                 >
//                   <MenuItem value={-1}>
//                     <em>Seleccione categoría</em>
//                   </MenuItem>
//                   {categorias.map((categoria) => (
//                     <MenuItem key={categoria.idCategoria} value={categoria.idCategoria}>
//                       {categoria.descripcion}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>

//               {/* Selector de Subcategoría */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   select
//                   label="Subcategoría"
//                   value={subcategoriaSeleccionadaId}
//                   onChange={(e) => setSubcategoriaSeleccionadaId(Number(e.target.value))}
//                   fullWidth
//                   disabled={!categoriaSeleccionadaId || categoriaSeleccionadaId === -1 || cargandoNiveles}
//                 >
//                   <MenuItem value={-1}>
//                     <em>Seleccione subcategoría</em>
//                   </MenuItem>
//                   {subcategorias.map((subcategoria) => (
//                     <MenuItem key={subcategoria.idSubcategoria} value={subcategoria.idSubcategoria}>
//                       {subcategoria.descripcion}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>

//               {/* Selector de Familia */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   select
//                   label="Familia"
//                   value={familiaSeleccionadaId}
//                   onChange={(e) => setFamiliaSeleccionadaId(Number(e.target.value))}
//                   fullWidth
//                   disabled={!subcategoriaSeleccionadaId || subcategoriaSeleccionadaId === -1 || cargandoNiveles}
//                 >
//                   <MenuItem value={-1}>
//                     <em>Seleccione familia</em>
//                   </MenuItem>
//                   {familias.map((familia) => (
//                     <MenuItem key={familia.idFamilia} value={familia.idFamilia}>
//                       {familia.descripcion}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>

//               {/* Selector de Subfamilia */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   select
//                   label="Subfamilia"
//                   value={subfamiliaSeleccionadaId}
//                   onChange={(e) => setSubfamiliaSeleccionadaId(Number(e.target.value))}
//                   fullWidth
//                   disabled={!familiaSeleccionadaId || familiaSeleccionadaId === -1 || cargandoNiveles}
//                 >
//                   <MenuItem value={-1}>
//                     <em>Seleccione subfamilia</em>
//                   </MenuItem>
//                   {subfamilias.map((subfamilia) => (
//                     <MenuItem key={subfamilia.idSubfamilia} value={subfamilia.idSubfamilia}>
//                       {subfamilia.descripcion}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
//             </Grid>

//             Selector de nivel de aplicación
//             {/* <Box sx={{ mt: 2 }}>
//               <Typography variant="subtitle2" gutterBottom>
//                 Nivel de aplicación del descuento:
//               </Typography>
//               <Box sx={{ display: "flex", gap: 1, flexWrap: 'wrap' }}>
//                 {["categoria", "subcategoria", "familia", "subfamilia"].map((nivel) => (
//                   <Chip
//                     key={nivel}
//                     label={nivel.charAt(0).toUpperCase() + nivel.slice(1)}
//                     color={nivelAplicacion === nivel ? "primary" : "default"}
//                     onClick={() => handleNivelAplicacionChange(nivel)}
//                     variant={nivelAplicacion === nivel ? "filled" : "outlined"}
//                     disabled={
//                       (nivel === "subfamilia" && subfamiliaSeleccionadaId === -1) ||
//                       (nivel === "familia" && familiaSeleccionadaId === -1) ||
//                       (nivel === "subcategoria" && subcategoriaSeleccionadaId === -1) ||
//                       (nivel === "categoria" && categoriaSeleccionadaId === -1)
//                     }
//                   />
//                 ))}
//               </Box>
//             </Box> */}

//             {/* Información de selección */}
//             {(categoriaSeleccionadaId !== -1 || subcategoriaSeleccionadaId !== -1 ||
//               familiaSeleccionadaId !== -1 || subfamiliaSeleccionadaId !== -1) && (
//               <Alert
//                 severity="info"
//                 sx={{ mt: 1 }}
//                 action={
//                   <Button
//                     size="small"
//                     color="inherit"
//                     onClick={() => {
//                       setCategoriaSeleccionadaId(-1);
//                       setSubcategoriaSeleccionadaId(-1);
//                       setFamiliaSeleccionadaId(-1);
//                       setSubfamiliaSeleccionadaId(-1);
//                     }}
//                   >
//                     Limpiar
//                   </Button>
//                 }
//               >
//                 <Typography variant="body2">
//                   <strong>Nivel de aplicación:</strong> {nivelAplicacion.charAt(0).toUpperCase() + nivelAplicacion.slice(1)}
//                 </Typography>
//                 {categoriaSeleccionadaId !== -1 && (
//                   <Typography variant="body2">
//                     <strong>Categoría:</strong> {obtenerNombreNivel(categoriaSeleccionadaId, categorias, "descripcion")}
//                   </Typography>
//                 )}
//                 {subcategoriaSeleccionadaId !== -1 && (
//                   <Typography variant="body2">
//                     <strong>Subcategoría:</strong> {obtenerNombreNivel(subcategoriaSeleccionadaId, subcategorias, "descripcion")}
//                   </Typography>
//                 )}
//                 {familiaSeleccionadaId !== -1 && (
//                   <Typography variant="body2">
//                     <strong>Familia:</strong> {obtenerNombreNivel(familiaSeleccionadaId, familias, "descripcion")}
//                   </Typography>
//                 )}
//                 {subfamiliaSeleccionadaId !== -1 && (
//                   <Typography variant="body2">
//                     <strong>Subfamilia:</strong> {obtenerNombreNivel(subfamiliaSeleccionadaId, subfamilias, "descripcion")}
//                   </Typography>
//                 )}
//                 {subfamiliaSeleccionadaId !== -1 && nivelAplicacion === "familia" && (
//                   <Typography variant="caption" color="warning.main" display="block">
//                     Nota: Aunque seleccionó una subfamilia, el descuento se aplicará a TODA la familia.
//                     Para aplicar solo a esta subfamilia, cambie el nivel de aplicación a "Subfamilia".
//                   </Typography>
//                 )}
//               </Alert>
//             )}
//           </Box>

//           {/* Campos de descuento */}
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2, backgroundColor: "#f0f7ff", borderRadius: 1 }}>
//             <Typography variant="h6">Configuración del Descuento</Typography>

//             {/* Selector de tipo de descuento */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <Typography variant="body1" fontWeight="medium">
//                 Tipo de descuento:
//               </Typography>
//               <ToggleButtonGroup
//                 value={tipoDescuento}
//                 exclusive
//                 onChange={handleTipoDescuentoChange}
//                 aria-label="tipo de descuento"
//                 size="small"
//               >
//                 <ToggleButton value="$" aria-label="pesos">
//                   <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
//                   Monto Fijo ($)
//                 </ToggleButton>
//                 <ToggleButton value="%" aria-label="porcentaje">
//                   <PercentIcon fontSize="small" sx={{ mr: 1 }} />
//                   Porcentaje (%)
//                 </ToggleButton>
//               </ToggleButtonGroup>
//             </Box>

//             {/* Campo de descuento dinámico según tipo seleccionado */}
//             <Box sx={{ display: "flex", gap: 2 }}>
//               {tipoDescuento === "$" ? (
//                 <TextField
//                   label="Descuento aplicado *"
//                   type="text"
//                   value={descuentoManual || ""}
//                   onChange={(e) => handleDescuentoManualChange(e.target.value)}
//                   fullWidth
//                   helperText="Ingrese el descuento manual en pesos"
//                   error={descuentoManual < 0}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">$</InputAdornment>
//                     ),
//                   }}
//                 />
//               ) : (
//                 <TextField
//                   label="Descuento aplicado *"
//                   type="text"
//                   value={descuentoPorcentaje || ""}
//                   onChange={(e) => handleDescuentoPorcentajeChange(e.target.value)}
//                   fullWidth
//                   helperText="Ingrese el descuento en porcentaje (0-100)"
//                   error={descuentoPorcentaje < 0 || descuentoPorcentaje > 100}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">%</InputAdornment>
//                     ),
//                   }}
//                 />
//               )}
//             </Box>

//             {/* Información del descuento
//             <Alert severity="info">
//               {tipoDescuento === "$"
//                 ? `El descuento de ${formatCLP(descuentoManual)} se aplicará a cada producto del nivel "${nivelAplicacion}" seleccionado`
//                 : `El descuento del ${descuentoPorcentaje}% se aplicará a cada producto del nivel "${nivelAplicacion}" seleccionado`
//               }
//             </Alert> */}
//           </Box>

//           {/* Fechas y Horas */}
//           <Box sx={{ display: "flex", gap: 2 }}>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DatePicker
//                 label="Fecha Inicio"
//                 value={startDate}
//                 onChange={setStartDate}
//                 format="DD/MM/YYYY"
//                 slotProps={{ textField: { fullWidth: true } }}
//               />
//             </LocalizationProvider>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DatePicker
//                 label="Fecha Término"
//                 value={endDate}
//                 onChange={setEndDate}
//                 format="DD/MM/YYYY"
//                 slotProps={{ textField: { fullWidth: true } }}
//               />
//             </LocalizationProvider>
//           </Box>

//           <Box sx={{ display: "flex", gap: 2 }}>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <TimeField
//                 label="Hora de Inicio"
//                 format="HH:mm"
//                 value={startTime}
//                 onChange={setStartTime}
//                 slotProps={{ textField: { fullWidth: true } }}
//               />
//             </LocalizationProvider>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <TimeField
//                 label="Hora de Término"
//                 format="HH:mm"
//                 value={endTime}
//                 onChange={setEndTime}
//                 slotProps={{ textField: { fullWidth: true } }}
//               />
//             </LocalizationProvider>
//           </Box>

//           {/* Días de la semana */}
//           <Box
//             sx={{
//               p: 2,
//               border: "1px solid #e0e0e0",
//               borderRadius: 1,
//               backgroundColor: "#fafafa",
//             }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 mb: 1,
//               }}
//             >
//               <Typography variant="subtitle1" fontWeight="bold">
//                 Días de la Semana
//               </Typography>
//               <Box sx={{ display: "flex", gap: 1 }}>
//                 <Button
//                   size="small"
//                   variant="outlined"
//                   onClick={() => handleTodosLosDias(true)}
//                 >
//                   Todos
//                 </Button>
//                 <Button
//                   size="small"
//                   variant="outlined"
//                   onClick={() => handleTodosLosDias(false)}
//                 >
//                   Ninguno
//                 </Button>
//               </Box>
//             </Box>
//             <FormGroup
//               row
//               sx={{ display: "flex", justifyContent: "space-between" }}
//             >
//               {nombresDias.map((dia, index) => (
//                 <FormControlLabel
//                   key={index}
//                   control={
//                     <Checkbox
//                       checked={diasSemana[index]}
//                       onChange={() => handleDiaChange(index)}
//                       color="primary"
//                     />
//                   }
//                   label={dia}
//                 />
//               ))}
//             </FormGroup>
//           </Box>

//           {/* Estado activo/inactivo */}
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={ofertaActiva}
//                 onChange={(e) => setOfertaActiva(e.target.checked)}
//                 color="primary"
//               />
//             }
//             label="Oferta activa"
//           />

//           {/* Tabla de ofertas existentes */}
//           <Box sx={{ mb: 3 }}>
//             <Typography variant="h6" gutterBottom>
//               Todas las Ofertas
//             </Typography>

//             {loading ? (
//               <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
//                 <CircularProgress />
//               </Box>
//             ) : ofertasFiltradas.length > 0 ? (
//               <TableContainer component={Paper} elevation={2}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//                       <TableCell>
//                         <strong>Código oferta</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Descripción</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>NML Aplicado</strong>
//                       </TableCell>
//                       <TableCell align="center">
//                         <strong>Tipo Descuento</strong>
//                       </TableCell>
//                       <TableCell align="center">
//                         <strong>Valor</strong>
//                       </TableCell>
//                       <TableCell align="center">
//                         <strong>Vigencia</strong>
//                       </TableCell>
//                       <TableCell align="center">
//                         <strong>Estado</strong>
//                       </TableCell>
//                       <TableCell align="center">
//                         <strong>Acciones</strong>
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {ofertasFiltradas.map((oferta, index) => (
//                       <TableRow
//                         key={oferta.codigoOferta || index}
//                         hover
//                         sx={{
//                           backgroundColor: oferta.bajaLogica
//                             ? "#ffebee"
//                             : "inherit",
//                           opacity: oferta.bajaLogica ? 0.6 : 1,
//                         }}
//                       >
//                         <TableCell>
//                           <Typography variant="body2" fontWeight="bold">
//                             {oferta.codigoOferta}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Typography variant="body2">
//                             {oferta.descripcion}
//                           </Typography>
//                           {oferta.codigoTipo && (
//                             <Chip
//                               label={`Tipo ${oferta.codigoTipo}`}
//                               size="small"
//                               variant="outlined"
//                               sx={{ mt: 0.5 }}
//                             />
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           {oferta.oferta_ListaNMLs && oferta.oferta_ListaNMLs.length > 0 ? (
//                             <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
//                               {oferta.oferta_ListaNMLs.map((nml, idx) => (
//                                 <Box key={idx}>
//                                   {nml.categoriaID > 0 && (
//                                     <Typography variant="caption" display="block">
//                                       Categoría: {nml.categoriaID}
//                                     </Typography>
//                                   )}
//                                   {nml.subCategoriaID > 0 && (
//                                     <Typography variant="caption" display="block">
//                                       Subcategoría: {nml.subCategoriaID}
//                                     </Typography>
//                                   )}
//                                   {nml.familiaID > 0 && (
//                                     <Typography variant="caption" display="block">
//                                       Familia: {nml.familiaID}
//                                     </Typography>
//                                   )}
//                                   {nml.subFamiliaID > 0 && (
//                                     <Typography variant="caption" display="block" color="success.main">
//                                       Subfamilia: {nml.subFamiliaID}
//                                     </Typography>
//                                   )}
//                                 </Box>
//                               ))}
//                             </Box>
//                           ) : (
//                             <Chip label="N/A" size="small" color="default" />
//                           )}
//                         </TableCell>
//                         <TableCell align="center">
//                           {oferta.oferta_Regla && (
//                             <Chip
//                               label={oferta.oferta_Regla.tipoDescuento === "$" ? "Monto" : "Porcentaje"}
//                               size="small"
//                               color={oferta.oferta_Regla.tipoDescuento === "$" ? "primary" : "secondary"}
//                             />
//                           )}
//                         </TableCell>
//                         <TableCell align="center">
//                           {oferta.oferta_Regla && (
//                             <Typography variant="body2" fontWeight="bold">
//                               {oferta.oferta_Regla.tipoDescuento === "$"
//                                 ? formatCLP(oferta.oferta_Regla.valor)
//                                 : `${oferta.oferta_Regla.valor}%`
//                               }
//                             </Typography>
//                           )}
//                         </TableCell>
//                         <TableCell align="center">
//                           <Typography variant="caption" display="block">
//                             {new Date(oferta.fechaInicial).toLocaleDateString("es-CL")}
//                           </Typography>
//                           <Typography variant="caption" display="block" color="textSecondary">
//                             hasta
//                           </Typography>
//                           <Typography variant="caption" display="block">
//                             {new Date(oferta.fechaFinal).toLocaleDateString("es-CL")}
//                           </Typography>
//                           {oferta.diasSemana && oferta.diasSemana !== "1111111" && (
//                             <Chip
//                               label="Días específicos"
//                               size="small"
//                               sx={{ mt: 0.5, fontSize: "0.7rem" }}
//                             />
//                           )}
//                         </TableCell>
//                         <TableCell align="center">
//                           <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, alignItems: "center" }}>
//                             <Chip
//                               label={oferta.activo ? "Activa" : "Inactiva"}
//                               size="small"
//                               color={oferta.activo ? "success" : "default"}
//                             />
//                             {oferta.bajaLogica && (
//                               <Chip
//                                 label="Eliminada"
//                                 size="small"
//                                 color="error"
//                                 variant="outlined"
//                               />
//                             )}
//                           </Box>
//                         </TableCell>
//                         <TableCell align="center">
//                           <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
//                             <IconButton
//                               size="small"
//                               color="primary"
//                               onClick={() => handleEdit(oferta)}
//                               title="Editar"
//                               disabled={oferta.bajaLogica}
//                             >
//                               <EditIcon fontSize="small" />
//                             </IconButton>
//                             {!oferta.bajaLogica && (
//                               <IconButton
//                                 size="small"
//                                 color="error"
//                                 onClick={() => handleDelete(oferta)}
//                                 title="Eliminar"
//                               >
//                                 <DeleteIcon fontSize="small" />
//                               </IconButton>
//                             )}
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             ) : (
//               <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
//                 <Typography variant="body2" color="textSecondary">
//                   No hay ofertas registradas para el tipo {tipoOferta}
//                 </Typography>
//               </Paper>
//             )}
//           </Box>
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} disabled={guardando}>
//           Cancelar
//         </Button>
//         <Button
//           onClick={handleGuardar}
//           variant="contained"
//           disabled={guardando || categoriaSeleccionadaId === -1}
//         >
//           {guardando ? "Guardando..." : "Crear Oferta"}
//         </Button>
//       </DialogActions>

//       {/* Diálogo de edición */}
//       <DialogEditarDescuentoUnidadAgrupado
//         open={dialogEditarOpen}
//         onClose={handleCloseDialogEditar}
//         ofertaEditar={ofertaParaEditar}
//         onOfertaActualizada={handleOfertaActualizada}
//         clearSearch={clearSearch}
//       />
//     </>
//   );
// };

// export default DescuentosProductosAgrupados;
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
  Checkbox,
  FormControlLabel,
  FormGroup,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  Grid,
  Alert,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import Ofertas from "../../Models/Ofertas";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogEditarDescuentoUnidadAgrupado from "./DialogEditarDescuentoUnidadAgrupado";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import PercentIcon from "@mui/icons-material/Percent";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Product from "../../Models/Product";
import DialogEditarDescuentoProductosAgrupados from "./DialogEditarDescuentoProductosAgrupados";

const DescuentosProductosAgrupados = ({ onClose, tipoOferta = 1 }) => {
  const { showLoading, hideLoading, showMessage, showConfirm } = useContext(
    SelectedOptionsContext
  );

  // Estados del formulario de creación
  const [refresh, setRefresh] = useState(false);
  const [nombreOferta, setNombreOferta] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [diasSemana, setDiasSemana] = useState([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
  const [ofertaActiva, setOfertaActiva] = useState(true);
  const [clearSearch, setClearSearch] = useState(false);
  const [ofertasFiltradas, setOfertasFiltradas] = useState([]);
  const [guardando, setGuardando] = useState(false);

  // Estados para el tipo de descuento
  const [tipoDescuento, setTipoDescuento] = useState("$"); // '$' o '%'
  const [descuentoManual, setDescuentoManual] = useState(0);
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);

  // Estados para la selección jerárquica (NML)
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [subfamilias, setSubfamilias] = useState([]);
  const [cargandoNiveles, setCargandoNiveles] = useState(false);

  // IDs seleccionados
  const [categoriaSeleccionadaId, setCategoriaSeleccionadaId] = useState(-1);
  const [subcategoriaSeleccionadaId, setSubcategoriaSeleccionadaId] =
    useState(-1);
  const [familiaSeleccionadaId, setFamiliaSeleccionadaId] = useState(-1);
  const [subfamiliaSeleccionadaId, setSubfamiliaSeleccionadaId] = useState(-1);

  // Estado para controlar hasta qué nivel se aplica el descuento
  const [nivelAplicacion, setNivelAplicacion] = useState("familia"); // "categoria", "subcategoria", "familia", "subfamilia"

  // Estados para la lista de ofertas
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para el diálogo de edición
  const [dialogEditarOpen, setDialogEditarOpen] = useState(false);
  const [ofertaParaEditar, setOfertaParaEditar] = useState(null);

  const nombresDias = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  // Cargar ofertas y categorías al montar el componente
  useEffect(() => {
    loadOfertas();
    cargarCategorias();
  }, [refresh]);

  useEffect(() => {
    if (ofertas.length > 0) {
      const filtradas = ofertas.filter(
        (oferta) => oferta.codigoTipo === tipoOferta
      );
      setOfertasFiltradas(filtradas);
    } else {
      setOfertasFiltradas([]);
    }
  }, [ofertas, tipoOferta]);

  // Cargar subcategorías cuando se selecciona una categoría
  useEffect(() => {
    if (categoriaSeleccionadaId !== -1) {
      cargarSubcategorias(categoriaSeleccionadaId);
      setSubcategoriaSeleccionadaId(-1);
      setFamiliaSeleccionadaId(-1);
      setSubfamiliaSeleccionadaId(-1);
      setSubfamilias([]);
    } else {
      setSubcategorias([]);
      setSubcategoriaSeleccionadaId(-1);
      setSubfamilias([]);
    }
  }, [categoriaSeleccionadaId]);

  // Cargar familias cuando se selecciona una subcategoría
  useEffect(() => {
    if (categoriaSeleccionadaId !== -1 && subcategoriaSeleccionadaId !== -1) {
      cargarFamilias(categoriaSeleccionadaId, subcategoriaSeleccionadaId);
      setFamiliaSeleccionadaId(-1);
      setSubfamiliaSeleccionadaId(-1);
      setSubfamilias([]);
    } else {
      setFamilias([]);
      setFamiliaSeleccionadaId(-1);
      setSubfamilias([]);
    }
  }, [categoriaSeleccionadaId, subcategoriaSeleccionadaId]);

  // Cargar subfamilias cuando se selecciona una familia
  useEffect(() => {
    if (
      categoriaSeleccionadaId !== -1 &&
      subcategoriaSeleccionadaId !== -1 &&
      familiaSeleccionadaId !== -1
    ) {
      cargarSubfamilias(
        categoriaSeleccionadaId,
        subcategoriaSeleccionadaId,
        familiaSeleccionadaId
      );
      setSubfamiliaSeleccionadaId(-1);
    } else {
      setSubfamilias([]);
      setSubfamiliaSeleccionadaId(-1);
    }
  }, [
    categoriaSeleccionadaId,
    subcategoriaSeleccionadaId,
    familiaSeleccionadaId,
  ]);

  // Determinar automáticamente el nivel de aplicación basado en la selección
  useEffect(() => {
    // Determinar el nivel más específico que ha sido seleccionado
    if (subfamiliaSeleccionadaId !== -1) {
      setNivelAplicacion("subfamilia");
    } else if (familiaSeleccionadaId !== -1) {
      setNivelAplicacion("familia");
    } else if (subcategoriaSeleccionadaId !== -1) {
      setNivelAplicacion("subcategoria");
    } else if (categoriaSeleccionadaId !== -1) {
      setNivelAplicacion("categoria");
    } else {
      setNivelAplicacion("familia"); // Por defecto
    }
  }, [
    categoriaSeleccionadaId,
    subcategoriaSeleccionadaId,
    familiaSeleccionadaId,
    subfamiliaSeleccionadaId,
  ]);

  // Efecto de limpieza al desmontar
  useEffect(() => {
    return () => {
      setGuardando(false);
    };
  }, []);

  /**
   * Carga todas las ofertas desde el backend
   */
  const loadOfertas = () => {
    setLoading(true);
    console.log("Cargando ofertas...");

    Ofertas.getAllOfertas(
      (data, response) => {
        console.log("Ofertas cargadas:", data.length);
        setOfertas(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error al cargar ofertas:", error);
        setLoading(false);
        showMessage("Error al cargar las ofertas");
      }
    );
  };

  /**
   * Carga las categorías disponibles
   */
  const cargarCategorias = () => {
    setCargandoNiveles(true);
    Product.getInstance().getCategories(
      (data) => {
        setCategorias(data);
        setCargandoNiveles(false);
      },
      (error) => {
        console.error("Error al cargar categorías:", error);
        setCargandoNiveles(false);
        showMessage("Error al cargar las categorías");
      }
    );
  };

  /**
   * Carga las subcategorías de una categoría específica
   */
  const cargarSubcategorias = (categoriaId) => {
    setCargandoNiveles(true);
    Product.getInstance().getSubCategories(
      categoriaId,
      (data) => {
        setSubcategorias(data);
        setCargandoNiveles(false);
      },
      (error) => {
        console.error("Error al cargar subcategorías:", error);
        setCargandoNiveles(false);
        showMessage("Error al cargar las subcategorías");
      }
    );
  };

  /**
   * Carga las familias de una subcategoría específica
   */
  const cargarFamilias = (categoriaId, subcategoriaId) => {
    setCargandoNiveles(true);
    Product.getInstance().getFamiliaBySubCat(
      { categoryId: categoriaId, subcategoryId: subcategoriaId },
      (data) => {
        setFamilias(data);
        setCargandoNiveles(false);
      },
      (error) => {
        console.error("Error al cargar familias:", error);
        setCargandoNiveles(false);
        showMessage("Error al cargar las familias");
      }
    );
  };

  /**
   * Carga las subfamilias de una familia específica - CORREGIDO
   */
  const cargarSubfamilias = (categoriaId, subcategoriaId, familiaId) => {
    setCargandoNiveles(true);
    Product.getInstance().getSubFamilia(
      {
        categoryId: categoriaId,
        subcategoryId: subcategoriaId,
        familyId: familiaId,
      },
      (data) => {
        // IMPORTANTE: El API devuelve {statusCode: 200, descripcion: "", subFamilias: [...]}
        // Necesitamos extraer el array de subFamilias
        const subFamiliasArray = data.subFamilias || data;
        console.log("Subfamilias cargadas:", subFamiliasArray);
        setSubfamilias(subFamiliasArray);
        setCargandoNiveles(false);
      },
      (error) => {
        console.error("Error al cargar subfamilias:", error);
        setCargandoNiveles(false);
        showMessage("Error al cargar las subfamilias");
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
   * Maneja el cambio del tipo de descuento
   */
  const handleTipoDescuentoChange = (event, newTipo) => {
    if (newTipo !== null) {
      setTipoDescuento(newTipo);
      // Resetear valores al cambiar tipo
      setDescuentoManual(0);
      setDescuentoPorcentaje(0);
    }
  };

  /**
   * Maneja el cambio del descuento manual (monto fijo)
   */
  const handleDescuentoManualChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue === "" || numericValue === "0") {
      setDescuentoManual(0);
    } else {
      const descuento = parseInt(numericValue, 10);
      // Validar que el descuento no sea negativo
      if (descuento < 0) {
        showMessage("El descuento no puede ser negativo");
        setDescuentoManual(0);
      } else {
        setDescuentoManual(descuento);
      }
    }
  };

  /**
   * Maneja el cambio del descuento en porcentaje
   */
  const handleDescuentoPorcentajeChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue === "" || numericValue === "0") {
      setDescuentoPorcentaje(0);
    } else {
      let porcentaje = parseInt(numericValue, 10);
      // Validar que no sea mayor a 100%
      if (porcentaje > 100) {
        showMessage("El porcentaje no puede ser mayor a 100%");
        porcentaje = 100;
      } else if (porcentaje < 0) {
        showMessage("El porcentaje no puede ser negativo");
        porcentaje = 0;
      }
      setDescuentoPorcentaje(porcentaje);
    }
  };

  /**
   * Obtiene el nombre de un nivel por su ID - CORREGIDO
   */
  const obtenerNombreNivel = (id, lista, campoDescripcion = "descripcion") => {
    if (id === -1 || id === 0) return "No seleccionado";
    const item = lista.find(
      (item) =>
        item.id === id ||
        item.idCategoria === id ||
        item.idSubcategoria === id ||
        item.idFamilia === id ||
        item.idSubFamilia === id || // Cambiado a idSubFamilia (con F mayúscula)
        item.idSubfamilia === id // También verificar con f minúscula por compatibilidad
    );
    return item ? item[campoDescripcion] : `ID ${id}`;
  };

  /**
   * Construye el objeto NML según el nivel de aplicación seleccionado
   */
  const construirObjetoNML = () => {
    const objetoBase = {
      categoriaID: 0,
      subCategoriaID: 0,
      familiaID: 0,
      subFamiliaID: 0,
    };

    // Verificar que tengamos al menos los niveles necesarios según el nivel de aplicación
    switch (nivelAplicacion) {
      case "categoria":
        if (categoriaSeleccionadaId !== -1) {
          objetoBase.categoriaID = categoriaSeleccionadaId;
        }
        break;

      case "subcategoria":
        if (
          categoriaSeleccionadaId !== -1 &&
          subcategoriaSeleccionadaId !== -1
        ) {
          objetoBase.categoriaID = categoriaSeleccionadaId;
          objetoBase.subCategoriaID = subcategoriaSeleccionadaId;
        }
        break;

      case "familia":
        if (
          categoriaSeleccionadaId !== -1 &&
          subcategoriaSeleccionadaId !== -1 &&
          familiaSeleccionadaId !== -1
        ) {
          objetoBase.categoriaID = categoriaSeleccionadaId;
          objetoBase.subCategoriaID = subcategoriaSeleccionadaId;
          objetoBase.familiaID = familiaSeleccionadaId;
          // SubfamiliaID se mantiene en 0 para aplicar a toda la familia
        }
        break;

      case "subfamilia":
        if (
          categoriaSeleccionadaId !== -1 &&
          subcategoriaSeleccionadaId !== -1 &&
          familiaSeleccionadaId !== -1 &&
          subfamiliaSeleccionadaId !== -1
        ) {
          objetoBase.categoriaID = categoriaSeleccionadaId;
          objetoBase.subCategoriaID = subcategoriaSeleccionadaId;
          objetoBase.familiaID = familiaSeleccionadaId;
          objetoBase.subFamiliaID = subfamiliaSeleccionadaId;
        } else {
          console.warn(
            "No se puede aplicar a subfamilia sin seleccionar todos los niveles anteriores"
          );
        }
        break;
    }

    console.log("Objeto NML construído:", objetoBase);
    return objetoBase;
  };

  /**
   * Valida que todos los campos obligatorios estén completos
   */
  const validarFormulario = () => {
    if (!nombreOferta.trim()) {
      showMessage("Debe ingresar un nombre para la oferta");
      return false;
    }

    // Validar selección según nivel de aplicación
    switch (nivelAplicacion) {
      case "categoria":
        if (categoriaSeleccionadaId === -1) {
          showMessage("Debe seleccionar una categoría");
          return false;
        }
        break;

      case "subcategoria":
        if (
          categoriaSeleccionadaId === -1 ||
          subcategoriaSeleccionadaId === -1
        ) {
          showMessage("Debe seleccionar una categoría y subcategoría");
          return false;
        }
        break;

      case "familia":
        if (
          categoriaSeleccionadaId === -1 ||
          subcategoriaSeleccionadaId === -1 ||
          familiaSeleccionadaId === -1
        ) {
          showMessage("Debe seleccionar categoría, subcategoría y familia");
          return false;
        }
        break;

      case "subfamilia":
        if (
          categoriaSeleccionadaId === -1 ||
          subcategoriaSeleccionadaId === -1 ||
          familiaSeleccionadaId === -1 ||
          subfamiliaSeleccionadaId === -1
        ) {
          showMessage(
            "Debe seleccionar categoría, subcategoría, familia y subfamilia"
          );
          return false;
        }
        break;

      default:
        showMessage("Debe seleccionar un nivel de aplicación");
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

    // Validar que fecha final no sea anterior a fecha inicial
    if (endDate.isBefore(startDate, "day")) {
      showMessage(
        "La fecha de término no puede ser anterior a la fecha de inicio"
      );
      return false;
    }

    // Validar horas si están en el mismo día
    if (startDate.isSame(endDate, "day")) {
      if (endTime.isBefore(startTime)) {
        showMessage(
          "La hora de término no puede ser anterior a la hora de inicio"
        );
        return false;
      }
    }

    // Validar descuento según tipo
    if (tipoDescuento === "$") {
      if (descuentoManual <= 0) {
        showMessage("El descuento debe ser mayor que 0");
        return false;
      }
    } else {
      if (descuentoPorcentaje <= 0 || descuentoPorcentaje > 100) {
        showMessage("El porcentaje debe estar entre 1 y 100");
        return false;
      }
    }

    return true;
  };

  /**
   * Guarda una nueva oferta con NML
   */
  const handleGuardar = () => {
    if (guardando) return;

    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);
    showLoading();

    // Construir el objeto NML
    const objetoNML = construirObjetoNML();

    // Preparar la lista de NMLs
    const listaNMLs = [objetoNML];

    // Construir el objeto de la oferta según el nuevo endpoint
    const nuevaOferta = {
      codigoTipo: tipoOferta,
      descripcion: nombreOferta.trim(),
      fechaInicial: startDate ? startDate.toISOString() : null,
      fechaFinal: endDate ? endDate.toISOString() : null,
      horaInicio: startTime ? startTime.format("HH:mm") : null,
      horaFin: endTime ? endTime.format("HH:mm") : null,
      diasSemana: convertirDiasAString(diasSemana),
      fAplicaMix: true,
      activo: ofertaActiva,
      oferta_Regla: {
        signo: "=",
        cantidad: 1,
        tipoDescuento: tipoDescuento,
        valor: tipoDescuento === "$" ? descuentoManual : descuentoPorcentaje,
        aplicacion: "Total",
      },
      oferta_ListaNMLs: listaNMLs,
    };

    console.log("Enviando oferta NML completa:", nuevaOferta);

    // Usar el nuevo endpoint para ofertas por NML
    Ofertas.addOfertaNML(
      nuevaOferta,
      (data, response) => {
        hideLoading();
        setGuardando(false);
        showMessage("Oferta creada exitosamente");
        setRefresh(!refresh);
        limpiarFormulario();
      },
      (error) => {
        hideLoading();
        setGuardando(false);
        console.error("Error al guardar oferta NML:", error);
        const mensajeError =
          error?.message ||
          error?.descripcion ||
          error?.response?.data?.message ||
          "Error desconocido";
        showMessage(`Error al guardar la oferta: ${mensajeError}`);
      }
    );
  };

  /**
   * Limpia todos los campos del formulario de creación
   */
  const limpiarFormulario = () => {
    setNombreOferta("");
    setCategoriaSeleccionadaId(-1);
    setSubcategoriaSeleccionadaId(-1);
    setFamiliaSeleccionadaId(-1);
    setSubfamiliaSeleccionadaId(-1);
    setDescuentoManual(0);
    setDescuentoPorcentaje(0);
    setTipoDescuento("$");
    setNivelAplicacion("familia");
    setStartDate(null);
    setEndDate(null);
    setStartTime(null);
    setEndTime(null);
    setDiasSemana([true, true, true, true, true, true, true]);
    setOfertaActiva(true);
    setClearSearch((prev) => !prev);
    setGuardando(false);
  };

  /**
   * Maneja el cambio manual del nivel de aplicación
   */
  const handleNivelAplicacionChange = (nuevoNivel) => {
    setNivelAplicacion(nuevoNivel);

    // Si el usuario selecciona un nivel más específico del que tiene seleccionado,
    // mostrar advertencia
    if (nuevoNivel === "subfamilia" && subfamiliaSeleccionadaId === -1) {
      showMessage(
        "Para aplicar a subfamilia, debe seleccionar primero una subfamilia"
      );
    } else if (nuevoNivel === "familia" && familiaSeleccionadaId === -1) {
      showMessage(
        "Para aplicar a familia, debe seleccionar primero una familia"
      );
    } else if (
      nuevoNivel === "subcategoria" &&
      subcategoriaSeleccionadaId === -1
    ) {
      showMessage(
        "Para aplicar a subcategoría, debe seleccionar primero una subcategoría"
      );
    } else if (nuevoNivel === "categoria" && categoriaSeleccionadaId === -1) {
      showMessage(
        "Para aplicar a categoría, debe seleccionar primero una categoría"
      );
    }
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
            const mensajeError =
              error?.message || error?.descripcion || "Error desconocido";
            showMessage(`Error al eliminar la oferta: ${mensajeError}`);
          }
        );
      },
      () => {
        console.log("Eliminación cancelada por el usuario");
      }
    );
  };

  // Formateo moneda simple (sin decimales)
  const formatCLP = (n) => {
    if (n == null || isNaN(n)) return "$0";
    return `$${n.toLocaleString("es-CL")}`;
  };

  return (
    <>
      <DialogTitle>Descuentos por Nivel (NML)</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {/* Formulario de creación */}
          <TextField
            label="Ingresa nombre Oferta"
            type="text"
            value={nombreOferta}
            onChange={(e) => setNombreOferta(e.target.value)}
            fullWidth
          />

          {/* Selectores jerárquicos NML */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
            }}
          >
            <Typography variant="h6">Selección Jerárquica (NML)</Typography>

            <Grid container spacing={2}>
              {/* Selector de Categoría */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  label="Categoría *"
                  value={categoriaSeleccionadaId}
                  onChange={(e) =>
                    setCategoriaSeleccionadaId(Number(e.target.value))
                  }
                  fullWidth
                  disabled={cargandoNiveles}
                >
                  <MenuItem value={-1}>
                    <em>Seleccione categoría</em>
                  </MenuItem>
                  {categorias.map((categoria) => (
                    <MenuItem
                      key={categoria.idCategoria}
                      value={categoria.idCategoria}
                    >
                      {categoria.descripcion}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Selector de Subcategoría */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  label="Subcategoría"
                  value={subcategoriaSeleccionadaId}
                  onChange={(e) =>
                    setSubcategoriaSeleccionadaId(Number(e.target.value))
                  }
                  fullWidth
                  disabled={
                    !categoriaSeleccionadaId ||
                    categoriaSeleccionadaId === -1 ||
                    cargandoNiveles
                  }
                >
                  <MenuItem value={-1}>
                    <em>Seleccione subcategoría</em>
                  </MenuItem>
                  {subcategorias.map((subcategoria) => (
                    <MenuItem
                      key={subcategoria.idSubcategoria}
                      value={subcategoria.idSubcategoria}
                    >
                      {subcategoria.descripcion}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Selector de Familia */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  label="Familia"
                  value={familiaSeleccionadaId}
                  onChange={(e) =>
                    setFamiliaSeleccionadaId(Number(e.target.value))
                  }
                  fullWidth
                  disabled={
                    !subcategoriaSeleccionadaId ||
                    subcategoriaSeleccionadaId === -1 ||
                    cargandoNiveles
                  }
                >
                  <MenuItem value={-1}>
                    <em>Seleccione familia</em>
                  </MenuItem>
                  {familias.map((familia) => (
                    <MenuItem key={familia.idFamilia} value={familia.idFamilia}>
                      {familia.descripcion}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Selector de Subfamilia - CORREGIDO */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  label="Subfamilia"
                  value={subfamiliaSeleccionadaId}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    console.log("Subfamilia seleccionada ID:", value);
                    setSubfamiliaSeleccionadaId(value);
                  }}
                  fullWidth
                  disabled={
                    !familiaSeleccionadaId ||
                    familiaSeleccionadaId === -1 ||
                    cargandoNiveles
                  }
                >
                  <MenuItem value={-1}>
                    <em>Seleccione subfamilia</em>
                  </MenuItem>
                  {subfamilias.map((subfamilia) => (
                    <MenuItem
                      key={subfamilia.idSubFamilia || subfamilia.idSubfamilia}
                      value={subfamilia.idSubFamilia || subfamilia.idSubfamilia}
                    >
                      {subfamilia.descripcion}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>

          {/* Campos de descuento */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 2,
              backgroundColor: "#f0f7ff",
              borderRadius: 1,
            }}
          >
            <Typography variant="h6">Configuración del Descuento</Typography>

            {/* Selector de tipo de descuento */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1" fontWeight="medium">
                Tipo de descuento:
              </Typography>
              <ToggleButtonGroup
                value={tipoDescuento}
                exclusive
                onChange={handleTipoDescuentoChange}
                aria-label="tipo de descuento"
                size="small"
              >
                <ToggleButton value="$" aria-label="pesos">
                  <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
                  Monto Fijo ($)
                </ToggleButton>
                <ToggleButton value="%" aria-label="porcentaje">
                  <PercentIcon fontSize="small" sx={{ mr: 1 }} />
                  Porcentaje (%)
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Campo de descuento dinámico según tipo seleccionado */}
            <Box sx={{ display: "flex", gap: 2 }}>
              {tipoDescuento === "$" ? (
                <TextField
                  label="Descuento aplicado *"
                  type="text"
                  value={descuentoManual || ""}
                  onChange={(e) => handleDescuentoManualChange(e.target.value)}
                  fullWidth
                  helperText="Ingrese el descuento manual en pesos"
                  error={descuentoManual < 0}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              ) : (
                <TextField
                  label="Descuento aplicado *"
                  type="text"
                  value={descuentoPorcentaje || ""}
                  onChange={(e) =>
                    handleDescuentoPorcentajeChange(e.target.value)
                  }
                  fullWidth
                  helperText="Ingrese el descuento en porcentaje (0-100)"
                  error={descuentoPorcentaje < 0 || descuentoPorcentaje > 100}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Fechas y Horas */}
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

          <Box sx={{ display: "flex", gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label="Hora de Inicio"
                format="HH:mm"
                value={startTime}
                onChange={setStartTime}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label="Hora de Término"
                format="HH:mm"
                value={endTime}
                onChange={setEndTime}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Box>

          {/* Días de la semana */}
          <Box
            sx={{
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              backgroundColor: "#fafafa",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Días de la Semana
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleTodosLosDias(true)}
                >
                  Todos
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleTodosLosDias(false)}
                >
                  Ninguno
                </Button>
              </Box>
            </Box>
            <FormGroup
              row
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
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

          {/* Estado activo/inactivo */}
          <FormControlLabel
            control={
              <Checkbox
                checked={ofertaActiva}
                onChange={(e) => setOfertaActiva(e.target.checked)}
                color="primary"
              />
            }
            label="Oferta activa"
          />

          {/* Tabla de ofertas existentes */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Todas las Ofertas
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : ofertasFiltradas.length > 0 ? (
              <TableContainer component={Paper} elevation={2}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell>
                        <strong>Código oferta</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Descripción</strong>
                      </TableCell>
                      <TableCell>
                        <strong>NML Aplicado</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Tipo Descuento</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Valor</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Vigencia</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Estado</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Acciones</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ofertasFiltradas.map((oferta, index) => (
                      <TableRow
                        key={oferta.codigoOferta || index}
                        hover
                        sx={{
                          backgroundColor: oferta.bajaLogica
                            ? "#ffebee"
                            : "inherit",
                          opacity: oferta.bajaLogica ? 0.6 : 1,
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {oferta.codigoOferta}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {oferta.descripcion}
                          </Typography>
                          {oferta.codigoTipo && (
                            <Chip
                              label={`Tipo ${oferta.codigoTipo}`}
                              size="small"
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {oferta.oferta_ListaNMLs &&
                          oferta.oferta_ListaNMLs.length > 0 ? (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                              }}
                            >
                              {oferta.oferta_ListaNMLs.map((nml, idx) => (
                                <Box key={idx}>
                                  {nml.categoriaID > 0 && (
                                    <Typography
                                      variant="caption"
                                      display="block"
                                    >
                                      Categoría: {nml.categoriaID}
                                    </Typography>
                                  )}
                                  {nml.subCategoriaID > 0 && (
                                    <Typography
                                      variant="caption"
                                      display="block"
                                    >
                                      Subcategoría: {nml.subCategoriaID}
                                    </Typography>
                                  )}
                                  {nml.familiaID > 0 && (
                                    <Typography
                                      variant="caption"
                                      display="block"
                                    >
                                      Familia: {nml.familiaID}
                                    </Typography>
                                  )}
                                  {nml.subFamiliaID > 0 && (
                                    <Typography
                                      variant="caption"
                                      display="block"
                                      color="success.main"
                                    >
                                      Subfamilia: {nml.subFamiliaID}
                                    </Typography>
                                  )}
                                </Box>
                              ))}
                            </Box>
                          ) : (
                            <Chip label="N/A" size="small" color="default" />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {oferta.oferta_Regla && (
                            <Chip
                              label={
                                oferta.oferta_Regla.tipoDescuento === "$"
                                  ? "Monto"
                                  : "Porcentaje"
                              }
                              size="small"
                              color={
                                oferta.oferta_Regla.tipoDescuento === "$"
                                  ? "primary"
                                  : "secondary"
                              }
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {oferta.oferta_Regla && (
                            <Typography variant="body2" fontWeight="bold">
                              {oferta.oferta_Regla.tipoDescuento === "$"
                                ? formatCLP(oferta.oferta_Regla.valor)
                                : `${oferta.oferta_Regla.valor}%`}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="caption" display="block">
                            {new Date(oferta.fechaInicial).toLocaleDateString(
                              "es-CL"
                            )}
                          </Typography>
                          <Typography
                            variant="caption"
                            display="block"
                            color="textSecondary"
                          >
                            hasta
                          </Typography>
                          <Typography variant="caption" display="block">
                            {new Date(oferta.fechaFinal).toLocaleDateString(
                              "es-CL"
                            )}
                          </Typography>
                          {oferta.diasSemana &&
                            oferta.diasSemana !== "1111111" && (
                              <Chip
                                label="Días específicos"
                                size="small"
                                sx={{ mt: 0.5, fontSize: "0.7rem" }}
                              />
                            )}
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                              alignItems: "center",
                            }}
                          >
                            <Chip
                              label={oferta.activo ? "Activa" : "Inactiva"}
                              size="small"
                              color={oferta.activo ? "success" : "default"}
                            />
                            {oferta.bajaLogica && (
                              <Chip
                                label="Eliminada"
                                size="small"
                                color="error"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              justifyContent: "center",
                            }}
                          >
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
                  No hay ofertas registradas para el tipo {tipoOferta}
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={guardando}>
          Cancelar
        </Button>
        <Button
          onClick={handleGuardar}
          variant="contained"
          disabled={guardando || categoriaSeleccionadaId === -1}
        >
          {guardando ? "Guardando..." : "Crear Oferta"}
        </Button>
      </DialogActions>

      {/* Diálogo de edición */}
      <DialogEditarDescuentoProductosAgrupados
        open={dialogEditarOpen}
        onClose={handleCloseDialogEditar}
        ofertaEditar={ofertaParaEditar}
        onOfertaActualizada={handleOfertaActualizada}
        clearSearch={clearSearch}
      />
    </>
  );
};

export default DescuentosProductosAgrupados;
