-- [[ VANDER ELITE AUTOHOP FINDER ]]
-- Combines your BestPet ESP with a Server Hopper & Discord Webhook.
-- No GUI required: ESP is Always On & Server Hoping is Automatic.

local HttpService = game:GetService("HttpService")
local TeleportService = game:GetService("TeleportService")
local CoreGui = game:GetService("CoreGui")
local Workspace = game:GetService("Workspace")
local Players = game:GetService("Players")

-- ==========================================
-- [ ⚙️ CONFIGURATION ]
-- ==========================================
local WEBHOOK_URLS = {
    "https://discord.com/api/webhooks/1479924798804201622/yckJfIK2VkKqgRLRUuhjmz3cRxUzurB7ksnse9V9Ud55FXrym6lnqD9lWWdkxXPJs5Ln",
    "https://discord.com/api/webhooks/1479924810124492842/tCUIi7QLqGsaqYDMjgTlSoEBb08_K8eHd7s64uZP8bcxHdG3tAziBovZeaZjLe-rwC56",
    "https://discord.com/api/webhooks/1479924810422423817/87s4zeH8pWvO68VgHA8JGT1TBNnbE7snZKwfGr3fJ9aN75UDKAeBxvREzkcgNB7KrHML",
    "https://discord.com/api/webhooks/1479924811860938965/gsPAmKHrhs8sXQnktlnExFVYa4qNh4o8keqTwCBZYqvwMXzrc4R1SrZFLyr8eB7Oyk3u",
    "https://discord.com/api/webhooks/1479924812292948151/bjOveBRy8SbTazk0Ob1LUrUJhG9wiQHYb0RlShRw3NJ87cvEw7vSg8CZcz746g3-DKZG",
    "https://discord.com/api/webhooks/1479924813588992223/hKeH9v46HfyMHRvmtEgOHEx-QWh7LeKiPN2CknFJB0c_VhQ-HFzsEaKKn-t9l2xIwjqR",
    "https://discord.com/api/webhooks/1479924814478184628/Jov3ogkXHBmW97bo6-pusrpxI7uOJsHTlPSDtL9DL16tUu1PENQ5Jox_0PuSf9DB9zd8",
    "https://discord.com/api/webhooks/1479924830261215415/cGfUYOoOBgklwmWYi_LLtY6j9Zl8_cM74p4h-L2qNLVELgf8aSzo9A0jkdktd1t8cS42",
    "https://discord.com/api/webhooks/1479924831100342460/RDymkckyPi7_8n4TQ2Nq6SOgT94U4wUf-oOi2u8oAkYxXU7dLA2nea6Au5mLGauH220Z",
    "https://discord.com/api/webhooks/1479924832643842109/DQVelZF0aSED10fSaxpcSJwU4KRKrAX6L1NgzMyghEN7mcnoKPmOMuLmOdRrMaFw1j7d",
    "https://discord.com/api/webhooks/1479924833436438673/xFt7ErhpbzxDgxCM7k7Xa8pe8Rl_GLLi-yulK87vYBnHTNPrZHLJd4DfPV4SeZJZ4-yu",
    "https://discord.com/api/webhooks/1479924834430488719/DToSb0YjtDwyJzmkguadA3mkXw_-J1HvbcLAbI6Kp0-OzpalPYC8iT1rnmIhnmzxwyBt",
    "https://discord.com/api/webhooks/1479924835046916116/JHgw-H-sbtamKD1hCf_gKNeeJYTUT5k2fjpAduXrMtn_EJGygl2d-Pap16kINIy4T7fj",
    "https://discord.com/api/webhooks/1479924835629924394/st0MwNKqaMXhLAiNqyZo_CoDqC8OV2jNEJH1xeCXLDziniL-sFYd_r7ZgMAI5TBqXxZy"
}

