import React, { useState, useEffect } from "react";
import {
  InputLabel,
  Select,
  MenuItem,
  FormControl
} from "@mui/material";

const SelectListUnits = ({
  inputState,
  validationState,
  withLabel = true,
  autoFocus = false,
  fieldName = "unidad",
  label = "Unidad de peso",
  required = false,
  styles = {}
}) => {
  const [selected, setSelected] = inputState;
  const [validation, setValidation] = validationState;
  
  // Definición de unidades de peso soportadas
  const units = [
    { id: "kg", name: "Kilogramos (kg)", symbol: "kg" },
    { id: "lb", name: "Libras (lb)", symbol: "lb" },
    { id: "g", name: "Gramos (g)", symbol: "g" },
    { id: "oz", name: "Onzas (oz)", symbol: "oz" },
    { id: "ton", name: "Toneladas (ton)", symbol: "ton" },
    { id: "mg", name: "Miligramos (mg)", symbol: "mg" },
  ];

  const validate = () => {
    const empty = !selected || selected === "";
    const reqOk = !required || (required && !empty);

    const vl = {
      require: !reqOk,
      empty: empty,
      allOk: reqOk,
      message: empty ? `${label} es requerido` : ""
    };
    
    setValidation(vl);
    return vl.allOk;
  };

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  useEffect(() => {
    validate();
  }, [selected]);

  return (
    <FormControl fullWidth>
      {withLabel && (
        <InputLabel sx={{ marginBottom: "5px" }}>
          {label} {required && "*"}
        </InputLabel>
      )}
      
      <Select
        sx={{
          marginTop: "17px",
          ...styles
        }}
        fullWidth
        autoFocus={autoFocus}
        required={required}
        value={selected || ""}
        onChange={handleChange}
        //error={validation && !validation.allOk}
      >
        <MenuItem value="">
          <em>Seleccionar unidad</em>
        </MenuItem>
        
        {units.map((unit) => (
          <MenuItem 
            key={unit.id} 
            value={unit.id}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <span style={{ marginRight: '8px' }}>{unit.symbol}</span>
            <span style={{ opacity: 0.7 }}>{unit.name}</span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectListUnits;