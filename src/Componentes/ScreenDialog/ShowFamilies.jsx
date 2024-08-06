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
import TableSelecCategory from "../BoxOptionsLite/TableSelect/TableSelecCategory";
import TableSelecSubCategory from "../BoxOptionsLite/TableSelect/TableSelecSubCategory";
import TableSelecFamily from "../BoxOptionsLite/TableSelect/TableSelecFamily";
import TableSelecProductNML from "../BoxOptionsLite/TableSelect/TableSelecProductNML";
import TableSelecSubFamily from "../BoxOptionsLite/TableSelect/TableSelecSubFamily";
import BuscarProductoFamilia from "./BuscarProductoFamilia";



const CreateClient = ({
  openDialog,
  setOpenDialog
}) => {

  const {
    userData,
    addToSalesData
  } = useContext(SelectedOptionsContext);

  const handleSelectProduct = (product)=>{
    addToSalesData(product)
    setOpenDialog(false)
  }

  return (
    <BuscarProductoFamilia
    openDialog={openDialog}
    setOpenDialog={setOpenDialog}
    onSelect={handleSelectProduct}
    />
  );
};

export default CreateClient;
