import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Settings, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ModelConfig from "../Models/ModelConfig";
import dayjs from "dayjs";
import ScreenDialogConfig from "../Componentes/ScreenDialog/AdminConfig";
import System from "../Helpers/System";
import User from "../Models/User";

const Login = ({ setUserData }) => {
  const apiUrl = ModelConfig.get().urlBase ?? "https://www.easypos.somee.com/api";

  const [rutOrCode, setRutOrCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showScreenConfig, setShowScreenConfig] = useState(false);

  const [footerTextSupport, setFooterTextSupport] = useState("Version 1.0.0");
  
  useEffect(() => {
      var dateTimeNow = dayjs().format('DD/MM/YYYY - HH:mm:ss')
      setFooterTextSupport(System.getInstance().getAppName() + " - " + dateTimeNow)
  },[])




  useEffect(() => {
    ModelConfig.getInstance().getFirst()
  },[])
  useEffect(() => {
    // Verificar si hay datos en sessionStorage y redirigir a /home si existen
    const userData = sessionStorage.getItem("userData");
    if (userData) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      if (!rutOrCode || !password) {
        setError("Por favor, completa ambos campos.");
        return;
      }
      setLoading(true);

      const response = await axios.post(`${apiUrl}/Usuarios/LoginUsuario`, {
        codigoUsuario: 0,
        rut: rutOrCode,
        clave: password,
      });

      if (response.data.responseUsuario && response.data.responseUsuario.codigoUsuario !== -1) {
        const userOk = response.data.responseUsuario
        setUserData(userOk);
        console.log(userOk);
        // Guardar datos en sessionStorage
        const userOkStr = JSON.stringify(userOk)
        sessionStorage.setItem(
          "userData",
          userOkStr
        );

        User.getInstance().saveInSesion(userOk)

        navigate("/home");
      } else if (response.data.responseUsuario.codigoUsuario === -1) {
        setError("Usuario no encontrado. Verifica tus credenciales.");
      } else {
        setError("Error de inicio de sesión. Verifica tus credenciales.");
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
      setError(
        "Error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Iniciar sesión
        </Typography>
        {error && (
          <Typography sx={{ color: "red", marginTop: 2 }}>{error}</Typography>
        )}
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Código o Rut"
            autoFocus
            value={rutOrCode}
            onChange={(e) => setRutOrCode(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Clave"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress
                  color="inherit"
                  size={20}
                  sx={{ marginRight: 1 }}
                />
                Ingresando
              </Box>
            ) : (
              "Iniciar sesión"
            )}
          </Button>

          <Typography component="h4" style={{
            position:"fixed",
            bottom:0
          }}>
          <p>
            {footerTextSupport}
            <IconButton
            onClick={()=>{ setShowScreenConfig(true) }} 
            edge="end"
            >
            <Settings />
            </IconButton>
          </p>

          </Typography>

          <ScreenDialogConfig openDialog={showScreenConfig} setOpenDialog={setShowScreenConfig} />
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
