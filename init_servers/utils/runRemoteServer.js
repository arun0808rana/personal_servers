const runRemoteServer = async (remoteServer) => {
    const spawn = require('child_process').spawn;
    const commandList = [
        `node "${remoteServer.path}"`
    ].join(' && ');

    const runCommandList = new Promise((resolve, reject) => {
        let child = spawn(commandList, {
            shell: true
        });
        child.stderr.on('data', (data) => {
            console.error("STDERR:", data.toString());
            reject(false);
        });
        child.stdout.on('data', (data) => {
            console.log("STDOUT:", data.toString());
            resolve({ child, success: true });
        });
        child.on('exit', (exitCode) => {
            console.log(`[${remoteServer.name}] exited with code: ` + exitCode);
        });
    })

    const success = await runCommandList;


    // hitting youtube-manage-person-server
    if (success.success) {
        return new Promise(async (resolve, reject) => {
            let payload = JSON.stringify(remoteServer.payload);
            const data = await hitApi(payload)

            if (data) {
                success.child.kill();
                console.log('KILLING Youtube Server')
                resolve(true);
            } else {
                reject(false);
            }
        })
    } else {
        return new Promise.reject(false);
    }
}

async function hitApi(payload) {
    const promise = new Promise(async (resolve, reject) => {
        var post_options = {
            host: 'localhost',
            port: '1234',
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        // Set up the request
        var post_req = require('http').request(post_options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                resolve(true)
            });
        });

        // post the data
        await post_req.write(payload);
        await post_req.end();
    })

    return await promise;
}

module.exports = runRemoteServer;