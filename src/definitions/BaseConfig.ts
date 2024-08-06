import dayjs from "dayjs";

const BaseConfig =  {
    urlBase : "https://www.easyposdev.somee.com/api",//sin la ultima /
    sesionStart: dayjs().format('DD/MM/YYYY-HH:mm:ss'),
    sesionExprire: 2 * 60 * 1000, //en milisegundos
    buttonDelayClick: 1500, //en milisegundos
};

export default BaseConfig;