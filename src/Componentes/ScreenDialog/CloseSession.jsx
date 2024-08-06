import React, { useState, useContext, useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SmallButton from "../Elements/SmallButton";
import ModelConfig from "../../Models/ModelConfig";
import { useNavigate } from "react-router-dom";

const ScreenSessionOptions = ({openDialog,setOpenDialog}) => {
  const navigate = useNavigate();
  
  var prods = [];
  for (let index = 1; index <= 5; index++) {
    prods.push(index);
  }

  const {
    clearSessionData 
  } = useContext(SelectedOptionsContext);


  const handleLogout = () => {
    clearSessionData();
    navigate("/login");
  };


  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
    >
      <DialogTitle>Cerrar Sesión</DialogTitle>
      <DialogContent>
        <DialogContentText>
        Deseas cerrar sesión?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleLogout} color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScreenSessionOptions;
