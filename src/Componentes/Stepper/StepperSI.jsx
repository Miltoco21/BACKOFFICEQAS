import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Step,
  StepLabel,
  Stepper,
  Paper,
  Typography
} from "@mui/material";
import axios from "axios";
import Step1 from "./Step1";
import Step1CC from "./Step1CC";//con codigo
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step3CC from "./Step3CC";//con codigo
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Model from "../../Models/Model";

const steps = ["Paso 1", "Paso 2"];

const StepperSI = ({
  conCodigo = false,
  onSuccessAdd
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [title, setTitle] = useState("")

  const [stepData, setStepData] = useState({
    selectedCategoryId: "",
    selectedSubCategoryId: "",
    selectedFamilyId: "",
    selectedSubFamilyId: "",
    marca: "",
    nombre: "",
    selectedUnidadId: "",
    precioCosto: "",
    stockInicial: "",
    precioVenta: "",

    // Otros campos necesarios para el paso 3
  });

  useEffect(() => {
    const storedData = localStorage.getItem("stepperData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setStepData(parsedData.step1 || {});
      setStepData(parsedData.step3 || {});
    }

    if (conCodigo) {
      setTitle("Ingreso producto con código")
    } else {
      setTitle("Ingreso producto")
    }

  }, []);

  // useEffect(() => {
  //   const storedData = localStorage.getItem("stepperData");
  //   if (storedData) {
  //     setData(JSON.parse(storedData));
  //   }
  // }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setStepData((prevData) => ({ ...prevData, }));

  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setStepData((prevData) => ({ ...prevData, }));
  };

  const getStepContent = (step) => {
    console.log("getStepContent..concodigo?", conCodigo)
    if (conCodigo) {
      switch (step) {
        case 0:
          return <Step1CC data={stepData} onNext={handleNext} setStepData={setStepData} />;
        case 1:
          return <Step3CC
            data={stepData}
            onNext={handleNext}
            setStepData={setStepData}
            onSuccessAdd={onSuccessAdd}
            onBack={handleBack}
          />;
        case 2:
      }
    } else {
      switch (step) {
        case 0:
          return <Step1 data={stepData} onNext={handleNext} setStepData={setStepData} />;
        case 1:
          return <Step3
            data={stepData}
            onNext={handleNext}
            setStepData={setStepData}
            onSuccessAdd={onSuccessAdd}
            onBack={handleBack}
          />;
        case 2:
      }
    }

  };

  const [ultimoIdCreado, setUltimoIdCreado] = useState(null)

  useEffect(() => {
    if (activeStep === steps.length) {
      const sesion = Model.getInstance().sesion
      console.log("sesion", sesion)
      var sesion1 = sesion.cargar(1)
      if (sesion1) {
        setUltimoIdCreado(sesion1.ultimoIdCreado)
      }
    } else {
      setUltimoIdCreado(null)
    }
  }, [activeStep])

  return (
    <Container>
      <Paper
        sx={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}
      >
        <Typography variant="h5">{title}</Typography>
      </Paper>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div style={{
            marginTop: "60px",
            width: "100%",
            textAlign: "center"
          }}>
            <p>Todos los pasos han sido completados!!.</p>

            {ultimoIdCreado && (
              <Typography variant="h3">

                <Typography sx={{
                  fontSize: "18px"
                }}>
                  C&oacute;digo generado
                </Typography>


                <Typography sx={{
                  fontSize: "20px"
                }}>{ultimoIdCreado} </Typography>


              </Typography>
            )}






          </div>
        ) : (
          <div>
            {getStepContent(activeStep)}
            <div>
              {/* <Button disabled={activeStep === 0} onClick={handleBack}>
                Volver
              </Button> */}
              {/* {activeStep === steps.length - 1 && (
                <Button
                  variant="contained"
                  color="primary"
                  margin="dense"
                  onClick={handleSubmit}
                >
                  Enviar
                </Button>
              )} */}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default StepperSI;
