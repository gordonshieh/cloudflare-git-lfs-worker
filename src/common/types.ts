export enum Operation {
    UPLOAD = "upload",
    DOWNLOAD = "download",
    VERIFY = "verify",
}

export type BatchLFSObject = {
    oid: string;
    size: number;
}

export type BatchLFSObjectResponse = {
    authenticated?: boolean;
    actions: object;
} & BatchLFSObject;

export type BatchRequest = {
    transfers?: Array<string>;
    operation: Operation;
    objects: Array<BatchLFSObject>;
    hash_algo?: string;
}

export type BatchResponse = {
    transfer: string;
    objects: Array<BatchLFSObjectResponse>;
    hash_algo?: string;
}
