/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect, useRef } from "react";
import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";

import { Html5QrcodeScanner } from "html5-qrcode";

const StockMobileQR = () => {
  // const {
  //   showMessage,
  //   showLoading,
  //   hideLoading,
  //   showAlert,
  //   GeneralElements
  // } = useContext(SelectedOptionsContext);

  function onScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
  }

  function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  }



  useEffect(() => {

    let html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false);
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);


  }, [])
  return (
    <div id="reader" width="600px"></div>
  );
};

export default StockMobileQR;
