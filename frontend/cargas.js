
const API_BASE = 'http://localhost:3000';

const token = sessionStorage.getItem('token');

let problemasRegistrados = [];

if (!token) {
    window.location.replace('login.html?destino=cargas.html');
}


async function carregarFornecedores() {
    const select = document.getElementById('id_fornecedor');
    const mensagem = document.getElementById('mensagemCarga');

    try {
        const resposta = await fetch(`${API_BASE}/fornecedores`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            throw new Error(`Erro ao consultar fornecedores (HTTP ${resposta.status}).`);
        }

        const fornecedores = await resposta.json();

        if (!Array.isArray(fornecedores)) {
            throw new Error('Formato inesperado da lista de fornecedores.');
        }

        select.innerHTML = '<option value="">Selecione um fornecedor</option>';

        fornecedores.forEach(fornecedor => {
            const opcao = document.createElement('option');
            opcao.value = fornecedor.id;
            opcao.textContent = fornecedor.nome;
            select.appendChild(opcao);
        });

        const filtroFornecedor = document.getElementById('filtroFornecedor');

filtroFornecedor.innerHTML =
    '<option value="">Todos os fornecedores</option>';

fornecedores.forEach(fornecedor => {
    const opcao = document.createElement('option');
    opcao.value = fornecedor.id;
    opcao.textContent = fornecedor.nome;

    filtroFornecedor.appendChild(opcao);
});

        if (fornecedores.length === 0) {
            mensagem.textContent = 'Nenhum fornecedor cadastrado.';
        }

    } catch (erro) {
        console.error('Erro ao carregar fornecedores:', erro);
        mensagem.textContent = erro.message;
    }
}

if (token) {
    carregarFornecedores();
}


const formCarga = document.getElementById('formCarga');
const mensagemCarga = document.getElementById('mensagemCarga');

formCarga.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const token = sessionStorage.getItem('token');

    if (!token) {
        window.location.replace('login.html?destino=cargas.html');
        return;
    }

    const carga = {
        numero_carga: Number(document.getElementById('numero_carga').value),
        id_fornecedor: Number(document.getElementById('id_fornecedor').value),
        data: document.getElementById('data').value,
        tipo_carga: document.getElementById('tipo_carga').value,
        quantidade_paletes: Number(
            document.getElementById('quantidade_paletes').value
        ),
        hora_chegada: document.getElementById('hora_chegada').value,
        status: document.getElementById('status').value
    };

    const botao = formCarga.querySelector('button[type="submit"]');

    botao.disabled = true;
    botao.textContent = 'Cadastrando...';
    mensagemCarga.textContent = '';

    try {

const editando = cargaEmEdicao !== null;

const url = editando
    ? `/cargas/${cargaEmEdicao}`
    : '/cargas';

const resposta = await fetch(url, {
    method: editando ? 'PUT' : 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(carga)
});


        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem || 'Erro ao cadastrar carga.'
            );
        }


mensagemCarga.textContent = editando
    ? 'Carga atualizada com sucesso!'
    : `Carga cadastrada com sucesso! ID: ${dados.id}`;

mensagemCarga.style.color = '#4ade80';

formCarga.reset();
cargaEmEdicao = null;

// Esconde o botão Cancelar Edição após salvar
document.getElementById('btnCancelarEdicao').hidden = true;

// Restaura o texto do botão principal
document.getElementById('btnSalvarCarga').textContent =
    'Cadastrar Carga';

await carregarCargas();
return true;

    } catch (erro) {
        mensagemCarga.textContent = erro.message;
        mensagemCarga.style.color = '#f87171';
        return false;

    } finally {
        botao.disabled = false;
botao.textContent = cargaEmEdicao !== null
    ? 'Salvar Alterações'
    : 'Cadastrar Carga';
    }
});


let paginaAtual = 1;
let totalPaginas = 1;

