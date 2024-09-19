/* eslint-disable no-unused-vars */
import * as React from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import { CircularProgress,  } from '@mui/material';
import { useNavigate } from "react-router-dom";


export default function Card2({
  totalVentas,
  cantidadVentas
}) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent>
        
        <CardContent>
          <Typography variant="body-md">Ventas - Compras </Typography>
          <Typography variant="h2">${totalVentas.toLocaleString()}</Typography>
        </CardContent>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="small" onClick={()=>{
            navigate("/reportes/rankinglibroventas");
        }}>
          Ver detalles ventas
        </Button>
        <Button variant="contained" size="small" onClick={()=>{
            navigate("/reportes/rankinglibrocompras");
        }}>
          Ver detalles compras
        </Button>
      </CardActions>
    </Card>
  );
}