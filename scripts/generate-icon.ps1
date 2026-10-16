Add-Type -AssemblyName System.Drawing

$width = 1024
$height = 1024
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)

$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Background: Ceramic Basalt #121214
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#121214'))
$g.FillRectangle($bgBrush, 0, 0, $width, $height)

# Subtle luxury inner squircle / craft border
$borderPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml('#24242A'), 4)
$g.DrawRectangle($borderPen, 32, 32, 960, 960)

# Subtle metallic glow circle behind steak emblem
$glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 164, 62, 56))
$g.FillEllipse($glowBrush, 162, 162, 700, 700)

# Colors
$accentColor = [System.Drawing.ColorTranslator]::FromHtml('#A43E38') # Smoked Hickory Red
$accentLight = [System.Drawing.ColorTranslator]::FromHtml('#E06D53') # Paprika Rosa
$meatFill = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#1C1C1F'))
$strokePen = New-Object System.Drawing.Pen($accentColor, 34)
$strokePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$strokePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$strokePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

$marblingPen = New-Object System.Drawing.Pen($accentLight, 22)
$marblingPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$marblingPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

# Transform coords helper
$t = {
    param([float]$v)
    return [float](128.0 + ($v * 32.0))
}

# Steak path: M5 14c-1-5 2-9 7-9 6 0 8 3 8 7 0 5-4 8-8 8-4.5 0-6.5-3-7-6z
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddBezier(
    [float](& $t 5), [float](& $t 14),
    [float](& $t 4), [float](& $t 9),
    [float](& $t 7), [float](& $t 5),
    [float](& $t 12), [float](& $t 5)
)
$path.AddBezier(
    [float](& $t 12), [float](& $t 5),
    [float](& $t 18), [float](& $t 5),
    [float](& $t 20), [float](& $t 8),
    [float](& $t 20), [float](& $t 12)
)
$path.AddBezier(
    [float](& $t 20), [float](& $t 12),
    [float](& $t 20), [float](& $t 17),
    [float](& $t 16), [float](& $t 20),
    [float](& $t 12), [float](& $t 20)
)
$path.AddBezier(
    [float](& $t 12), [float](& $t 20),
    [float](& $t 7.5), [float](& $t 20),
    [float](& $t 5.5), [float](& $t 17),
    [float](& $t 5), [float](& $t 14)
)
$path.CloseFigure()

# Fill steak shape with dark ceramic meat texture
$g.FillPath($meatFill, $path)
$g.DrawPath($strokePen, $path)

# Bone center: Circle cx="10.5" cy="11.5" r="2.2"
[float]$boneCenterX = 128.0 + (10.5 * 32.0)
[float]$boneCenterY = 128.0 + (11.5 * 32.0)
[float]$boneRadius = 2.2 * 32.0
[float]$boneDiam = $boneRadius * 2.0
[float]$boneX = $boneCenterX - $boneRadius
[float]$boneY = $boneCenterY - $boneRadius

$boneFill = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#121214'))
$g.FillEllipse($boneFill, $boneX, $boneY, $boneDiam, $boneDiam)
$bonePen = New-Object System.Drawing.Pen($accentColor, 28)
$g.DrawEllipse($bonePen, $boneX, $boneY, $boneDiam, $boneDiam)

# Marbling / butcher string curves:
# Path 1: M8.5 7.5c2 2 3.5 2 5 0
$pathM1 = New-Object System.Drawing.Drawing2D.GraphicsPath
$pathM1.AddBezier(
    [float](& $t 8.5), [float](& $t 7.5),
    [float](& $t 10.5), [float](& $t 9.5),
    [float](& $t 12), [float](& $t 9.5),
    [float](& $t 13.5), [float](& $t 7.5)
)
$g.DrawPath($marblingPen, $pathM1)

# Path 2: M9 15.5c2-1 4-1 6 0
$pathM2 = New-Object System.Drawing.Drawing2D.GraphicsPath
$pathM2.AddBezier(
    [float](& $t 9), [float](& $t 15.5),
    [float](& $t 11), [float](& $t 14.5),
    [float](& $t 13), [float](& $t 14.5),
    [float](& $t 15), [float](& $t 15.5)
)
$g.DrawPath($marblingPen, $pathM2)

# Save icon
$bmp.Save('assets/icon.png', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save('assets/adaptive-icon.png', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save('assets/splash-icon.png', [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
Write-Host 'Official Apps4Craft Masaz icons generated successfully at 1024x1024!'
