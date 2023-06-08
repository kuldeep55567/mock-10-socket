const socket = io()
socket.emit('join', { room: "My-Room" })
socket.on("joinedRoom", (data) => {
    console.log("Successfully joined Default room")
})
let text_area = document.getElementById("text-area")
let message_area = document.getElementById("message-area")
let name;
do {
    name = prompt("Enter your name")
} while (!name);
const append = (mssg, value) => {
    const messageElement = document.createElement('div')
    messageElement.innerText = mssg
    messageElement.classList.add('messageBet')
    message_area.append(messageElement)
}
socket.emit('new_user', name)
socket.on('user-joined', name => {
    append(`${name} joined the chat🗨️`, 'outgoing')

})
socket.emit('user-left', name)
socket.on('user_went', name => {
    append(`${name}left the chat🗨️`, 'outgoing')

})
text_area.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})
function sendMessage(message) {
    let mssg = {
        user: name,
        message: message.trim()
    }
    appendMessage(mssg, 'outgoing')
    text_area.value = ''
    scrollToBottom()
    socket.emit('message', mssg)
}
function appendMessage(mssg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, "message")
    let toAppend = `
    <h4>${mssg.user}</h4>
    <p>${mssg.message}</p>
    `
    mainDiv.innerHTML = toAppend
    message_area.appendChild(mainDiv)
}
socket.on('message', (mssg) => {
    appendMessage(mssg, "incoming")
    scrollToBottom()
})
socket.on('joined', (OnlineData) => {
    const online_list = document.getElementById("online-list")
    const li = document.createElement("li")
    li.innerHTML = `<strong>${OnlineData.user}:</strong>${OnlineData.online}<em>${OnlineData.time}</em>`
    online_list.append(li)
})
function scrollToBottom() {
    message_area.scrollTop = message_area.scrollHeight
}