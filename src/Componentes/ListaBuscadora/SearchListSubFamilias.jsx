/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  IconButton,
  Grid,
  Select,
  InputLabel,
  Pagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EditarSubFamilia from "./EditarSubFamilia"; // Make sure to provide the correct path
import ModelConfig from "../../Models/ModelConfig";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const ITEMS_PER_PAGE = 10;

const SearchListSubFamilias = () => {
  const {
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);
  const apiUrl = ModelConfig.get().urlBase;

  const [searchTerm, setSearchTerm] = useState("");
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [subcategories, setSubCategories] = useState([]);
  const [filteredSubFamilies, setFilteredSubFamilies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editSubFamilyData, setEditSubFamilyData] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSubFamilies, setPageSubFamilies] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const setPageCount = (subFamiliesCount) => {
    setTotalPages(Math.ceil(subFamiliesCount / ITEMS_PER_PAGE));
  };

  const updatePageData = () => {

    console.log("setPageSubFamilies:")
    console.log(filteredSubFamilies.slice(
      ITEMS_PER_PAGE * (currentPage - 1), // 10 * (1 - 1)///////0
      ITEMS_PER_PAGE * currentPage ///////// 10 * 1//////////10
    ))


    setPageSubFamilies(
      filteredSubFamilies.slice(
        ITEMS_PER_PAGE * (currentPage - 1), // 10 * (1 - 1)///////0
        ITEMS_PER_PAGE * currentPage ///////// 10 * 1//////////10
      )
    );
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    setPageCount(subfamilies.length);
    updatePageData();
    console.log("cantidad de paginas:" + Math.ceil(filteredSubFamilies.length / ITEMS_PER_PAGE))
    setTotalPages(Math.ceil(filteredSubFamilies.length / ITEMS_PER_PAGE));
  }, [filteredSubFamilies]);

  useEffect(() => {
    async function fetchCategories() {
      showLoading("Cargando categorias...")
      try {
        const response = await axios.get(
          apiUrl + `/NivelMercadoLogicos/GetAllCategorias`
        );
        setCategories(response.data.categorias);
        setSelectedCategoryId("")
        setSelectedSubCategoryId("")
        setSelectedFamilyId("")

        setSubCategories([]);
        setFamilies([]);
        setSubFamilies([]);
        hideLoading()
      } catch (error) {
        console.log(error);
        hideLoading()
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedCategoryId !== "") {
        showLoading("Cargando subcategorias...")
        try {
          const response = await axios.get(
            apiUrl + `/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=${selectedCategoryId}`
          );
          setSubCategories(response.data.subCategorias);
          setFamilies([]);
          setSubFamilies([]);
          hideLoading()
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          hideLoading()
        }
      }
    };

    fetchSubCategories();
  }, [selectedCategoryId]);

  useEffect(() => {
    const fetchFamilies = async () => {
      if (selectedSubCategoryId !== "" && selectedCategoryId !== "") {
        showLoading("Cargando familias...")
        try {
          const response = await axios.get(
            apiUrl + `/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?SubCategoriaID=${selectedSubCategoryId}&CategoriaID=${selectedCategoryId}`
          );
          setFamilies(response.data.familias);
          setSubFamilies([]);
          hideLoading()
        } catch (error) {
          console.error("Error fetching families:", error);
          hideLoading()
        }
      }
    };

    fetchFamilies();
  }, [selectedSubCategoryId]);

  const fetchSubFamilies = async () => {
    if (selectedFamilyId !== "" && selectedCategoryId !== "" && selectedSubCategoryId !== "") {
      showLoading("Cargando subfamilias...")
      try {
        const response = await axios.get(
          apiUrl + `/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?FamiliaID=${selectedFamilyId}&SubCategoriaID=${selectedSubCategoryId}&CategoriaID=${selectedCategoryId}`
        );
        console.log("subfamilias",response.data.subFamilias);
        setSubFamilies(response.data.subFamilias);
        hideLoading()
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        hideLoading()
      }
    }
  };
  
  useEffect(() => {
    fetchSubFamilies(); // Initial fetch of sub-families
  // }, [selectedFamilyId, selectedCategoryId, selectedSubCategoryId, refresh]);
  }, [selectedFamilyId, refresh]);

  useEffect(() => {
    console.log("cambio datos")
    setFilteredSubFamilies(subfamilies);
  }, [subfamilies]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    const filteredSubFamilies = subfamilies.filter((subfamily) =>
      subfamily.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubFamilies(filteredSubFamilies);
    setPageCount(filteredSubFamilies.length);
    updatePageData();
  };

  const handleEdit = (subfamily) => {
    setEditSubFamilyData(subfamily);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setRefresh((prevRefresh) => !prevRefresh);
  };

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <TextField label="Buscar..." value={searchTerm} onChange={handleSearch} />
      <Box sx={{ mt: 2 }}>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={12}>
              <Grid item xs={12} sm={6} md={10}>
                <InputLabel>Selecciona Categoría</InputLabel>
                <Select
                  fullWidth
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  label="Selecciona Categoría"
                >
                  {categories.map((category) => (
                    <MenuItem
                      key={category.idCategoria}
                      value={category.idCategoria}
                    >
                      {category.descripcion}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={12} sm={6} md={10}>
                <InputLabel>Selecciona Sub-Categoría</InputLabel>
                <Select
                  fullWidth
                  value={selectedSubCategoryId}
                  onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                  label="Selecciona Sub-Categoría"
                >
                  {subcategories.map((subcategory) => (
                    <MenuItem
                      key={subcategory.idSubcategoria}
                      value={subcategory.idSubcategoria}
                    >
                      {subcategory.descripcion}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={10}>
                <InputLabel>Selecciona Familia</InputLabel>
                <Select
                  fullWidth
                  value={selectedFamilyId}
                  onChange={(e) => setSelectedFamilyId(e.target.value)}
                  label="Selecciona Familia"
                >
                  {families.map((family) => (
                    <MenuItem key={family.idFamilia} value={family.idFamilia}>
                      {family.descripcion}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Sub-Familia</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pageSubFamilies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}>
                No hay sub-familias para mostrar
              </TableCell>
            </TableRow>
          ) : (
            pageSubFamilies.map((subfamily) => (
              <TableRow key={subfamily.idSubFamilia}>
                <TableCell>{subfamily.idSubFamilia}</TableCell>
                <TableCell>{subfamily.descripcion}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(subfamily)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
      />

      {/* Render edit modal */}
      <EditarSubFamilia
        subfamily={editSubFamilyData}
        open={openEditModal}
        handleClose={handleCloseEditModal}
        fetchSubfamilies={fetchSubFamilies} // Pass the fetchSubFamilies function
      />
    </Box>
  );
};

export default SearchListSubFamilias;