async function carregarCargas() {
    const corpoTabela = document.getElementById('corpoTabelaCargas');
    const mensagemLista = document.getElementById('mensagemListaCargas');
    const tokenAtual = sessionStorage.getItem('token');

    if (!tokenAtual) {
        window.location.replace('login.html?destino=cargas.html');
        return;
    }

    corpoTabela.innerHTML = `
        <tr>
            <td colspan="6">Carregando cargas...</td>
        </tr>
    `;

    mensagemLista.textContent = '';

    try {
        const parametros = new URLSearchParams({
    page: paginaAtual,
    limit: 20
});

const numero = document.getElementById('filtroNumero').value;
const status = document.getElementById('filtroStatus').value;
const tipo = document.getElementById('filtroTipo').value;
const fornecedor = document.getElementById('filtroFornecedor').value;

if (numero) parametros.set('numero_carga', numero);
if (status) parametros.set('status', status);
if (tipo) parametros.set('tipo', tipo);
if (fornecedor) parametros.set('id_fornecedor', fornecedor);

const resposta = await fetch(`/cargas?${parametros.toString()}`, {
            headers: {
                Authorization: `Bearer ${tokenAtual}`
            }
        });

        if (resposta.status === 401 || resposta.status === 403) {
            sessionStorage.removeItem('token');
            window.location.replace('login.html?destino=cargas.html');
            return;
        }

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                resultado.mensagem || 'Erro ao consultar cargas.'
            );
        }

        const cargas = resultado.dados;

        if (!Array.isArray(cargas)) {
            throw new Error('Formato inesperado da lista de cargas.');
        }

        corpoTabela.innerHTML = '';

        if (cargas.length === 0) {
            const linha = corpoTabela.insertRow();
            const celula = linha.insertCell();
            celula.colSpan = 7;
            celula.textContent = 'Nenhuma carga encontrada.';
            return;
        }
await carregarProblemasRegistrados();
        cargas.forEach(carga => {
            const linha = corpoTabela.insertRow();

            const valores = [
                carga.numero_carga,
                carga.data ? String(carga.data).slice(0, 10) : '-',
                carga.fornecedor ?? carga.nome_fornecedor ?? carga.id_fornecedor,
                carga.tipo_carga === 'CARGA_SECA'
                    ? 'Carga Seca'
                    : carga.tipo_carga === 'CAMARA_FRIA'
                        ? 'Câmara Fria'
                        : carga.tipo_carga,
                carga.quantidade_paletes,
                carga.status
            ];



valores.forEach((valor, indice) => {
    const celula = document.createElement('td');

    // A sexta coluna corresponde ao status
    if (indice === 5) {
        const status = document.createElement('span');

        status.className = `status-carga status-${carga.status}`;
        status.textContent = {
            SEM_STATUS: 'Sem Status',
            PRESENTE: 'Presente',
            DOCADO: 'Docado',
            EM_CONFERENCIA: 'Em Conferência',
            FINALIZADO: 'Finalizado',
            COM_PROBLEMAS: 'Com Problemas'
        }[carga.status] || carga.status;

        celula.appendChild(status);
    } else {
        celula.textContent = valor ?? '';
    }

    linha.appendChild(celula);
});


// Cria a coluna Ações, uma única vez por carga
const celulaAcoes = linha.insertCell();

const botaoEditar = document.createElement('button');
botaoEditar.type = 'button';
botaoEditar.textContent = 'Editar';
botaoEditar.className = 'btn-editar';

botaoEditar.addEventListener('click', () => {
    prepararEdicao(carga.id);
});

celulaAcoes.appendChild(botaoEditar);
const botaoExcluir = document.createElement('button');

botaoExcluir.type = 'button';
botaoExcluir.textContent = 'Excluir';
botaoExcluir.className = 'btn-excluir';

botaoExcluir.addEventListener('click', () => {
    excluirCarga(carga.id, carga.numero_carga);
});

celulaAcoes.appendChild(botaoExcluir);


const botaoStatus = document.createElement('button');

botaoStatus.type = 'button';
botaoStatus.textContent = 'Alterar Status';
botaoStatus.className = 'btn-status';

botaoStatus.addEventListener('click', () => {
    abrirAlteracaoStatus(
        carga.id,
        carga.numero_carga,
        carga.status
    );
});

celulaAcoes.appendChild(botaoStatus);


const botaoHistorico = document.createElement('button');

botaoHistorico.type = 'button';
botaoHistorico.textContent = 'Histórico';
botaoHistorico.className = 'btn-historico';

botaoHistorico.addEventListener('click', () => {
    visualizarHistorico(carga.id, carga.numero_carga);
});

celulaAcoes.appendChild(botaoHistorico);


const botaoProblema = document.createElement('button');

botaoProblema.type = 'button';
botaoProblema.textContent = 'Registrar Problema';
botaoProblema.className = 'btn-problema';

botaoProblema.addEventListener('click', () => {
    abrirRegistroProblema(carga.id, carga.numero_carga);
});

celulaAcoes.appendChild(botaoProblema);

const possuiProblemas = problemasRegistrados.some(
    problema => Number(problema.id_carga) === Number(carga.id)
);

if (possuiProblemas) {
    const botaoVerProblemas = document.createElement('button');

    botaoVerProblemas.type = 'button';
    botaoVerProblemas.textContent = 'Ver Problemas';
    botaoVerProblemas.className = 'btn-problema';

    botaoVerProblemas.addEventListener('click', () => {
        visualizarProblemasCarga(carga.id, carga.numero_carga);
    });

    celulaAcoes.appendChild(botaoVerProblemas);
}

});

        const paginacao = resultado.paginacao;
        totalPaginas = paginacao?.totalPaginas || 1;

