@echo off

::Chrome = chrome
::Firefox = firefox
::internet explorer = iexplorer

node %cd%\configurations\nightwatch -e chrome,firefox,iexplorer

pause
