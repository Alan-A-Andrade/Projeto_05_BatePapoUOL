let menuContatos = document.querySelector(".menu")

let info;
let data;
const conteudoChat = document.querySelector("section ul")


setInterval(buscarDados, 3000);

function buscarDados() {
    info = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v4/uol/messages");
    info.then(esperarResposta);
}

function esperarResposta(resposta) {
    data = resposta.data
    BuscarMensagem();
}


function abrirMenu() {
    menuContatos.classList.toggle("hidden")

}

function BuscarMensagem() {
    conteudoChat.innerHTML = ""

    for (let i = 0; i < data.length; i++) {

        let from = data[i].from;
        let to = data[i].to;
        let text = data[i].text;
        let time = data[i].time;
        let type = data[i].type;

        conteudoChat.innerHTML +=
            `<li class="caixa-mensagem ${type}" data-identifier="message">
                <h1>${time} <strong> ${from}</strong> para <strong>${to}</strong>: ${text}</h1>
            </li>`

        if (i == data.length - 1) {
            let elemento = conteudoChat.querySelector("ul li:last-child");
            elemento.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
    }

}



function preencherChat() {




}

//funcções para teste

function removerHidden(elemento) {
    elemento = elemento.closest("div")
    elemento.classList.toggle("hidden")
}

