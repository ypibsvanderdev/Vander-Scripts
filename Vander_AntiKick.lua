-- [[ VANDER ELITE ANTI-KICK MODULE ]]
-- v1.0 Standalone Version

local Players = game:GetService("Players")
local GuiService = game:GetService("GuiService")
local LocalPlayer = Players.LocalPlayer

print("[VANDER]: Initializing Anti-Kick Stealth...")

-- [METATABLE HOOKING]
-- This blocks any script from calling :Kick() on your own player object.
local mt = getrawmetatable(game)
local oldNamecall = mt.__namecall
local oldIndex = mt.__index

setreadonly(mt, false)

-- Hook __namecall (used for method calls like player:Kick())
mt.__namecall = newcclosure(function(self, ...)
    local method = getnamecallmethod()
    local args = {...}
    
    if (method == "Kick" or method == "kick") and self == LocalPlayer then
        warn("[VANDER BLOCK]: Prevented a server/client kick attempt.")
        print("[VANDER REASON]: " .. tostring(args[1] or "No reason provided"))
        return nil -- Return nothing to stop the function from executing
    end
    
    return oldNamecall(self, ...)
end)

-- Hook __index (used for property access or alternate kick calls)
mt.__index = newcclosure(function(self, key)
    if (key == "Kick" or key == "kick") and self == LocalPlayer then
        return newcclosure(function() 
            warn("[VANDER BLOCK]: Prevented a property-based kick attempt.")
            return nil 
        end)
    end
    
    return oldIndex(self, key)
end)

setreadonly(mt, true)

-- [ERROR SIGNAL INTERCEPTOR]
-- Blocks the "You have been kicked" gray popup from appearing.
GuiService.ErrorMessageChanged:Connect(function()
    local success, errorMsg = pcall(function() return GuiService:GetErrorMessage() end)
    if success and errorMsg ~= "" then
        print("[VANDER]: Intercepted Connection Error: " .. errorMsg)
        GuiService:ClearError() -- Forces the popup to close immediately
    end
end)

print("[VANDER]: Anti-Kick Protection is now ACTIVE.")
print("[VANDER]: You can now stay in servers even if the owner tries to kick you.")
