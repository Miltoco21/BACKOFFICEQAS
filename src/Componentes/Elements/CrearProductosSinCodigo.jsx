import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Step,
  StepLabel,
  Stepper as StepperUI,
  Paper,
  Typography
} from "@mui/material";
import axios from "axios";
import Step1 from "../Stepper/Step1";
import Step1CC from "../Stepper/Step1CC";//con codigo

import Step3 from "../Stepper/Step3";
import Step3CC from "../Stepper/Step3CC";//con codigo

import Model from "../../Models/Model";
import StepperNavigator from "./StepperNavigator";
import System from "../../Helpers/System";
import StepFinish from "../Stepper/StepFinish";
import StepperSimple from "./StepperSimple";

const CrearProductosSinCodigo = ({
  onSuccessAdd
}) => {

  const guardar = (dataSteps) => {
    // console.log("guardo el nuevo producto con estos datos", dataSteps)
    onSuccessAdd(dataSteps[1])
  }

  return (
    <StepperSimple
      title={"Crear producto sin codigo"}
      endStep={<StepFinish mostrarBotones={false} />}
      onComplete={guardar}
    >
      <Step1 />
      <Step3 />
    </StepperSimple>
  );
};

export default CrearProductosSinCodigo;
