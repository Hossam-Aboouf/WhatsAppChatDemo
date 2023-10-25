const socket = io('https://whats-app-chat-1ed9508c75e0.herokuapp.com/');
const chatContainer = document.getElementById('chatContainer');


document.getElementById('sendBtn').addEventListener('click', sendMessage)

function sendMessage(e) {
    e.preventDefault()
    const input = document.getElementById('messageTxt')
    if (input.value) {
        var message = input.value.trim();
        var newMessageElement = document.createElement('div');
        newMessageElement.style.textAlign = 'right';
        newMessageElement.style.margin = '10px';
        newMessageElement.innerHTML = `<span>You</span> <br> <span>${message}</span`;
        socket.emit('sendMessage', message);
        chatContainer.scrollIntoView();
        chatContainer.appendChild(newMessageElement);
        input.value = "";
    }
    input.focus();
}

socket.on('sendMessage', (message) => {
    // Update your UI to display the new message
    if(message){
        message = message.value.trim();
        var newMessageElement = document.createElement('div');
        newMessageElement.style.textAlign = 'left';
        newMessageElement.style.margin = '10px';
        newMessageElement.innerHTML = `<span>Customer</span> <br> <span>${message}</span`;
        // io.emit('sendMessage', message);
        chatContainer.appendChild(newMessageElement);
        chatContainer.scrollIntoView();
    }
});

document.getElementById('messageTxt').onkeydown = (e) => {
    if(e.key==='Enter'){
        e.preventDefault();
        sendMessage(e);
    } 
};