import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  Button,
  Snackbar,
  FormControl,
  Table,
  TableBody,
  CircularProgress,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SideBar from "../Componentes/NavBar/SideBar";
import axios from "axios";
import ModelConfig from "../Models/ModelConfig";
import dayjs from "dayjs";
import BoxSelectList from "../Componentes/Proveedores/BoxSelectList";
import ReporteVenta from "../Models/ReporteVenta";
import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";
import Sale from "../Models/Sale";
import System from "../Helpers/System";

const RankingLibroVentasDetalle = ({
  openDialog,
  onClose,
  selectedProduct,
  handleBorradoLogico
}) => {
  return (
    <Dialog
        open={openDialog}
        onClose={onClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Detalles</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "gainsboro" }}>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Folio Documento</TableCell>
                      <TableCell>Método de Pago</TableCell>

                      <TableCell>rdcTransactionId </TableCell>

                      <TableCell>Valor Neto</TableCell>
                      <TableCell>IVA DF</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>

                    {selectedProduct && selectedProduct.pagos.map((pago,ix)=>(
                    <TableRow key={ix}>
                      <TableCell>
                        {System.formatDateServer(pago.fechaIngreso)}
                      </TableCell>
                      <TableCell>
                        {pago.descripcionComprobante}
                      </TableCell>
                      <TableCell>
                        {pago.nroComprobante.toLocaleString("es-CL")}
                      </TableCell>
                      <TableCell>
                        {pago.metodoPago.toLocaleString("es-CL")}
                      </TableCell>
                      <TableCell>
                        {pago.rdcTransactionId.toLocaleString(
                          "es-CL"
                        )}
                      </TableCell>

                      <TableCell>
                        {pago.montoNeto.toLocaleString("es-CL")}
                      </TableCell>
                      <TableCell>
                        {pago.montoIVA.toLocaleString("es-CL")}
                      </TableCell>
                      <TableCell>
                        {pago.total.toLocaleString("es-CL")}
                      </TableCell>
                    </TableRow>
                    ))}

                  </TableBody>
                </Table>
              </TableContainer>
              Datos de Productos
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "gainsboro" }}>
                      <TableCell>Código Producto</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Precio Unidad</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Costo</TableCell>
                      <TableCell>Precio</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedProduct.ventaDetalleReportes.map(
                      (detalle, index) => (
                        <TableRow key={index}>
                          <TableCell>{detalle.codProducto}</TableCell>
                          <TableCell>{detalle.descripcion}</TableCell>
                          <TableCell>
                            {detalle.precioUnidad.toLocaleString("es-CL")}
                          </TableCell>
                          <TableCell>
                            {detalle.cantidad.toLocaleString("es-CL")}
                          </TableCell>
                          <TableCell>
                            {detalle.costo.toLocaleString("es-CL")}
                          </TableCell>
                          <TableCell>
                            {detalle.precioUnidad.toLocaleString("es-CL")}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button sx={{
            backgroundColor:"#ee0000",
            color:"#f0f0f0",
            "&:hover":{
              backgroundColor:"#FD2020",
              color:"#fff"
            }
          }} onClick={handleBorradoLogico}>
            Borrado logico
          </Button>

          <Button onClick={onClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default RankingLibroVentasDetalle;
