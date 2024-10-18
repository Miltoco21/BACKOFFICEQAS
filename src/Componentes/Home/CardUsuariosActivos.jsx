/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardActions, Button, Typography, Box } from '@mui/material';
import { CircularProgress,  } from '@mui/material';
import { useNavigate } from "react-router-dom";
import ModelConfig from '../../Models/ModelConfig';
import dayjs from 'dayjs';
import axios from 'axios';
import ReporteVenta from '../../Models/ReporteVenta';
import User from '../../Models/User';
import LongClick from '../../Helpers/LongClick';
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";


export default function({
}) {
  const {
    userData,
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);
  
  const [usuariosActivos, setUsuariosActivos] = useState([])

  const fetchInfo = ()=>{
    User.getActivos((usuariosx)=>{
      setUsuariosActivos(usuariosx)
    },()=>{})
  }

  useEffect(()=>{
    fetchInfo()
  },[])

  return (usuariosActivos.length>0 ? (
      <Box
      sx={{
        bgcolor: "background.paper",
        boxShadow: 2,
        p: 4,
        overflow: "auto", // Added scrollable feature
        padding:"10px",
      }}
      >
        <Typography variant='h5'>Usuarios Activos</Typography>
        { usuariosActivos.map((usu,ix)=>{
          const longBoleta = new LongClick(1);
          longBoleta.onClick(()=>{
            // alert("click normal")
          })
          longBoleta.onLongClick(()=>{
            showConfirm("Cerrar la sesion de " + usu.nombre+ " " + usu.apellido + "?",()=>{
              const user = new User()
              user.fill(usu)
              user.doLogoutInServer(()=>{
                showMessage("Realizado correctamente")
                fetchInfo()
              },()=>{
                showMessage("no se pudo realizar")
              })
            })
          })
          return (
          <Typography sx={{
          borderRadius:"3px",
          padding:"10px",
          backgroundColor:"#E30202",
          color:"#FFFFFF",
          margin:"10px",
          cursor:"pointer",
          userSelect:"none",
          display:"inline-block"
        }} key={ix} 
          onTouchStart={()=>{longBoleta.onStart()}}
          onMouseDown={()=>{longBoleta.onStart()}}
          onTouchEnd={()=>{longBoleta.onEnd()}}
          onMouseUp={()=>{longBoleta.onEnd()}}
          onMouseLeave={()=>{longBoleta.cancel()}}
          onTouchMove={()=>{longBoleta.cancel()}}
          >
          <Typography variant='p'>
            {usu.nombre} {usu.apellido}
          </Typography>
          <Typography variant='p' sx={{ display:"block" }}>
            Cod. {usu.codigoUsuario}
          </Typography>
          <Typography variant='p' sx={{ display:"block" }}>
            Sucursal {usu.codigoSucursal}
          </Typography>
          <Typography variant='p' sx={{ display:"block" }}>
            Caja {usu.puntoVenta}
          </Typography>
        </Typography>) }
        )}
      </Box>
    ):(
      <Typography></Typography>
    )
  );
}