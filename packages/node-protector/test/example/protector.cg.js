// import { onModified, setBuilderOptions, setModificationProtectionOptions, onStart } from '../../../node-protector/dist/index.js'

// /**
//  * Builder Options.
//  */
// setBuilderOptions({
//     codeBundlingOptions: {
//         rootDir: './',
//         outDir: './dist',
//         entries: [
//             'server.js'
//         ],
//         staticDirs: [
//             'public'
//         ]
//     },
//     codeObfuscationOptions: {
//         target: 'node',
//         seed: 0
//     }
// })

// /**
//  * Run action after node protector is started.
//  */
// onStart(() => {
//     console.log('exec: onStart')
// })

// /**
//  * Modification Protection.
//  *
//  * Set enable to true to enable modification protection.
//  */
// setModificationProtectionOptions({
//     enabled: true
// })
// onModified(() => {
//     console.log('exec: onModified')
// })

import axios from 'axios'

axios.get('https://ifconfig.me/all.json').then((response) => {
    console.log(response.data)
}).catch((error) => {
    console.log(error)
})
