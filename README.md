This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Environment variables

Please create a .env file in the project root directory and add the following content

```
CLIENT_ID=YOUR_CLIENT_ID
REDIRECT_URL=YOUR_REDIRECT_URL_HERE
CLIENT_ID=YOUR_CLIENT_ID
```

## Apply for YouTube Data API access

To use the YouTube Data API, you need to apply for API usage in the Google API Console:

1. Open the [Google API Console](https://console.developers.google.com/).
2. Create a new project or select an existing project.
3. Navigate to the "Credentials" page, click on the "Create Credentials" button, and select "API Key".
4. On the created API Key page, copy your API key and paste it into the `.env` file as `CLIENT_ID`.

## Setting REDIRECT_URL

If you need to use OAuth 2.0 for authorization, please set the `REDIRECT_URL`:
The REDIRECT_URL can be filled with the Vercel deployment address when the project is deployed online. The default path is /oauth2callback.

1. Navigate to the "OAuth consent screen" page in the [Google API Console](https://console.developers.google.com/) and configure the consent screen.
2. Navigate to the "Credentials" page, click on the "Create Credentials" button, and select "OAuth client ID".
3. On the created OAuth client ID page, fill in the redirect URI. Copy this URI and paste it into the `.env` file as `REDIRECT_URL`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
