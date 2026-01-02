#!/usr/bin/env pwsh

# Elasticsearch Data Migration Script
# This script provides automated data migration from PostgreSQL to Elasticsearch

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("songs", "artists", "albums", "playlists", "all", "reinitialize", "verify")]
    [string]$Action = "all",
    
    [Parameter(Mandatory=$false)]
    [int]$BatchSize = 150,
    
    [Parameter(Mandatory=$false)]
    [string]$ServiceUrl = "http://localhost:3001"
)

# Colors for output
$colors = @{
    Success = "Green"
    Error   = "Red"
    Warning = "Yellow"
    Info    = "Cyan"
    Header  = "Magenta"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "Info"
    )
    Write-Host $Message -ForegroundColor $colors[$Color]
}

function Start-Migration {
    param(
        [string]$Endpoint,
        [string]$Description
    )
    
    Write-ColorOutput "`n▶ $Description..." "Info"
    
    $startTime = Get-Date
    
    try {
        $response = Invoke-WebRequest -Uri "$ServiceUrl/search/migration/$Endpoint" `
            -Method POST `
            -Headers @{ "Content-Type" = "application/json" } `
            -Body (ConvertTo-Json @{ batchSize = $BatchSize }) `
            -ErrorAction Stop
        
        $result = $response.Content | ConvertFrom-Json
        $endTime = Get-Date
        $duration = ($endTime - $startTime).TotalSeconds
        
        return @{
            Success  = $true
            Result   = $result
            Duration = $duration
        }
    } catch {
        Write-ColorOutput "❌ Failed: $_" "Error"
        return @{
            Success = $false
            Error   = $_.Exception.Message
        }
    }
}

function Get-IndexCounts {
    Write-ColorOutput "`nFetching index counts..." "Info"
    
    $indices = @("songs", "artists", "albums", "playlists")
    $counts = @{}
    
    foreach ($index in $indices) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:9200/$index/_count" `
                -Method GET `
                -ErrorAction Stop
            $data = $response.Content | ConvertFrom-Json
            $counts[$index] = $data.count
        } catch {
            $counts[$index] = "N/A"
        }
    }
    
    return $counts
}

function Show-MigrationSummary {
    param(
        [hashtable]$Results
    )
    
    Write-ColorOutput "`n╔════════════════════════════════════════════╗" "Header"
    Write-ColorOutput "║      Migration Summary - COMPLETED ✅      ║" "Header"
    Write-ColorOutput "╠════════════════════════════════════════════╣" "Header"
    
    if ($Results.Songs) {
        Write-ColorOutput "║ Songs:     $($Results.Songs.indexed)/$($Results.Songs.total) indexed" "Success"
    }
    if ($Results.Artists) {
        Write-ColorOutput "║ Artists:   $($Results.Artists.indexed)/$($Results.Artists.total) indexed" "Success"
    }
    if ($Results.Albums) {
        Write-ColorOutput "║ Albums:    $($Results.Albums.indexed)/$($Results.Albums.total) indexed" "Success"
    }
    if ($Results.Playlists) {
        Write-ColorOutput "║ Playlists: $($Results.Playlists.indexed)/$($Results.Playlists.total) indexed" "Success"
    }
    
    Write-ColorOutput "╚════════════════════════════════════════════╝" "Header"
}

function Show-VerificationReport {
    param(
        [hashtable]$Counts
    )
    
    Write-ColorOutput "`n📊 Index Document Counts:" "Info"
    Write-ColorOutput "─────────────────────────" "Info"
    
    $totalCount = 0
    foreach ($index in @("songs", "artists", "albums", "playlists")) {
        $count = $Counts[$index]
        $totalCount += $count
        Write-ColorOutput "  $index`: $count documents" "Success"
    }
    
    Write-ColorOutput "`n  Total: $totalCount documents indexed" "Header"
}

# Main execution
Write-ColorOutput "╔════════════════════════════════════════════╗" "Header"
Write-ColorOutput "║   Elasticsearch Data Migration Tool ✨     ║" "Header"
Write-ColorOutput "╚════════════════════════════════════════════╝" "Header"

Write-ColorOutput "`nConfiguration:" "Info"
Write-ColorOutput "  Service URL:  $ServiceUrl" "Info"
Write-ColorOutput "  Batch Size:   $BatchSize" "Info"
Write-ColorOutput "  Action:       $Action" "Info"

switch ($Action) {
    "songs" {
        $result = Start-Migration -Endpoint "songs" -Description "Migrating Songs"
        if ($result.Success) {
            Write-ColorOutput "✅ Songs migration completed: $($result.Result.indexed)/$($result.Result.total) indexed (${$result.Duration}s)" "Success"
        }
    }
    
    "artists" {
        $result = Start-Migration -Endpoint "artists" -Description "Migrating Artists"
        if ($result.Success) {
            Write-ColorOutput "✅ Artists migration completed: $($result.Result.indexed)/$($result.Result.total) indexed (${$result.Duration}s)" "Success"
        }
    }
    
    "albums" {
        $result = Start-Migration -Endpoint "albums" -Description "Migrating Albums"
        if ($result.Success) {
            Write-ColorOutput "✅ Albums migration completed: $($result.Result.indexed)/$($result.Result.total) indexed (${$result.Duration}s)" "Success"
        }
    }
    
    "playlists" {
        $result = Start-Migration -Endpoint "playlists" -Description "Migrating Playlists"
        if ($result.Success) {
            Write-ColorOutput "✅ Playlists migration completed: $($result.Result.indexed)/$($result.Result.total) indexed (${$result.Duration}s)" "Success"
        }
    }
    
    "all" {
        Write-ColorOutput "`n🚀 Starting complete data migration..." "Warning"
        $startTime = Get-Date
        
        $results = @{
            Songs    = (Start-Migration -Endpoint "all" -Description "Migrating All Data").Result
        }
        
        $endTime = Get-Date
        $totalDuration = ($endTime - $startTime).TotalSeconds
        
        Show-MigrationSummary -Results $results.Songs
        Write-ColorOutput "`n⏱️  Total duration: $($totalDuration.ToString('F2'))s" "Info"
    }
    
    "reinitialize" {
        Write-ColorOutput "`n⚠️  This will clear all indices and re-migrate data!" "Warning"
        $confirm = Read-Host "Continue? (yes/no)"
        
        if ($confirm -eq "yes") {
            Write-ColorOutput "`n🔄 Reinitializing indices..." "Warning"
            $startTime = Get-Date
            
            $result = Start-Migration -Endpoint "reinitialize" -Description "Reinitializing and Migrating"
            
            if ($result.Success) {
                $endTime = Get-Date
                $duration = ($endTime - $startTime).TotalSeconds
                
                Show-MigrationSummary -Results $result.Result
                Write-ColorOutput "`n⏱️  Total duration: $($duration.ToString('F2'))s" "Info"
            }
        } else {
            Write-ColorOutput "Migration cancelled." "Warning"
        }
    }
    
    "verify" {
        Write-ColorOutput "`n✓ Verifying Elasticsearch indices..." "Info"
        $counts = Get-IndexCounts
        
        if ($counts) {
            Show-VerificationReport -Counts $counts
        }
    }
}

Write-ColorOutput "`n✅ Done!" "Success"
Write-Host ""
