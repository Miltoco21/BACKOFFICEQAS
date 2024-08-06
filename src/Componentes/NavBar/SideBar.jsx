import React, { useState, useContext, useEffect } from "react";


import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CategoryIcon from "@mui/icons-material/Category";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PolylineIcon from '@mui/icons-material/Polyline';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import SchemaOutlinedIcon from '@mui/icons-material/SchemaOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SummarizeIcon from '@mui/icons-material/Summarize';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { IconButton, Typography } from "@mui/material";
import { Settings } from "@mui/icons-material";

import ScreenDialogConfig from "../ScreenDialog/AdminConfig";



const drawerWidth = 240;


export default function PermanentDrawerLeft() {
  const [openSubMenu, setOpenSubMenu] = useState({});
  const [showScreenConfig, setShowScreenConfig] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [subCurrentUrl, setSubCurrentUrl] = useState("");


  const handleSubMenuClick = (text) => {
    setOpenSubMenu((prevOpenSubMenu) => ({
      ...prevOpenSubMenu,
      [text]: !prevOpenSubMenu[text],
    }));
  };

  useEffect(()=>{
    if(currentUrl == ""){
      var urlArr = window.location.href.split("/")
      console.log("urlArr:")
      console.log(urlArr)
      if( urlArr.length > 4 ){
        setSubCurrentUrl("/" + urlArr[4] )
      }
      urlArr.splice(0,3)
      setCurrentUrl("/" + urlArr[0])
    }


    if(menuItems.length == 0){
      var menuItemsBase = [
        { text: "Home", link: "/", icon: <HomeIcon /> },
        { text: "Usuarios", link: "/usuarios", icon: <PeopleAltIcon /> },
        { text: "Precios", link: "/precios", icon: <PriceChangeIcon /> },
        {
          text: "Proveedores",
          link: "/proveedores",
          icon: <LocalShippingIcon />,
          subMenuItems: [
            { text: "Ingreso Documento", link: "/proveedores/ingresodocumento", icon: <ReceiptIcon /> },
            { text: "Documentos por pagar ", link: "/proveedores/reportes", icon: <ReceiptIcon /> },
          ],
        },
        { text: "Clientes", link: "/clientes", icon: <GroupsIcon/>, subMenuItems: [
          
          { text: "Documentos por cobrar", link: "/clientes/reportes", icon: <ReceiptIcon /> },
        ], },
        
        {
          text: "Productos",
          link: "/productos",
          icon: <CategoryIcon />,
          subMenuItems: [
            { text: "Categorias", link: "/productos/categorias",icon: <CategoryIcon />},
            { text: "Sub-Categorias", link: "/productos/subcategorias",icon: <PolylineIcon /> },
            { text: "Familia", link: "/productos/familias",icon:<StackedBarChartIcon/> },
            { text: "Sub-Familia", link: "/productos/subfamilias",icon:<SchemaOutlinedIcon/> },
            // Add more sub-menu items as needed
          ],
        },
        {
          text: "Reportes",
          link: "/reportes",

          icon: <FactCheckIcon />,
          subMenuItems: [
            { text: "Cuentas corrientes clientes", link: "/reportes/cuentacorrienteclientes",icon: <SummarizeIcon />},
            { text: "Cuentas corrientes proveedores", link: "/reportes/cuentacorrienteproveedores",icon: <SummarizeIcon />},
            { text: "Ranking de Venta", link: "/reportes/rankingventas",icon: <SummarizeIcon />},
            { text: "Ranking de Venta de Productos", link: "/reportes/rankingproductos",icon: <SummarizeIcon />},
            { text: "Libro de Ventas", link: "/reportes/rankinglibroventas",icon: <SummarizeIcon />},
            { text: "Libro de Compras", link: "/reportes/rankinglibrocompras",icon: <SummarizeIcon />},


          
          ],
        },
        {
          text: "Config",
          link: "#",
          
          icon: <Settings />,
          action: ()=>{
            console.log("ver config")
            setShowScreenConfig(true)
          }
        }

        

      ];
      setMenuItems(menuItemsBase)
    }

    

  },[])

  useEffect(()=>{
    // console.log("cambio items")
    menuItems.forEach((itemx,ix)=>{
      if(itemx.link == currentUrl){
        handleSubMenuClick(itemx.text)
      }
    })

  },[menuItems])


  useEffect(()=>{
    console.log("subcurrent es: " + subCurrentUrl)

  },[subCurrentUrl])



  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
           
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Divider />
        <List>
          {currentUrl != "" && menuItems.length>0 && menuItems.map((item) => {
            // console.log("currentUrl:")
            // console.log(currentUrl)
            // console.log("item:")
            // console.log(item)
            // console.log("es el current?" + ( currentUrl == item.link  ? "si" : "no") )


            return(
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <Link
                  onClick={()=>{
                    {item.action && (
                      item.action()
                    )}
                  }}
                  to={item.link}
                  style={{ 
                    textDecoration: "none", 
                    width:"100%",
                    backgroundColor:(currentUrl == item.link ? "#4d4d4d" : "transparent"),
                    color:(currentUrl == item.link ? "whitesmoke" : "black")
                  }}
                >
                  <ListItemButton onClick={() => handleSubMenuClick(item.text)}>
                    <ListItemIcon style={{
                      backgroundColor:(currentUrl == item.link ? "#4d4d4d" : "transparent"),
                      color:(currentUrl == item.link ? "whitesmoke" : "black")
                    }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {item.subMenuItems ? (
                      openSubMenu[item.text] ? <ExpandLess /> : <ExpandMore />
                    ) : null}
                  </ListItemButton>
                </Link>
              </ListItem>
              {item.subMenuItems && openSubMenu[item.text] && (
                <List component="div" disablePadding>
                  {item.subMenuItems.map((subItem) => {
                    console.log("")
                    console.log("subItem:")
                    console.log(subItem)
                    console.log("la union de currents seria:")
                    console.log(currentUrl + subCurrentUrl)
                    return(
                    <ListItem key={subItem.text} disablePadding>
                      <Link
                        to={subItem.link}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          width:"100%",
                          backgroundColor:(currentUrl + subCurrentUrl == subItem.link ? "#A0A0A0" : "transparent"),
                          color: "black"
                        }}
                        >

                        <ListItemButton>
                          <ListItemIcon />
                          <ListItemIcon>{subItem.icon}</ListItemIcon>
                          <ListItemText primary={subItem.text} />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                  )
                }
                )
                }
                </List>
              )}
            </React.Fragment>

          )}
        )}

        </List>
      </Drawer>
      <ScreenDialogConfig openDialog={showScreenConfig} setOpenDialog={setShowScreenConfig} />
    </Box>
  );
}
