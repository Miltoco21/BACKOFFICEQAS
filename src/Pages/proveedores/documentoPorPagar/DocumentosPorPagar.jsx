import React, { useState, useContext, useEffect } from "react";
import {
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Avatar,
  TextField,
  CircularProgress,
  Snackbar,
  Checkbox,
  IconButton,
  Collapse,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SideBar from "../../../Componentes/NavBar/SideBar";
import axios from "axios";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ModelConfig from "../../../Models/ModelConfig";
import User from "../../../Models/User";
import PagoParcial from "../../../Componentes/ScreenDialog/PagoParcial";
import PagoTransferencia from "../../../Componentes/ScreenDialog/PagoTransferencia";
import PagoCheque from "../../../Componentes/ScreenDialog/PagoCheque";
import { SelectedOptionsContext } from "../../../Componentes/Context/SelectedOptionsProvider";
import Proveedor from "../../../Models/Proveedor";
import PagoGeneral from "./PagoGeneral";
import PagoGrupal from "./PagoGrupal";
import PagoDetalle from "./PagoDetalle";
import ItemTablaModalDetalle from "./ItemTablaModalDetalle";
import TablaDetalles from "./ItemTablaDetalles";
import ItemListado from "./ItemListado";
import System from "../../../Helpers/System";

const DocumentosPorPagar = () => {

  const {
    showLoading,
    hideLoading,
    showLoadingDialog,
    showMessage,
    showAlert
  } = useContext(SelectedOptionsContext);

  const apiUrl = ModelConfig.get().urlBase;
  const [proveedores, setProveedores] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState([]);
  const [openPagar, setOpenPagar] = useState(false);
  const [openPaymentGroupProcess, setOpenPaymentGroupProcess] = useState(false);

  const [groupedProveedores, setGroupedProveedores] = useState([]);
  const [openPaymentProcess, setOpenPaymentProcess] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [paymentOrigin, setPaymentOrigin] = useState(null);
  const [montoAPagar, setMontoAPagar] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  const [openGroups, setOpenGroups] = useState({});

  const [selectedItem, setSelectedItem] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const handleDetailOpen = (item) => {
    setSelectedItem(item);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setSelectedItem(null);
  };


  const [order, setOrder] = useState({
    field: "",
    direction: "asc",
  });

  const handleSort = (field) => {
    const isAsc = order.field === field && order.direction === "asc";
    setOrder({ field, direction: isAsc ? "desc" : "asc" });
  };



  const [sortedProveedores, setSortedProveedores] = useState([]);
  // const [documentCountsByRut, setDocumentCountsByRut] = useState({});

  const [openTransferenciaModal, setOpenTransferenciaModal] = useState(false);
  const [openTransferenciaModal2, setOpenTransferenciaModal2] = useState(false);

  const [openChequeModal, setOpenChequeModal] = useState(false);
  const [errorTransferenciaError2, setTransferenciaError2] = useState("");

  const [errorTransferenciaError, setTransferenciaError] = useState("");
  const [fecha, setFecha] = useState(dayjs());
  const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre
  const [rut, setRut] = useState(""); // Estado para almacenar el rut
  const [nroCuenta, setNroCuenta] = useState(""); // Estado para almacenar el número de cuenta
  const [nroOperacion, setNroOperacion] = useState(""); // Estado para almacenar el número de operación
  const [selectedBanco, setSelectedBanco] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState("");
  const [nroDocumento, setNroDocumento] = useState("");
  const [serieCheque, setSerieCheque] = useState("");

  useEffect(() => {
    Proveedor.getCompras((compras) => {
      setProveedores(compras)
    }, showMessage)
  }, []);


  const handleClickOpen = (proveedor) => {
    setSelectedProveedor(proveedor);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProveedor(null);
  };

  const handlePagarOpen = (rut) => {
    const filteredProveedores = proveedores.filter(
      (proveedor) => proveedor.rut === rut
    );
    setGroupedProveedores(filteredProveedores);
    setOpenPagar(true);
  };

  const handlePagarClose = () => {
    setOpenPagar(false);
    setGroupedProveedores([]);
  };

  const handleOpenPaymentProcess = (selectedItem) => {
    setError("");

    setMontoAPagar(selectedItem.total);
    setCantidadPagada(selectedItem.total);

    console.log(montoAPagar);

    // Resetear la cantidad pagada al abrir el diálogo
    setMetodoPago("");
    setOpenPaymentProcess(true);
  };

  const handleClosePaymentProcess = () => {
    setOpenPaymentProcess(false);
  };
  const handleOpenGroupPaymentProcess = () => {
    setError("");

    setMontoAPagar(selectedTotal);
    setCantidadPagada(selectedTotal);

    console.log(montoAPagar);

    // Resetear la cantidad pagada al abrir el diálogo
    setMetodoPago("");
    setOpenPaymentGroupProcess(true);
  };
  const handleClosePaymentGroupProcess = () => {
    setOpenPaymentGroupProcess(false);
  };
  const getTotalSelected = () => {
    if (paymentOrigin === "detalleProveedor" && selectedProveedor) {
      return selectedProveedor.total;
    } else {
      return groupedProveedores.reduce(
        (acc, proveedor) => acc + proveedor.total,
        0
      );
    }
  };
  const calcularVuelto = () => {
    return metodoPago === "EFECTIVO" && cantidadPagada > montoAPagar
      ? cantidadPagada - montoAPagar
      : 0;
  };


  const handleIndividualPayment = async () => {
    try {
      setLoading(true);

      let endpoint = "";
      let requestBody = {};

      switch (metodoPago) {
        case "TRANSFERENCIA":
          endpoint = `${apiUrl}/Clientes/PostClientePagarDeudaTransferenciaByIdCliente`;

          if (nombre === "") {
            setTransferenciaError("Por favor, ingresa el nombre.");
            setLoading(false);
            return;
          }
          if (rut === "") {
            setTransferenciaError("Por favor, ingresa el RUT.");
            setLoading(false);
            return;
          }
          if (!validarRutChileno(rut)) {
            setTransferenciaError("El RUT ingresado NO es válido.");
            setLoading(false);
            return;
          }
          if (selectedBanco === "") {
            setTransferenciaError("Por favor, selecciona el banco.");
            setLoading(false);
            return;
          }
          if (tipoCuenta === "") {
            setTransferenciaError("Por favor, selecciona el tipo de cuenta.");
            setLoading(false);
            return;
          }
          if (nroCuenta === "") {
            setTransferenciaError("Por favor, ingresa el número de cuenta.");
            setLoading(false);
            return;
          }
          if (fecha === "") {
            setTransferenciaError("Por favor, selecciona la fecha.");
            setLoading(false);
            return;
          }
          if (nroOperacion === "") {
            setTransferenciaError("Por favor, ingresa el número de operación.");
            setLoading(false);
            return;
          }

          requestBody = {
            deudaIds: [
              {
                idCuentaCorriente: selectedItem.id,
                idCabecera: selectedItem.idCabecera,
                total: selectedItem.total.toString(),
              },
            ],
            montoPagado: montoAPagar,
            metodoPago: metodoPago,
            idUsuario: User.getInstance().getFromSesion().codigoUsuario,
            transferencias: {
              idCuentaCorrientePago: selectedItem.id,
              nombre: nombre,
              rut: rut,
              banco: selectedBanco,
              tipoCuenta: tipoCuenta,
              nroCuenta: nroCuenta,
              fecha: fecha,
              nroOperacion: nroOperacion,
            },
          };
          break;

        case "CHEQUE":
          endpoint = `${apiUrl}/Clientes/PostClientePagarDeudaChequeByIdCliente`;

          requestBody = {
            deudaIds: [
              {
                idCuentaCorriente: selectedItem.id.toString(),
                idCabecera: selectedItem.idCabecera.toString(),
                total: selectedItem.total.toString(),
              },
            ],
            montoPagado: montoAPagar,
            metodoPago: metodoPago,
            idUsuario: User.getInstance().getFromSesion().codigoUsuario,
            // Add cheque-specific fields here if needed
          };
          break;

        case "EFECTIVO":
          endpoint = `${apiUrl}/Proveedores/AddProveedorCompraPagar`;

          requestBody = {
            fechaIngreso: new Date().toISOString(),
            codigoUsuario: 0, // Ajusta según tu lógica
            codigoSucursal: 0, // Ajusta según tu lógica
            puntoVenta: "string", // Ajusta según tu lógica
            compraDeudaIds: [
              {
                idProveedorCompraCabecera: selectedItem.id,
                total: parseInt(Math.round(selectedItem.total)),
              },
            ],
            montoPagado: parseInt(Math.round(selectedItem.total)),
            metodoPago: metodoPago,
          };
          break;
      }

      console.log("Request Body:", requestBody);

      const response = await axios.post(endpoint, requestBody);

      console.log("Response:", response.data);
      console.log("ResponseStatus:", response.data.statusCode);

      if (response.data.statusCode === 201) {
        setSnackbarOpen(true);
        setSnackbarMessage(response.data.descripcion);
        handleClosePaymentProcess();
        setCantidadPagada(0);

        // handleDetailClose();
        handleTransferenciaModalClose();
        fetchProveedores();

        setNombre("");
        setRut("");
        setSelectedBanco("");
        setTipoCuenta("");
        setNroCuenta("");
        setNroOperacion("");

        setTimeout(() => {
          handleClosePaymentProcess();
        }, 2000);
      } else {
        console.error("Error al realizar el pago");
      }
    } catch (error) {
      console.error("Error al realizar el pago:", error);
    } finally {
      setLoading(false);
    }
  };


  const totalGeneral = proveedores.reduce(
    (acc, proveedor) => acc + proveedor.total,
    0
  );

  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = groupedProveedores.map((proveedor) => proveedor.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (event, id) => {
    if (event.target.checked) {
      setSelectedIds((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedIds((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
    }
  };

  const selectedTotal = groupedProveedores
    .filter((proveedor) => selectedIds.includes(proveedor.id))
    .reduce((total, proveedor) => total + proveedor.total, 0);

  const allSelected = selectedIds.length === groupedProveedores.length;
  const [cantidadPagada, setCantidadPagada] = useState(selectedTotal || 0);

  // Función ORDENAMIENTO DE DATOS //////

  //////Transferencias//////
  const handleTransferenciaModalOpen = () => {
    setMetodoPago("TRANSFERENCIA");
    setError("");
    setTransferenciaError("");

    setOpenTransferenciaModal(true);
  };
  const handleTransferenciaModalClose = () => {
    setOpenTransferenciaModal(false);
  };
  const handleTransferenciaModalOpen2 = () => {
    setMetodoPago("TRANSFERENCIA");
    setError("");
    setTransferenciaError2("");

    setOpenTransferenciaModal2(true);
  };
  const handleTransferenciaModalClose2 = () => {
    setOpenTransferenciaModal2(false);
  };
  const handleChequeModalOpen = () => {
    setMetodoPago("CHEQUE"); // Establece el método de pago como "Transferencia"
    setOpenChequeModal(true);
    setCantidadPagada(getTotalSelected());
  };
  const handleChequeModalClose = () => {
    setOpenChequeModal(false);
  };


  const handleChangeTipoCuenta = (event) => {
    setTipoCuenta(event.target.value); // Actualizar el estado del tipo de cuenta seleccionado
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      let endpoint =
        apiUrl + "/Clientes/PostClientePagarDeudaBackOfficeByIdCliente  ";

      let requestBody = {};

      if (metodoPago === "TRANSFERENCIA") {
        endpoint =
          apiUrl + "/Clientes/PostClientePagarDeudaTransferenciaByIdCliente";

        if (
          nombre === "" ||
          rut === "" ||
          selectedBanco === "" ||
          tipoCuenta === "" ||
          nroCuenta === "" ||
          fecha === "" ||
          nroOperacion === ""
        ) {
          setTransferenciaError(
            "Por favor, completa todos los campos necesarios para la transferencia."
          );
          setLoading(false);
          return;
        }

        if (!validarRutChileno(rut)) {
          setTransferenciaError("El RUT ingresado NO es válido.");
          setLoading(false);
          return;
        }

        requestBody = {
          montoPagado: montoAPagar,
          metodoPago: metodoPago,
          idUsuario: User.getInstance().getFromSesion().codigoUsuario,
          transferencias: {
            idCuentaCorrientePago: 0,
            nombre: nombre,
            rut: rut,
            banco: selectedBanco,
            tipoCuenta: tipoCuenta,
            nroCuenta: nroCuenta,
            fecha: fecha,
            nroOperacion: nroOperacion,
          },
        };
      } else if (metodoPago === "CHEQUE") {
        endpoint =
          apiUrl + "/Clientes/PostClientePagarDeudaChequeByIdCliente";
        requestBody = {
          montoPagado: montoAPagar,
          metodoPago: metodoPago,
          idUsuario: User.getInstance().getFromSesion().codigoUsuario,
          cheque: {
            idCuentaCorrientePago: 0,
            nombre: nombre,
            numeroCheque: nroOperacion, // Assuming this is where the cheque number goes
            fecha: fecha,
          },
        };
      } else if (metodoPago === "EFECTIVO") {
        endpoint = `${apiUrl
          }/Clientes/PostClientePagarDeudaEfectivoByIdCliente`;
        requestBody = {
          montoPagado: montoAPagar,
          metodoPago: metodoPago,
          idUsuario: User.getInstance().getFromSesion().codigoUsuario,
          efectivo: {
            idCuentaCorrientePago: 0,
            fecha: fecha,
          },
        };
      } else {
        if (!metodoPago) {
          setError("Por favor, selecciona un método de pago.");
          setLoading(false);
          return;
        } else setError("");
        requestBody = {
          montoPagado: montoAPagar,
          metodoPago: metodoPago,
          idUsuario: User.getInstance().getFromSesion().codigoUsuario,
        };
      }

      let deudaIds = [];
      let idCuentaCorrientePago = 0;

      if (paymentOrigin === "detalle" && selectedItem) {
        // Pago individual
        deudaIds = [
          {
            idCuentaCorriente: selectedItem.id,
            idCabecera: selectedItem.idCabecera,
            total: selectedItem.total,
          },
        ];
        idCuentaCorrientePago = selectedItem.id;
      } else {
        // Pago agrupado
        const selectedDeudas = proveedores.filter((deuda) => deuda.selected);
        if (selectedDeudas.length === 0) {
          setError("Por favor, selecciona al menos una deuda para pagar.");
          setLoading(false);
          return;
        }
        deudaIds = selectedDeudas.map((deuda) => ({
          idCuentaCorriente: deuda.id,
          idCabecera: deuda.idCabecera,
          total: deuda.total,
        }));
        idCuentaCorrientePago =
          deudaIds.length > 0 ? deudaIds[0].idCuentaCorriente : 0;
      }

      // Añadir deudaIds al cuerpo de la solicitud para todos los métodos de pago
      requestBody.deudaIds = deudaIds;

      console.log("Request Body antes de enviar:", requestBody);

      const response = await axios.post(endpoint, requestBody);

      console.log("Response:", response.data);
      console.log("ResponseStatus:", response.data.statusCode);
      ///acciones post pago////
      if (response.data.statusCode === 200) {
        setSnackbarOpen(true);
        setSnackbarMessage(response.data.descripcion);
        handleClosePaymentProcess();
        handleClosePaymentGroupProcess();
        setCantidadPagada(0);
        fetchClientes();
        // handleDetailClose();

        setTimeout(() => {
          handleClosePaymentGroupProcess();
        }, 2000);
      } else {
        console.error("Error al realizar el pago");
      }
    } catch (error) {
      console.error("Error al realizar el pago:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupedPayment = async () => {
    try {
      setLoading(true);

      let endpoint = `${apiUrl
        }/Clientes/PostClientePagarDeudaBackOfficeByIdCliente `;


      if (metodoPago === "TRANSFERENCIA") {
        endpoint = `${apiUrl
          }/Clientes/PostClientePagarDeudaTransferenciaByIdCliente`;

        if (
          nombre === "" ||
          rut === "" ||
          selectedBanco === "" ||
          tipoCuenta === "" ||
          nroCuenta === "" ||
          fecha === "" ||
          nroOperacion === ""
        ) {
          setTransferenciaError(
            "Por favor, completa todos los campos necesarios para la transferencia."
          );
          setLoading(false);
          return;
        }

        if (!validarRutChileno(rut)) {
          setTransferenciaError("El RUT ingresado NO es válido.");
          setLoading(false);
          return;
        }
      }

      if (!metodoPago) {
        setError("Por favor, selecciona un método de pago.");
        setLoading(false);
        return;
      } else setError("");

      const selectedDeudas = groupedProveedores.filter((deuda) =>
        selectedIds.includes(deuda.id)
      );
      if (selectedDeudas.length === 0) {
        setError("Por favor, selecciona al menos una deuda para pagar.");
        setLoading(false);
        return;
      }

      const deudaIds = selectedDeudas.map((deuda) => ({
        idCuentaCorriente: deuda.id,
        idCabecera: deuda.idCabecera,
        total: deuda.total,
      }));

      var requestBody = {
        deudaIds: deudaIds,
        idUsuario: User.getInstance().getFromSesion().codigoUsuario,
        montoPagado: montoAPagar,
        metodoPago: metodoPago
      };

      if (metodoPago === "TRANSFERENCIA") {
        requestBody.
          transferencias = {
          idCuentaCorrientePago:
            deudaIds.length > 0 ? deudaIds[0].idCuentaCorriente : 0,
          nombre: nombre,
          rut: rut,
          banco: selectedBanco,
          tipoCuenta: tipoCuenta,
          nroCuenta: nroCuenta,
          fecha: fecha,
          nroOperacion: nroOperacion,
        }
      }

      console.log("Request Body:", requestBody);

      const response = await axios.post(endpoint, requestBody);

      console.log("Response:", response.data);
      console.log("ResponseStatus:", response.data.statusCode);

      if (response.data.statusCode === 200) {
        setSnackbarOpen(true);
        setSnackbarMessage(response.data.descripcion);
        handleClosePaymentProcess();
        setCantidadPagada(0);
        fetchClientes();
        // handleDetailClose();
        handleTransferenciaModalClose2();
        handleClosePaymentGroupProcess();
        handlePagarClose();

        setTimeout(() => {
          handleClosePaymentProcess();
        }, 2000);
      } else {
        console.error("Error al realizar el pago");
      }
    } catch (error) {
      console.error("Error al realizar el pago:", error);
    } finally {
      setLoading(false);
    }
  };


  const compareRut = (a, b) => {
    if (!a || !b) return 0;
    return a.localeCompare(b);
  };

  const compareNumerical = (a, b) => {
    return a - b;
  };
  const compareDate = (a, b) => {
    return new Date(a) - new Date(b);
  };


  const sortData = (array, field, direction) => {
    const sortedArray = [...array];
    sortedArray.sort((a, b) => {
      let comparison = 0;
      if (field === "rut") {
        comparison = compareRut(a.rut, b.rut);
      } else if (field === "folio" || field === "total") {
        comparison = compareNumerical(parseInt(a[field]), parseInt(b[field]));
      } else if (field === "fecha") {
        comparison = compareDate(a.fechaIngreso, b.fechaIngreso);
      } else {
        comparison = a[field] > b[field] ? 1 : -1;
      }
      return direction === "asc" ? comparison : -comparison;
    });
    return sortedArray;
  };

  const handleToggle = (rut) => {
    setOpenGroups((prev) => ({
      ...prev,
      [rut]: !prev[rut],
    }));
  };

  const groupedData = proveedores.reduce((acc, item) => {
    if (!acc[item.rut]) {
      acc[item.rut] = [];
    }
    acc[item.rut].push(item);
    return acc;
  }, {});
  // console.log(" groupedData", groupedData);

  const filteredGroupKeys = Object.keys(groupedData).filter((rut) =>
    rut.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedGroupKeys = sortData(filteredGroupKeys, "rut", order.direction);

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Grid container sx={{ flexGrow: 1, p: 3 }} spacing={1}>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography variant="h5">Documentos por pagar</Typography>
          <br />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TextField
            label="Filtrar por RUT"
            variant="outlined"
            margin="normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <br />
          <Typography variant="p">Total General:</Typography>
          <Typography variant="p" sx={{
            margin: "0 20px"
          }}>
            <strong>
              ${System.formatMonedaLocal(totalGeneral,false)}
            </strong>
          </Typography>
          <br />
          <br />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>RUT</TableCell>
                  <TableCell>Razon Social</TableCell>
                  <TableCell>Documentos</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedGroupKeys.map((rut) => (
                  <ItemListado
                    key={rut}
                    rut={rut}
                    
                    groupedData={groupedData}
                    order={order}
                    handleSort={handleSort}
                    sortData={sortData}

                    handleDetailOpen={handleDetailOpen}

                    handlePagarOpen={handlePagarOpen}

                    handleOpenPaymentProcess={handleOpenPaymentProcess}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </Grid >
      </Grid >

      

      <PagoGeneral
        openPagar={openPagar}
        handlePagarClose={handlePagarClose}
        groupedProveedores={groupedProveedores}
        allSelected={allSelected}
        handleSelectAll={handleSelectAll}
        handleSelectOne={handleSelectOne}
        selectedTotal={selectedTotal}
        selectedIds={selectedIds}
        handleOpenGroupPaymentProcess={handleOpenGroupPaymentProcess}
      />

      {/* <PagoGrupal
        openPaymentProcess={openPaymentProcess}
        montoAPagar={montoAPagar}
        cantidadPagada={cantidadPagada}
        metodoPago={metodoPago}
        calcularVuelto={calcularVuelto}
        loading={loading}
        setMetodoPago={setMetodoPago}
        setCantidadPagada={setCantidadPagada}
        selectedProveedor={selectedProveedor}
        groupedProveedores={groupedProveedores}
        handleTransferenciaModalOpen2={handleTransferenciaModalOpen2}
        handleGroupedPayment={handleGroupedPayment}
        handleClosePaymentProcess={handleClosePaymentProcess}
        error={error}
      /> */}


      <PagoDetalle
        openPaymentProcess={openPaymentProcess}
        montoAPagar={montoAPagar}
        cantidadPagada={cantidadPagada}
        setCantidadPagada={setCantidadPagada}
        calcularVuelto={calcularVuelto}
        metodoPago={metodoPago}
        setMetodoPago={setMetodoPago}
        selectedProveedor={selectedProveedor}
        groupedProveedores={groupedProveedores}
        loading={loading}
        handleTransferenciaModalOpen={handleTransferenciaModalOpen}
        handleIndividualPayment={handleIndividualPayment}
        handleClosePaymentProcess={handleClosePaymentProcess}
        paymentOrigin={paymentOrigin}
        handleChequeModalOpen={handleChequeModalOpen}
        error={error}
      />

      <PagoParcial
        openPaymentGroupProcess={openPaymentGroupProcess}
        error={error}
        handleClosePaymentProcess={handleClosePaymentProcess}
        montoAPagar={montoAPagar}
        cantidadPagada={cantidadPagada}
        setCantidadPagada={setCantidadPagada}
        metodoPago={metodoPago}
        setMetodoPago={setMetodoPago}
        selectedProveedor={selectedProveedor}
        groupedProveedores={groupedProveedores}
        handleChequeModalOpen={handleChequeModalOpen}
        loading={loading}
        paymentOrigin={paymentOrigin}
        handleTransferenciaModalOpen2={handleTransferenciaModalOpen2}
        handleGroupedPayment={handleGroupedPayment}
        handleClosePaymentGroupProcess={handleClosePaymentGroupProcess}
      />

      <PagoTransferencia
        openDialog={openTransferenciaModal}
        setOpenDialog={setOpenTransferenciaModal}
        onConfirm={(data) => {
          setNombre(data.nombre)
          setRut(data.rut)
          setSelectedBanco(data.banco)
          handleChangeTipoCuenta(data.tipoCuenta)
          setNroCuenta(data.nroCuenta)
          setFecha(data.fecha)
          setNroOperacion(nroOperacion)
        }}
      />

      <PagoTransferencia
        openDialog={openTransferenciaModal2}
        setOpenDialog={setOpenTransferenciaModal2}
        onConfirm={(data) => {
          setNombre(data.nombre)
          setRut(data.rut)
          setSelectedBanco(data.banco)
          setTipoCuenta(data.tipoCuenta)
          setTipoCuenta(data.tipoCuenta)
          setNroCuenta(data.nroCuenta)
          setFecha(data.fecha)
          setNroOperacion(nroOperacion)
        }}
      />

      <PagoCheque
        openDialog={openChequeModal}
        setOpenDialog={setOpenChequeModal}
        metodoPago={metodoPago}
        handlePayment={handlePayment}
        loading={loading}
        cantidadPagada={cantidadPagada}
        onConfirm={(data) => {
          setNombre(data.nombre)
          setRut(data.rut)
          setSelectedBanco(data.banco)
          setNroCuenta(data.nroCuenta)
          setFecha(data.fecha)
          setNroDocumento(data.nroDocumento)
          setSerieCheque(data.serieCheque)
        }}
      />
    </div >
  );
};

export default DocumentosPorPagar;
