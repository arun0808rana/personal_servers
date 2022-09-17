const express = require('express');
const app = express();
const downloadMedia = require('./utils/downloadMedia');
var fs = require('fs');

const port = 1234;

app.use(express.json());

app.post('/', async (req, res) => {
    const ytdlOptions = await req.body.ytdlOptions;
    const downloadPath = __dirname + '/downloads'

    // if downloads dir doesn't exists, then make it
    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath);
    }

    // adding download path for video
    ytdlOptions.downloadPath = downloadPath;

    const status = await downloadMedia(ytdlOptions);

    if (status.success) {
        res.status(200).json({ success: true });
    } else {
        res.status(500).json({ sucess: false, error: status.error })
    }
    process.exit(0);
})

app.listen(port, () => {
    console.log(`youtube-manage-personal-server listening on port ${port}`)
})