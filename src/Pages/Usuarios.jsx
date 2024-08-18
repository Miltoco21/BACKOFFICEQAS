/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Button,Dialog,Grid, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import IngresoUsuarios from "../Componentes/Usuarios/IngresoUsuarios";
import Add from "@mui/icons-material/Add";

import SideBar from "../Componentes/NavBar/SideBar";
import SearchList from "../Componentes/ListaBuscadora/SearchList";

//

export const defaultTheme = createTheme();

export default function Usuarios() {
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
    <CssBaseline />
    <div>
      <Box sx={{ display: "flex" }}>
        <SideBar  />
        <Box sx={{  flex: 1 }}>
          <Button
            variant="outlined"
            sx={{
              my: 1,
              mx: 2,
            }}
            startIcon={<Add />}
            onClick={handleOpenModal}
          >
            Crear usuario
          </Button>
          <SearchList />
        </Box>
      </Box>

      <Dialog open={open} onClose={handleCloseModal} maxWidth={'md'}>
        <IngresoUsuarios onClose={handleCloseModal} />
      </Dialog>
    </div>
  </ThemeProvider>

  );
}
