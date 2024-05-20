export interface CubegenCodeSignature {
    entryName: string
    signature: string
}

export interface CubegenJson {
    hashProject: string
    signatures: CubegenCodeSignature[]
}
