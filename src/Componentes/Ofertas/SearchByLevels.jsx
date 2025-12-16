// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Table,
//   TableBody,
//   CircularProgress,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TablePagination,
//   Typography,
//   TextField,
//   IconButton,
//   Collapse,
//   Card,
//   CardContent,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";
// import axios from "axios";
// import ModelConfig from "../../Models/ModelConfig";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import AddCircleIcon from "@mui/icons-material/AddCircle";

// const SearchByLevels = ({
//   onProductoSeleccionado,
//   clearSearch,
//   refresh
// }) => {
//   const apiUrl = ModelConfig.get().urlBase;

//   // Estados de búsqueda
//   const [startDate, setStartDate] = useState(dayjs());
//   const [endDate, setEndDate] = useState(dayjs());
//   const [tipo, setTipo] = useState("Productos");
//   const [data, setData] = useState([]);
//   const [dataResult, setDataResult] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Estados de paginación y filtros
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [filtrarTexto, setFiltrarTexto] = useState("");

//   // Estado de expansión del panel
//   const [expanded, setExpanded] = useState(true);

//   // Limpiar búsqueda cuando clearSearch cambie
//   useEffect(() => {
//     if (clearSearch) {
//       limpiarBusqueda();
//     }
//   }, [clearSearch]);

//   const fetchData = async () => {
//     setLoading(true);

//     try {
//       let url;
//       let response;

//       // Determinar qué endpoint usar según el tipo seleccionado
//       if (tipo === "Familia") {
//         url = "https://www.easyposqas.somee.com/api/NivelMercadoLogicos/GetAllFamilias";
//         response = await axios.get(url);
//         console.log("Familia", response.data);

//         // Procesar datos de familias - AJUSTADO según la estructura real
//         if (response.data && response.data.familias && Array.isArray(response.data.familias)) {
//           const familiasFormateadas = response.data.familias.map((familia, index) => ({
//             codigoProducto: familia.idFamilia,
//             descripcion: familia.descripcion,
//             precioVenta: 0,
//             precioCosto: 0,
//             stockActual: 0,
//             cantidad: 0,
//             sumaTotal: 0,
//             ranking: index + 1,
//             // Información adicional para referencia
//             idCategoria: familia.idCategoria,
//             idSubcategoria: familia.idSubcategoria,
//             bajaLogica: familia.bajaLogica
//           }));

//           setData(familiasFormateadas);
//           setDataResult(familiasFormateadas);
//           setPage(0);
//         } else {
//           console.warn("Estructura de datos inesperada para familias:", response.data);
//           setData([]);
//           setDataResult([]);
//         }
//       } else if (tipo === "SubFamilia") {
//         url = "https://www.easyposqas.somee.com/api/NivelMercadoLogicos/GetAllSubFamilias";
//         response = await axios.get(url);
//         console.log("SubFamilia", response.data);

//         // Procesar datos de subfamilias - Suponiendo estructura similar
//         if (response.data && response.data.subfamilias && Array.isArray(response.data.subfamilias)) {
//           const subfamiliasFormateadas = response.data.subfamilias.map((subfamilia, index) => ({
//             codigoProducto: subfamilia.idSubfamilia || subfamilia.id,
//             descripcion: subfamilia.descripcion || subfamilia.nombre,
//             precioVenta: 0,
//             precioCosto: 0,
//             stockActual: 0,
//             cantidad: 0,
//             sumaTotal: 0,
//             ranking: index + 1,
//             // Información adicional si existe
//             idCategoria: subfamilia.idCategoria,
//             idFamilia: subfamilia.idFamilia,
//             bajaLogica: subfamilia.bajaLogica
//           }));

//           setData(subfamiliasFormateadas);
//           setDataResult(subfamiliasFormateadas);
//           setPage(0);
//         } else {
//           // Fallback: si la estructura no tiene propiedad subfamilias
//           console.warn("Estructura de datos inesperada para subfamilias:", response.data);
//           // Intentar usar response.data directamente si es un array
//           if (response.data && Array.isArray(response.data)) {
//             const subfamiliasFormateadas = response.data.map((subfamilia, index) => ({
//               codigoProducto: subfamilia.idSubfamilia || subfamilia.id,
//               descripcion: subfamilia.descripcion || subfamilia.nombre,
//               precioVenta: 0,
//               precioCosto: 0,
//               stockActual: 0,
//               cantidad: 0,
//               sumaTotal: 0,
//               ranking: index + 1
//             }));

