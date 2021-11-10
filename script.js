let menuContatos = document.querySelector(".menu")

let info;
let data;
const conteudoChat = document.querySelector("section ul");
let MenuLogin = document.querySelector(".tela-login")
let userNameInput = document.querySelector(".tela-login input");
let login;
let userName = ""
let userMsgPrivate = false;
let userMsgTo = "Todos";
const userSettings = document.querySelector(".encaminhado");

userSettings.innerHTML = `Enviado para ${userMsgTo}`;

function pedidoLogin() {

    let userLogin;
    userLogin = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", { name: userNameInput.value });
    userLogin.then(esperarLogin);
    userName = userNameInput.value;

}

setInterval(buscarDados, 3000);

function buscarDados() {
    info = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v4/uol/messages");
    info.then(esperarResposta);
}

function esperarLogin(resposta) {
    login = resposta.data
    if (login == "OK") {
        MenuLogin.classList.add("hidden")
        ManterConexao();
    }
    else {
        alert("Usuario ja logado")
    }

}

function ManterConexao() {

    setInterval(pedidoLoginContinuo, 5000)

}

function pedidoLoginContinuo() {

    let userLogin;
    userLogin = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", { name: userNameInput.value });
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

        if (type == "private_message") {

            if (to != userName || to != "Todos") {
                continue;
            }

        }

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


function escolherContato(item) {
    let menuanterior = item.closest("ul");
    let itemanterior = menuanterior.querySelector(".selecionado");

    if (itemanterior === null) {
        item.classList.add("selecionado");
        check(item);

    } else if (item === itemanterior) {
        return;

    } else {
        itemanterior.classList.remove("selecionado");
        check(itemanterior);
        item.classList.add("selecionado");
        check(item);
        userMsgTo = item.querySelector("h1").innerHTML
    }

    userSettings.innerHTML = `Enviado para ${userMsgTo}`
}

function escolherPrivacidade(item) {
    let menuanterior = item.closest("ul");
    let itemanterior = menuanterior.querySelector(".selecionado");
    if (item === itemanterior) {
        return;

    } else {
        itemanterior.classList.remove("selecionado");
        check(itemanterior);
        item.classList.add("selecionado");
        check(item);
        userMsgPrivate = !userMsgPrivate;
    }

    if (userMsgPrivate == true) {

        userSettings.innerHTML = `Enviado para ${userMsgTo} (reservadamente)`;
    }

    else {
        userSettings.innerHTML = `Enviado para ${userMsgTo}`;
    }
}

function check(elemento) {
    let checkativo;
    checkativo = elemento.querySelector("ion-icon[name='checkmark']");
    checkativo.classList.toggle("hidden");
}


function removerHidden(elemento) {
    elemento = elemento.closest("div")
    elemento.classList.toggle("hidden")
}

