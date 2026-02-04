# Railway Migration Guide

This guide will walk you through deploying your MetalCore-Next application and its PostgreSQL database to Railway.

## Prerequisites

1.  **Railway Account**: Sign up at [railway.app](https://railway.app/).
2.  **GitHub Repository**: Ensure your code is pushed to a GitHub repository.

## Step 1: Create a Project on Railway

1.  Go to your Railway Dashboard.
2.  Click **"New Project"**.
3.  Select **"Deploy from GitHub repo"**.
4.  Select your repository (`MetalCore-Next`).
5.  Click **"Deploy Now"**.

> [!NOTE]
> The first deployment might fail because the database isn't connected and environment variables aren't set yet. This is normal.

## Step 2: Add PostgreSQL Database

1.  In your project view, click the **"New"** button (or right-click the canvas).
2.  Select **"Database"** -> **"PostgreSQL"**.
3.  Wait for the PostgreSQL service to initialize.

## Step 3: Connect Database to Application

1.  Click on your **PostgreSQL** service card.
2.  Go to the **"Variables"** tab.
3.  Copy the `DATABASE_URL` (it looks like `postgresql://postgres:password@host:port/railway`).
4.  Close the PostgreSQL card and click on your **Application** service card (the one with your repo name).
5.  Go to the **"Variables"** tab.
6.  Click **"New Variable"**.
7.  Key: `DATABASE_URL`
8.  Value: Paste the URL you copied effectively. Or better yet, type `${{PostgreSQL.DATABASE_URL}}` to automatically reference it.

> [!TIP]
> Using `${{PostgreSQL.DATABASE_URL}}` is the best practice as Railway manages the connection string automatically if it changes.

## Step 4: Configure Environment Variables

The only critical environment variable required for your backend to run is `DATABASE_URL`, which we covered in Step 3.

**Check your local environment:**
Your specific setup currently only uses `DATABASE_URL` in the `.env` file. Your Google AI key is handled on the client-side (via user input), so you do NOT need to set it here for the server.

If you add other environment variables in the future (like `NEXT_PUBLIC_...` or API keys), remember to add them in the **Variables** tab in your Application service.

### Step 4.5: Set Node.js Version

> [!IMPORTANT]
> You must set the Node.js version to 24 for Prisma to work correctly.

In your Application service's **Variables** tab:
1.  Click **"New Variable"**
2.  Key: `NIXPACKS_NODE_VERSION`
3.  Value: `24`
4.  Click **"Add"**

This ensures Railway uses Node.js 24.x instead of the default v18.

## Step 5: Verify Deployment

1.  Once variables are saved, Railway usually triggers a redeploy automatically. If not, go to the **"Deployments"** tab and click **"Redeploy"**.
2.  Watch the build logs. You should see `prisma generate` and `next build` running.
3.  Watch the deploy logs. You should see `prisma migrate deploy` running.
4.  Once "Active", click the generated URL to open your app.

## Step 6: Migrate Data (Local -> Railway)

If you have important data in your local Docker database, follow these steps to move it to Railway.

**1. Create a Backup of Local Data**:
Run this command in your project root terminal (PowerShell) to dump your local data to a file named `backup.sql`.
```powershell
docker exec -t metalcore-db pg_dump -U postgres --clean --if-exists metalcore_db > backup.sql
```

**2. Restore Data to Railway**:
You will need the **Public** connection URL from Railway.
1.  Go to your Railway project.
2.  Click on the **PostgreSQL** service.
3.  Go to the **"Variables"** tab.
4.  Copy the `DATABASE_PUBLIC_URL`. If you don't see it, go to the **"Settings"** tab, scroll to **"Networking"**, and click **"Generate Domain"** to create a public proxy. Then go back to variables and copy `DATABASE_PUBLIC_URL`.
    *   *Note: Using the public URL allows you to connect from your local machine.*

Run this command to push your local data to Railway (replace the URL with yours):
```powershell
docker run -i postgres:15 psql "postgresql://postgres:TAzhTCWNQyDUgyiQaCBYAnFFNzIjRrjH@shinkansen.proxy.rlwy.net:24311/railway" < backup.sql
```
*Note: We use `docker run` to ensure you have the `psql` tool available without installing it on Windows.*

## Troubleshooting

- **Database Errors**: Check the Deploy Logs. If `prisma migrate deploy` fails, ensure your `DATABASE_URL` is correct.
- **Build Errors**: Check the Build Logs. Ensure all dependencies are in `package.json`.
- **Data Restore Issues**: If the restore fails due to "relation already exists" errors, the `--clean` flag in the dump command should handle it, but you might need to drop the public schema on Railway manually if conflicts persist.
