// import React, { useState, useEffect, useContext, forwardRef, useImperativeHandle } from "react";
// import {
//   Box,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Button,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Snackbar,
//   CircularProgress,
//   IconButton,
// } from "@mui/material";
// import SideBar from "../../NavBar/SideBar";
// import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
// import UnidadPesaje from "../../../Models/UnidadPesaje";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import IngresoUnidadPesaje from "./IngresoUnidadPesaje";

// const SearchListUPesajes = forwardRef((props, ref) => {
//   const { showMessage, showConfirm, showLoading, hideLoading } = useContext(
//     SelectedOptionsContext
//   );

//   // Estados principales
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [unidadesPesaje, setUnidadesPesaje] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Estados para dialogs y acciones
//   const [selectedUnidad, setSelectedUnidad] = useState(null);
//   const [showEditDialog, setShowEditDialog] = useState(false);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   // Configuración de paginación
//   const perPage = 15;
//   const startIndex = (currentPage - 1) * perPage;
//   const endIndex = startIndex + perPage;

//   // Filtrar y paginar unidades
//   const filteredUnidades = unidadesPesaje.filter((unidad) =>
//     unidad.descripcion?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
//   );

//   const paginatedUnidades = filteredUnidades.slice(startIndex, endIndex);
//   const totalPages = Math.ceil(filteredUnidades.length / perPage) || 1;

//   // ✅ Cargar datos - función principal
//   const loadUnidades = async () => {
//     try {
//       showLoading("Cargando unidades...");
//       setLoading(true);

//       const unidadModel = new UnidadPesaje();
//       unidadModel.getAll(
//         (data) => {
//           console.log("Datos cargados:", data); // Debug
//           setUnidadesPesaje(data);
//           setLoading(false);
//           hideLoading();
//         },
//         (errorMsg) => {
//           console.error("Error al cargar:", errorMsg); // Debug
//           setError(errorMsg);
//           setLoading(false);
//           hideLoading();
//           setSnackbar({
//             open: true,
//             message: `Error: ${errorMsg}`,
//             severity: "error",
//           });
//         }
//       );
//     } catch (error) {
//       console.error("Error crítico al cargar unidades:", error);
//       setLoading(false);
//       hideLoading();
//       setSnackbar({
//         open: true,
//         message: "Error crítico al cargar datos",
//         severity: "error",
//       });
//     }
//   };

//   // ✅ Exponer método reloadList al componente padre
//   useImperativeHandle(ref, () => ({
//     reloadList: () => {
//       console.log("Recargando lista desde componente padre..."); // Debug
//       loadUnidades();
//     }
//   }));

//   // Manejar eliminación
//   const handleDelete = () => {
//     if (!selectedUnidad) return;

//     showConfirm(`¿Eliminar "${selectedUnidad.descripcion}"?`, async () => {
//       try {
//         showLoading("Eliminando...");

//         const unidadModel = new UnidadPesaje();
//         unidadModel.delete(
//           selectedUnidad.codigo,
//           () => {
//             console.log("Eliminación exitosa, recargando lista..."); // Debug
//             loadUnidades(); // Recargar después de eliminar
//             hideLoading();
//             setSnackbar({
//               open: true,
//               message: "Unidad eliminada correctamente",
//               severity: "success",
//             });
//             setShowDeleteDialog(false);
//             setSelectedUnidad(null);
//           },
//           (errorMsg) => {
//             hideLoading();
//             setSnackbar({
//               open: true,
//               message: `Error: ${errorMsg}`,
//               severity: "error",
//             });
//           }
//         );
//       } catch (error) {
//         console.error("Error al eliminar:", error);
//         hideLoading();
//         setSnackbar({
//           open: true,
//           message: "Error crítico al eliminar",
//           severity: "error",
//         });
//       }
//     });
//   };

//   // ✅ Callback para éxito en edición
//   const handleEditSuccess = (unidadData) => {
//     console.log("Edición exitosa, recargando lista..."); // Debug
//     loadUnidades(); // Recargar después de editar
    
//     setSnackbar({
//       open: true,
//       message: "Unidad actualizada correctamente",
//       severity: "success",
//     });
    
//     setShowEditDialog(false);
//     setSelectedUnidad(null);
//   };

