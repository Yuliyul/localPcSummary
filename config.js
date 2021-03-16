const db_settings = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    // database: process.env.DB_DB || 'kasselocal',
    database: process.env.DB_DB || 'offline',
};
const tse_profile = 'C:\\ProgramData\\EFR\\gbl\\profile.cfg';
const php_log = 'C:\\xampp\\php\\logs\\php_error_log';
// const app_path = 'C:\\xampp\\htdocs\\local';
const app_path = 'D:\\htdocs\\offline';
// const app_path = process.env.APP_PATH || 'C:\\xampp\\htdocs\\local';
const terminal_log = app_path + '\\zvt\\zvt.log';
const fiscal_log = app_path + '\\tse\\SWISS_TELENORMA_SW\\JavaBridge.log';
const local_conf = app_path + '\\localConfig.conf';
const server_url = 'http://localhost:3005/kasses/add';
// const server_url = 'https://khazran-test-server.herokuapp.com/add';
module.exports = {
    db_settings,
    php_log,
    fiscal_log,
    terminal_log,
    app_path,
    local_conf,
    server_url,
    tse_profile,
};
