let menuContatos = document.querySelector(".menu")
let respostaMsgChat;
let dataMsgChat;
let dataUserOnline;
let respostaUserOnline;
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
let msgToSelected = document.querySelector(".visibilidade .selecionado");
const buttonLogIn = document.getElementById("logInButton");
const msgFooter = document.querySelector("footer");
const buttonToSend = document.querySelector("#send-button")


userSettings.innerHTML = `Enviado para ${userMsgTo}`;

buttonLogIn.addEventListener("click", pedidoLogin);
MenuLogin.addEventListener("keypress", enterToLogIn);
msgFooter.addEventListener("keypress", enterToSend);

function enterToLogIn() {

    if (event.key === 'Enter') {
        pedidoLogin();
    }
}

function enterToSend() {

    if (event.key === 'Enter') {
        sendMsg(buttonToSend);
    }
}


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
        respostaMsgChat = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v4/uol/messages");
        respostaMsgChat.then(esperarResposta);
    }

    function esperarResposta(resposta) {
        dataMsgChat = resposta.data
        BuscarMensagem();
    }
}

function atualizarUserOnline() {

    setInterval(buscarUserOnline, 10000);

    function buscarUserOnline() {
        respostaUserOnline = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
        respostaUserOnline.then(esperarLista);
    }

    function esperarLista(resposta) {
        dataUserOnline = resposta.data
        BuscarParticipantes();
        escolherPrivacidade(msgToSelected)
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
        `<li id="Todos" class="" onclick="escolherContato(this)">
    <div class="icon-name">
        <ion-icon name="people"></ion-icon>
        <h1>Todos</h1>
        <ion-icon class="hidden" name="checkmark"></ion-icon>
    </div>
    </li>`

    for (let j = 0; j < dataUserOnline.length; j++) {

        let name = dataUserOnline[j].name;
        userOnlineList.innerHTML +=
            `<li data-identifier="participant" id="${name}" onclick="escolherContato(this)">
        <div class="icon-name">
            <ion-icon name="person-circle"></ion-icon>
            <h1>${name}</h1>
            <ion-icon class="hidden" name="checkmark"></ion-icon>
        </div>
    </li>`


        if (j == dataUserOnline.length - 1) {
            let elemento = document.getElementById(userMsgTo)
            elemento.classList.add("selecionado");
            check(elemento);
        }


    }
}

function BuscarMensagem() {
    conteudoChat.innerHTML = ""

    for (let i = 0; i < dataMsgChat.length; i++) {

        let from = dataMsgChat[i].from;
        let to = dataMsgChat[i].to;
        let text = dataMsgChat[i].text;
        let time = dataMsgChat[i].time;
        let type = dataMsgChat[i].type;

        if (type === "status") {
            conteudoChat.innerHTML += `<li data-identifier="message" class="caixa-mensagem ${type}" dataMsgChat-identifier="message">
                <h1>${time} <strong> ${from}</strong> ${text}</h1>
        </li>`
        }

        else {

            if (type === "private_message") {

                if (to === userName || to === "'Todos'" || from === userName) {
                    conteudoChat.innerHTML += `<li data-identifier="message" class="caixa-mensagem ${type}" dataMsgChat-identifier="message">
                    <h1>${time} <strong> ${from}</strong> reservadamente para <strong>${to}</strong>: ${text}</h1>
                    </li>`
                }

                else {
                    continue;
                }


            }

            else {

                conteudoChat.innerHTML +=
                    `<li data-identifier="message" class="caixa-mensagem ${type}" dataMsgChat-identifier="message">
                <h1>${time} <strong> ${from}</strong> para <strong>${to}</strong>: ${text}</h1>
                </li>`
            }
        }


        if (i == dataMsgChat.length - 1) {
            let elemento = conteudoChat.querySelector("ul li:last-child");
            elemento.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
    }

}

function escolherContato(item) {
    let menuanterior = item.closest("ul");
    let itemanterior = menuanterior.querySelector(".selecionado");

    if (itemanterior == undefined) {
        item = document.getElementById("Todos");
        item.classList.add("selecionado");
        check(item);
        userMsgPrivate = false;
    }

    else if (item === itemanterior) {
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

    msgToSelected = document.querySelector(".visibilidade .selecionado");
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


        if (userMsgPrivate == true) {

            userSettings.innerHTML = `Enviado para ${userMsgTo} (reservadamente)`;
        }

        else {
            userSettings.innerHTML = `Enviado para ${userMsgTo}`;
        }
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
    else {
        userMsgType = "message";
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

