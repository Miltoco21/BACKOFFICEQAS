/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Button, Grid } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom"; // Importar useNavigate

import SideBar from "../Componentes/NavBar/SideBar";

export const defaultTheme = createTheme();

export default function UnidadesPesajes() {
  const [open, setOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const navigate = useNavigate(); // Hook para navegación

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Box sx={{ flex: 1, padding: "20px" }}>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="outlined"
                sx={{ my: 1, mx: 2 }}
                startIcon={<Add />}
                onClick={() => navigate("/envases-pesajes")} // Navegar a ruta
              >
                Envases para pesajes
              </Button>
            </Grid>
            
            <Grid item>
              <Button
                variant="outlined"
                sx={{ my: 1, mx: 2 }}
                startIcon={<Add />}
                onClick={() => navigate("/centrocostos")} // Navegar a otra ruta
              >
                Centro de costos
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}