local TARGET_LIST = {
    "Ho Ho Ho Sahur", "Cupid Hotspot", "Chicleteira Bicicleteira", "Brunito Marsito", 
    "Quesadillo Vampiro", "Burrito Bandito", "Chill Puppy", "Los Quesadillas", "Arcadopus", 
    "Noo my candy", "La Grande Combinasion", "Los Nooo My Hotspotsitos", "Noo my Present", 
    "Guest 666", "Rang Ring Bus", "Los Mi Gatitos", "Los Chicleteiras", "Steal a Brainrot 6767", 
    "Donkeyturbo Express", "Los Burritos", "Los 25", "Mariachi Corazoni", "Noo My Heart", 
    "Swag Soda", "Chimnino", "Chicleteira Noelteira", "Los Combinasionas", "Fishino Clownino", 
    "Tacorita Bicicleta", "Spinny Hammy", "Nuclearo Dinossauro", "DJ Panda", "Las Sis", 
    "Chicleteira Cupideira", "Chillin Chili", "Money Money Reindeer", "Chipso and Queso", 
    "Los Bros", "Money Money Puggy", "Los Planitos", "Los Mobilis", "Celularcini Viciosini", 
    "Los 67", "Mieteteira Bicicleteira", "Gobblino Uniciclino", "La Spooky Grande", 
    "Los Spooky Combinasionas", "Los Hotspotsitos", "Los Candies", "Tralaledon", "Win Or Lose", 
    "W or L", "La Extinct Grande", "Esok Sekolah", "La Jolly Grande", "Bacuru and Egguru", 
    "Eviledon", "Los Tacoritas", "Lovin Rose", "Tang Tang Keletang", "Ketupat Kepat", 
    "La Taco Combinasion", "Tictac Sahur", "La Romantic Grande", "La Supreme Combinasion", 
    "Orcaledon", "Ketchuru And Musturu", "Jolly Jolly Sahur", "Rossetti Tualetti", 
    "Garama and Madundung", "Spaghetti Tualetti", "Ventoliero Pavonero", "Festive 67", 
    "Sammyni Fattini", "Hokka Horloge", "Ginger Gerat", "La Ginger Sekolah", "Spooky and Pumpky", 
    "Lavadorito Spinito", "La Food Combinasion", "Fragrama and Chocrama", "La Casa Boo", 
    "Los Sekolahs", "La Secret Combinasion", "Los Amigos", "Reinito Sleighito", "Ketupat Bros", 
    "Burguro And Fryuro", "Cooki and Milki", "Capitano Moby", "Rosey and Teddy", 
    "Popcuru and Fizzuru", "Cerberus", "Celestial Pegasus", "Love Love Bear", "Dragon Cannelloni", 
    "Dragon Gingerini", "Hydra Dragon Cannelloni", "Secret Lucky Block", "Skibidi Toilet", 
    "Headless Horseman", "John Pork", "Meowl", "Smurf Cat", "Strawberry Elephant"
}

local CONFIG = {
    TargetFolder = "Debris",
    TemplateName = "FastOverheadTemplate",
    LoadTime = 1, -- Boot scanning almost instantly for hyper-speed
}

-- ==========================================

