import React, { useState, useEffect, useContext } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  TextField
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { SelectedOptionsContext } from '../../Context/SelectedOptionsProvider'
import IngresoCentroCostos from './IngresoCentrodeCosto'
import CentroDeCostos from '../../../Models/CentrodeCostos'

const SearchListCentroCostos = ({ refresh, onEdit }) => {
  const { showConfirm, showLoading, hideLoading, showMessage } = useContext(
    SelectedOptionsContext
  )

  const [centrosCostos, setCentrosCostos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados para búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 15

  // Estados para eliminación (eliminamos los de edición porque se manejan en el padre)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCentro, setSelectedCentro] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  // Función para cargar centros de costos (sin useCallback para evitar bucle infinito)
  const loadCentrosCostos = () => {
    setLoading(true)
    showLoading('Cargando centros de costos...')

    const costCenterModel = CentroDeCostos.getInstance()

    costCenterModel.getAll(
      data => {
        setCentrosCostos(data)
        setLoading(false)
        hideLoading()
        console.log('Centros de costos cargados:', data.length) // Debug
      },
      errorMsg => {
        setError(errorMsg)
        setLoading(false)
        hideLoading()
        setSnackbar({
          open: true,
          message: `Error: ${errorMsg}`,
          severity: 'error'
        })
      }
    )
  }

  // Efecto principal para cargar datos
  useEffect(() => {
    loadCentrosCostos()
  }, [refresh])

  // Filtrar y paginar resultados
  const filteredCentros = centrosCostos.filter(centro =>
    centro.descripcion?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  )

  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage
  const paginatedCentros = filteredCentros.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredCentros.length / perPage) || 1

  const handleOpenEdit = centro => {
    // Llamar a la función del componente padre para manejar la edición
    if (onEdit) {
      onEdit(centro)
    }
  }

  const handleCloseEdit = () => {
    // Ya no necesitamos esta función porque el diálogo se maneja en el padre
    // Pero la mantenemos para compatibilidad
  }

  const handleOpenDelete = centro => {
    setSelectedCentro(centro)
    setShowDeleteDialog(true)
  }

  const handleCloseDelete = () => {
    setShowDeleteDialog(false)
    setSelectedCentro(null)
  }

  const handleDelete = centro => {
    showConfirm(`¿Eliminar el centro de costo "${centro.descripcion}"?`, () => {
      showLoading('Eliminando centro de costo...')

      const costCenterModel = CentroDeCostos.getInstance()

      costCenterModel.delete(
        centro.id,
        response => {
          hideLoading()
          showMessage('Centro de costo eliminado correctamente')
          // Actualizar inmediatamente después de eliminar
          loadCentrosCostos()
        },
        errorMsg => {
          hideLoading()
          showMessage('Error al eliminar centro de costo')
          console.error('Error eliminando:', errorMsg)
        }
      )
    })
  }

  // Función mejorada para manejar el éxito al guardar/actualizar
  // Esta función ya no es necesaria porque se maneja en el componente padre
  const handleSaveSuccess = (isEdit = false) => {
    // Función mantenida para compatibilidad, pero no se usa
    console.log('handleSaveSuccess en SearchList - ya no se usa')
  }

  // Función para manejar errores al guardar  
  // Esta función ya no es necesaria porque se maneja en el componente padre
  const handleSaveError = (errorMsg) => {
    // Función mantenida para compatibilidad, pero no se usa
    console.log('handleSaveError en SearchList - ya no se usa')
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Función para crear nuevo centro de costo (usando el componente padre)
  const handleCreateNew = () => {
    if (onEdit) {
      onEdit(null) // Pasamos null para indicar que es creación
    }
  }

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Barra de búsqueda */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder='Buscar centros de costo...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
       
      </Box>

      {/* Tabla con paginación */}
      {filteredCentros.length === 0 ? (
        <Box
          p={3}
          textAlign='center'
          border={1}
          borderColor='#eee'
          borderRadius={1}
        >
          <Typography>
            {searchTerm
              ? 'No se encontraron centros de costo'
              : 'No hay centros de costo registrados'}
          </Typography>
          <Button
            variant='contained'
            sx={{ mt: 2 }}
            onClick={handleCreateNew}
          >
            Crear nuevo centro de costo
          </Button>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCentros.map(centro => (
                  <TableRow key={centro.id} hover>
                    <TableCell>{centro.id}</TableCell>
                    <TableCell>
                      <span style={{ fontWeight: 500 }}>
                        {centro.descripcion}
                      </span>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenEdit(centro)}
                        size='small'
                        sx={{ mr: 1 }}
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(centro)}
                        size='small'
                        title="Eliminar"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación mejorada */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography variant='body2'>
              Mostrando {startIndex + 1}-{Math.min(endIndex, filteredCentros.length)} de {filteredCentros.length} registros
            </Typography>
            <Typography variant='body2'>
              Página {currentPage} de {totalPages}
            </Typography>
            <Box>
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                size="small"
              >
                Anterior
              </Button>
              <Button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
                size="small"
              >
                Siguiente
              </Button>
            </Box>
          </Box>
        </>
      )}

      {/* Componente de ingreso eliminado - ahora se maneja en el componente padre */}
      
      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        action={
          <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  )
}

export default SearchListCentroCostos