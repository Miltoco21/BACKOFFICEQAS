// // // // // import React, { useState, useEffect, useContext, useCallback } from "react";
// // // // // import {
// // // // //   Dialog,
// // // // //   DialogTitle,
// // // // //   DialogContent,
// // // // //   DialogActions,
// // // // //   Button,
// // // // //   TextField,
// // // // //   Box,
// // // // //   Typography,
// // // // //   Table,
// // // // //   TableBody,
// // // // //   TableCell,
// // // // //   TableContainer,
// // // // //   TableHead,
// // // // //   TableRow,
// // // // //   Paper,
// // // // //   IconButton,
// // // // //   Chip,
// // // // //   Alert,
// // // // //   Checkbox,
// // // // //   FormControlLabel,
// // // // //   FormGroup,
// // // // //   InputAdornment,
// // // // //   CircularProgress,
// // // // //   Switch,
// // // // // } from "@mui/material";
// // // // // import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// // // // // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// // // // // import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// // // // // import { TimeField } from "@mui/x-date-pickers/TimeField";
// // // // // import dayjs from "dayjs";
// // // // // import DeleteIcon from "@mui/icons-material/Delete";
// // // // // import Product from "../../Models/Product";
// // // // // import Ofertas from "../../Models/Ofertas";
// // // // // import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

// // // // // const DialogEditarOfertaComplementarias = ({
// // // // //   open,
// // // // //   onClose,
// // // // //   ofertaEditar,
// // // // //   onOfertaActualizada,
// // // // // }) => {
// // // // //   const { showLoading, hideLoading, showMessage, showConfirm } = useContext(
// // // // //     SelectedOptionsContext
// // // // //   );

// // // // //   // Estados del formulario
// // // // //   const [nombreOferta, setNombreOferta] = useState("");
// // // // //   const [startDate, setStartDate] = useState(null);
// // // // //   const [endDate, setEndDate] = useState(null);
// // // // //   const [startTime, setStartTime] = useState(null);
// // // // //   const [endTime, setEndTime] = useState(null);
// // // // //   const [productosSeleccionados, setProductosSeleccionados] = useState([]);
// // // // //   const [diasSemana, setDiasSemana] = useState([
// // // // //     true,
// // // // //     true,
// // // // //     true,
// // // // //     true,
// // // // //     true,
// // // // //     true,
// // // // //     true,
// // // // //   ]);
// // // // //   const [ofertaActiva, setOfertaActiva] = useState(true);

// // // // //   // Estados calculados
// // // // //   const [totalSinDescuento, setTotalSinDescuento] = useState(0);
// // // // //   const [descuentoManual, setDescuentoManual] = useState(0);
// // // // //   const [totalConDescuento, setTotalConDescuento] = useState(0);
// // // // //   const [valorOriginalGuardado, setValorOriginalGuardado] = useState(0);

// // // // //   // Estado de carga
// // // // //   const [loadingProducts, setLoadingProducts] = useState(false);

// // // // //   const nombresDias = [
// // // // //     "Lunes",
// // // // //     "Martes",
// // // // //     "Miércoles",
// // // // //     "Jueves",
// // // // //     "Viernes",
// // // // //     "Sábado",
// // // // //     "Domingo",
// // // // //   ];

// // // // //   // Función para cargar precio de un producto por código de barra
// // // // //   const cargarPrecioProducto = async (codbarra) => {
// // // // //     return new Promise((resolve, reject) => {
// // // // //       const productModel = Product.getInstance();
// // // // //       productModel.findByCodigoBarras(
// // // // //         { codigoProducto: codbarra, codigoCliente: null },
// // // // //         (productos, response) => {
// // // // //           if (productos && productos.length > 0) {
// // // // //             const producto = productos[0];
// // // // //             resolve({
// // // // //               precioVenta: Number(producto.precioVenta || 0),
// // // // //               nombre: producto.nombre || producto.descripcion || "",
// // // // //             });
// // // // //           } else {
// // // // //             resolve({ precioVenta: 0, nombre: "" });
// // // // //           }
// // // // //         },
// // // // //         (error) => {
// // // // //           console.error(
// // // // //             `Error al cargar precio del producto ${codbarra}:`,
// // // // //             error
// // // // //           );
// // // // //           resolve({ precioVenta: 0, nombre: "" });
// // // // //         }
// // // // //       );
// // // // //     });
// // // // //   };

// // // // //   // Cargar datos de la oferta cuando se abre el diálogo
// // // // //   useEffect(() => {
// // // // //     if (open && ofertaEditar) {
// // // // //       console.log("Cargando oferta para editar:", ofertaEditar);

// // // // //       // Cargar datos básicos
// // // // //       setNombreOferta(ofertaEditar.descripcion || "");
// // // // //       setOfertaActiva(ofertaEditar.activo ?? true);

// // // // //       // Cargar fechas
// // // // //       if (ofertaEditar.fechaInicial) {
// // // // //         setStartDate(dayjs(ofertaEditar.fechaInicial));
// // // // //       }
// // // // //       if (ofertaEditar.fechaFinal) {
// // // // //         setEndDate(dayjs(ofertaEditar.fechaFinal));
// // // // //       }

// // // // //       // Cargar horas
// // // // //       if (ofertaEditar.horaInicio) {
// // // // //         const [hours, minutes] = ofertaEditar.horaInicio.split(":");
// // // // //         setStartTime(dayjs().hour(parseInt(hours)).minute(parseInt(minutes)));
// // // // //       }
// // // // //       if (ofertaEditar.horaFin) {
// // // // //         const [hours, minutes] = ofertaEditar.horaFin.split(":");
// // // // //         setEndTime(dayjs().hour(parseInt(hours)).minute(parseInt(minutes)));
// // // // //       }

// // // // //       // Cargar días de la semana
// // // // //       if (ofertaEditar.diasSemana) {
// // // // //         const diasArray = ofertaEditar.diasSemana
// // // // //           .split("")
// // // // //           .map((d) => d === "1");
// // // // //         setDiasSemana(diasArray);
// // // // //       }

// // // // //       // Guardar el valor original de la oferta
// // // // //       if (ofertaEditar.oferta_Regla?.valor) {
// // // // //         setValorOriginalGuardado(ofertaEditar.oferta_Regla.valor);
// // // // //       }

// // // // //       // Cargar productos con sus precios reales
// // // // //       if (ofertaEditar.products && ofertaEditar.products.length > 0) {
// // // // //         cargarProductosConPrecios(ofertaEditar.products);
// // // // //       }
// // // // //     }
// // // // //   }, [open, ofertaEditar]);

// // // // //   // Función para cargar productos con sus precios reales desde la API
// // // // //   const cargarProductosConPrecios = async (products) => {
// // // // //     setLoadingProducts(true);
// // // // //     console.log("Cargando precios para productos:", products);

// // // // //     try {
// // // // //       const productosConPrecios = await Promise.all(
// // // // //         products.map(async (prod) => {
// // // // //           const { precioVenta, nombre } = await cargarPrecioProducto(
// // // // //             prod.codbarra
// // // // //           );
// // // // //           return {
// // // // //             codbarra: prod.codbarra,
// // // // //             descripcionProducto: nombre || prod.descripcion,
// // // // //             cantidad: 1,
// // // // //             precioVenta: precioVenta,
// // // // //           };
// // // // //         })
// // // // //       );

// // // // //       console.log("Productos con precios cargados:", productosConPrecios);
// // // // //       setProductosSeleccionados(productosConPrecios);
// // // // //     } catch (error) {
// // // // //       console.error("Error al cargar precios de productos:", error);
// // // // //       showMessage("Error al cargar los precios de los productos");
// // // // //     } finally {
// // // // //       setLoadingProducts(false);
// // // // //     }
// // // // //   };

// // // // //   // CALCULO PRINCIPAL
// // // // //   const calcularTotales = useCallback(() => {
// // // // //     console.log("=== CALCULANDO TOTALES EN EDICIÓN ===");
// // // // //     console.log("Productos:", productosSeleccionados);
// // // // //     console.log("Valor original guardado:", valorOriginalGuardado);

// // // // //     if (productosSeleccionados.length === 0) {
// // // // //       setTotalSinDescuento(0);
// // // // //       setTotalConDescuento(0);
// // // // //       setDescuentoManual(0);
// // // // //       return;
// // // // //     }

// // // // //     // 1) Calcular total sin descuento (suma de todos los precios)
// // // // //     const totalOriginal = productosSeleccionados.reduce(
// // // // //       (sum, p) => sum + Number(p.precioVenta || 0),
// // // // //       0
// // // // //     );
// // // // //     console.log("Total sin descuento:", totalOriginal);
// // // // //     setTotalSinDescuento(totalOriginal);

// // // // //     // 2) Si hay un valor guardado, calcular el descuento basado en ese valor
// // // // //     if (valorOriginalGuardado > 0 && totalOriginal > 0) {
// // // // //       const descuentoCalculado = totalOriginal - valorOriginalGuardado;
// // // // //       console.log(
// // // // //         "Descuento calculado desde valor guardado:",
// // // // //         descuentoCalculado
// // // // //       );
// // // // //       setDescuentoManual(descuentoCalculado);
// // // // //       setTotalConDescuento(valorOriginalGuardado);
// // // // //     } else {
// // // // //       // 3) Si no hay valor guardado, usar descuento manual
// // // // //       const totalConDescuentoCalculado = totalOriginal - descuentoManual;
// // // // //       console.log("Total con descuento manual:", totalConDescuentoCalculado);
// // // // //       setTotalConDescuento(totalConDescuentoCalculado);
// // // // //     }
// // // // //   }, [productosSeleccionados, descuentoManual, valorOriginalGuardado]);

// // // // //   // Ejecutar cálculo cuando cambien las dependencias
// // // // //   useEffect(() => {
// // // // //     calcularTotales();
// // // // //   }, [calcularTotales]);

// // // // //   /** Convierte array de booleanos a string de días */
// // // // //   const convertirDiasAString = (diasArray) => {
// // // // //     return diasArray.map((dia) => (dia ? "1" : "0")).join("");
// // // // //   };

// // // // //   /** Maneja el cambio de selección de un día específico */
// // // // //   const handleDiaChange = (index) => {
// // // // //     const nuevosDias = [...diasSemana];
// // // // //     nuevosDias[index] = !nuevosDias[index];
// // // // //     setDiasSemana(nuevosDias);
// // // // //   };

// // // // //   /** Selecciona o deselecciona todos los días */
// // // // //   const handleTodosLosDias = (seleccionar) => {
// // // // //     setDiasSemana(new Array(7).fill(seleccionar));
// // // // //   };

// // // // //   /** Elimina un producto de la lista */
// // // // //   const handleEliminarProducto = (codbarra) => {
// // // // //     console.log("Eliminando producto:", codbarra);
// // // // //     setProductosSeleccionados((prev) =>
// // // // //       prev.filter((p) => p.codbarra !== codbarra)
// // // // //     );
// // // // //     // Resetear el valor guardado al modificar productos
// // // // //     setValorOriginalGuardado(0);
// // // // //   };

// // // // //   /** Maneja el cambio del descuento manual */
// // // // //   const handleDescuentoManualChange = (value) => {
// // // // //     const numericValue = value.replace(/[^0-9]/g, "");

// // // // //     if (numericValue === "" || numericValue === "0") {
// // // // //       setDescuentoManual(0);
// // // // //       setValorOriginalGuardado(0);
// // // // //     } else {
// // // // //       const descuento = parseInt(numericValue, 10);
// // // // //       if (descuento > totalSinDescuento) {
// // // // //         showMessage(
// // // // //           "El descuento no puede ser mayor al total de los productos"
// // // // //         );
// // // // //         setDescuentoManual(totalSinDescuento);
// // // // //       } else {
// // // // //         setDescuentoManual(descuento);
// // // // //         setValorOriginalGuardado(0); // Resetear valor guardado al modificar manualmente
// // // // //       }
// // // // //     }
// // // // //   };

// // // // //   /** Valida el formulario */
// // // // //   const validarFormulario = () => {
// // // // //     if (productosSeleccionados.length === 0) {
// // // // //       showMessage("Debe tener al menos un producto");
// // // // //       return false;
// // // // //     }
// // // // //     if (!nombreOferta.trim()) {
// // // // //       showMessage("Debe ingresar un nombre para la oferta");
// // // // //       return false;
// // // // //     }
// // // // //     if (!startDate || !endDate) {
// // // // //       showMessage("Debe seleccionar las fechas de inicio y término");
// // // // //       return false;
// // // // //     }

// // // // //     const totalOriginal = productosSeleccionados.reduce(
// // // // //       (sum, p) => sum + Number(p.precioVenta || 0),
// // // // //       0
// // // // //     );

// // // // //     if (totalOriginal <= 0) {
// // // // //       showMessage("El total de los productos debe ser mayor que 0");
// // // // //       return false;
// // // // //     }

// // // // //     if (descuentoManual < 0) {
// // // // //       showMessage("El descuento no puede ser negativo");
// // // // //       return false;
// // // // //     }

// // // // //     if (descuentoManual >= totalOriginal) {
// // // // //       showMessage("El descuento debe ser menor al total de los productos");
// // // // //       return false;
// // // // //     }

// // // // //     return true;
// // // // //   };

// // // // //   /** Guarda los cambios de la oferta */
// // // // //   const handleGuardar = () => {
// // // // //     if (!validarFormulario()) {
// // // // //       return;
// // // // //     }

// // // // //     const listaParaEnviar = productosSeleccionados.map((p) => ({
// // // // //       codbarra: p.codbarra,
// // // // //       descripcionProducto: p.descripcionProducto,
// // // // //       cantidad: 1,
// // // // //       porcDescuento: 0,
// // // // //     }));

// // // // //     const ofertaActualizada = {
// // // // //       codigoOferta: ofertaEditar.codigoOferta,
// // // // //       codigoTipo: ofertaEditar.codigoTipo,
// // // // //       descripcion: nombreOferta,
// // // // //       fechaInicial: startDate.toISOString(),
// // // // //       fechaFinal: endDate.toISOString(),
// // // // //       horaInicio: startTime ? startTime.format("HH:mm") : null,
// // // // //       horaFin: endTime ? endTime.format("HH:mm") : null,
// // // // //       diasSemana: convertirDiasAString(diasSemana),
// // // // //       fAplicaMix: true,
// // // // //       activo: ofertaActiva,
// // // // //       oferta_Regla: {
// // // // //         signo: "=",
// // // // //         cantidad: productosSeleccionados.length,
// // // // //         tipoDescuento: "$",
// // // // //         valor: totalConDescuento,
// // // // //         aplicacion: "",
// // // // //       },
// // // // //       oferta_ListaCanasta: listaParaEnviar,
// // // // //     };

// // // // //     console.log("Guardando oferta actualizada:", ofertaActualizada);

// // // // //     showLoading();
// // // // //     Ofertas.updateOferta(
// // // // //       ofertaActualizada,
// // // // //       (data, response) => {
// // // // //         hideLoading();
// // // // //         showMessage("Oferta actualizada exitosamente");
// // // // //         onOfertaActualizada();
// // // // //         onClose();
// // // // //       },
// // // // //       (error) => {
// // // // //         hideLoading();
// // // // //         console.error("Error al actualizar oferta:", error);
// // // // //         const mensajeError =
// // // // //           error?.message || error?.descripcion || "Error desconocido";
// // // // //         showMessage(`Error al actualizar la oferta: ${mensajeError}`);
// // // // //       }
// // // // //     );
// // // // //   };

// // // // //   // Formateo moneda
// // // // //   const formatCLP = (n) => {
// // // // //     if (n == null || isNaN(n)) return "$0";
// // // // //     return `$${n.toLocaleString("es-CL")}`;
// // // // //   };

// // // // //   return (
// // // // //     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
// // // // //       <DialogTitle>Editar Oferta de Productos Complementarios</DialogTitle>
// // // // //       <DialogContent>
// // // // //         <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
// // // // //           {/* Nombre de la oferta */}
// // // // //           <TextField
// // // // //             label="Nombre de la Oferta"
// // // // //             type="text"
// // // // //             value={nombreOferta}
// // // // //             onChange={(e) => setNombreOferta(e.target.value)}
// // // // //             fullWidth
// // // // //           />

// // // // //           {/* Indicador de carga de productos */}
// // // // //           {loadingProducts && (
// // // // //             <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
// // // // //               <CircularProgress size={30} />
// // // // //               <Typography variant="body2" sx={{ ml: 2 }}>
// // // // //                 Cargando precios de productos...
// // // // //               </Typography>
// // // // //             </Box>
// // // // //           )}

// // // // //           {/* Resumen de la oferta */}
// // // // //           {productosSeleccionados.length > 0 && !loadingProducts && (
// // // // //             <Box
// // // // //               sx={{
// // // // //                 display: "flex",
// // // // //                 flexDirection: "column",
// // // // //                 gap: 2,
// // // // //                 p: 2,
// // // // //                 backgroundColor: "#f5f5f5",
// // // // //                 borderRadius: 1,
// // // // //               }}
// // // // //             >
// // // // //               <Typography variant="h6">Resumen de la Oferta</Typography>

