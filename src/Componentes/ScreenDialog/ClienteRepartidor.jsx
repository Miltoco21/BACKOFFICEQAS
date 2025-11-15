import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import TableRepartidores from "../ScreenDialog/Repartidores/TableRepartidores";
import Client from "../../Models/Client";
import User from "../../Models/User";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const ClienteRepartidor = ({ cliente, open, onClose, onAsociarSuccess }) => {
  const { showLoading, hideLoading, showMessage } = useContext(
    SelectedOptionsContext
  );

  const [selectedRepartidor, setSelectedRepartidor] = useState(null);
  const [asociando, setAsociando] = useState(false);
  const [desasociandoId, setDesasociandoId] = useState(null);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [clientInstance, setClientInstance] = useState(null);
  const [repartidoresAsociados, setRepartidoresAsociados] = useState([]);
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
  const [repartidorConfirmacion, setRepartidorConfirmacion] = useState(null);

  // Crear instancia del cliente
  useEffect(() => {
    if (cliente && open) {
      const instance = Client.getInstance();
      instance.fill(cliente);
      setClientInstance(instance);

      // Cargar repartidores asociados usando el modelo User
      User.getRepartidoresAsociados(
        cliente.codigoCliente,
        (repartidores) => setRepartidoresAsociados(repartidores),
        (errorMsg) => {
          console.error("Error cargando repartidores asociados:", errorMsg);
          setError("Error al cargar repartidores asociados");
        }
      );
    }
  }, [cliente, open]);

  // Verificar si un repartidor ya está asociado
  const estaAsociado = (repartidorId) => {
    if (!cliente?.repartidoresAsociados) return false;

    return cliente.repartidoresAsociados.some(
      (asociado) => String(asociado.codigoUsuario) === String(repartidorId)
    );
  };

  // Abrir modal de confirmación para desasociar
  const abrirConfirmacionDesasociar = (repartidor) => {
    setRepartidorConfirmacion(repartidor);
    setConfirmacionAbierta(true);
  };

  // Cerrar modal de confirmación sin desasociar
  const cerrarConfirmacion = () => {
    setConfirmacionAbierta(false);
    setRepartidorConfirmacion(null);
  };

  // Confirmar y ejecutar la desasociación
  const confirmarDesasociar = () => {
    if (repartidorConfirmacion) {
      ejecutarDesasociar(repartidorConfirmacion);
      setConfirmacionAbierta(false);
    }
  };

  // Función para desasociar repartidor
  const ejecutarDesasociar = (repartidor) => {
    if (!clientInstance) {
      setError("No se ha inicializado el cliente");
      return;
    }

    setDesasociandoId(repartidor.codigoUsuario);
    setError(null);

    clientInstance.desasociarRepartidor(
      repartidor.codigoUsuario,
      (response) => {
        //showMessage("response")
        //console.log("✅ Desasociación exitosa. Respuesta:", response);
        onAsociarSuccess({
          cliente: {
            id: cliente.codigoCliente,
            nombre: cliente.nombre + " " + cliente.apellido,
          },
          repartidor: {
            id: repartidor.codigoUsuario,
            nombre: repartidor.nombre + " " + repartidor.apellido,
            rol: repartidor.rol,
          },
          response: response,
          action: "disassociate",
        });

        // Actualizar lista local de repartidores asociados
        setRepartidoresAsociados(
          repartidoresAsociados.filter(
            (r) => r.codigoUsuario !== repartidor.codigoUsuario
          )
        );
        setDesasociandoId(null);
      },
      (errorMsg) => {
        console.error("❌ Error en la desasociación:", errorMsg);
        setError(`Error al desasociar: ${errorMsg}`);
        setDesasociandoId(null);
      }
    );
  };

  // Asociar repartidor con cliente
  const handleAsociar = async () => {
    if (selectedRepartidor && estaAsociado(selectedRepartidor.codigoUsuario)) {
      setError("Este repartidor ya está asociado al cliente");
      return;
    }

    // Verificar que tenemos los datos necesarios
    if (!selectedRepartidor || !clientInstance) {
      const errorMsg = "Datos incompletos para realizar la asociación";
      console.error(errorMsg, {
        selectedRepartidor,
        clientInstance,
        cliente,
      });
      setError(errorMsg);
      return;
    }

    setAsociando(true);
    setError(null);

    // console.groupCollapsed("Iniciando asociación cliente-repartidor");
    // console.log("Cliente:", {
    //   id: cliente.codigoCliente,
    //   nombre: cliente.nombre,
    //   apellido: cliente.apellido,
    //   sucursal: cliente.clienteSucursal
    // });

    // console.log("Repartidor seleccionado:", {
    //   id: selectedRepartidor.codigoUsuario,
    //   nombre: selectedRepartidor.nombres,
    //   apellido: selectedRepartidor.apellidos,
    //   rol: selectedRepartidor.rol
    // });
    // console.groupEnd();

    try {
      clientInstance.asociarRepartidor(
        selectedRepartidor.codigoUsuario,
        (response) => {
          // console.log("✅ Asociación exitosa. Respuesta:", response);

          onAsociarSuccess({
            cliente: {
              id: cliente.codigoCliente,
              nombre: cliente.nombre + " " + cliente.apellido,
            },
            repartidor: {
              id: selectedRepartidor.codigoUsuario,
              nombre:
                selectedRepartidor.nombres + " " + selectedRepartidor.apellidos,
              rol: selectedRepartidor.rol,
            },
            response: response,
            action: "associate",
          });

          setAsociando(false);
          onClose();
        },
        (errorMsg) => {
          // Clasificación de errores
          let errorDisplay = "Error al crear la asociación";

          if (errorMsg.includes("400")) {
            errorDisplay = "Datos inválidos enviados al servidor";
          } else if (errorMsg.includes("404")) {
            errorDisplay = "Recurso no encontrado en el servidor";
          } else if (errorMsg.includes("500")) {
            errorDisplay = "Error interno del servidor";
          } else if (errorMsg.includes("No se recibió respuesta")) {
            errorDisplay = "El servidor no respondió. Verifica tu conexión";
          }

          console.error("❌ Error en la asociación:", errorMsg);
          setError(`${errorDisplay}: ${errorMsg}`);
          setAsociando(false);
        }
      );
    } catch (e) {
      // Manejo de errores síncronos inesperados
      const errorMsg = e instanceof Error ? e.message : "Error desconocido";
      //console.error("⚠️ Excepción inesperada en handleAsociar:", e);

      setError(`Error inesperado: ${errorMsg}`);
      setAsociando(false);
    } finally {
      //console.log("--- Finalizado proceso de asociación ---");
    }
  };

  return (
    <>
      {/* Diálogo principal */}
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 2, overflow: "hidden" } }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Asociar Cliente con Repartidor
            </Typography>
            <Typography variant="subtitle2">
              Código Cliente: {cliente?.codigoCliente}
            </Typography>
            <Typography variant="subtitle2">
              Cliente: {cliente?.nombre} {cliente?.apellido} {cliente?.rut}
            </Typography>
            <Typography variant="subtitle2">
            Rut: {cliente?.rut}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {/* Información del cliente */}
          <Box
            mb={3}
            p={2}
            bgcolor="#fff8e1"
            borderRadius={1}
            border="1px solid #ffe0b2"
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              mb={1}
              color="#f57c00"
            >
              Asociaciones Actuales:
            </Typography>

            {repartidoresAsociados.length > 0 ? (
              <>
                <Box display="flex" alignItems="center" mb={1}>
                  <Chip
                    label={`${repartidoresAsociados.length} asociados`}
                    color="warning"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2">
                    Este cliente ya tiene repartidores asociados
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box maxHeight={200} overflow="auto">
                  {repartidoresAsociados.map((repartidor, index) => (
                    <Box
                      key={index}
                      mb={1}
                      p={1.5}
                      bgcolor="#fffde7"
                      borderRadius={1}
                      sx={{ "&:hover": { bgcolor: "#fff9c4" } }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography fontWeight={500} color="#5d4037">
                          Repartidor #{index + 1}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            abrirConfirmacionDesasociar(repartidor)
                          }
                          disabled={desasociandoId !== null}
                          color="error"
                        >
                          {desasociandoId === repartidor.codigoUsuario ? (
                            <CircularProgress size={20} />
                          ) : (
                            <DeleteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                      <Box pl={1}>
                        <Typography variant="body2">
                          <strong>Nombre:</strong> {repartidor.nombre}{" "}
                          {repartidor.apellido}
                        </Typography>
                        <Typography variant="body2">
                          <strong>ID:</strong> {repartidor.codigoUsuario}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Este cliente no tiene repartidores asociados actualmente
              </Typography>
            )}
          </Box>

          {/* Mensajes de estado */}
          {error && (
            <Box mb={2} p={1.5} bgcolor="#ffebee" borderRadius={1}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          {/* Tabla de repartidores */}
          <TableRepartidores
            onSelectRepartidor={setSelectedRepartidor}
            selectedRepartidor={selectedRepartidor}
            estaAsociado={estaAsociado}
            roles={roles}
          />

          {/* Repartidor seleccionado */}
          {selectedRepartidor && (
            <Box
              mt={3}
              p={2}
              bgcolor="#e8f5e9"
              borderRadius={1}
              border="1px solid #c8e6c9"
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                mb={1}
                color="#2e7d32"
              >
                Repartidor seleccionado:
              </Typography>
              <Box>
                <Typography>
                  <strong>Nombre:</strong> {selectedRepartidor.nombres}{" "}
                  {selectedRepartidor.apellidos}
                </Typography>
                <Typography>
                  <strong>RUT:</strong> {selectedRepartidor.rut || "N/A"}
                </Typography>
                <Typography>
                  <strong>Teléfono:</strong>{" "}
                  {selectedRepartidor.telefono || "N/A"}
                </Typography>
                <Typography>
                  <strong>Rol:</strong>{" "}
                  {selectedRepartidor.rol === "5"
                    ? "Repartidor Interno"
                    : "Repartidor Externo"}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, bgcolor: "#f5f5f5" }}>
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={asociando || desasociandoId !== null}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleAsociar}
            variant="contained"
            color="primary"
            disabled={
              !selectedRepartidor || asociando || desasociandoId !== null
            }
            startIcon={asociando ? <CircularProgress size={20} /> : null}
            sx={{ minWidth: 180 }}
          >
            {asociando ? "Asociando..." : "Confirmar Asociación"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para desasociar */}
      <Dialog
        open={confirmacionAbierta}
        onClose={cerrarConfirmacion}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Confirmar desasociación
          </Typography>
          <IconButton onClick={cerrarConfirmacion} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Box mb={2} p={2} bgcolor="#ffebee" borderRadius={1}>
            <Typography variant="body1" fontWeight={600}>
              ¿Estás seguro que deseas desasociar este repartidor?
            </Typography>
          </Box>

          {repartidorConfirmacion && (
            <Box p={2} border="1px solid #e0e0e0" borderRadius={1} mb={2}>
              <Typography variant="subtitle1" fontWeight={600}>
                Información del repartidor:
              </Typography>
              <Box pl={1} mt={1}>
                <Typography>
                  <strong>Nombre:</strong> {repartidorConfirmacion.nombre}{" "}
                  {repartidorConfirmacion.apellido}
                </Typography>
                <Typography>
                  <strong>ID:</strong> {repartidorConfirmacion.codigoUsuario}
                </Typography>
                <Typography>
                  <strong>Cliente:</strong> {cliente?.nombre}{" "}
                  {cliente?.apellido} (ID: {cliente?.codigoCliente})
                </Typography>
              </Box>
            </Box>
          )}

          <Typography variant="body2" color="text.secondary">
            Esta acción eliminará permanentemente la asociación entre el cliente
            y el repartidor.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, bgcolor: "#f5f5f5" }}>
          <Button
            onClick={cerrarConfirmacion}
            variant="outlined"
            color="primary"
            disabled={desasociandoId !== null}
          >
            Cancelar
          </Button>

          <Button
            onClick={confirmarDesasociar}
            variant="contained"
            color="secondary"
            disabled={desasociandoId !== null}
            startIcon={
              desasociandoId === repartidorConfirmacion?.codigoUsuario ? (
                <CircularProgress size={20} />
              ) : null
            }
            sx={{ minWidth: 150 }}
          >
            {desasociandoId === repartidorConfirmacion?.codigoUsuario
              ? "Desasociando..."
              : "Confirmar desasociación"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClienteRepartidor;
