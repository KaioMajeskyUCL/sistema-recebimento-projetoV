const fornecedorRepository = require('../repositories/fornecedorRepository');

async function criar(dados) {
    const { cnpj, nome } = dados;

    if (!cnpj || !nome) {
        const erro = new Error('CNPJ e nome são obrigatórios.');
        erro.status = 400;
        throw erro;
    }

    if (cnpj.length !== 14) {
        const erro = new Error('O CNPJ deve possuir 14 caracteres.');
        erro.status = 400;
        throw erro;
    }

    try {
        const id = await fornecedorRepository.criar(cnpj, nome);

        return {
            id,
            cnpj,
            nome
        };
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            const erroDuplicidade = new Error(
                'Já existe um fornecedor cadastrado com este CNPJ.'
            );
            erroDuplicidade.status = 409;
            throw erroDuplicidade;
        }

        throw erro;
    }
}

async function listarTodos() {
    return fornecedorRepository.listarTodos();
}

async function buscarPorId(id) {
    const fornecedor = await fornecedorRepository.buscarPorId(id);

    if (!fornecedor) {
        const erro = new Error('Fornecedor não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return fornecedor;
}

async function atualizar(id, dados) {
    const { cnpj, nome } = dados;

    if (!cnpj || !nome) {
        const erro = new Error('CNPJ e nome são obrigatórios.');
        erro.status = 400;
        throw erro;
    }

    if (cnpj.length !== 14) {
        const erro = new Error('O CNPJ deve possuir 14 caracteres.');
        erro.status = 400;
        throw erro;
    }

    await buscarPorId(id);

    try {
        await fornecedorRepository.atualizar(id, cnpj, nome);

        return {
            id: Number(id),
            cnpj,
            nome
        };
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            const erroDuplicidade = new Error(
                'Já existe um fornecedor cadastrado com este CNPJ.'
            );
            erroDuplicidade.status = 409;
            throw erroDuplicidade;
        }

        throw erro;
    }
}

async function excluir(id) {
    await buscarPorId(id);

    await fornecedorRepository.excluir(id);

    return {
        mensagem: 'Fornecedor arquivado com sucesso.'
    };
}

module.exports = {
    criar,
    listarTodos,
    buscarPorId,
    atualizar,
    excluir
};