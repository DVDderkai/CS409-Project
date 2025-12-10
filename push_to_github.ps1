# PowerShell script to push to GitHub
# Usage: .\push_to_github.ps1 YOUR_GITHUB_USERNAME REPO_NAME

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername,
    
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

Write-Host "Setting up GitHub repository..." -ForegroundColor Green

# Add remote (if not exists)
$remoteUrl = "https://github.com/$GitHubUsername/$RepoName.git"
git remote remove origin 2>$null
git remote add origin $remoteUrl

# Rename branch to main
git branch -M main

Write-Host "`nRepository configured!" -ForegroundColor Green
Write-Host "Remote URL: $remoteUrl" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Create the repository '$RepoName' on GitHub.com" -ForegroundColor White
Write-Host "2. Then run: git push -u origin main" -ForegroundColor White
Write-Host "`nOr run this script after creating the repo on GitHub." -ForegroundColor Gray

