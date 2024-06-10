//captura o botao adcionar nova tarefa 
const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
//captura o formulario
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
//captura o text area
const textArea = document.querySelector('.app__form-textarea');
//captura o ul que vai abrigar os as tarefas em formas de li
const ulTarefas = document.querySelector('.app__section-task-list');
//paragrafo onde fica a descrição da tarefa em destaque
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
//captura botao para remover tarefas concluidas
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
//captura botao para remover todas as tarefas
const btnRemoverTodas = document.querySelector('#btn-remover-todas');
// recebe um array de objetos esses objetos são as tarefas recuperadas do local storage
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

let tarefaSelecionada = null;
let liTarefaSelecionada = null;

// essa função aualiza as tarefas no local storage
function atulaizarTarefas() {
    //manda as tarefas para o local storafe usando api do json
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

//funçao que ira criar as tarefas na tela
function criarElementoTarefa(tarefa) {
    //cria o elemnto li no html
    const li = document.createElement('li');
    //atribui uma nova classe ao elemento li
    li.classList.add('app__section-task-list-item');

    //cria um elemento svg no html
    const svg = document.createElement('svg');
    //insere um texto dentro do elemento html svg, mas esse texto é interpretado pelo navegador
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;

    //cria um elemento P no html
    const paragrafo = document.createElement('p');
    //adiciona uma classe ao elemento P
    paragrafo.classList.add('app__section-task-list-item-description');
    //adiciona um texto no elemento P
    paragrafo.textContent = tarefa.descricao;

    //cria um elemento button no html
    const botao = document.createElement('button');
    //adiciona uma classe no botao
    botao.classList.add('app_button-edit');
    //cria um elemento IMG
    const imagemBotao = document.createElement('img');
    //indica o caminho src para a tag img
    imagemBotao.setAttribute('src', './imagens/edit.png');

    //define o onclick para o botao criado
    botao.onclick = () => {
        //abre um prompt que permite digitar a edição para uma tarefa ja existente
        const novaDescricao = prompt("Qual o novo nome da tarefa");
        //confere se a nova descrição tem texto
        if (novaDescricao) {
            //redefine o texto do paragrafo para a novaDescrição digitada no prompt
            paragrafo.textContent = novaDescricao;
            //redefine a tarefa no local storage
            tarefa.descricao = novaDescricao;
            //função atualizar tarefa, atualiza as tarefas no local storage
            atulaizarTarefas();
        }

    }

    //torna a imagem um elemento filho do botao
    botao.append(imagemBotao);
    //torna o svg um filho do LI
    li.append(svg);
    //torna o paragrafo um filho do LI
    li.append(paragrafo);
    //torna o botao um filho do LI
    li.append(botao);

    //verifica se a tarefa esta completa
    if (tarefa.completa) {
        //adiciona uma classe ao LI para tornar ele completa
        li.classList.add('app__section-task-list-item-complete');
        //torna impossivel clicar no botao adicionando o atributo disable
        botao.setAttribute('disabled', 'disabled');
        //caso nao esteja completa
    } else {
        //adiciona o evento onclick no li e chama uma funçao anonima
        li.onclick = () => {
            //passa o for each pelos elementos com a classe selecionada
            document.querySelectorAll('.app__section-task-list-item-active').forEach(elemento => {
                //remove a classe selecionada de cada elemento a passar pelo for each
                elemento.classList.remove('app__section-task-list-item-active');
            });
            //compara se a tarefa seleciona é igual a tarefa mandada por argumento
            if (tarefaSelecionada == tarefa) {
                //adiciona um texto novo no paragrafo
                paragrafoDescricaoTarefa.textContent = '';
                //retorna a tarefa selecionada para null
                tarefaSelecionada = null;
                //retorna li tarefa selecionada para null
                liTarefaSelecionada = null;
                //encerra o onclick
                return
            };
            //torna a tarefa selecionada igual a tarefa
            tarefaSelecionada = tarefa;
            //torna litarefa selecionada igual a li
            liTarefaSelecionada = li;
            //muda o texto do paragrafo
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
            //ativa a tarefa selecionada
            li.classList.add('app__section-task-list-item-active');
        }
    }


    //encerra a função criar elemento tarefa retornando um li
    return li;
}

//evento de click no botao adicinar tarefa
btnAdicionarTarefa.addEventListener('click', () => {
    //verifica se o input de texto tem a classe hidden, se tiver e removido e vise versa
    //faz aparecer e sumir o input de texto
    formAdicionarTarefa.classList.toggle('hidden');
});

//adiciona um evento de submit
formAdicionarTarefa.addEventListener('submit', (evento) => {

    //evita o comportamento que vem por default do input
    //evita que ao dar submit no formulario a pagina seja recarregada
    evento.preventDefault();
    //define a descrição do objeto tarefa como o texto do text area
    const tarefa = {
        descricao: textArea.value
    };
    //adiciona a nova tarefa no final de array de tarefa's'
    tarefas.push(tarefa);
    //guarda o li gerado pela função criarElementoTarefa dentro da constante elemento tarefa 
    const elementoTarefa = criarElementoTarefa(tarefa);
    //torna o li dentro de elementoTarefa filho do ulTarefas
    ulTarefas.append(elementoTarefa);
    //chama a função atualizar tarefas
    atulaizarTarefas();
    //redefine o valor da text area para ''
    textArea.value = '';
    //adiciona a class hidden ao form do text area que faz ele sumir
    formAdicionarTarefa.classList.add('hidden');
});

//for each que percorre todas as tarefasa
//trecho do codigo executado toda vez que recarrega a pagina recuperando dados do localStorage
tarefas.forEach(tarefa => {

    //chama a funçao criaElementoTarefa e guarda na constante
    const elementoTarefa = criarElementoTarefa(tarefa);
    //coloca o li como elemento filho do ulTarefas
    ulTarefas.append(elementoTarefa)
});

//escuta o evento foco finalizado que foi disparado dentro do script.js quando o cronometro encerrou
document.addEventListener('FocoFinalizado', () => {
    //verifica se a tarefa selecionada e o liTarefaselecionada são verdadeiro
    if (tarefaSelecionada && liTarefaSelecionada) {
        //all remove a classe active da li
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        //adiciona a classe de concluida a li
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        //torna o botao disable
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        //adiciona ao objeto a propriedade completa a torna true
        tarefaSelecionada.completa = true;
        //chama a função atualizar tarefas
        atulaizarTarefas()
    }
})

//const que guarda a função para remover tarefas
const removerTarefas = (somenteCompletas) => {
    //ternario que verifica se somente completas é verdadeira e então define o valor da constante
    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
    //for each percorre todos os elementos com a classe do seletor e o remove
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    });
    //ternario que verifica somente completas, se true filtras as completas pra remover se não remove todas e retorna um array vazio
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    //chama a função atualizar tarefas
    atulaizarTarefas();
}
//chama a função remover tarefas seja com true ou false de forma a definir se sera as completas ou todas.
btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodas.onclick = () => removerTarefas(false);

console.log(tarefas)
