@echo off
setlocal
set MAVEN_VERSION=3.9.16
set MAVEN_DIR=%~dp0.maven
set MVN_CMD=%MAVEN_DIR%\apache-maven-%MAVEN_VERSION%\bin\mvn.cmd

if not exist "%MVN_CMD%" (
    echo Downloading Maven %MAVEN_VERSION%...
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; New-Item -ItemType Directory -Force -Path '%MAVEN_DIR%' | Out-Null; Invoke-WebRequest -Uri 'https://dlcdn.apache.org/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip' -OutFile '%MAVEN_DIR%\maven.zip'; Expand-Archive -Path '%MAVEN_DIR%\maven.zip' -DestinationPath '%MAVEN_DIR%'; Remove-Item '%MAVEN_DIR%\maven.zip'"
)

"%MVN_CMD%" %*