//   // ✅ Callback para error en edición
//   const handleEditError = (errorMsg) => {
//     setSnackbar({
//       open: true,
//       message: `Error: ${errorMsg}`,
//       severity: "error",
//     });
//   };

//   // Cargar datos al montar el componente
//   useEffect(() => {
//     loadUnidades();
//   }, []);

//   // Traducción de unidades
//   const getUnidadCompleta = (unidad) => {
//     const unidades = {
//       kg: "Kilogramos",
//       g: "Gramos",
//       lb: "Libras",
//       oz: "Onzas",
//       ton: "Toneladas",
//     };
//     return unidades[unidad] || unidad;
//   };

//   // Resetear selección al cerrar diálogo de edición
//   useEffect(() => {
//     if (!showEditDialog) {
//       setSelectedUnidad(null);
//     }
//   }, [showEditDialog]);

//   if (loading) {
//     return (
//       <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 2, mb: 4 }}>
//       {/* Barra de búsqueda */}
//       <TextField
//         fullWidth
//         placeholder="Buscar unidades..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         sx={{ mb: 2 }}
//       />

//       {/* Tabla de resultados */}
//       <Table sx={{ border: "1px solid #eee", borderRadius: "8px" }}>
//         <TableHead>
//           <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//             <TableCell sx={{ fontWeight: "bold" }}>Código</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Peso</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Unidad</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {paginatedUnidades.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={5} align="center">
//                 {error ? "Error al cargar datos" : "No se encontraron unidades"}
//               </TableCell>
//             </TableRow>
//           ) : (
//             paginatedUnidades.map((unidad) => (
//               <TableRow key={unidad.codigo}>
//                 <TableCell>{unidad.codigo}</TableCell>
//                 <TableCell>{unidad.descripcion}</TableCell>
//                 <TableCell>{unidad.peso}</TableCell>
//                 <TableCell>{getUnidadCompleta(unidad.unidad)}</TableCell>
//                 <TableCell>
//                   <IconButton
//                     onClick={() => {
//                       setSelectedUnidad(unidad);
//                       setShowEditDialog(true);
//                     }}
//                   >
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton
//                         onClick={() => handleDelete(centro)}
//                     // onClick={() => {
//                     //   setSelectedUnidad(unidad);
//                     //   setShowDeleteDialog(true);
                      
//                     // }}
//                   >
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>

//       {/* Paginación */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
//         <Typography variant="body2">
//           Página {currentPage} de {totalPages}
//         </Typography>
//         <Box>
//           <Button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(currentPage - 1)}
//           >
//             Anterior
//           </Button>
//           <Button
//             disabled={currentPage === totalPages || totalPages === 0}
//             onClick={() => setCurrentPage(currentPage + 1)}
//           >
//             Siguiente
//           </Button>
//         </Box>
//       </Box>

//       <IngresoUnidadPesaje
//         openDialog={showEditDialog}
//         setOpendialog={setShowEditDialog}
//         onSaveSuccess={handleEditSuccess}
//         onSaveError={handleEditError}
//         dataInitial={selectedUnidad}
//         isEdit={!!selectedUnidad}
//       />

    

     
//     </Box>
//   );
// });

// SearchListUPesajes.displayName = 'SearchListUPesajes';

// export default SearchListUPesajes;

import React, { useState, useEffect, useContext, forwardRef, useImperativeHandle } from "react";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress,
  IconButton,
} from "@mui/material";
import SideBar from "../../NavBar/SideBar";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import UnidadPesaje from "../../../Models/UnidadPesaje";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IngresoUnidadPesaje from "./IngresoUnidadPesaje";

