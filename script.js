let menuContatos = document.querySelector(".menu")
let info;
let data;
let dataUserOnline;
let infoUserOnline;
const conteudoChat = document.querySelector("section ul");
let MenuLogin = document.querySelector(".tela-login")
let userNameInput = document.querySelector(".tela-login input");
let login;
let userName = ""
let userMsgPrivate = false;
let userMsgType = "message"
let userMsgTo = "Todos";
const userSettings = document.querySelector(".encaminhado");
const userOnlineList = document.querySelector(".user-list");


userSettings.innerHTML = `Enviado para ${userMsgTo}`;

function pedidoLogin() {

    let userLogin;
    userLogin = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", { name: userNameInput.value });
    userLogin.then(esperarLogin);
    userLogin.catch(anotherUser);
    userName = userNameInput.value;
}

function atualizarChat() {

    setInterval(buscarDados, 3000);

    function buscarDados() {
        info = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v4/uol/messages");
        info.then(esperarResposta);
    }

    function esperarResposta(resposta) {
        data = resposta.data
        BuscarMensagem();
    }
}

function atualizarUserOnline() {

    setInterval(buscarUserOnline, 10000);

    function buscarUserOnline() {
        infoUserOnline = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
        infoUserOnline.then(esperarLista);
    }

    function esperarLista(resposta) {
        dataUserOnline = resposta.data
        BuscarParticipantes();
    }
}


function esperarLogin(resposta) {
    login = resposta.data
    if (login == "OK") {
        MenuLogin.classList.add("hidden")
        atualizarChat()
        atualizarUserOnline();
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
    userLogin.then("");
    userLogin.catch(reload);

}

function anotherUser() {
    alert("Nome de usuário já em uso")
}


function reload() {
    window.location.reload()
}


function abrirMenu() {
    menuContatos.classList.toggle("hidden")

}

function BuscarParticipantes() {
    userOnlineList.innerHTML =
        `<li class="selecionado" onclick="escolherContato(this)">
    <div class="icon-name">
        <ion-icon name="people"></ion-icon>
        <h1>Todos</h1>
        <ion-icon class="" name="checkmark"></ion-icon>
    </div>
    </li>`

    for (let j = 0; j < dataUserOnline.length; j++) {

        let name = dataUserOnline[j].name;
        userOnlineList.innerHTML +=
            `<li onclick="escolherContato(this)">
        <div class="icon-name">
            <ion-icon name="person-circle"></ion-icon>
            <h1>${name}</h1>
            <ion-icon class="hidden" name="checkmark"></ion-icon>
        </div>
    </li>`


    }


}

function BuscarMensagem() {
    conteudoChat.innerHTML = ""

    for (let i = 0; i < data.length; i++) {

        let from = data[i].from;
        let to = data[i].to;
        let text = data[i].text;
        let time = data[i].time;
        let type = data[i].type;

        if (type == "status") {
            conteudoChat.innerHTML += `<li class="caixa-mensagem ${type}" data-identifier="message">
                <h1>${time} <strong> ${from}</strong> ${text}</h1>
        </li>`
        }

        else if (type == "private_message" && from == "Todos") {
            `<li class="caixa-mensagem ${type}" data-identifier="message">
            <h1>${time} <strong> ${from}</strong> para <strong>${to}</strong>: ${text}</h1>
    </li>`
        }

        else if (type == "private_message" && from != userName) {
            continue;
        }

        else {
            conteudoChat.innerHTML +=
                `<li class="caixa-mensagem ${type}" data-identifier="message">
                <h1>${time} <strong> ${from}</strong> para <strong>${to}</strong>: ${text}</h1>
        </li>`
        }

        if (i == data.length - 1) {
            let elemento = conteudoChat.querySelector("ul li:last-child");
            elemento.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
    }
}

function escolherContato(item) {
    let menuanterior = item.closest("ul");
    let itemanterior = menuanterior.querySelector(".selecionado");

    if (item === itemanterior) {
        return;

    } else {
        itemanterior.classList.remove("selecionado");
        check(itemanterior);
        item.classList.add("selecionado");
        check(item);
        userMsgTo = item.querySelector("h1").innerHTML
    }

    if (userMsgPrivate == true) {

        userSettings.innerHTML = `Enviado para ${userMsgTo} (reservadamente)`;
    }

    else {
        userSettings.innerHTML = `Enviado para ${userMsgTo}`;
    }
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
        privado();
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

function sendMsg(elemento) {
    let menuanterior = elemento.closest("footer");
    let caixaDeTexto = menuanterior.querySelector("input")

    userMsgTexto = caixaDeTexto.value;

    let msg =
    {
        from: userName,
        to: userMsgTo,
        text: userMsgTexto,
        type: userMsgType

    }
    pedidoMsg(msg)

}

function privado() {

    if (userMsgPrivate == true) {
        userMsgType = "private_message";
    }
}

function pedidoMsg(msg) {
    let promessa;
    promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", msg);
    promessa.then(limparMsg);
    promessa.catch(reload);

}

function limparMsg(resposta) {
    let caixaDeTexto = document.querySelector("footer input")
    caixaDeTexto.value = "";
}