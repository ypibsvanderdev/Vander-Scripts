-- [[ VANDER ELITE SNIPER GUI ]]
-- Premium Animated Dashboard for Logging and Auto-Joining target items.

local CoreGui = game:GetService("CoreGui")
local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local HttpService = game:GetService("HttpService")
local TeleportService = game:GetService("TeleportService")
local RunService = game:GetService("RunService")

local LOG_FILE = "Vander_Sniper_Logs.json"

-- ==========================================
-- [ ⚙️ SYSTEM SETTINGS / UTILS ]
-- ==========================================
local Config = {
    AutoJoin = false,
    NotifyTarget = true,
    MinGenRequirements = 1000000, -- Default 1M
    MaxLogAge = 1800, -- Hide logs older than 30 minutes (1800 seconds)
}

local LatestProcessedTime = os.time() - 5 -- Base time for fresh auto-join checks

local function tween(obj, time, properties)
    TweenService:Create(obj, TweenInfo.new(time, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), properties):Play()
end

local function parseValue(text)
    if not text then return 0 end
    text = tostring(text):gsub("%s", ""):gsub("/s", "")
    local numStr, suffix = text:match("([%d%.]+)([KkMmBbTtQq]?)")
    if not numStr then return 0 end
    local num = tonumber(numStr) or 0
    local multipliers = {K = 1e3, M = 1e6, B = 1e9, T = 1e12, Q = 1e15}
    local mult = multipliers[(suffix or ""):upper()] or 1
    return num * mult
end

-- ==========================================
-- [ 🎨 GUI FRAMEWORK ]
-- ==========================================
local oldGui = CoreGui:FindFirstChild("VanderSniperElite")
if oldGui then oldGui:Destroy() end

local SG = Instance.new("ScreenGui")
SG.Name = "VanderSniperElite"
SG.ResetOnSpawn = false
local success = pcall(function() SG.Parent = CoreGui end)
if not success then SG.Parent = Players.LocalPlayer:WaitForChild("PlayerGui") end

local Main = Instance.new("Frame")
Main.Size = UDim2.new(0, 400, 0, 450)
Main.Position = UDim2.new(0.5, -200, 0.5, -225)
Main.BackgroundColor3 = Color3.fromRGB(15, 15, 20)
Main.BorderSizePixel = 0
Main.ClipsDescendants = true
Main.Parent = SG

local UICorner = Instance.new("UICorner", Main)
UICorner.CornerRadius = UDim.new(0, 10)
local UIStroke = Instance.new("UIStroke", Main)
UIStroke.Color = Color3.fromRGB(0, 255, 136)
UIStroke.Thickness = 1.5

-- Dragging
local dragging, dragInput, dragStart, startPos
Main.InputBegan:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1 then
        dragging = true
        dragStart = input.Position
        startPos = Main.Position
        input.Changed:Connect(function()
            if input.UserInputState == Enum.UserInputState.End then dragging = false end
        end)
    end
end)
Main.InputChanged:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseMovement then dragInput = input end
end)
RunService.RenderStepped:Connect(function()
    if dragging and dragInput then
        local delta = dragInput.Position - dragStart
        Main.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + delta.X, startPos.Y.Scale, startPos.Y.Offset + delta.Y)
    end
end)

-- Topbar
local TopBar = Instance.new("Frame", Main)
TopBar.Size = UDim2.new(1, 0, 0, 40)
TopBar.BackgroundTransparency = 1

local Title = Instance.new("TextLabel", TopBar)
Title.Size = UDim2.new(0.6, 0, 1, 0)
Title.Position = UDim2.new(0, 15, 0, 0)
Title.BackgroundTransparency = 1
Title.Text = "VANDER ELITE SNIPER"
Title.TextColor3 = Color3.fromRGB(0, 255, 136)
Title.Font = Enum.Font.GothamBold
Title.TextSize = 16
Title.TextXAlignment = Enum.TextXAlignment.Left

-- Minimize Button
local MinBtn = Instance.new("TextButton", TopBar)
MinBtn.Size = UDim2.new(0, 30, 0, 30)
MinBtn.Position = UDim2.new(1, -40, 0, 5)
MinBtn.BackgroundColor3 = Color3.fromRGB(30, 30, 35)
MinBtn.Text = "-"
MinBtn.TextColor3 = Color3.fromRGB(200, 200, 200)
MinBtn.Font = Enum.Font.GothamBold
MinBtn.TextSize = 18
Instance.new("UICorner", MinBtn).CornerRadius = UDim.new(0, 6)

