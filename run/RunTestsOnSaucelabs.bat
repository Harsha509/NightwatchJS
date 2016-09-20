@echo off
cd..
cd configurations

call grunt saucelabs
call grunt report

cd..
cd run

pause