

### 1. Frontend README (`README.md` for the React Repo)

```markdown
# CDAC Hub - Frontend 

The user interface for the CDAC Student Project Repository. This is where students submit their hard work, reviewers evaluate it, and the public can browse the approved projects. 

### Tech Stack
* **React** (scaffolded with Vite for speed)
* **Tailwind CSS** (for styling)
* **React Router v6** (for navigation)
* **Axios** (for API calls)
* **Context API** (for global user/auth state)

### Core Features
* **Public Feed:** Searchable grid of all approved CDAC projects.
* **Student Dashboard:** Track personal project submissions and statuses.
* **Reviewer Panel:** Dedicated interface for reviewers to evaluate pending projects and leave feedback.
* **Admin Panel:** Table view to manage user roles directly from the UI.
* **JWT Interceptor:** Axios automatically attaches the user's JWT token to protected API requests.

### Local Setup Instructions

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd cdachub-frontend

```

2. **Install Dependencies:**
```bash
npm install

```


3. **Connect to Backend:**
By default, the Axios configuration in `src/services/api.js` points to `http://localhost:8080`. Make sure your Spring Boot backend is running on that port before you try to log in or fetch data.
4. **Run the App:**
```bash
npm run dev

```


Open `http://localhost:5173` in your browser.

Contributor: Aditya Barakoti

### A Note on Logging In Locally

Authentication is handled via Google OAuth2 on the backend. When you click "Login with Google", it briefly redirects to `localhost:8080` to authenticate with Google, grabs the JWT token, and bounces you back to the frontend `/auth/callback` route.

```
