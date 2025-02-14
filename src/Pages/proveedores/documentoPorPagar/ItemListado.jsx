import React, { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Avatar,
  TextField,
  CircularProgress,
  Snackbar,
  Checkbox,
  IconButton,
  Collapse,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SideBar from "../../../Componentes/NavBar/SideBar";
import axios from "axios";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ModelConfig from "../../../Models/ModelConfig";
import User from "../../../Models/User";
import PagoTransferencia from "../../../Componentes/ScreenDialog/PagoTransferencia";
import PagoCheque from "../../../Componentes/ScreenDialog/PagoCheque";
import PagoParcial from "../../../Componentes/ScreenDialog/PagoParcial";
import TablaDetalles from "./ItemTablaDetalles";
import System from "../../../Helpers/System";
import ItemTablaModalDetalle from "./ItemTablaModalDetalle";


const ItemListado = ({
  rut,
  groupedData,
  order,
  handleSort,
  sortData,
  handleDetailOpen,
  handlePagarOpen,

  handleOpenPaymentProcess
  
}) => {

  const [verDetalles, setVerDetalles] = useState(false);
  

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton onClick={() => { setVerDetalles(!verDetalles) }}>
            {verDetalles ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </IconButton>
        </TableCell>
        <TableCell>{rut}</TableCell>
        <TableCell>
          <strong>{groupedData[rut][0].razonSocial}</strong>
        </TableCell>
        <TableCell>
          Facturas:{" "}
          {
            groupedData[rut].filter(
              (item) => item.tipoDocumento === "Factura"
            ).length
          }
          <br />
          Boletas:{" "}
          {
            groupedData[rut].filter(
              (item) => item.tipoDocumento === "Boleta"
            ).length
          }
          <br />
          Tickets:{" "}
          {
            groupedData[rut].filter(
              (item) => item.tipoDocumento === "Ticket"
            ).length
          }
          <br />
          Ingreso Interno:{" "}
          {
            groupedData[rut].filter(
              (item) => item.tipoDocumento === "Ingreso Interno"
            ).length
          }
        </TableCell>
        <TableCell>
          $
          {System.formatMonedaLocal(groupedData[rut]
            .reduce((sum, item) => sum + item.total, 0))}
        </TableCell>
        <TableCell>
          <Button
            sx={{ width: "80%" }}
            variant="contained"
            color="secondary"
            onClick={() => handlePagarOpen(rut)}
          >
            Pagar
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          colSpan={6}
          style={{ paddingBottom: 0, paddingTop: 0 }}
        >
          <Collapse
            in={verDetalles}
            timeout="auto"
            unmountOnExit
          >
            <Box margin={1}>

              <TablaDetalles
                order={order}
                handleSort={handleSort}
                sortData={sortData}
                groupedData={groupedData}
                rut={rut}
                handleOpenPaymentProcess={handleOpenPaymentProcess}
              />

            </Box>
          </Collapse>

        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default ItemListado;
