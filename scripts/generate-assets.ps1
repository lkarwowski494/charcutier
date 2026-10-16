Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\lukas\.gemini\antigravity\brain\0ba4e0dd-ece8-4028-aa18-70c125d1db2e\charcutier_app_icon_1792166937147.jpg"
$assetsDir = "c:\Users\lukas\Documents\antigravity\excited-noether\assets"

if (!(Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null
}

$img = [System.Drawing.Image]::FromFile($sourcePath)

function Save-ResizedImage($width, $height, $targetFilename) {
    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $width, $height)
    $g.Dispose()
    $outputPath = Join-Path $assetsDir $targetFilename
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Generated: $outputPath ($width x $height)"
}

Save-ResizedImage 1024 1024 "icon.png"
Save-ResizedImage 1024 1024 "adaptive-icon.png"
Save-ResizedImage 512 512 "splash-icon.png"
Save-ResizedImage 64 64 "favicon.png"

$img.Dispose()
Write-Host "All assets generated successfully!"