-- [ 🌐 SERVER HOPPER ]
-- ==========================================
local function ServerHop()
    print("[Vander]: Initiating Server Hop...")
    local PlaceID = game.PlaceId
    local AllIDs = {}
    local actualHour = os.date("!*t").hour
    
    pcall(function()
        local raw = readfile("VanderSavedServers.json")
        AllIDs = HttpService:JSONDecode(raw)
    end)
    if not type(AllIDs) == "table" or AllIDs[1] ~= actualHour then
        AllIDs = {actualHour} 
    end

    -- Pull a huge random list of servers
    local url = "https://games.roblox.com/v1/games/" .. PlaceID .. "/servers/Public?excludeFullGames=true&limit=100"
    local s, req = pcall(function() return game:HttpGet(url) end)
    
    if s and req then
        local data = HttpService:JSONDecode(req)
        if data and data.data then
            local available = {}
            local fallback = {}
            
            for _, server in ipairs(data.data) do
                if type(server) == "table" and tonumber(server.playing) then
                    local p = tonumber(server.playing)
                    if not table.find(AllIDs, server.id) and server.id ~= game.JobId then
                        -- Primary Target: Exactly 5 to 7 players
                        if p >= 5 and p <= 7 then
                            table.insert(available, server)
                        -- Fallback Target: Any usable small server
                        elseif p >= 2 and p <= 9 then
                            table.insert(fallback, server)
                        end
                    end
                end
            end
            
            local targetList = #available > 0 and available or fallback
            
            if #targetList > 0 then
                local srv = targetList[math.random(1, #targetList)]
                table.insert(AllIDs, srv.id)
                pcall(writefile, "VanderSavedServers.json", HttpService:JSONEncode(AllIDs))
                
                print(string.format("[Vander]: Speed Hopping -> Server has %d Players", srv.playing))
                TeleportService:TeleportToPlaceInstance(PlaceID, srv.id, Players.LocalPlayer)
            else
                print("[Vander]: No 5-7 player servers found this cycle, searching again...")
            end
        end
    end
end

-- ==========================================
-- [ 🚀 WEBHOOK SYSTEM ]
-- ==========================================
local function sendDiscordWebhook(itemName, genRateRaw)
    local jobId = game.JobId
    local placeId = 109983668079237 -- Hardcoded to user's specified Game ID
    
    local titlePrefix = string.find(string.lower(itemName), "gold") and "💎 ✨ [Gold] " or "✨ "
    local fullName = titlePrefix .. itemName
    local joinLink = string.format("https://www.roblox.com/games/start?placeId=%d&gameInstanceId=%s", placeId, jobId)
    local consoleScript = string.format('game:GetService("TeleportService"):TeleportToPlaceInstance(%d,"%s",game.Players.LocalPlayer)', placeId, jobId)
    
    -- Clean up the gen rate text (removes 'm', 's', spaces, etc if present, then appends /s)
    -- E.g. "52m 17s" -> "52m 17/s"
    local cleanGenRate = tostring(genRateRaw):gsub("s$", "") .. "/s"
    
    local data = {
        username = "Vander Sniper",
        embeds = {{
            color = 16763904,
            description = string.format("**%s**\n⚡ **Gen:** %s", fullName, cleanGenRate),
            fields = {
                { name = "🌐 DIRECT LINK", value = "[**Join Server**](" .. joinLink .. ")", inline = false },
                { name = "💻 CONSOLE SCRIPT", value = "```lua\n" .. consoleScript .. "\n```", inline = false },
                { name = "🆔 JOB ID", value = "```\n" .. jobId .. "\n```", inline = false }
            }
        }}
    }
    
    local requestFunc = request or http_request or (http and http.request)
    if requestFunc and #WEBHOOK_URLS > 0 then
        -- Pick a random webhook from the list to avoid discord rate limits
        local randomWebhook = WEBHOOK_URLS[math.random(1, #WEBHOOK_URLS)]
        
        requestFunc({
            Url = randomWebhook,
            Method = "POST",
            Headers = {["Content-Type"] = "application/json"},
            Body = HttpService:JSONEncode(data)
        })
        print("[Vander]: Sent Webhook for " .. fullName)
    end
end

-- ==========================================
-- [ 👁️ YOUR ESP SYSTEM (ALWAYS ON) ]
-- ==========================================
getgenv().BestPetESP = getgenv().BestPetESP or { active = true, espInstance = nil }

local function parseValue(text)
    if not text then return 0 end
    text = tostring(text):gsub("%s", ""):gsub("/s", "")
    local numStr, suffix = text:match("([%d%.]+)([KkMmBbTtQq]?)")
    if not numStr then return 0 end
    local num = tonumber(numStr) or 0
    local multipliers = {K = 1e3, M = 1e6, B = 1e9}
    local mult = multipliers[(suffix or ""):upper()] or 1
    return num * mult
end

local function getESPInstance()
    if getgenv().BestPetESP.espInstance and getgenv().BestPetESP.espInstance.Parent then
        return getgenv().BestPetESP.espInstance
    end
    local bb = Instance.new("BillboardGui")
    bb.Name = "OptimizedBestPetESP"
    bb.Size = UDim2.new(0, 200, 0, 60)
    bb.AlwaysOnTop = true
    bb.StudsOffset = Vector3.new(0, -8, 0)
    bb.Parent = CoreGui
    
    local container = Instance.new("Frame", bb)
    container.Size = UDim2.new(1, 0, 1, 0)
    container.BackgroundTransparency = 1
    
    local nameLabel = Instance.new("TextLabel", container)
    nameLabel.Name = "PetName"
    nameLabel.Size = UDim2.new(1, 0, 0.5, 0)
    nameLabel.BackgroundTransparency = 1
    nameLabel.TextScaled = true
    nameLabel.Font = Enum.Font.GothamBold
    nameLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
    nameLabel.TextStrokeTransparency = 0
    
    local valueLabel = Instance.new("TextLabel", container)
    valueLabel.Name = "PetValue"
    valueLabel.Size = UDim2.new(1, 0, 0.5, 0)
    valueLabel.Position = UDim2.new(0, 0, 0.5, 0)
    valueLabel.BackgroundTransparency = 1
    valueLabel.TextScaled = true
    valueLabel.Font = Enum.Font.GothamBold
    valueLabel.TextColor3 = Color3.fromRGB(0, 255, 100)
    valueLabel.TextStrokeTransparency = 0

    getgenv().BestPetESP.espInstance = bb
    return bb
end

local function updateESP(targetPart, displayName, valueText)
    local esp = getESPInstance()
    if targetPart then
        esp.Adornee = targetPart
        esp.Enabled = true
        esp.Frame.PetName.Text = displayName
        esp.Frame.PetValue.Text = valueText
    else
        esp.Enabled = false
        esp.Adornee = nil
    end
end

-- ==========================================
-- [ 🔄 MAIN SCAN & HOP LOOP ]
-- ==========================================
print("[Vander]: Letting map load for " .. CONFIG.LoadTime .. " seconds...")
task.wait(CONFIG.LoadTime)
print("[Vander]: Booting Scanner...")

local debris = Workspace:FindFirstChild(CONFIG.TargetFolder)
local foundAnyTarget = false

if debris then
    local bestPet = { value = -1, part = nil, displayText = "None", rawText = "" }
    
    for _, item in ipairs(debris:GetChildren()) do
        if item.Name == CONFIG.TemplateName then
            local surfaceGui = item:FindFirstChildOfClass("SurfaceGui")
            if surfaceGui and surfaceGui.Adornee then
                local genLabel = surfaceGui:FindFirstChild("Generation", true)
                local nameLabel = surfaceGui:FindFirstChild("DisplayName", true)
                
                if genLabel and nameLabel then
                    local text = genLabel.Text
                    local val = parseValue(text)
                    local displayName = nameLabel.Text
                    
                    -- Record Best Pet for ESP
                    if val > bestPet.value then
                        bestPet.value = val
                        bestPet.part = surfaceGui.Adornee
                        bestPet.displayText = displayName
                        bestPet.rawText = text
                    end
                    
                    -- Check if it matches our Hitlist
                    for _, target in ipairs(TARGET_LIST) do
                        if string.find(string.lower(displayName), string.lower(target)) then
                            print("[Vander]: TARGET ACQUIRED! " .. displayName)
                            
                            -- Save to hidden log for the GUI script to read
                            pcall(function()
                                local logs = {}
                                if readfile then
                                    local s, res = pcall(readfile, "Vander_Sniper_Logs.json")
                                    if s and res then logs = HttpService:JSONDecode(res) or {} end
                                end
                                
                                local isDuplicate = false
                                for _, v in ipairs(logs) do
                                    if v.jobId == game.JobId and v.name == displayName then
                                        isDuplicate = true
                                        break
                                    end
                                end
                                
                                if not isDuplicate then
                                    table.insert(logs, {
                                        name = displayName,
                                        gen = text,
                                        placeId = game.PlaceId,
                                        jobId = game.JobId,
                                        time = os.time()
                                    })
                                    if writefile then
                                        writefile("Vander_Sniper_Logs.json", HttpService:JSONEncode(logs))
                                    end
                                end
                            end)
                            
                            sendDiscordWebhook(displayName, text)
                            foundAnyTarget = true
                            task.wait(0.5) -- Small delay to prevent webhook ratelimits
                        end
                    end
                end
            end
        end
    end

    -- Update ESP visually exactly once with the single best pet
    if bestPet.part then
        updateESP(bestPet.part, bestPet.displayText, bestPet.rawText)
    end
end

-- Logic Engine: Determine next move and SPAM HOP
if foundAnyTarget then
    print("[Vander]: Target Acquired & Sent! Spamming Server Hop...")
else
    print("[Vander]: No targets found. Spamming Server Hop...")
end

-- Force an infinite spam hop loop until teleport secures
while task.wait(0.1) do
    ServerHop()
end
