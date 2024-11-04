import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Typography,
  DialogTitle,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import ModelConfig from "../../Models/ModelConfig";
import System from "../../Helpers/System";

var prods = [];
for (let index = 1; index <= 5; index++) {
  prods.push(index);
}

const DialogReporteCierreZ = ({
  openDialog,
  setOpenDialog,

  info
}) => {

  const [totalVentas,setTotalVentas] = useState(0)
  const [totalEfectivo,setTotalEfectivo] = useState(0)
  const [totalCredito,setTotalCredito] = useState(0)
  const [totalDebito,setTotalDebito] = useState(0)
  const [totalTransferencias,setTotalTransferencias] = useState(0)
  const [totalCheques,setTotalCheques] = useState(0)
  
  const [totalApertura,setTotalApertura] = useState(0)

  const [cantEfectivo,setCantEfectivo] = useState(0)
  const [cantCredito,setCantCredito] = useState(0)
  const [cantDebito,setCantDebito] = useState(0)
  const [cantTransferencias,setCantTransferencias] = useState(0)
  const [cantCheques,setCantCheques] = useState(0)


  const analizarInfo = ()=>{

    var totalVentas = 0
    var totalEfectivo = 0
    var totalCredito = 0
    var totalDebito = 0
    var totalTransferencias = 0
    var totalCheques = 0
    var totalInicio = 0

    var cantEfectivo = 0
    var cantCredito = 0
    var cantDebito = 0
    var cantTransferencias = 0
    var cantCheques = 0

      info.cierreCajaDetalles.forEach((detalleInfo,ix)=>{
        if(detalleInfo.detalleMovimientoCaja == "VENTA"){
          switch(detalleInfo.metodoPago){
            case "EFECTIVO":
              totalEfectivo += detalleInfo.monto
              cantEfectivo += 1
            break

            case "DEBITO":
              totalDebito += detalleInfo.monto
              cantDebito += 1
              break
            case "CREDITO":
              totalCredito += detalleInfo.monto
              cantCredito += 1
            break
            case "TRANSFERENCIA":
              totalTransferencias += detalleInfo.monto
              cantTransferencias += 1
            break
            case "CHEQUE":
              totalCheques += detalleInfo.monto
              cantCheques += 1
            break
          }

          totalVentas += detalleInfo.monto
        }else if(detalleInfo.detalleMovimientoCaja == "INICIOCAJA"){
          totalInicio += detalleInfo.monto
        }
    })

    setTotalVentas(totalVentas)
    setTotalEfectivo(totalEfectivo)
    setTotalCredito(totalCredito)
    setTotalDebito(totalDebito)
    setTotalTransferencias(totalTransferencias)
    setTotalCheques(totalCheques)
    setTotalApertura(totalInicio)

    setCantEfectivo(cantEfectivo)
    setCantCredito(cantCredito)
    setCantDebito(cantDebito)
    setCantTransferencias(cantTransferencias)
    setCantCheques(cantCheques)
  }

    
  const styleTitle = {
    fontWeight:"bold",
    color:"white",
    textAlign:"center",
    backgroundColor:"#9A9898"
  }
  const styleHeader = {
    fontWeight:"bold",
    backgroundColor:"#e4e4e4"
  }
  const styleCell = {
    // backgroundColor:"#F0F0F0"
  }

  useEffect(()=>{
    if(!info || info.length < 1) return
    analizarInfo()
  },[])
  
  return info.length>0 ? (<></>) : (
    <Dialog
    open={openDialog}
    onClose={()=>{ setOpenDialog(false) }}
    fullWidth
    maxWidth="sm"
  >
  <DialogTitle>Detalles Reporte cierre z</DialogTitle>
  <DialogContent>

  <TableContainer>
  <Table>
    <TableBody>

      <TableRow>
        <TableCell colSpan={20} sx={styleTitle}>
          Venta total ${totalVentas.toLocaleString()}
        </TableCell>
        </TableRow>


        <TableRow>
        
        <TableCell sx={styleHeader}>
          <Typography>
            Detalle
          </Typography>
        </TableCell>

        <TableCell sx={styleHeader}>
          <Typography>
            total
          </Typography>
        </TableCell>

        <TableCell sx={styleHeader}>
          <Typography>
            Nro Transacciones
          </Typography>
        </TableCell>
        </TableRow>







        <TableRow>
        <TableCell sx={styleCell}>
          <Typography>
            Efectivo
          </Typography>
        </TableCell>

        <TableCell sx={styleCell}>
          <Typography>
            {totalEfectivo.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell sx={styleCell}>
          <Typography>
            {cantEfectivo}
          </Typography>
        </TableCell>
        </TableRow>


        <TableRow>
        <TableCell sx={styleCell}>
          <Typography>
            Debito
          </Typography>
        </TableCell>

        <TableCell sx={styleCell}>
          <Typography>
            {totalDebito.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell sx={styleCell}>
          <Typography>
            {cantDebito}
          </Typography>
        </TableCell>
        </TableRow>

        <TableRow>
        <TableCell sx={styleCell}>
          <Typography>
            Credito
          </Typography>
        </TableCell>

        <TableCell sx={styleCell}>
          <Typography>
            {totalCredito.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell sx={styleCell}>
          <Typography>
            {cantCredito}
          </Typography>
        </TableCell>
        </TableRow>

        <TableRow>
        <TableCell sx={styleCell}>
          <Typography>
            Transferencia
          </Typography>
        </TableCell>

        <TableCell sx={styleCell}>
          <Typography>
            {totalTransferencias.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell sx={styleCell}>
          <Typography>
            {cantTransferencias}
          </Typography>
        </TableCell>
        </TableRow>

        <TableRow>
        <TableCell sx={styleCell}>
          <Typography>
            Cheque
          </Typography>
        </TableCell>

        <TableCell sx={styleCell}>
          <Typography>
            {totalCheques.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell sx={styleCell}>
          <Typography>
            {cantCheques}
          </Typography>
        </TableCell>
        </TableRow>





        <TableRow>
        <TableCell colSpan={20} sx={styleTitle}>
          Arqueo de caja (${info.diferencia.toLocaleString()})
        </TableCell>
        </TableRow>


        <TableRow>
        <TableCell sx={styleHeader}>
          <Typography>
            Apertura Caja
          </Typography>
        </TableCell>

        <TableCell sx={styleHeader}>
          <Typography>
            {totalApertura.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell sx={styleHeader}>
          <Typography>
            { ( totalApertura > 0 ? "+" : "-" ) }
          </Typography>
        </TableCell>
        </TableRow>


        <TableRow>
        <TableCell sx={styleHeader}>
          <Typography>
            Venta Efectivo
          </Typography>
        </TableCell>

        <TableCell sx={styleHeader}>
          <Typography>
            {totalEfectivo.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell sx={styleHeader}>
          <Typography>
          { ( totalEfectivo > 0 ? "+" : "-" ) }
          </Typography>
        </TableCell>
        </TableRow>
        {/* <TableRow>
        <TableCell sx={styleHeader}>
          <Typography>
            Ingresos
          </Typography>
        </TableCell>

        <TableCell sx={styleHeader}>
          <Typography>
            {5000}
          </Typography>
        </TableCell>

        <TableCell sx={styleHeader}>
          <Typography>
            +
          </Typography>
        </TableCell>
        </TableRow> */}
        {/* <TableRow>
        <TableCell sx={styleHeader}>
          <Typography>
            Egresos
          </Typography>
        </TableCell>

        <TableCell sx={styleHeader}>
          <Typography>
            {5000}
          </Typography>
        </TableCell>

        <TableCell sx={styleHeader}>
          <Typography>
            +
          </Typography>
        </TableCell>
        </TableRow> */}
        <TableRow>
        <TableCell sx={styleHeader}>
          <Typography>
            Total Sistema
          </Typography>
        </TableCell>

        <TableCell sx={styleHeader}>
          <Typography>
            {info.totalSistema.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell sx={styleHeader}>
          <Typography>
          { ( info.totalSistema > 0 ? "+" : "-" ) }
          </Typography>
        </TableCell>
        </TableRow>
        {/* <TableRow>
        <TableCell sx={styleHeader}>
          <Typography>
            Arqueo Mensual
          </Typography>
        </TableCell>

        <TableCell sx={styleHeader}>
          <Typography>
            {5000}
          </Typography>
        </TableCell>

        <TableCell sx={styleHeader}>
          <Typography>
            +
          </Typography>
        </TableCell>
        </TableRow> */}
        <TableRow>
        <TableCell sx={styleHeader}>
          <Typography>
            Diferencia Caja
          </Typography>
        </TableCell>

        <TableCell sx={styleHeader}>
          <Typography>
            {info.diferencia.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell sx={styleHeader}>
          <Typography>
          { ( info.diferencia > 0 ? "+" : "-" ) }
          </Typography>
        </TableCell>
        </TableRow>



        <TableRow>
        <TableCell sx={styleHeader}>
          <Typography>
            Usuario apertura
          </Typography>
        </TableCell>

        <TableCell colSpan={2} sx={styleHeader}>
          <Typography>
            {info.nombreApellidoUsuario}
          </Typography>
        </TableCell>
        </TableRow>

        <TableRow>
        <TableCell sx={styleHeader}>
          <Typography>
            Horario apertura
          </Typography>
        </TableCell>

        <TableCell colSpan={2} sx={styleHeader}>
          <Typography>
            {System.onlyTime(System.formatDateServer(info.fechaIngreso))}
          </Typography>
        </TableCell>
        </TableRow>

        <TableRow>
        <TableCell colSpan={10} sx={styleHeader}>
          <Typography>
            {" "}
          </Typography>
        </TableCell>
        </TableRow>

        <TableRow>
        <TableCell sx={styleHeader}>
          <Typography>
            Usuario cierre
          </Typography>
        </TableCell>

        <TableCell colSpan={2} sx={styleHeader}>
          <Typography>
            {info.nombreApellidoUsuario}
          </Typography>
        </TableCell>
        </TableRow>


        <TableRow>
        <TableCell sx={styleHeader}>
          <Typography>
            Hora cierre
          </Typography>
        </TableCell>

        <TableCell colSpan={2} sx={styleHeader}>
          <Typography>
            {System.onlyTime(System.formatDateServer(info.fechaTermino))}
          </Typography>
        </TableCell>
        </TableRow>

    </TableBody>

    </Table>
    </TableContainer>

  </DialogContent>
  <DialogActions>
    <Button variant="contained" onClick={()=>{
      setOpenDialog(false)
    }}>Aceptar</Button>
  </DialogActions>
  </Dialog>
  )
}
export default DialogReporteCierreZ;