// // // // //               <Box sx={{ display: "flex", gap: 2 }}>
// // // // //                 <TextField
// // // // //                   label="Valor actual (Total productos)"
// // // // //                   value={formatCLP(totalSinDescuento)}
// // // // //                   fullWidth
// // // // //                   helperText="Suma total de todos los productos"
// // // // //                   InputProps={{
// // // // //                     readOnly: true,
// // // // //                     startAdornment: (
// // // // //                       <InputAdornment position="start">$</InputAdornment>
// // // // //                     ),
// // // // //                   }}
// // // // //                 />
// // // // //                 <TextField
// // // // //                   label="Descuento aplicado *"
// // // // //                   type="text"
// // // // //                   value={descuentoManual || ""}
// // // // //                   onChange={(e) => handleDescuentoManualChange(e.target.value)}
// // // // //                   fullWidth
// // // // //                   helperText="Ingrese el descuento manual en pesos"
// // // // //                   error={descuentoManual > totalSinDescuento}
// // // // //                   InputProps={{
// // // // //                     startAdornment: (
// // // // //                       <InputAdornment position="start">$</InputAdornment>
// // // // //                     ),
// // // // //                   }}
// // // // //                 />
// // // // //                 <TextField
// // // // //                   label="Total nuevo"
// // // // //                   value={formatCLP(totalConDescuento)}
// // // // //                   fullWidth
// // // // //                   helperText="Valor final de la oferta"
// // // // //                   InputProps={{
// // // // //                     readOnly: true,
// // // // //                     startAdornment: (
// // // // //                       <InputAdornment position="start">$</InputAdornment>
// // // // //                     ),
// // // // //                   }}
// // // // //                 />
// // // // //               </Box>

// // // // //               {descuentoManual > 0 && (
// // // // //                 <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
// // // // //                   <Typography variant="body2" color="primary">
// // // // //                     Descuento aplicado: {formatCLP(descuentoManual)}
// // // // //                   </Typography>
// // // // //                 </Box>
// // // // //               )}
// // // // //             </Box>
// // // // //           )}

// // // // //           {/* Fechas y Horas */}
// // // // //           <Box sx={{ display: "flex", gap: 2 }}>
// // // // //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// // // // //               <DatePicker
// // // // //                 label="Fecha Inicio"
// // // // //                 value={startDate}
// // // // //                 onChange={setStartDate}
// // // // //                 format="DD/MM/YYYY"
// // // // //                 slotProps={{ textField: { fullWidth: true } }}
// // // // //               />
// // // // //             </LocalizationProvider>
// // // // //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// // // // //               <DatePicker
// // // // //                 label="Fecha Término"
// // // // //                 value={endDate}
// // // // //                 onChange={setEndDate}
// // // // //                 format="DD/MM/YYYY"
// // // // //                 slotProps={{ textField: { fullWidth: true } }}
// // // // //               />
// // // // //             </LocalizationProvider>
// // // // //           </Box>

// // // // //           <Box sx={{ display: "flex", gap: 2 }}>
// // // // //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// // // // //               <TimeField
// // // // //                 label="Hora de Inicio"
// // // // //                 format="HH:mm"
// // // // //                 value={startTime}
// // // // //                 onChange={setStartTime}
// // // // //                 slotProps={{ textField: { fullWidth: true } }}
// // // // //               />
// // // // //             </LocalizationProvider>
// // // // //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// // // // //               <TimeField
// // // // //                 label="Hora de Término"
// // // // //                 format="HH:mm"
// // // // //                 value={endTime}
// // // // //                 onChange={setEndTime}
// // // // //                 slotProps={{ textField: { fullWidth: true } }}
// // // // //               />
// // // // //             </LocalizationProvider>
// // // // //           </Box>

// // // // //           {/* Días de la semana */}
// // // // //           <Box
// // // // //             sx={{
// // // // //               p: 2,
// // // // //               border: "1px solid #e0e0e0",
// // // // //               borderRadius: 1,
// // // // //               backgroundColor: "#fafafa",
// // // // //             }}
// // // // //           >
// // // // //             <Box
// // // // //               sx={{
// // // // //                 display: "flex",
// // // // //                 justifyContent: "space-between",
// // // // //                 alignItems: "center",
// // // // //                 mb: 1,
// // // // //               }}
// // // // //             >
// // // // //               <Typography variant="subtitle1" fontWeight="bold">
// // // // //                 Días de la Semana
// // // // //               </Typography>
// // // // //               <Box sx={{ display: "flex", gap: 1 }}>
// // // // //                 <Button
// // // // //                   size="small"
// // // // //                   variant="outlined"
// // // // //                   onClick={() => handleTodosLosDias(true)}
// // // // //                 >
// // // // //                   Todos
// // // // //                 </Button>
// // // // //                 <Button
// // // // //                   size="small"
// // // // //                   variant="outlined"
// // // // //                   onClick={() => handleTodosLosDias(false)}
// // // // //                 >
// // // // //                   Ninguno
// // // // //                 </Button>
// // // // //               </Box>
// // // // //             </Box>
// // // // //             <FormGroup
// // // // //               row
// // // // //               sx={{ display: "flex", justifyContent: "space-between" }}
// // // // //             >
// // // // //               {nombresDias.map((dia, index) => (
// // // // //                 <FormControlLabel
// // // // //                   key={index}
// // // // //                   control={
// // // // //                     <Checkbox
// // // // //                       checked={diasSemana[index]}
// // // // //                       onChange={() => handleDiaChange(index)}
// // // // //                       color="primary"
// // // // //                     />
// // // // //                   }
// // // // //                   label={dia}
// // // // //                 />
// // // // //               ))}
// // // // //             </FormGroup>
// // // // //           </Box>

// // // // //           {/* Tabla de productos seleccionados */}
// // // // //           {productosSeleccionados.length > 0 && !loadingProducts && (
// // // // //             <Box sx={{ mt: 2 }}>
// // // // //               <Typography variant="h6" gutterBottom>
// // // // //                 Productos Seleccionados ({productosSeleccionados.length})
// // // // //               </Typography>
// // // // //               <TableContainer component={Paper} elevation={2}>
// // // // //                 <Table size="small">
// // // // //                   <TableHead>
// // // // //                     <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
// // // // //                       <TableCell>
// // // // //                         <strong>Código</strong>
// // // // //                       </TableCell>
// // // // //                       <TableCell>
// // // // //                         <strong>Descripción</strong>
// // // // //                       </TableCell>
// // // // //                       <TableCell align="center">
// // // // //                         <strong>Precio Individual</strong>
// // // // //                       </TableCell>
// // // // //                       <TableCell align="center">
// // // // //                         <strong>Acciones</strong>
// // // // //                       </TableCell>
// // // // //                     </TableRow>
// // // // //                   </TableHead>
// // // // //                   <TableBody>
// // // // //                     {productosSeleccionados.map((producto) => (
// // // // //                       <TableRow key={producto.codbarra} hover>
// // // // //                         <TableCell>
// // // // //                           <Chip
// // // // //                             label={producto.codbarra}
// // // // //                             size="small"
// // // // //                             color="primary"
// // // // //                             variant="outlined"
// // // // //                           />
// // // // //                         </TableCell>
// // // // //                         <TableCell>
// // // // //                           <Typography variant="body2">
// // // // //                             {producto.descripcionProducto}
// // // // //                           </Typography>
// // // // //                         </TableCell>
// // // // //                         <TableCell align="center">
// // // // //                           <Typography variant="body2" fontWeight="bold">
// // // // //                             {formatCLP(producto.precioVenta)}
// // // // //                           </Typography>
// // // // //                         </TableCell>
// // // // //                         <TableCell align="center">
// // // // //                           <IconButton
// // // // //                             size="small"
// // // // //                             color="error"
// // // // //                             onClick={() =>
// // // // //                               handleEliminarProducto(producto.codbarra)
// // // // //                             }
// // // // //                             title="Eliminar"
// // // // //                           >
// // // // //                             <DeleteIcon fontSize="small" />
// // // // //                           </IconButton>
// // // // //                         </TableCell>
// // // // //                       </TableRow>
// // // // //                     ))}
// // // // //                   </TableBody>
// // // // //                 </Table>
// // // // //               </TableContainer>
// // // // //             </Box>
// // // // //           )}

// // // // //           <Box
// // // // //             sx={{
// // // // //               p: 2,
// // // // //               border: "1px solid #e0e0e0",
// // // // //               borderRadius: 1,
// // // // //               backgroundColor: "#fafafa",
// // // // //             }}
// // // // //           >
    
// // // // //       </DialogContent>
// // // // //       <DialogActions>
// // // // //         <Button onClick={onClose}>Cancelar</Button>
// // // // //         <Button
// // // // //           onClick={handleGuardar}
// // // // //           variant="contained"
// // // // //           disabled={productosSeleccionados.length === 0 || loadingProducts}
// // // // //         >
// // // // //           Guardar Cambios
// // // // //         </Button>
// // // // //       </DialogActions>
// // // // //     </Dialog>
// // // // //   );
// // // // // };

// // // // // export default DialogEditarOfertaComplementarias;

// // // // import React, { useState, useEffect, useContext, useCallback } from "react";
// // // // import {
// // // //   Dialog,
// // // //   DialogTitle,
// // // //   DialogContent,
// // // //   DialogActions,
// // // //   Button,
// // // //   TextField,
// // // //   Box,
// // // //   Typography,
// // // //   Table,
// // // //   TableBody,
// // // //   TableCell,
// // // //   TableContainer,
// // // //   TableHead,
// // // //   TableRow,
// // // //   Paper,
// // // //   IconButton,
// // // //   Chip,
// // // //   Alert,
// // // //   Checkbox,
// // // //   FormControlLabel,
// // // //   FormGroup,
// // // //   InputAdornment,
// // // //   CircularProgress,
// // // //   Switch,
// // // // } from "@mui/material";
// // // // import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// // // // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// // // // import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// // // // import { TimeField } from "@mui/x-date-pickers/TimeField";
// // // // import dayjs from "dayjs";
// // // // import DeleteIcon from "@mui/icons-material/Delete";
// // // // import Product from "../../Models/Product";
// // // // import Ofertas from "../../Models/Ofertas";
// // // // import SearchListOffers from "./SearchListOfertas";
// // // // import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

// // // // const DialogEditarOfertaComplementarias = ({
// // // //   open,
// // // //   onClose,
// // // //   ofertaEditar,
// // // //   onOfertaActualizada,
// // // // }) => {
// // // //   const { showLoading, hideLoading, showMessage, showConfirm } = useContext(
// // // //     SelectedOptionsContext
// // // //   );

// // // //   // Estados del formulario
// // // //   const [nombreOferta, setNombreOferta] = useState("");
// // // //   const [startDate, setStartDate] = useState(null);
// // // //   const [endDate, setEndDate] = useState(null);
// // // //   const [startTime, setStartTime] = useState(null);
// // // //   const [endTime, setEndTime] = useState(null);
// // // //   const [productosSeleccionados, setProductosSeleccionados] = useState([]);
// // // //   const [diasSemana, setDiasSemana] = useState([true, true, true, true, true, true, true]);
// // // //   const [ofertaActiva, setOfertaActiva] = useState(true);

// // // //   // Estados calculados
// // // //   const [totalSinDescuento, setTotalSinDescuento] = useState(0);
// // // //   const [descuentoManual, setDescuentoManual] = useState(0);
// // // //   const [totalConDescuento, setTotalConDescuento] = useState(0);
// // // //   const [valorOriginalGuardado, setValorOriginalGuardado] = useState(0);
  
// // // //   // Estado de carga
// // // //   const [loadingProducts, setLoadingProducts] = useState(false);
// // // //   const [clearSearch, setClearSearch] = useState(false);
// // // //   const [refresh, setRefresh] = useState(false);

// // // //   const nombresDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

// // // //   // Función para cargar precio de un producto por código de barra
// // // //   const cargarPrecioProducto = async (codbarra) => {
// // // //     return new Promise((resolve, reject) => {
// // // //       const productModel = Product.getInstance();
// // // //       productModel.findByCodigoBarras(
// // // //         { codigoProducto: codbarra, codigoCliente: null },
// // // //         (productos, response) => {
// // // //           if (productos && productos.length > 0) {
// // // //             const producto = productos[0];
// // // //             resolve({
// // // //               precioVenta: Number(producto.precioVenta || 0),
// // // //               nombre: producto.nombre || producto.descripcion || "",
// // // //             });
// // // //           } else {
// // // //             resolve({ precioVenta: 0, nombre: "" });
// // // //           }
// // // //         },
// // // //         (error) => {
// // // //           console.error(`Error al cargar precio del producto ${codbarra}:`, error);
// // // //           resolve({ precioVenta: 0, nombre: "" });
// // // //         }
// // // //       );
// // // //     });
// // // //   };

// // // //   // Cargar datos de la oferta cuando se abre el diálogo
// // // //   useEffect(() => {
// // // //     if (open && ofertaEditar) {
// // // //       console.log("Cargando oferta para editar:", ofertaEditar);
      
// // // //       // Cargar datos básicos
// // // //       setNombreOferta(ofertaEditar.descripcion || "");
// // // //       setOfertaActiva(ofertaEditar.activo ?? true);

// // // //       // Cargar fechas
// // // //       if (ofertaEditar.fechaInicial) {
// // // //         setStartDate(dayjs(ofertaEditar.fechaInicial));
// // // //       }
// // // //       if (ofertaEditar.fechaFinal) {
// // // //         setEndDate(dayjs(ofertaEditar.fechaFinal));
// // // //       }

// // // //       // Cargar horas
// // // //       if (ofertaEditar.horaInicio) {
// // // //         const [hours, minutes] = ofertaEditar.horaInicio.split(":");
// // // //         setStartTime(dayjs().hour(parseInt(hours)).minute(parseInt(minutes)));
// // // //       }
// // // //       if (ofertaEditar.horaFin) {
// // // //         const [hours, minutes] = ofertaEditar.horaFin.split(":");
// // // //         setEndTime(dayjs().hour(parseInt(hours)).minute(parseInt(minutes)));
// // // //       }

// // // //       // Cargar días de la semana
// // // //       if (ofertaEditar.diasSemana) {
// // // //         const diasArray = ofertaEditar.diasSemana.split("").map(d => d === "1");
// // // //         setDiasSemana(diasArray);
// // // //       }

// // // //       // Guardar el valor original de la oferta
// // // //       if (ofertaEditar.oferta_Regla?.valor) {
// // // //         setValorOriginalGuardado(ofertaEditar.oferta_Regla.valor);
// // // //       }

// // // //       // Cargar productos con sus precios reales
// // // //       if (ofertaEditar.products && ofertaEditar.products.length > 0) {
// // // //         cargarProductosConPrecios(ofertaEditar.products);
// // // //       }
// // // //     }
// // // //   }, [open, ofertaEditar]);

// // // //   // Función para cargar productos con sus precios reales desde la API
// // // //   const cargarProductosConPrecios = async (products) => {
// // // //     setLoadingProducts(true);
// // // //     console.log("Cargando precios para productos:", products);

// // // //     try {
// // // //       const productosConPrecios = await Promise.all(
// // // //         products.map(async (prod) => {
// // // //           const { precioVenta, nombre } = await cargarPrecioProducto(prod.codbarra);
// // // //           return {
// // // //             codbarra: prod.codbarra,
// // // //             descripcionProducto: nombre || prod.descripcion,
// // // //             cantidad: 1,
// // // //             precioVenta: precioVenta,
// // // //           };
// // // //         })
// // // //       );

// // // //       console.log("Productos con precios cargados:", productosConPrecios);
// // // //       setProductosSeleccionados(productosConPrecios);
// // // //     } catch (error) {
// // // //       console.error("Error al cargar precios de productos:", error);
// // // //       showMessage("Error al cargar los precios de los productos");
// // // //     } finally {
// // // //       setLoadingProducts(false);
// // // //     }
// // // //   };

// // // //   // CALCULO PRINCIPAL
// // // //   const calcularTotales = useCallback(() => {
// // // //     console.log("=== CALCULANDO TOTALES EN EDICIÓN ===");
// // // //     console.log("Productos:", productosSeleccionados);
// // // //     console.log("Valor original guardado:", valorOriginalGuardado);

// // // //     if (productosSeleccionados.length === 0) {
// // // //       setTotalSinDescuento(0);
// // // //       setTotalConDescuento(0);
// // // //       setDescuentoManual(0);
// // // //       return;
// // // //     }

// // // //     // 1) Calcular total sin descuento (suma de todos los precios)
// // // //     const totalOriginal = productosSeleccionados.reduce(
// // // //       (sum, p) => sum + Number(p.precioVenta || 0),
// // // //       0
// // // //     );
// // // //     console.log("Total sin descuento:", totalOriginal);
// // // //     setTotalSinDescuento(totalOriginal);

// // // //     // 2) Si hay un valor guardado, calcular el descuento basado en ese valor
// // // //     if (valorOriginalGuardado > 0 && totalOriginal > 0) {
// // // //       const descuentoCalculado = totalOriginal - valorOriginalGuardado;
// // // //       console.log("Descuento calculado desde valor guardado:", descuentoCalculado);
// // // //       setDescuentoManual(descuentoCalculado);
// // // //       setTotalConDescuento(valorOriginalGuardado);
// // // //     } else {
// // // //       // 3) Si no hay valor guardado, usar descuento manual
// // // //       const totalConDescuentoCalculado = totalOriginal - descuentoManual;
// // // //       console.log("Total con descuento manual:", totalConDescuentoCalculado);
// // // //       setTotalConDescuento(totalConDescuentoCalculado);
// // // //     }
// // // //   }, [productosSeleccionados, descuentoManual, valorOriginalGuardado]);

// // // //   // Ejecutar cálculo cuando cambien las dependencias
// // // //   useEffect(() => {
// // // //     calcularTotales();
// // // //   }, [calcularTotales]);

// // // //   /** Convierte array de booleanos a string de días */
// // // //   const convertirDiasAString = (diasArray) => {
// // // //     return diasArray.map((dia) => (dia ? "1" : "0")).join("");
// // // //   };

// // // //   /** Maneja el cambio de selección de un día específico */
// // // //   const handleDiaChange = (index) => {
// // // //     const nuevosDias = [...diasSemana];
// // // //     nuevosDias[index] = !nuevosDias[index];
// // // //     setDiasSemana(nuevosDias);
// // // //   };

// // // //   /** Selecciona o deselecciona todos los días */
// // // //   const handleTodosLosDias = (seleccionar) => {
// // // //     setDiasSemana(new Array(7).fill(seleccionar));
// // // //   };

