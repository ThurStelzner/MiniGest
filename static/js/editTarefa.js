// Lógica para adicionar novos campos de passo
document.getElementById('addPassoEdit').addEventListener('click', () => {
    const container = document.getElementById('passosContainer');
    const div = document.createElement('div');
    div.className = 'passoItem';
    // MUDANÇA: Agora o novo botão chama a função removerPasso(this)
    div.innerHTML = `
        <input type="text" class="passoInput" placeholder="Descreva o passo">
        <button type="button" class="removerPasso" onclick="removerPasso(this)">X</button>
    `;
    container.appendChild(div);
});

// Esta função agora controla TODOS os botões de remover da página
function removerPasso(botao) {
    const totalPassos = document.querySelectorAll('.passoItem').length;
    if (totalPassos > 1) {
        botao.parentElement.remove();
    } else {
        alert('A tarefa deve ter pelo menos um passo!');
    }
}

// Envio dos dados editados
document.getElementById('editForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const passos = Array.from(document.querySelectorAll('.passoInput'))
        .map(i => i.value.trim())
        .filter(v => v !== '');
    
    if (passos.length === 0) {
        alert('Adicione pelo menos um passo!');
        return;
    }
    
    fetch('/atualizarTarefa', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: document.getElementById('tarefaId').value,
            titulo: document.getElementById('titulo').value,
            passos: passos,
            passosConcluidos: [] 
        })
    }).then(() => window.location.href = '/');
});