document.getElementById('infoPagina').textContent =
    `Página ${paginaAtual} de ${totalPaginas}`;

document.getElementById('btnAnterior').disabled =
    paginaAtual <= 1;

document.getElementById('btnProxima').disabled =
    paginaAtual >= totalPaginas;

        if (paginacao) {
            mensagemLista.textContent =
                `Exibindo ${cargas.length} de ${paginacao.total} cargas.`;
        }

    } catch (erro) {
        console.error('Erro ao carregar cargas:', erro);

        corpoTabela.innerHTML = '';

        const linha = corpoTabela.insertRow();
        const celula = linha.insertCell();
        celula.colSpan = 7;
        celula.textContent = 'Não foi possível carregar as cargas.';

        mensagemLista.textContent = erro.message;
    }
}

carregarCargas();

document.getElementById('btnAnterior').addEventListener('click', () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        carregarCargas();
    }
});

document.getElementById('btnProxima').addEventListener('click', () => {
    if (paginaAtual < totalPaginas) {
        paginaAtual++;
        carregarCargas();
    }
});

document.getElementById('btnPesquisarCargas')
    .addEventListener('click', () => {
        paginaAtual = 1;
        carregarCargas();
    });

document.getElementById('btnLimparFiltros')
    .addEventListener('click', () => {
        document.getElementById('filtroNumero').value = '';
        document.getElementById('filtroStatus').value = '';
        document.getElementById('filtroTipo').value = '';
        document.getElementById('filtroFornecedor').value = '';

        paginaAtual = 1;
        carregarCargas();
    });


let cargaEmEdicao = null;

async function prepararEdicao(id) {
    const tokenAtual = sessionStorage.getItem('token');

    if (!tokenAtual) {
        window.location.replace('login.html?destino=cargas.html');
        return;
    }

    try {
        const resposta = await fetch(`/cargas/${id}`, {
            headers: {
                Authorization: `Bearer ${tokenAtual}`
            }
        });

        if (!resposta.ok) {
            throw new Error('Não foi possível consultar a carga.');
        }

        const carga = await resposta.json();

        document.getElementById('numero_carga').value =
            carga.numero_carga;

        document.getElementById('id_fornecedor').value =
            carga.id_fornecedor;

        document.getElementById('data').value =
            String(carga.data).slice(0, 10);

        document.getElementById('tipo_carga').value =
            carga.tipo_carga;

        document.getElementById('quantidade_paletes').value =
            carga.quantidade_paletes;

        document.getElementById('hora_chegada').value =
            String(carga.hora_chegada).slice(0, 5);

        document.getElementById('status').value =
            carga.status;

        cargaEmEdicao = id;
        document.getElementById('btnCancelarEdicao').hidden = false;

        document.querySelector(
            '#formCarga button[type="submit"]'
        ).textContent = 'Salvar Alterações';

        document.getElementById('formCarga').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

    } catch (erro) {
        alert(erro.message);
    }
}


const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');

function cancelarEdicao() {
    // Sai do modo de edição
    cargaEmEdicao = null;

    // Limpa os campos
    formCarga.reset();

    // Restaura o botão de cadastro
    document.getElementById('btnSalvarCarga').textContent =
        'Cadastrar Carga';

    // Oculta o botão Cancelar Edição
    btnCancelarEdicao.hidden = true;

    // Limpa mensagens anteriores
    mensagemCarga.textContent = '';
}

