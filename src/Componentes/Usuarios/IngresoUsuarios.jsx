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

import InputRutUsuario from "../Elements/Compuestos/InputRutUsuario";
import Validator from "../../Helpers/Validator";
import InputName from "../Elements/Compuestos/InputName";
import InputEmail from "../Elements/Compuestos/InputEmail";
import InputPhone from "../Elements/Compuestos/InputPhone";
import InputNumber from "../Elements/Compuestos/InputNumber";
import InputPassword from "../Elements/Compuestos/InputPassword";
import InputSelect from "../Elements/Compuestos/SelectList";
import SelectList from "../Elements/Compuestos/SelectList";
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
  
  const stateRut = useState("")
  const stateNombre = useState("")
  const stateApellido = useState("")
  const stateCorreo = useState("")
  const statePhone = useState("")
  const stateUserCode = useState("")
  const stateDireccion = useState("")
  const statePostalCode = useState("")
  const stateCredit = useState("")
  const stateClave = useState("")
  const stateRemuneracionTipo = useState("")
  


  
  var validators = {
    stateRutValidation: useState(null),
    stateNombreValidation : useState(null),
    stateApellidoValidation : useState(null),
    stateCorreoValidation : useState(null),
    statePhoneValidation : useState(null),
    stateUserCodeValidation : useState(null),
    stateDireccionValidation : useState(null),
    statePostalCodeValidation : useState(null),
    stateCreditValidation : useState(null),
    stateClaveValidation : useState(null),
    stateRemuneracionTipoValidation : useState(null),
  }

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const stateRemuneracionTipoValidation = () => {
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

  
  const allValidationOk = ()=>{
    var allOk = true

    const keys = Object.keys(validators)

    Object.values(validators).forEach((validation,ix)=>{
      console.log("validation de  " + keys[ix] + " :", validation)
      if(validation[0].message !="" && allOk){
        showMessage(validation[0].message)
        allOk = false
      }
    })
    return allOk
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = [];

    //Validaciones
    if(!allValidationOk()){
      return false
    }
    // console.log(rutValidation)
    // console.log(nombreValidation)
    console.log("all ok")

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

      const usuario = {
        nombres: stateNombre[0],
        apellidos: stateApellido[0],
        correo: correo,
        direccion: direccion,
        telefono: telefono,
        region: selectedRegion.toString(),
        comuna: selectedComuna,
        codigoPostal: codigoPostal,
        rut: stateRut[0],
    
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
        // setNombre("");
        // setApellido("");
        // setCorreo("");
        // setTelefono("");
        // setDireccion("");
        // setSelectedRegion("");
        // setSelectedComuna("");
        // setSelectedRol("");
        // setCodigoPostal("");
        // setRut("");
        // setCodigoUsuario("");
        // setClave("");
        // setRemuneracion("");
        // setCredito("");
        // setErrores({});
       
        setUserId(null);

        setTimeout(() => {
          onClose();
        }, 3000);
       
      }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const handleNumericKeyDown = (event) => {
    if(event.key == "Tab"){
      return
    }
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
    if(event.key == "Tab"){
      return
    }
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
  

  const handleTextOnlyKeyDown = (event) => {
    if(event.key == "Tab"){
      return
    }
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
              <InputRutUsuario 
                inputState={stateRut}
                validationState={validators.stateRutValidation}
                required={true}
                autoFocus={true}
              />
              
            </Grid>
            <Grid item xs={12} md={4}>
              <InputName
                inputState={stateNombre}
                fieldName="nombre"
                required={true}
                validationState={validators.stateNombreValidation}
              />

            </Grid>
            <Grid item xs={12} md={4}>

            <InputName
              inputState={stateApellido}
              required={true}
              fieldName="apellido"
              validationState={validators.stateApellidoValidation}
            />

            </Grid>
            <Grid item xs={12} md={4}>


            <InputEmail
              inputState={stateCorreo}
              required={true}
              fieldName="correo"
              validationState={validators.stateCorreoValidation}
            />

            </Grid>
            <Grid item xs={12} md={4}>
            <InputPhone
              inputState={statePhone}
              required={true}
              fieldName="telefono"
              validationState={validators.statePhoneValidation}
            />


              
            </Grid>
            <Grid item xs={12} md={4}>

            <InputNumber
              inputState={stateUserCode}
              required={true}
              fieldName="codigoUsuario"
              label="Codigo usuario"
              validationState={validators.stateUserCodeValidation}
            />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputName
                inputState={stateDireccion}
                fieldName="direccion"
                required={true}
                maxLength={30}
                validationState={validators.stateDireccionValidation}
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
              <InputNumber
                inputState={statePostalCode}
                required={true}
                fieldName="codigoPostal"
                label="Codigo Postal"
                validationState={validators.statePostalCodeValidation}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputPassword
                inputState={stateClave}
                fieldName="clave"
                required={true}
                maxLength={30}
                validationState={validators.stateClaveValidation}
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

              <SelectList
                inputState={stateRemuneracionTipo}
                selectItems={[
                  "Diario",
                  "Semanal",
                  "Mensual",
                ]}
                fieldName="remuneracion"
                required={true}
                validationState={validators.stateRemuneracionTipoValidation}
              />



            </Grid>
            <Grid item xs={12} md={4}>
              <InputNumber
                inputState={stateCredit}
                required={true}
                fieldName="credito"
                validationState={validators.stateCreditValidation}
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
