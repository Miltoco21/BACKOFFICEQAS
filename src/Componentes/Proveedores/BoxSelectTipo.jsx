import React, { useContext, useState, useEffect } from "react";
import {
  Button
} from "@mui/material";

const BoxSelectTipo = ({ 
  tipoElegido,
  setTipoElegido,
}) => {
  return (
          <table>
            <tbody>
            <tr>
                <td><Button
                sx={{ height: "60px" }}
                fullWidth
                variant={tipoElegido === 0 ? "contained" : "outlined"}
                onClick={() => {setTipoElegido(0)}}
                >
                Cod prov.
              </Button></td>

              <td>
              <Button
                sx={{ height: "60px" }}
                variant={tipoElegido === 1 ? "contained" : "outlined"}
                onClick={() => {setTipoElegido(1)}}
                fullWidth
              >
                Desc Prov
              </Button>
              </td>

              <td>
              <Button
                sx={{ height: "60px" }}
                variant={tipoElegido === 2 ? "contained" : "outlined"}
                onClick={() => {setTipoElegido(2)}}
                fullWidth
              >
                Cod Barras
              </Button>
              </td>

              <td>
              <Button
                sx={{ height: "60px" }}
                variant={tipoElegido === 3 ? "contained" : "outlined"}
                onClick={() => {setTipoElegido(3)}}
                fullWidth
              >
                Descripcion
              </Button>
              </td>
              
            </tr>
            </tbody>
          </table>
  );
};

export default BoxSelectTipo;
