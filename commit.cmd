@echo off
chcp 65001
xcopy .\test\ C:\Users\范文佳\AppData\Local\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs\test\ /s /y /EXCLUDE:e
echo OK
