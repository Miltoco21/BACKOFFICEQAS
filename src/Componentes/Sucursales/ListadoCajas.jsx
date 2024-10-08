/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  IconButton,
  Grid,
  Select,
  InputLabel,
  Pagination,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ModelConfig from "../../Models/ModelConfig";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Sucursal from "../../Models/Sucursal";
import System from "../../Helpers/System";
import SucursalCaja from "../../Models/SucursalCaja";
import TiposPasarela from "../../definitions/TiposPasarela";

const ITEMS_PER_PAGE = 10;

const ListadoCajas = () => {

  const {
    showLoading,
    hideLoading,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [sucursales, setSucursales] = useState([])
  const [cajas, setCajas] = useState([])
  
  const cargarListado = ()=>{
    Sucursal.getAll((sucursalesx)=>{
      setSucursales(sucursalesx)

      procesarCajas(sucursalesx)
    },(err)=>{
      showMessage(err)
    })
  }

  const procesarCajas = (sucursales)=>{
    var cajasx = []

    
    sucursales.forEach((sucursal,ix)=>{
      if(sucursal.puntoVenta && sucursal.puntoVenta.idSucursalPvTipo === TiposPasarela.CAJA){
        sucursal.puntoVenta.sucursal = sucursal.descripcionSucursal
        cajasx.push(sucursal.puntoVenta)
      }
    })

    setCajas(cajasx)
  }

  const editar = async (caja) => {
    const nuevoNombre = prompt("Cambiar nombre",caja.sPuntoVenta)

    if(!nuevoNombre)return
      const data = System.clone(caja)
      delete data.sucursal
      delete data.sPuntoVenta
      data.PuntoVenta = nuevoNombre
      console.log("Datos antes de enviar:", data);
      showLoading("Enviando...");
      const caj = new SucursalCaja()
      caj.add(data,(responseData)=>{
        hideLoading();
        showMessage(responseData.descripcion)
        cargarListado()
      },(error)=>{
        hideLoading();
        showMessage(error)
      })
    };

  useEffect(()=>{
    cargarListado()
  },[])

  return (
    <Box sx={{ p: 2, mb: 4 }}>
          {cajas.length === 0 ? (
            <Typography>
              No hay informacion para mostrar
            </Typography>
          ) : (

          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={10}>Cajas</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre de la caja</TableCell>
                <TableCell>Sucursal</TableCell>
                <TableCell>Configuraciones</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cajas.map((caja,key) => (
                <TableRow key={key}>
                  <TableCell>{caja.idCaja}</TableCell>
                  <TableCell>{caja.sPuntoVenta}</TableCell>
                  <TableCell>{caja.sucursal}</TableCell>
                  <TableCell>{caja.puntoVentaConfiguracions.length}</TableCell>
                  <TableCell>
                    
                  <IconButton onClick={() => {
                    console.log("editar", caja)
                    editar(caja)
                  }}>
                    <EditIcon />
                  </IconButton>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
    </Box>
  );
};

export default ListadoCajas;
