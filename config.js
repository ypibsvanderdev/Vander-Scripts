// VANDER ELITE BACKEND CONFIGURATION
// Create a free project at https://supabase.com to get your keys!
// Once you add these, Google & Discord logins will open REAL popups.

const VANDER_CONFIG = {
    SUPABASE_URL: "https://your-project-id.supabase.co", // Replace with your Supabase Page URL
    SUPABASE_ANON_KEY: "your-anon-key-here", // Replace with your Supabase Anon Key
    REDIRECT_URL: window.location.origin + window.location.pathname.replace("index.html", "dashboard.html")
};

// Initialize Supabase Client if possible
let supabase = null;
if (typeof supabaseJS !== "undefined") {
    supabase = supabaseJS.createClient(VANDER_CONFIG.SUPABASE_URL, VANDER_CONFIG.SUPABASE_ANON_KEY);
} else if (typeof window.supabase !== "undefined") {
    supabase = window.supabase.createClient(VANDER_CONFIG.SUPABASE_URL, VANDER_CONFIG.SUPABASE_ANON_KEY);
}
