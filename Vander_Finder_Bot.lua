-- [[ VANDER ELITE FINDER BOT ]]
-- A 100% Local Scanner (No VPS Required)
-- Scans the game for specific targets and sends a perfect Discord Embed.

local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")

-- ==========================================
-- [ ⚙️ CONFIGURATION ]
-- ==========================================
local WEBHOOK_URL = "YOUR_DISCORD_WEBHOOK_URL_HERE"
local SCAN_INTERVAL = 5 -- How often to check for new pets (in seconds)

-- Put the names of the Pets/Units/Items you want to snipe here
local TargetList = {
    "Love Love Love Sahur",
    "Huge Cat",
    "Some Secret Unit"
}

-- ==========================================
-- [ 🚀 WEBHOOK SYSTEM ]
-- ==========================================
-- Cache to remember what we already sent to Discord so we don't spam
local FoundCache = {}

local function sendDiscordWebhook(foundObj, targetName)
    local jobId = game.JobId
    local placeId = game.PlaceId
    
    -- Dynamically get the REAL name of what was actually found in the game
    local fullName = foundObj.Name
    
    -- Default stats (If you know where the game stores real stats, you can edit this)
    local genRate = "N/A"
    local ownerName = "Unknown"
    
    -- Example of pulling dynamic stats if the game stores them inside the pet model:
    -- if foundObj:FindFirstChild("GenRate") then genRate = foundObj.GenRate.Value end
    -- if foundObj:FindFirstChild("Owner") and foundObj.Owner:IsA("StringValue") then 
    --     ownerName = "Plot: " .. foundObj.Owner.Value 
    -- end
    
    -- The Magic Links
    local joinLink = string.format("roblox://experiences/start?placeId=%d&gameInstanceId=%s", placeId, jobId)
    local consoleScript = string.format('game:GetService("TeleportService"):TeleportToPlaceInstance(%d,"%s",game.Players.LocalPlayer)', placeId, jobId)
    
    -- Build the Embed exactly like your Screenshot
    local data = {
        username = "Vander Sniper",
        embeds = {{
            color = 16763904, -- Elite Gold Color
            description = string.format("**%s**\n⚡ **Gen:** %s\n🏡 **Owner:** %s", fullName, genRate, ownerName),
            fields = {
                {
                    name = "🌐 DIRECT LINK",
                    value = "[**Join Server**](" .. joinLink .. ")",
                    inline = false
                },
                {
                    name = "💻 CONSOLE SCRIPT",
                    value = "```lua\n" .. consoleScript .. "\n```",
                    inline = false
                },
                {
                    name = "🆔 JOB ID",
                    value = "```\n" .. jobId .. "\n```",
                    inline = false
                }
            }
        }}
    }
    
    -- Send the request using the Executor's API
    local requestFunc = request or http_request or (http and http.request)
    if requestFunc then
        requestFunc({
            Url = WEBHOOK_URL,
            Method = "POST",
            Headers = {["Content-Type"] = "application/json"},
            Body = HttpService:JSONEncode(data)
        })
        print("[Vander]: Sent Snipe Webhook for " .. fullName)
    else
        warn("[Vander]: Your executor does not support sending webhooks.")
    end
end

-- ==========================================
-- [ 👁️ SCANNER ENGINE ]
-- ==========================================
local function scanGame()
    -- This scans the entire workspace for models matching your targets
    for _, obj in ipairs(workspace:GetDescendants()) do
        if obj:IsA("Model") or obj:IsA("Part") then
            for _, target in ipairs(TargetList) do
                
                -- Check if the object's name contains the target word/phrase from our list
                if string.find(string.lower(obj.Name), string.lower(target)) then
                    
                    -- Use the exact object instance to ensure we only ping ONCE per pet
                    if not FoundCache[obj] then
                        FoundCache[obj] = true 
                        
                        -- Send the Webhook with the EXACT name of what it found
                        sendDiscordWebhook(obj, target)
                    end
                end
                
            end
        end
    end
end

-- ==========================================
-- [ 🔄 MAIN LOOP ]
-- ==========================================
print("[Vander Sniper]: System Activated.")
task.spawn(function()
    while task.wait(SCAN_INTERVAL) do
        if WEBHOOK_URL ~= "YOUR_DISCORD_WEBHOOK_URL_HERE" then
            pcall(scanGame)
        else
            warn("[Vander Sniper]: PLEASE PUT YOUR WEBHOOK URL IN THE SCRIPT!")
            break
        end
    end
end)
