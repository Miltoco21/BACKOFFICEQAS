import React, { useState } from 'react';
import {
  
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
 } from 'react-router-dom';

 
import Home from './Pages/Home';
import Registro from './Pages/Registro';
import Login from './Pages/Login';
import Usuarios from './Pages/Usuarios';
import Precios from './Pages/Precios';
import Proveedores from './Pages/Proveedores';
import Productos from './Pages/Productos';
import Clientes from './Pages/Clientes';
import IngresoDocumento from './Pages/IngresoDocumentoProvedor';
import Categorias from './Pages/Categoria';
import SubCategorias from './Pages/SubCategoria';
import Familias from './Pages/Familias';
import SubFamilias from './Pages/SubFamilias';
import ProtectedRoute from './Componentes/ProtectedRoute';
import ProveedoresDocumentosPorPagar from './Pages/ProveedoresDocumentosPorPagar';
import Reportes from './Pages/Reportes';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ReportesClientes from './Pages/ReportesClientes';
import ReportesCtaCorriente from './Pages/ReportesCtaCorriente';
import ReportesCtaCorrienteProv from './Pages/ReportesCtaCorrienteProv';
import RankingVentas from './Pages/RankingVentas';
import RankingProductos from './Pages/RankingProductos';
import RankingLibroVentas from './Pages/RankingLibroVentas';
import RankingLibroCompras from './Pages/RankingLibroCompras';

import { SelectedOptionsProvider } from "./Componentes/Context/SelectedOptionsProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SelectedOptionsProvider>
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/registro" element={<Registro />} />
            <Route
              path="/home"
              element={<ProtectedRoute element={<Home/>} />}
            />

            <Route
              path="/"
              element={<ProtectedRoute element={<Home/>} />}
            />
            <Route path="/usuarios" element={<ProtectedRoute element={<Usuarios />} />} />
            <Route path="/precios" element={<ProtectedRoute element={<Precios />} />} />
            <Route path="/proveedores" element={<ProtectedRoute element={<Proveedores />} />} />
            <Route path="/clientes" element={<ProtectedRoute element={<Clientes />} />} />
            <Route path="/clientes/reportes" element={<ProtectedRoute element={<ReportesClientes />} />} />
            <Route path="/productos" element={<ProtectedRoute element={<Productos />} />} />
            <Route path="/productos/categorias" element={<ProtectedRoute element={<Categorias />} />} />
            <Route path="/productos/subcategorias" element={<ProtectedRoute element={<SubCategorias />} />} />
            <Route path="/productos/familias" element={<ProtectedRoute element={<Familias />} />} />
            <Route path="/productos/subfamilias" element={<ProtectedRoute element={<SubFamilias />} />} />
            <Route path="/proveedores/ingresodocumento" element={<ProtectedRoute element={<IngresoDocumento />} />} />
            <Route path="/proveedores/reportes" element={<ProtectedRoute element={<ProveedoresDocumentosPorPagar />} />} />
            <Route path="reportes" element={<ProtectedRoute element={<Reportes />} />} />
            <Route path="reportes/cuentacorrienteclientes" element={<ProtectedRoute element={<ReportesCtaCorriente />} />} />
            <Route path="reportes/cuentacorrienteproveedores" element={<ProtectedRoute element={<ReportesCtaCorrienteProv />} />} />
            <Route path="reportes/rankingventas" element={<ProtectedRoute element={<RankingVentas />} />} />
            <Route path="reportes/rankingproductos" element={<ProtectedRoute element={<RankingProductos />} />} />
            <Route path="reportes/rankinglibroventas" element={<ProtectedRoute element={<RankingLibroVentas />} />} />
            <Route path="reportes/rankinglibrocompras" element={<ProtectedRoute element={<RankingLibroCompras />} />} />
          </Routes>
        </SelectedOptionsProvider>
      </LocalizationProvider>
  );
}

export default App;
