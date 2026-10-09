
const API_URL = 'http://localhost:3000/dashboard';

async function carregarDashboard() {
    const token = sessionStorage.getItem('token');

    if (!token) {
        alert('Token não encontrado. Faça login primeiro.');
        return;
    }

    try {
        const resposta = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        document.getElementById('totalCargas').textContent =
            dados.totalCargas;

        document.getElementById('totalPaletes').textContent =
            dados.totalPaletes;

        document.getElementById('tempoMedioEspera').textContent =
            dados.tempoMedioEspera;

        document.getElementById('tempoMedioDescarga').textContent =
            dados.tempoMedioDescarga;

        document.getElementById('cargasComProblemas').textContent =
            dados.cargasComProblemas;

        console.log('Dashboard carregado:', dados);
        criarGraficoTipos(dados.cargasPorTipo);
        criarGraficoFornecedores(dados.cargasPorFornecedor);
        criarGraficoProblemas(dados.problemasPorTipo);
    } catch (erro) {
        console.error('Erro ao carregar Dashboard:', erro);
        alert('Não foi possível carregar os indicadores.');
    }
}


function criarGraficoTipos(cargasPorTipo) {
    const canvas = document.getElementById('graficoTipos');

    const nomes = cargasPorTipo.map(item => {
        return item.tipo === 'CARGA_SECA'
            ? 'Carga Seca'
            : 'Câmara Fria';
    });

    const quantidades = cargasPorTipo.map(
        item => item.quantidade
    );

    new Chart(canvas, {
        type: 'bar',

        data: {
            labels: nomes,
            datasets: [{
                label: 'Quantidade de Cargas',
                data: quantidades,
                backgroundColor: [
                    '#38bdf8',
                    '#818cf8'
                ],
                borderRadius: 6
            }]
        },

        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#cbd5e1'
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#cbd5e1',
                        precision: 0
                    }
                }
            }
        }
    });
}


function criarGraficoFornecedores(cargasPorFornecedor) {
    const canvas = document.getElementById('graficoFornecedores');

    const nomes = cargasPorFornecedor.map(
        item => item.fornecedor
    );

    const quantidades = cargasPorFornecedor.map(
        item => item.quantidade
    );

    new Chart(canvas, {
        type: 'bar',

        data: {
            labels: nomes,
            datasets: [{
                label: 'Quantidade de Cargas',
                data: quantidades,
                backgroundColor: '#38bdf8',
                borderRadius: 6
            }]
        },

        options: {
            indexAxis: 'y',
            responsive: true,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: '#cbd5e1',
                        precision: 0
                    }
                },

                y: {
                    ticks: {
                        color: '#cbd5e1'
                    }
                }
            }
        }
    });
}


function criarGraficoProblemas(problemasPorTipo) {
    const canvas = document.getElementById('graficoProblemas');

    if (problemasPorTipo.length === 0) {
        canvas.style.display = 'none';

        const mensagem = document.createElement('p');
        mensagem.textContent = 'Nenhum problema registrado.';
        mensagem.style.color = '#94a3b8';

        canvas.parentElement.appendChild(mensagem);
        return;
    }

    const nomes = problemasPorTipo.map(
        item => item.tipo.replaceAll('_', ' ')
    );

    const quantidades = problemasPorTipo.map(
        item => item.quantidade
    );

    new Chart(canvas, {
        type: 'bar',

        data: {
            labels: nomes,
            datasets: [{
                label: 'Quantidade de Problemas',
                data: quantidades,
                backgroundColor: '#fb923c',
                borderRadius: 6
            }]
        },

        options: {
            indexAxis: 'y',
            responsive: true,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: '#cbd5e1',
                        precision: 0
                    }
                },

                y: {
                    ticks: {
                        color: '#cbd5e1'
                    }
                }
            }
        }
    });
}



carregarDashboard();


/* Assistente IA */

const formAssistente = document.getElementById('formAssistente');
const perguntaIA = document.getElementById('perguntaIA');
const chatMensagens = document.getElementById('chatMensagens');
const botaoEnviarIA = document.getElementById('botaoEnviarIA');

function adicionarMensagem(texto, classe) {
    const mensagem = document.createElement('p');

    mensagem.className = classe;
    mensagem.textContent = texto;

    chatMensagens.appendChild(mensagem);
    chatMensagens.scrollTop = chatMensagens.scrollHeight;
}

formAssistente.addEventListener('submit', async function (evento) {
    evento.preventDefault();

    const pergunta = perguntaIA.value.trim();

    if (!pergunta) return;

    const token = sessionStorage.getItem('token');

    if (!token) {
        adicionarMensagem(
            'Sua sessão não foi encontrada. Faça login novamente.',
            'mensagem-ia'
        );
        return;
    }

    adicionarMensagem(`Você: ${pergunta}`, 'mensagem-usuario');

    perguntaIA.value = '';
    botaoEnviarIA.disabled = true;
    botaoEnviarIA.textContent = 'Aguarde...';

    try {

const resposta = await fetch(
    'http://localhost:3000/assistente/perguntar',
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ pergunta }),
        signal: AbortSignal.timeout(30000)
    }
);


        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem || `Erro HTTP ${resposta.status}`
            );
        }

        adicionarMensagem(
            `Assistente: ${dados.resposta}`,
            'mensagem-ia'
        );

    } catch (erro) {
        console.error('Erro no chat:', erro);

        adicionarMensagem(
            `Erro: ${erro.message}`,
            'mensagem-ia'
        );

    } finally {
        botaoEnviarIA.disabled = false;
        botaoEnviarIA.textContent = 'Enviar';
        perguntaIA.focus();
    }
});

