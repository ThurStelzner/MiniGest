let contarPasso = 1;
document.getElementById('adicionarPasso').addEventListener('click', function(){
    contarPasso++;
    const container = document.getElementById('passosContainer')
    const novoPasso = document.createElement('div')
    novoPasso.className = 'passoItem'
    novoPasso.innerHTML = `
        <input type="text" class="passoInput" placeholder="Descreva o passo" name="passos[]">
        <button type="button" class="removerPasso" onclick="removerPasso(this)">X</button>
    `;
    container.appendChild(novoPasso)
});

function removerPasso(botao){
    if (document.querySelectorAll('.passoItem').length > 1){
        botao.parentElement.remove()
    } else {
        alert('A tarefa deve ter pelo menos um passo!')
    }
}

document.getElementById('tarefaForm').addEventListener('submit', (e) =>{
    e.preventDefault()

    const passos = Array.from(document.querySelectorAll('.passoInput'))
    .map(input => input.value.trim())
    .filter(passo => passo !== '')

    if (passos.length === 0) {
        alert('Adicione pelo menos um passo!');
        return;
    }
    const dados = {
    titulo: document.getElementById('titulo').value,
    passos: passos,
    concluida: false,
    passosConcluidos: []
    };

    fetch('/salvarTarefas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados)
    })

    .then(response =>  response.json())
    .then(data => {
        if (data.success) {
            alert('Tarefa salva com sucesso!');
            window.location.href = '/';
        } else {
            alert('Erro!' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao salvar tarefa');
    })
});

