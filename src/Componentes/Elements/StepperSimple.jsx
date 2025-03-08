import React, { useState, useEffect, cloneElement } from "react";
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

const steps = ["Paso 1", "Paso 2"];

const StepperSimple = ({
  title,
  endStep,
  onComplete,
  children
}) => {

  const [datas, setDatas] = useState([])
  const [step, setStep] = useState(null)

  const onChangeStep = (prevStep, currentStep) => {
    // console.log("cambio del paso ", prevStep, " al ", currentStep)
    setStep(currentStep)
    setTimeout(() => {
      setStep(null)
    }, 500);
  }

  const onNext = (stepData, stepIndex) => {
    // console.log("onNext de paso 1.. data", stepData)
    datas[stepIndex] = stepData
    setDatas([...datas])
    setStep(stepIndex + 1)
  }

  const onBack = (stepIndex) => {
    if (stepIndex > 0) {
      setStep(stepIndex - 1)
    }
  }

  return (
    <StepperNavigator
      title={title}
      changeStep={step}
      endStep={cloneElement(endStep,{
        dataSteps: datas
      })}
      onChangeStep={onChangeStep}
      onComplete={() => {
        // console.log("hizo todos los pasos")
        onComplete(datas)
      }}
    >

      {children.map((child, ix) => {
        return cloneElement(child,{
          key:ix,
          isActive: (step === ix),
          dataSteps: datas,
          onNext:(info) => {
            onNext(info, ix)
          },
          onBack:() => {
            onBack(ix)
          }
        })
      })}
    </StepperNavigator>
  );
};

export default StepperSimple;
