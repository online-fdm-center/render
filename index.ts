import * as request from 'request-promise-native'
import * as path from 'path'
import * as stljs from './stljs'

require('dotenv').config()

const check = () => {
    request({
        url: 'http://api.online.fdm.center/getFileToRender',
        method: 'POST',
        headers: {
            'x-server-token': process.env.ADMIN_AUTH_TOKEN
        }
    })
    .then(answer => {
        return JSON.parse(answer)
    }).then(answer => {
        if (answer === null){
            setTimeout(check, 3000)
        } else {
            stljs.imageify(path.join(process.env.STL_DIR, answer.filename), {
                width: 800, 
                height: 500,
                dst: path.join(process.env.STL_DIR, answer.filename+'.png')
            }, (err, povOutput, name) => {
                if (err){
                    request({
                        url: `http://api.online.fdm.center/files/${answer.id}/setImage`,
                        method: 'POST',
                        headers: {
                            'x-server-token': process.env.ADMIN_AUTH_TOKEN,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({image: 'error.png'})
                    }).then(check)
                } else {
                    request({
                        url: `http://api.online.fdm.center/files/${answer.id}/setImage`,
                        method: 'POST',
                        headers: {
                            'x-server-token': process.env.ADMIN_AUTH_TOKEN,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({image: answer.filename+'.png'})
                    }).then(check)
                }
                console.log(povOutput)
                console.log(name)
            })
        }
    })
    .catch(error => {
        console.error(error)
        setTimeout(check, 3000)
    })
}

check()
