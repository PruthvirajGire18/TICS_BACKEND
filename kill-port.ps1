# PowerShell script to find and kill process using a specific port
# Usage: .\kill-port.ps1 5000

param(
    [Parameter(Mandatory=$true)]
    [int]$Port
)

Write-Host "Searching for process using port $Port..." -ForegroundColor Yellow

# Find process using the port
$connection = netstat -ano | findstr ":$Port"

if ($connection) {
    Write-Host "Found connection on port $Port:" -ForegroundColor Green
    Write-Host $connection
    
    # Extract PID (last column)
    $pid = ($connection -split '\s+')[-1]
    
    if ($pid) {
        Write-Host "`nAttempting to kill process with PID: $pid" -ForegroundColor Yellow
        
        try {
            taskkill /PID $pid /F
            Write-Host "✅ Process killed successfully!" -ForegroundColor Green
            Write-Host "You can now start your server." -ForegroundColor Cyan
        } catch {
            Write-Host "❌ Failed to kill process. You may need to run as Administrator." -ForegroundColor Red
            Write-Host "Try running: taskkill /PID $pid /F" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Could not extract PID from connection info." -ForegroundColor Red
    }
} else {
    Write-Host "✅ No process found using port $Port" -ForegroundColor Green
    Write-Host "Port is available!" -ForegroundColor Cyan
}
