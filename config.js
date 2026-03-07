// VANDER ELITE BACKEND CONFIGURATION
// REAL OAuth 2.0 (Google & Discord) is now ACTIVATED!

const VANDER_CONFIG = {
    SUPABASE_URL: "https://lqlfnoteaiwyptzgksuh.supabase.co",
    SUPABASE_ANON_KEY: "sb_publishable__hKEn9FAiyzek0wIXELQ1Q_zkd_Ry-t",
    REDIRECT_URL: window.location.origin + window.location.pathname.replace("index.html", "dashboard.html")
};

// Auto-Initialize Client
let vander_supabase = null;
if (typeof supabase !== "undefined") {
    vander_supabase = supabase.createClient(VANDER_CONFIG.SUPABASE_URL, VANDER_CONFIG.SUPABASE_ANON_KEY);
    console.log("Vander Elite: Backend Securely Connected. Real Auth Active.");
} else {
    console.error("Vander Elite: Supabase Library failed to load.");
}
