import dayjs from "dayjs";

const BaseConfig =  {
    shopName:'EasyPOSLite',
    urlBase : (import.meta.env.VITE_URL_BASE),
    sesionStart: dayjs().format('DD/MM/YYYY-HH:mm:ss'),
    sesionExprire: 2 * 60 * 1000, //en milisegundos
    margenGanancia: 30, //en %
    iva: 19, //en %
    cantidadDescripcionCorta:30,
    porcentajeMargen:30,
    buttonDelayClick: 1500, //en milisegundos

    tipoPrecioCosto:1
};

export default BaseConfig;