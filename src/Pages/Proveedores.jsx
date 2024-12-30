import React, { useState } from "react";
import Box from "@mui/material/Box";
import Navegacion from "../Componentes/NavBar/Navegacion";
import Button from "@mui/joy/Button";
import Add from "@mui/icons-material/Add";
import Modal from "@mui/joy/Modal";
import SideBar from "../Componentes/NavBar/SideBar";
import SearchListProveedores from "../Componentes/Proveedores/SearchListProveedores";
import { Dialog } from "@mui/material";
import IngresoProveedor from "../Componentes/Proveedores/IngresoProveedor";

const Proveedores = () => {
  const [open, setOpen] = useState(false);
  const text = "Proveedores";
  const uppercaseText = text.toUpperCase();
  const [reloadProvs, setReloadProvs] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const addSuccess = () => {
    setReloadProvs(!reloadProvs)
  }

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            my: 1,
            mx: 2,
          }}
          startDecorator={<Add />}
          onClick={handleOpenModal}
        >
          {uppercaseText}
        </Button>


        <SearchListProveedores doReload={reloadProvs} />

        {open && (
          <IngresoProveedor
            openDialog={open}
            setOpenDialog={setOpen}
            onClose={handleCloseModal}
            onFinish={addSuccess} />
        )}



      </Box>
    </div>
  );
};

export default Proveedores;