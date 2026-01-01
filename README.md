<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://neon.com/brand/neon-logo-dark-color.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://neon.com/brand/neon-logo-light-color.svg">
  <img width="250px" alt="Neon Logo fallback" src="https://neon.com/brand/neon-logo-dark-color.svg">
</picture>

### User Management Dashboard with Neon Auth

A React-based internal tool to manage users, ban abusive accounts, and securely impersonate customers using the [Neon Auth Admin API](https://neon.com/docs/auth/guides/plugins/admin).

---

Internal tools are essential for support and operations teams, but building them often requires writing complex backend logic to handle permissions and session management.

This repository demonstrates how to use the Neon Auth Admin Plugin to build a secure dashboard directly from the frontend. It covers real-world scenarios like moderation and debugging user issues via impersonation.

Follow the full guide on [Neon: Building a User Management Dashboard](https://neon.com/guides/user-management-dashboard-with-neon-auth) for a step-by-step walkthrough.

## ✨ Key features

-   **User management**: List all registered users within your application.
-   **Moderation**: Ban and unban users instantly to revoke access.
-   **Impersonation**: Log in as any user to reproduce bugs, with a secure "Exit Impersonation" mechanism.
-   **Role-Based Access**: The dashboard is restricted to users with the `admin` role.
-   **No Backend Required**: Uses the Neon SDK to interact with the managed Admin API.

## 🚀 Get started

### Prerequisites

Before you start, you'll need:

1.  A **[Neon account](https://console.neon.tech)**.
2.  **[Node.js](https://nodejs.org/)** (v18+) installed locally.

### Initial setup

Clone this repository and install the dependencies.

```bash
# Clone the repository
git clone https://github.com/dhanushreddy291/neon-auth-admin-dashboard.git
cd neon-auth-admin-dashboard

# Install dependencies
npm install
```

### Configure Neon

1.  Create a new project in the [Neon Console](https://console.neon.tech).
2.  Navigate to the **Auth** tab and click **Enable**.
3.  Copy your **Auth Base URL**.

<p align="left">
  <img src="./images/neon-auth-base-url.png" alt="Neon Auth URL" width="500"/> 
</p>

### Environment variables

Create a `.env` file in the root directory.

```bash
cp .env.example .env
```

Update the `.env` file with your Neon Auth URL:

```env
VITE_NEON_AUTH_URL="https://ep-xxx.neon.tech/neondb/auth"
```

### Create an Admin User

The Admin API is protected. You cannot call it without being logged in as an admin.

1.  Run the app (`npm run dev`) and sign up a new user (e.g., `admin@example.com`).
2.  Go to the **Neon Console** -> **Auth** -> **Users**.
3.  Find your user, click the (**...**) menu, and select **Make admin**.

<p align="left">
    <img src="./images/make-admin.png" alt="Assign Admin Role" width="500"/>
</p>

### Run the app

Start the development server.

```bash
npm run dev
```

Open `http://localhost:5173`. Log in with your admin account to access the dashboard.

## Demo

### User management dashboard
A centralized view to search users, check their status, and perform administrative actions like **Ban** or **Impersonate**.

<p align="left">
    <img src="./images/admin-dashboard-demo.png" alt="Admin Dashboard Demo" width="700"/>
</p>

### Impersonation mode
Safely log in as any user to reproduce bugs. The persistent top banner ensures you never lose track of your session state and allows you to return to your admin account instantly.

<p align="left">
    <img src="./images/admin-dashboard-impersonation.png" alt="Impersonation Banner" width="700"/>
</p>

### Role-Based Access Control
The UI adapts based on the logged-in user's role. Admins gain access to special navigation items and controls that are hidden from standard users.

<p align="left">
    <img src="./images/admin-dashboard-admin-access.png" alt="Role Based Access" width="700"/>
</p>

## ⚙️ How it works

This application uses the Admin methods exposed by `@neondatabase/neon-js`.

1.  **Listing Users**:
    The dashboard fetches a paginated list of users. This API call automatically fails if the requester does not have the `admin` role.

    ```typescript
    const { data } = await authClient.admin.listUsers({
      query: { limit: 100, sortBy: 'createdAt', sortDirection: 'desc' }
    });
    ```

2.  **Banning users**:
    Banning a user immediately invalidates their sessions and prevents new logins.

    ```typescript
    await authClient.admin.banUser({
      userId: user.id,
      banReason: 'Terms of Service violation'
    });
    ```

3.  **Impersonation**:
    This creates a short-lived session for the target user. The SDK handles swapping the session cookies. We check `session.impersonatedBy` to show the "Exit" banner.

    ```typescript
    // Start impersonating
    await authClient.admin.impersonateUser({ userId: targetUserId });

    // Stop impersonating (reverts to admin session)
    await authClient.admin.stopImpersonating();
    ```

## 📚 Learn more

-   [Neon Guide: Building an Admin dashboard with Neon Auth](https://neon.com/guides/admin-dashboard-neon-auth)
-   [Neon Auth Admin API Reference](https://neon.com/docs/auth/guides/plugins/admin)
-   [Neon Auth Overview](https://neon.com/docs/auth/overview)
-   [How Neon Auth works](https://neon.com/docs/neon-auth/how-it-works)
-   [React with Neon Auth UI (UI Components)](https://neon.com/docs/auth/quick-start/react-router-components)
-   [Neon JavaScript SDK (Auth & Data API)](https://neon.com/docs/reference/javascript-sdk)
