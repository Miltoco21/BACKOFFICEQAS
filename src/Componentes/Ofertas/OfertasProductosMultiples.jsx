import React, { useState } from "react";
import { Button, Dialog, Box } from "@mui/material";
import SideBar from "../NavBar/SideBar.jsx";
import { Typography } from "@mui/joy";
import OfertasProductoSimilar from "./OfertaProductoSimilar.jsx";

// Importar los componentes de ofertas (deberás crearlos)

const OfertasProductosMultiples = () => {
  // Estados para controlar la apertura/cierre de los modales
  const [openProductoSimilar, setOpenProductoSimilar] = useState(false);
  const [openOfertasMultiples, setOpenOfertasMultiples] = useState(false);
  const [openOfertasNxM, setOpenOfertasNxM] = useState(false);

  // Funciones para abrir y cerrar los modales
  const handleOpenProductoSimilar = () => setOpenProductoSimilar(true);
  const handleCloseProductoSimilar = () => setOpenProductoSimilar(false);

  const handleOpenOfertasMultiples = () => setOpenOfertasMultiples(true);
  const handleCloseOfertasMultiples = () => setOpenOfertasMultiples(false);

  const handleOpenOfertasNxM = () => setOpenOfertasNxM(true);
  const handleCloseOfertasNxM = () => setOpenOfertasNxM(false);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "100px", // Misma altura que el componente Stock
        }}
      >
    
        <Button
          variant="outlined"
          sx={{
            my: 1,
            mx: 2,
          }}
          onClick={handleOpenProductoSimilar}
        >
          Oferta Producto Similar
        </Button>

        <Button
          variant="outlined"
          sx={{
            my: 1,
            mx: 2,
          }}
          onClick={handleOpenOfertasMultiples}
        >
          Ofertas Productos Complementario 
        </Button>

       
      </Box>

      {/* Dialogs para cada tipo de oferta */}
      <Dialog
        open={openProductoSimilar}
        onClose={handleCloseProductoSimilar}
        maxWidth="lg"
        fullWidth
      >
        <OfertasProductoSimilar onClose={handleCloseProductoSimilar} />
      </Dialog>

      <Dialog
        open={openOfertasMultiples}
        onClose={handleCloseOfertasMultiples}
        maxWidth="lg"
        fullWidth
      >
        <OfertasProductosMultiples onClose={handleCloseOfertasMultiples} />
      </Dialog>

    
    </>
  );
};

export default OfertasProductosMultiples;