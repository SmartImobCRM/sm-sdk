import util from "./modulos/util";
import velocidade from "./modulos/velocidade";
import * as admin from 'firebase-admin';

type firebaseConfig = {
    /**
     * URL do bucket de arquivos do seu projeto do firebase / Google cloud
     * 
     * @example "gs://meu-projeto-teste.appspot.com"
     */
    bucket: string
    /**
     * JSON da conta de serviço do firebase, precisa ser uma conta de serviço com permissões de administrador
     * 
     * @example {
            "type": "service_account",
            "project_id": "smartimob-dev-test",
            "private_key_id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "private_key": "-----BEGIN PRIVATE KEY-----xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n-----END PRIVATE KEY-----\n",
            "client_email": "firebase-adminsdkATxxxxxxxxxxxxx.iam.gserviceaccount.com",
            "client_id": "xxxxxxxxxxxxxxxxxxxxxxxx",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/xxxxxxxxxxxxxxxxxxxx.iam.gserviceaccount.com"
        }
     */
    serviceAcc: string | object
    /**
     * URL do do banco de dados do firebase
     * @example https://meu-projeto-teste.firebaseio.com
     */
    databaseURL: string
}
type initConfig = {
    firebase: firebaseConfig,
    UI: boolean
}

declare var global_firebase: {
    storage: admin.storage.Storage,
    config: initConfig
};

/**
 * Função de inicialização, é obrigatória caso queira fazer o upload dos resultados para um banco do firebase.
 */
export const init = (initOptions:initConfig):any => {
    const serv_acc = typeof initOptions.firebase.serviceAcc === 'object' ? JSON.stringify(initOptions.firebase.serviceAcc) : initOptions.firebase.serviceAcc 
    
    const app = admin.initializeApp({
        credential: admin.credential.cert(serv_acc),
        databaseURL: initOptions.firebase.databaseURL,
    });

    global_firebase = {
        storage: {
            app: app,
            bucket: () => admin.storage().bucket(initOptions.firebase.bucket)
        }, 
        config: initOptions
    }
    
    return global_firebase
};

export default {
    velocidade,
    util
}