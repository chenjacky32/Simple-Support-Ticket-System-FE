<h1 align="left">Simple Support Ticket System</h1>

<div align="left">

  [![Status](https://img.shields.io/badge/status-active-success.svg)]() 
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

<p align="left"> A robust, scalable ticket management system featuring a Next.js 16 frontend and a Laravel 13 backend.
    <br> 
</p>

## 📝 Table of Contents
- [About](#about)
- [Features](#features)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>
The **Simple Support Ticket System** is a full-stack application designed to streamline customer support operations. It allows users to create complaint tickets and enables administrators to efficiently manage, track, and respond to those tickets.

The system is split into two main parts:
- **Backend API**: A RESTful API built with **Laravel 13** and **MySQL**. It uses a Stateless API architecture with JWT authentication and adopts an enterprise-scale folder structure (Actions, Payloads, and Invokable Controllers).
- **Frontend App**: A modern web interface built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**. It leverages `shadcn/ui` for accessible components and `TanStack Query/Table` for robust data fetching and grid management.

## ✨ Features <a name = "features"></a>
- **Role-Based Access Control (RBAC)**: Supports three roles: `USERS`, `ADMIN`, and `SUPERADMIN`.
- **Ticket Management**: Users can create tickets with attachments, while Admins can update statuses (Opened -> In Progress -> Resolved) and reply.
- **Dashboard & Analytics**: Real-time statistics displaying aggregated ticket counts per status.
- **Webhook Integration**: External systems can programmatically update ticket statuses.
- **Modern UI/UX**: Semantic styling, strict typography (Inter font), and headless tables using TanStack Table.

## 🏁 Getting Started <a name = "getting_started"></a>
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
Make sure you have the following installed on your local machine:
- Node.js (v18 or higher)
- npm or yarn
- PHP (v8.2 or higher)
- Composer
- MySQL (v8.x)

### Installing

**1. Backend Setup (Laravel)**
```bash
cd 'Simple Support Ticket System - BE'
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```
Configure your MySQL database credentials in the `.env` file, then run:
```bash
php artisan migrate --seed
php artisan serve
```

**2. Frontend Setup (Next.js)**
```bash
cd 'Simple Support Ticket System - FE'
npm install
```
Configure your environment variables in `.env.local`:
```env
API_BASE_URL=http://localhost:8000/api/v1/
```
Run the development server:
```bash
npm run dev
```

## 🎈 Usage <a name="usage"></a>
Once both servers are running:
1. Open `http://localhost:3000` in your browser.
2. Register a new user account (Note: Accounts are inactive by default and must be activated by a Superadmin in the database).
3. Log in to access the Dashboard.
4. **Users** can navigate to `/tickets/create` to submit a new support ticket.
5. **Admins** can navigate to `/users` or `/tickets` to manage users, update ticket statuses, and respond to queries.

## 🚀 Deployment <a name = "deployment"></a>
- **Frontend**: Can be easily deployed to [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/) by connecting the repository and setting the build command to `npm run build`.
- **Backend**: Can be deployed to any VPS or managed hosting (e.g., Laravel Forge) that supports PHP 8.2 and MySQL. Ensure you configure web server routing (Nginx/Apache) to point to the `public` directory.

## ⛏️ Built Using <a name = "built_using"></a>
**Frontend**
- [Next.js v16](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Language
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [TanStack Query & Table](https://tanstack.com/) - State & Data Grid
- [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) - Form Validation

**Backend**
- [Laravel 13](https://laravel.com/) - PHP Framework
- [MySQL 8.x](https://www.mysql.com/) - Database
- [JWT Auth](https://github.com/php-open-source-saver/jwt-auth) - Stateless Authentication

## ✍️ Authors <a name = "authors"></a>
- [@chenjacky32](https://github.com/chenjacky32) - Idea, Frontend & Backend Implementation

## 🎉 Acknowledgements <a name = "acknowledgement"></a>
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful accessible components.
- Laravel community for the robust backend ecosystem.