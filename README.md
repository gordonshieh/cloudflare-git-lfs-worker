# Cloudflare worker for git-lfs
Use Cloudflare's R2 service for your git-lfs objects. Cheaper than using S3 or other git providers!  

# Security concerns
This worker currently does not perform any authentication! This is not production ready for any commercial use case. You may secure this by whitelisting your IP address, but is not a "secure" workaround.  
Use at your own risk.

# Setup
1. Create your bucket in the Cloudflare console
2. Update `BUCKET_NAME` found in wrangler.toml with your bucket name
3. Deploy the worker: `npm run deploy`
4. Add the following secrets using wrangler
   - `npx wrangler secret put R2_ACCOUNT_ID`
   - `npx wrangler secret put AWS_ACCESS_KEY_ID`
   - `npx wrangler secret put AWS_SECRET_ACCESS_KEY`
5. In your git repo with binary objects, add the create/update `.lfsconfig` in your repo root:
``` 
[lfs]
url = https://git-lfs-cloudflare.<your subdomain>.workers.dev/
```