//             setData(subfamiliasFormateadas);
//             setDataResult(subfamiliasFormateadas);
//             setPage(0);
//           } else {
//             setData([]);
//             setDataResult([]);
//           }
//         }
//       } else {
//         // Para Productos y Marca, usar el endpoint original
//         const params = {
//           fechadesde: startDate ? startDate.format("YYYY-MM-DD") : "",
//           fechahasta: endDate ? endDate.format("YYYY-MM-DD") : "",
//           tipo: tipo.toString(),
//         };

//         url = apiUrl + `/ReporteVentas/ReporteVentasRankingProductoGET`;
//         response = await axios.get(url, { params });

//         if (response.data && response.data.cantidad > 0 && response.data.reporteVentaRankingProductos) {
//           setData(response.data.reporteVentaRankingProductos);
//           setDataResult(response.data.reporteVentaRankingProductos);
//           setPage(0);
//         } else {
//           setData([]);
//           setDataResult([]);
//         }
//       }
//     } catch (error) {
//       console.error("Error al buscar datos:", error);
//       setData([]);
//       setDataResult([]);
//       alert("Error al cargar los datos. Por favor, intente nuevamente.");
//     }

//     setLoading(false);
//   };
//   const handleBuscarClick = () => {
//     // Para Familia y SubFamilia no necesitamos validar fechas
//     if (tipo !== "Familia" && tipo !== "SubFamilia") {
//       if (!startDate || !endDate) {
//         alert("Por favor, seleccione ambas fechas.");
//         return;
//       }

//       if (dayjs(startDate).isAfter(endDate)) {
//         alert("La fecha de inicio no puede ser mayor que la fecha de término.");
//         return;
//       }
//     }

//     fetchData();
//   };

//   const filtrar = () => {
//     if (!filtrarTexto.trim()) {
//       setData(dataResult);
//       return;
//     }

//     const dataFiltrada = dataResult.filter((item) =>
//       item.descripcion.toLowerCase().includes(filtrarTexto.toLowerCase())
//     );
//     setData(dataFiltrada);
//     setPage(0);
//   };

//   const quitarFiltro = () => {
//     setFiltrarTexto("");
//     setData(dataResult);
//     setPage(0);
//   };

