# API Markdown Manager

## Spec
- NodeJS: 18.0.0
- MongoDB: 5.0.7
- Redis: 6.2.6

## Setup
1. Clone this repository with
```
git clone https://github.com/johanromero5879/api-markdown-manager.git
```
2. Locate directory with `cd api-markdown-manager`.
3. Create a folder `security` and put in `cert.pem` and `key.pem` HTTPS certificates files.
4. Remove suffix `.sample` of `.env.sample` and set variables.
6. Install dependencies with `npm install` command.
7. Execute in:
    - Development: `npm run dev`.
    - Production: `npm run build` and `npm start`.
