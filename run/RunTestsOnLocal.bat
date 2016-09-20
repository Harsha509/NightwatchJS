@echo off
cd..
cd configurations

call grunt local
call grunt report

cd..
cd run

pause