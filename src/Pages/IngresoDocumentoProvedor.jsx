import React, { useState, useEffect, useContext } from "react";
import {
  Paper,
  Grid,
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  ListItem,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputLabel,
  Alert,
  Snackbar,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  DialogActions,
  Tooltip,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import SideBar from "../Componentes/NavBar/SideBar";
import Add from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchListDocumento from "./../Componentes/SearchlistDocumento/SearchListDocumento";
import ModelConfig from "../Models/ModelConfig";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import Product from "../Models/Product";
import Proveedor from "../Models/Proveedor";
import { SelectedOptionsContext } from "./../Componentes/Context/SelectedOptionsProvider";
import Validator from "../Helpers/Validator";
import BoxSelectTipo from "../Componentes/Proveedores/BoxSelectTipo";
import PreciosGeneralesProducItem from "../Componentes/Card-Modal/PreciosGeneralesProducItem";
import AjustePrecios from "../Componentes/ScreenDialog/AjustePrecios";
import System from "../Helpers/System";
import IngresoDocProvBuscarProductos from "./IngresoDocProvBuscarProductos";
import CrearProducto from "./CrearProducto";
import StepperSI from "../Componentes/Stepper/StepperSI";
import IngresoDocCompra from "./IngresoDocCompra";

const IngresoDocumentoProveedor = () => {
  const [showIngresoDocCompra, setShowIngresoDocCompra] = useState(false);

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{ my: 1, mx: 2 }}
          startIcon={<Add />}
          onClick={()=>setShowIngresoDocCompra(true)}
        >
          Ingresa Documento de Compra
        </Button>

        <SearchListDocumento />

        {showIngresoDocCompra && (
          <IngresoDocCompra
            openDialog={showIngresoDocCompra}
            setOpenDialog={setShowIngresoDocCompra}
            onClose={()=>{}}
            onFinish={()=>{}} />
        )}
        


        
       
      </Box>
    </div>
  );
};

export default IngresoDocumentoProveedor;