// // // //   /** Elimina un producto de la lista */
// // // //   const handleEliminarProducto = (codbarra) => {
// // // //     console.log("Eliminando producto:", codbarra);
// // // //     setProductosSeleccionados((prev) =>
// // // //       prev.filter((p) => p.codbarra !== codbarra)
// // // //     );
// // // //     // Resetear el valor guardado al modificar productos
// // // //     setValorOriginalGuardado(0);
// // // //   };

// // // //   /** Agrega un producto a la lista de productos seleccionados */
// // // //   const handleProductoSeleccionado = async (producto) => {
// // // //     const yaExiste = productosSeleccionados.some(
// // // //       (p) => p.codbarra === producto.codbarra
// // // //     );
// // // //     if (yaExiste) {
// // // //       showMessage("Este producto ya ha sido agregado");
// // // //       return;
// // // //     }

// // // //     // Cargar el precio real del producto
// // // //     const { precioVenta, nombre } = await cargarPrecioProducto(
// // // //       producto.codbarra || producto.idProducto?.toString()
// // // //     );

// // // //     const nuevoProducto = {
// // // //       codbarra: producto.codbarra || producto.idProducto?.toString(),
// // // //       descripcionProducto: nombre || producto.nombre || producto.descripcion,
// // // //       cantidad: 1,
// // // //       precioVenta: precioVenta,
// // // //     };

// // // //     console.log("Agregando nuevo producto:", nuevoProducto);
// // // //     setProductosSeleccionados((prev) => [...prev, nuevoProducto]);
// // // //     setClearSearch((prev) => !prev);
    
// // // //     // Resetear el valor guardado al agregar productos
// // // //     setValorOriginalGuardado(0);
// // // //   };

// // // //   /** Maneja el cambio del descuento manual */
// // // //   const handleDescuentoManualChange = (value) => {
// // // //     const numericValue = value.replace(/[^0-9]/g, "");

// // // //     if (numericValue === "" || numericValue === "0") {
// // // //       setDescuentoManual(0);
// // // //       setValorOriginalGuardado(0);
// // // //     } else {
// // // //       const descuento = parseInt(numericValue, 10);
// // // //       if (descuento > totalSinDescuento) {
// // // //         showMessage("El descuento no puede ser mayor al total de los productos");
// // // //         setDescuentoManual(totalSinDescuento);
// // // //       } else {
// // // //         setDescuentoManual(descuento);
// // // //         setValorOriginalGuardado(0); // Resetear valor guardado al modificar manualmente
// // // //       }
// // // //     }
// // // //   };

// // // //   /** Valida el formulario */
// // // //   const validarFormulario = () => {
// // // //     if (productosSeleccionados.length === 0) {
// // // //       showMessage("Debe tener al menos un producto");
// // // //       return false;
// // // //     }
// // // //     if (!nombreOferta.trim()) {
// // // //       showMessage("Debe ingresar un nombre para la oferta");
// // // //       return false;
// // // //     }
// // // //     if (!startDate || !endDate) {
// // // //       showMessage("Debe seleccionar las fechas de inicio y término");
// // // //       return false;
// // // //     }
// // // //     if (!startTime || !endTime) {
// // // //       showMessage("Debe seleccionar las horasas de inicio y término");
// // // //       return false;
// // // //     }

// // // //     const totalOriginal = productosSeleccionados.reduce(
// // // //       (sum, p) => sum + Number(p.precioVenta || 0),
// // // //       0
// // // //     );

// // // //     if (totalOriginal <= 0) {
// // // //       showMessage("El total de los productos debe ser mayor que 0");
// // // //       return false;
// // // //     }

// // // //     if (descuentoManual < 0) {
// // // //       showMessage("El descuento no puede ser negativo");
// // // //       return false;
// // // //     }

// // // //     if (descuentoManual >= totalOriginal) {
// // // //       showMessage("El descuento debe ser menor al total de los productos");
// // // //       return false;
// // // //     }

// // // //     return true;
// // // //   };

// // // //   /** Guarda los cambios de la oferta */
// // // //   const handleGuardar = () => {
// // // //     if (!validarFormulario()) {
// // // //       return;
// // // //     }

// // // //     const listaParaEnviar = productosSeleccionados.map((p) => ({
// // // //       codbarra: p.codbarra,
// // // //       descripcionProducto: p.descripcionProducto,
// // // //       cantidad: 1,
// // // //       porcDescuento: 0,
// // // //     }));

// // // //     const ofertaActualizada = {
// // // //       codigoOferta: ofertaEditar.codigoOferta,
// // // //       codigoTipo: ofertaEditar.codigoTipo,
// // // //       descripcion: nombreOferta,
// // // //       fechaInicial: startDate.toISOString(),
// // // //       fechaFinal: endDate.toISOString(),
// // // //       horaInicio: startTime ? startTime.format("HH:mm") : null,
// // // //       horaFin: endTime ? endTime.format("HH:mm") : null,
// // // //       diasSemana: convertirDiasAString(diasSemana),
// // // //       fAplicaMix: true,
// // // //       activo: ofertaActiva,
// // // //       oferta_Regla: {
// // // //         signo: "=",
// // // //         cantidad: productosSeleccionados.length,
// // // //         tipoDescuento: "$",
// // // //         valor: totalConDescuento,
// // // //         aplicacion: "",
// // // //       },
// // // //       oferta_ListaCanasta: listaParaEnviar,
// // // //     };

// // // //     console.log("Guardando oferta actualizada:", ofertaActualizada);
    
// // // //     showLoading();
// // // //     Ofertas.updateOferta(
// // // //       ofertaActualizada,
// // // //       (data, response) => {
// // // //         hideLoading();
// // // //         showMessage("Oferta actualizada exitosamente");
// // // //         onOfertaActualizada();
// // // //         onClose();
// // // //       },
// // // //       (error) => {
// // // //         hideLoading();
// // // //         console.error("Error al actualizar oferta:", error);
// // // //         const mensajeError =
// // // //           error?.message || error?.descripcion || "Error desconocido";
// // // //         showMessage(`Error al actualizar la oferta: ${mensajeError}`);
// // // //       }
// // // //     );
// // // //   };

// // // //   // Formateo moneda
// // // //   const formatCLP = (n) => {
// // // //     if (n == null || isNaN(n)) return "$0";
// // // //     return `$${n.toLocaleString("es-CL")}`;
// // // //   };

// // // //   return (
// // // //     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
// // // //       <DialogTitle>Editar Oferta de Productos Complementarios</DialogTitle>
// // // //       <DialogContent>
// // // //         <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
// // // //           {/* Nombre de la oferta */}
// // // //           <TextField
// // // //             label="Nombre de la Oferta"
// // // //             type="text"
// // // //             value={nombreOferta}
// // // //             onChange={(e) => setNombreOferta(e.target.value)}
// // // //             fullWidth
// // // //           />

// // // //           {/* Componente de búsqueda de productos */}
// // // //           <Box
// // // //             sx={{
// // // //               p: 2,
// // // //               border: "1px solid #e0e0e0",
// // // //               borderRadius: 1,
// // // //               backgroundColor: "#fafafa",
// // // //             }}
// // // //           >
// // // //             <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
// // // //               Agregar Productos
// // // //             </Typography>
// // // //             <SearchListOffers
// // // //               refresh={refresh}
// // // //               setRefresh={setRefresh}
// // // //               onProductoSeleccionado={handleProductoSeleccionado}
// // // //               clearSearch={clearSearch}
// // // //             />
// // // //           </Box>

// // // //           {/* Indicador de carga de productos */}
// // // //           {loadingProducts && (
// // // //             <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
// // // //               <CircularProgress size={30} />
// // // //               <Typography variant="body2" sx={{ ml: 2 }}>
// // // //                 Cargando precios de productos...
// // // //               </Typography>
// // // //             </Box>
// // // //           )}

// // // //           {/* Resumen de la oferta */}
// // // //           {productosSeleccionados.length > 0 && !loadingProducts && (
// // // //             <Box
// // // //               sx={{
// // // //                 display: "flex",
// // // //                 flexDirection: "column",
// // // //                 gap: 2,
// // // //                 p: 2,
// // // //                 backgroundColor: "#f5f5f5",
// // // //                 borderRadius: 1,
// // // //               }}
// // // //             >
// // // //               <Typography variant="h6">Resumen de la Oferta</Typography>

// // // //               <Box sx={{ display: "flex", gap: 2 }}>
// // // //                 <TextField
// // // //                   label="Valor actual (Total productos)"
// // // //                   value={formatCLP(totalSinDescuento)}
// // // //                   fullWidth
// // // //                   helperText="Suma total de todos los productos"
// // // //                   InputProps={{
// // // //                     readOnly: true,
// // // //                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
// // // //                   }}
// // // //                 />
// // // //                 <TextField
// // // //                   label="Descuento aplicado *"
// // // //                   type="text"
// // // //                   value={descuentoManual || ""}
// // // //                   onChange={(e) => handleDescuentoManualChange(e.target.value)}
// // // //                   fullWidth
// // // //                   helperText="Ingrese el descuento manual en pesos"
// // // //                   error={descuentoManual > totalSinDescuento}
// // // //                   InputProps={{
// // // //                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
// // // //                   }}
// // // //                 />
// // // //                 <TextField
// // // //                   label="Total nuevo"
// // // //                   value={formatCLP(totalConDescuento)}
// // // //                   fullWidth
// // // //                   helperText="Valor final de la oferta"
// // // //                   InputProps={{
// // // //                     readOnly: true,
// // // //                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
// // // //                   }}
// // // //                 />
// // // //               </Box>

// // // //               {descuentoManual > 0 && (
// // // //                 <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
// // // //                   <Typography variant="body2" color="primary">
// // // //                     Descuento aplicado: {formatCLP(descuentoManual)}
// // // //                   </Typography>
// // // //                 </Box>
// // // //               )}
// // // //             </Box>
// // // //           )}

// // // //           {/* Fechas y Horas */}
// // // //           <Box sx={{ display: "flex", gap: 2 }}>
// // // //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// // // //               <DatePicker
// // // //                 label="Fecha Inicio"
// // // //                 value={startDate}
// // // //                 onChange={setStartDate}
// // // //                 format="DD/MM/YYYY"
// // // //                 slotProps={{ textField: { fullWidth: true } }}
// // // //               />
// // // //             </LocalizationProvider>
// // // //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// // // //               <DatePicker
// // // //                 label="Fecha Término"
// // // //                 value={endDate}
// // // //                 onChange={setEndDate}
// // // //                 format="DD/MM/YYYY"
// // // //                 slotProps={{ textField: { fullWidth: true } }}
// // // //               />
// // // //             </LocalizationProvider>
// // // //           </Box>

// // // //           <Box sx={{ display: "flex", gap: 2 }}>
// // // //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// // // //               <TimeField
// // // //                 label="Hora de Inicio"
// // // //                 format="HH:mm"
// // // //                 value={startTime}
// // // //                 onChange={setStartTime}
// // // //                 slotProps={{ textField: { fullWidth: true } }}
// // // //               />
// // // //             </LocalizationProvider>
// // // //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// // // //               <TimeField
// // // //                 label="Hora de Término"
// // // //                 format="HH:mm"
// // // //                 value={endTime}
// // // //                 onChange={setEndTime}
// // // //                 slotProps={{ textField: { fullWidth: true } }}
// // // //               />
// // // //             </LocalizationProvider>
// // // //           </Box>

// // // //           {/* Días de la semana */}
// // // //           <Box
// // // //             sx={{
// // // //               p: 2,
// // // //               border: "1px solid #e0e0e0",
// // // //               borderRadius: 1,
// // // //               backgroundColor: "#fafafa",
// // // //             }}
// // // //           >
// // // //             <Box
// // // //               sx={{
// // // //                 display: "flex",
// // // //                 justifyContent: "space-between",
// // // //                 alignItems: "center",
// // // //                 mb: 1,
// // // //               }}
// // // //             >
// // // //               <Typography variant="subtitle1" fontWeight="bold">
// // // //                 Días de la Semana
// // // //               </Typography>
// // // //               <Box sx={{ display: "flex", gap: 1 }}>
// // // //                 <Button
// // // //                   size="small"
// // // //                   variant="outlined"
// // // //                   onClick={() => handleTodosLosDias(true)}
// // // //                 >
// // // //                   Todos
// // // //                 </Button>
// // // //                 <Button
// // // //                   size="small"
// // // //                   variant="outlined"
// // // //                   onClick={() => handleTodosLosDias(false)}
// // // //                 >
// // // //                   Ninguno
// // // //                 </Button>
// // // //               </Box>
// // // //             </Box>
// // // //             <FormGroup row sx={{ display: "flex", justifyContent: "space-between" }}>
// // // //               {nombresDias.map((dia, index) => (
// // // //                 <FormControlLabel
// // // //                   key={index}
// // // //                   control={
// // // //                     <Checkbox
// // // //                       checked={diasSemana[index]}
// // // //                       onChange={() => handleDiaChange(index)}
// // // //                       color="primary"
// // // //                     />
// // // //                   }
// // // //                   label={dia}
// // // //                 />
// // // //               ))}
// // // //             </FormGroup>
// // // //           </Box>

// // // //           {/* Tabla de productos seleccionados */}
// // // //           {productosSeleccionados.length > 0 && !loadingProducts && (
// // // //             <Box sx={{ mt: 2 }}>
// // // //               <Typography variant="h6" gutterBottom>
// // // //                 Productos Seleccionados ({productosSeleccionados.length})
// // // //               </Typography>
// // // //               <TableContainer component={Paper} elevation={2}>
// // // //                 <Table size="small">
// // // //                   <TableHead>
// // // //                     <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
// // // //                       <TableCell><strong>Código</strong></TableCell>
// // // //                       <TableCell><strong>Descripción</strong></TableCell>
// // // //                       <TableCell align="center"><strong>Precio Individual</strong></TableCell>
// // // //                       <TableCell align="center"><strong>Acciones</strong></TableCell>
// // // //                     </TableRow>
// // // //                   </TableHead>
// // // //                   <TableBody>
// // // //                     {productosSeleccionados.map((producto) => (
// // // //                       <TableRow key={producto.codbarra} hover>
// // // //                         <TableCell>
// // // //                           <Chip label={producto.codbarra} size="small" color="primary" variant="outlined" />
// // // //                         </TableCell>
// // // //                         <TableCell>
// // // //                           <Typography variant="body2">{producto.descripcionProducto}</Typography>
// // // //                         </TableCell>
// // // //                         <TableCell align="center">
// // // //                           <Typography variant="body2" fontWeight="bold">
// // // //                             {formatCLP(producto.precioVenta)}
// // // //                           </Typography>
// // // //                         </TableCell>
// // // //                         <TableCell align="center">
// // // //                           <IconButton
// // // //                             size="small"
// // // //                             color="error"
// // // //                             onClick={() => handleEliminarProducto(producto.codbarra)}
// // // //                             title="Eliminar"
// // // //                           >
// // // //                             <DeleteIcon fontSize="small" />
// // // //                           </IconButton>
// // // //                         </TableCell>
// // // //                       </TableRow>
// // // //                     ))}
// // // //                   </TableBody>
// // // //                 </Table>
// // // //               </TableContainer>
// // // //             </Box>
// // // //           )}

// // // // <Box
// // // //               sx={{
// // // //                 display: "flex",
// // // //                 alignItems: "center",
// // // //                 justifyContent: "space-between",
// // // //               }}
// // // //             >
// // // //               <Box>
// // // //                 <Typography variant="subtitle1" fontWeight="bold">
// // // //                   Estado de la Oferta
// // // //                 </Typography>
// // // //                 <Typography variant="caption" color="textSecondary">
// // // //                   Define si la oferta estará activa o inactiva
// // // //                 </Typography>
// // // //               </Box>
// // // //               <FormControlLabel
// // // //                 control={
// // // //                   <Switch
// // // //                     checked={ofertaActiva}
// // // //                     onChange={(e) => setOfertaActiva(e.target.checked)}
// // // //                     color="success"
// // // //                   />
// // // //                 }
// // // //                 label={
// // // //                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
// // // //                     <Typography variant="body2" fontWeight="bold">
// // // //                       {ofertaActiva ? "Activa" : "Inactiva"}
// // // //                     </Typography>
// // // //                     <Chip
// // // //                       label={ofertaActiva ? "ON" : "OFF"}
// // // //                       size="small"
// // // //                       color={ofertaActiva ? "success" : "default"}
// // // //                     />
// // // //                   </Box>
// // // //                 }
// // // //                 labelPlacement="start"
// // // //               />
// // // //             </Box>
// // // //           </Box>
      
// // // //       </DialogContent>
// // // //       <DialogActions>
// // // //         <Button onClick={onClose}>Cancelar</Button>
// // // //         <Button
// // // //           onClick={handleGuardar}
// // // //           variant="contained"
// // // //           disabled={productosSeleccionados.length === 0 || loadingProducts}
// // // //         >
// // // //           Guardar Cambios
// // // //         </Button>
// // // //       </DialogActions>
// // // //     </Dialog>
// // // //   );
// // // // };

// // // // export default DialogEditarOfertaComplementarias;
// // // import React, { useState, useEffect, useContext, useCallback } from "react";
// // // import {
// // //   Dialog,
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
// // //   Checkbox,
// // //   FormControlLabel,
// // //   FormGroup,
// // //   InputAdornment,
// // //   CircularProgress,
// // //   Switch,
// // // } from "@mui/material";
// // // import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// // // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// // // import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// // // import { TimeField } from "@mui/x-date-pickers/TimeField";
// // // import dayjs from "dayjs";
// // // import DeleteIcon from "@mui/icons-material/Delete";
// // // import Product from "../../Models/Product";
// // // import Ofertas from "../../Models/Ofertas";
// // // import SearchListOffers from "./SearchListOfertas";
// // // import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

// // // const DialogEditarOfertaComplementarias = ({
// // //   open,
// // //   onClose,
// // //   ofertaEditar,
// // //   onOfertaActualizada,
// // // }) => {
// // //   const { showLoading, hideLoading, showMessage, showConfirm } = useContext(
// // //     SelectedOptionsContext
// // //   );

