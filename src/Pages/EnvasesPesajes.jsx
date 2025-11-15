/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Button, Grid } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

import SideBar from "../Componentes/NavBar/SideBar";
import SearchListUPesajes from "../Componentes/ScreenDialog/UnidadesPesajes/SearchListUPesajes";
import IngresoUnidadPesaje from "../Componentes/ScreenDialog/UnidadesPesajes/IngresoUnidadPesaje";

export const defaultTheme = createTheme();

export default function UnidadesPesajes() {
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  
  // ✅ Ref para acceder a métodos del componente hijo
  const searchListRef = useRef(null);

  // ✅ Callback unificado para cuando se guarda una unidad
  const handleSaveUnidad = (unidadData) => {
    console.log("Unidad guardada:", unidadData);
    
    // ✅ Recargar la lista del componente hijo directamente
    if (searchListRef.current && searchListRef.current.reloadList) {
      searchListRef.current.reloadList();
    }
    
    // Cerrar el diálogo
    setOpenDialog(false);
  };

  // ✅ Callback para manejar errores
  const handleSaveError = (errorMessage) => {
    console.error("Error al guardar unidad:", errorMessage);
    // El error ya se maneja en el componente hijo, aquí solo registramos
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Box sx={{ flex: 1, padding: "20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                sx={{ my: 1, mx: 2 }}
                startIcon={<Add />}
                onClick={() => setOpenDialog(true)}
              >
                Envases para pesajes
              </Button>
              
              {/* ✅ Componente de lista con ref para control directo */}
              <SearchListUPesajes 
                ref={searchListRef}
              />
            </Grid>
          </Grid>
        </Box>

        {/* ✅ Componente de ingreso con callbacks unificados */}
        <IngresoUnidadPesaje
          openDialog={openDialog}
          setOpendialog={setOpenDialog}
          onSaveSuccess={handleSaveUnidad}
          onSaveError={handleSaveError}
          dataInitial={null} // Para nuevas unidades
          isEdit={false}     // Siempre falso desde el botón principal
        />
      </Box>
    </ThemeProvider>
  );
}