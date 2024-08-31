import React, { useState, useContext, useEffect } from "react";

import {
  TextField,
  InputAdornment,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import ModelConfig from "../../../Models/ModelConfig";
import { Check, Dangerous } from "@mui/icons-material";
import User from "../../../Models/User";
import Validator from "../../../Helpers/Validator";
import axios from "axios";


const SelectUserRoles = ({
    inputState,
    validationState,
    withLabel = true,
    autoFocus = false,
    fieldName="select",
    label = fieldName[0].toUpperCase() + fieldName.substr(1),
    required = false
  }) => {

    const {
      showMessage
    } = useContext(SelectedOptionsContext);

    const apiUrl = ModelConfig.get().urlBase;
    
    const [selectList, setSelectList] = useState([])
    const [selected, setSelected] = inputState
    const [validation, setValidation] = validationState

  const validate = ()=>{
    // console.log("validate de:" + fieldName)
    // const len = selected.length
    // console.log("len:", len)
    // const reqOk = (!required || (required && len > 0))
    const empty = (selected == "" || selected == null || selected ==-1)
    const reqOk = !required || (required && !empty)
    

    var message = ""
    if(!reqOk){
      message = fieldName + ": es requerido."
    }

    const vl = {
      "require": !reqOk,
      "empty": empty,
      "allOk" : (reqOk),
      "message" : message
    }
    // console.log("vale:", vl)
    setValidation(vl)
  }
  
  const checkChange = (event)=>{
    setSelected(event.target.value)
  }
  
  const checkChangeBlur = (event)=>{
    
  }

  const loadList = async()=>{
    try {
      const response = await axios.get(
        apiUrl + `/Usuarios/GetAllRolUsuario`
      );
      setSelectList(response.data.usuarios);
      // console.log("ROLES", response.data.usuarios);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    validate()
    setSelected(-1)
    loadList()
  },[])

  useEffect(()=>{
    validate()
    
    // console.log("selected es:", selected)
  },[selected])

  return (
    <>
      {withLabel && (
      <InputLabel sx={{ marginBottom: "2%" }}>
        {label}
      </InputLabel>
      )}
    

      <Select
      sx={{
        marginTop:"17px"
      }}
        fullWidth
        autoFocus={autoFocus}
        required={required}
        label={label}
        value={selected !== "" ? selected : -1}
        onChange={checkChange}
      >
        <MenuItem
          key={-1}
          value={-1}
        >
          SELECCIONAR
        </MenuItem>

        {selectList.map((selectOption,ix) => (
          <MenuItem
            key={ix}
            value={selectOption.idRol}
          >
            {selectOption.rol}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default SelectUserRoles;