// // //   // Estados del formulario
// // //   const [nombreOferta, setNombreOferta] = useState("");
// // //   const [startDate, setStartDate] = useState(null);
// // //   const [endDate, setEndDate] = useState(null);
// // //   const [startTime, setStartTime] = useState(null);
// // //   const [endTime, setEndTime] = useState(null);
// // //   const [productosSeleccionados, setProductosSeleccionados] = useState([]);
// // //   const [diasSemana, setDiasSemana] = useState([true, true, true, true, true, true, true]);
// // //   const [ofertaActiva, setOfertaActiva] = useState(true);

// // //   // Estados calculados
// // //   const [totalSinDescuento, setTotalSinDescuento] = useState(0);
// // //   const [descuentoManual, setDescuentoManual] = useState(0);
// // //   const [totalConDescuento, setTotalConDescuento] = useState(0);
// // //   const [valorOriginalGuardado, setValorOriginalGuardado] = useState(0);
  
// // //   // Estado de carga
// // //   const [loadingProducts, setLoadingProducts] = useState(false);
// // //   const [clearSearch, setClearSearch] = useState(false);
// // //   const [refresh, setRefresh] = useState(false);
// // //   const [isInitialLoad, setIsInitialLoad] = useState(true);

// // //   const nombresDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

// // //   // Función para cargar precio de un producto por código de barra
// // //   const cargarPrecioProducto = async (codbarra) => {
// // //     return new Promise((resolve, reject) => {
// // //       // Asegúrate de que codbarra sea string
// // //       const codigoBarrasStr = codbarra ? codbarra.toString() : "";
      
// // //       if (!codigoBarrasStr) {
// // //         resolve({ precioVenta: 0, nombre: "" });
// // //         return;
// // //       }

// // //       const productModel = Product.getInstance();
      
// // //       // Buscar por código de barras
// // //       productModel.findByCodigoBarras(
// // //         { codigoProducto: codigoBarrasStr },
// // //         (productos, response) => {
// // //           console.log(`Respuesta para código ${codigoBarrasStr}:`, productos);
// // //           if (productos && Array.isArray(productos) && productos.length > 0) {
// // //             const producto = productos[0];
// // //             resolve({
// // //               precioVenta: Number(producto.precioVenta || producto.precio || 0),
// // //               nombre: producto.nombre || producto.descripcion || "",
// // //             });
// // //           } else {
// // //             // Si no encuentra, buscar en la lista general
// // //             productModel.getAllProducts(
// // //               (allProducts) => {
// // //                 const encontrado = allProducts.find(p => 
// // //                   p.codbarra === codigoBarrasStr || 
// // //                   p.codigoProducto === codigoBarrasStr ||
// // //                   p.idProducto?.toString() === codigoBarrasStr
// // //                 );
// // //                 resolve({
// // //                   precioVenta: encontrado ? Number(encontrado.precioVenta || 0) : 0,
// // //                   nombre: encontrado ? (encontrado.nombre || encontrado.descripcion) : "",
// // //                 });
// // //               },
// // //               () => resolve({ precioVenta: 0, nombre: "" })
// // //             );
// // //           }
// // //         },
// // //         (error) => {
// // //           console.error(`Error al cargar precio del producto ${codigoBarrasStr}:`, error);
// // //           resolve({ precioVenta: 0, nombre: "" });
// // //         }
// // //       );
// // //     });
// // //   };

// // //   // Cargar datos de la oferta cuando se abre el diálogo
// // //   useEffect(() => {
// // //     if (open && ofertaEditar) {
// // //       console.log("Cargando oferta para editar:", ofertaEditar);
      
// // //       // Limpiar estados previos
// // //       setProductosSeleccionados([]);
// // //       setDescuentoManual(0);
// // //       setValorOriginalGuardado(0);
// // //       setIsInitialLoad(true);
      
// // //       // Cargar datos básicos
// // //       setNombreOferta(ofertaEditar.descripcion || "");
// // //       setOfertaActiva(ofertaEditar.activo ?? true);

// // //       // Cargar fechas
// // //       if (ofertaEditar.fechaInicial) {
// // //         setStartDate(dayjs(ofertaEditar.fechaInicial));
// // //       }
// // //       if (ofertaEditar.fechaFinal) {
// // //         setEndDate(dayjs(ofertaEditar.fechaFinal));
// // //       }

// // //       // Cargar horas
// // //       if (ofertaEditar.horaInicio) {
// // //         const [hours, minutes] = ofertaEditar.horaInicio.split(":");
// // //         setStartTime(dayjs().hour(parseInt(hours)).minute(parseInt(minutes)));
// // //       }
// // //       if (ofertaEditar.horaFin) {
// // //         const [hours, minutes] = ofertaEditar.horaFin.split(":");
// // //         setEndTime(dayjs().hour(parseInt(hours)).minute(parseInt(minutes)));
// // //       }

// // //       // Cargar días de la semana
// // //       if (ofertaEditar.diasSemana) {
// // //         const diasArray = ofertaEditar.diasSemana.split("").map(d => d === "1");
// // //         setDiasSemana(diasArray);
// // //       }

// // //       // Guardar el valor original de la oferta
// // //       if (ofertaEditar.oferta_Regla?.valor) {
// // //         setValorOriginalGuardado(ofertaEditar.oferta_Regla.valor);
// // //       }

// // //       // Cargar productos - buscar en ambos lugares
// // //       let productosACargar = [];
      
// // //       if (ofertaEditar.oferta_ListaCanasta && ofertaEditar.oferta_ListaCanasta.length > 0) {
// // //         productosACargar = ofertaEditar.oferta_ListaCanasta;
// // //       } else if (ofertaEditar.products && ofertaEditar.products.length > 0) {
// // //         // Transformar formato de products
// // //         productosACargar = ofertaEditar.products.map(p => ({
// // //           codbarra: p.codbarra,
// // //           descripcionProducto: p.descripcion,
// // //           cantidad: 1,
// // //           porcDescuento: 0
// // //         }));
// // //       }
      
// // //       if (productosACargar.length > 0) {
// // //         cargarProductosConPrecios(productosACargar);
// // //       }
// // //     }
// // //   }, [open, ofertaEditar]);

// // //   // Función para cargar productos con sus precios reales desde la API
// // //   const cargarProductosConPrecios = async (products) => {
// // //     setLoadingProducts(true);
// // //     console.log("Cargando precios para productos:", products);

// // //     try {
// // //       const productosConPrecios = await Promise.all(
// // //         products.map(async (prod) => {
// // //           const { precioVenta, nombre } = await cargarPrecioProducto(prod.codbarra);
// // //           return {
// // //             codbarra: prod.codbarra,
// // //             descripcionProducto: nombre || prod.descripcionProducto || prod.descripcion,
// // //             cantidad: 1,
// // //             precioVenta: precioVenta,
// // //           };
// // //         })
// // //       );

// // //       console.log("Productos con precios cargados:", productosConPrecios);
// // //       setProductosSeleccionados(productosConPrecios);
// // //     } catch (error) {
// // //       console.error("Error al cargar precios de productos:", error);
// // //       showMessage("Error al cargar los precios de los productos");
// // //     } finally {
// // //       setLoadingProducts(false);
// // //     }
// // //   };

// // //   // CALCULO PRINCIPAL - CORREGIDO
// // //   const calcularTotales = useCallback(() => {
// // //     console.log("=== CALCULANDO TOTALES EN EDICIÓN ===");
// // //     console.log("Productos:", productosSeleccionados);
// // //     console.log("Valor original guardado:", valorOriginalGuardado);
// // //     console.log("Descuento manual actual:", descuentoManual);
// // //     console.log("Es carga inicial:", isInitialLoad);

// // //     if (productosSeleccionados.length === 0) {
// // //       setTotalSinDescuento(0);
// // //       setTotalConDescuento(0);
// // //       setDescuentoManual(0);
// // //       return;
// // //     }

// // //     // Calcular total sin descuento
// // //     const totalOriginal = productosSeleccionados.reduce(
// // //       (sum, p) => sum + Number(p.precioVenta || 0),
// // //       0
// // //     );
// // //     console.log("Total sin descuento:", totalOriginal);
// // //     setTotalSinDescuento(totalOriginal);

// // //     // Solo calcular descuento si valorOriginalGuardado está establecido Y es la primera vez
// // //     if (isInitialLoad && valorOriginalGuardado > 0 && totalOriginal > 0) {
// // //       const descuentoCalculado = Math.max(0, totalOriginal - valorOriginalGuardado);
// // //       console.log("Descuento calculado desde valor guardado:", descuentoCalculado);
// // //       setDescuentoManual(descuentoCalculado);
// // //       setTotalConDescuento(valorOriginalGuardado);
// // //       setIsInitialLoad(false); // Marcar que ya procesamos la carga inicial
// // //     } else {
// // //       // Usar descuento manual actual
// // //       const totalConDescuentoCalculado = Math.max(0, totalOriginal - descuentoManual);
// // //       console.log("Total con descuento manual:", totalConDescuentoCalculado);
// // //       setTotalConDescuento(totalConDescuentoCalculado);
// // //     }
// // //   }, [productosSeleccionados, descuentoManual, valorOriginalGuardado, isInitialLoad]);

// // //   // Ejecutar cálculo cuando cambien las dependencias
// // //   useEffect(() => {
// // //     const timer = setTimeout(() => {
// // //       calcularTotales();
// // //     }, 100);
// // //     return () => clearTimeout(timer);
// // //   }, [productosSeleccionados, descuentoManual, valorOriginalGuardado]);

// // //   /** Convierte array de booleanos a string de días */
// // //   const convertirDiasAString = (diasArray) => {
// // //     return diasArray.map((dia) => (dia ? "1" : "0")).join("");
// // //   };

// // //   /** Maneja el cambio de selección de un día específico */
// // //   const handleDiaChange = (index) => {
// // //     const nuevosDias = [...diasSemana];
// // //     nuevosDias[index] = !nuevosDias[index];
// // //     setDiasSemana(nuevosDias);
// // //   };

// // //   /** Selecciona o deselecciona todos los días */
// // //   const handleTodosLosDias = (seleccionar) => {
// // //     setDiasSemana(new Array(7).fill(seleccionar));
// // //   };

// // //   /** Elimina un producto de la lista */
// // //   const handleEliminarProducto = (codbarra) => {
// // //     console.log("Eliminando producto:", codbarra);
// // //     const nuevosProductos = productosSeleccionados.filter((p) => p.codbarra !== codbarra);
// // //     setProductosSeleccionados(nuevosProductos);
    
// // //     // Si se elimina un producto, resetear el valor guardado
// // //     if (nuevosProductos.length === 0) {
// // //       setValorOriginalGuardado(0);
// // //       setDescuentoManual(0);
// // //     }
// // //   };

// // //   /** Agrega un producto a la lista de productos seleccionados */
// // //   const handleProductoSeleccionado = async (producto) => {
// // //     const yaExiste = productosSeleccionados.some(
// // //       (p) => p.codbarra === producto.codbarra || 
// // //              p.codbarra === producto.idProducto?.toString()
// // //     );
// // //     if (yaExiste) {
// // //       showMessage("Este producto ya ha sido agregado");
// // //       return;
// // //     }

// // //     // Obtener el código de barras correcto
// // //     const codbarra = producto.codbarra || producto.idProducto?.toString();
    
// // //     // Cargar el precio real del producto
// // //     const { precioVenta, nombre } = await cargarPrecioProducto(codbarra);

// // //     const nuevoProducto = {
// // //       codbarra: codbarra,
// // //       descripcionProducto: nombre || producto.nombre || producto.descripcion,
// // //       cantidad: 1,
// // //       precioVenta: precioVenta,
// // //     };

// // //     console.log("Agregando nuevo producto:", nuevoProducto);
// // //     setProductosSeleccionados((prev) => [...prev, nuevoProducto]);
// // //     setClearSearch((prev) => !prev);
    
// // //     // Resetear el valor guardado al agregar productos
// // //     setValorOriginalGuardado(0);
// // //     setIsInitialLoad(false);
// // //   };

// // //   /** Maneja el cambio del descuento manual */
// // //   const handleDescuentoManualChange = (value) => {
// // //     const numericValue = value.replace(/[^0-9]/g, "");

// // //     if (numericValue === "" || numericValue === "0") {
// // //       setDescuentoManual(0);
// // //     } else {
// // //       const descuento = parseInt(numericValue, 10);
// // //       if (descuento > totalSinDescuento) {
// // //         showMessage("El descuento no puede ser mayor al total de los productos");
// // //         setDescuentoManual(totalSinDescuento);
// // //       } else {
// // //         setDescuentoManual(descuento);
// // //       }
// // //     }
// // //     // Marcar que ya no estamos en carga inicial
// // //     setIsInitialLoad(false);
// // //   };

// // //   /** Valida el formulario */
// // //   const validarFormulario = () => {
// // //     if (productosSeleccionados.length === 0) {
// // //       showMessage("Debe tener al menos un producto");
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
// // //       showMessage("Debe seleccionar las horas de inicio y término");
// // //       return false;
// // //     }

// // //     // Validar que las horas sean válidas
// // //     if (!startTime.isValid() || !endTime.isValid()) {
// // //       showMessage("Las horas seleccionadas no son válidas");
// // //       return false;
// // //     }

// // //     const totalOriginal = productosSeleccionados.reduce(
// // //       (sum, p) => sum + Number(p.precioVenta || 0),
// // //       0
// // //     );

// // //     if (totalOriginal <= 0) {
// // //       showMessage("El total de los productos debe ser mayor que 0");
// // //       return false;
// // //     }

// // //     if (descuentoManual < 0) {
// // //       showMessage("El descuento no puede ser negativo");
// // //       return false;
// // //     }

// // //     if (descuentoManual >= totalOriginal) {
// // //       showMessage("El descuento debe ser menor al total de los productos");
// // //       return false;
// // //     }

// // //     return true;
// // //   };

// // //   /** Guarda los cambios de la oferta */
// // //   const handleGuardar = () => {
// // //     if (!validarFormulario()) {
// // //       return;
// // //     }

// // //     const listaParaEnviar = productosSeleccionados.map((p) => ({
// // //       codbarra: p.codbarra,
// // //       descripcionProducto: p.descripcionProducto,
// // //       cantidad: 1,
// // //       porcDescuento: 0,
// // //     }));

// // //     // Asegurar formato correcto de horas
// // //     const horaInicioFormateada = startTime ? startTime.format("HH:mm") : "00:00";
// // //     const horaFinFormateada = endTime ? endTime.format("HH:mm") : "23:59";

// // //     const ofertaActualizada = {
// // //       codigoOferta: ofertaEditar.codigoOferta,
// // //       codigoTipo: ofertaEditar.codigoTipo || 1,
// // //       descripcion: nombreOferta,
// // //       fechaInicial: startDate ? startDate.startOf('day').toISOString() : null,
// // //       fechaFinal: endDate ? endDate.endOf('day').toISOString() : null,
// // //       horaInicio: horaInicioFormateada,
// // //       horaFin: horaFinFormateada,
// // //       diasSemana: convertirDiasAString(diasSemana),
// // //       fAplicaMix: true,
// // //       activo: ofertaActiva,
// // //       oferta_Regla: {
// // //         signo: "=",
// // //         cantidad: productosSeleccionados.length,
// // //         tipoDescuento: "$",
// // //         valor: totalConDescuento,
// // //         aplicacion: "",
// // //       },
// // //       oferta_ListaCanasta: listaParaEnviar,
// // //     };

// // //     console.log("Guardando oferta actualizada:", JSON.stringify(ofertaActualizada, null, 2));
    
// // //     showLoading();
// // //     Ofertas.updateOferta(
// // //       ofertaActualizada,
// // //       (data, response) => {
// // //         hideLoading();
// // //         showMessage("Oferta actualizada exitosamente");
// // //         onOfertaActualizada();
// // //         onClose();
// // //       },
// // //       (error) => {
// // //         hideLoading();
// // //         console.error("Error al actualizar oferta:", error);
// // //         console.error("Error response:", error.response);
// // //         console.error("Error data:", error.data);
// // //         const mensajeError =
// // //           error?.message || 
// // //           error?.descripcion || 
// // //           error?.data?.message ||
// // //           "Error desconocido al actualizar oferta";
// // //         showMessage(`Error al actualizar la oferta: ${mensajeError}`);
// // //       }
// // //     );
// // //   };

// // //   // Formateo moneda
// // //   const formatCLP = (n) => {
// // //     if (n == null || isNaN(n)) return "$0";
// // //     return `$${n.toLocaleString("es-CL")}`;
// // //   };

// // //   return (
// // //     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
// // //       <DialogTitle>Editar Oferta de Productos Complementarios</DialogTitle>
// // //       <DialogContent>
// // //         <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
// // //           {/* Nombre de la oferta */}
// // //           <TextField
// // //             label="Nombre de la Oferta"
// // //             type="text"
// // //             value={nombreOferta}
// // //             onChange={(e) => setNombreOferta(e.target.value)}
// // //             fullWidth
// // //           />

// // //           {/* Componente de búsqueda de productos */}
// // //           <Box
// // //             sx={{
// // //               p: 2,
// // //               border: "1px solid #e0e0e0",
// // //               borderRadius: 1,
// // //               backgroundColor: "#fafafa",
// // //             }}
// // //           >
// // //             <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
// // //               Agregar Productos
// // //             </Typography>
// // //             <SearchListOffers
// // //               refresh={refresh}
// // //               setRefresh={setRefresh}
// // //               onProductoSeleccionado={handleProductoSeleccionado}
// // //               clearSearch={clearSearch}
// // //             />
// // //           </Box>