local minimized = false
MinBtn.MouseButton1Click:Connect(function()
    minimized = not minimized
    tween(Main, 0.5, {Size = minimized and UDim2.new(0, 400, 0, 40) or UDim2.new(0, 400, 0, 450)})
end)

-- Tab Selector
local TabFrame = Instance.new("Frame", Main)
TabFrame.Size = UDim2.new(1, 0, 0, 35)
TabFrame.Position = UDim2.new(0, 0, 0, 40)
TabFrame.BackgroundColor3 = Color3.fromRGB(20, 20, 25)

local LogsTabBtn = Instance.new("TextButton", TabFrame)
LogsTabBtn.Size = UDim2.new(0.5, 0, 1, 0)
LogsTabBtn.BackgroundTransparency = 1
LogsTabBtn.Text = "SNIPE LOGS"
LogsTabBtn.TextColor3 = Color3.fromRGB(0, 255, 136)
LogsTabBtn.Font = Enum.Font.GothamBold
LogsTabBtn.TextSize = 12

local SetTabBtn = Instance.new("TextButton", TabFrame)
SetTabBtn.Size = UDim2.new(0.5, 0, 1, 0)
SetTabBtn.Position = UDim2.new(0.5, 0, 0, 0)
SetTabBtn.BackgroundTransparency = 1
SetTabBtn.Text = "SETTINGS"
SetTabBtn.TextColor3 = Color3.fromRGB(150, 150, 150)
SetTabBtn.Font = Enum.Font.GothamBold
SetTabBtn.TextSize = 12

local Highlight = Instance.new("Frame", TabFrame)
Highlight.Size = UDim2.new(0.5, 0, 0, 2)
Highlight.Position = UDim2.new(0, 0, 1, -2)
Highlight.BackgroundColor3 = Color3.fromRGB(0, 255, 136)
Highlight.BorderSizePixel = 0

-- Pages
local ContentContainer = Instance.new("Frame", Main)
ContentContainer.Size = UDim2.new(1, 0, 1, -75)
ContentContainer.Position = UDim2.new(0, 0, 0, 75)
ContentContainer.BackgroundTransparency = 1

local LogsPage = Instance.new("Frame", ContentContainer)
LogsPage.Size = UDim2.new(1, 0, 1, 0)
LogsPage.BackgroundTransparency = 1

local SettingsPage = Instance.new("Frame", ContentContainer)
SettingsPage.Size = UDim2.new(1, 0, 1, 0)
SettingsPage.Position = UDim2.new(1, 0, 0, 0) -- Hidden to the right
SettingsPage.BackgroundTransparency = 1

-- Tab Logic
LogsTabBtn.MouseButton1Click:Connect(function()
    tween(LogsPage, 0.4, {Position = UDim2.new(0, 0, 0, 0)})
    tween(SettingsPage, 0.4, {Position = UDim2.new(1, 0, 0, 0)})
    tween(Highlight, 0.3, {Position = UDim2.new(0, 0, 1, -2)})
    tween(LogsTabBtn, 0.2, {TextColor3 = Color3.fromRGB(0, 255, 136)})
    tween(SetTabBtn, 0.2, {TextColor3 = Color3.fromRGB(150, 150, 150)})
end)

SetTabBtn.MouseButton1Click:Connect(function()
    tween(LogsPage, 0.4, {Position = UDim2.new(-1, 0, 0, 0)})
    tween(SettingsPage, 0.4, {Position = UDim2.new(0, 0, 0, 0)})
    tween(Highlight, 0.3, {Position = UDim2.new(0.5, 0, 1, -2)})
    tween(SetTabBtn, 0.2, {TextColor3 = Color3.fromRGB(0, 255, 136)})
    tween(LogsTabBtn, 0.2, {TextColor3 = Color3.fromRGB(150, 150, 150)})
end)

