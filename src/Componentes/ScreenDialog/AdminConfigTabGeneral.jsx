/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField
} from "@mui/material";

import ModelConfig from "../../Models/ModelConfig";
import TabPanel from "../Elements/TabPanel";

const AdminConfigTabGeneral = ({
  tabNumber,
  applyChanges
}) => {

  const [urlBase, setUrlBase] = useState("");
  const [iva, setIva] = useState("");
  const [canSave, setCanSave] = useState(false);

  const [savedConfig, setSavedConfig] = useState(null)
  
  const loadConfigSesion = ()=>{
    if(!savedConfig) return

    setUrlBase(savedConfig.urlBase)
    setIva(savedConfig.iva)
    setCanSave(true)
  }

    const confirmSave = ()=>{
    ModelConfig.change("urlBase",urlBase);
    ModelConfig.change("iva", iva)
  }

  useEffect( ()=>{
    if(canSave){
      confirmSave()
    }
  }, [applyChanges])

  useEffect( ()=>{
    loadConfigSesion();
  }, [savedConfig])

  useEffect(()=>{
    if(tabNumber != 0)return

    setSavedConfig(ModelConfig.get());
    
  },[tabNumber]);


  return (
    <TabPanel value={tabNumber} index={0}>

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
      label="Iva"
      type="text" // Cambia dinámicamente el tipo del campo de contraseña
      value={iva}
      onChange={(e) => setIva(e.target.value)}
    />

    </Grid>
  </Grid>
      
    </TabPanel>
  );
};

export default AdminConfigTabGeneral;
