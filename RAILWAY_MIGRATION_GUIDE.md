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

You likely have other environment variables in your `.env` file. Add them to the **Variables** tab in your Application service:

- `NEXT_PUBLIC_...` (Any public variables used in your frontend)
- Any other API keys or secrets.

## Step 5: Verify Deployment

1.  Once variables are saved, Railway usually triggers a redeploy automatically. If not, go to the **"Deployments"** tab and click **"Redeploy"**.
2.  Watch the build logs. You should see `prisma generate` and `next build` running.
3.  Watch the deploy logs. You should see `prisma migrate deploy` running.
4.  Once "Active", click the generated URL to open your app.

## Troubleshooting

- **Database Errors**: Check the Deploy Logs. If `prisma migrate deploy` fails, ensure your `DATABASE_URL` is correct.
- **Build Errors**: Check the Build Logs. Ensure all dependencies are in `package.json`.
