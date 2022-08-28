import batch from "./batch";
/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
    AWS_REGION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    R2_ACCOUNT_ID: string;
    BUCKET_NAME: string;
    TOKEN: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const authHeader = request.headers.get("authorization");
    const authKey = authHeader?.split(' ')[1];
    const decodedAuthKey = atob(authKey ? authKey : "");
    if (decodedAuthKey !== `${env.TOKEN}:`) {
      return new Response(request.url, {status: 403});
    }
    if (request.url.endsWith("/objects/batch") && request.method == "POST") {
      try {
        return batch(request, env);
      } catch (error) {
        console.log(error);
      }
    }
      return new Response(request.url);
  },
};
