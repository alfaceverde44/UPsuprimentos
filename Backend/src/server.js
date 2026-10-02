// Ponto de entrada: sobe o servidor HTTP.
require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');
 
const PORT = process.env.PORT || 3000;
 
// Testa a conexao com o banco ANTES de dizer que esta tudo pronto.
// Assim, se o banco estiver com problema, a causa aparece aqui no
// terminal (e nao escondida num erro 500 generico no Postman).
async function checarBanco() {
  try {
    const conn = await pool.getConnection();
    await conn.query('SELECT 1');
    conn.release();
    console.log('[OK] Conectado ao banco MySQL:', process.env.DB_NAME);
  } catch (e) {
    console.error('\n=========================================================');
    console.error('[ERRO] Nao foi possivel conectar ao banco de dados!');
    console.error('Codigo:', e.code, '-', e.message);
    if (e.code === 'ECONNREFUSED')
      console.error('>> O servidor MySQL parece desligado. Inicie o servico MySQL.');
    else if (e.code === 'ER_ACCESS_DENIED_ERROR')
      console.error('>> Usuario/senha errados. Confira DB_USER e DB_PASSWORD no .env.');
    else if (e.code === 'ER_BAD_DB_ERROR')
      console.error('>> O banco nao existe. Rode database/schema.sql e seed.sql.');
    else if (e.code === 'ER_NOT_SUPPORTED_AUTH_MODE')
     console.error('>> Verifique a configuracao de autenticacao do MySQL.');
    console.error('Dica: rode "node testar-conexao.js" para um diagnostico completo.');
    console.error('=========================================================\n');
  }
}
 
const servidor = app.listen(PORT, async () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  await checarBanco();
});
 
// Mensagem amigavel quando a porta ja esta em uso (evita o stack trace).
servidor.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('\n=========================================================');
    console.error(`[ERRO] A porta ${PORT} ja esta em uso.`);
    console.error('>> Provavelmente a API ja esta rodando em outra janela do terminal.');
    console.error('>> Use aquela janela, ou feche-a e rode "npm start" novamente.');
    console.error('>> Para liberar a porta no Windows (PowerShell):');
    console.error(`   netstat -ano | findstr :${PORT}`);
    console.error('   taskkill /PID <numero_do_PID> /F');
    console.error(`>> Ou troque a porta no arquivo .env (ex.: PORT=3001).`);
    console.error('=========================================================\n');
    process.exit(1);
  }
  throw e;
});
