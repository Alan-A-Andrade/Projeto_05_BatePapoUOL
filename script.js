let dataChatLast = {};
const dataChatUrl = "https://mock-api.bootcamp.respondeai.com.br/api/v4/uol/messages";
const dataUsersOnlineUrl = "https://mock-api.driven.com.br/api/v4/uol/participants";
const msgURL = "https://mock-api.driven.com.br/api/v4/uol/messages";
const logInURL = "https://mock-api.driven.com.br/api/v4/uol/status";
const chatContainerList = document.querySelector(".chat-msg");
let userName = "";
let previusRecipient = document.querySelector(".user-list .selected");
let privateModeOn = false
const firstUserList = document.querySelector(".user-list").innerHTML;

document.querySelector(".logIn-Screen").addEventListener("keypress", enterToLogIn);
document.querySelector("footer").addEventListener("keypress", enterToSend);

function enterToLogIn() {

    if (event.key === 'Enter') {
        askToLogIn();
    }
}

function enterToSend() {

    if (event.key === 'Enter') {
        sendMsg();
    }
}

function askToLogIn() {

    let userNameInput = document.querySelector(".logIn-Screen input")

    promiseLogIn = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", { name: userNameInput.value });

    document.querySelector(".loading-gif").classList.toggle("hidden")
    document.querySelector(".logIn-Screen h1").classList.toggle("hidden")
    document.querySelector(".logIn-Screen button").classList.toggle("hidden")
    document.querySelector(".logIn-Screen input").classList.toggle("hidden")

    promiseLogIn.then(getAnswerToLogIn);
    promiseLogIn.catch(failedLogIn);



    function getAnswerToLogIn(answer) {

        if (answer.data == "OK") {
            userName = userNameInput.value;
            document.querySelector(".logIn-Screen").classList.add("hidden")

            getDataChat(dataChatUrl);
            getDataUsersOnline(dataUsersOnlineUrl);
            setInterval(getDataChat, 3000, dataChatUrl);
            setInterval(getDataUsersOnline, 10000, dataUsersOnlineUrl);
            setInterval(KeepLoggedIn, 5000)

            let chatSettings = document.querySelector(".chat-options")
            chatSettings.classList.toggle("hidden")
        }

        else {
            failedLogIn()
        }
    }

    function failedLogIn() {
        alert("Já existe úsuario conectado com mesmo nome");
        reload()
    }
}

function KeepLoggedIn() {
    let constantRequest;
    constantRequest = axios.post(logInURL, { name: userName });
    constantRequest.then("");
    constantRequest.catch(reload);
}

function getDataChat(url) {

    getData(url);

    function getData(url) {

        let askPromise
        askPromise = axios.get(`${url}`);
        askPromise.then(getAnswer);
        askPromise.catch(failedAnswer);
    }

    function getAnswer(answer) {
        refreshChat(answer.data)
    }

    function failedAnswer(answer) {
        console.log(answer);
    }
}

function refreshChat(dataMsgChat) {
    if (dataChatLast.time === dataMsgChat[dataMsgChat.length - 1].time) {
        return;
    }

    else {
        chatContainerList.innerHTML = ""

        for (let i = 0; i < dataMsgChat.length; i++) {
            let from = dataMsgChat[i].from;
            let to = dataMsgChat[i].to;
            let text = dataMsgChat[i].text;
            let time = dataMsgChat[i].time;
            let type = dataMsgChat[i].type;

            if (type === "status") {
                chatContainerList.innerHTML += `<li data-identifier="message" class="${type}" dataMsgChat-identifier="message"><p><time-text>${time}</time-text> <user-text>${from}</user-text> ${text}</p></li>                                                `
            }

            else {

                if (type === "private_message") {

                    if (to === userName || to === "'Todos'" || from === userName) {
                        chatContainerList.innerHTML += `<li data-identifier="message" class="${type}" dataMsgChat-identifier="message"><p><time-text>${time}</time-text> <user-text>${from}</user-text> reservadamente para <user-text>${to}</user-text>: ${text}</p></li>`
                    }

                    else {
                        continue;
                    }
                }

                else {
                    chatContainerList.innerHTML +=
                        `<li data-identifier="message" class="${type}" dataMsgChat-identifier="message"><p><time-text>${time}</time-text> <user-text>${from}</user-text> para <user-text>${to}</user-text>: ${text}</p></li>`
                }
            }

            if (i == dataMsgChat.length - 1) {
                let elemento = chatContainerList.querySelector("li:last-child");
                elemento.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
                dataChatLast = dataMsgChat[i];
            }
        }
    }
}

function getDataUsersOnline(url) {

    getData(url);

    function getData(url) {
        let askPromise
        askPromise = axios.get(`${url}`);
        askPromise.then(getAnswer);
        askPromise.catch(failedAnswer);
    }

    function getAnswer(answer) {
        refreshUserOnline(answer.data)
    }

    function failedAnswer(answer) {
        console.log(answer);
    }
}

