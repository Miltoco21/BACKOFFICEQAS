import React, { useState, useContext } from "react";
import { Grid, Paper } from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import InputNumber from "../Elements/Compuestos/InputNumber";
import SendingButton from "../Elements/SendingButton";
import System from "../../Helpers/System";
import SearchProducts from "../Elements/Compuestos/SearchProducts";
import { TextField,Box,Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const AjusteInventario = ({ onClose }) => {
  const { showLoadingDialog, hideLoading, showMessage } = useContext(SelectedOptionsContext);

  // Definir los estados
  const [stockSistema, setStockSistema] = useState("");
  const [stockFisico, setStockFisico] = useState("");
  const [fechaAjuste, setFechaAjuste] = useState(null);
  const [validationStockFisico, setValidationStockFisico] = useState({});
  const [validationStockSistema, setValidationStockSistema] = useState({ error: false, message: '' });

  const [selectedProduct, setSelectedProduct] = useState(null); // Para almacenar el producto seleccionado
  
  const handleProductSelect = (product) => {
    // Actualizar el estado del stockSistema y almacenar el producto seleccionado
    setSelectedProduct(product)
    setStockSistema(product.stockActual);
    ; // Almacenar el producto seleccionado
    console.log("Producto seleccionado:", product);
  };


  const handleSubmit = async () => {
    // Validar antes de enviar
    if (!System.allValidationOk({ stockSistema, stockFisico, fechaAjuste }, showMessage)) {
      return;
    }

    const ajusteInventario = {
      stockSistema: stockSistema,
      stockFisico: stockFisico + "",
      fechaAjuste: fechaAjuste.format("YYYY-MM-DD"),
    };

    console.log("Datos antes de enviar:", ajusteInventario);
    showLoading("Enviando...");
    System.getInstance().add(
      ajusteInventario,
      (res) => {
        hideLoading();
        showMessage("Ajuste de Inventario creado exitosamente");
        setTimeout(() => {
          onClose();
        }, 2000);
      },
      (error) => {
        hideLoading();
        showMessage(error);
      }
    );
  };

  return (
    <Paper elevation={16} square sx={{ padding: "2%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h2>Ingreso Ajuste Inventario</h2>
        </Grid>
        <Grid item xs={12}>
          {/* SearchProducts ahora pasa el producto seleccionado */}
          <SearchProducts onProductSelect={handleProductSelect} />
        </Grid>
              {/* Mostrar detalles del producto seleccionado */}
              {selectedProduct && (
          <Grid item xs={12}>
            <Box sx={{ border: '1px solid #ddd', padding: 2, borderRadius: 2, marginTop: 2 }}>
              <Typography variant="h6"> Producto Seleccionado:</Typography>
              <Typography>Nombre: {selectedProduct.nombre}</Typography>
            
              <Typography>Stock Actual: {selectedProduct.stockActual}</Typography>
            </Box>
          </Grid>
        )}
        <Grid item xs={12} md={6}>
        <InputNumber
    inputState={[stockSistema, setStockSistema]} // Asegúrate de que esto es un array
    validationState={[validationStockSistema, setValidationStockSistema]} // Asegúrate de que esto es un array
    withLabel={true}
    fieldName="stockSistema"
    label="Stock Sistema"
    required={true}
    disabled={true} // Esto hace que el campo sea solo de lectura
  />

        </Grid>
        <Grid item xs={12} md={6}>
          {/* Reemplazamos el TextField con el InputNumber para Stock Físico */}
          <InputNumber
            inputState={[stockFisico, setStockFisico]}
            validationState={[validationStockFisico, setValidationStockFisico]}
            withLabel={true}
            fieldName="stockFisico"
            label="Stock Físico"
            required={true}
          />
        </Grid>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha Ajuste"
              value={fechaAjuste}
              onChange={(newValue) => setFechaAjuste(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          {/* Botón de Enviar */}

          <SendingButton
              textButton=" Guardar Ajustes"
              actionButton={handleSubmit}
              sending={showLoadingDialog}
              sendingText="Registrando..."
              style={{
                width:"50%",
                margin: "0 25%",
                backgroundColor:"#950198"
              }}
            />        </Grid>
      </Grid>
    </Paper>
  );
};

export default AjusteInventario;
