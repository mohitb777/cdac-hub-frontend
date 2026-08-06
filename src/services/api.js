import axios from "axios";

const API = axios.create({
  baseURL: "",
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ─────────────────────────────────────────────
// Get the currently logged in user's info

export const getCurrentUser = () => API.get("/api/user/me");

// ─── Public ───────────────────────────────────────────
export const getApprovedProjects = (page = 0) =>
  API.get(`/api/public/projects?page=${page}&size=12`);

export const getProjectReviews = (projectId) =>
  API.get(`/api/public/projects/${projectId}/reviews`);

// ─── Student ──────────────────────────────────────────
// formData contains title, description, files etc.
export const submitProject = (formData) =>
  API.post("/api/student/projects", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getMyProjects = () => API.get("/api/student/projects/mine");

// ─── Admin ───────────────────────────────────────────
export const getAllUsers    = ()                   => API.get('/api/user/admin/users')
export const updateUserRole = (userId, role)       => API.put(`/api/user/admin/users/${userId}/role`, { role })

//This is the new function to update specializations for a user by admin  
export const updateSpecializations = (userId, specializations) =>
  API.put(`/api/user/admin/users/${userId}/specializations`, {
    specializations,
  });


export const resubmitProject = (projectId, formData) =>
  API.put(`/api/student/projects/${projectId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });


// ─── Admin — Projects ─────────────────────────────────
export const getAllProjectsAdmin = () => API.get('/api/admin/projects')
export const deleteProject       = (projectId) => API.delete(`/api/admin/projects/${projectId}`)

// // If any request comes back 401 (expired/invalid token), auto-logout
// API.interceptors.response.use(
//   (response) => response,   // pass through successful responses
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token')
//       window.location.href = '/login'
//     }
//     return Promise.reject(error)
//   }
// )

// ─── Reviewer ─────────────────────────────────────────
export const getPendingProjects = () =>
  API.get("/api/reviewer/projects/pending");

// Get a specific project for review
export const getProjectForReview = (projectId) =>
  API.get(`/api/reviewer/projects/${projectId}`);

// data = { feedback: "...", verdict: "APPROVED" or "REJECTED" }
export const submitReview = (projectId, data) => {
  const params = new URLSearchParams();
  params.append("feedback", data.feedback);
  params.append("verdict", data.verdict);
  return API.post(`/api/reviewer/projects/${projectId}/review`, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};


//[ADDED / REPLACED HERE]: Active Refresh Token Response Interceptor
// This replaces your old commented-out 401 block with the live logic
// that silently refreshes expired tokens using the stored refreshToken.
//


let refreshPromise = null; // shared across all concurrent failed requests

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      //  If a refresh is already in flight, every concurrent 401
      // awaits that SAME promise instead of racing to start its own —
      // this is what fixes the "second request just fails" bug.
     if (!refreshPromise) {
       refreshPromise = axios
         // REMOVED http://localhost:8080 — Nginx handles it now!
         .post("/api/auth/refresh", { refreshToken })
         .then((res) => {
           localStorage.setItem("token", res.data.token);
           return res.data.token;
         })
         .catch((err) => {
           localStorage.removeItem("token");
           localStorage.removeItem("refreshToken");
           window.location.href = "/login";
           throw err;
         })
         .finally(() => {
           refreshPromise = null;
         });
     }

      try {
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default API;
