import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import BoxEnvases from "../BoxOptionsLite/BoxEnvases";



const Envases = ({openDialog,setOpenDialog}) => {
  
  return (
    <Dialog open={openDialog} onClose={()=>{setOpenDialog(false)}} maxWidth="lg">
      <DialogTitle>Envases</DialogTitle>
      <DialogContent onClose={()=>{setOpenDialog(false)}}>
        <BoxEnvases openDialog={openDialog} onClose={()=>{setOpenDialog(false)}}/>
      </DialogContent>
      </Dialog>
  );
};

export default Envases;
