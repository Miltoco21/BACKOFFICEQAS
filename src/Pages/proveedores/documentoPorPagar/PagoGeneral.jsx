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
import System from "../../../Helpers/System";


const PagoGeneral = ({
  openPagar,
  handlePagarClose,
  groupedProveedores,
  allSelected,
  handleSelectAll,
  handleSelectOne,
  selectedTotal,
  selectedIds,
  handleOpenGroupPaymentProcess
}) => {


  return (
    <Dialog
      open={openPagar}
      onClose={handlePagarClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Pagos del Proveedor</DialogTitle>
      <DialogContent dividers>
        {groupedProveedores.length > 0 && (
          <div>
            <Typography variant="h6">
              Proveedor: {groupedProveedores[0].razonSocial}
            </Typography>
            <Typography variant="subtitle1">
              RUT: {groupedProveedores[0].rut}
            </Typography>
            <Typography variant="h6" style={{ marginTop: "16px" }}>
              Compras:
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedIds.length > 0 &&
                          selectedIds.length < groupedProveedores.length
                        }
                        checked={allSelected}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Tipo Documento</TableCell>
                    <TableCell>Folio</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedProveedores.map((proveedor) => (
                    <TableRow key={proveedor.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedIds.includes(proveedor.id)}
                          onChange={(event) =>
                            handleSelectOne(event, proveedor.id)
                          }
                        />
                      </TableCell>
                      <TableCell>{proveedor.tipoDocumento}</TableCell>
                      <TableCell>{proveedor.folio}</TableCell>
                      <TableCell>
                        {dayjs(proveedor.fechaIngreso).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell> ${System.formatMonedaLocal(proveedor.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography variant="h6">
                Total Deuda : ${System.formatMonedaLocal(selectedTotal)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                disabled={selectedTotal <= 0}
                onClick={() => handleOpenGroupPaymentProcess()}
              >
                Pagar Total ${System.formatMonedaLocal(selectedTotal)}
              </Button>
            </Box>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePagarClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PagoGeneral;
