import http from 'http';
import SocketService from './services/socket';
async function init() {
    const socketService = new SocketService(); 
    const httpserver = http.createServer();
    const PORT = process.env.PORT || 8000;
    socketService.io.attach(httpserver);
    httpserver.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    socketService.initlisteners();

}
init();