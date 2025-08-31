/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  TextField,
  Typography
} from "@mui/material";

import ModelConfig from "../../Models/ModelConfig";
import TabPanel from "../Elements/TabPanel";
import SmallButton from "../Elements/SmallButton";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import BoxOptionList from "../Elements/BoxOptionList";
import CriterioCosto from "../../definitions/CriterioCosto";
import StorageSesion from "../../Helpers/StorageSesion";
import Shop from "../../Models/Shop";
import InputFile from "../Elements/Compuestos/InputFile";
import System from "../../Helpers/System";
import { width } from "@mui/system";


const AdminConfigTabShop = ({
  tabNumber,
  setSomeChange,
  closeModal = () => { }
}) => {

  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const TAB_INDEX = 4


  const [infoComercio, setInfoComercio] = useState(null)
  const [image, setImage] = useState("")
  const [val_image, setVal_image] = useState(null)
  const [hasConnectionMp, setHasConnectionMp] = useState(null)
  const [linkToConnectMp, setLinkToConnectMp] = useState("")
  const [checkingConnectMp, setCheckingConnectMp] = useState(false)

  const [cambioAlgo, setCambioAlgo] = useState(false)

  const achicarInfo = (infoCompleta) => {
    const infoMin = {}
    infoCompleta.forEach((con, ix) => {
      if (con.grupo == "ImpresionTicket") {
        infoMin[con.entrada] = con.valor
      }
    })
    return infoMin
  }

  const showMessageLoading = (err) => {
    showMessage(err)
    hideLoading()
  }


  const getInfoComercio = (callbackOk) => {
    var comSes = new StorageSesion("comercio")
    if (!comSes.hasOne()) {
      showLoading("Cargando info del comercio...")
      ModelConfig.getAllComercio((info) => {
        const infoMin = achicarInfo(info.configuracion)
        hideLoading()
        comSes.guardar(infoMin)
        callbackOk(infoMin)
      }, showMessageLoading)
    } else {
      callbackOk(comSes.cargar(1))
    }
  }


  const onLoad = () => {
    getInfoComercio((infoCom) => {
      // console.log("info de comercio", infoCom)
      infoCom.url_base = ModelConfig.get("urlBase")


      showLoading("Buscando informacion del servidor...")
      Shop.prepare(infoCom, (response) => {
        hideLoading()
        // console.log("respuesta de softus", response)
        setInfoComercio(response.info)
      }, showMessageLoading)
    })

  }

  const cambiaInfoComercio = (campo, valor) => {
    infoComercio[campo] = valor

    const cp = System.clone(infoComercio)
    delete (infoComercio.campo)

    setInfoComercio(infoComercio)
    setTimeout(() => {
      setInfoComercio(cp)
    }, 10);

  }

  const actualizarInfoComercio = () => {
    showLoading("Actualizando informacion del comercio")
    Shop.actualizarInfoComercio(infoComercio, (resp) => {
      showMessage("Realizado correctamente")
      hideLoading()
      setCambioAlgo(false)
    }, showMessageLoading)

  }


  useEffect(() => {
    setCambioAlgo(true)
  }, [infoComercio])

  const enviarImagen = () => {
    showLoading("Subiendo imagen")
    Shop.enviarImagen(image, infoComercio, (resp) => {
      // console.log("respuesta del servidor", resp)
      if (resp.status) {
        setInfoComercio(resp.info)
      }
      hideLoading()
    }, (er) => {
      hideLoading()
      showMessage(er)
    })
  }



  const conectarAMP = () => {
    getLinkConnectMp()
  }

  const getLinkConnectMp = () => {
    if (linkToConnectMp == "") {
      showLoading("Generando coneccion con mp")
      Shop.getLinkMp(infoComercio, (resp) => {
        // console.log("respuesta del servidor", resp)
        hideLoading()
        if (resp.status) {

          open(resp.link, "_bank")
          setLinkToConnectMp(resp.link)

          setCheckingConnectMp(true)
        }
      }, (er) => {
        hideLoading()
        showMessage(er)
      })
    } else {
      open(linkToConnectMp, "_bank")
      setCheckingConnectMp(true)

    }
  }
  const checkConeccionAMP = () => {
    showLoading("Revisando coneccion con mp")
    Shop.checkConeccionMP(infoComercio, (resp) => {
      // console.log("respuesta del servidor", resp)
      hideLoading()
      setCheckingConnectMp(false)
      if (resp.status) {
        setHasConnectionMp(true)
      }
    }, (er) => {
      hideLoading()
      showMessage(er)
    })
  }

  useEffect(() => {
    if (tabNumber != TAB_INDEX) return
    onLoad();
  }, [tabNumber]);



  useEffect(() => {

    // console.log("cambio infocomercio", infoComercio)
    if (infoComercio) {
      if (infoComercio.extras != "") {
        const ex = JSON.parse(infoComercio.extras);
        // console.log("ex", ex)
        if (ex && ex.mp && ex.mp.access_token) {
          setHasConnectionMp(true)
        } else {
          setHasConnectionMp(false)
        }
      }
    }
  }, [infoComercio]);


  return (
    <TabPanel value={tabNumber} index={TAB_INDEX}>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={12}>


          {infoComercio && (


            <div>

              <h5>Imagen</h5>
              <div>
                {infoComercio.image != "" && (
                  <img
                    style={{
                      width: "130px"
                    }}
                    src={("https://softus.com.ar/images/shops/" + infoComercio.image)} />
                )}
                <br />
                <InputFile
                  inputState={[image, setImage]}
                  validationState={[val_image, setVal_image]}
                  extensions="jpg"
                  label={"Seleccionar imagen"}
                  fileInputLabel={(infoComercio.image != "" ? "cambiar imagen" : "seleccionar imagen")}
                />

                {image != "" && (
                  <SmallButton textButton={"Enviar imagen"} actionButton={enviarImagen} />
                )}

              </div>


              <h4 style={{
                textAlign: "left",
                marginTop: "30px"
              }}>Informacion de la tienda</h4>
              <TextField
                margin="normal"
                fullWidth
                label={"Nombre"}
                type="text" // Cambia dinámicamente el tipo del campo de contraseña
                value={infoComercio.name}
                onChange={(e) => cambiaInfoComercio("name", e.target.value)}
              />

              <TextField
                margin="normal"
                fullWidth
                label={"url de la tienda"}
                type="text" // Cambia dinámicamente el tipo del campo de contraseña
                value={infoComercio.url}
                onChange={(e) => cambiaInfoComercio("url", e.target.value)}
              />

              <TextField
                margin="normal"
                fullWidth
                label={"Descripcion"}
                type="text" // Cambia dinámicamente el tipo del campo de contraseña
                value={infoComercio.description}
                onChange={(e) => cambiaInfoComercio("description", e.target.value)}
              />

              <TextField
                margin="normal"
                fullWidth
                label={"Rut"}
                type="text" // Cambia dinámicamente el tipo del campo de contraseña
                value={infoComercio.unique_doc}
                onChange={(e) => cambiaInfoComercio("unique_doc", e.target.value)}
              />


              <SmallButton
                textButton={"Actualizar informacion"}
                style={{ width: "250px" }}
                isDisabled={!cambioAlgo}
                actionButton={actualizarInfoComercio}
              />


            </div>

          )}

          {!checkingConnectMp ? (
            <div>
              {infoComercio && !hasConnectionMp && (
                <SmallButton textButton="conectar a mp" actionButton={conectarAMP} />
              )}


              {infoComercio && hasConnectionMp && (
                <Typography>Conectado a MP correctamente</Typography>
              )}
            </div>
          ) : (
            <div>
              <SmallButton textButton="Revisar coneccion MP" actionButton={checkConeccionAMP} />
            </div>
          )}

        </Grid>

        <div style={{
          width: "100%",
          height: "50px",
        }}></div>


      </Grid>

    </TabPanel >
  );
};

export default AdminConfigTabShop;
