/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import { CircularProgress,  } from '@mui/material';
import { useNavigate } from "react-router-dom";
import ModelConfig from '../../Models/ModelConfig';
import dayjs from 'dayjs';
import axios from 'axios';
import ReporteVenta from '../../Models/ReporteVenta';
import Model from '../../Models/Model';

export default function({
}) {
  const navigate = useNavigate();
  const apiUrl = ModelConfig.get().urlBase;

  const [estado, setEstado] = useState(null)
  const [intControl, setIntControl] = useState(null)

  const fetchData = async () => 
  {
    Model.getConexion(()=>{
      setEstado(1)
      console.log("conexion ok")
    },(err)=>{
      console.log("error en conexion", err)
      setEstado(0)
    })
  };

  useEffect(()=>{
    fetchData()
    if(intControl === null){
      setIntControl(setInterval(() => {
        fetchData()
      }, 5 * 1000))
    }
  },[])

  return (
    <Card>
        <CardContent>
          <Typography variant="body-md">Conexion</Typography>
          {estado !== null &&(
            <Typography variant="body-md"
            sx={{
              padding:"10px",
              margin:"10px",
              backgroundColor:( estado ? "#01E401" : "#FF0033"),
              color:"#fff",
              borderRadius:"5px"
            }}
            >{ estado ? "CONECTADO": "SIN CONEXION" }</Typography>
          )}
        </CardContent>
    </Card> 
  );
}