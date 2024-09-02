import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Typography,
  DialogTitle,
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import ModelConfig from "../../Models/ModelConfig";

var prods = [];
for (let index = 1; index <= 5; index++) {
  prods.push(index);
}

const AdminConfig = ({openDialog,setOpenDialog}) => {
  const [urlBase, setUrlBase] = useState("");
  const [cantBusqRap, setCantBusqRap] = useState(20);
  const [iva, setIva] = useState("");

  const [savedConfig, setSavedConfig] = useState(null)


  useEffect( ()=>{
    setSavedConfig(ModelConfig.get());
  }, [openDialog])

  useEffect( ()=>{
    loadConfigSesion();
  }, [savedConfig])

  const loadConfigSesion = ()=>{
    // console.log("loadConfigSesion")
    // console.log(savedConfig);
    if(!savedConfig) return

    setUrlBase(savedConfig.urlBase)
    setIva(savedConfig.iva)
    setCantBusqRap(savedConfig.cantidadProductosBusquedaRapida)
  }

  const handlerSaveAction = ()=>{
    ModelConfig.change("urlBase",urlBase);
    ModelConfig.change("cantidadProductosBusquedaRapida", cantBusqRap)
    ModelConfig.change("iva", iva)

    console.log("save config");
    setOpenDialog(false)
  }
  return (
      <Dialog open={openDialog} maxWidth="lg" onClose={()=>{
        setOpenDialog(false)
      }}
      >
        <DialogTitle>
          Configuraciones
        </DialogTitle>
        <DialogContent>
        <Grid container item xs={12} spacing={2} sx={{
          minWidth:"400px",
          marginTop:"0px"
        }}>
          
              <Grid item xs={12} lg={12}>
              <Grid container spacing={2}>

             
              <TextField
                margin="normal"
                fullWidth
                label="UrlBase"
                type="text" // Cambia dinámicamente el tipo del campo de contraseña
                value={urlBase}
                onChange={(e) => setUrlBase(e.target.value)}
              />

              <TextField
                margin="normal"
                fullWidth
                label="Cantidad busqueda rapida"
                type="text" // Cambia dinámicamente el tipo del campo de contraseña
                value={cantBusqRap}
                onChange={(e) => setCantBusqRap(e.target.value)}
              />

              <TextField
                margin="normal"
                fullWidth
                label="Iva"
                type="text" // Cambia dinámicamente el tipo del campo de contraseña
                value={iva}
                onChange={(e) => setIva(e.target.value)}
              />




              </Grid>
              </Grid>
              
        </Grid>
        </DialogContent>
        <DialogActions>
          <SmallButton textButton="Guardar" actionButton={handlerSaveAction}/>
          <Button onClick={()=>{
            setOpenDialog(false)
          }}>Atras</Button>
        </DialogActions>
      </Dialog>
  );
};

export default AdminConfig;
