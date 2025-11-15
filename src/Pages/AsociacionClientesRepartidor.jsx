import React from 'react';
import { Box, Button } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import SearchListClients from '../Componentes/Elements/Compuestos/SearchListClients';
//import SearchListAsociaciones from './SearchListAsociaciones'; // Componente personalizado
import SideBar from "../Componentes/NavBar/SideBar"
const AsociacionClientesRepartidor = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Button
          variant="outlined"
          sx={{ mb: 2 }}
          //disabled={true}
          //onClick={() => navigate(-1)} // Volver atrás
        >
         ASOCIAR CLIENTE / REPARTIDOR
        </Button>
        
        <SearchListClients />
        
        {/* Puedes añadir más componentes aquí */}
      </Box>
    </div>
  );
};

export default AsociacionClientesRepartidor;