
const formLogin = document.getElementById('formLogin');
const mensagem = document.getElementById('mensagem');
const btnEntrar = document.getElementById('btnEntrar');

formLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    mensagem.textContent = '';
    btnEntrar.disabled = true;
    btnEntrar.textContent = 'Entrando...';

    try {
        const resposta = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const texto = await resposta.text();

console.log('Status HTTP:', resposta.status);
console.log('Resposta do servidor:', texto);

if (!texto) {
    throw new Error(
        `O servidor retornou uma resposta vazia (HTTP ${resposta.status}).`
    );
}

const dados = JSON.parse(texto);

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Não foi possível fazer login.');
        }

        if (!dados.token) {
            throw new Error('O servidor não retornou um token de acesso.');
        }

        // Guarda o token para as requisições do Dashboard.
        sessionStorage.setItem('token', dados.token);

        // Abre o Dashboard após a autenticação.
        const parametros = new URLSearchParams(window.location.search);
const destino = parametros.get('destino');
const paginasPermitidas = [
    'index.html',
    'cargas.html',
    'fornecedores.html'
];

window.location.replace(
    paginasPermitidas.includes(destino) ? destino : 'index.html'
);

    } catch (erro) {
        mensagem.textContent = erro.message;
    } finally {
        btnEntrar.disabled = false;
        btnEntrar.textContent = 'Entrar';
    }
});
