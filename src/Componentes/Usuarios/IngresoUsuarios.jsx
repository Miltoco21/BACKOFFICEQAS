import React, { useState, useEffect, useContext } from "react";

import {
  Grid,
  Paper,
  Box,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  InputLabel,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
  InputAdornment 
} from "@mui/material";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ModelConfig from "../../Models/ModelConfig";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import { Check, Dangerous, Percent } from "@mui/icons-material";

import User  from "./../../Models/User";
export const defaultTheme = createTheme();

export default function IngresoUsuarios({ onClose}) {
  const {
    userData, 
    showMessage
  } = useContext(SelectedOptionsContext);


  const apiUrl = ModelConfig.get().urlBase;

  const [nombres, setNombre] = useState("");
  const [apellidos, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [rut, setRut] = useState("");
  const [codigoUsuario, setCodigoUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [remuneracion, setRemuneracion] = useState("");
  const [credito, setCredito] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedComuna, setSelectedComuna] = useState("");
  const [regionOptions, setRegionOptions] = useState([]);
  const [comunaOptions, setComunaOptions] = useState([]);
  const [rolesOptions, setRolesOptions] = useState([]);
  const [selectedRol, setSelectedRol] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rutOk, setRutOk] = useState(null);


  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };



  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(
          apiUrl + `/RegionComuna/GetAllRegiones`
        );
        setRegionOptions(response.data.regiones);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRegions();
  }, []);

  useEffect(() => {
    const fetchComunas = async () => {
      if (selectedRegion) {
        try {
          const response = await axios.get(
            apiUrl + `/RegionComuna/GetComunaByIDRegion?IdRegion=${selectedRegion}`
          );
          console.log("comunas:",response.data.comunas)
          setComunaOptions(
            response.data.comunas.map((comuna) => comuna.comunaNombre)
          );
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchComunas();
  }, [selectedRegion]);



  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await axios.get(
          apiUrl + `/Usuarios/GetAllRolUsuario`
        );
        setRolesOptions(response.data.usuarios);
        // console.log("ROLES", response.data.usuarios);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRoles();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setCorreo(inputEmail);
    setErrores((prevErrores) => ({
      ...prevErrores,
      correo: !inputEmail
        ? "Favor completar email"
        : !validateEmail(inputEmail)
        ? "Formato de correo no es válido"
        : "",
    }));
  };

  const validarRutChileno = (rut) => {
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) {
      return false;
    }

    const partesRut = rut.split("-");
    const digitoVerificador = partesRut[1].toUpperCase();
    const numeroRut = partesRut[0];
    if (numeroRut.length < 7) {
      return false;
    }

    const calcularDigitoVerificador = (T) => {
      let M = 0;
      let S = 1;
      for (; T; T = Math.floor(T / 10)) {
        S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
      }
      return S ? String(S - 1) : "K";
    };

    return calcularDigitoVerificador(numeroRut) === digitoVerificador;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = [];

    //Validaciones
    if (!rut) {
      errors.rut = "Favor completar rut ";
      showMessage("Favor completar rut ")
      return false
    } else if (!validarRutChileno(rut)) {
      errors.rut = "El RUT ingresado NO es válido.";
      showMessage("El RUT ingresado NO es válido.")
      return false
    }

    if (!nombres) {
      errors.nombres = "Favor completar nombres ";
      showMessage("Favor completar nombres ")
      return false
    }
    if (!apellidos) {
      errors.apellidos = "Favor completar apellidos ";
      showMessage("Favor completar apellidos ")
      return false
    }
    if (!correo) {
      errors.correo = "Favor completar email ";
      showMessage("Favor completar email ")
      return false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      errors.correo = "Formato de correo no es válido";
      showMessage("Formato de correo no es válido")
      return false
    }
   
    if (!telefono) {
      errors.telefono = "Favor completar telefono ";
      showMessage("Favor completar telefono ")
      return false
    } 
    if (!codigoUsuario) {
      errors.codigoUsuario = "Favor completar código de Usuario ";
      showMessage("Favor completar código de Usuario ")
      return false
    } 
    if (!direccion) {
      errors.direccion = "Favor completar dirección ";
      showMessage("Favor completar dirección ")
      return false
    }
    if (!selectedComuna || selectedComuna.length === 0) {
      errors.comuna = "Favor completar comuna ";
      showMessage("Favor completar comuna ")
      return false
    }
    if (!selectedRegion) {
      errors.selectedRegion = "Favor completar región ";
      showMessage("Favor completar región ")
      return false
    }
    if (!codigoPostal) {
      errors.codigoPostal = "Favor completar codigo postal ";
      showMessage("Favor completar codigo postal ")
      return false
    }
    if (!rut) {
      errors.rut = "Favor completar rut ";
      showMessage("Favor completar rut ")
      showMessage("Favor completar rut ")
      return false
    }
    if (!validarRutChileno(rut)) {
      errors.rut = "El RUT ingresado NO es válido.";
      showMessage("El RUT ingresado NO es válido.")
      showMessage("El RUT ingresado NO es válido.")
      return false
    }
    if (!selectedRol) {
      errors.selectedRol = "Favor completar rol";
      showMessage("Favor completar rol")
      return false
    }
    if (!codigoUsuario) {
      errors.codigoUsuario = "Favor completar código usuario ";
      showMessage("Favor completar código usuario ")
      return false
    }
    if (!clave) {
      errors.clave = "Favor completar clave ";
      showMessage("Favor completar clave ")
      return false
    }
    if (!remuneracion) {
      errors.remuneracion = "Favor completar remuneración ";
      showMessage("Favor completar remuneración ")
      return false
    }
    if (!credito) {
      errors.credito = "Favor completar crédito ";
      showMessage("Favor completar crédito ")
      return false
    }

    if (Object.keys(errors).length > 0) {
      setErrores(errors);
    } else {
      const usuario = {
        nombres: nombres,
        apellidos: apellidos,
        correo: correo,
        direccion: direccion,
        telefono: telefono,
        region: selectedRegion.toString(),
        comuna: selectedComuna,
        codigoPostal: codigoPostal,
        rut: rut,
    
        codigoUsuario: codigoUsuario,
        clave: clave,
        // remuneracion: remuneracion,
        // credito: credito,
        rol: selectedRol.toString(),
      };
      console.log("Datos antes de enviar:", usuario);
      try {
        setLoading(true);
        const response = await axios.post(
          apiUrl + `/Usuarios/AddUsuario`,
          usuario
        );
        console.log("Respuesta de la solicitud:", response);

        if (response.status === 201) {
          setSnackbarMessage("Usuario creado exitosamente");
          setSnackbarOpen(true);
        }
      } catch (error) {
        if ( error.response.status === 409) {
          setSnackbarMessage(error.response.descripcion);
          setSnackbarOpen(true);
        } else {
          console.error("Error:", error);
          setModalOpen(true);
        }
      } finally {
        setLoading(false);
        console.log("Datos después de enviar:", usuario);
        setNombre("");
        setApellido("");
        setCorreo("");
        setTelefono("");
        setDireccion("");
        setSelectedRegion("");
        setSelectedComuna("");
        setSelectedRol("");
        setCodigoPostal("");
        setRut("");
        setCodigoUsuario("");
        setClave("");
        setRemuneracion("");
        setCredito("");
        setErrores({});
       
        setUserId(null);

        setTimeout(() => {
          onClose();
        }, 3000);
       
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent("");
    setNombre("");
    setApellido("");
    setCorreo("");
    setTelefono("");
    setDireccion("");
    setSelectedRegion("");
    setSelectedComuna("");
    setSelectedRol("");
    setCodigoPostal("");
    setRut("");
    setCodigoUsuario("");
    setClave("");
    setRemuneracion("");
    setCredito("");
    setErrores({});
    setIsEditing(false);
    setUserId(null);
  };

  const handleNumericKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;
  
    // Verifica si el carácter es un número, backspace o delete
    if (
    !/\d/.test(key) && // números
      key!== 'Backspace' && // backspace
      key!== 'Delete' // delete
    ) {
      event.preventDefault();
    }
  
    // Previene espacios iniciales y al final de la cadena
    if (
      key === ' ' &&
      (input.length === 0 || input.endsWith(' '))
    ) {
      event.preventDefault();
    }
  };
  
  const handleTextKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;
  
    // Verifica si el carácter es alfanumérico o uno de los caracteres permitidos
    if (
     !/^[a-zA-Z0-9]$/.test(key) && // letras y números
      key!== ' ' && // espacio
      key!== 'Backspace' && // backspace
      key!== 'Delete' // delete
    ) {
      event.preventDefault();
    }
  
    // Previene espacios iniciales y al final de la cadena
    if (
      key === ' ' &&
      (input.length === 0 || input.endsWith(' '))
    ) {
      event.preventDefault();
    }
  };
  const handleEmailKeyDown = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
  
    // Prevenir espacios en cualquier parte del correo
    if (charCode === 32) { // 32 es el código de la tecla espacio
      event.preventDefault();
    }
  };
  const handleRUTKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;
  
    // Permitir números (0-9), guion (-), backspace y delete
    if (
     !isNaN(key) || // números
      key === 'Backspace' || // backspace
      key === 'Delete' || // delete
      (key === '-' && !input.includes('-')) ||// guion y no hay guion previamente
      (key === 'k' && !input.includes('k')) // guion y no hay guion previamente
    ) {
      // Permitir la tecla
    } else {
      // Prevenir cualquier otra tecla
      event.preventDefault();
    }
  
    // Prevenir espacios iniciales y asegurar que el cursor no esté en la posición inicial
    if (key === ' ' && (input.length === 0 || event.target.selectionStart === 0)) {
      event.preventDefault();
    }
  };

  const handleTextOnlyKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;
  
    // Verifica si el carácter es una letra (mayúscula o minúscula), espacio, backspace o delete
    if (
     !/[a-zA-Z]/.test(key) && // letras mayúsculas y minúsculas
      key!== ' ' && // espacio
      key!== 'Backspace' && // backspace
      key!== 'Delete' // delete
    ) {
      event.preventDefault();
    }
  
    // Previene espacios iniciales y al final de la cadena
    if (
      key === ' ' &&
      (input.length === 0 || input.endsWith(' '))
    ) {
      event.preventDefault();
    }
  };


  useEffect(()=>{
    console.log("cambio rutOk")
    console.log(rutOk)

  },[rutOk])
  
  
  const checkRut = ()=>{
    // console.log("checkRut")
    if(rut === "") return

    User.getInstance().existRut({
      rut
    },(usuarios)=>{
      // console.log(usuarios)
      if(usuarios.length>0){
        showMessage("Ya existe el rut ingresado")
        setRutOk(false)
      }else{
        showMessage("Rut disponible")
        setRutOk(true)
      }
    }, (err)=>{
      console.log(err)
      if(err.response.status == 404){
        showMessage("Rut disponible")
        setRutOk(true)
      }
    })
  }
  return (
    <div style={{ overflow: "auto" }}>
        <Paper elevation={16} square>
          <Grid container spacing={2} sx={{ padding: "2%" }}>
            <Grid item xs={12}>
              <h2>Ingreso Usuario</h2>
            </Grid>
            {/* <Grid item xs={12} md={12}> */}
              {/* {Object.keys(errores).length > 0 && (
                <div
                  style={{ color: "red", marginBottom: "1%", marginTop: "1%" }}
                >
                  <ul>{Object.values(errores)[0]}</ul>
                </div>
              )} */}
            {/* </Grid> */}

            <Grid item xs={12} md={4}>
              <InputLabel sx={{ marginBottom: "2%", }}>
                Ingresa rut sin puntos y con guión
              </InputLabel>
              <TextField
                fullWidth
                margin="normal"
                required
                id="rut"
                label="ej: 11111111-1"
                name="rut"
                autoFocus
                autoComplete="rut"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                onKeyDown={handleRUTKeyDown}
                onBlur={checkRut}

                InputProps={{
                  startAdornment: (
                    <InputAdornment position="end">
                      <Check sx={{
                        color:"#06AD16",
                        display: (rutOk && rut!="" ? "flex" : "none"),
                        marginRight:"10px"
                      }} />
      
                      <Dangerous sx={{
                        color:"#CD0606",
                        display: ( ( rutOk === false ) ? "flex" : "none")
                      }} />
                    </InputAdornment>
                  ),
                }}


              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Nombre
              </InputLabel>
              <TextField
                fullWidth
                margin="normal"
                required
                type="text"
                id="nombres"
                label="Nombres"
                name="nombres"
                autoComplete="nombres"
                value={nombres}
                onChange={(e) => setNombre(e.target.value)}
                onKeyDown={handleTextOnlyKeyDown}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Apellidos
              </InputLabel>
              <TextField
                type="text"
                fullWidth
                margin="normal"
                required
                id="apellidos"
                label="Apellidos"
                name="apellidos"
                autoComplete="apellidos"
                value={apellidos}
                onChange={(e) => setApellido(e.target.value)}
                onKeyDown={handleTextOnlyKeyDown}

              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Correo Electrónico
              </InputLabel>
              <TextField
                fullWidth
                margin="normal"
                required
                type="email"
                id="correo"
                label="Correo Electrónico"
                name="correo"
                autoComplete="correo"
                value={correo}
                onChange={handleEmailChange}
                onKeyDown={handleEmailKeyDown}

              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Teléfono
              </InputLabel>
              <TextField
                fullWidth
            
                margin="normal"
                required
                id="telefono"
                label="Teléfono"
                name="telefono"
                autoComplete="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                onKeyDown={handleNumericKeyDown}
                   inputProps={{
                    maxLength: 12,
                  }}

              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Código Usuario
              </InputLabel>
              <TextField
                fullWidth
             
                margin="normal"
                required
                id="Código Cliente"
                label="Ingrese valor numérico"
                name="Código Cliente"
                autoComplete="Código Cliente"
                value={codigoUsuario}
                onChange={(e) => setCodigoUsuario(e.target.value)}
                onKeyDown={handleNumericKeyDown}


                
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Dirección
              </InputLabel>
              <TextField
                fullWidth
                margin="normal"
                required
                id="direccion"
                label="Dirección"
                name="direccion"
                autoComplete="direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Selecciona Región
              </InputLabel>
              <TextField
                margin="normal"
                required
                fullWidth
                id="region"
                select
                label="Región"
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                }}
              >
                {regionOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.regionNombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Selecciona Comuna
              </InputLabel>
              <TextField
                margin="normal"
                required
                id="comuna"
                select
                fullWidth
                label="Comuna"
                value={selectedComuna}
                onChange={(e) => {
                  const comunaValue = e.target.value;
                  setSelectedComuna(e.target.value);
                }}
              >
                {comunaOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Selecciona Rol
              </InputLabel>
              <TextField
                fullWidth
                margin="normal"
                required
                id="rol"
                select
                label="Rol"
                name="rol"
                value={selectedRol}
                onChange={(e) => setSelectedRol(e.target.value)}
              >
                {rolesOptions.map((rol) => (
                  <MenuItem key={rol.idRol} value={rol.rol}>
                    {rol.rol}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Código Postal
              </InputLabel>
              <TextField
                fullWidth
                margin="normal"
                required
              
                id="codigoPostal"
                label="Ingrese valor numérico"
                name="codigoPostal"
                autoComplete="codigoPostal"
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                onKeyDown={handleNumericKeyDown}

              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ marginBottom: "2%" }}>Ingresa Clave</InputLabel>
              <TextField
                fullWidth
                margin="normal"
              
                id="clave"
                label="Ingrese valor alfanumérico"
                name="clave"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                onKeyDown={handleTextKeyDown}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff fontSize="small"  /> : <Visibility fontSize="small"  />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Remuneración
              </InputLabel>
              <TextField
                fullWidth
                margin="normal"
                required
                id="remuneracion"
                select
                label="Remuneración"
                name="remuneracion"
                autoComplete="remuneracion"
                value={remuneracion}
                onChange={(e) => setRemuneracion(e.target.value)}
                onKeyDown={handleTextOnlyKeyDown}

              >
                <MenuItem value="Diario">Diario</MenuItem>
                <MenuItem value="Semanal">Semanal</MenuItem>
                <MenuItem value="Mensual">Mensual</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Crédito
              </InputLabel>
              <TextField
                fullWidth
                margin="normal"
                required
                id="credito"
                label="Ingrese valor numérico"
                name="credito"
                autoComplete="credito"
                value={credito}
                onChange={(e) => setCredito(e.target.value)}
                onKeyDown={handleNumericKeyDown}

              />
            </Grid>
          <Grid item xs={12}>
            <Button
              // fullWidth
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              disabled={loading}

              sx={{
                width:"50%",
                height:"55px",
                margin: "0 25%"
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} /> Procesando...
                </>
              ) : (
                "Registrar usuario"
              )}
            </Button>

          </Grid>
          </Grid>
        </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </div>
  );
}
