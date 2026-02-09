from flask import Flask, render_template, request, jsonify, json
import os
from datetime import datetime
app = Flask(__name__)

dataFile = "data/usuario.json"
if not os.path.exists('data'):
        os.makedirs('data')

def lerDados():
        try:
                if os.path.exists(dataFile):
                        with open(dataFile, 'r', encoding='utf-8') as f:
                                return json.load(f)
                return[]
        except:
                return[]

def salvarDados(dados):
        with open(dataFile, 'w', encoding='utf-8') as f:
                json.dump(dados, f, ensure_ascii=False, indent=2)
        
@app.route('/')
def home():
        return render_template('home.html')

@app.route('/adicionar')
def adicionar():
        return render_template('adicionar.html')

@app.route('/salvarTarefas', methods=['POST'])
def salvarTarefas():
        try:
                dados = request.get_json()
                dados['id'] = datetime.now().strftime("%Y%m%d%H%M%S%f")
                dados['dataCriacao'] = datetime.now().isoformat()

                tarefas = lerDados()
                tarefas.append(dados)
                salvarDados(tarefas)

                return jsonify({"success": True, "id": dados['id']})
        except Exception as e:
                return jsonify({"error": str(e)})

@app.route('/carregarTarefas')
def carregarTarefas():
        tarefas = lerDados()
        return jsonify(tarefas)

@app.route('/atualizarPasso', methods=['POST'])
def atualizarPasso():
    try:
        dados = request.get_json()
        tarefa_id = dados.get('id')
        passo_index = int(dados.get('passoIndex'))
        concluido = dados.get('concluido')

        tarefas = lerDados() #
        for tarefa in tarefas:
            if tarefa['id'] == tarefa_id:
                if 'passosConcluidos' not in tarefa:
                    tarefa['passosConcluidos'] = []
                
                if concluido:
                    if passo_index not in tarefa['passosConcluidos']:
                        tarefa['passosConcluidos'].append(passo_index)
                else:
                    if passo_index in tarefa['passosConcluidos']:
                        tarefa['passosConcluidos'].remove(passo_index)
                break
        
        salvarDados(tarefas) #
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)})
    
@app.route('/excluirTarefa', methods=['POST'])
def excluirTarefa():
    try:
        dados = request.get_json()
        tarefa_id = dados.get('id')
        
        tarefas = lerDados() #
        # Cria uma nova lista sem a tarefa que queremos deletar
        tarefas_restantes = [t for t in tarefas if t['id'] != tarefa_id]
        
        salvarDados(tarefas_restantes) #
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)})
    
@app.route('/editar/<id>')
def editar(id):
    tarefas = lerDados()
    tarefa = next((t for t in tarefas if t['id'] == id), None)
    if tarefa:
        return render_template('editar.html', tarefa=tarefa)
    return "Tarefa não encontrada", 404

@app.route('/atualizarTarefa', methods=['POST'])
def atualizar_tarefa():
    try:
        dados_atualizados = request.get_json()
        tarefas = lerDados()
        
        for i, t in enumerate(tarefas):
            if t['id'] == dados_atualizados['id']:
                # Mantemos a data de criação original e o ID
                dados_atualizados['dataCriacao'] = t['dataCriacao']
                tarefas[i] = dados_atualizados
                break
        
        salvarDados(tarefas)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)})
    
if __name__ == '__main__':
        app.run(debug=True)