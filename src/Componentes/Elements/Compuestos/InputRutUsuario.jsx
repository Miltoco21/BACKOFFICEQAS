import React, { useState, useContext, useEffect } from "react";

import {
  TextField,
  InputAdornment,
  InputLabel
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import ModelConfig from "../../../Models/ModelConfig";
import { Check, Dangerous } from "@mui/icons-material";
import User from "../../../Models/User";
import Validator from "../../../Helpers/Validator";


const InputRut = ({
    rutStateControl,
    withLabel = true,
    autoFocus = true
  }) => {

    const {
      showMessage
    } = useContext(SelectedOptionsContext);
    
    const [rut, setRut] = rutStateControl
    const [rutOk, setRutOk] = useState(null);
  
    const validateRut = (event) => {
      if(!Validator.isRut(event.target.value)){
        console.log("no es valido")
        return false
      }

      setRut(event.target.value)
    };

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
    


  useEffect(()=>{
    console.log("cambio rutOk")
    console.log(rutOk)

  },[rutOk])
  

  useEffect(()=>{
  },[])

  return (
    <>
    {withLabel && (
      <InputLabel sx={{ marginBottom: "2%", }}>
        Ingresar RUT sin puntos y con gui&oacute;n
      </InputLabel>
    )}
    <TextField
      fullWidth
      margin="normal"
      label="ej: 11111111-1"
      autoFocus={autoFocus}
      value={rut}
      onChange={validateRut}
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
    </>
  );
};

export default InputRut;
