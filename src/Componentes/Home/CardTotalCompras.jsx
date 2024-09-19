/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import { CircularProgress,  } from '@mui/material';
import { useNavigate } from "react-router-dom";
import ModelConfig from '../../Models/ModelConfig';
import dayjs from 'dayjs';
import axios from 'axios';

export default function({
  
}) {
  const navigate = useNavigate();

  const apiUrl = ModelConfig.get().urlBase;

  const [compras, setCompras] = useState([])
  const [totalCompras, setTotalCompras] = useState(0)
  const [cantidadCompras, setCantidadCompras] = useState([])


  const fetchDataCompras = async () => {
    const params = {
      fechadesde: dayjs().format("YYYY-MM-DD"),
      fechahasta: dayjs().format("YYYY-MM-DD"),
      tipocomprobantes: "Ticket,Ingreso Interno,Factura,Boleta",
    };

    console.log("Iniciando fetchData con params:", params);

    try {
      const url = `${apiUrl}/Proveedores/ReporteProveedorCompraByFechaGet`;
      

      const response = await axios.get(url, { params });

      console.log("Respuesta del servidor:", response);

      if (response.data) {
        setCantidadCompras(response.data.cantidad);

        if (response.data.cantidad > 0 && response.data.proveedorCompraCabeceraReportes) {
          setCompras(response.data.proveedorCompraCabeceraReportes);
          console.log("Datos recibidos:", response.data.proveedorCompraCabeceraReportes);

          const totalValue = response.data.proveedorCompraCabeceraReportes.reduce(
            (sum, item) => sum + item.total,
            0
          );
          setTotalCompras(totalValue);
        } else {
          setCompras([]);
          setTotalCompras(0);
        }
      } else {
        console.warn("La respuesta no contiene datos:", response);
        setCompras([]);
        setTotalCompras(0);
      }
    } catch (error) {
      console.error("Error al buscar datos:", error);
      setTotalCompras(0);
    }
  };

  useEffect(()=>{
    fetchDataCompras()
  },[])


  return (
    <Card>
      <CardContent>
        
        <CardContent>
          <Typography variant="body-md">Compras</Typography>
          <Typography variant="h2">${totalCompras.toLocaleString()}</Typography>
        </CardContent>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="small" onClick={()=>{
            navigate("/reportes/rankinglibrocompras");
        }}>
          Ver detalles compras
        </Button>
      </CardActions>
    </Card>
  );
}