btnCancelarEdicao.addEventListener('click', cancelarEdicao);


async function excluirCarga(id, numeroCarga) {
    const confirmar = confirm(
        `Deseja realmente excluir a carga ${numeroCarga}?`
    );

    if (!confirmar) return;

    const tokenAtual = sessionStorage.getItem('token');

    if (!tokenAtual) {
        window.location.replace('login.html?destino=cargas.html');
        return;
    }

    try {
        const resposta = await fetch(`/cargas/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${tokenAtual}`
            }
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem || 'Erro ao excluir carga.'
            );
        }

        alert('Carga excluída com sucesso!');

        await carregarCargas();

    } catch (erro) {
        alert(erro.message);
    }
}



let cargaStatusEmEdicao = null;
let statusOriginal = null;

function abrirAlteracaoStatus(id, numeroCarga, statusAtual) {
    cargaStatusEmEdicao = id;
    statusOriginal = statusAtual;

    document.getElementById('identificacaoCargaStatus').textContent =
        `Carga nº ${numeroCarga} — Status atual: ${statusAtual}`;

    document.getElementById('novoStatusCarga').value = statusAtual;

    document.getElementById('modalStatus').showModal();
}



async function atualizarStatusCarga(id, novoStatus) {
    try {
        const tokenAtual = sessionStorage.getItem('token');

        const resposta = await fetch(`/cargas/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenAtual}`
            },
            body: JSON.stringify({
                status: novoStatus
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem || 'Erro ao atualizar status.'
            );
        }

        alert('Status atualizado com sucesso!');

        // Atualiza a tabela para mostrar o novo status
        await carregarCargas();

    } catch (erro) {
        console.error('Erro ao atualizar status:', erro);
        alert('Não foi possível atualizar o status: ' + erro.message);
    }
}



async function visualizarHistorico(id, numeroCarga) {
    const modal = document.getElementById('modalHistorico');
    const titulo = document.getElementById('tituloHistorico');
    const corpo = document.getElementById('corpoHistorico');
    const mensagem = document.getElementById('mensagemHistorico');

    titulo.textContent = `Histórico da Carga ${numeroCarga}`;
    corpo.replaceChildren();
    mensagem.textContent = 'Carregando histórico...';

    modal.showModal();

    try {
        const tokenAtual = sessionStorage.getItem('token');

        const resposta = await fetch(`/cargas/${id}/historico`, {
            headers: {
                Authorization: `Bearer ${tokenAtual}`
            }
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem || 'Erro ao consultar histórico.'
            );
        }

        if (!Array.isArray(dados)) {
            throw new Error('Formato de histórico inesperado.');
        }

        mensagem.textContent = '';

        if (dados.length === 0) {
            mensagem.textContent =
                'Nenhuma movimentação registrada para esta carga.';
            return;
        }

        const nomesStatus = {
            SEM_STATUS: 'Sem Status',
            PRESENTE: 'Presente',
            DOCADO: 'Docado',
            EM_CONFERENCIA: 'Em Conferência',
            FINALIZADO: 'Finalizado',
            COM_PROBLEMAS: 'Com Problemas'
        };

        dados.forEach(registro => {
            const linha = document.createElement('tr');

            const data = document.createElement('td');
            const status = document.createElement('td');
            const usuario = document.createElement('td');

            data.textContent = registro.data_hora
                ? new Date(registro.data_hora).toLocaleString('pt-BR')
                : 'Não informado';

            status.textContent =
                nomesStatus[registro.status] || registro.status;

            usuario.textContent =
                registro.usuario || `Usuário ${registro.id_usuario}`;

            linha.appendChild(data);
            linha.appendChild(status);
            linha.appendChild(usuario);

            corpo.appendChild(linha);
        });

    } catch (erro) {
        console.error('Erro ao consultar histórico:', erro);
        mensagem.textContent = 'Erro: ' + erro.message;
    }
}

document.getElementById('fecharHistorico')
    .addEventListener('click', () => {
        document.getElementById('modalHistorico').close();
    });


const modalStatus = document.getElementById('modalStatus');
const btnSalvarStatus = document.getElementById('salvarStatus');

document.getElementById('cancelarStatus')
    .addEventListener('click', () => {
        modalStatus.close();
    });

