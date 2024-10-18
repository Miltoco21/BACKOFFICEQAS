import React, { useState, useContext, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import SideBar from '../Componentes/NavBar/SideBar';
import CardTotalCompras from '../Componentes/Home/CardTotalCompras';
import CardTotalVentas from '../Componentes/Home/CardTotalVentas';

import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";
import ModelConfig from '../Models/ModelConfig';
import dayjs from 'dayjs';
import axios from 'axios';
import User from '../Models/User';
import LongClick from '../Helpers/LongClick';
import SucursalCaja from '../Models/SucursalCaja';
import System from '../Helpers/System';
import CardSemaforo from '../Componentes/Home/CardSemaforo';
import CardUsuariosActivos from '../Componentes/Home/CardUsuariosActivos';

const defaultTheme = createTheme();

const Home = ({}) => {

  const {
    userData,
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const [usuarios, setUsuarios] = useState([])
  const [usuariosInactivos, setUsuariosInactivos] = useState([])
  
  const [estadoCajas, setEstadoCajas] = useState([])

  const clasificaUsuarios = (usus)=>{
    console.log("clasificando", usus)
    const ususAct = []
    const ususInact = []
    usus.forEach((usu,ix)=>{
      if(usu.activo){
        ususAct.push(usu)
      }else{
        ususInact.push(usu)
      }
    })
    
    setUsuariosInactivos(ususInact)
  }

  const fetchUsuarios = ()=>{
    User.getInstance().getAll((usuariosx)=>{
      setUsuarios(usuariosx)
      clasificaUsuarios(usuariosx)
    },()=>{})
  }

  const fetchEstadosCajas = ()=>{
    SucursalCaja.getInstance().getEstados((data)=>{
      console.log("estados de la caja",data.cajaTurnoEstados)
      setEstadoCajas(data.cajaTurnoEstados)
    },()=>{})
  }

  useEffect(()=>{
    fetchUsuarios()
    fetchEstadosCajas()
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
              <CardSemaforo/>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
              <CardTotalCompras/>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
              <CardTotalVentas/>
          </Grid>
          


          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CardUsuariosActivos />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            {usuariosInactivos.length>0 && (
              <Box
              sx={{
                bgcolor: "background.paper",
                boxShadow: 2,
                p: 4,
                overflow: "auto", // Added scrollable feature
                padding:"10px",
              }}
              >
                <Typography variant='h5'>Usuarios inactivos</Typography>
                { usuariosInactivos.map((usu,ix)=>
                <Typography sx={{
                  borderRadius:"3px",
                  padding:"10px",
                  backgroundColor:"#DBE7FF",
                  color:"#000000",
                  margin:"10px",
                  display:"inline-block"
                }} key={ix}>
                  <Typography variant='p' sx={{ display:"block" }}>
                  {usu.nombres} {usu.apellidos}
                  </Typography>
                  <Typography variant='p' sx={{ display:"block" }}>
                    Cod. {usu.codigoUsuario}
                  </Typography>
                </Typography>
                )}
              </Box>
            )}

            </Grid>



            <Grid item xs={12} sm={12} md={12} lg={12}>
            {estadoCajas.length>0 ? (
              <Box
              sx={{
                bgcolor: "background.paper",
                boxShadow: 2,
                p: 4,
                overflow: "auto", // Added scrollable feature
                padding:"10px",
              }}
              >
                <Typography variant='h5'>Estados Cajas</Typography>
                { estadoCajas.map((estadoCaja,ix)=>(
                  <div key={ix} style={{
                    padding:"10px",
                    margin:"3px",
                    display:"inline-block",
                    backgroundColor: ( estadoCaja.cierreCaja  ? "#56D005" : "#E30202"),
                    color: "#fff"
                  }}>
                  <Typography variant='p' sx={{ display:"block" }}>
                    Sucursal {estadoCaja.codigoSucursal}
                  </Typography>

                  <Typography variant='p' sx={{ display:"block" }}>
                    Caja {estadoCaja.puntoVenta}
                  </Typography>

                  <Typography variant='p' sx={{ display:"block" }}>
                    Turno {estadoCaja.idTurno}
                  </Typography>

                  <Typography variant='p' sx={{ display:"block" }}>
                    {estadoCaja.usuarioNombre} {estadoCaja.usuarioApellido}
                  </Typography>

                  <Typography variant='p' sx={{ display:"block" }}>
                    {estadoCaja.cierreCaja ? "Con cierre" : "Sin cerrar"}
                  </Typography>

                  <Typography variant='p' sx={{ display:"block" }}>
                    Fecha Ingreso {System.formatDateServer(estadoCaja.fechaIngreso)}
                  </Typography>

                  <Typography variant='p' sx={{ display:"block" }}>
                    Fecha Termino {estadoCaja.fechaTermino === "1990-01-01T00:00:00" ? "-" : System.formatDateServer(estadoCaja.fechaTermino)}
                  </Typography>
                  </div>
                  ))}
                
              </Box>
            ): (
              <Typography>No Hay</Typography>
            )}
          </Grid>
            
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Home;