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


const InputNombrePersona = ({
    nombreState,
    validationState,
    withLabel = true,
    autoFocus = false,
    fieldName="nombre",
    label = fieldName[0].toUpperCase() + fieldName.substr(1),
    minLength = null,
    maxLength = null,
    required = false
  }) => {

    const {
      showMessage
    } = useContext(SelectedOptionsContext);
    
    const [nombre, setNombre] = nombreState
    const [validation, setValidation] = validationState

  const validate = ()=>{
    // console.log("validate de:" + fieldName)
    const len = nombre.length
    const reqOk = (!required || (required && len > 0))
    var badMinlength = false
    var badMaxlength = false

    if(minLength && minLength < len){
      badMinlength = true
    }

    if(maxLength && maxLength > len){
      badMaxlength = true
    }

    var message = ""
    if(!reqOk){
      message = fieldName + ": es requerido."
    }else if(badMinlength){
      message = fieldName + ": debe tener " + minLength + " caracteres o mas."
    }else if(badMaxlength){
      message = fieldName + ": debe tener " + minLength + " caracteres o menos."
    }

    const vl = {
      "empty": len == 0,
      "badMinlength": badMinlength,
      "badMaxlength": badMaxlength,
      "require": !reqOk,
      "empty": len == 0,
      "allOk" : (reqOk && !badMinlength && !badMaxlength),
      "message" : message
    }
    // console.log("vale:", vl)
    setValidation(vl)
  }
  
  const checkKeyDown = (event)=>{
    if(event.key == "Enter"){

    }
  }

  const checkChange = (event)=>{
    const value = event.target.value
    if(value == " "){
      showMessage("Valor erroneo")
      return false
    }
    if(Validator.isNombre(value)){
      console.log(value + " es valido")
      setNombre(value);
    }else{
      // console.log("es incorrecta")
      showMessage("Valor erroneo")
    }
  }
  
  const checkChangeBlur = (event)=>{
    if(nombre.substr(-1) == " "){
      setNombre(nombre.trim())
    }
  }

  useEffect(()=>{
    // console.log("cambio nombreState")
    // console.log(nombreState)
    validate()
  },[])


  useEffect(()=>{
    // console.log("cambio nombre")
    // console.log(nombre)
    validate()
  },[nombre])

  return (
    <>
      {withLabel && (
      <InputLabel sx={{ marginBottom: "2%" }}>
        {label}
      </InputLabel>
      )}
      <TextField
        fullWidth
        autoFocus={autoFocus}
        margin="normal"
        required={required}
        type="text"
        label={label}
        autoComplete={false}
        value={nombre}
        onChange={checkChange}
        onBlur={checkChangeBlur}
        onKeyDown={checkKeyDown}
      />
    </>
  );
};

export default InputNombrePersona;
