@echo off
cd C:\Users\范文佳\Downloads\Git\
xcopy .\test\ F:\WpSystem\S-1-5-21-121885046-4280389438-3734349734-1006\AppData\Local\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs\test\ /s /y /EXCLUDE:e
echo OK
start git-commit.cmd
