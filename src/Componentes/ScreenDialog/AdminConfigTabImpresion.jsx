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


const AdminConfigTabImpresion = ({
  tabNumber,
  applyChanges
}) => {

  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [canSave, setCanSave] = useState(false);

  const [RazonSocial, setRazonSocial] = useState("");
  const [ImprimirInicioCaja, setImprimirInicioCaja] = useState("");
  const [ImprimirRedelcom, setImprimirRedelcom] = useState("");
  const [Rut, setRut] = useState("");
  const [NombreEstablecimiento, setNombreEstablecimiento] = useState("");
  const [Giro, setGiro] = useState("");
  const [Direccion, setDireccion] = useState("");
  const [Comuna, setComuna] = useState("");
  const [Imprimir, setImprimir] = useState("");
  const [rutEmpresa, setrutEmpresa] = useState("");
  const [AlargarTicket, setAlargarTicket] = useState("");
  const [ImprimirAlargar, setImprimirAlargar] = useState("");


  const getValFromConfig = (entrada, grupo, infoTotal) => {
    var valor = ""
    infoTotal.forEach((configInfo) => {
      if (configInfo.entrada == entrada && configInfo.grupo == grupo) {
        valor = configInfo.valor
      }
    })
    return valor
  }

  const loadInitial = () => {
    showLoading("buscando la informacion")
    ModelConfig.getAllImpresion((info) => {
      // console.log(info)
      setRazonSocial(getValFromConfig("RazonSocial", "Ticket", info.configuracion))
      setImprimirInicioCaja(getValFromConfig("ImprimirInicioCaja", "Ticket", info.configuracion))
      setImprimirRedelcom(getValFromConfig("ImprimirRedelcom", "Ticket", info.configuracion))
      setRut(getValFromConfig("Rut", "Ticket", info.configuracion))
      setNombreEstablecimiento(getValFromConfig("NombreEstablecimiento", "Ticket", info.configuracion))
      setGiro(getValFromConfig("Giro", "Ticket", info.configuracion))
      setDireccion(getValFromConfig("Direccion", "Ticket", info.configuracion))
      setComuna(getValFromConfig("Comuna", "Ticket", info.configuracion))
      setImprimir(getValFromConfig("Imprimir", "Ticket", info.configuracion))
      setrutEmpresa(getValFromConfig("rutEmpresa", "Ticket", info.configuracion))
      setAlargarTicket(getValFromConfig("AlargarTicket", "Ticket", info.configuracion))
      setImprimirAlargar(getValFromConfig("ImprimirAlargar", "Ticket", info.configuracion))

      setCanSave(true)

      hideLoading()
    }, (err) => {
      showMessage(err)
      hideLoading()
    })
  }

  const confirmSave = () => {
    const data = [
      {
        "grupo": "Ticket",
        "entrada": "RazonSocial",
        "valor": RazonSocial
      },
      {
        "grupo": "Ticket",
        "entrada": "ImprimirInicioCaja",
        "valor": ImprimirInicioCaja
      },
      {
        "grupo": "Ticket",
        "entrada": "ImprimirRedelcom",
        "valor": ImprimirRedelcom
      },
      {
        "grupo": "Ticket",
        "entrada": "Rut",
        "valor": Rut
      },
      {
        "grupo": "Ticket",
        "entrada": "NombreEstablecimiento",
        "valor": NombreEstablecimiento
      },
      {
        "grupo": "Ticket",
        "entrada": "Giro",
        "valor": Giro
      },
      {
        "grupo": "Ticket",
        "entrada": "Direccion",
        "valor": Direccion
      },
      {
        "grupo": "Ticket",
        "entrada": "Comuna",
        "valor": Comuna
      },
      {
        "grupo": "Ticket",
        "entrada": "Imprimir",
        "valor": Imprimir
      },
      {
        "grupo": "Ticket",
        "entrada": "rutEmpresa",
        "valor": rutEmpresa
      },
      {
        "grupo": "Ticket",
        "entrada": "AlargarTicket",
        "valor": AlargarTicket
      },
      {
        "grupo": "Ticket",
        "entrada": "ImprimirAlargar",
        "valor": ImprimirAlargar
      }
    ]

    showLoading("Actualizando")
    ModelConfig.updateImpresion(data, (info) => {
      hideLoading()
      showMessage("Realizado correctamente")
    }, (err) => {
      hideLoading()
      showMessage(err)
    })
  }


  // OBSERVERS

  useEffect(() => {
    if (canSave) {
      confirmSave()
    }
  }, [applyChanges])

  useEffect(() => {
    if (tabNumber != 2) return
    loadInitial();

  }, [tabNumber]);


  return (
    <TabPanel value={tabNumber} index={2}>

      <Grid item xs={12} lg={12}>
        <Grid container spacing={2}>
          <TextField
            margin="normal"
            fullWidth
            label="RazonSocial"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={RazonSocial}
            onChange={(e) => setRazonSocial(e.target.value)}
          />


          <TextField
            margin="normal"
            fullWidth
            label="ImprimirInicioCaja"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={ImprimirInicioCaja}
            onChange={(e) => setImprimirInicioCaja(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            label="ImprimirRedelcom"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={ImprimirRedelcom}
            onChange={(e) => setImprimirRedelcom(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Rut"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={Rut}
            onChange={(e) => setRut(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            label="NombreEstablecimiento"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={NombreEstablecimiento}
            onChange={(e) => setNombreEstablecimiento(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Giro"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={Giro}
            onChange={(e) => setGiro(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Direccion"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={Direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Comuna"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={Comuna}
            onChange={(e) => setComuna(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Imprimir"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={Imprimir}
            onChange={(e) => setImprimir(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            label="rutEmpresa"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={rutEmpresa}
            onChange={(e) => setrutEmpresa(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            label="AlargarTicket"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={AlargarTicket}
            onChange={(e) => setAlargarTicket(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            label="ImprimirAlargar"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={ImprimirAlargar}
            onChange={(e) => setImprimirAlargar(e.target.value)}
          />


        </Grid>
      </Grid>

    </TabPanel>
  );
};

export default AdminConfigTabImpresion;
