/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditarFamilia from "./EditarFamilia";
import ModelConfig from "../../Models/ModelConfig";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const ITEMS_PER_PAGE = 10;

const SearchListFamilias = () => {

  const {
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const apiUrl = ModelConfig.get().urlBase;
  const [searchTerm, setSearchTerm] = useState("");
  const [families, setFamilies] = useState([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [subcategories, setSubCategories] = useState([]);
  const [filteredFamilies, setFilteredFamilies] = useState([]);

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFamilyData, setEditFamilyData] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [pageCategories, setPageCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditSuccessful, setIsEditSuccessful] = useState(false);

  const setPageCount = (categoriesCount) => {
    setTotalPages(Math.ceil(categoriesCount / ITEMS_PER_PAGE));
  };

  const updatePageData = () => {
    setPageFamilies(
      filteredFamilies.slice(
        ITEMS_PER_PAGE * (currentPage - 1),
        ITEMS_PER_PAGE * currentPage
      )
    );
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  //
  useEffect(() => {
    setTotalPages(Math.ceil(filteredFamilies.length / ITEMS_PER_PAGE));
  }, [setFilteredFamilies]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        showLoading("Cargando categorias...")
        const response = await axios.get(
          apiUrl + `/NivelMercadoLogicos/GetAllCategorias`
        );
        console.log("API response:", response.data.categorias);
        setCategories(response.data.categorias);
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
          console.log(
            apiUrl + `/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?$CategoriaID=${selectedCategoryId}`
          );
          console.log("Subcategories Response:", response.data.subCategorias);
          setSubCategories(response.data.subCategorias);
          hideLoading()
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          hideLoading()
        }
      }
    };

    fetchSubCategories();
  }, [selectedCategoryId]);

  const fetchFamilies = async () => {
    if (selectedSubCategoryId !== "" && selectedCategoryId !== "") {
      showLoading("Cargando familias...")
      try {
        const response = await axios.get(
          apiUrl + `/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?SubCategoriaID=${selectedSubCategoryId}&CategoriaID=${selectedCategoryId}`
        );
        console.log("API Response:", response.data.familias);
        setFamilies(response.data.familias);
        hideLoading()
      } catch (error) {
        console.error("Error fetching families:", error);
        hideLoading()
      }
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, [selectedSubCategoryId]);

  useEffect(() => {
    if (isEditSuccessful) {
      setOpenEditModal(false); // Close the modal on successful edit
    }
  }, [isEditSuccessful]);

  const handleEdit = (family) => {
    setEditFamilyData(family);
    setOpenEditModal(true);
    setIsEditSuccessful(false);
  };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
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
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Familia</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {families && families.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2}>No hay familias para mostrar</TableCell>
            </TableRow>
          ) : (
            families.map((family) => (
              <TableRow key={family.idFamilia}>
                <TableCell>{family.idFamilia}</TableCell>
                <TableCell>{family.descripcion}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(family)}>
                    <EditIcon />
                  </IconButton>
                  {/* <IconButton onClick={() => handleDelete(family.idFamilia)}>
                    <DeleteIcon />
                  </IconButton> */}
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
        showFirstButton
        showLastButton
      />
      <EditarFamilia
        family={editFamilyData}
        open={openEditModal}
        handleClose={handleCloseEditModal}
        fetchFamilies={fetchFamilies}
      />
    </Box>
  );
};

export default SearchListFamilias;
