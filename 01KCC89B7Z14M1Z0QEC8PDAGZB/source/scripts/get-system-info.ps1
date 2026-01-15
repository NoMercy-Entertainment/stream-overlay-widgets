# Collect basic system info via WMI/CIM and write to public/system-info.json
# Run with PowerShell (pwsh) in project root:
#   pwsh -File .\scripts\get-system-info.ps1

$outFile = Join-Path -Path (Get-Location) -ChildPath "public\system-info.json"

function Get-FirstValue($obj, $props) {
    foreach ($p in $props) {
        if ($null -ne $obj.$p -and $obj.$p -ne "") { return $obj.$p }
    }
    return $null
}

# Gather motherboard / baseboard
$baseboard = Get-CimInstance -ClassName Win32_BaseBoard | Select-Object Manufacturer, Product, SerialNumber

# BIOS
$bios = Get-CimInstance -ClassName Win32_BIOS | Select-Object Manufacturer, SMBIOSBIOSVersion, ReleaseDate

# System / Model
$cs = Get-CimInstance -ClassName Win32_ComputerSystem | Select-Object Manufacturer, Model, TotalPhysicalMemory

# Processor
$cpu = Get-CimInstance -ClassName Win32_Processor | Select-Object Name, Manufacturer, MaxClockSpeed

# Physical memory modules
$memModules = Get-CimInstance -ClassName Win32_PhysicalMemory | Select-Object DeviceLocator, Capacity, Speed
$mem = @{
    TotalMB = if ($cs.TotalPhysicalMemory) { [int]([math]::Round($cs.TotalPhysicalMemory / 1MB)) } else { $null }
    Modules = @()
}
foreach ($m in $memModules) {
    $mem.Modules += @{ Slot = $m.DeviceLocator; CapacityBytes = [int64]$m.Capacity; SpeedMHz = $m.Speed }
}

# Disk drives
$disks = Get-CimInstance -ClassName Win32_DiskDrive | Select-Object Model, InterfaceType, MediaType, Size
$diskList = @()
foreach ($d in $disks) {
    $diskList += @{ Model = $d.Model; Interface = $d.InterfaceType; MediaType = $d.MediaType; SizeBytes = if ($d.Size) { [int64]$d.Size } else { $null } }
}

# USB devices summary (count)
$usb = Get-CimInstance -ClassName Win32_USBHub | Measure-Object | Select-Object -ExpandProperty Count

# Logical disks (partitions)
$logical = Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DriveType=3" | Select-Object DeviceID, VolumeName, FileSystem, Size, FreeSpace
$logicalList = @()
foreach ($l in $logical) {
    $logicalList += @{ Drive = $l.DeviceID; VolumeName = $l.VolumeName; FileSystem = $l.FileSystem; SizeBytes = if ($l.Size) { [int64]$l.Size } else { $null }; FreeBytes = if ($l.FreeSpace) { [int64]$l.FreeSpace } else { $null } }
}

$info = [PSCustomObject]@{
    CollectedAt = (Get-Date).ToString("s")
    BaseBoard = $baseboard
    BIOS = $bios
    System = $cs
    CPU = $cpu
    Memory = $mem
    DiskDrives = $diskList
    LogicalDisks = $logicalList
    USBHubCount = $usb
}

# ensure public folder exists
$publicDir = Join-Path -Path (Get-Location) -ChildPath "public"
if (-not (Test-Path $publicDir)) {
    New-Item -ItemType Directory -Path $publicDir | Out-Null
}

# Write JSON
$info | ConvertTo-Json -Depth 5 | Out-File -FilePath $outFile -Encoding utf8
Write-Host "Wrote system info to $outFile"