function refreshUserOnline(dataUserOnline) {
    let arrayUsers = dataUserOnline.map(a => a.name)
    let selectedIsOn = arrayUsers.some(previusRecipientOnline)
    if (!selectedIsOn && previusRecipient.querySelector("h1").innerHTML !== "Todos") {
        let listUserOnline = document.querySelector(".user-list")
        listUserOnline.innerHTML = firstUserList
        listUserOnline.innerHTML += `<li data-identifier="participant" class="disconnected" onclick="selectUserTo(this)"><div class="icon-name"><ion-icon name="people"></ion-icon><h1>${previusRecipient.querySelector("h1").innerHTML}</h1></div><ion-icon class="hidden" name="checkmark"></ion-icon></li>`;

        dataUserOnline.forEach(userOnlineList);

        let innerCheck = document.querySelector(".user-list .selected");
        let newCheck = document.querySelector(".disconnected");
        innerCheck.classList.remove("selected")
        innerCheck.querySelector(`ion-icon[name="checkmark"]`).classList.add("hidden");
        newCheck.classList.add("selected")
        newCheck.querySelector(`ion-icon[name="checkmark"]`).classList.remove("hidden");
        sendModeSet("(desconectado)", "disconnected")

    }

    else if (previusRecipient.querySelector("h1").innerHTML === "Todos") {
        let listUserOnline = document.querySelector(".user-list")

        listUserOnline.innerHTML = firstUserList
        dataUserOnline.forEach(userOnlineList);
        sendModeSet("", "blank")
    }

    else {

        let listUserOnline = document.querySelector(".user-list")
        listUserOnline.innerHTML = firstUserList
        listUserOnline.innerHTML += `<li data-identifier="participant" class="selected" onclick="selectUserTo(this)"><div class="icon-name"><ion-icon name="people"></ion-icon><h1>${previusRecipient.querySelector("h1").innerHTML}</h1></div><ion-icon class="" name="checkmark"></ion-icon></li>`;

        dataUserOnline.forEach(userOnlineList);

        let innerCheck = document.querySelector(".user-list .selected");
        innerCheck.classList.remove("selected")
        innerCheck.querySelector(`ion-icon[name="checkmark"]`).classList.add("hidden");
        sendModeSet("", "blank")
    }
}

function userOnlineList(data) {

    let listUserOnline = document.querySelector(".user-list")

    if (previusRecipient.querySelector("h1").innerHTML === data.name) {
        return;
    }

    listUserOnline.innerHTML += `<li data-identifier="participant" class="" onclick="selectUserTo(this)"><div class="icon-name"><ion-icon name="people"></ion-icon><h1>${data.name}</h1></div><ion-icon class="hidden" name="checkmark"></ion-icon></li>`
}

function previusRecipientOnline(names) {
    if (names == previusRecipient.querySelector("h1").innerHTML) {
        return names
    }
}


function selectUserTo(SelectedRecipient) {

    previusRecipient = document.querySelector(".user-list .selected");

    if (previusRecipient.querySelector("h1").innerHTML === SelectedRecipient.innerHTML) {
        return;
    }

    else {
        previusRecipient.classList.toggle("selected")
        previusRecipient.querySelector(`ion-icon[name="checkmark"]`).classList.add("hidden")
        SelectedRecipient.classList.toggle("selected")
        SelectedRecipient.querySelector(`ion-icon[name="checkmark"]`).classList.toggle("hidden")
        previusRecipient = SelectedRecipient;
    }

    sendModeSet("", "blank")
}

function selectVisibilityMode(element) {

    let previusMode = document.querySelector(".privacity .selected");

    if (previusMode === element) {
        return;
    }

    else {
        privateModeOn = !privateModeOn
        previusMode.classList.remove("selected")
        previusMode.querySelector(`ion-icon[name="checkmark"]`).classList.add("hidden")
        element.classList.add("selected")
        element.querySelector(`ion-icon[name="checkmark"]`).classList.remove("hidden")
        sendModeSet("", "blank")
    }
}


function toggleChatOptions() {

    let chatSettings = document.querySelector(".chat-options")
    chatSettings.classList.toggle("chat-options-show")

    let backgroundTransparency = document.querySelector(".background-options")
    backgroundTransparency.classList.toggle("background-options-show")
}

function sendModeSet(string, style) {

    let text = document.querySelector("footer > div > div");

    if (!privateModeOn) {
        text.innerHTML = `Enviado para <${style}>${previusRecipient.querySelector("h1").innerText}</${style}> ${string}`
    }


    else {
        text.innerHTML = `Enviado reservadamente para <${style}>${previusRecipient.querySelector("h1").innerText}</${style}> ${string}`
    }
}


function sendMsg() {

    let userMsgText = document.querySelector("footer input").value;
    let userMsgType;

    if (!privateModeOn) {
        userMsgType = "message"
    }
    else {
        userMsgType = "private_message"
    }

    if (userMsgText === null || userMsgText === undefined || userMsgText === "") {
        return;
    }

    else {

        let msg = { from: userName, to: previusRecipient.querySelector("h1").innerText, text: userMsgText, type: userMsgType }
        promiseMsg(msg);
    }
}

function promiseMsg(msg) {

    let promiseUserMsg = axios.post(msgURL, msg);

    promiseUserMsg.then(clearUserMsg);
    promiseUserMsg.catch(reload);
}

function clearUserMsg() {

    let SendUserMsgBox = document.querySelector("footer input")
    getDataChat(dataChatUrl);
    SendUserMsgBox.value = "";
}

function reload() {
    window.location.reload();
}
