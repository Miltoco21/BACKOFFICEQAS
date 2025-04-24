/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect, useRef } from "react";
import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";

import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Button } from "@mui/material";

const StockMobileQR = () => {
  const {
    showMessage,
    showLoading,
    hideLoading,
    showAlert,
    GeneralElements
  } = useContext(SelectedOptionsContext);

  const [camIds, setCamIds] = useState([])
  const [camIdSelected, setCamIdSelected] = useState(null)
  const [currentId, setCurrentId] = useState(0)

  function onScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
  }

  function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  }


  const getCams = () => {
    Html5Qrcode.getCameras().then(devices => {
      /**
       * devices would be an array of objects of type:
       * { id: "id", label: "label" }
       */
      if (devices && devices.length > 0) {
        var cameraId = devices[0].id;
        // .. use this to start scanning.
        var ids = []

        devices.forEach((dev) => {
          ids.push(dev.id)
        })
        if (ids.length > 0) setCamIdSelected(ids[0])
        setCamIds(ids)
      }
    }).catch(err => {
      // handle err
      showAlert("no se pudo obtener las camaras")
    });
  }


  const doScan = () => {
    controllerCam.start(
      camIdSelected,
      {
        fps: 10,    // Optional, frame per seconds for qr code scanning
        qrbox: { width: 250, height: 250 }  // Optional, if you want bounded box UI
      },
      (decodedText, decodedResult) => {
        // do something when code is read
        showAlert(decodedText)
      },
      (errorMessage) => {
        // parse error, ignore it.
        showAlert("callbackfail:" + errorMessage)
      })
      .catch((err) => {
        // Start failed, handle it.
        showAlert("catch:" + err)
      });
  }
  const [controllerCam, setControllerCam] = useState(null)

  useEffect(() => {

    setControllerCam(new Html5Qrcode("reader", {
      formatsToSupport: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.EAN_13
      ]
    }))

    // let html5QrcodeScanner = new Html5Qrcode("reader")
    // "reader",
    //   { fps: 10, qrbox: { width: 250, height: 250 } },
    //   /* verbose= */ false);
    // html5QrcodeScanner.render(onScanSuccess, onScanFailure);



  }, [])

  useEffect(() => {
    console.log("controllerCam", controllerCam)
    if (controllerCam) {
      getCams()
    }
  }, [controllerCam])


  useEffect(() => {
    if (camIdSelected) {
      doScan()
    }
  }, [camIdSelected])





  return (
    <div>
      <Button onClick={() => {
        var proxid = currentId
        if (proxid >= camIds.length) proxid = 0
        setCurrentId(proxid)
      }}>cambiar camara</Button>
      <div id="reader" width="600px"></div>
    </div>
  );
};

export default StockMobileQR;
