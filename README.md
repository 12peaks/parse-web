# Parse Web App

This is the front end for the Parse application. It's built with [Next.js](https://nextjs.org/docs) (App Router) and [Tailwind](https://tailwindcss.com/) with [Mantine](https://mantine.dev) for the UI components. The backend is powered by a Rails application which handles authentication and also the API for the front end. Users are authenticated via the Rails app and then redirected to the Next.js app.

I'm currently in the process of rebuilding it from the old React + Vite version and updating all of the dependencies along the way. The application is currently in a broken state and is not ready for use. An overview of progress is shown below:

- [x] Setup Next.js App
- [x] Wire up basic auth redirect from Rails app
- [x] App skeleton and navigation
- [x] Page scaffolds for each main route
- [x] Home feed page
- [x] Ability to create, edit, delete basic posts
- [x] Ability to create, edit, delete basic comments
- [ ] Ability to create, edit, delete reactions
- [ ] Notifications for new posts, comments, and reactions
- [ ] Notifications page
- [ ] Group specific feeds and pages
- [ ] Team page
- [ ] Invites and team management
- [ ] User settings + preferences
- [ ] Triage page skeleton and basic UI
- [ ] Goals page skeleton and basic UI

## Getting Started

Start by forking or cloning the repo and then `cd` into the project directory. Then, install the dependencies:

```bash
pnpm install
```

Copy the `.env.example` file using `cp .env.example .env` and fill in the environment variables with the appropriate values.

Then start the development server:

```bash
pnpm dev
```
