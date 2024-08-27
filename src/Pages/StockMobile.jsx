/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import SideBar from "../Componentes/NavBar/SideBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import Modal from "@mui/joy/Modal";
import { SelectedOptionsContext } from "./../Componentes/Context/SelectedOptionsProvider";
import StepperSI from "../Componentes/Stepper/StepperSI";
import { HorizontalSplit } from "@mui/icons-material";
import Product from "../Models/Product";
import { TextField } from "@mui/material";
import Editp2 from "./../Componentes/Productos/Editp2";

const StockMobile = () => {

  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);


  const [open, setOpen] = useState(false);
  const [openAdd, setopenAdd] = useState(false);
  const [openEdit, setopenEdit] = useState(false);

  const [productoEdit, setProductEdit] = useState(null);



  const [open2, setOpen2] = useState(false);

  const handleOpenStepper = () => {
    setOpen(true);
  };
  const handleCloseStepper = () => {
    setOpen(false);
  };

  const handleOpenStepper2 = () => {
    setOpen2(true);
  };
  const handleCloseStepper2 = () => {
    setOpen2(false);
  };



  const [searchTerm, setSearchTerm] = useState("");

  const doSearch = (replaceSearch = "")=>{
    if(searchTerm == "" && replaceSearch == "")return

    
    var txtSearch = searchTerm
    if(txtSearch == "") {
      txtSearch = replaceSearch
      setSearchTerm(replaceSearch)
    }

          showLoading("haciendo busqueda por codigo")
          Product.getInstance().findByCodigoBarras({
            codigoProducto: txtSearch
          }, (prods,resp)=>{
            const res = resp.data
            console.log("res", res)
            if(res.cantidadRegistros>0){
              showMessage("existe el producto")

              setProductEdit(res.productos[0])
              setopenEdit(true)

            }else{
              showMessage("no existe el producto")
              setopenAdd(true)
            }
            
            hideLoading()
          }, ()=>{
            showMessage("no existe el producto")


            hideLoading()
          })
  }

  const checkEnterSearch = (e)=>{
    if(e.keyCode == 13){
      // console.log("apreto enter")
      doSearch()
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        

      <TextField
            sx={{
              marginTop:"30px",
              width:"250px",
            }}
            margin="dense"
            label="Buscar codigo"
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
            onKeyDown={(e)=>{
              checkEnterSearch(e)
            }}
          />
          <Button sx={{
              marginTop:"30px",
              marginLeft:"10px",
              height:"55px !important",
              width:"150px",
              color:"white",
              backgroundColor:"midnightblue",
              "&:hover": {
              backgroundColor: "#1c1b17 ",
              color: "white",
            },
            }}
            onClick={()=>{doSearch()}}
            >Buscar</Button>
            

        <Modal open={open} onClose={handleCloseStepper}>
          <Box
            sx={{
              // position: "absolute",
              // top: "50%",
              // left: "50%",
              // transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              // p: 4,
              overflow: "auto", // Added scrollable feature
              // maxHeight: "100vh", // Adjust as needed
              // maxWidth: "180vw", // Adjust as needed
              height:"40%",
              paddingTop:"10px",
              width:"85%",
              margin:"2.5% auto"
            }}
          >
           <StepperSI/> 
          </Box>
        </Modal>

      </Box>
        <Modal open={open2} onClose={handleCloseStepper2}>
          <Box
            sx={{
              // position: "absolute",
              // top: "50%",
              // left: "50%",
              // transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              // p: 4,
              overflow: "auto", // Added scrollable feature
              // maxHeight: "100vh", // Adjust as needed
              // maxWidth: "180vw", // Adjust as needed
              height:"40%",
              paddingTop:"10px",
              width:"85%",
              margin:"2.5% auto"
            }}
          >
            <StepperSI conCodigo={true} />
          </Box>
        </Modal>

        <Modal open={openAdd} onClose={()=>{ setopenAdd(false)}}>
          <Box
            sx={{
              // position: "absolute",
              // top: "50%",
              // left: "50%",
              // transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              // p: 4,
              overflow: "auto", // Added scrollable feature
              // maxHeight: "100vh", // Adjust as needed
              // maxWidth: "180vw", // Adjust as needed
              height:"40%",
              paddingTop:"10px",
              width:"85%",
              margin:"2.5% auto"
            }}
          >
            <Button
          size="large"
          variant="outlined"
          style={{ marginLeft: "18px", padding: "14px", marginTop: "6px" }}
          onClick={handleOpenStepper}
        >
          <Add/>
          Producto sin código
        </Button>
        <Button
          size="large"
          variant="outlined"
          style={{ marginLeft: "18px", padding: "14px", marginTop: "6px" }}
          
          onClick={handleOpenStepper2}
        >
          <HorizontalSplit sx={{transform: "rotate(270deg)"}}/>
          <Add sx={{
                width: "15px",
                position: "relative",
                left: "-7px"
          }}/>
          Producto con código
        </Button>


          </Box>
        </Modal>

        <Modal open={openEdit} onClose={()=>{ setopenEdit(false)}}>
          <Box
            sx={{
              // position: "absolute",
              // top: "50%",
              // left: "50%",
              // transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              // p: 4,
              overflow: "auto", // Added scrollable feature
              // maxHeight: "100vh", // Adjust as needed
              // maxWidth: "180vw", // Adjust as needed
              height:"40%",
              paddingTop:"10px",
              width:"85%",
              margin:"2.5% auto"
            }}
          >
            <Editp2
              product={productoEdit}
              open={openEdit}
              handleClose={()=>{
                setopenEdit(false)
              }}
            />
          </Box>
        </Modal>

    </div>
  );
};

export default StockMobile;
