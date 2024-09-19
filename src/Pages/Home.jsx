import React, { useState, useContext, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import SideBar from '../Componentes/NavBar/SideBar';
import Card2 from '../Componentes/Home/Card2';

import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";
import ModelConfig from '../Models/ModelConfig';
import dayjs from 'dayjs';
import axios from 'axios';

const defaultTheme = createTheme();

const Home = ({}) => {

  const {
    userData 
  } = useContext(SelectedOptionsContext);

  const apiUrl = ModelConfig.get().urlBase;

  const [ventas, setVentas] = useState([])
  const [totalVentas, setTotalVentas] = useState([])
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
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <SideBar />
        <Box sx={{ flex: 1, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">
              Bienvenido {userData ? `${userData.nombres} ${userData.apellidos}` : 'Usuario'}
            </Typography>
            
          </Box>
          <Typography variant="h6">
            Rol: {userData ? userData.rol : 'rol'}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>

              






            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Card2 
              totalVentas={totalVentas}
              cantidadVentas={cantidadVentas}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Home;