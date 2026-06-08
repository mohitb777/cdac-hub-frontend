import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
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
export const getApprovedProjects = () => API.get("/api/public/projects");

export const getProjectReviews = (projectId) =>
  API.get(`/api/public/projects/${projectId}/reviews`);

// ─── Student ──────────────────────────────────────────
// formData contains title, description, files etc.
export const submitProject = (formData) =>
  API.post("/api/student/projects", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getMyProjects = () => API.get("/api/student/projects/mine");

// ─── Reviewer ─────────────────────────────────────────
export const getPendingProjects = () =>
  API.get("/api/reviewer/projects/pending");

// data = { feedback: "...", verdict: "APPROVED" or "REJECTED" }
export const submitReview = (projectId, data) => {
  const params = new URLSearchParams();
  params.append("feedback", data.feedback);
  params.append("verdict", data.verdict);
  return API.post(`/api/reviewer/projects/${projectId}/review`, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

export default API;
