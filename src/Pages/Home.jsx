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

const defaultTheme = createTheme();

const Home = ({}) => {

  const {
    userData,
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const [usuarios, setUsuarios] = useState([])
  const [usuariosActivos, setUsuariosActivos] = useState([])
  const [usuariosInactivos, setUsuariosInactivos] = useState([])

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

    setUsuariosActivos(ususAct)
    setUsuariosInactivos(ususInact)
  }

  const fetchUsuarios = ()=>{
    User.getInstance().getAll((usuariosx)=>{
      setUsuarios(usuariosx)
      clasificaUsuarios(usuariosx)
    },()=>{})
  }

  useEffect(()=>{
    fetchUsuarios()
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

          <Grid item xs={12} sm={12} md={6} lg={6}>
              <CardTotalCompras/>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
              <CardTotalVentas/>
          </Grid>


          <Grid item xs={12} sm={12} md={12} lg={12}>
            {usuariosActivos.length>0 && (
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
                    showConfirm("Cerrar la sesion de " + usu.nombres+ " " + usu.apellidos + "?",()=>{
                      const user = new User()
                      user.fill(usu)
                      user.doLogoutInServer(()=>{
                        showMessage("Realizado correctamente")
                        fetchUsuarios()
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
                    {usu.nombres} {usu.apellidos}
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
                  { usu.inicioCaja && (
                      <Typography variant='p' sx={{ display:"block" }}>
                      Caja iniciada
                    </Typography>
                  ) }
                </Typography>) }
                )}
              </Box>
            )}
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
            
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Home;