/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Button, Grid } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

import SideBar from "../Componentes/NavBar/SideBar";
import IngresoCentrodeCosto from "../Componentes/ScreenDialog/CentrodeCostos/IngresoCentrodeCosto";
import SearchListCentroCostos from "../Componentes/ScreenDialog/CentrodeCostos/SearchListCentroCostos";

export const defaultTheme = createTheme();

export default function CentroCostos() {
  const [open, setOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const navigate = useNavigate();
  
  // Estados unificados para el diálogo de ingreso
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCentro, setSelectedCentro] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Función para crear nuevo centro de costo
  const handleCreateNew = () => {
    setSelectedCentro(null);
    setIsEdit(false);
    setOpenDialog(true);
  };

  // Función para editar centro de costo (llamada desde SearchList)
  const handleEdit = (centro) => {
    setSelectedCentro(centro);
    setIsEdit(true);
    setOpenDialog(true);
  };

  // Función para manejar el guardado exitoso
  const handleSaveCentrodeCostos = (isEditMode = false) => {
    console.log('Centro de costo guardado, isEdit:', isEditMode);
    
    // Cerrar el diálogo
    setOpenDialog(false);
    setSelectedCentro(null);
    setIsEdit(false);
    
    // Forzar actualización de la lista
    setRefreshList(prev => !prev);
  };

  // Función para manejar errores
  const handleSaveError = (errorMsg) => {
    console.error('Error al guardar centro de costo:', errorMsg);
    // El error ya se maneja en el componente IngresoCentrodeCosto
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Box sx={{ flex: 1, padding: "20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* Botón para crear nuevo centro de costo */}
              <Button
                variant="outlined"
                sx={{ 
                  my: 1, 
                  mx: 2,
                  backgroundColor: "primary",
                 
                 
                }}
                startIcon={<Add />}
                onClick={handleCreateNew}
              >
                Nuevo Centro de Costos
              </Button>

              {/* Lista de centros de costos */}
              <SearchListCentroCostos
                refresh={refreshList}
                onEdit={handleEdit} // Pasar la función de edición
              />
            </Grid>
          </Grid>
        </Box>

        {/* Componente unificado de ingreso/edición */}
        <IngresoCentrodeCosto
          openDialog={openDialog}
          setOpendialog={setOpenDialog}
          onSave={handleSaveCentrodeCostos}
          onError={handleSaveError}
          dataInitial={selectedCentro}
          isEdit={isEdit}
        />
      </Box>
    </ThemeProvider>
  );
}