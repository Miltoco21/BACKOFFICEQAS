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
import SendingButton from "../../Elements/SendingButton";
import SmallButton from "../../Elements/SmallButton";
import CentrodeCostos from "../../../Models/CentrodeCostos";
import System from "../../../Helpers/System";

export default function IngresoCentrodeCosto({
  openDialog,
  setOpendialog,
  onSave,
  onError,
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
    descripcion: useState("") 
  };

  const validatorStates = {
    descripcion: useState(null)
  };

  const handleSubmit = async () => {
    if (!System.allValidationOk(validatorStates, showMessage)) return;

    const centroDeCosto = {
      descripcion: states.descripcion[0]
    };

    showLoading("Guardando...");
    
    try {
      const costCenterModel = CentrodeCostos.getInstance();
      
      if (isEdit && dataInitial?.id) {
        // Modo edición
        costCenterModel.update(
          dataInitial.id,
          centroDeCosto.descripcion,
          (response) => {
            hideLoading();
            showMessage("Centro de costo actualizado correctamente");
            
            // Llamar al callback del padre con información de que es edición
            if (onSave) {
              onSave(true); // true indica que es edición
            }
            
            // El componente padre se encarga de cerrar el diálogo
          },
          (error) => {
            hideLoading();
            showMessage(error || "Error al actualizar");
            
            // Llamar al callback de error si existe
            if (onError) {
              onError(error || "Error al actualizar");
            }
          }
        );
      } else {
        // Modo creación
        costCenterModel.create(
          centroDeCosto.descripcion,
          (response) => {
            hideLoading();
            showMessage("Centro de costo creado correctamente");
            
            // Llamar al callback del padre con información de que es creación
            if (onSave) {
              onSave(false); // false indica que es creación
            }
            
            // El componente padre se encarga de cerrar el diálogo
          },
          (error) => {
            hideLoading();
            showMessage(error || "Error al crear");
            
            // Llamar al callback de error si existe
            if (onError) {
              onError(error || "Error al crear");
            }
          }
        );
      }
    } catch (error) {
      hideLoading();
      const errorMessage = error.message || "Error al guardar";
      showMessage(errorMessage);
      
      // Llamar al callback de error si existe
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  // Función para cerrar el diálogo
  const handleClose = () => {
    setOpendialog(false);
  };

  // Resetear formulario al abrir/cambiar datos
  useEffect(() => {
    if (openDialog) {
      if (dataInitial && isEdit) {
        // Modo edición - cargar datos existentes
        states.descripcion[1](dataInitial.descripcion || "");
      } else {
        // Modo creación - limpiar campos
        states.descripcion[1]("");
      }
      
      // Resetear validadores
      validatorStates.descripcion[1](null);
    }
  }, [openDialog, dataInitial, isEdit]);

  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {isEdit ? "Editar Centro de Costo" : "Nuevo Centro de Costo"}
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={2} sx={{ padding: "2%", marginTop: "1%" }}>
          <Grid item xs={12}>
            <InputName
              inputState={states.descripcion}
              fieldName="descripcion"
              required={true}
              validationState={validatorStates.descripcion}
              label="Descripción del Centro de Costo"
              maxLength={50}
              autoFocus
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