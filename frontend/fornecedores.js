const tokenFornecedor = sessionStorage.getItem('token');

if (!tokenFornecedor) {
    window.location.replace('login.html?destino=fornecedores.html');
}


const corpoTabelaFornecedores = document.getElementById(
    'corpoTabelaFornecedores'
);

const mensagemListaFornecedores = document.getElementById(
    'mensagemListaFornecedores'
);

async function carregarFornecedores() {
    corpoTabelaFornecedores.replaceChildren();
    mensagemListaFornecedores.textContent = 'Carregando fornecedores...';

    try {
        const tokenAtual = sessionStorage.getItem('token');

        const resposta = await fetch('/fornecedores', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${tokenAtual}`
            }
        });

        if (resposta.status === 401 || resposta.status === 403) {
            sessionStorage.removeItem('token');
            window.location.replace(
                'login.html?destino=fornecedores.html'
            );
            return;
        }

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem || 'Erro ao carregar fornecedores.'
            );
        }

        if (!Array.isArray(dados)) {
            throw new Error(
                'A API retornou um formato inesperado.'
            );
        }

        mensagemListaFornecedores.textContent = '';

        if (dados.length === 0) {
            mensagemListaFornecedores.textContent =
                'Nenhum fornecedor cadastrado.';
            return;
        }

        dados.forEach(fornecedor => {
            const linha = document.createElement('tr');

            const celulaId = document.createElement('td');
            celulaId.textContent = fornecedor.id;

            const celulaNome = document.createElement('td');
            celulaNome.textContent = fornecedor.nome;

            const celulaCnpj = document.createElement('td');
            celulaCnpj.textContent = fornecedor.cnpj;

          const celulaAcoes = document.createElement('td');

const botaoEditar = document.createElement('button');
botaoEditar.type = 'button';
botaoEditar.textContent = 'Editar';
botaoEditar.className = 'btn-editar-fornecedor';

botaoEditar.addEventListener('click', () => {
    prepararEdicaoFornecedor(fornecedor);
});

celulaAcoes.appendChild(botaoEditar);


const botaoDesativar = document.createElement('button');

botaoDesativar.type = 'button';
botaoDesativar.textContent = 'Desativar';
botaoDesativar.className = 'btn-desativar-fornecedor';

botaoDesativar.addEventListener('click', () => {
    desativarFornecedor(fornecedor.id, fornecedor.nome);
});

celulaAcoes.appendChild(botaoDesativar);

            linha.appendChild(celulaId);
            linha.appendChild(celulaNome);
            linha.appendChild(celulaCnpj);
            linha.appendChild(celulaAcoes);

            corpoTabelaFornecedores.appendChild(linha);
        });

    } catch (erro) {
        console.error('Erro ao listar fornecedores:', erro);

        mensagemListaFornecedores.textContent =
            'Erro ao carregar fornecedores: ' + erro.message;
    }
}

// Carrega a tabela quando a página é aberta
if (tokenFornecedor) {
    carregarFornecedores();
}


const formFornecedor = document.getElementById('formFornecedor');
const mensagemFornecedor = document.getElementById('mensagemFornecedor');
const btnSalvarFornecedor = document.getElementById('btnSalvarFornecedor');

formFornecedor.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const nome = document.getElementById('nomeFornecedor').value.trim();
    const cnpj = document.getElementById('cnpjFornecedor')
        .value.replace(/\D/g, '');

    mensagemFornecedor.textContent = '';

    if (!nome || cnpj.length !== 14) {
        mensagemFornecedor.textContent =
            'Informe o nome e um CNPJ com 14 dígitos.';
        mensagemFornecedor.style.color = '#f87171';
        return;
    }

  const editando = fornecedorEmEdicao !== null;

btnSalvarFornecedor.disabled = true;
btnSalvarFornecedor.textContent = editando
    ? 'Salvando alterações...'
    : 'Cadastrando...';

    try {
        const tokenAtual = sessionStorage.getItem('token');


const url = editando
    ? `/fornecedores/${fornecedorEmEdicao}`
    : '/fornecedores';

const resposta = await fetch(url, {
    method: editando ? 'PUT' : 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenAtual}`
    },
    body: JSON.stringify({
        nome,
        cnpj
    })
});


        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem || 'Erro ao cadastrar fornecedor.'
            );
        }

const mensagemSucesso = editando
    ? 'Fornecedor atualizado com sucesso!'
    : 'Fornecedor cadastrado com sucesso!';

cancelarEdicaoFornecedor();

mensagemFornecedor.textContent = mensagemSucesso;
mensagemFornecedor.style.color = '#4ade80';

        // Atualiza a tabela com o novo fornecedor
        await carregarFornecedores();

    } catch (erro) {
        console.error('Erro ao cadastrar fornecedor:', erro);

        mensagemFornecedor.textContent = erro.message;
        mensagemFornecedor.style.color = '#f87171';

    } finally {
        btnSalvarFornecedor.disabled = false;
btnSalvarFornecedor.textContent = fornecedorEmEdicao !== null
    ? 'Salvar Alterações'
    : 'Cadastrar Fornecedor';
    }
});


let fornecedorEmEdicao = null;

function prepararEdicaoFornecedor(fornecedor) {
    fornecedorEmEdicao = fornecedor.id;

    document.getElementById('nomeFornecedor').value =
        fornecedor.nome;

    document.getElementById('cnpjFornecedor').value =
        fornecedor.cnpj;

    document.getElementById('tituloFormularioFornecedor').textContent =
        `Editar Fornecedor #${fornecedor.id}`;

    btnSalvarFornecedor.textContent = 'Salvar Alterações';

    document.getElementById('btnCancelarFornecedor').hidden = false;

    mensagemFornecedor.textContent = '';

    document.querySelector('.formulario-fornecedores')
        .scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
}


const btnCancelarFornecedor = document.getElementById(
    'btnCancelarFornecedor'
);

function cancelarEdicaoFornecedor() {
    fornecedorEmEdicao = null;

    formFornecedor.reset();

    document.getElementById('tituloFormularioFornecedor').textContent =
        'Cadastrar Novo Fornecedor';

    btnSalvarFornecedor.textContent = 'Cadastrar Fornecedor';

    btnCancelarFornecedor.hidden = true;

    mensagemFornecedor.textContent = '';
}

btnCancelarFornecedor.addEventListener(
    'click',
    cancelarEdicaoFornecedor
);


async function desativarFornecedor(id, nome) {
    const confirmar = confirm(
        `Deseja realmente desativar o fornecedor "${nome}"?\n\n` +
        'Essa ação poderá impedir sua seleção em novos cadastros.'
    );

    if (!confirmar) return;

    try {
        const tokenAtual = sessionStorage.getItem('token');

        const resposta = await fetch(`/fornecedores/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${tokenAtual}`
            }
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem || 'Erro ao desativar fornecedor.'
            );
        }

        // Se o fornecedor estava sendo editado, limpa o formulário
        if (fornecedorEmEdicao === id) {
            cancelarEdicaoFornecedor();
        }

        alert('Fornecedor desativado com sucesso!');

        await carregarFornecedores();

    } catch (erro) {
        console.error('Erro ao desativar fornecedor:', erro);
        alert('Erro: ' + erro.message);
    }
}
