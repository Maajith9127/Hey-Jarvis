# Path to your PEM key
$PemPath = "C:\Users\maaji\OneDrive\Desktop\jarvis-backend-key\jarvis-2.pem"

# Local backend paths
$LocalDist = "C:\Users\maaji\OneDrive\Desktop\Jarvis-BackEnd\Hey-Jarvis-BackEnd\dist"
$LocalEnv = "C:\Users\maaji\OneDrive\Desktop\Jarvis-BackEnd\Hey-Jarvis-BackEnd\.env"
$LocalPackage = "C:\Users\maaji\OneDrive\Desktop\Jarvis-BackEnd\Hey-Jarvis-BackEnd\package*.json"

# Remote server + backend folder
$Remote = "ubuntu@56.228.60.77"
$RemotePath = "/home/ubuntu/hey-jarvis-backend"

Write-Host "Starting Backend Deploy..."

# 1. Clean old backend files
ssh -i $PemPath $Remote "rm -rf $RemotePath/*"

# 2. Copy new build + env + package files
scp -i $PemPath -r $LocalDist $LocalEnv $LocalPackage "${Remote}:${RemotePath}"

# 3. Install production dependencies
ssh -i $PemPath $Remote "cd $RemotePath && npm install --only=prod"

# 4. Start PM2 processes from correct folder
ssh -i $PemPath $Remote "cd $RemotePath && pm2 delete all || true"
ssh -i $PemPath $Remote "cd $RemotePath && pm2 start dist/index.js --name jarvis-server"
ssh -i $PemPath $Remote "cd $RemotePath && pm2 start dist/accountabilityWorker.js --name jarvis-worker"
ssh -i $PemPath $Remote "pm2 save"

Write-Host "✅ Backend deploy completed successfully!"