const SearchListUPesajes = forwardRef((props, ref) => {
  const { showMessage, showConfirm, showLoading, hideLoading } = useContext(
    SelectedOptionsContext
  );

  // Estados principales
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [unidadesPesaje, setUnidadesPesaje] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para dialogs y acciones
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Configuración de paginación
  const perPage = 15;
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  // Filtrar y paginar unidades
  const filteredUnidades = unidadesPesaje.filter((unidad) =>
    unidad.descripcion?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );

  const paginatedUnidades = filteredUnidades.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUnidades.length / perPage) || 1;

  // ✅ Cargar datos - función principal
  const loadUnidades = async () => {
    try {
      showLoading("Cargando unidades...");
      setLoading(true);

      const unidadModel = new UnidadPesaje();
      unidadModel.getAll(
        (data) => {
          console.log("Datos cargados:", data); // Debug
          setUnidadesPesaje(data);
          setLoading(false);
          hideLoading();
        },
        (errorMsg) => {
          console.error("Error al cargar:", errorMsg); // Debug
          setError(errorMsg);
          setLoading(false);
          hideLoading();
          setSnackbar({
            open: true,
            message: `Error: ${errorMsg}`,
            severity: "error",
          });
        }
      );
    } catch (error) {
      console.error("Error crítico al cargar unidades:", error);
      setLoading(false);
      hideLoading();
      setSnackbar({
        open: true,
        message: "Error crítico al cargar datos",
        severity: "error",
      });
    }
  };

  // ✅ Exponer método reloadList al componente padre
  useImperativeHandle(ref, () => ({
    reloadList: () => {
      console.log("Recargando lista desde componente padre..."); // Debug
      loadUnidades();
    }
  }));

  // ✅ Manejar eliminación - Lógica simplificada como centro de costos
  const handleDelete = (unidad) => {
    showConfirm(`¿Eliminar la unidad de pesaje "${unidad.descripcion}"?`, () => {
      showLoading('Eliminando unidad de pesaje...')

      const unidadModel = new UnidadPesaje();

      unidadModel.delete(
        unidad.codigo,
        response => {
          hideLoading()
          showMessage('Unidad de pesaje eliminada correctamente')
          console.log("Eliminación exitosa, recargando lista..."); // Debug
          // ✅ Actualizar inmediatamente después de eliminar
          loadUnidades()
        },
        errorMsg => {
          hideLoading()
          showMessage('Error al eliminar unidad de pesaje')
          console.error('Error eliminando:', errorMsg)
        }
      )
    })
  };

  // ✅ Callback para éxito en edición
  const handleEditSuccess = (unidadData) => {
    console.log("Edición exitosa, recargando lista..."); // Debug
    loadUnidades(); // Recargar después de editar
    
    setSnackbar({
      open: true,
      message: "Unidad actualizada correctamente",
      severity: "success",
    });
    
    setShowEditDialog(false);
    setSelectedUnidad(null);
  };

  // ✅ Callback para error en edición
  const handleEditError = (errorMsg) => {
    setSnackbar({
      open: true,
      message: `Error: ${errorMsg}`,
      severity: "error",
    });
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadUnidades();
  }, []);

  // Traducción de unidades
  const getUnidadCompleta = (unidad) => {
    const unidades = {
      kg: "Kilogramos",
      g: "Gramos",
      lb: "Libras",
      oz: "Onzas",
      ton: "Toneladas",
    };
    return unidades[unidad] || unidad;
  };

  // Resetear selección al cerrar diálogo de edición
  useEffect(() => {
    if (!showEditDialog) {
      setSelectedUnidad(null);
    }
  }, [showEditDialog]);

  if (loading) {
    return (
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      {/* Barra de búsqueda */}
      <TextField
        fullWidth
        placeholder="Buscar unidades..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Tabla de resultados */}
      <Table sx={{ border: "1px solid #eee", borderRadius: "8px" }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Código</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Peso</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Unidad</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedUnidades.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                {error ? "Error al cargar datos" : "No se encontraron unidades"}
              </TableCell>
            </TableRow>
          ) : (
            paginatedUnidades.map((unidad) => (
              <TableRow key={unidad.codigo}>
                <TableCell>{unidad.codigo}</TableCell>
                <TableCell>{unidad.descripcion}</TableCell>
                <TableCell>{unidad.peso}</TableCell>
                <TableCell>{getUnidadCompleta(unidad.unidad)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedUnidad(unidad);
                      setShowEditDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(unidad)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Paginación */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Typography variant="body2">
          Página {currentPage} de {totalPages}
        </Typography>
        <Box>
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Anterior
          </Button>
          <Button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Siguiente
          </Button>
        </Box>
      </Box>

      {/* ✅ Componente de edición con callbacks específicos */}
      <IngresoUnidadPesaje
        openDialog={showEditDialog}
        setOpendialog={setShowEditDialog}
        onSaveSuccess={handleEditSuccess}
        onSaveError={handleEditError}
        dataInitial={selectedUnidad}
        isEdit={!!selectedUnidad}
      />

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
});

SearchListUPesajes.displayName = 'SearchListUPesajes';

export default SearchListUPesajes;