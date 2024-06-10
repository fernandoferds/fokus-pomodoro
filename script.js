//const html salva a tag html
const html = document.querySelector('html');
//cont focoBt salva o elemento com a classe .app__card-button--foco
const focoBt = document.querySelector('.app__card-button--foco');
//cont focoBt salva o elemento com a classe .app__card-button--curto
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const musicaFocoInput = document.querySelector('#alternar-musica');
const startPauseBt = document.querySelector('#start-pause');
const iniciarPausarBt = document.querySelector('#start-pause span');
const imgPlayPause = document.querySelector('.app__card-primary-butto-icon');
//const musica salva um elemento do tipo audio
const musica = new Audio('./sons/luna-rise-part-one.mp3');
const tempoTela = document.querySelector('#timer');
//musica.loop garante que o audio tocado fique em loop
musica.loop = true;
const songPlay = new Audio('./sons/play.wav');
const songPause = new Audio('./sons/pause.mp3');
const songTimeUp = new Audio('./sons/beep.mp3');


let tempoDecorridoEmSegundos = 1500;
let intervalId = null;

//evento que captura o clique do usuario na const musica foco input
musicaFocoInput.addEventListener('change', () => {
    //ao clicar detecta se a musica esta tocando ou não e então da play ou pause na musica
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    };
})

//evento que detecta o clique na const focoBt
focoBt.addEventListener('click', () => {
    //redefine o tempo do cronometro
    tempoDecorridoEmSegundos = 1500;
    //chama a function alterar contexto
    alterarContexto('foco');
    //adiciona a classe active ao focoBt
    focoBt.classList.add('active');
})


curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto');

    curtoBt.classList.add('active');
})

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
})


//função alterar contexto, altera o contexto do atributo data do html
function alterarContexto(contexto) {
    //chama a função mostrar tempo
    mostrarTempo();

    //remove a classe active de todos os elementos qeu a tenham
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active');
    });

    //altera o data contexto de acordo com o parametro fornecido pelo clique em algum dos evento foco longo ou curtoBt
    html.setAttribute('data-contexto', contexto);

    //altera a imagem tambem baseado no parametro fornecido pelo clique
    banner.setAttribute('src', `./imagens/${contexto}.png`);

    //altera o texto baseado no contexto
    switch (contexto) {
        case "foco":
            titulo.innerHTML = ` Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`;
            break;
        case "descanso-curto":
            titulo.innerHTML = `Que tal dar uma respirada?  <strong class="app__title-strong">Faça uma pausa.</strong>`;
            break;
        case "descanso-longo":
            titulo.innerHTML = `Hora de voltar a superfície. <strong class="app__title-strong">Faça uma pausa longa.</strong>`;
            break;

        default:
            break;
    }
}

//const contagem regressiva que contem uma função anonima que inicia a contagem regressiva
const contagemRegressiva = () => {

    //caso o tempo decorrido igual a 0, inicia a musica de fim, imprime alert e chama a funçãozerar e então termina a contagem
    if (tempoDecorridoEmSegundos <= 0) {

        songTimeUp.play();
        alert('tempo finalizado');
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if (focoAtivo) {
            //evento que marca o final da contagem regressiva
            const evento = new CustomEvent('FocoFinalizado');
            //dispara o evento pelo document permitindo que outros scripts o ouçam
            document.dispatchEvent(evento);

        }
        zerar();
        return
    }
    //caso tempo decorrido maior que 0 retira um do tempo e então chama a função mostrar tempo
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo()

}
//ao clicarno botão começar inicia a função 'iniciar'
startPauseBt.addEventListener('click', iniciar);


//função iniciar inicia o setInterval que vai a cada segundo chamar a função de contagem regressiva
function iniciar() {

    //caso o intervalo esteja true chama a função zerar
    if (intervalId) {
        //função zerar que vai limpar o setInterval, return que vai encerrar a função iniciar
        zerar()
        return
    }
    //toca o som de play
    songPlay.play();
    //inicia o set interval da contagem regressiva a cada segundo
    intervalId = setInterval(contagemRegressiva, 1000)

    //troca o texto do botão de começar para pausar e a imagem de play pra pause
    iniciarPausarBt.textContent = "Pausar";
    imgPlayPause.setAttribute('src', './imagens/pause.png');
}

//função zerar que vai limpar o setInterval
function zerar() {

    //vai tocar o som de pause
    songPause.play();
    //mudar o texto do borão para começar
    iniciarPausarBt.textContent = "Começar";
    //mudar a imagem de pause para play
    imgPlayPause.setAttribute('src', './imagens/play_arrow.png');
    //limpar o set interval e para o cronometro
    clearInterval(intervalId);
    //colocar o interval em null 
    intervalId = null;
}

//essa função mostra o relogio na tela
function mostrarTempo() {
    //const tempo defina um objeto do tipo date, multiplica o tempo decorrido por mil pois ele calcula em milisegundos
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    //formata o tempo para menitos e segundos, outras formas tambem são possiveis
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', { minute: '2-digit', second: '2-digit' });
    //imprime o tempo formatado na tela
    tempoTela.innerHTML = `${tempoFormatado}`;
}
//exibe o tempo na tela desde quando abre a pagina
mostrarTempo()