# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Database Documentation

The E-Hospital app can be extended with a MongoDB backend to store users, doctors, appointments, prescriptions, notifications, and chat records.

See [DATABASE.md](./DATABASE.md) for a complete MongoDB setup guide, schema design, sample Express/Mongoose backend code, and CRUD integration notes.

## Backend Setup

A backend is available in the `backend/` folder.

Steps to run the backend:

```bash
cd backend
npm install
cp .env.example .env
# update MONGODB_URI in .env
npm run dev
```

The backend exposes REST API routes under `http://localhost:4000/api/*`.
"# E-Hospitality" 
