const youtubedl = require('youtube-dl-exec');

const downloadMedia = async (ytdlOptions) => {
    const format = ytdlOptions?.format;
    const url = ytdlOptions?.url;

    const promise = new Promise((res, rej) => {
        youtubedl(url, {
            f: format,
            o: `${ytdlOptions.downloadPath}/%(title)s.%(ext)s`
        }).then(output => {
            console.log('output', output)
            console.log('exit')
            res({
                success: true,
                error: null,
            })
        }).catch(error => {
            rej({
                success: false,
                error
            })
        })
    })
    return promise;
}

module.exports = downloadMedia;