//   const limpiarBusqueda = () => {
//     setData([]);
//     setDataResult([]);
//     setFiltrarTexto("");
//     setPage(0);
//     setStartDate(dayjs());
//     setEndDate(dayjs());
//     setTipo("Productos");
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleSeleccionarProducto = (producto) => {
//     // Verificar si es una familia/subfamilia o un producto normal
//     const esFamiliaOSubFamilia = tipo === "Familia" || tipo === "SubFamilia";

//     const productoFormateado = {
//       idProducto: producto.codigoProducto,
//       codbarra: producto.codigoProducto,
//       nombre: producto.descripcion,
//       descripcion: producto.descripcion,
//       precioVenta: producto.precioVenta,
//       precioCosto: producto.precioCosto,
//       stockActual: producto.stockActual,
//       tipo: tipo, // Agregar tipo para identificar si es familia/subfamilia
//       ...(esFamiliaOSubFamilia && {
//         esNivel: true,
//         idCategoria: producto.idCategoria,
//         idSubcategoria: producto.idSubcategoria,
//         // Para familias: idFamilia ya está en idProducto
//         // Para subfamilias: podrías necesitar idFamilia si existe
//         ...(tipo === "Familia" && { idFamilia: producto.codigoProducto }),
//         ...(tipo === "SubFamilia" && {
//           idSubfamilia: producto.codigoProducto,
//           idFamilia: producto.idFamilia
//         })
//       })
//     };

//     onProductoSeleccionado(productoFormateado);
//   };
//   const formatCLP = (valor) => {
//     if (valor == null || isNaN(valor)) return "$0";
//     return `$${valor.toLocaleString("es-CL")}`;
//   };

//   // Verificar si las fechas son necesarias según el tipo seleccionado
//   const requiresFechas = tipo !== "Familia" && tipo !== "SubFamilia";

//   return (
//     <Card elevation={2} sx={{ mb: 2 }}>
//       <CardContent>
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//           <Typography variant="h6" component="div">
//             Búsqueda por Niveles (Ranking de Ventas)
//           </Typography>
//           <IconButton onClick={() => setExpanded(!expanded)}>
//             {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//           </IconButton>
//         </Box>

//         <Collapse in={expanded}>
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//             {/* Filtros de búsqueda */}
//             <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
//               {requiresFechas && (
//                 <>
//                   <LocalizationProvider dateAdapter={AdapterDayjs}>
//                     <DatePicker
//                       label="Fecha Inicio"
//                       value={startDate}
//                       onChange={(newValue) => setStartDate(newValue)}
//                       format="DD/MM/YYYY"
//                       slotProps={{
//                         textField: {
//                           size: "small",
//                           sx: { minWidth: 180 }
//                         }
//                       }}
//                     />
//                   </LocalizationProvider>

//                   <LocalizationProvider dateAdapter={AdapterDayjs}>
//                     <DatePicker
//                       label="Fecha Término"
//                       value={endDate}
//                       onChange={(newValue) => setEndDate(newValue)}
//                       format="DD/MM/YYYY"
//                       slotProps={{
//                         textField: {
//                           size: "small",
//                           sx: { minWidth: 180 }
//                         }
//                       }}
//                     />
//                   </LocalizationProvider>
//                 </>
//               )}

//               <FormControl size="small" sx={{ minWidth: 180 }}>
//                 <InputLabel>Tipo</InputLabel>
//                 <Select
//                   value={tipo}
//                   label="Tipo"
//                   onChange={(e) => setTipo(e.target.value)}
//                 >
//                   <MenuItem value="Productos">Productos</MenuItem>
//                   <MenuItem value="Marca">Marca</MenuItem>
//                   <MenuItem value="Familia">Familia</MenuItem>
//                   <MenuItem value="SubFamilia">Sub Familia</MenuItem>
//                 </Select>
//               </FormControl>

//               <Button
//                 variant="contained"
//                 onClick={handleBuscarClick}
//                 disabled={loading}
//                 sx={{ minWidth: 120 }}
//               >
//                 {loading ? "Buscando..." : "Buscar"}
//               </Button>
//             </Box>

//             {/* Filtro de texto */}
//             {data.length > 0 && (
//               <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//                 <TextField
//                   size="small"
//                   fullWidth
//                   label="Filtrar por descripción"
//                   value={filtrarTexto}
//                   onChange={(e) => setFiltrarTexto(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && filtrar()}
//                 />
//                 <Button
//                   variant="contained"
//                   color="success"
//                   onClick={filtrar}
//                   size="small"
//                   sx={{ minWidth: 100 }}
//                 >
//                   Filtrar
//                 </Button>
//                 {filtrarTexto && (
//                   <Button
//                     variant="contained"
//                     color="error"
//                     onClick={quitarFiltro}
//                     size="small"
//                     sx={{ minWidth: 120 }}
//                   >
//                     Quitar Filtro
//                   </Button>
//                 )}
//               </Box>
//             )}

//             {/* Tabla de resultados */}
//             {loading ? (
//               <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
//                 <CircularProgress />
//               </Box>
//             ) : data.length === 0 ? (
//               <Box sx={{ p: 2, textAlign: "center", backgroundColor: "#f5f5f5", borderRadius: 1 }}>
//                 <Typography color="textSecondary">
//                   {dataResult.length === 0
//                     ? "Realice una búsqueda para ver resultados"
//                     : "No se encontraron resultados con ese filtro"}
//                 </Typography>
//               </Box>
//             ) : (
//               <>
//                 <TableContainer component={Paper} elevation={1}>
//                   <Table size="small">
//                     <TableHead>
//                       <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
//                         <TableCell><strong>Código</strong></TableCell>
//                         <TableCell><strong>Descripción</strong></TableCell>
//                         {requiresFechas && (
//                           <>
//                             <TableCell align="right"><strong>Precio Venta</strong></TableCell>
//                             <TableCell align="right"><strong>Stock</strong></TableCell>
//                             <TableCell align="right"><strong>Cantidad Vendida</strong></TableCell>
//                             <TableCell align="right"><strong>Total Ventas</strong></TableCell>
//                           </>
//                         )}
//                         <TableCell align="center"><strong>Ranking</strong></TableCell>
//                         <TableCell align="center"><strong>Acción</strong></TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {data
//                         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                         .map((producto, index) => (
//                           <TableRow key={producto.codigoProducto || index} hover>
//                             <TableCell>
//                               <Typography variant="body2" color="primary">
//                                 {producto.codigoProducto}
//                               </Typography>
//                             </TableCell>
//                             <TableCell>
//                               <Typography variant="body2">
//                                 {producto.descripcion}
//                               </Typography>
//                             </TableCell>
//                             {requiresFechas && (
//                               <>
//                                 <TableCell align="right">
//                                   <Typography variant="body2">
//                                     {formatCLP(producto.precioVenta)}
//                                   </Typography>
//                                 </TableCell>
//                                 <TableCell align="right">
//                                   <Typography variant="body2">
//                                     {producto.stockActual.toLocaleString("es-CL")}
//                                   </Typography>
//                                 </TableCell>
//                                 <TableCell align="right">
//                                   <Typography variant="body2" color="secondary">
//                                     {producto.cantidad.toLocaleString("es-CL")}
//                                   </Typography>
//                                 </TableCell>
//                                 <TableCell align="right">
//                                   <Typography variant="body2" fontWeight="bold">
//                                     {formatCLP(producto.sumaTotal)}
//                                   </Typography>
//                                 </TableCell>
//                               </>
//                             )}
//                             <TableCell align="center">
//                               <Typography
//                                 variant="body2"
//                                 sx={{
//                                   backgroundColor: "#ffd54f",
//                                   borderRadius: 1,
//                                   px: 1,
//                                   fontWeight: "bold"
//                                 }}
//                               >
//                                 #{producto.ranking}
//                               </Typography>
//                             </TableCell>
//                             <TableCell align="center">
//                               <IconButton
//                                 size="small"
//                                 color="primary"
//                                 onClick={() => handleSeleccionarProducto(producto)}
//                                 title="Seleccionar producto"
//                               >
//                                 <AddCircleIcon />
//                               </IconButton>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//                 <TablePagination
//                   component="div"
//                   count={data.length}
//                   page={page}
//                   onPageChange={handleChangePage}
//                   rowsPerPage={rowsPerPage}
//                   onRowsPerPageChange={handleChangeRowsPerPage}
//                   rowsPerPageOptions={[5, 10, 25]}
//                   labelRowsPerPage="Filas por página"
//                   labelDisplayedRows={({ from, to, count }) =>
//                     `${from}-${to} de ${count}`
//                   }
//                 />
//               </>
//             )}
//           </Box>
//         </Collapse>
//       </CardContent>
//     </Card>
//   );
// };

// export default SearchByLevels;
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
import axios from "axios";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const SearchByLevels = ({ onProductoSeleccionado, clearSearch, refresh }) => {
  // Estados de búsqueda
  const [tipo, setTipo] = useState("Familia");
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

    try {
      let url;
      let response;

      // Determinar qué endpoint usar según el tipo seleccionado
      if (tipo === "Familia") {
        url =
          "https://www.easyposqas.somee.com/api/NivelMercadoLogicos/GetAllFamilias";
        response = await axios.get(url);

        // Procesar datos de familias
        if (
          response.data &&
          response.data.familias &&
          Array.isArray(response.data.familias)
        ) {
          const familiasFormateadas = response.data.familias.map(
            (familia, index) => ({
              codigoProducto: familia.idFamilia,
              descripcion: familia.descripcion,
              precioVenta: 0,
              precioCosto: 0,
              stockActual: 0,
              cantidad: 0,
              sumaTotal: 0,
              ranking: index + 1,
              // Información adicional
              idCategoria: familia.idCategoria,
              idSubcategoria: familia.idSubcategoria,
              bajaLogica: familia.bajaLogica,
            })
          );

          setData(familiasFormateadas);
          setDataResult(familiasFormateadas);
          setPage(0);
        } else {
          console.warn(
            "Estructura de datos inesperada para familias:",
            response.data
          );
          setData([]);
          setDataResult([]);
        }
      } else if (tipo === "SubFamilia") {
        url =
          "https://www.easyposqas.somee.com/api/NivelMercadoLogicos/GetAllSubFamilias";
        response = await axios.get(url);
        console.log("Respuesta subfamilias:", response.data);

        // Procesar datos de subfamilias - AJUSTADO según la nueva estructura
        if (
          response.data &&
          response.data.subFamilias &&
          Array.isArray(response.data.subFamilias)
        ) {
          const subfamiliasFormateadas = response.data.subFamilias.map(
            (subfamilia, index) => ({
              codigoProducto: subfamilia.idSubFamilia,
              descripcion: subfamilia.descripcion,
              precioVenta: 0,
              precioCosto: 0,
              stockActual: 0,
              cantidad: 0,
              sumaTotal: 0,
              ranking: index + 1,
              // Información adicional
              idCategoria: subfamilia.idCategoria,
              idSubcategoria: subfamilia.idSubcategoria,
              idFamilia: subfamilia.idFamilia,
              bajaLogica: subfamilia.bajaLogica,
            })
          );

          setData(subfamiliasFormateadas);
          setDataResult(subfamiliasFormateadas);
          setPage(0);
        } else {
          // Fallback: si la estructura no tiene propiedad subFamilias
          console.warn(
            "Estructura de datos inesperada para subfamilias:",
            response.data
          );
          // Intentar usar response.data directamente si es un array
          if (response.data && Array.isArray(response.data)) {
            const subfamiliasFormateadas = response.data.map(
              (subfamilia, index) => ({
                codigoProducto: subfamilia.idSubFamilia || subfamilia.id,
                descripcion: subfamilia.descripcion || subfamilia.nombre,
                precioVenta: 0,
                precioCosto: 0,
                stockActual: 0,
                cantidad: 0,
                sumaTotal: 0,
                ranking: index + 1,
              })
            );

            setData(subfamiliasFormateadas);
            setDataResult(subfamiliasFormateadas);
            setPage(0);
          } else {
            setData([]);
            setDataResult([]);
          }
        }
      }
    } catch (error) {
      console.error("Error al buscar datos:", error);
      setData([]);
      setDataResult([]);
      alert("Error al cargar los datos. Por favor, intente nuevamente.");
    }

    setLoading(false);
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
    setTipo("Familia");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSeleccionarProducto = (item) => {
    const itemFormateado = {
      idProducto: item.codigoProducto,
      codbarra: item.codigoProducto,
      nombre: item.descripcion,
      descripcion: item.descripcion,
      precioVenta: 0,
      precioCosto: 0,
      stockActual: 0,
      tipo: tipo,
      esNivel: true,
      ...(tipo === "Familia" && {
        idFamilia: item.codigoProducto,
        idCategoria: item.idCategoria,
        idSubcategoria: item.idSubcategoria,
      }),
      ...(tipo === "SubFamilia" && {
        idSubfamilia: item.codigoProducto,
        idFamilia: item.idFamilia,
        idCategoria: item.idCategoria,
        idSubcategoria: item.idSubcategoria,
      }),
    };

    onProductoSeleccionado(itemFormateado);
    setData([]);
    setDataResult([]);
    setFiltrarTexto("");

  };

  // Manejar búsqueda cuando cambia el tipo
  useEffect(() => {
    if (refresh) {
      fetchData();
    }
  }, [refresh]);

  // Búsqueda automática al cambiar el tipo
  useEffect(() => {
    if (data.length === 0) {
      fetchData();
    }
  }, [tipo]);

  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" component="div">
            Búsqueda por Niveles
          </Typography>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Filtros de búsqueda */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={tipo}
                  label="Tipo"
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <MenuItem value="Familia">Familia</MenuItem>
                  <MenuItem value="SubFamilia">Sub Familia</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={fetchData}
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
                  onKeyPress={(e) => e.key === "Enter" && filtrar()}
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
              <Box
                sx={{
                  p: 2,
                  textAlign: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                }}
              >
                <Typography color="textSecondary">
                  {dataResult.length === 0
                    ? "Realice una búsqueda para ver resultados"
                    : "No se encontraron resultados con ese filtro"}
                </Typography>
              </Box>
            ) : (
              <>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  Mostrando {data.length} {tipo.toLowerCase()}(s)
                </Typography>
                <TableContainer component={Paper} elevation={1}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                        <TableCell>
                          <strong>Código</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Descripción</strong>
                        </TableCell>
                        {tipo === "Familia" && (
                          <>
                            <TableCell>
                              <strong>Categoría</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Subcategoría</strong>
                            </TableCell>
                          </>
                        )}
                        {tipo === "SubFamilia" && (
                          <>
                            <TableCell>
                              <strong>Categoría</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Subcategoría</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Familia</strong>
                            </TableCell>
                          </>
                        )}
                        <TableCell align="center">
                          <strong>Acción</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((item, index) => (
                          <TableRow
                            key={`${item.codigoProducto}-${index}`}
                            hover
                          >
                            <TableCell>
                              <Typography variant="body2" color="primary">
                                {item.codigoProducto}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {item.descripcion}
                              </Typography>
                            </TableCell>
                            {tipo === "Familia" && (
                              <>
                                <TableCell>
                                  <Typography variant="body2">
                                    {item.idCategoria}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {item.idSubcategoria}
                                  </Typography>
                                </TableCell>
                              </>
                            )}
                            {tipo === "SubFamilia" && (
                              <>
                                <TableCell>
                                  <Typography variant="body2">
                                    {item.idCategoria || "N/A"}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {item.idSubcategoria || "N/A"}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {item.idFamilia || "N/A"}
                                  </Typography>
                                </TableCell>
                              </>
                            )}
                            <TableCell align="center">
                              <Button
                                variant="outlined"
                                onClick={() => handleSeleccionarProducto(item)}
                              >
                                Seleccionar
                              </Button>
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