btnSalvarStatus.addEventListener('click', async () => {
    const novoStatus = document.getElementById('novoStatusCarga').value;

    if (cargaStatusEmEdicao === null) return;

    if (novoStatus === statusOriginal) {
        alert('Selecione um status diferente do atual.');
        return;
    }

    btnSalvarStatus.disabled = true;
    btnSalvarStatus.textContent = 'Salvando...';

    try {
       const sucesso = await atualizarStatusCarga(
    cargaStatusEmEdicao,
    novoStatus
);

if (sucesso) {
    modalStatus.close();
}
    } finally {
        btnSalvarStatus.disabled = false;
        btnSalvarStatus.textContent = 'Salvar Status';
    }
});



let cargaProblemaSelecionada = null;
let problemaEmEdicao = null;

function abrirRegistroProblema(idCarga, numeroCarga) {
    cargaProblemaSelecionada = idCarga;
    problemaEmEdicao = null;

document.querySelector('#modalProblema h2').textContent =
    'Registrar Problema';

document.getElementById('salvarProblema').textContent =
    'Registrar Problema';

    document.getElementById('formProblema').reset();

    document.getElementById('identificacaoCargaProblema')
        .textContent = `Carga nº ${numeroCarga}`;

    document.getElementById('mensagemProblema')
        .textContent = '';

    document.getElementById('modalProblema').showModal();

    carregarTiposProblema();
}


document.getElementById('cancelarProblema')
    .addEventListener('click', () => {
        document.getElementById('modalProblema').close();
        cargaProblemaSelecionada = null;
        problemaEmEdicao = null;
    });


async function carregarTiposProblema() {
    const select = document.getElementById('tipoProblema');

    select.innerHTML = '<option value="">Carregando tipos...</option>';

    try {
        const resposta = await fetch(`${API_BASE}/tipos-problema`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            throw new Error('Erro ao buscar tipos de problema.');
        }

        const tipos = await resposta.json();

        select.innerHTML = '<option value="">Selecione o tipo de problema</option>';

        tipos.forEach(tipo => {
            const option = document.createElement('option');

            option.value = tipo.id;
            option.textContent = tipo.nome;

            select.appendChild(option);
        });

    } catch (erro) {
        console.error(erro);

        select.innerHTML = '<option value="">Erro ao carregar tipos</option>';

        document.getElementById('mensagemProblema').textContent =
            'Não foi possível carregar os tipos de problema.';
    }
}


document.getElementById('formProblema')
    .addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const idTipoProblema =
            document.getElementById('tipoProblema').value;

        const descricao =
            document.getElementById('descricaoProblema').value.trim();

        const mensagem =
            document.getElementById('mensagemProblema');

        const botaoSalvar =
            document.getElementById('salvarProblema');

        if (!cargaProblemaSelecionada || !idTipoProblema || !descricao) {
            mensagem.textContent = 'Preencha todos os campos.';
            return;
        }

        botaoSalvar.disabled = true;
        botaoSalvar.textContent = 'Registrando...';
        mensagem.textContent = '';

        try {
const editando = problemaEmEdicao !== null;

const url = editando
    ? `${API_BASE}/problemas/${problemaEmEdicao}`
    : `${API_BASE}/problemas`;

const resposta = await fetch(url, {
    method: editando ? 'PUT' : 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
        id_carga: Number(cargaProblemaSelecionada),
        id_tipo_problema: Number(idTipoProblema),
        descricao
    })
});

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.mensagem || 'Erro ao registrar problema.'
                );
            }

document.getElementById('modalProblema').close();

alert(
    editando
        ? 'Problema atualizado com sucesso!'
        : 'Problema registrado com sucesso!'
);

problemaEmEdicao = null;
cargaProblemaSelecionada = null;

await carregarCargas();

        } catch (erro) {
            console.error(erro);
            mensagem.textContent = erro.message;
        } finally {
            botaoSalvar.disabled = false;
            botaoSalvar.textContent = 'Registrar Problema';
        }
    });


