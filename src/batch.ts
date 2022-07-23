import { BatchRequest, BatchResponse, Operation } from "./common/types";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Env } from ".";


async function handler(body: Request, env: Env): Promise<Response> {
const client = new S3Client({endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, 
                             region: env.AWS_REGION,
                             credentials: {accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY}})
    const batchRequest = await body.json<BatchRequest>();
    const actionName = batchRequest.operation;
    const objects = batchRequest.objects.map(async object => {
        var command;
        if (actionName == Operation.UPLOAD) {
            command = new PutObjectCommand({Bucket: env.BUCKET_NAME, Key: `objects/${object.oid}`});
        } else {
            command = new GetObjectCommand({Bucket: env.BUCKET_NAME, Key: `objects/${object.oid}`});

        }
        const url = await getSignedUrl(client, command, { expiresIn: 3600 });
        const action = {
            [actionName]: {
                href: url,
                expires_in: 3600
            }
        }
        return {authenticated: true, actions: action, ...object};
    });
    let response: BatchResponse = {
        transfer: "basic",
        objects: await Promise.all(objects)
    };
    return new Response(JSON.stringify(response), {status: 200, headers: {"Content-Type": "application/json"}});
}

export default handler;