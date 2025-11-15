/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Button, Dialog, Grid, Typography } from "@mui/material";
import IngresoUsuarios from "../Componentes/ScreenDialog/Users/UserFormDialog";
import Add from "@mui/icons-material/Add";

import SideBar from "../Componentes/NavBar/SideBar";
import SearchList from "../Componentes/ScreenDialog/Users/SearchList";
import RepartidorFormDialog from "../Componentes/ScreenDialog/Repartidores/RepartidorFormDialog";
import SearchListRepartidores from "../Componentes/ScreenDialog/Repartidores/SearchListRepartidores";
export const defaultTheme = createTheme();

export default function Repartidores() {
  const [open, setOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Box sx={{ flex: 1 }}>
          <Button
            variant="outlined"
            sx={{
              my: 1,
              mx: 2,
            }}
            startIcon={<Add />}
            onClick={()=>{
              setOpen(true)
            }}
          >
            Crear repartidor
          </Button>
          <SearchListRepartidores refresh={refreshList} />

        </Box>
      </Box>

      {open ? (
        <RepartidorFormDialog
          openDialog={open}
          setOpendialog={setOpen}
          onSave={()=>{
            setRefreshList(!refreshList)
          }}
        />
      ) : (
        <></>
      )}





    </ThemeProvider>

  );
}
