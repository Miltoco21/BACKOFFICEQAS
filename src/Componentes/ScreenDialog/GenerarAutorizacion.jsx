import React, { useState, useContext, useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SmallButton from "../Elements/SmallButton";
import ModelConfig from "../../Models/ModelConfig";
import { useNavigate } from "react-router-dom";
import User from "../../Models/User";
import BoxOptionList from "../Elements/BoxOptionList";
import MainButton from "../Elements/MainButton";
import { maxWidth, width } from "@mui/system";

const GenerarAutorizacion = ({
  openDialog,
  setOpenDialog
}) => {
  
  const [caducidad, setCaducidad] = useState("")
  
  
  const [verGenerado, setVerGenerado] = useState(false)
  const [qr, setQr] = useState("")
  const [hash, setHash] = useState("")
  

  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
    >
      <DialogTitle>Generar Autorizacion</DialogTitle>
      <DialogContent>

      <Grid container spacing={2} sx={{ mt: 2}}>

        <Grid item xs={12} sm={12} md={12} lg={12}>

        <BoxOptionList
          optionSelected={caducidad}
          setOptionSelected={setCaducidad}
          options={ [
            {
              id: 1,
              value:"dia"
            },
            {
              id: 2,
              value:"semana"
            },
            {
              id: 3,
              value:"mes"
            }
          ]}
        />

        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <MainButton actionButton={()=>{
            console.log("hacer hash")
          }} textButton={"Generar autorizacion"} style={{
            width:"300px"
          }}/>
        </Grid>


       
        {verGenerado && (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography>Hash Generado</Typography>
            <input type="text" value={hash} />

            <Typography>Qr generado</Typography>
            <Image src={qr}  />
          </Grid>
        )}
      
      
      </Grid>


      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)} color="primary">
          Cancelar
        </Button>
        
      </DialogActions>
    </Dialog>
  );
};

export default GenerarAutorizacion;
