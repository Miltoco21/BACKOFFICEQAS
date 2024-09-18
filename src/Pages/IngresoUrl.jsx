/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Button,Dialog,Grid, Typography } from "@mui/material";
import IngresoUsuarios from "../Componentes/ScreenDialog/Users/Create";
import Add from "@mui/icons-material/Add";

import SideBar from "../Componentes/NavBar/SideBar";
import SearchList from "../Componentes/ScreenDialog/Users/SearchList";

export const defaultTheme = createTheme();

export default function Sucursales() {
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
            // onClick={handleOpenModal}
          >
            Ingresa Url
          </Button>
          {/* <SearchList /> */}
        </Box>
      </Box>

      {open ? (
        <IngresoUsuarios
        openDialog={open}
        setOpendialog={setOpen}
        onClose={handleCloseModal}
      />
      ) : (
        <></>
      )}



      

  </ThemeProvider>

  );
}
