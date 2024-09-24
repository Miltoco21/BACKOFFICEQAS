/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Button, Dialog, Grid, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";
import SideBar from "../Componentes/NavBar/SideBar";
import IngresoCajaSucursal from "../Componentes/Sucursales/IngresoCajaSucursal"

export default function CajaSucursal() {
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <>
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
            onClick={handleOpenModal}
          >
         Ingrese Caja sucursal 
          </Button>
          {/* <SearchList /> */}
        </Box>
      </Box>

      {open ? (
        <IngresoCajaSucursal
          openDialog={open}
          setOpendialog={setOpen}
          onClose={handleCloseModal}
        />
      ) : (
        <></>
      )}
    </>
  );
}
