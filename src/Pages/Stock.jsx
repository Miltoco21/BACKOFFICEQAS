import React, { useState } from "react";
import { Button, Dialog, Box } from "@mui/material";
import SideBar from "../Componentes/NavBar/SideBar.jsx";

const Stock = () => {
  // Estado para controlar la apertura/cierre del modal de Ajuste de Inventario
  const [openAjusteInventario, setOpenAjusteInventario] = useState(false);

  // Función para abrir el modal
  const handleOpenAjusteInventario = () => {
    setOpenAjusteInventario(true);
  };

  // Función para cerrar el modal
  const handleCloseAjusteInventario = () => {
    setOpenAjusteInventario(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "100px",
        }}
      >
        <SideBar />
        <Button
          variant="outlined"
          sx={{
            my: 1,
            mx: 2,
          }}
          onClick={handleOpenAjusteInventario} // Abre el modal al hacer clic en el botón
        >
          Ajuste de inventario
        </Button>
      </Box>

      {/* Dialog para Ajuste de inventario */}
      <Dialog open={openAjusteInventario} onClose={handleCloseAjusteInventario}>
     
      </Dialog>
    </>
  );
};

export default Stock;
