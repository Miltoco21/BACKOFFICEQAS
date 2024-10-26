import React, { useEffect, useState } from "react";
import { Button, Dialog, Box } from "@mui/material";
import SideBar from "../Componentes/NavBar/SideBar.jsx";
import AjusteInventario from  "../Componentes/Stock/AjusteInventario.jsx";
import StockModel from "../Models/Stock";
import QrStockMobile from "../Componentes/ScreenDialog/QrStockMobile.jsx";
import NivelesUnidades from "../Componentes/Stock/NivelesUnidades.jsx";

const Stock = () => {
  // Estado para controlar la apertura/cierre del modal de Ajuste de Inventario
  const [openAjusteInventario, setOpenAjusteInventario] = useState(false);
  const [openNiveles, setOpenNiveles] = useState(false);
  const [showQrStockMobile, setShowQrStockMobile] = useState(false);
  const [qrLink, setQrLink] = useState("");

  // Función para abrir el modal
  const handleOpenAjusteInventario = () => {
    setOpenAjusteInventario(true);
  };

  // Función para cerrar el modal
  const handleCloseAjusteInventario = () => {
    setOpenAjusteInventario(false);
  };

  const loadQrLink = ()=>{
    StockModel.getQrMobileLink((responseData)=>{
      console.log("response data", responseData)
      setQrLink(responseData.qr)
    },()=>{
      console.log("no se pudo cargar el qr")
    })
  }

  useEffect(()=>{
    loadQrLink()
  },[])

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

        <Button
              variant="outlined"
              sx={{
                my: 1,
                mx: 2,
              }}
              onClick={()=>{
                setOpenNiveles(true)
              }} // Abre el modal al hacer clic en el botón
            >
              Niveles Unidades
            </Button>

          { qrLink !="" && (
            <Button
              variant="outlined"
              sx={{
                my: 1,
                mx: 2,
              }}
              onClick={()=>{
                setShowQrStockMobile(true)
              }} // Abre el modal al hacer clic en el botón
            >
              Stock Mobile
            </Button>

          )}
          <QrStockMobile openDialog={showQrStockMobile} setOpenDialog={setShowQrStockMobile} qrLink={qrLink} />


      </Box>

      {/* Dialog para Ajuste de inventario */}
      <Dialog
        open={openAjusteInventario}
        onClose={handleCloseAjusteInventario}
        maxWidth="lg"
        fullWidth
      >
        <AjusteInventario onClose={handleCloseAjusteInventario} />
      </Dialog>


      {/* Dialog para niveles de unidades de stock */}
      <Dialog
        open={openNiveles}
        onClose={()=>{
          setOpenNiveles(false)
        }}
        maxWidth="lg"
        fullWidth
      >
        <NivelesUnidades onClose={()=>{
          setOpenNiveles(false)
        }} />
      </Dialog>
    </>
  );
};

export default Stock;
