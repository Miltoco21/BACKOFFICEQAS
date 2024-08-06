import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig";


class ModelConfig {
    static instance: ModelConfig | null = null;
    sesion: StorageSesion;

    constructor(){
        this.sesion = new StorageSesion("backconfig");
    }

    static getInstance():ModelConfig{
        if(ModelConfig.instance == null){
            ModelConfig.instance = new ModelConfig();
        }

        return ModelConfig.instance;
    }

    static get(){
        return ModelConfig.getInstance().sesion.cargar(1);
    }

    static change(propName, propValue){
        var all = ModelConfig.get();
        all[propName] = propValue;
        ModelConfig.getInstance().sesion.guardar(all); 
    }

    getAll(){
        return this.sesion.cargarGuardados();
    }

    getFirst(){
        if(!this.sesion.hasOne()){
            this.sesion.guardar(BaseConfig);
        }
        return(this.sesion.getFirst())
    }

};

export default ModelConfig;