// // //           {/* Indicador de carga de productos */}
// // //           {loadingProducts && (
// // //             <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
// // //               <CircularProgress size={30} />
// // //               <Typography variant="body2" sx={{ ml: 2 }}>
// // //                 Cargando precios de productos...
// // //               </Typography>
// // //             </Box>
// // //           )}

// // //           {/* Resumen de la oferta */}
// // //           {productosSeleccionados.length > 0 && !loadingProducts && (
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
// // //               <Typography variant="h6">Resumen de la Oferta</Typography>

// // //               <Box sx={{ display: "flex", gap: 2 }}>
// // //                 <TextField
// // //                   label="Valor actual (Total productos)"
// // //                   value={formatCLP(totalSinDescuento)}
// // //                   fullWidth
// // //                   helperText="Suma total de todos los productos"
// // //                   InputProps={{
// // //                     readOnly: true,
// // //                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
// // //                   }}
// // //                 />
// // //                 <TextField
// // //                   label="Descuento aplicado *"
// // //                   type="text"
// // //                   value={descuentoManual || ""}
// // //                   onChange={(e) => handleDescuentoManualChange(e.target.value)}
// // //                   fullWidth
// // //                   helperText="Ingrese el descuento manual en pesos"
// // //                   error={descuentoManual > totalSinDescuento}
// // //                   InputProps={{
// // //                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
// // //                   }}
// // //                 />
// // //                 <TextField
// // //                   label="Total nuevo"
// // //                   value={formatCLP(totalConDescuento)}
// // //                   fullWidth
// // //                   helperText="Valor final de la oferta"
// // //                   InputProps={{
// // //                     readOnly: true,
// // //                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
// // //                   }}
// // //                 />
// // //               </Box>

// // //               {descuentoManual > 0 && (
// // //                 <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
// // //                   <Typography variant="body2" color="primary">
// // //                     Descuento aplicado: {formatCLP(descuentoManual)}
// // //                   </Typography>
// // //                 </Box>
// // //               )}
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
// // //             <FormGroup row sx={{ display: "flex", justifyContent: "space-between" }}>
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

// // //           {/* Tabla de productos seleccionados */}
// // //           {productosSeleccionados.length > 0 && !loadingProducts && (
// // //             <Box sx={{ mt: 2 }}>
// // //               <Typography variant="h6" gutterBottom>
// // //                 Productos Seleccionados ({productosSeleccionados.length})
// // //               </Typography>
// // //               <TableContainer component={Paper} elevation={2}>
// // //                 <Table size="small">
// // //                   <TableHead>
// // //                     <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
// // //                       <TableCell><strong>Código</strong></TableCell>
// // //                       <TableCell><strong>Descripción</strong></TableCell>
// // //                       <TableCell align="center"><strong>Precio Individual</strong></TableCell>
// // //                       <TableCell align="center"><strong>Acciones</strong></TableCell>
// // //                     </TableRow>
// // //                   </TableHead>
// // //                   <TableBody>
// // //                     {productosSeleccionados.map((producto) => (
// // //                       <TableRow key={producto.codbarra} hover>
// // //                         <TableCell>
// // //                           <Chip label={producto.codbarra} size="small" color="primary" variant="outlined" />
// // //                         </TableCell>
// // //                         <TableCell>
// // //                           <Typography variant="body2">{producto.descripcionProducto}</Typography>
// // //                         </TableCell>
// // //                         <TableCell align="center">
// // //                           <Typography variant="body2" fontWeight="bold">
// // //                             {formatCLP(producto.precioVenta)}
// // //                           </Typography>
// // //                         </TableCell>
// // //                         <TableCell align="center">
// // //                           <IconButton
// // //                             size="small"
// // //                             color="error"
// // //                             onClick={() => handleEliminarProducto(producto.codbarra)}
// // //                             title="Eliminar"
// // //                           >
// // //                             <DeleteIcon fontSize="small" />
// // //                           </IconButton>
// // //                         </TableCell>
// // //                       </TableRow>
// // //                     ))}
// // //                   </TableBody>
// // //                 </Table>
// // //               </TableContainer>
// // //             </Box>
// // //           )}

// // //           <Box
// // //             sx={{
// // //               display: "flex",
// // //               alignItems: "center",
// // //               justifyContent: "space-between",
// // //             }}
// // //           >
// // //             <Box>
// // //               <Typography variant="subtitle1" fontWeight="bold">
// // //                 Estado de la Oferta
// // //               </Typography>
// // //               <Typography variant="caption" color="textSecondary">
// // //                 Define si la oferta estará activa o inactiva
// // //               </Typography>
// // //             </Box>
// // //             <FormControlLabel
// // //               control={
// // //                 <Switch
// // //                   checked={ofertaActiva}
// // //                   onChange={(e) => setOfertaActiva(e.target.checked)}
// // //                   color="success"
// // //                 />
// // //               }
// // //               label={
// // //                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
// // //                   <Typography variant="body2" fontWeight="bold">
// // //                     {ofertaActiva ? "Activa" : "Inactiva"}
// // //                   </Typography>
// // //                   <Chip
// // //                     label={ofertaActiva ? "ON" : "OFF"}
// // //                     size="small"
// // //                     color={ofertaActiva ? "success" : "default"}
// // //                   />
// // //                 </Box>
// // //               }
// // //               labelPlacement="start"
// // //             />
// // //           </Box>
// // //         </Box>
// // //       </DialogContent>
// // //       <DialogActions>
// // //         <Button onClick={onClose}>Cancelar</Button>
// // //         <Button
// // //           onClick={handleGuardar}
// // //           variant="contained"
// // //           disabled={productosSeleccionados.length === 0 || loadingProducts}
// // //         >
// // //           Guardar Cambios
// // //         </Button>
// // //       </DialogActions>
// // //     </Dialog>
// // //   );
// // // };

// // // export default DialogEditarOfertaComplementarias;

// // import React, { useState, useEffect, useContext, useCallback } from "react";
// // import {
// //   Dialog,
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
// //   Checkbox,
// //   FormControlLabel,
// //   FormGroup,
// //   InputAdornment,
// //   CircularProgress,
// //   Switch,
// // } from "@mui/material";
// // import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// // import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// // import { TimeField } from "@mui/x-date-pickers/TimeField";
// // import dayjs from "dayjs";
// // import DeleteIcon from "@mui/icons-material/Delete";
// // import Product from "../../Models/Product";
// // import Ofertas from "../../Models/Ofertas";
// // import SearchListOffers from "./SearchListOfertas";
// // import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

// // const DialogEditarOfertaComplementarias = ({
// //   open,
// //   onClose,
// //   ofertaEditar,
// //   onOfertaActualizada,
// // }) => {
// //   const { showLoading, hideLoading, showMessage, showConfirm } = useContext(
// //     SelectedOptionsContext
// //   );

// //   // Estados del formulario
// //   const [nombreOferta, setNombreOferta] = useState("");
// //   const [startDate, setStartDate] = useState(null);
// //   const [endDate, setEndDate] = useState(null);
// //   const [startTime, setStartTime] = useState(null);
// //   const [endTime, setEndTime] = useState(null);
// //   const [productosSeleccionados, setProductosSeleccionados] = useState([]);
// //   const [diasSemana, setDiasSemana] = useState([true, true, true, true, true, true, true]);
// //   const [ofertaActiva, setOfertaActiva] = useState(true);

// //   // Estados calculados
// //   const [totalSinDescuento, setTotalSinDescuento] = useState(0);
// //   const [descuentoManual, setDescuentoManual] = useState(0);
// //   const [totalConDescuento, setTotalConDescuento] = useState(0);
// //   const [valorOriginalGuardado, setValorOriginalGuardado] = useState(0);
  
// //   // Estado de carga
// //   const [loadingProducts, setLoadingProducts] = useState(false);
// //   const [clearSearch, setClearSearch] = useState(false);
// //   const [refresh, setRefresh] = useState(false);
// //   const [guardando, setGuardando] = useState(false); // Nuevo estado para controlar guardado

// //   const nombresDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

// //   // Función para cargar precio de un producto por código de barra
// //   const cargarPrecioProducto = async (codbarra) => {
// //     return new Promise((resolve, reject) => {
// //       if (!codbarra) {
// //         resolve({ precioVenta: 0, nombre: "" });
// //         return;
// //       }

// //       const productModel = Product.getInstance();
      
// //       // Buscar por código de barras
// //       productModel.findByCodigoBarras(
// //         { codigoProducto: codbarra.toString() },
// //         (productos, response) => {
// //           if (productos && Array.isArray(productos) && productos.length > 0) {
// //             const producto = productos[0];
// //             resolve({
// //               precioVenta: Number(producto.precioVenta || producto.precio || 0),
// //               nombre: producto.nombre || producto.descripcion || "",
// //             });
// //           } else {
// //             resolve({ precioVenta: 0, nombre: "" });
// //           }
// //         },
// //         (error) => {
// //           console.error(`Error al cargar precio del producto ${codbarra}:`, error);
// //           resolve({ precioVenta: 0, nombre: "" });
// //         }
// //       );
// //     });
// //   };

// //   // Cargar datos de la oferta cuando se abre el diálogo
// //   useEffect(() => {
// //     if (open && ofertaEditar) {
// //       console.log("Cargando oferta para editar:", ofertaEditar);
      
// //       // Limpiar estados previos
// //       setProductosSeleccionados([]);
// //       setDescuentoManual(0);
// //       setValorOriginalGuardado(0);
// //       setGuardando(false);
      
// //       // Cargar datos básicos
// //       setNombreOferta(ofertaEditar.descripcion || "");
// //       setOfertaActiva(ofertaEditar.activo ?? true);

// //       // Cargar fechas
// //       if (ofertaEditar.fechaInicial) {
// //         setStartDate(dayjs(ofertaEditar.fechaInicial));
// //       }
// //       if (ofertaEditar.fechaFinal) {
// //         setEndDate(dayjs(ofertaEditar.fechaFinal));
// //       }

// //       // Cargar horas
// //       if (ofertaEditar.horaInicio) {
// //         const [hours, minutes] = ofertaEditar.horaInicio.split(":");
// //         setStartTime(dayjs().hour(parseInt(hours)).minute(parseInt(minutes)));
// //       }
// //       if (ofertaEditar.horaFin) {
// //         const [hours, minutes] = ofertaEditar.horaFin.split(":");
// //         setEndTime(dayjs().hour(parseInt(hours)).minute(parseInt(minutes)));
// //       }

// //       // Cargar días de la semana
// //       if (ofertaEditar.diasSemana) {
// //         const diasArray = ofertaEditar.diasSemana.split("").map(d => d === "1");
// //         setDiasSemana(diasArray);
// //       }

// //       // Guardar el valor original de la oferta
// //       if (ofertaEditar.oferta_Regla?.valor) {
// //         setValorOriginalGuardado(ofertaEditar.oferta_Regla.valor);
// //       }

// //       // Cargar productos - CORREGIDO: Usar oferta_ListaCanasta si existe
// //       let productosACargar = [];
      
// //       // Priorizar oferta_ListaCanasta sobre products
// //       if (ofertaEditar.oferta_ListaCanasta && ofertaEditar.oferta_ListaCanasta.length > 0) {
// //         productosACargar = ofertaEditar.oferta_ListaCanasta;
// //         console.log("Cargando productos de oferta_ListaCanasta:", productosACargar);
// //       } else if (ofertaEditar.products && ofertaEditar.products.length > 0) {
// //         // Si no hay oferta_ListaCanasta, usar products pero filtrar duplicados
// //         console.log("Cargando productos de products:", ofertaEditar.products);
        
// //         // Filtrar duplicados por codbarra
// //         const productosUnicos = [];
// //         const codigosVistos = new Set();
        
// //         ofertaEditar.products.forEach(prod => {
// //           if (prod.codbarra && !codigosVistos.has(prod.codbarra)) {
// //             codigosVistos.add(prod.codbarra);
// //             productosUnicos.push({
// //               codbarra: prod.codbarra,
// //               descripcionProducto: prod.descripcion || "",
// //               cantidad: 1,
// //               porcDescuento: 0
// //             });
// //           }
// //         });
        
// //         productosACargar = productosUnicos;
// //       }
      
// //       if (productosACargar.length > 0) {
// //         cargarProductosConPrecios(productosACargar);
// //       } else {
// //         setLoadingProducts(false);
// //       }
// //     }
// //   }, [open, ofertaEditar]);

// //   // Función para cargar productos con sus precios reales desde la API
// //   const cargarProductosConPrecios = async (products) => {
// //     setLoadingProducts(true);
// //     console.log("Cargando precios para productos:", products);

// //     try {
// //       // Filtrar productos nulos o sin código
// //       const productosValidos = products.filter(p => p && p.codbarra);
      
// //       const productosConPrecios = await Promise.all(
// //         productosValidos.map(async (prod) => {
// //           const { precioVenta, nombre } = await cargarPrecioProducto(prod.codbarra);
// //           return {
// //             codbarra: prod.codbarra,
// //             descripcionProducto: nombre || prod.descripcionProducto || prod.descripcion || `Producto ${prod.codbarra}`,
// //             cantidad: 1,
// //             precioVenta: precioVenta,
// //           };
// //         })
// //       );

// //       console.log("Productos con precios cargados:", productosConPrecios);
// //       setProductosSeleccionados(productosConPrecios);
      
// //       // Calcular descuento basado en el valor original guardado
// //       if (valorOriginalGuardado > 0) {
// //         const totalProductos = productosConPrecios.reduce((sum, p) => sum + Number(p.precioVenta || 0), 0);
// //         if (totalProductos > 0) {
// //           const descuentoCalculado = Math.max(0, totalProductos - valorOriginalGuardado);
// //           setDescuentoManual(descuentoCalculado);
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Error al cargar precios de productos:", error);
// //       showMessage("Error al cargar los precios de los productos");
// //     } finally {
// //       setLoadingProducts(false);
// //     }
// //   };

// //   // CALCULO PRINCIPAL - CORREGIDO
// //   const calcularTotales = useCallback(() => {
// //     console.log("=== CALCULANDO TOTALES EN EDICIÓN ===");
// //     console.log("Productos:", productosSeleccionados);
// //     console.log("Descuento manual:", descuentoManual);

// //     if (productosSeleccionados.length === 0) {
// //       setTotalSinDescuento(0);
// //       setTotalConDescuento(0);
// //       setDescuentoManual(0);
// //       return;
// //     }

// //     // Calcular total sin descuento
// //     const totalOriginal = productosSeleccionados.reduce(
// //       (sum, p) => sum + Number(p.precioVenta || 0),
// //       0
// //     );
    
// //     setTotalSinDescuento(totalOriginal);

// //     // Calcular total con descuento
// //     const totalConDescuentoCalculado = Math.max(0, totalOriginal - descuentoManual);
// //     setTotalConDescuento(totalConDescuentoCalculado);

// //   }, [productosSeleccionados, descuentoManual]);

// //   // Ejecutar cálculo cuando cambien las dependencias
// //   useEffect(() => {
// //     calcularTotales();
// //   }, [calcularTotales]);

// //   /** Convierte array de booleanos a string de días */
// //   const convertirDiasAString = (diasArray) => {
// //     return diasArray.map((dia) => (dia ? "1" : "0")).join("");
// //   };

// //   /** Maneja el cambio de selección de un día específico */
// //   const handleDiaChange = (index) => {
// //     const nuevosDias = [...diasSemana];
// //     nuevosDias[index] = !nuevosDias[index];
// //     setDiasSemana(nuevosDias);
// //   };

// //   /** Selecciona o deselecciona todos los días */
// //   const handleTodosLosDias = (seleccionar) => {
// //     setDiasSemana(new Array(7).fill(seleccionar));
// //   };

// //   /** Elimina un producto de la lista */
// //   const handleEliminarProducto = (codbarra) => {
// //     console.log("Eliminando producto:", codbarra);
// //     const nuevosProductos = productosSeleccionados.filter((p) => p.codbarra !== codbarra);
// //     setProductosSeleccionados(nuevosProductos);
// //   };

// //   /** Agrega un producto a la lista de productos seleccionados */
// //   const handleProductoSeleccionado = async (producto) => {
// //     const yaExiste = productosSeleccionados.some(
// //       (p) => p.codbarra === producto.codbarra
// //     );
// //     if (yaExiste) {
// //       showMessage("Este producto ya ha sido agregado");
// //       return;
// //     }

// //     // Obtener el código de barras correcto
// //     const codbarra = producto.codbarra || producto.idProducto?.toString();
    
// //     // Cargar el precio real del producto
// //     const { precioVenta, nombre } = await cargarPrecioProducto(codbarra);

// //     const nuevoProducto = {
// //       codbarra: codbarra,
// //       descripcionProducto: nombre || producto.nombre || producto.descripcion,
// //       cantidad: 1,
// //       precioVenta: precioVenta,
// //     };

// //     console.log("Agregando nuevo producto:", nuevoProducto);
// //     setProductosSeleccionados((prev) => [...prev, nuevoProducto]);
// //     setClearSearch((prev) => !prev);
// //   };

// //   /** Maneja el cambio del descuento manual */
// //   const handleDescuentoManualChange = (value) => {
// //     const numericValue = value.replace(/[^0-9]/g, "");

// //     if (numericValue === "" || numericValue === "0") {
// //       setDescuentoManual(0);
// //     } else {
// //       const descuento = parseInt(numericValue, 10);
// //       if (descuento > totalSinDescuento) {
// //         showMessage("El descuento no puede ser mayor al total de los productos");
// //         setDescuentoManual(totalSinDescuento);
// //       } else {
// //         setDescuentoManual(descuento);
// //       }
// //     }
// //   };

// //   /** Valida el formulario */
// //   const validarFormulario = () => {
// //     if (productosSeleccionados.length === 0) {
// //       showMessage("Debe tener al menos un producto");
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
// //       showMessage("Debe seleccionar las horas de inicio y término");
// //       return false;
// //     }

// //     const totalOriginal = productosSeleccionados.reduce(
// //       (sum, p) => sum + Number(p.precioVenta || 0),
// //       0
// //     );

