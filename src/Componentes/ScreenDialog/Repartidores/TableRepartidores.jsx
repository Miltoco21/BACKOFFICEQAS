// // components/Repartidores/RepartidoresTable.jsx
// import React, { useState, useEffect } from "react";
// import {
//   TableContainer,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Paper,
//   TablePagination,
//   CircularProgress,
//   Typography,
//   Box,
//   Chip,
//   Button,
//   TextField
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import User from "../../../Models/User";

// const RepartidoresTable = ({ 
//   onSelectRepartidor,
//   selectedRepartidor,
//   estaAsociado
// }) => {
//   const [repartidores, setRepartidores] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Función para cargar repartidores
//   const cargarRepartidores = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       User.getRepartidores(
//         (users) => {
//           setRepartidores(users);
//           setLoading(false);
//         },
//         (errorMsg) => {
//           setError(errorMsg);
//           setLoading(false);
//         }
//       );
//     } catch (error) {
//       setError("Error inesperado al cargar repartidores");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     cargarRepartidores();
//   }, []);

//   // Filtrar repartidores basado en el término de búsqueda
//   const filteredRepartidores = repartidores.filter(repartidor => {
//     if (!searchTerm) return true;
    
//     const searchLower = searchTerm.toLowerCase();
//     return (
//       (repartidor.nombres && repartidor.nombres.toLowerCase().includes(searchLower)) ||
//       (repartidor.apellidos && repartidor.apellidos.toLowerCase().includes(searchLower)) ||
//       (repartidor.rut && repartidor.rut.toLowerCase().includes(searchLower)) ||
//       (repartidor.correo && repartidor.correo.toLowerCase().includes(searchLower))
//     );
//   });

//   // Manejar cambio de página
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   // Manejar cambio de filas por página
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Función para obtener el nombre del rol
//   const getNombreRol = (rolId) => {
//     switch(rolId) {
//       case "5": return "Repartidor";
//       case "6": return "Ayudante";
//       default: return `Rol ${rolId}`;
//     }
//   };

//   // Calcular repartidores paginados
//   const paginatedRepartidores = filteredRepartidores.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   return (
//     <Box>
//       {/* Buscador de repartidores */}
//       <Box mb={3}>
//         <TextField
//           fullWidth
//           placeholder="Buscar repartidores por nombre, RUT o correo..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           InputProps={{
//             startAdornment: <SearchIcon sx={{ color: "action.active", mr: 1 }} />,
//           }}
//         />
//       </Box>

//       {/* Mensajes de estado */}
//       {error && (
//         <Box mb={2} p={1.5} bgcolor="#ffebee" borderRadius={1}>
//           <Typography color="error">{error}</Typography>
//         </Box>
//       )}

