
// Set to localhost in development, and to production URL in production
const API_BASE = import.meta.env.PROD 
  ? "/api" // Production API path (relative to deployment)
  : "https://jsonplaceholder.typicode.com"; // Temporary mock API for testing

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // For testing purposes - allow login to work without a real backend
  if (path === "/users/login") {
    console.log("Mock login successful");
    // Return mock user data
    return {
      token: "mock-token-123",
      email: "user@example.com",
      name: "Test User",
      role: "patient",
    };
  }
  
  try {
    const resp = await fetch(API_BASE + path, {
      ...options,
      headers,
    });

    if (resp.status === 401) {
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }
    if (!resp.ok) throw new Error(await resp.text());
    return resp.json();
  } catch (error) {
    console.error("API fetch error:", error);
    if (path.includes("/login")) {
      // For testing - if login API fails, use mock data
      localStorage.setItem("authToken", "mock-token-123");
      localStorage.setItem("email", "user@example.com");
      localStorage.setItem("name", "Test User");
      localStorage.setItem("role", "patient");
      return {
        token: "mock-token-123",
        email: "user@example.com",
        name: "Test User",
        role: "patient",
      };
    }
    throw error;
  }
}