// //     if (totalOriginal <= 0) {
// //       showMessage("El total de los productos debe ser mayor que 0");
// //       return false;
// //     }

// //     if (descuentoManual < 0) {
// //       showMessage("El descuento no puede ser negativo");
// //       return false;
// //     }

// //     if (descuentoManual >= totalOriginal) {
// //       showMessage("El descuento debe ser menor al total de los productos");
// //       return false;
// //     }

// //     return true;
// //   };

// //   /** Guarda los cambios de la oferta - CORREGIDO */
// //   const handleGuardar = () => {
// //     if (guardando) return;
    
// //     if (!validarFormulario()) {
// //       return;
// //     }

// //     setGuardando(true);
    
// //     // Crear lista de productos para enviar
// //     const listaParaEnviar = productosSeleccionados.map((p) => ({
// //       codbarra: p.codbarra,
// //       descripcionProducto: p.descripcionProducto,
// //       cantidad: 1,
// //       porcDescuento: 0,
// //     }));

// //     // Asegurar formato correcto de fechas y horas
// //     const fechaInicial = startDate ? startDate.startOf('day').toISOString() : null;
// //     const fechaFinal = endDate ? endDate.endOf('day').toISOString() : null;
// //     const horaInicio = startTime ? startTime.format("HH:mm") : "00:00";
// //     const horaFin = endTime ? endTime.format("HH:mm") : "23:59";

// //     const ofertaActualizada = {
// //       codigoOferta: ofertaEditar.codigoOferta,
// //       codigoTipo: ofertaEditar.codigoTipo || 1,
// //       descripcion: nombreOferta,
// //       fechaInicial: fechaInicial,
// //       fechaFinal: fechaFinal,
// //       horaInicio: horaInicio,
// //       horaFin: horaFin,
// //       diasSemana: convertirDiasAString(diasSemana),
// //       fAplicaMix: true,
// //       activo: ofertaActiva,
// //       oferta_Regla: {
// //         signo: "=",
// //         cantidad: productosSeleccionados.length,
// //         tipoDescuento: "$",
// //         valor: totalConDescuento,
// //         aplicacion: "",
// //       },
// //       oferta_ListaCanasta: listaParaEnviar,
// //     };

// //     console.log("Enviando oferta actualizada:", JSON.stringify(ofertaActualizada, null, 2));
    
// //     showLoading();
// //     Ofertas.updateOferta(
// //       ofertaActualizada,
// //       (data, response) => {
// //         hideLoading();
// //         setGuardando(false);
// //         showMessage("Oferta actualizada exitosamente");
// //         onOfertaActualizada();
// //         onClose();
// //       },
// //       (error) => {
// //         hideLoading();
// //         setGuardando(false);
// //         console.error("Error al actualizar oferta:", error);
// //         const mensajeError =
// //           error?.message || 
// //           error?.descripcion || 
// //           error?.data?.message ||
// //           "Error desconocido al actualizar oferta";
// //         showMessage(`Error al actualizar la oferta: ${mensajeError}`);
// //       }
// //     );
// //   };

// //   // Formateo moneda
// //   const formatCLP = (n) => {
// //     if (n == null || isNaN(n)) return "$0";
// //     return `$${n.toLocaleString("es-CL")}`;
// //   };

// //   return (
// //     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
// //       <DialogTitle>Editar Oferta de Productos Complementarios</DialogTitle>
// //       <DialogContent>
// //         <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
// //           {/* Nombre de la oferta */}
// //           <TextField
// //             label="Nombre de la Oferta"
// //             type="text"
// //             value={nombreOferta}
// //             onChange={(e) => setNombreOferta(e.target.value)}
// //             fullWidth
// //           />

// //           {/* Componente de búsqueda de productos */}
// //           <Box
// //             sx={{
// //               p: 2,
// //               border: "1px solid #e0e0e0",
// //               borderRadius: 1,
// //               backgroundColor: "#fafafa",
// //             }}
// //           >
// //             <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
// //               Agregar Productos
// //             </Typography>
// //             <SearchListOffers
// //               refresh={refresh}
// //               setRefresh={setRefresh}
// //               onProductoSeleccionado={handleProductoSeleccionado}
// //               clearSearch={clearSearch}
// //             />
// //           </Box>

// //           {/* Indicador de carga de productos */}
// //           {loadingProducts && (
// //             <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
// //               <CircularProgress size={30} />
// //               <Typography variant="body2" sx={{ ml: 2 }}>
// //                 Cargando precios de productos...
// //               </Typography>
// //             </Box>
// //           )}

// //           {/* Resumen de la oferta */}
// //           {productosSeleccionados.length > 0 && !loadingProducts && (
// //             <Box
// //               sx={{
// //                 display: "flex",
// //                 flexDirection: "column",
// //                 gap: 2,
// //                 p: 2,
// //                 backgroundColor: "#f5f5f5",
// //                 borderRadius: 1,
// //               }}
// //             >
// //               <Typography variant="h6">Resumen de la Oferta</Typography>

// //               <Box sx={{ display: "flex", gap: 2 }}>
// //                 <TextField
// //                   label="Valor actual (Total productos)"
// //                   value={formatCLP(totalSinDescuento)}
// //                   fullWidth
// //                   helperText="Suma total de todos los productos"
// //                   InputProps={{
// //                     readOnly: true,
// //                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
// //                   }}
// //                 />
// //                 <TextField
// //                   label="Descuento aplicado *"
// //                   type="text"
// //                   value={descuentoManual || ""}
// //                   onChange={(e) => handleDescuentoManualChange(e.target.value)}
// //                   fullWidth
// //                   helperText="Ingrese el descuento manual en pesos"
// //                   error={descuentoManual > totalSinDescuento}
// //                   InputProps={{
// //                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
// //                   }}
// //                 />
// //                 <TextField
// //                   label="Total nuevo"
// //                   value={formatCLP(totalConDescuento)}
// //                   fullWidth
// //                   helperText="Valor final de la oferta"
// //                   InputProps={{
// //                     readOnly: true,
// //                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
// //                   }}
// //                 />
// //               </Box>

// //               {descuentoManual > 0 && (
// //                 <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
// //                   <Typography variant="body2" color="primary">
// //                     Descuento aplicado: {formatCLP(descuentoManual)}
// //                   </Typography>
// //                 </Box>
// //               )}
// //             </Box>
// //           )}

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
// //             <FormGroup row sx={{ display: "flex", justifyContent: "space-between" }}>
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

// //           {/* Tabla de productos seleccionados */}
// //           {productosSeleccionados.length > 0 && !loadingProducts && (
// //             <Box sx={{ mt: 2 }}>
// //               <Typography variant="h6" gutterBottom>
// //                 Productos Seleccionados ({productosSeleccionados.length})
// //               </Typography>
// //               <TableContainer component={Paper} elevation={2}>
// //                 <Table size="small">
// //                   <TableHead>
// //                     <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
// //                       <TableCell><strong>Código</strong></TableCell>
// //                       <TableCell><strong>Descripción</strong></TableCell>
// //                       <TableCell align="center"><strong>Precio Individual</strong></TableCell>
// //                       <TableCell align="center"><strong>Acciones</strong></TableCell>
// //                     </TableRow>
// //                   </TableHead>
// //                   <TableBody>
// //                     {productosSeleccionados.map((producto) => (
// //                       <TableRow key={producto.codbarra} hover>
// //                         <TableCell>
// //                           <Chip label={producto.codbarra} size="small" color="primary" variant="outlined" />
// //                         </TableCell>
// //                         <TableCell>
// //                           <Typography variant="body2">{producto.descripcionProducto}</Typography>
// //                         </TableCell>
// //                         <TableCell align="center">
// //                           <Typography variant="body2" fontWeight="bold">
// //                             {formatCLP(producto.precioVenta)}
// //                           </Typography>
// //                         </TableCell>
// //                         <TableCell align="center">
// //                           <IconButton
// //                             size="small"
// //                             color="error"
// //                             onClick={() => handleEliminarProducto(producto.codbarra)}
// //                             title="Eliminar"
// //                           >
// //                             <DeleteIcon fontSize="small" />
// //                           </IconButton>
// //                         </TableCell>
// //                       </TableRow>
// //                     ))}
// //                   </TableBody>
// //                 </Table>
// //               </TableContainer>
// //             </Box>
// //           )}

// //           <Box
// //             sx={{
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "space-between",
// //             }}
// //           >
// //             <Box>
// //               <Typography variant="subtitle1" fontWeight="bold">
// //                 Estado de la Oferta
// //               </Typography>
// //               <Typography variant="caption" color="textSecondary">
// //                 Define si la oferta estará activa o inactiva
// //               </Typography>
// //             </Box>
// //             <FormControlLabel
// //               control={
// //                 <Switch
// //                   checked={ofertaActiva}
// //                   onChange={(e) => setOfertaActiva(e.target.checked)}
// //                   color="success"
// //                 />
// //               }
// //               label={
// //                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
// //                   <Typography variant="body2" fontWeight="bold">
// //                     {ofertaActiva ? "Activa" : "Inactiva"}
// //                   </Typography>
// //                   <Chip
// //                     label={ofertaActiva ? "ON" : "OFF"}
// //                     size="small"
// //                     color={ofertaActiva ? "success" : "default"}
// //                   />
// //                 </Box>
// //               }
// //               labelPlacement="start"
// //             />
// //           </Box>
// //         </Box>
// //       </DialogContent>
// //       <DialogActions>
// //         <Button onClick={onClose} disabled={guardando}>Cancelar</Button>
// //         <Button
// //           onClick={handleGuardar}
// //           variant="contained"
// //           disabled={productosSeleccionados.length === 0 || loadingProducts || guardando}
// //         >
// //           {guardando ? "Guardando..." : "Guardar Cambios"}
// //         </Button>
// //       </DialogActions>
// //     </Dialog>
// //   );
// // };

// // export default DialogEditarOfertaComplementarias;
// import React, { useState, useEffect, useContext, useCallback } from "react";
// import {
//   Dialog,
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
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
//   InputAdornment,
//   CircularProgress,
//   Switch,
//   Alert,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { TimeField } from "@mui/x-date-pickers/TimeField";
// import dayjs from "dayjs";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Product from "../../Models/Product";
// import Ofertas from "../../Models/Ofertas";
// import SearchListOffers from "./SearchListOfertas";
// import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

// const DialogEditarOfertaComplementarias = ({
//   open,
//   onClose,
//   ofertaEditar,
//   onOfertaActualizada,
// }) => {
//   const { showLoading, hideLoading, showMessage, showConfirm } = useContext(
//     SelectedOptionsContext
//   );

//   // Estados del formulario
//   const [nombreOferta, setNombreOferta] = useState("");
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [startTime, setStartTime] = useState(null);
//   const [endTime, setEndTime] = useState(null);
//   const [productosSeleccionados, setProductosSeleccionados] = useState([]);
//   const [diasSemana, setDiasSemana] = useState([true, true, true, true, true, true, true]);
//   const [ofertaActiva, setOfertaActiva] = useState(true);

//   // Estados calculados
//   const [totalSinDescuento, setTotalSinDescuento] = useState(0);
//   const [descuentoManual, setDescuentoManual] = useState(0);
//   const [totalConDescuento, setTotalConDescuento] = useState(0);
  
//   // Estado de carga
//   const [loadingProducts, setLoadingProducts] = useState(false);
//   const [clearSearch, setClearSearch] = useState(false);
//   const [guardando, setGuardando] = useState(false);
//   const [productosOriginales, setProductosOriginales] = useState([]);
//   const [refresh, setRefresh] = useState(false);

//   const nombresDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

//   // Función para cargar precio de un producto por código de barra - MEJORADA
//   const cargarPrecioProducto = async (codbarra) => {
//     return new Promise((resolve, reject) => {
//       if (!codbarra) {
//         resolve({ precioVenta: 0, nombre: "" });
//         return;
//       }

//       // Intentar primero buscar directamente por código
//       const productModel = Product.getInstance();
      
//       // Usar el método getAllProducts y filtrar
//       productModel.getAllProducts(
//         (productos) => {
//           const productoEncontrado = productos.find(p => 
//             p.codbarra === codbarra.toString() || 
//             p.idProducto?.toString() === codbarra.toString() ||
//             p.codigoProducto === codbarra.toString()
//           );
          
//           if (productoEncontrado) {
//             resolve({
//               precioVenta: Number(productoEncontrado.precioVenta || productoEncontrado.precio || 0),
//               nombre: productoEncontrado.nombre || productoEncontrado.descripcion || "",
//             });
//           } else {
//             // Si no se encuentra, intentar con findByCodigoBarras
//             productModel.findByCodigoBarras(
//               { codigoProducto: codbarra.toString() },
//               (productosCodigo, response) => {
//                 if (productosCodigo && productosCodigo.length > 0) {
//                   const producto = productosCodigo[0];
//                   resolve({
//                     precioVenta: Number(producto.precioVenta || producto.precio || 0),
//                     nombre: producto.nombre || producto.descripcion || "",
//                   });
//                 } else {
//                   // Si aún no se encuentra, usar valores por defecto
//                   resolve({ precioVenta: 0, nombre: `Producto ${codbarra}` });
//                 }
//               },
//               () => resolve({ precioVenta: 0, nombre: `Producto ${codbarra}` })
//             );
//           }
//         },
//         () => resolve({ precioVenta: 0, nombre: `Producto ${codbarra}` })
//       );
//     });
//   };

//   // Cargar datos de la oferta cuando se abre el diálogo - COMPLETAMENTE REESCRITO
//   useEffect(() => {
//     if (open && ofertaEditar) {
//       console.log("=== CARGANDO OFERTA PARA EDITAR ===");
//       console.log("Datos completos de ofertaEditar:", ofertaEditar);
      
//       // Resetear todos los estados
//       resetEstados();
      
//       // Cargar datos básicos
//       setNombreOferta(ofertaEditar.descripcion || "");
//       setOfertaActiva(ofertaEditar.activo ?? true);

//       // Cargar fechas
//       if (ofertaEditar.fechaInicial) {
//         try {
//           setStartDate(dayjs(ofertaEditar.fechaInicial));
//         } catch (e) {
//           console.error("Error al parsear fecha inicial:", e);
//         }
//       }
//       if (ofertaEditar.fechaFinal) {
//         try {
//           setEndDate(dayjs(ofertaEditar.fechaFinal));
//         } catch (e) {
//           console.error("Error al parsear fecha final:", e);
//         }
//       }

//       // Cargar horas
//       if (ofertaEditar.horaInicio) {
//         try {
//           const [hours, minutes] = ofertaEditar.horaInicio.split(":");
//           setStartTime(dayjs().hour(parseInt(hours) || 0).minute(parseInt(minutes) || 0));
//         } catch (e) {
//           console.error("Error al parsear hora inicio:", e);
//         }
//       }
//       if (ofertaEditar.horaFin) {
//         try {
//           const [hours, minutes] = ofertaEditar.horaFin.split(":");
//           setEndTime(dayjs().hour(parseInt(hours) || 23).minute(parseInt(minutes) || 59));
//         } catch (e) {
//           console.error("Error al parsear hora fin:", e);
//         }
//       }

//       // Cargar días de la semana
//       if (ofertaEditar.diasSemana && ofertaEditar.diasSemana.length === 7) {
//         const diasArray = ofertaEditar.diasSemana.split("").map(d => d === "1");
//         setDiasSemana(diasArray);
//       }

//       // Extraer productos de MANERA SEGURA
//       extraerProductosDeOferta(ofertaEditar);
//     }
//   }, [open, ofertaEditar]);

//   // Función para resetear estados
//   const resetEstados = () => {
//     setProductosSeleccionados([]);
//     setProductosOriginales([]);
//     setDescuentoManual(0);
//     setTotalSinDescuento(0);
//     setTotalConDescuento(0);
//     setGuardando(false);
//   };

//   // Función para extraer productos de la oferta de manera segura
//   const extraerProductosDeOferta = async (oferta) => {
//     setLoadingProducts(true);
    
//     try {
//       let productosACargar = [];
      
//       // PRIORIDAD 1: Buscar en oferta_ListaCanasta (que es lo que realmente se envía)
//       if (oferta.oferta_ListaCanasta && Array.isArray(oferta.oferta_ListaCanasta)) {
//         console.log("Usando oferta_ListaCanasta:", oferta.oferta_ListaCanasta);
//         productosACargar = oferta.oferta_ListaCanasta;
//       } 
//       // PRIORIDAD 2: Si no hay oferta_ListaCanasta, usar products pero FILTRAR DUPLICADOS
//       else if (oferta.products && Array.isArray(oferta.products)) {
//         console.log("Usando products (filtrando duplicados):", oferta.products);
        
//         // Filtrar duplicados por codbarra
//         const mapaProductos = new Map();
//         oferta.products.forEach(prod => {
//           if (prod.codbarra && !mapaProductos.has(prod.codbarra)) {
//             mapaProductos.set(prod.codbarra, prod);
//           }
//         });
        
//         productosACargar = Array.from(mapaProductos.values()).map(prod => ({
//           codbarra: prod.codbarra,
//           descripcionProducto: prod.descripcion || "",
//           cantidad: 1,
//           porcDescuento: 0
//         }));
//       }
      
//       // Guardar productos originales para referencia
//       setProductosOriginales([...productosACargar]);
      
//       if (productosACargar.length > 0) {
//         await cargarProductosConPrecios(productosACargar);
        
//         // Calcular descuento inicial basado en el valor de la oferta
//         if (oferta.oferta_Regla?.valor && oferta.oferta_Regla.valor > 0) {
//           const totalProductos = productosSeleccionados.reduce(
//             (sum, p) => sum + Number(p.precioVenta || 0),
//             0
//           );
//           if (totalProductos > 0) {
//             const descuentoCalculado = Math.max(0, totalProductos - oferta.oferta_Regla.valor);
//             setDescuentoManual(descuentoCalculado);
//           }
//         }
//       } else {
//         console.warn("No se encontraron productos en la oferta");
//       }
//     } catch (error) {
//       console.error("Error al extraer productos:", error);
//       showMessage("Error al cargar los productos de la oferta");
//     } finally {
//       setLoadingProducts(false);
//     }
//   };

