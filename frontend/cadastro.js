
const formCadastro = document.getElementById('formCadastro');
const mensagemCadastro = document.getElementById('mensagemCadastro');

formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    mensagemCadastro.textContent = '';

    if (senha !== confirmarSenha) {
        mensagemCadastro.textContent = 'As senhas não coincidem.';
        return;
    }

    const botao = formCadastro.querySelector('button[type="submit"]');
    botao.disabled = true;

    try {
        const resposta = await fetch('/auth/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                email,
                senha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao cadastrar usuário.');
        }

        mensagemCadastro.textContent =
            'Cadastro realizado com sucesso! Redirecionando para o login...';

        formCadastro.reset();

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);

    } catch (erro) {
        mensagemCadastro.textContent = erro.message;
        botao.disabled = false;
    }
});
