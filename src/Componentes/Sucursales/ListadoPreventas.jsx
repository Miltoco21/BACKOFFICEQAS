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
import System from "../../Helpers/System";
import SucursalPreventa from "../../Models/SucursalPreventa";

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
    showLoading("Cargando el listado")
    Sucursal.getAll((sucursalesx)=>{
      setSucursales(sucursalesx)
      procesarCajas(sucursalesx)
      hideLoading()
    },(err)=>{
      hideLoading()
      showMessage(err)
    })
  }

  const procesarCajas = (sucursales)=>{
    var cajasx = []
    sucursales.forEach((sucursal,ix)=>{
      console.log(sucursal)
      if(sucursal.puntoVenta && sucursal.puntoVenta.length>0){
        sucursal.puntoVenta.forEach((puntoVentaItem,ix2)=>{
          if(puntoVentaItem && puntoVentaItem.idSucursalPvTipo === TiposPasarela.PREVENTA){
            puntoVentaItem.sucursal = sucursal.descripcionSucursal
            cajasx.push(puntoVentaItem)
          }
        })
      }
    })
    setPreventas(cajasx)
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
      const caj = new SucursalPreventa()
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
                <TableCell>Preventa</TableCell>
                <TableCell>Sucursal</TableCell>
                <TableCell>Configuraciones</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {preventas.map((preventa,key) => (
                <TableRow key={key}>
                  <TableCell>{preventa.idCaja}</TableCell>
                  <TableCell>{preventa.sPuntoVenta}</TableCell>
                  <TableCell>{preventa.sucursal}</TableCell>
                  <TableCell>{preventa.puntoVentaConfiguracions.length}</TableCell>
                  <TableCell>
                    
                  <IconButton onClick={() => {
                    console.log("editar", preventa)
                    editar(preventa)
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

export default ListadoPreventas;