//   // Función para cargar productos con sus precios
//   const cargarProductosConPrecios = async (products) => {
//     console.log("Cargando precios para productos:", products);

//     try {
//       const productosConPrecios = await Promise.all(
//         products.map(async (prod) => {
//           try {
//             const { precioVenta, nombre } = await cargarPrecioProducto(prod.codbarra);
//             return {
//               codbarra: prod.codbarra,
//               descripcionProducto: nombre || prod.descripcionProducto || prod.descripcion || `Producto ${prod.codbarra}`,
//               cantidad: 1,
//               precioVenta: precioVenta,
//             };
//           } catch (error) {
//             console.error(`Error cargando producto ${prod.codbarra}:`, error);
//             return {
//               codbarra: prod.codbarra,
//               descripcionProducto: prod.descripcionProducto || `Producto ${prod.codbarra}`,
//               cantidad: 1,
//               precioVenta: 0,
//             };
//           }
//         })
//       );

//       console.log("Productos cargados con éxito:", productosConPrecios);
//       setProductosSeleccionados(productosConPrecios);
//     } catch (error) {
//       console.error("Error fatal al cargar precios:", error);
//       showMessage("Error al cargar los precios de los productos");
//     }
//   };

//   // Cálculo de totales - SIMPLIFICADO Y ROBUSTO
//   useEffect(() => {
//     if (productosSeleccionados.length === 0) {
//       setTotalSinDescuento(0);
//       setTotalConDescuento(0);
//       return;
//     }

//     const totalOriginal = productosSeleccionados.reduce(
//       (sum, p) => sum + Number(p.precioVenta || 0),
//       0
//     );
    
//     setTotalSinDescuento(totalOriginal);
    
//     const totalConDescuentoCalculado = Math.max(0, totalOriginal - descuentoManual);
//     setTotalConDescuento(totalConDescuentoCalculado);
    
//   }, [productosSeleccionados, descuentoManual]);

//   /** Convierte array de booleanos a string de días */
//   const convertirDiasAString = (diasArray) => {
//     return diasArray.map((dia) => (dia ? "1" : "0")).join("");
//   };

//   /** Maneja el cambio de selección de un día específico */
//   const handleDiaChange = (index) => {
//     const nuevosDias = [...diasSemana];
//     nuevosDias[index] = !nuevosDias[index];
//     setDiasSemana(nuevosDias);
//   };

//   /** Selecciona o deselecciona todos los días */
//   const handleTodosLosDias = (seleccionar) => {
//     setDiasSemana(new Array(7).fill(seleccionar));
//   };

//   /** Elimina un producto de la lista */
//   const handleEliminarProducto = (codbarra) => {
//     console.log("Eliminando producto:", codbarra);
//     const nuevosProductos = productosSeleccionados.filter((p) => p.codbarra !== codbarra);
//     setProductosSeleccionados(nuevosProductos);
//   };

//   /** Agrega un producto a la lista de productos seleccionados */
//   const handleProductoSeleccionado = async (producto) => {
//     const yaExiste = productosSeleccionados.some(
//       (p) => p.codbarra === producto.codbarra
//     );
//     if (yaExiste) {
//       showMessage("Este producto ya ha sido agregado");
//       return;
//     }

//     const codbarra = producto.codbarra || producto.idProducto?.toString();
    
//     // Cargar el precio real del producto
//     const { precioVenta, nombre } = await cargarPrecioProducto(codbarra);

//     const nuevoProducto = {
//       codbarra: codbarra,
//       descripcionProducto: nombre || producto.nombre || producto.descripcion,
//       cantidad: 1,
//       precioVenta: precioVenta,
//     };

//     console.log("Agregando nuevo producto:", nuevoProducto);
//     setProductosSeleccionados((prev) => [...prev, nuevoProducto]);
//     setClearSearch((prev) => !prev);
//   };

//   /** Maneja el cambio del descuento manual */
//   const handleDescuentoManualChange = (value) => {
//     const numericValue = value.replace(/[^0-9]/g, "");

//     if (numericValue === "" || numericValue === "0") {
//       setDescuentoManual(0);
//     } else {
//       const descuento = parseInt(numericValue, 10);
//       if (descuento > totalSinDescuento) {
//         showMessage("El descuento no puede ser mayor al total de los productos");
//         setDescuentoManual(totalSinDescuento);
//       } else {
//         setDescuentoManual(descuento);
//       }
//     }
//   };

//   /** Valida el formulario */
//   const validarFormulario = () => {
//     if (productosSeleccionados.length === 0) {
//       showMessage("Debe tener al menos un producto");
//       return false;
//     }
//     if (!nombreOferta.trim()) {
//       showMessage("Debe ingresar un nombre para la oferta");
//       return false;
//     }
//     if (!startDate || !endDate) {
//       showMessage("Debe seleccionar las fechas de inicio y término");
//       return false;
//     }
//     if (!startTime || !endTime) {
//       showMessage("Debe seleccionar las horas de inicio y término");
//       return false;
//     }

//     if (endDate.isBefore(startDate, 'day')) {
//       showMessage("La fecha de término no puede ser anterior a la fecha de inicio");
//       return false;
//     }

//     const totalOriginal = productosSeleccionados.reduce(
//       (sum, p) => sum + Number(p.precioVenta || 0),
//       0
//     );

//     if (totalOriginal <= 0) {
//       showMessage("El total de los productos debe ser mayor que 0");
//       return false;
//     }

//     if (descuentoManual < 0) {
//       showMessage("El descuento no puede ser negativo");
//       return false;
//     }

//     if (descuentoManual >= totalOriginal) {
//       showMessage("El descuento debe ser menor al total de los productos");
//       return false;
//     }

//     return true;
//   };

//   /** Guarda los cambios de la oferta - OPTIMIZADO */
//   const handleGuardar = () => {
//     if (guardando) return;
    
//     if (!validarFormulario()) {
//       return;
//     }

//     setGuardando(true);
    
//     // Preparar lista para enviar
//     const listaParaEnviar = productosSeleccionados.map((p) => ({
//       codbarra: p.codbarra,
//       descripcionProducto: p.descripcionProducto,
//       cantidad: 1,
//       porcDescuento: 0,
//     }));

//     // Formatear fechas y horas correctamente
//     const fechaInicial = startDate ? startDate.startOf('day').toISOString() : null;
//     const fechaFinal = endDate ? endDate.endOf('day').toISOString() : null;
//     const horaInicio = startTime ? startTime.format("HH:mm") : "00:00";
//     const horaFin = endTime ? endTime.format("HH:mm") : "23:59";

//     const ofertaActualizada = {
//       codigoOferta: ofertaEditar.codigoOferta,
//       codigoTipo: ofertaEditar.codigoTipo || 1,
//       descripcion: nombreOferta.trim(),
//       fechaInicial: fechaInicial,
//       fechaFinal: fechaFinal,
//       horaInicio: horaInicio,
//       horaFin: horaFin,
//       diasSemana: convertirDiasAString(diasSemana),
//       fAplicaMix: true,
//       activo: ofertaActiva,
//       oferta_Regla: {
//         signo: "=",
//         cantidad: productosSeleccionados.length,
//         tipoDescuento: "$",
//         valor: totalConDescuento,
//         aplicacion: "",
//       },
//       oferta_ListaCanasta: listaParaEnviar,
//     };

//     console.log("=== ENVIANDO OFERTA ACTUALIZADA ===");
//     console.log("Datos completos:", JSON.stringify(ofertaActualizada, null, 2));
//     console.log("Número de productos:", listaParaEnviar.length);
    
//     showLoading();
//     Ofertas.updateOferta(
//       ofertaActualizada,
//       (data, response) => {
//         hideLoading();
//         setGuardando(false);
//         showMessage("Oferta actualizada exitosamente");
//         onOfertaActualizada();
//         onClose();
//       },
//       (error) => {
//         hideLoading();
//         setGuardando(false);
//         console.error("Error al actualizar oferta:", error);
//         console.error("Error details:", {
//           status: error.response?.status,
//           data: error.response?.data,
//           message: error.message
//         });
        
//         let mensajeError = "Error desconocido al actualizar oferta";
//         if (error.response?.data) {
//           if (typeof error.response.data === 'string') {
//             mensajeError = error.response.data;
//           } else if (error.response.data.descripcion) {
//             mensajeError = error.response.data.descripcion;
//           } else if (error.response.data.message) {
//             mensajeError = error.response.data.message;
//           }
//         } else if (error.message) {
//           mensajeError = error.message;
//         }
        
//         showMessage(`Error al actualizar la oferta: ${mensajeError}`);
//       }
//     );
//   };

//   // Formateo moneda
//   const formatCLP = (n) => {
//     if (n == null || isNaN(n)) return "$0";
//     return `$${n.toLocaleString("es-CL")}`;
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>
//         Editar Oferta de Productos Complementarios
//         {ofertaEditar?.codigoOferta && (
//           <Typography variant="caption" display="block" color="textSecondary">
//             Código: {ofertaEditar.codigoOferta}
//           </Typography>
//         )}
//       </DialogTitle>
//       <DialogContent>
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
//           {/* Advertencia sobre datos del backend */}
//           {productosOriginales.length > 0 && ofertaEditar?.products?.length > productosOriginales.length && (
//             <Alert severity="warning" sx={{ mb: 2 }}>
//               <Typography variant="body2">
//                 <strong>Atención:</strong> El backend está devolviendo datos duplicados. 
//                 Se mostrarán {productosSeleccionados.length} productos únicos de los {ofertaEditar.products.length} recibidos.
//               </Typography>
//             </Alert>
//           )}

//           {/* Nombre de la oferta */}
//           <TextField
//             label="Nombre de la Oferta *"
//             type="text"
//             value={nombreOferta}
//             onChange={(e) => setNombreOferta(e.target.value)}
//             fullWidth
//             required
//           />

//           {/* Componente de búsqueda de productos */}
//           <Box
//             sx={{
//               p: 2,
//               border: "1px solid #e0e0e0",
//               borderRadius: 1,
//               backgroundColor: "#fafafa",
//             }}
//           >
//             <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//               Agregar Productos
//             </Typography>
//             <SearchListOffers
//               refresh={refresh}
//               setRefresh={setRefresh}
//               onProductoSeleccionado={handleProductoSeleccionado}
//               clearSearch={clearSearch}
//             />
//           </Box>

//           {/* Indicador de carga de productos */}
//           {loadingProducts && (
//             <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
//               <CircularProgress size={30} />
//               <Typography variant="body2" sx={{ ml: 2 }}>
//                 Cargando productos de la oferta...
//               </Typography>
//             </Box>
//           )}

//           {/* Resumen de la oferta */}
//           {productosSeleccionados.length > 0 && !loadingProducts && (
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: 2,
//                 p: 2,
//                 backgroundColor: "#f5f5f5",
//                 borderRadius: 1,
//               }}
//             >
//               <Typography variant="h6">Resumen de la Oferta</Typography>

//               <Box sx={{ display: "flex", gap: 2, flexWrap: 'wrap' }}>
//                 <TextField
//                   label="Valor actual (Total productos)"
//                   value={formatCLP(totalSinDescuento)}
//                   fullWidth
//                   helperText="Suma total de todos los productos"
//                   InputProps={{
//                     readOnly: true,
//                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
//                   }}
//                 />
//                 <TextField
//                   label="Descuento aplicado *"
//                   type="text"
//                   value={descuentoManual || ""}
//                   onChange={(e) => handleDescuentoManualChange(e.target.value)}
//                   fullWidth
//                   helperText="Ingrese el descuento manual en pesos"
//                   error={descuentoManual > totalSinDescuento}
//                   InputProps={{
//                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
//                   }}
//                 />
//                 <TextField
//                   label="Total nuevo"
//                   value={formatCLP(totalConDescuento)}
//                   fullWidth
//                   helperText="Valor final de la oferta"
//                   InputProps={{
//                     readOnly: true,
//                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
//                   }}
//                 />
//               </Box>

//               {descuentoManual > 0 && (
//                 <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//                   <Typography variant="body2" color="primary">
//                     Descuento aplicado: {formatCLP(descuentoManual)}
//                     {totalSinDescuento > 0 && (
//                       <span style={{ marginLeft: 8, color: '#666' }}>
//                         ({(descuentoManual / totalSinDescuento * 100).toFixed(1)}%)
//                       </span>
//                     )}
//                   </Typography>
//                 </Box>
//               )}
//             </Box>
//           )}

//           {/* Fechas y Horas */}
//           <Box sx={{ display: "flex", gap: 2, flexWrap: 'wrap' }}>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DatePicker
//                 label="Fecha Inicio *"
//                 value={startDate}
//                 onChange={setStartDate}
//                 format="DD/MM/YYYY"
//                 slotProps={{ textField: { fullWidth: true, required: true } }}
//               />
//             </LocalizationProvider>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DatePicker
//                 label="Fecha Término *"
//                 value={endDate}
//                 onChange={setEndDate}
//                 format="DD/MM/YYYY"
//                 slotProps={{ textField: { fullWidth: true, required: true } }}
//               />
//             </LocalizationProvider>
//           </Box>

//           <Box sx={{ display: "flex", gap: 2, flexWrap: 'wrap' }}>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <TimeField
//                 label="Hora de Inicio *"
//                 format="HH:mm"
//                 value={startTime}
//                 onChange={setStartTime}
//                 slotProps={{ textField: { fullWidth: true, required: true } }}
//               />
//             </LocalizationProvider>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <TimeField
//                 label="Hora de Término *"
//                 format="HH:mm"
//                 value={endTime}
//                 onChange={setEndTime}
//                 slotProps={{ textField: { fullWidth: true, required: true } }}
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
//             <FormGroup row sx={{ display: "flex", justifyContent: "space-between", flexWrap: 'wrap' }}>
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

//           {/* Tabla de productos seleccionados */}
//           {productosSeleccionados.length > 0 && !loadingProducts && (
//             <Box sx={{ mt: 2 }}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//                 <Typography variant="h6" gutterBottom>
//                   Productos Seleccionados ({productosSeleccionados.length})
//                 </Typography>
//                 <Chip 
//                   label={`Total: ${formatCLP(totalSinDescuento)}`} 
//                   color="primary" 
//                   variant="outlined"
//                   size="small"
//                 />
//               </Box>
//               <TableContainer component={Paper} elevation={2}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
//                       <TableCell><strong>Código</strong></TableCell>
//                       <TableCell><strong>Descripción</strong></TableCell>
//                       <TableCell align="center"><strong>Precio Individual</strong></TableCell>
//                       <TableCell align="center"><strong>Acciones</strong></TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {productosSeleccionados.map((producto) => (
//                       <TableRow key={producto.codbarra} hover>
//                         <TableCell>
//                           <Chip label={producto.codbarra} size="small" color="primary" variant="outlined" />
//                         </TableCell>
//                         <TableCell>
//                           <Typography variant="body2">{producto.descripcionProducto}</Typography>
//                         </TableCell>
//                         <TableCell align="center">
//                           <Typography variant="body2" fontWeight="bold">
//                             {formatCLP(producto.precioVenta)}
//                           </Typography>
//                         </TableCell>
//                         <TableCell align="center">
//                           <IconButton
//                             size="small"
//                             color="error"
//                             onClick={() => handleEliminarProducto(producto.codbarra)}
//                             title="Eliminar"
//                           >
//                             <DeleteIcon fontSize="small" />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Box>
//           )}

//           {/* Estado de la oferta */}
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               p: 2,
//               border: "1px solid #e0e0e0",
//               borderRadius: 1,
//               backgroundColor: "#fafafa",
//             }}
//           >
//             <Box>
//               <Typography variant="subtitle1" fontWeight="bold">
//                 Estado de la Oferta
//               </Typography>
//               <Typography variant="caption" color="textSecondary">
//                 Define si la oferta estará activa o inactiva
//               </Typography>
//             </Box>
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={ofertaActiva}
//                   onChange={(e) => setOfertaActiva(e.target.checked)}
//                   color="success"
//                 />
//               }
//               label={
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <Typography variant="body2" fontWeight="bold">
//                     {ofertaActiva ? "Activa" : "Inactiva"}
//                   </Typography>
//                   <Chip
//                     label={ofertaActiva ? "ON" : "OFF"}
//                     size="small"
//                     color={ofertaActiva ? "success" : "default"}
//                   />
//                 </Box>
//               }
//               labelPlacement="start"
//             />
//           </Box>
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} disabled={guardando}>Cancelar</Button>
//         <Button
//           onClick={handleGuardar}
//           variant="contained"
//           disabled={productosSeleccionados.length === 0 || loadingProducts || guardando}
//         >
//           {guardando ? "Guardando..." : "Guardar Cambios"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default DialogEditarOfertaComplementarias;
import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Dialog,
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
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  CircularProgress,
  Switch,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import Product from "../../Models/Product";