-- ==========================================
-- [ 📄 LOGS PAGE ]
-- ==========================================
local Scroll = Instance.new("ScrollingFrame", LogsPage)
Scroll.Size = UDim2.new(1, -20, 1, -45)
Scroll.Position = UDim2.new(0, 10, 0, 5)
Scroll.BackgroundTransparency = 1
Scroll.ScrollBarThickness = 2
Scroll.AutomaticCanvasSize = Enum.AutomaticSize.Y
Instance.new("UIListLayout", Scroll).Padding = UDim.new(0, 8)

local ActionSubBar = Instance.new("Frame", LogsPage)
ActionSubBar.Size = UDim2.new(1, -20, 0, 30)
ActionSubBar.Position = UDim2.new(0, 10, 1, -35)
ActionSubBar.BackgroundTransparency = 1

local ClearBtn = Instance.new("TextButton", ActionSubBar)
ClearBtn.Size = UDim2.new(0.48, 0, 1, 0)
ClearBtn.BackgroundColor3 = Color3.fromRGB(200, 50, 50)
ClearBtn.Text = "WIPE OLD LOGS"
ClearBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
ClearBtn.Font = Enum.Font.GothamBold
ClearBtn.TextSize = 11
Instance.new("UICorner", ClearBtn).CornerRadius = UDim.new(0, 6)

local RefreshBtn = Instance.new("TextButton", ActionSubBar)
RefreshBtn.Size = UDim2.new(0.48, 0, 1, 0)
RefreshBtn.Position = UDim2.new(0.52, 0, 0, 0)
RefreshBtn.BackgroundColor3 = Color3.fromRGB(40, 45, 50)
RefreshBtn.Text = "MANUAL REFRESH"
RefreshBtn.TextColor3 = Color3.fromRGB(220, 220, 220)
RefreshBtn.Font = Enum.Font.GothamBold
RefreshBtn.TextSize = 11
Instance.new("UICorner", RefreshBtn).CornerRadius = UDim.new(0, 6)

-- Hover Anims
local function setupHover(btn, originalColor, hoverColor)
    btn.MouseEnter:Connect(function() tween(btn, 0.2, {BackgroundColor3 = hoverColor}) end)
    btn.MouseLeave:Connect(function() tween(btn, 0.2, {BackgroundColor3 = originalColor}) end)
end
setupHover(ClearBtn, Color3.fromRGB(200, 50, 50), Color3.fromRGB(255, 70, 70))
setupHover(RefreshBtn, Color3.fromRGB(40, 45, 50), Color3.fromRGB(60, 65, 70))

-- Safe Server Join logic
local joining = false
local function secureJoin(placeId, jobId, btnInstance)
    if joining then return end
    joining = true
    if btnInstance then 
        btnInstance.Text = "TELEPORTING..." 
        tween(btnInstance, 0.2, {BackgroundColor3 = Color3.fromRGB(200, 150, 0)})
    end
    
    local s = pcall(function()
        TeleportService:TeleportToPlaceInstance(tonumber(placeId), jobId, Players.LocalPlayer)
    end)
    
    task.delay(4, function() -- If it didn't teleport after 4 seconds, mark failed safely
        if btnInstance then
            btnInstance.Text = "FAIL / FULL"
            tween(btnInstance, 0.2, {BackgroundColor3 = Color3.fromRGB(200, 50, 50)})
            task.wait(2)
            btnInstance.Text = "JOIN"
            tween(btnInstance, 0.2, {BackgroundColor3 = Color3.fromRGB(0, 200, 100)})
        end
        joining = false
    end)
end