async function visualizarProblemasCarga(idCarga, numeroCarga) {
    const modal = document.getElementById('modalListaProblemas');
    const conteudo = document.getElementById('conteudoListaProblemas');

    document.getElementById('tituloListaProblemas')
        .textContent = `Carga nº ${numeroCarga}`;

    conteudo.textContent = 'Carregando problemas...';

if (!modal.open) {
    modal.showModal();
}

    try {
        const resposta = await fetch(`${API_BASE}/problemas`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            throw new Error('Não foi possível consultar os problemas.');
        }

        const problemas = await resposta.json();

        const problemasDaCarga = problemas.filter(
            problema => Number(problema.id_carga) === Number(idCarga)
        );

        conteudo.replaceChildren();

        if (problemasDaCarga.length === 0) {
            conteudo.textContent = 'Nenhum problema registrado nesta carga.';
            return;
        }


problemasDaCarga.forEach(problema => {
    const item = document.createElement('div');
    item.className = 'item-problema';

    const tipo = document.createElement('strong');
    tipo.textContent = problema.tipo_problema
        || problema.nome_tipo_problema
        || `Tipo #${problema.id_tipo_problema}`;

    const descricao = document.createElement('p');
    descricao.textContent = problema.descricao;

    const data = document.createElement('small');

    if (problema.data_registro) {
        const dataRegistro = new Date(problema.data_registro);

        data.textContent = Number.isNaN(dataRegistro.getTime())
            ? 'Data não disponível'
            : `Registrado em: ${dataRegistro.toLocaleString('pt-BR')}`;
    } else {
        data.textContent = 'Data não disponível';
    }

    item.appendChild(tipo);
    item.appendChild(descricao);
    item.appendChild(data);


const botaoEditarProblema = document.createElement('button');

botaoEditarProblema.type = 'button';
botaoEditarProblema.textContent = 'Editar';
botaoEditarProblema.className = 'btn-editar-problema';

botaoEditarProblema.addEventListener('click', () => {
    prepararEdicaoProblema(problema);
});

item.appendChild(botaoEditarProblema);

const botaoExcluirProblema = document.createElement('button');

botaoExcluirProblema.type = 'button';
botaoExcluirProblema.textContent = 'Excluir';
botaoExcluirProblema.className = 'btn-excluir-problema';

botaoExcluirProblema.addEventListener('click', () => {
    excluirProblema(problema.id, idCarga, numeroCarga);
});

item.appendChild(botaoExcluirProblema);


    conteudo.appendChild(item);
});


    } catch (erro) {
        console.error(erro);
        conteudo.textContent = erro.message;
    }
}

document.getElementById('fecharListaProblemas')
    .addEventListener('click', () => {
        document.getElementById('modalListaProblemas').close();
    });


async function carregarProblemasRegistrados() {
    const resposta = await fetch(`${API_BASE}/problemas`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!resposta.ok) {
        throw new Error('Erro ao carregar problemas.');
    }

    problemasRegistrados = await resposta.json();
}


async function prepararEdicaoProblema(problema) {
    problemaEmEdicao = problema.id;
    cargaProblemaSelecionada = problema.id_carga;

    // Fecha a janela de visualização
    document.getElementById('modalListaProblemas').close();

    // Abre o formulário de edição
    const modal = document.getElementById('modalProblema');

    document.getElementById('formProblema').reset();

    document.querySelector('#modalProblema h2').textContent =
        'Editar Problema';

    document.getElementById('identificacaoCargaProblema')
        .textContent = `Carga nº ${problema.numero_carga}`;

    document.getElementById('descricaoProblema').value =
        problema.descricao;

    document.getElementById('salvarProblema').textContent =
        'Salvar Alterações';

    document.getElementById('mensagemProblema').textContent = '';

    modal.showModal();

    // Carrega as categorias antes de selecionar a atual
    await carregarTiposProblema();

    document.getElementById('tipoProblema').value =
        String(problema.id_tipo_problema);
}


async function excluirProblema(idProblema, idCarga, numeroCarga) {
    const confirmou = confirm(
        'Deseja realmente excluir este problema?\n' +
        'Esta ação não poderá ser desfeita.'
    );

    if (!confirmou) return;

    try {
        const resposta = await fetch(
            `${API_BASE}/problemas/${idProblema}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem || 'Erro ao excluir problema.'
            );
        }

        alert('Problema excluído com sucesso!');

        await carregarCargas();

        await visualizarProblemasCarga(idCarga, numeroCarga);

    } catch (erro) {
        console.error(erro);
        alert(erro.message);
    }
}
