export interface CubegenCodeSignature {
    entryName: string
    signature: string
}

export interface CubegenLockJson {
    hashProject: string
    signatures: CubegenCodeSignature[]
}