-- ==========================================
-- [ ⚙️ SETTINGS PAGE ]
-- ==========================================
local function createToggle(name, yPos, default, callback)
    local f = Instance.new("Frame", SettingsPage)
    f.Size = UDim2.new(1, -30, 0, 40)
    f.Position = UDim2.new(0, 15, 0, yPos)
    f.BackgroundColor3 = Color3.fromRGB(25, 25, 30)
    Instance.new("UICorner", f).CornerRadius = UDim.new(0, 8)
    
    local label = Instance.new("TextLabel", f)
    label.Size = UDim2.new(0.7, 0, 1, 0)
    label.Position = UDim2.new(0, 15, 0, 0)
    label.BackgroundTransparency = 1
    label.Text = name
    label.TextColor3 = Color3.fromRGB(220, 220, 220)
    label.Font = Enum.Font.GothamMedium
    label.TextSize = 13
    label.TextXAlignment = Enum.TextXAlignment.Left

    local toggle = Instance.new("TextButton", f)
    toggle.Size = UDim2.new(0, 50, 0, 24)
    toggle.Position = UDim2.new(1, -65, 0.5, -12)
    toggle.BackgroundColor3 = default and Color3.fromRGB(0, 255, 136) or Color3.fromRGB(50, 50, 55)
    toggle.Text = ""
    Instance.new("UICorner", toggle).CornerRadius = UDim.new(1, 0)

    local circle = Instance.new("Frame", toggle)
    circle.Size = UDim2.new(0, 20, 0, 20)
    circle.Position = default and UDim2.new(1, -22, 0.5, -10) or UDim2.new(0, 2, 0.5, -10)
    circle.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
    Instance.new("UICorner", circle).CornerRadius = UDim.new(1, 0)

    local state = default
    toggle.MouseButton1Click:Connect(function()
        state = not state
        callback(state)
        tween(toggle, 0.3, {BackgroundColor3 = state and Color3.fromRGB(0, 255, 136) or Color3.fromRGB(50, 50, 55)})
        tween(circle, 0.3, {Position = state and UDim2.new(1, -22, 0.5, -10) or UDim2.new(0, 2, 0.5, -10)})
    end)
end

local function createInputOption(name, yPos, defaultTxt, callback)
    local f = Instance.new("Frame", SettingsPage)
    f.Size = UDim2.new(1, -30, 0, 40)
    f.Position = UDim2.new(0, 15, 0, yPos)
    f.BackgroundColor3 = Color3.fromRGB(25, 25, 30)
    Instance.new("UICorner", f).CornerRadius = UDim.new(0, 8)
    
    local label = Instance.new("TextLabel", f)
    label.Size = UDim2.new(0.5, 0, 1, 0)
    label.Position = UDim2.new(0, 15, 0, 0)
    label.BackgroundTransparency = 1
    label.Text = name
    label.TextColor3 = Color3.fromRGB(220, 220, 220)
    label.Font = Enum.Font.GothamMedium
    label.TextSize = 13
    label.TextXAlignment = Enum.TextXAlignment.Left

    local input = Instance.new("TextBox", f)
    input.Size = UDim2.new(0.4, 0, 0, 26)
    input.Position = UDim2.new(1, -15 - (0.4 * f.AbsoluteSize.X), 0.5, -13)
    input.BackgroundColor3 = Color3.fromRGB(15, 15, 20)
    input.Text = defaultTxt
    input.PlaceholderText = "E.g. 50M"
    input.TextColor3 = Color3.fromRGB(0, 255, 136)
    input.Font = Enum.Font.GothamMedium
    input.TextSize = 12
    Instance.new("UICorner", input).CornerRadius = UDim.new(0, 6)
    Instance.new("UIStroke", input).Color = Color3.fromRGB(50, 50, 60)

    input.FocusLost:Connect(function() callback(input.Text) end)
end

createToggle("Auto-Join Target Servers", 10, Config.AutoJoin, function(v) Config.AutoJoin = v end)
createInputOption("Minimum Gen (Join & Notify)", 60, "1M", function(txt) 
    local num = parseValue(txt)
    Config.MinGenRequirements = num > 0 and num or 1000000
end)
createToggle("Notify on Target Found", 110, Config.NotifyTarget, function(v) Config.NotifyTarget = v end)


-- ==========================================
-- [ 🔄 CORE LOGIC HANDLERS ]
-- ==========================================
local DisplayedJobIDs = {}

