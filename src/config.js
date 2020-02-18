/**
 * Default config for all environment types
 * @type {{db: string, apiPort: number}}
 */
const defaultConfig = {
    // db: 'mongodb+srv://admin:admin_123@nestrom-playground1-hofdl.mongo db.net/test?retryWrites=true&w=majority',
    db: 'mongodb+srv://admin:admin_123@nestrom-playground1-hofdl.mongodb.net/test?retryWrites=true&w=majority',
    apiPort: 3000,
  elasticUrl:'https://search-osama-elastic-yesnuliljxd4564aphv4kemhly.eu-west-1.es.amazonaws.com'

};

/**
 * Enviroment specific configuration
 * @type {{prod: {}, dev: {}, test: {apiPort: number}}}
 */
const envConfig = {
    prod: {
        db: 'mongodb+srv://admin:admin_123@nestrom-playground1-hofdl.mongodb.net/test?retryWrites=true&w=majority',
        apiPort: process.env.PORT || 3000,
      elasticUrl:'https://search-osama-elastic-yesnuliljxd4564aphv4kemhly.eu-west-1.es.amazonaws.com'

    },
    dev: {
        db: 'mongodb+srv://admin:admin_123@nestrom-playground1-hofdl.mongodb.net/test?retryWrites=true&w=majority',
        apiPort: process.env.PORT || 3000,
      elasticUrl:'https://search-osama-elastic-yesnuliljxd4564aphv4kemhly.eu-west-1.es.amazonaws.com'
    },
    test: {
        apiPort: 3000
    }
};

/**
 * Loads config based on the current environment
 * @returns {*}
 */
function loadConfig() {
    const env = process.env.NODE_ENV || 'dev';

    if (!envConfig[env]) {
        throw new Error(
            `Environment config for environment '${env}' not found. process.env.NODE_ENV must be one of '${Object.keys(
                envConfig
            )}'`
        );
    }

    console.log('[INFO] config loaded for environment: ', env);

    // merge default config with environment specific config
    return Object.assign({}, defaultConfig, envConfig[env]);
}

export default loadConfig();
