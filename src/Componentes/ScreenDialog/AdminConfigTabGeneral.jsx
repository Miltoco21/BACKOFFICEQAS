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
import SmallButton from "../Elements/SmallButton";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";


const AdminConfigTabGeneral = ({
  tabNumber,
  setSomeChange
}) => {

  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [urlBase, setUrlBase] = useState("");
  const [iva, setIva] = useState("");

  const loadConfigSesion = () => {
    const savedConfig = ModelConfig.get()
    setUrlBase(savedConfig.urlBase)
    setIva(savedConfig.iva)
  }

  const confirmSave = () => {
    ModelConfig.change("urlBase", urlBase);
    ModelConfig.change("iva", iva)

    showMessage("Guardado correctamente")
    setSomeChange(false)
  }

  useEffect(() => {
    if (tabNumber != 0) return
    loadConfigSesion();
  }, [tabNumber]);

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
            onKeyDown={() => { setSomeChange(true) }}
            onChange={(e) => setUrlBase(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Iva"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={iva}
            onKeyDown={() => { setSomeChange(true) }}
            onChange={(e) => setIva(e.target.value)}
          />

          <SmallButton textButton="Guardar" actionButton={confirmSave} />

        </Grid>
      </Grid>

    </TabPanel>
  );
};

export default AdminConfigTabGeneral;
