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
  Tabs,
  Tab,
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import AdminConfigTabGeneral from "./AdminConfigTabGeneral";
import AdminConfigTabComercio from "./AdminConfigTabComercio";

var prods = [];
for (let index = 1; index <= 5; index++) {
  prods.push(index);
}

const AdminConfig = ({
  openDialog,
  setOpenDialog
}) => {


  const [saveChanges, setSaveChanges] = useState(false)


  const handlerSaveAction = ()=>{
    setSaveChanges(!saveChanges)

    console.log("save config");
    setOpenDialog(false)
  }


  const [tabNumber, setTabNumber] = useState(0)
  const handleChange = (event, newValue) => {
    setTabNumber(newValue);
  };

  return (
      <Dialog open={openDialog} maxWidth="lg" onClose={()=>{
        setOpenDialog(false)
      }}
      >
        <DialogTitle>
          Configuraciones
        </DialogTitle>
        <DialogContent>
        <Grid container item xs={12} spacing={2} sx={{
          minWidth:"400px",
          marginTop:"0px"
        }}>
          

          <Grid item xs={12}>
            {/* Tabs component */}
            <Tabs value={tabNumber} onChange={handleChange}>
              {/* Individual tabs */}
              <Tab label="General"/>
              <Tab label="Comercio"/>
            </Tabs>
          </Grid>

          <Grid item xs={12}>
            <AdminConfigTabGeneral tabNumber={tabNumber} applyChanges={saveChanges} />
            <AdminConfigTabComercio tabNumber={tabNumber} applyChanges={saveChanges} />
          </Grid>
              
        </Grid>
        </DialogContent>
        <DialogActions>
          <SmallButton textButton="Guardar" actionButton={handlerSaveAction}/>
          <Button onClick={()=>{
            setOpenDialog(false)
          }}>Atras</Button>
        </DialogActions>
      </Dialog>
  );
};

export default AdminConfig;
