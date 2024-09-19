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

  const [ventas, setVentas] = useState([])
  const [totalVentas, setTotalVentas] = useState(0)
  const [cantidadVentas, setCantidadVentas] = useState([])

  const fetchDataVentas = async () => {
    const params = {
      fechadesde: dayjs().format("YYYY-MM-DD"),
      fechahasta: dayjs().format("YYYY-MM-DD"),
      tipoComprobante: "0,1,2,3,4",
    };
    // console.log("Iniciando fetchData con params:", params);

    try {
      const url = `${apiUrl}/ReporteVentas/ReporteLibroIVA`;
      // console.log("URL being fetched:", url);

      const response = await axios.get(url, { params });

      // console.log("Respuesta del servidor:", response);

      if (response.data) {
        setCantidadVentas(response.data.cantidad);
        if (response.data.cantidad > 0 && response.data.ventaCabeceraReportes) {
          setVentas(response.data.ventaCabeceraReportes);
          // console.log("Datos recibidos:", response.data.ventaCabeceraReportes);

          const totalValue = response.data.ventaCabeceraReportes.reduce(
            (sum, item) => sum + item.total,
            0
          );
          setTotalVentas(totalValue);
        } else {
          setVentas([]);
          setTotalVentas(0);
        }
      } else {
        console.warn("La respuesta no contiene datos:", response);
        setVentas([]);
        setTotalVentas(0);
      }
    } catch (error) {
      console.error("Error al buscar datos:", error);
      // setError("Error fetching data");
      setTotalVentas(0);
    }
  };

  useEffect(()=>{
    fetchDataVentas()
  },[])

  return (
    <Card>
      <CardContent>
        
        <CardContent>
          <Typography variant="body-md">Ventas</Typography>
          <Typography variant="h2">${totalVentas.toLocaleString()}</Typography>
        </CardContent>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="small" onClick={()=>{
            navigate("/reportes/rankinglibroventas");
        }}>
          Ver detalles ventas
        </Button>
        
      </CardActions>
    </Card>
  );
}