import React, { useContext, useState, useEffect } from "react";
import {
  Button
} from "@mui/material";

// OptionType {
//   id:String,
//   value:String
// }

const SelectButtonList = ({ 
  optionSelected,
  setOptionSelected,
  options = [],
  idName = "id",
  valueName = "value"
}) => {
  return (
          <table>
            <tbody>
            <tr>

              {options.map((option,ix)=>{
                // console.log("map de options")
                // console.log("option", option)
                // console.log("optionSelected", optionSelected)
                // console.log("coincide con el select?",(optionSelected === option.id ? "si" : "no"))
                return(
                  <td key={ix} ><Button
                  id={`${ix}-btn`}
                  sx={{ height: "60px" }}
                  fullWidth
                  variant={optionSelected == option[idName] ? "contained" : "outlined"}
                  onClick={() => setOptionSelected(option[idName])}
                  >
                {option[valueName]}
              </Button></td>  
              )
            })}

              
            </tr>
            </tbody>
          </table>
  );
};

export default SelectButtonList;
