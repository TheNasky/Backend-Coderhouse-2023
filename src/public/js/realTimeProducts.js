const socket = io()
socket.emit ('message','¡Hola, me estoy comunicando desde un websocket!')


socket.on("refresh",socket=>{
    console.log("refreshing")
})