import Ofertas from "../../Models/Ofertas";
import SearchListOffers from "./SearchListOfertas";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const DialogEditarOfertaComplementarias = ({
  open,
  onClose,
  ofertaEditar,
  onOfertaActualizada,
}) => {
  const { showLoading, hideLoading, showMessage, showConfirm } = useContext(
    SelectedOptionsContext
  );

  // Estados del formulario
  const [nombreOferta, setNombreOferta] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [diasSemana, setDiasSemana] = useState([true, true, true, true, true, true, true]);
  const [ofertaActiva, setOfertaActiva] = useState(true);

  // Estados calculados
  const [totalSinDescuento, setTotalSinDescuento] = useState(0);
  const [descuentoManual, setDescuentoManual] = useState(0);
  const [totalConDescuento, setTotalConDescuento] = useState(0);
  
  // Estado de carga
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [clearSearch, setClearSearch] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const nombresDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  // Función para cargar precio de un producto por código de barra - CORREGIDA
  const cargarPrecioProducto = async (codbarra) => {
    return new Promise((resolve, reject) => {
      if (!codbarra) {
        resolve({ precioVenta: 0, nombre: "" });
        return;
      }

      const productModel = Product.getInstance();
      
      // Usar solo findByCodigoBarras, no getAllProducts
      productModel.findByCodigoBarras(
        { codigoProducto: codbarra.toString() },
        (productos, response) => {
          if (productos && Array.isArray(productos) && productos.length > 0) {
            const producto = productos[0];
            resolve({
              precioVenta: Number(producto.precioVenta || producto.precio || 0),
              nombre: producto.nombre || producto.descripcion || "",
            });
          } else {
            // Si no se encuentra, usar valores por defecto
            resolve({ precioVenta: 0, nombre: `Producto ${codbarra}` });
          }
        },
        (error) => {
          console.error(`Error al cargar precio del producto ${codbarra}:`, error);
          resolve({ precioVenta: 0, nombre: `Producto ${codbarra}` });
        }
      );
    });
  };

  // Cargar datos de la oferta cuando se abre el diálogo
  useEffect(() => {
    if (open && ofertaEditar) {
      console.log("=== CARGANDO OFERTA PARA EDITAR ===");
      console.log("Datos completos de ofertaEditar:", ofertaEditar);
      
      // Resetear todos los estados
      resetEstados();
      
      // Cargar datos básicos
      setNombreOferta(ofertaEditar.descripcion || "");
      setOfertaActiva(ofertaEditar.activo ?? true);

      // Cargar fechas
      if (ofertaEditar.fechaInicial) {
        try {
          setStartDate(dayjs(ofertaEditar.fechaInicial));
        } catch (e) {
          console.error("Error al parsear fecha inicial:", e);
        }
      }
      if (ofertaEditar.fechaFinal) {
        try {
          setEndDate(dayjs(ofertaEditar.fechaFinal));
        } catch (e) {
          console.error("Error al parsear fecha final:", e);
        }
      }

      // Cargar horas
      if (ofertaEditar.horaInicio) {
        try {
          const [hours, minutes] = ofertaEditar.horaInicio.split(":");
          setStartTime(dayjs().hour(parseInt(hours) || 0).minute(parseInt(minutes) || 0));
        } catch (e) {
          console.error("Error al parsear hora inicio:", e);
        }
      }
      if (ofertaEditar.horaFin) {
        try {
          const [hours, minutes] = ofertaEditar.horaFin.split(":");
          setEndTime(dayjs().hour(parseInt(hours) || 23).minute(parseInt(minutes) || 59));
        } catch (e) {
          console.error("Error al parsear hora fin:", e);
        }
      }

      // Cargar días de la semana
      if (ofertaEditar.diasSemana && ofertaEditar.diasSemana.length === 7) {
        const diasArray = ofertaEditar.diasSemana.split("").map(d => d === "1");
        setDiasSemana(diasArray);
      }

      // Extraer productos de MANERA SEGURA
      extraerProductosDeOferta(ofertaEditar);
    }
  }, [open, ofertaEditar]);

  // Función para resetear estados
  const resetEstados = () => {
    setProductosSeleccionados([]);
    setProductosOriginales([]);
    setDescuentoManual(0);
    setTotalSinDescuento(0);
    setTotalConDescuento(0);
    setGuardando(false);
  };

  // Función para extraer productos de la oferta de manera segura
  const extraerProductosDeOferta = async (oferta) => {
    setLoadingProducts(true);
    
    try {
      let productosACargar = [];
      
      // PRIORIDAD 1: Buscar en oferta_ListaCanasta (que es lo que realmente se envía)
      if (oferta.oferta_ListaCanasta && Array.isArray(oferta.oferta_ListaCanasta)) {
        console.log("Usando oferta_ListaCanasta:", oferta.oferta_ListaCanasta);
        productosACargar = oferta.oferta_ListaCanasta;
      } 
      // PRIORIDAD 2: Si no hay oferta_ListaCanasta, usar products pero FILTRAR DUPLICADOS
      else if (oferta.products && Array.isArray(oferta.products)) {
        console.log("Usando products (filtrando duplicados):", oferta.products);
        
        // Filtrar duplicados por codbarra
        const mapaProductos = new Map();
        oferta.products.forEach(prod => {
          if (prod.codbarra && !mapaProductos.has(prod.codbarra)) {
            mapaProductos.set(prod.codbarra, prod);
          }
        });
        
        productosACargar = Array.from(mapaProductos.values()).map(prod => ({
          codbarra: prod.codbarra,
          descripcionProducto: prod.descripcion || "",
          cantidad: 1,
          porcDescuento: 0
        }));
      }
      
      // Guardar productos originales para referencia
      setProductosOriginales([...productosACargar]);
      
      if (productosACargar.length > 0) {
        await cargarProductosConPrecios(productosACargar);
        
        // Calcular descuento inicial basado en el valor de la oferta
        if (oferta.oferta_Regla?.valor && oferta.oferta_Regla.valor > 0) {
          const totalProductos = productosSeleccionados.reduce(
            (sum, p) => sum + Number(p.precioVenta || 0),
            0
          );
          if (totalProductos > 0) {
            const descuentoCalculado = Math.max(0, totalProductos - oferta.oferta_Regla.valor);
            setDescuentoManual(descuentoCalculado);
          }
        }
      } else {
        console.warn("No se encontraron productos en la oferta");
      }
    } catch (error) {
      console.error("Error al extraer productos:", error);
      showMessage("Error al cargar los productos de la oferta");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Función para cargar productos con sus precios
  const cargarProductosConPrecios = async (products) => {
    console.log("Cargando precios para productos:", products);

    try {
      const productosConPrecios = await Promise.all(
        products.map(async (prod) => {
          try {
            const { precioVenta, nombre } = await cargarPrecioProducto(prod.codbarra);
            return {
              codbarra: prod.codbarra,
              descripcionProducto: nombre || prod.descripcionProducto || prod.descripcion || `Producto ${prod.codbarra}`,
              cantidad: 1,
              precioVenta: precioVenta,
            };
          } catch (error) {
            console.error(`Error cargando producto ${prod.codbarra}:`, error);
            return {
              codbarra: prod.codbarra,
              descripcionProducto: prod.descripcionProducto || `Producto ${prod.codbarra}`,
              cantidad: 1,
              precioVenta: 0,
            };
          }
        })
      );

      console.log("Productos cargados con éxito:", productosConPrecios);
      setProductosSeleccionados(productosConPrecios);
    } catch (error) {
      console.error("Error fatal al cargar precios:", error);
      showMessage("Error al cargar los precios de los productos");
    }
  };

  // Cálculo de totales - SIMPLIFICADO Y ROBUSTO
  useEffect(() => {
    if (productosSeleccionados.length === 0) {
      setTotalSinDescuento(0);
      setTotalConDescuento(0);
      return;
    }

    const totalOriginal = productosSeleccionados.reduce(
      (sum, p) => sum + Number(p.precioVenta || 0),
      0
    );
    
    setTotalSinDescuento(totalOriginal);
    
    const totalConDescuentoCalculado = Math.max(0, totalOriginal - descuentoManual);
    setTotalConDescuento(totalConDescuentoCalculado);
    
  }, [productosSeleccionados, descuentoManual]);

  /** Convierte array de booleanos a string de días */
  const convertirDiasAString = (diasArray) => {
    return diasArray.map((dia) => (dia ? "1" : "0")).join("");
  };

  /** Maneja el cambio de selección de un día específico */
  const handleDiaChange = (index) => {
    const nuevosDias = [...diasSemana];
    nuevosDias[index] = !nuevosDias[index];
    setDiasSemana(nuevosDias);
  };

  /** Selecciona o deselecciona todos los días */
  const handleTodosLosDias = (seleccionar) => {
    setDiasSemana(new Array(7).fill(seleccionar));
  };

  /** Elimina un producto de la lista */
  const handleEliminarProducto = (codbarra) => {
    console.log("Eliminando producto:", codbarra);
    const nuevosProductos = productosSeleccionados.filter((p) => p.codbarra !== codbarra);
    setProductosSeleccionados(nuevosProductos);
  };

  /** Agrega un producto a la lista de productos seleccionados */
  const handleProductoSeleccionado = async (producto) => {
    const yaExiste = productosSeleccionados.some(
      (p) => p.codbarra === producto.codbarra
    );
    if (yaExiste) {
      showMessage("Este producto ya ha sido agregado");
      return;
    }

    const codbarra = producto.codbarra || producto.idProducto?.toString();
    
    // Cargar el precio real del producto
    const { precioVenta, nombre } = await cargarPrecioProducto(codbarra);

    const nuevoProducto = {
      codbarra: codbarra,
      descripcionProducto: nombre || producto.nombre || producto.descripcion,
      cantidad: 1,
      precioVenta: precioVenta,
    };

    console.log("Agregando nuevo producto:", nuevoProducto);
    setProductosSeleccionados((prev) => [...prev, nuevoProducto]);
    setClearSearch((prev) => !prev);
  };

  /** Maneja el cambio del descuento manual */
  const handleDescuentoManualChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue === "" || numericValue === "0") {
      setDescuentoManual(0);
    } else {
      const descuento = parseInt(numericValue, 10);
      if (descuento > totalSinDescuento) {
        showMessage("El descuento no puede ser mayor al total de los productos");
        setDescuentoManual(totalSinDescuento);
      } else {
        setDescuentoManual(descuento);
      }
    }
  };

  /** Valida el formulario */
  const validarFormulario = () => {
    if (productosSeleccionados.length === 0) {
      showMessage("Debe tener al menos un producto");
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
      showMessage("Debe seleccionar las horas de inicio y término");
      return false;
    }

    if (endDate && startDate && endDate.isBefore(startDate, 'day')) {
      showMessage("La fecha de término no puede ser anterior a la fecha de inicio");
      return false;
    }

    const totalOriginal = productosSeleccionados.reduce(
      (sum, p) => sum + Number(p.precioVenta || 0),
      0
    );

    if (totalOriginal <= 0) {
      showMessage("El total de los productos debe ser mayor que 0");
      return false;
    }

    if (descuentoManual < 0) {
      showMessage("El descuento no puede ser negativo");
      return false;
    }

    if (descuentoManual >= totalOriginal) {
      showMessage("El descuento debe ser menor al total de los productos");
      return false;
    }

    return true;
  };

  /** Guarda los cambios de la oferta - OPTIMIZADO */
  const handleGuardar = () => {
    if (guardando) return;
    
    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);
    
    // Preparar lista para enviar
    const listaParaEnviar = productosSeleccionados.map((p) => ({
      codbarra: p.codbarra,
      descripcionProducto: p.descripcionProducto,
      cantidad: 1,
      porcDescuento: 0,
    }));

    // Formatear fechas y horas correctamente
    const fechaInicial = startDate ? startDate.startOf('day').toISOString() : null;
    const fechaFinal = endDate ? endDate.endOf('day').toISOString() : null;
    const horaInicio = startTime ? startTime.format("HH:mm") : "00:00";
    const horaFin = endTime ? endTime.format("HH:mm") : "23:59";

    const ofertaActualizada = {
      codigoOferta: ofertaEditar.codigoOferta,
      codigoTipo: ofertaEditar.codigoTipo || 1,
      descripcion: nombreOferta.trim(),
      fechaInicial: fechaInicial,
      fechaFinal: fechaFinal,
      horaInicio: horaInicio,
      horaFin: horaFin,
      diasSemana: convertirDiasAString(diasSemana),
      fAplicaMix: true,
      activo: ofertaActiva,
      oferta_Regla: {
        signo: "=",
        cantidad: productosSeleccionados.length,
        tipoDescuento: "$",
        valor: totalConDescuento,
        aplicacion: "",
      },
      oferta_ListaCanasta: listaParaEnviar,
    };

    console.log("=== ENVIANDO OFERTA ACTUALIZADA ===");
    console.log("Datos completos:", JSON.stringify(ofertaActualizada, null, 2));
    console.log("Número de productos:", listaParaEnviar.length);
    
    showLoading();
    Ofertas.updateOferta(
      ofertaActualizada,
      (data, response) => {
        hideLoading();
        setGuardando(false);
        showMessage("Oferta actualizada exitosamente");
        onOfertaActualizada();
        onClose();
      },
      (error) => {
        hideLoading();
        setGuardando(false);
        console.error("Error al actualizar oferta:", error);
        console.error("Error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        
        let mensajeError = "Error desconocido al actualizar oferta";
        if (error.response?.data) {
          if (typeof error.response.data === 'string') {
            mensajeError = error.response.data;
          } else if (error.response.data.descripcion) {
            mensajeError = error.response.data.descripcion;
          } else if (error.response.data.message) {
            mensajeError = error.response.data.message;
          }
        } else if (error.message) {
          mensajeError = error.message;
        }
        
        showMessage(`Error al actualizar la oferta: ${mensajeError}`);
      }
    );
  };

  // Formateo moneda
  const formatCLP = (n) => {
    if (n == null || isNaN(n)) return "$0";
    return `$${n.toLocaleString("es-CL")}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Editar Oferta de Productos Complementarios
        {ofertaEditar?.codigoOferta && (
          <Typography variant="caption" display="block" color="textSecondary">
            Código: {ofertaEditar.codigoOferta}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {/* Advertencia sobre datos del backend */}
          {productosOriginales.length > 0 && ofertaEditar?.products?.length > productosOriginales.length && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Atención:</strong> El backend está devolviendo datos duplicados. 
                Se mostrarán {productosSeleccionados.length} productos únicos de los {ofertaEditar.products.length} recibidos.
              </Typography>
            </Alert>
          )}

          {/* Nombre de la oferta */}
          <TextField
            label="Nombre de la Oferta *"
            type="text"
            value={nombreOferta}
            onChange={(e) => setNombreOferta(e.target.value)}
            fullWidth
            required
          />

          {/* Componente de búsqueda de productos */}
          <Box
            sx={{
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              backgroundColor: "#fafafa",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Agregar Productos
            </Typography>
            <SearchListOffers
              refresh={refresh}
              setRefresh={setRefresh}
              onProductoSeleccionado={handleProductoSeleccionado}
              clearSearch={clearSearch}
            />
          </Box>

          {/* Indicador de carga de productos */}
          {loadingProducts && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={30} />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Cargando productos de la oferta...
              </Typography>
            </Box>
          )}

          {/* Resumen de la oferta */}
          {productosSeleccionados.length > 0 && !loadingProducts && (
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
              <Typography variant="h6">Resumen de la Oferta</Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  label="Valor actual (Total productos)"
                  value={formatCLP(totalSinDescuento)}
                  fullWidth
                  helperText="Suma total de todos los productos"
                  InputProps={{
                    readOnly: true,
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
                <TextField
                  label="Descuento aplicado *"
                  type="text"
                  value={descuentoManual || ""}
                  onChange={(e) => handleDescuentoManualChange(e.target.value)}
                  fullWidth
                  helperText="Ingrese el descuento manual en pesos"
                  error={descuentoManual > totalSinDescuento}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
                <TextField
                  label="Total nuevo"
                  value={formatCLP(totalConDescuento)}
                  fullWidth
                  helperText="Valor final de la oferta"
                  InputProps={{
                    readOnly: true,
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Box>

              {descuentoManual > 0 && (
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Typography variant="body2" color="primary">
                    Descuento aplicado: {formatCLP(descuentoManual)}
                    {totalSinDescuento > 0 && (
                      <span style={{ marginLeft: 8, color: '#666' }}>
                        ({(descuentoManual / totalSinDescuento * 100).toFixed(1)}%)
                      </span>
                    )}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Fechas y Horas */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: 'wrap' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha Inicio *"
                value={startDate}
                onChange={setStartDate}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha Término *"
                value={endDate}
                onChange={setEndDate}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </LocalizationProvider>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: 'wrap' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label="Hora de Inicio *"
                format="HH:mm"
                value={startTime}
                onChange={setStartTime}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label="Hora de Término *"
                format="HH:mm"
                value={endTime}
                onChange={setEndTime}
                slotProps={{ textField: { fullWidth: true, required: true } }}
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
            <FormGroup row sx={{ display: "flex", justifyContent: "space-between", flexWrap: 'wrap' }}>
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

          {/* Tabla de productos seleccionados */}
          {productosSeleccionados.length > 0 && !loadingProducts && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Productos Seleccionados ({productosSeleccionados.length})
                </Typography>
                <Chip 
                  label={`Total: ${formatCLP(totalSinDescuento)}`} 
                  color="primary" 
                  variant="outlined"
                  size="small"
                />
              </Box>
              <TableContainer component={Paper} elevation={2}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                      <TableCell><strong>Código</strong></TableCell>
                      <TableCell><strong>Descripción</strong></TableCell>
                      <TableCell align="center"><strong>Precio Individual</strong></TableCell>
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
                          <Typography variant="body2" fontWeight="bold">
                            {formatCLP(producto.precioVenta)}
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
            </Box>
          )}

          {/* Estado de la oferta */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              backgroundColor: "#fafafa",
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Estado de la Oferta
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Define si la oferta estará activa o inactiva
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={ofertaActiva}
                  onChange={(e) => setOfertaActiva(e.target.checked)}
                  color="success"
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {ofertaActiva ? "Activa" : "Inactiva"}
                  </Typography>
                  <Chip
                    label={ofertaActiva ? "ON" : "OFF"}
                    size="small"
                    color={ofertaActiva ? "success" : "default"}
                  />
                </Box>
              }
              labelPlacement="start"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={guardando}>Cancelar</Button>
        <Button
          onClick={handleGuardar}
          variant="contained"
          disabled={productosSeleccionados.length === 0 || loadingProducts || guardando}
        >
          {guardando ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogEditarOfertaComplementarias;