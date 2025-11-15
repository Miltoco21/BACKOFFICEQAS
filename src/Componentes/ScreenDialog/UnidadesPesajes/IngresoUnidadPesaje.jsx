import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import InputName from "../../Elements/Compuestos/InputName";
import InputNumber from "../../Elements/Compuestos/InputNumber";
import SelectListUnits from "../../Elements/Compuestos/SelectListUnits";
import SendingButton from "../../Elements/SendingButton";
import SmallButton from "../../Elements/SmallButton";
import UnidadPesaje from "../../../Models/UnidadPesaje";
import System from "../../../Helpers/System";

export default function IngresoUnidadPesaje({
  openDialog,
  setOpendialog,
  onSaveSuccess, // ✅ Callback para éxito
  onSaveError,   // ✅ Callback para error (opcional)
  dataInitial = null,
  isEdit = false
}) {
  const {
    showLoading,
    hideLoading,
    showLoadingDialog,
    showMessage
  } = useContext(SelectedOptionsContext);

  // Estados y validadores
  const states = {
    nombre: useState(""),
    peso: useState(""),
    unidadPeso: useState(""),
  };

  const validatorStates = {
    nombre: useState(null),
    peso: useState(null),
    unidadPeso: useState(null),
  };

  const handleSubmit = async () => {
    // Validar formulario
    if (!System.allValidationOk(validatorStates, showMessage)) return;

    const unidadPesaje = {
      descripcion: states.nombre[0],
      peso: parseFloat(states.peso[0]),
      unidad: states.unidadPeso[0],
    };

    console.log("Guardando unidad:", unidadPesaje, "isEdit:", isEdit); // Debug

    showLoading("Guardando...");
    
    try {
      const unidadModel = UnidadPesaje.getInstance();
      
      if (isEdit && dataInitial?.codigo) {
        // ✅ Modo edición
        console.log("Actualizando unidad con código:", dataInitial.codigo); // Debug
        
        await unidadModel.update(
          dataInitial.codigo,
          unidadPesaje.descripcion,
          unidadPesaje.peso,
          unidadPesaje.unidad,
          (response) => {
            console.log("Actualización exitosa:", response); // Debug
            hideLoading();
            showMessage("Unidad de pesaje actualizada correctamente");
            
            // ✅ Llamar callback de éxito del componente padre
            if (onSaveSuccess) {
              onSaveSuccess({ 
                ...unidadPesaje, 
                codigo: dataInitial.codigo,
                operation: 'update' 
              });
            }
          },
          (error) => {
            console.error("Error en actualización:", error); // Debug
            hideLoading();
            const errorMessage = error || "Error al actualizar";
            showMessage(errorMessage);
            
            // ✅ Llamar callback de error del componente padre
            if (onSaveError) {
              onSaveError(errorMessage);
            }
          }
        );
      } else {
        // ✅ Modo creación
        console.log("Creando nueva unidad"); // Debug
        
        await unidadModel.create(
          unidadPesaje.descripcion,
          unidadPesaje.peso,
          unidadPesaje.unidad,
          (response) => {
            console.log("Creación exitosa:", response); // Debug
            hideLoading();
            showMessage("Unidad de pesaje creada correctamente");
            
            // ✅ Llamar callback de éxito del componente padre
            if (onSaveSuccess) {
              onSaveSuccess({ 
                ...unidadPesaje, 
                codigo: response?.codigo || Date.now(),
                operation: 'create' 
              });
            }
          },
          (error) => {
            console.error("Error en creación:", error); // Debug
            hideLoading();
            const errorMessage = error || "Error al crear";
            showMessage(errorMessage);
            
            // ✅ Llamar callback de error del componente padre
            if (onSaveError) {
              onSaveError(errorMessage);
            }
          }
        );
      }
    } catch (error) {
      console.error("Error crítico:", error); // Debug
      hideLoading();
      const errorMessage = error.message || "Error al guardar";
      showMessage(errorMessage);
      
      // ✅ Llamar callback de error del componente padre
      if (onSaveError) {
        onSaveError(errorMessage);
      }
    }
  };

  // ✅ Función para cerrar diálogo
  const handleClose = () => {
    console.log("Cerrando diálogo"); // Debug
    setOpendialog(false);
  };

  // ✅ Limpiar formulario
  const clearForm = () => {
    states.nombre[1]("");
    states.peso[1]("");
    states.unidadPeso[1]("");
    
    // Resetear validadores
    validatorStates.nombre[1](null);
    validatorStates.peso[1](null);
    validatorStates.unidadPeso[1](null);
  };

  // ✅ Cargar datos iniciales cuando se abre el diálogo
  useEffect(() => {
    if (openDialog) {
      console.log("Diálogo abierto, cargando datos:", dataInitial, "isEdit:", isEdit); // Debug
      
      if (dataInitial && isEdit) {
        // Cargar datos para edición
        states.nombre[1](dataInitial.descripcion || "");
        states.peso[1](dataInitial.peso?.toString() || "");
        states.unidadPeso[1](dataInitial.unidad || "");
      } else {
        // Limpiar para nuevo registro
        clearForm();
      }
      
      // Resetear validadores
      validatorStates.nombre[1](null);
      validatorStates.peso[1](null);
      validatorStates.unidadPeso[1](null);
    }
  }, [openDialog, dataInitial, isEdit]);

  // ✅ Limpiar formulario al cerrar
  useEffect(() => {
    if (!openDialog) {
      clearForm();
    }
  }, [openDialog]);

  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        {isEdit ? "Editar Unidad de Pesaje" : "Nueva Unidad de Pesaje"}
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={2} sx={{ padding: "2%", marginTop: "1%" }}>
          <Grid item xs={12} md={6}>
            <InputName
              inputState={states.nombre}
              fieldName="nombre"
              required={true}
              validationState={validatorStates.nombre}
              label="Nombre del envase"
            />
          </Grid>
        
          <Grid item xs={12} md={6}>
            <InputNumber
              inputState={states.peso}
              required={true}
              fieldName="peso"
              label="Valor de peso"
              validationState={validatorStates.peso}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <SelectListUnits
              inputState={states.unidadPeso}
              validationState={validatorStates.unidadPeso}
              required={true}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SmallButton
              actionButton={handleClose}
              textButton="Cancelar"
              style={{ width: "100%", height: "50px" }}
            />
          </Grid>
          <Grid item xs={6}>
            <SendingButton
              textButton={isEdit ? "Actualizar" : "Crear"}
              actionButton={handleSubmit}
              sending={showLoadingDialog}
              sendingText="Guardando..."
              style={{
                width: "100%",
                height: "50px",
                backgroundColor: "#950198"
              }}
            />
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}