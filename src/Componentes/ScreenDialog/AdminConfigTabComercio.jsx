/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  TextField
} from "@mui/material";

import ModelConfig from "../../Models/ModelConfig";
import TabPanel from "../Elements/TabPanel";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";


const AdminConfigTabComercio = ({
  tabNumber,
  applyChanges
}) => {

  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [canSave, setCanSave] = useState(false);
  
  const [razonSocial, setRazonSocial] = useState("");
  const [rut, setRut] = useState("");
  const [direccion, setDireccion] = useState("");
  const [giro, setGiro] = useState("");

  const getValFromConfig = (entrada, grupo, infoTotal)=>{
    var valor = ""
    infoTotal.forEach((configInfo)=>{
      if(configInfo.entrada == entrada && configInfo.grupo == grupo){
        valor = configInfo.valor
      }
    })
    return valor
  }
  
  const loadInitial = ()=>{
    showLoading("buscando la informacion")
    ModelConfig.getAllComercio((info)=>{
      // console.log(info)
      setRazonSocial( getValFromConfig("Nom_RazonSocial", "ImpresionTicket", info.configuracion) )
      setRut( getValFromConfig("Nro_Rut", "ImpresionTicket", info.configuracion) )
      setDireccion( getValFromConfig("Nom_Direccion", "ImpresionTicket", info.configuracion) )
      setGiro( getValFromConfig("Nom_Giro", "ImpresionTicket", info.configuracion) )

      setCanSave(true)

      hideLoading()
    }, (err)=>{
      showMessage(err)
      hideLoading()
    })
  }

  const confirmSave = ()=>{
    const data = [
      {
        "grupo": "Nom_RazonSocial",
        "entrada": "ImpresionTicket",
        "valor": razonSocial
      },
      {
        "grupo": "Nro_Rut",
        "entrada": "ImpresionTicket",
        "valor": rut
      },
      {
        "grupo": "Nom_Direccion",
        "entrada": "ImpresionTicket",
        "valor": direccion
      },
      {
        "grupo": "Nom_Giro",
        "entrada": "ImpresionTicket",
        "valor": giro
      }
    ]
    ModelConfig.updateComercio(data,(info)=>{
    }, (err)=>{
      showMessage(err)
    })
  }


// OBSERVERS

  useEffect( ()=>{
    if(canSave){
      confirmSave()
    }
  }, [applyChanges])

  useEffect(()=>{
    if(tabNumber != 1)return
    loadInitial();
    
  },[tabNumber]);


  return (
    <TabPanel value={tabNumber} index={1}>

<Grid item xs={12} lg={12}>
  <Grid container spacing={2}>
    <TextField
      margin="normal"
      fullWidth
      label="RazonSocial"
      type="text" // Cambia dinámicamente el tipo del campo de contraseña
      value={razonSocial}
      onChange={(e) => setRazonSocial(e.target.value)}
    />

    <TextField
      margin="normal"
      fullWidth
      label="Rut"
      type="text" // Cambia dinámicamente el tipo del campo de contraseña
      value={rut}
      onChange={(e) => setRut(e.target.value)}
    />

    <TextField
      margin="normal"
      fullWidth
      label="Direccion"
      type="text" // Cambia dinámicamente el tipo del campo de contraseña
      value={direccion}
      onChange={(e) => setDireccion(e.target.value)}
    />


    <TextField
      margin="normal"
      fullWidth
      label="Giro"
      type="text" // Cambia dinámicamente el tipo del campo de contraseña
      value={giro}
      onChange={(e) => setGiro(e.target.value)}
    />

    </Grid>
  </Grid>
      
    </TabPanel>
  );
};

export default AdminConfigTabComercio;
