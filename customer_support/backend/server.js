import express from 'express';
import cors from 'cors'

const app = express();
app.use(cors());

const port = 3000;

// 1 - usuário + mensagem
// 2 - consultar banco de dados para pegar a info do usuário
// 3 - montar prompt de sistema
// 4 - retornar resposta da AI

app.listen(port, () => {
    console.log(`servidor ouvindo na porta ${port}`);
})