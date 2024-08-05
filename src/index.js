const { server, io } = require('./server');

const PORT = process.env.PORT || 3008;

if (!server.listening) {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
