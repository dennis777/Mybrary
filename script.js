const socket = io("http://localhost:3000", {transports: ['websocket', 'polling', 'flashsocket']})

socket.on('user-connected', data => {
    console.log(data)
    document.getElementsByClassName('statusIndicator')[0].style.backgroundColor = 'rgb(47, 193, 81)'
})