local function renderLogEntry(data)
    if DisplayedJobIDs[data.jobId] then return end -- Avoid duplicates
    DisplayedJobIDs[data.jobId] = true

    local entry = Instance.new("Frame", Scroll)
    entry.Size = UDim2.new(1, 0, 0, 0) -- For pop-in animation
    entry.BackgroundColor3 = Color3.fromRGB(25, 25, 30)
    entry.ClipsDescendants = true
    Instance.new("UICorner", entry).CornerRadius = UDim.new(0, 6)

    local info = Instance.new("TextLabel", entry)
    info.Size = UDim2.new(0.7, 0, 1, 0)
    info.Position = UDim2.new(0, 10, 0, 0)
    info.BackgroundTransparency = 1
    info.Text = string.format("<b>%s</b>\n<font color='#00ff88'>Gen: %s</font>", data.name, data.gen)
    info.RichText = true
    info.TextColor3 = Color3.fromRGB(220, 220, 220)
    info.Font = Enum.Font.GothamMedium
    info.TextSize = 12
    info.TextXAlignment = Enum.TextXAlignment.Left

    local joinBtn = Instance.new("TextButton", entry)
    joinBtn.Size = UDim2.new(0.25, 0, 0, 30)
    joinBtn.Position = UDim2.new(0.72, 0, 0.5, -15)
    joinBtn.BackgroundColor3 = Color3.fromRGB(0, 200, 100)
    joinBtn.Text = "JOIN"
    joinBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
    joinBtn.Font = Enum.Font.GothamBold
    joinBtn.TextSize = 12
    Instance.new("UICorner", joinBtn).CornerRadius = UDim.new(0, 4)
    setupHover(joinBtn, Color3.fromRGB(0, 200, 100), Color3.fromRGB(0, 255, 136))

    joinBtn.MouseButton1Click:Connect(function() secureJoin(data.placeId, data.jobId, joinBtn) end)

    -- Animate entry pop-in
    tween(entry, 0.4, {Size = UDim2.new(1, 0, 0, 50)})
end

local function updateSystem()
    local s, content = pcall(function() return readfile(LOG_FILE) end)
    if not s or not content or content == "" then return end
    
    local logs = HttpService:JSONDecode(content)
    if type(logs) ~= "table" then return end
    
    local validLogs = {}
    local timeNow = os.time()
    
    for _, logData in ipairs(logs) do
        -- Check Age Limit (Ignore old logs to prevent clutter and dead servers)
        if timeNow - (logData.time or timeNow) <= Config.MaxLogAge then
            table.insert(validLogs, logData)
            renderLogEntry(logData)
            
            -- Auto-Join & Notify Logic
            if (logData.time or 0) > LatestProcessedTime then
                local objGen = parseValue(logData.gen)
                if objGen >= Config.MinGenRequirements then
                    if Config.NotifyTarget then
                        pcall(function()
                            game:GetService("StarterGui"):SetCore("SendNotification", {
                                Title = "🎯 Vander Target Found!",
                                Text = logData.name .. " | Gen: " .. logData.gen,
                                Duration = 10,
                            })
                        end)
                        -- Play an Alert Chime
                        local sound = Instance.new("Sound", game.Workspace)
                        sound.SoundId = "rbxassetid://4590657391" -- Xbox notification sound
                        sound.Volume = 8
                        sound:Play()
                        game.Debris:AddItem(sound, 3)
                    end
                    
                    if Config.AutoJoin then
                        print("[Vander Elite]: Auto-join requirement met! Teleporting...")
                        secureJoin(logData.placeId, logData.jobId, nil)
                    end
                end
            end
        end
    end
    
    -- Sync filtered logs back to disk to clean out old garbage
    LatestProcessedTime = os.time()
    pcall(function() writefile(LOG_FILE, HttpService:JSONEncode(validLogs)) end)
end

-- Force refresh UI on command
local function clearAndReload()
    for _, v in pairs(Scroll:GetChildren()) do
        if v:IsA("Frame") then v:Destroy() end
    end
    DisplayedJobIDs = {}
    updateSystem()
end

RefreshBtn.MouseButton1Click:Connect(function()
    tween(RefreshBtn, 0.1, {Size = UDim2.new(0.45, 0, 0.9, 0)})
    task.wait(0.1)
    tween(RefreshBtn, 0.1, {Size = UDim2.new(0.48, 0, 1, 0)})
    clearAndReload()
end)

ClearBtn.MouseButton1Click:Connect(function()
    pcall(function() writefile(LOG_FILE, "[]") end)
    DisplayedJobIDs = {}
    for _, v in pairs(Scroll:GetChildren()) do
        if v:IsA("Frame") then tween(v, 0.2, {Size = UDim2.new(1, 0, 0, 0)}) end
    end
    task.wait(0.2)
    clearAndReload()
end)

-- Background monitor loop (Checks for new entries from the Sniper in the background)
task.spawn(function()
    while task.wait(3) do
        updateSystem()
    end
end)

print("[Vander Elite]: GUI Initialized.")
