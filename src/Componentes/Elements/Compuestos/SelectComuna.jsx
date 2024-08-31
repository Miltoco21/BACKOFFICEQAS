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
import Region from "../../../Models/Region";
import Comuna from "../../../Models/Comuna";


const SelectComuna = ({
    inputState,
    inputRegionState,
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

    const [selectList, setSelectList] = useState([])
    const [selected, setSelected] = inputState
    const [selectedRegion, setSelectedRegion] = inputRegionState
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
    if(selectedRegion <1)return
    // console.log("loadList comuna")
    Comuna.getInstance().findByRegion(selectedRegion,(comunas)=>{
      setSelectList(comunas)
    },(error)=>{
      console.log(error)
    })
    
  }

  useEffect(()=>{
    validate()
    setSelected(-1)
  },[])
  
  useEffect(()=>{
    // console.log("selectedregion es:", selectedRegion)
    loadList()
  },[selectedRegion])
  
  useEffect(()=>{
    validate()
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
            value={selectOption.id}
          >
            {selectOption.comunaNombre}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default SelectComuna;
