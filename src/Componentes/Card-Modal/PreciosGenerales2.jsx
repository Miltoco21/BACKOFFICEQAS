import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  InputLabel,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ModelConfig from "../../Models/ModelConfig";
import { AttachMoney, Percent } from "@mui/icons-material";
import PreciosGeneralesProducItem from "./PreciosGeneralesProducItem";
import Product from "../../Models/Product";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import dayjs from "dayjs";

export const defaultTheme = createTheme();

const PreciosGenerales2 = ({ 
  products,
  setProducts
 }) => {
  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  return (
    <Table>
      <TableBody>
        { (products.length <= 0) ? (
          <TableRow>
            <TableCell colSpan={20}>No se encontraron productos</TableCell>
          </TableRow>
        ) : (
          products.map((product, index) => (
            <PreciosGeneralesProducItem 
            producto={product} 
            key={index} 
            index={index} 
            setProducts={setProducts}
            onUpdatedOk={()=>{
              showMessage("Precio editado exitosamente");
            }}
            onUpdatedWrong={(error)=>{
              console.error("Error al actualizar el producto:", error);
              showMessage("Error al actualizar el producto");
            }}
            />
          ))

        )}
      </TableBody>
    </Table>
  );
};

export default PreciosGenerales2;
