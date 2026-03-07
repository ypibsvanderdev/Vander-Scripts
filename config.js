// VANDER ELITE BACKEND CONFIGURATION
// To make Google & Discord work for REAL (OAuth Popups):
// 1. Create a FREE project at https://supabase.com
// 2. Paste your "Project URL" and "Anon Key" below.
// 3. Enable Google/Discord Auth in the Supabase Dashboard.

const VANDER_CONFIG = {
    SUPABASE_URL: "PASTE_YOUR_SUPABASE_URL_HERE",
    SUPABASE_ANON_KEY: "PASTE_YOUR_SUPABASE_ANON_KEY_HERE",
    REDIRECT_URL: window.location.origin + window.location.pathname.replace("index.html", "dashboard.html")
};

// Auto-Initialize Client
let vander_supabase = null;
if (typeof supabase !== "undefined" && VANDER_CONFIG.SUPABASE_URL !== "PASTE_YOUR_SUPABASE_URL_HERE") {
    vander_supabase = supabase.createClient(VANDER_CONFIG.SUPABASE_URL, VANDER_CONFIG.SUPABASE_ANON_KEY);
} else {
    console.warn("Vander Elite: Supabase Keys are missing. Running in Simulation Mode.");
}
