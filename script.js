let userOnline = []
let conteudo = document.querySelector("ul")

for (let i = 0; i < 10; i++) {
    userOnline.push("NoUser")
}

function sendmsg() {
    let sender = prompt("QuemEnvia");
    let receiver = prompt("quemRecebe / vazio=Todos");
    sender = userOnline[sender - 1];
    if (receiver == "") {

        receiver = "Todos"

    }
    else {
        receiver = userOnline[receiver - 1]
    }

    let msgConteudo = prompt("Publica(p) ou Privada (dm)")
    let msgTexto = prompt("Escreva abaixo")

    if (msgConteudo == "p") {



        msgPublica(sender, receiver, msgTexto);
    }

    else if (msgConteudo == "dm") {
        msgPrivada(sender, receiver, msgTexto);
    }

    else {
        msgPublica(sender, receiver, msgTexto);
    }
}


function setUser() {
    let numbUser = userOnline.indexOf("NoUser");
    let user = prompt("qual nome do usuario?");
    userOnline[numbUser] = user;
}

function removeUser() {
    let user = prompt("qual usuario remover");
    let numbUser = userOnline.indexOf(user);
    userOnline[numbUser] = "NoUser"
}

function msgPrivada(sender, receiver, msgTexto) {
    let caixaMsg = `<li class="caixa-mensagem privada">
    <h1>${time()} <strong> ${sender}</strong> para <strong>${receiver}</strong>: ${msgTexto}</h1>
    </li>`
    conteudo.innerHTML += caixaMsg;
    let elemento = conteudo.querySelector("ul li:last-child");
    elemento.scrollIntoView();
}

function msgPublica(sender, receiver, msgTexto) {
    if (receiver === null) {
        receiver = "Todos"
    }
    let caixaMsg = `<li class="caixa-mensagem publica">
    <h1>${time()} <strong>${sender}</strong> para <strong>${receiver}</strong>: ${msgTexto}</h1>
    </li>`
    conteudo.innerHTML += caixaMsg;
    let elemento = conteudo.querySelector("ul li:last-child");
    elemento.scrollIntoView();

}


function time() {
    let data = new Date();
    let hora = data.getHours();
    let minuto = data.getMinutes()
    let segundo = data.getSeconds();
    if (minuto < 10) {
        minuto = `0${minuto}`
    }
    if (segundo < 10) {
        segundo = `0${segundo}`
    }

    let time = `(${hora}:${minuto}:${segundo})`
    return time;
}