@echo off
if "%1" == "h" goto begin
mshta vbscript:createobject("wscript.shell").run("""%~nx0"" h",0)(window.close)&&exit
:begin
REM
git init
git add test/
git add e
git add commit.cmd
git add git-commit.cmd
git commit -m "Test"
git branch -M main
git remote add origin https://github.com/FeJS8888/awa.git
git push -u origin main
exit