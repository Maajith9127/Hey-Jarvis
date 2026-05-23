# ================================
# 🚀 Hey Jarvis Frontend Deploy Script (Fixed Order)
# ================================

# Path to your PEM key
$PemPath = "C:\Users\maaji\OneDrive\Desktop\jarvis-backend-key\jarvis-2.pem"

# Local build path (dist folder)
$LocalDist = "C:\Users\maaji\OneDrive\Desktop\Jarvis-FrontEnd\Hey-Jarvis-FrontEnd\jarvis-frontend\dist\*"

# Remote server + folder
$Remote = "ubuntu@56.228.60.77"
$RemotePath = "/usr/share/nginx/html/"

Write-Host "🚀 Starting Frontend Deploy..."

# ---------------------------------
# Step 0: Test SSH connection
# ---------------------------------
Write-Host "`n--- Step 0: Testing SSH connection ---"
ssh -i $PemPath $Remote "echo '[SSH OK] Connected to server'"

# ---------------------------------
# Step 1: Fix ownership & permissions (before cleanup)
# ---------------------------------
Write-Host "`n--- Step 1: Fixing ownership & permissions ---"
ssh -i $PemPath $Remote "echo '[DEBUG] Setting permissions early...'; sudo chown -R ubuntu:ubuntu $RemotePath && sudo chmod -R 755 $RemotePath; echo '[DEBUG] Permissions ready.'"

# ---------------------------------
# Step 2: Clean old files
# ---------------------------------
Write-Host "`n--- Step 2: Removing old files ---"
ssh -i $PemPath $Remote "echo '[DEBUG] Running rm...'; rm -rf $RemotePath*; echo '[DEBUG] Cleanup done.'"

# ---------------------------------
# Step 3: Copy new dist build
# ---------------------------------
Write-Host "`n--- Step 3: Copying dist files ---"
scp -i $PemPath -r $LocalDist "${Remote}:${RemotePath}"

# ---------------------------------
# Step 4: Set final ownership for nginx
# ---------------------------------
Write-Host "`n--- Step 4: Final permissions for nginx ---"
ssh -i $PemPath $Remote "echo '[DEBUG] Applying final permissions...'; sudo chown -R www-data:www-data $RemotePath && sudo chmod -R 755 $RemotePath; echo '[DEBUG] Permissions fixed.'"

# ---------------------------------
# Step 5: Restart nginx
# ---------------------------------
Write-Host "`n--- Step 5: Restarting nginx ---"
ssh -i $PemPath $Remote "echo '[DEBUG] Restarting nginx...'; sudo systemctl restart nginx; echo '[DEBUG] Nginx restarted.'"

Write-Host "`n✅ Frontend deploy completed successfully!"
