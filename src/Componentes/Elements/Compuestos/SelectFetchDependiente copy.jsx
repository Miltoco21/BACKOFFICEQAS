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
import System from "../../../Helpers/System";


const SelectFetchDependiente = ({
  inputState,
  inputOtherState,
  validationState,
  fetchFunction,
  fetchDataShow,
  fetchDataId,
  onFinishFetch = ()=>{},

  withLabel = true,
  autoFocus = false,
  fieldName = "select",
  label = fieldName[0].toUpperCase() + fieldName.substr(1),
  required = false,
  vars = null
}) => {

  const {
    showMessage
  } = useContext(SelectedOptionsContext);

  const [selectList, setSelectList] = useState([])
  const [selected, setSelected] = useState(-1)
  const [selectedOther, setSelectedOther] = inputOtherState
  
  const [selectedOriginal, setSelectedOriginal] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")
  const [validation, setValidation] = validationState ? validationState : vars ? vars[1][fieldName] : useState(null)
  
  const [needLoadList, setNeedLoadList] = useState(false)
  
  const [cambioAlgunaVez, setCambioAlgunaVez] = useState(false)

  const validate = () => {
    // console.log("validate de:" + fieldName)
    // const len = selected.length
    // console.log("len:", len)
    // const reqOk = (!required || (required && len > 0))
    const empty = (selected == "" || selected == null || selected == -1)
    const reqOk = !required || (required && !empty)


    var message = ""
    if (!reqOk) {
      message = fieldName + ": es requerido."
    }

    const vl = {
      "require": !reqOk,
      "empty": empty,
      "allOk": (reqOk),
      "message": message
    }
    // console.log("la validacion de ", fieldName, '.. es', vl)
    setValidation(vl)
  }

  const checkChange = (event) => {
    setSelected(event.target.value)
    setSelectedOriginal(event.target.value)
  }
  const checkChangeBlur = (event) => {

  }

  const loadList = async () => {
    // console.log("loadList de ", label)
    setNeedLoadList(false)
    if (selectedOther < 1) {
      // console.log("sale por que region es incorrecto")
      return
    }
    // console.log("loadList2 de ", label)
    // console.log("loadList  de ", label)
    // Comuna.getInstance().findByRegion(selectedOther, (comunas) => {
    fetchFunction((fetchData) => {
      // console.log("loadList3 de ", label)
      // console.log("selectedOther",selectedOther)
      // console.log("fetchData",fetchData)
      setSelectList(fetchData)

      onFinishFetch()
    }, (error) => {
      console.log(error)
      // console.log("loadList4 de ", label)
    })

    // console.log("loadList5 de ", label)
  }

  const setByString = (valueString) => {
    var finded = false
    selectList.forEach((comuna) => {
      if (comuna.comunaNombre == valueString) {
        setSelected(comuna.id)
        setSelectedOriginal(comuna.id)
        finded = true
      }
    })

    // console.log( (finded ? "Se" : "No se" ) + " encontro")
  }

  // useEffect(() => {
  //   console.log("cambio selectedOriginal de ", label, ' a el valor ', selectedOriginal)
  // },[selectedOriginal])

  useEffect(() => {
    // console.log("")

    validate()
    setSelected(-1)
    // console.log(inputOtherState)
    // console.log("carga inicial comuna")
  }, [])

  useEffect(() => {
    // console.log("")
    // console.log("selectedOther es:", (selectedOther + ""))
    // console.log("selectedOther !isNaN(" + selectedOther + "):", !isNaN(selectedOther) )
    if (selectedOther !== -1 && !isNaN(selectedOther)) {
      // console.log("selectedOther entra en el if")
      setSelected(-1)
      setSelectList([])
      setNeedLoadList(true)
    }

  }, [selectedOther])


  useEffect(() => {
    // console.log("")
    // console.log("cambio algo de", label)
    // console.log("cambio algo de", label, '..selected',selected)
    // console.log("cambio algo de", label, '..selectedOriginal',selectedOriginal)
    // console.log("cambio algo de", label, '..selectList',selectList)
    // console.log("cambio algo de", label, '..selectList.length',selectList.length)
    // console.log("cambio algo de", label, '..isNaN(selectedOther)',isNaN(selectedOther))


    if (isNaN(selectedOther)) return
    if (selected === -1 && selectList.length === 0) {
      // console.log("debe cargar")
      setNeedLoadList(true)

      // console.log("cambio algo de", label, '..entra 1')
    }
    
    if (selectList.length > 0 && selectedOriginal !== "" && selected === -1 && !cambioAlgunaVez) {
      // console.log("cambio algo de", label, '..entra 2')
      if (Validator.isNumeric(selectedOriginal)) {
        // console.log("cambio algo de", label, '..entra 3')
        // console.log("todo numero..")
        setSelected(selectedOriginal)
      } else {
        // console.log("cambio algo de", label, '..entra 4')
        // console.log("no es todo numero..")
        // console.log("carga original",selectedOriginal)
        setByString(selectedOriginal)
      }
    } else {
      // console.log("cambio algo de", label, '..entra 5')
      validate()
    }
    // console.log("selected es:", selected)
  }, [selected, selectList.length])


  useEffect(() => {
    // console.log("cambio needLoadList", needLoadList)
    // console.log("cambio fetchDataShow", fetchDataShow)
    // console.log("cambio fetchDataId", fetchDataId)
    // console.log("cambio fetchFunction", fetchFunction)
    if (fetchDataShow && fetchDataId && needLoadList && fetchFunction) {
      loadList()
    }
  }, [fetchFunction, fetchDataShow, fetchDataId, needLoadList])



  useEffect(() => {
    // console.log("cambio selected de", label, " al valor ", selected)
    if(selected != -1) setCambioAlgunaVez(true)
  }, [selected])


  return (
    <>
      {withLabel && (
        <InputLabel sx={{ marginBottom: "2%" }}>
          {label}
        </InputLabel>
      )}


      <Select
        sx={{
          marginTop: "17px"
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

        {selectList.map((selectOption, ix) => (
          <MenuItem
            key={ix}
            value={selectOption[fetchDataId]}
          >
            {selectOption[fetchDataShow]}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default SelectFetchDependiente;
