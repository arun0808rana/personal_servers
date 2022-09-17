const express = require('express');
const app = express();

const runRemoteServer = require('./utils/runRemoteServer');
const port = 9999;

app.use(express.json());

app.post('/', async (req, res) => {
    const body = req.body;
    const remoteServer = body.remoteServer;
    const success = await runRemoteServer(remoteServer);
    if (success) {
        res.status(200).json({ success: true })
    } else {
        res.status(500).json({ success: false })
    }
})

app.listen(port, () => {
    console.log(`init_servers listening on port ${port}`)
})