//       {/* Contenido de la tabla */}
//       {loading ? (
//         <Box display="flex" justifyContent="center" py={4}>
//           <CircularProgress size={40} />
//           <Typography sx={{ ml: 2, alignSelf: "center" }}>
//             Cargando repartidores...
//           </Typography>
//         </Box>
//       ) : filteredRepartidores.length === 0 ? (
//         <Box textAlign="center" py={4}>
//           <Typography variant="body1" color="textSecondary">
//             {searchTerm 
//               ? `No se encontraron repartidores para "${searchTerm}"`
//               : "No hay repartidores disponibles"}
//           </Typography>
//         </Box>
//       ) : (
//         <>
//           <TableContainer component={Paper} elevation={0} variant="outlined">
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Nombre</TableCell>
//                   <TableCell>RUT</TableCell>
//                   <TableCell>Teléfono</TableCell>
//                   <TableCell>Rol</TableCell>
//                   <TableCell align="center">Acción</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {paginatedRepartidores.map((repartidor) => {
//                   const asociado = estaAsociado(repartidor.codigoUsuario);
//                   return (
//                     <TableRow 
//                       key={repartidor.codigoUsuario}
//                       hover
//                       sx={{ 
//                         bgcolor: selectedRepartidor?.codigoUsuario === repartidor.codigoUsuario 
//                           ? "#e3f2fd" 
//                           : asociado
//                             ? "#f5f5f5"
//                             : "inherit",
//                         cursor: asociado ? "not-allowed" : "pointer"
//                       }}
//                       onClick={() => !asociado && onSelectRepartidor(repartidor)}
//                     >
//                       <TableCell>
//                         <Typography fontWeight={500}>
//                           {repartidor.nombres} {repartidor.apellidos}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>{repartidor.rut || "N/A"}</TableCell>
//                       <TableCell>{repartidor.telefono || "N/A"}</TableCell>
//                       <TableCell>
//                         <Chip 
//                           label={getNombreRol(repartidor.rol)} 
//                           size="small"
//                           color={repartidor.rol === "5" ? "primary" : "secondary"}
//                         />
//                       </TableCell>
//                       <TableCell align="center">
//                         {asociado ? (
//                           <Chip 
//                             label="Asociado" 
//                             color="success" 
//                             size="small"
//                           />
//                         ) : (
//                           <Button
//                             variant={selectedRepartidor?.codigoUsuario === repartidor.codigoUsuario ? "contained" : "outlined"}
//                             color="primary"
//                             size="small"
//                             disabled={asociado}
//                           >
//                             {selectedRepartidor?.codigoUsuario === repartidor.codigoUsuario ? "Seleccionado" : "Seleccionar"}
//                           </Button>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
          
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={filteredRepartidores.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//             labelRowsPerPage="Repartidores por página:"
//             sx={{ mt: 1 }}
//           />
//         </>
//       )}
//     </Box>
//   );
// };

// export default RepartidoresTable;

// components/Repartidores/RepartidoresTable.jsx
import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
  CircularProgress,
  Typography,
  Box,
  Chip,
  Button,
  TextField
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import User from "../../../Models/User";

const RepartidoresTable = ({ 
  onSelectRepartidor,
  selectedRepartidor,
  estaAsociado,
  roles // Prop opcional para nombres de roles personalizados
}) => {
  const [repartidores, setRepartidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [rolesMap, setRolesMap] = useState({});

  // Función para cargar repartidores
  const cargarRepartidores = async () => {
    setLoading(true);
    setError(null);
    
    try {
      User.getRepartidores(
        (users) => {
          setRepartidores(users);
          setLoading(false);
          
          // Cargar información de roles si está disponible
          if (roles && Array.isArray(roles)) {
            const map = {};
            roles.forEach(role => {
              map[role.idRol] = role.rol;
            });
            setRolesMap(map);
          }
        },
        (errorMsg) => {
          setError(errorMsg);
          setLoading(false);
        }
      );
    } catch (error) {
      setError("Error inesperado al cargar repartidores");
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRepartidores();
  }, [roles]); // Vuelve a cargar si los roles cambian

  // Filtrar repartidores basado en el término de búsqueda
  const filteredRepartidores = repartidores.filter(repartidor => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (repartidor.nombres && repartidor.nombres.toLowerCase().includes(searchLower)) ||
      (repartidor.apellidos && repartidor.apellidos.toLowerCase().includes(searchLower)) ||
      (repartidor.rut && repartidor.rut.toLowerCase().includes(searchLower)) ||
      (repartidor.correo && repartidor.correo.toLowerCase().includes(searchLower))
    );
  });

  // Manejar cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Función para obtener el nombre del rol
  const getNombreRol = (rolId) => {
    // Usar el mapa de roles si está disponible
    if (rolesMap[rolId]) {
      return rolesMap[rolId];
    }
    
    // Nombres por defecto si no hay mapa de roles
    switch(rolId) {
      case "5": return "Repartidor Interno";
      case "6": return "Repartidor Externo";
      default: return `Rol ${rolId}`;
    }
  };

  // Calcular repartidores paginados
  const paginatedRepartidores = filteredRepartidores.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      {/* Buscador de repartidores */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Buscar repartidores por nombre, RUT o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: "action.active", mr: 1 }} />,
          }}
        />
      </Box>

      {/* Mensajes de estado */}
      {error && (
        <Box mb={2} p={1.5} bgcolor="#ffebee" borderRadius={1}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* Contenido de la tabla */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={40} />
          <Typography sx={{ ml: 2, alignSelf: "center" }}>
            Cargando repartidores...
          </Typography>
        </Box>
      ) : filteredRepartidores.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="textSecondary">
            {searchTerm 
              ? `No se encontraron repartidores para "${searchTerm}"`
              : "No hay repartidores disponibles"}
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>RUT</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell align="center">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRepartidores.map((repartidor) => {
                  const asociado = estaAsociado(repartidor.codigoUsuario);
                  return (
                    <TableRow 
                      key={repartidor.codigoUsuario}
                      hover
                      sx={{ 
                        bgcolor: selectedRepartidor?.codigoUsuario === repartidor.codigoUsuario 
                          ? "#e3f2fd" 
                          : asociado
                            ? "#f5f5f5"
                            : "inherit",
                        cursor: asociado ? "not-allowed" : "pointer"
                      }}
                      onClick={() => !asociado && onSelectRepartidor(repartidor)}
                    >
                      <TableCell>
                        <Typography fontWeight={500}>
                          {repartidor.nombres} {repartidor.apellidos}
                        </Typography>
                      </TableCell>
                      <TableCell>{repartidor.rut || "N/A"}</TableCell>
                      <TableCell>{repartidor.telefono || "N/A"}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getNombreRol(repartidor.rol)} 
                          size="small"
                          color={repartidor.rol === "5" ? "primary" : "secondary"}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {asociado ? (
                          <Chip 
                            label="Asociado" 
                            color="success" 
                            size="small"
                          />
                        ) : (
                          <Button
                            variant={selectedRepartidor?.codigoUsuario === repartidor.codigoUsuario ? "contained" : "outlined"}
                            color="primary"
                            size="small"
                            disabled={asociado}
                          >
                            {selectedRepartidor?.codigoUsuario === repartidor.codigoUsuario ? "Seleccionado" : "Seleccionar"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRepartidores.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Repartidores por página:"
            sx={{ mt: 1 }}
          />
        </>
      )}
    </Box>
  );
};

export default RepartidoresTable;