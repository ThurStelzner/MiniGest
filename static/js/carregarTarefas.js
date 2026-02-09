document.addEventListener('DOMContentLoaded', () => {
    carregarTarefas();
});

function carregarTarefas() {
    fetch('/carregarTarefas')
    .then(response => response.json())
    .then(tarefas => {
        const container = document.getElementById('listaTarefas');
        container.innerHTML = '';

        if (tarefas.length === 0) {
            container.innerHTML = '<p>Nenhuma tarefa encontrada</p>';
            return;
        }

        tarefas.forEach(tarefa => {
            const div = document.createElement('div');
            div.className = 'tarefaCard';
            
            // Cálculo da porcentagem
            const total = tarefa.passos.length;
            const concluidos = tarefa.passosConcluidos ? tarefa.passosConcluidos.length : 0;
            const porcentagem = total > 0 ? Math.round((concluidos / total) * 100) : 0;

            const passosHtml = tarefa.passos.map((passo, index) => {
                const isChecked = tarefa.passosConcluidos && tarefa.passosConcluidos.includes(index);
                return `
                    <li style="list-style: none;">
                        <label style="cursor: pointer;">
                            <input type="checkbox" 
                                   onchange="alternarPasso('${tarefa.id}', ${index}, this.checked)"
                                   ${isChecked ? 'checked' : ''}>
                            <span style="${isChecked ? 'text-decoration: line-through; color: gray;' : ''}">
                                ${passo}
                            </span>
                        </label>
                    </li>
                `;
            }).join('');

            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0;">${tarefa.titulo}</h3>
                    <span style="font-weight: bold; font-family: sans-serif;">${porcentagem}%</span>
                </div>
                <ul style="padding-left: 0; margin-top: 10px;">
                    ${passosHtml}
                </ul>
                <small style="display: block; margin-bottom: 10px;">
                    Criada em: ${new Date(tarefa.dataCriacao).toLocaleString()}
                </small>
                <button type='button' class='excluirTarefa' onclick="excluirTarefa('${tarefa.id}')">
                    Excluir Tarefa
                </button>
                <a href='/editar/${tarefa.id}'>Editar Tarefa</a>
            `;
            container.appendChild(div);
        });
    })
    .catch(error => console.error('Erro ao carregar', error));
}

function excluirTarefa(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        fetch('/excluirTarefa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                carregarTarefas(); // Recarrega a lista atualizada
            } else {
                alert('Erro ao excluir: ' + data.error);
            }
        })
        .catch(error => console.error('Erro:', error));
    }
}

function alternarPasso(id, index, concluido) {
    fetch('/atualizarPasso', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: id, passoIndex: index, concluido: concluido })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Recarrega para aplicar o estilo de riscado no texto
            carregarTarefas();
        }
    });
}