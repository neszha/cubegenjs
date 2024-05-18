import { type CubegenNodeBuilderOptions } from './types/NodeProtector'

const privateKey1 = '%PRIVATE_KEY_1%'

export const evaluate = (options: CubegenNodeBuilderOptions, privateKey2: string = '%PRIVATE_KEY_2%'): boolean => {
    console.log(privateKey1)
    console.log(privateKey2)
    console.log(options)
    return true
}
