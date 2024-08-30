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
import System from "../../../Helpers/System";


const InputRut = ({
    inputState,
    validationState,
    withLabel = true,
    autoFocus = false,
    minLength = null,
    maxLength = null,
    label = "Rut",
    fieldName="rut",
    required = false

  }) => {

  const {
    showMessage
  } = useContext(SelectedOptionsContext);
  
  const [rut, setRut] = inputState
  const [validation, setValidation] = validationState

  const [rutOk, setRutOk] = useState(null);

  const validateRut = (event) => {
    if(!Validator.isRut(event.target.value)){
      console.log("no es valido")
      return false
    }

    setRut(event.target.value)
  };

  useEffect(()=>{
    validate()
  },[])


  useEffect(()=>{
    validate()
  },[rutOk, rut])

  useEffect(()=>{
    setRutOk(null)
  },[rut])

  const validate = ()=>{
    // console.log("validate de:" + fieldName)
    const len = rut.trim().length
    const reqOk = ( !required  || (required && len > 0))
    const uniqueOk = rutOk === true
    const formatOk = Validator.isRutChileno(rut)

    var badMinlength = false
    var badMaxlength = false

    if(minLength && len < minLength){
      badMinlength = true
    }

    if(maxLength && len > maxLength){
      badMaxlength = true
    }

    var message = ""
    if(!reqOk){
      message = fieldName + ": es requerido."
    }else if(badMinlength){
      message = fieldName + ": debe tener " + minLength + " caracteres o mas."
    }else if(badMaxlength){
      message = fieldName + ": debe tener " + maxLength + " caracteres o menos."
    }else if(!uniqueOk){
      message = fieldName + ": Ya existe. Ingrese otro."
    }else if(!formatOk){
      message = fieldName + ": El formato es incorrecto."
    }

    const vl = {
      "empty": len == 0,
      "badMinlength": badMinlength,
      "badMaxlength": badMaxlength,
      "unique": uniqueOk,
      "require": !reqOk,
      "format" : formatOk,
      "allOk" : (reqOk && uniqueOk && badMinlength && badMaxlength && formatOk),
      "message" : message
    }
    // console.log("vle:", vl)
    setValidation(vl)
  }
  const checkUnique = ()=>{
    // console.log("checkUnique")
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
        // showMessage("Rut disponible")
        setRutOk(true)
      }
    })
  }

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
      // label="ej: 11111111-1"
      label={label}
      autoFocus={autoFocus}
      value={rut}
      type="text"
      required={required}
      onChange={validateRut}
      onBlur={checkUnique}

      InputProps={
        rut.length>0 && {
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
