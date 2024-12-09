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
import CardUsuariosInactivos from '../Componentes/Home/CardUsuariosInactivos';
import Validator from '../Helpers/Validator';

const defaultTheme = createTheme();

const Home = ({}) => {

  const {
    userData,
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);
  const [estadoCajas, setEstadoCajas] = useState([])
  const [usuariosActivos, setUsuariosActivos] = useState([])
  const [usuariosInactivos, setUsuariosInactivos] = useState([])
  
  const [roles, setRoles] = useState([])
  const [rol, setRol] = useState("rol")


  const solicitarEstadosCajas = ()=>{
    SucursalCaja.getInstance().getEstados((data)=>{
      console.log("estados de la caja",data.cajaTurnoEstados)
      setEstadoCajas(data.cajaTurnoEstados)
    },()=>{})
  }
  
  const solicitarRoles = ()=>{

    User.getRoles((roles,response)=>{
      window.roles = roles
      setRoles(roles)
      checkRol(roles)
    }, (error)=>{
      console.log(error);
    })
  }

  const checkRol = (roles)=>{
    if(!userData) return "rol"
    if(Validator.isNumeric(userData.rol)){
      console.log("esnumerico")
      
      roles.forEach((rolx)=>{
        if(rolx.idRol == userData.rol){
          setRol(rolx.rol)
        }
      })

    }else{
      return userData.rol
    }

    return userData ? userData.rol : 'rol'
  }

  useEffect(()=>{
    solicitarEstadosCajas()
    solicitarRoles()
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
            Rol: { rol }
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
            <CardUsuariosActivos setActivos={setUsuariosActivos} />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CardUsuariosInactivos usuariosActivos={usuariosActivos}/>
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
              <Typography></Typography>
            )}
          </Grid>
            
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Home;