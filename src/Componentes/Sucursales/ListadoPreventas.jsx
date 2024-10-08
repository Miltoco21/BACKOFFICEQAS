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
import Pasarela from "../../Models/Pasarela";
import TiposPasarela from "../../definitions/TiposPasarela";

const ITEMS_PER_PAGE = 10;

const ListadoPreventas = () => {

  const {
    showLoading,
    hideLoading,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [sucursales, setSucursales] = useState([])
  const [preventas, setPreventas] = useState([])
  
  const cargarListado = ()=>{
    Sucursal.getAll((sucursalesx)=>{
      setSucursales(sucursalesx)

      procesarCajas(sucursalesx)
    },(err)=>{
      showMessage(err)
    })
  }

  const procesarCajas = (sucursales)=>{
    var preventasx = []

    
    sucursales.forEach((sucursal,ix)=>{
      if(sucursal.puntoVenta && sucursal.puntoVenta.idSucursalPvTipo === TiposPasarela.PREVENTA){
        sucursal.puntoVenta.sucursal = sucursal.descripcionSucursal
        preventasx.push(sucursal.puntoVenta)
      }
    })

    setPreventas(preventasx)
  }

  useEffect(()=>{
    cargarListado()
  },[])

  return (
    <Box sx={{ p: 2, mb: 4 }}>
          {preventas.length === 0 ? (
            <Typography>
              No hay informacion para mostrar
            </Typography>
          ) : (

          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={10}>Preventas</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Sucursal</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Configuraciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {preventas.map((caja,key) => (
                <TableRow key={key}>
                  <TableCell>{caja.idCaja}</TableCell>
                  <TableCell>{caja.sucursal}</TableCell>
                  <TableCell>{caja.sPuntoVenta}</TableCell>
                  <TableCell>{caja.puntoVentaConfiguracions.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
    </Box>
  );
};

export default ListadoPreventas;
