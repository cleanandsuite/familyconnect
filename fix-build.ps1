$pkg = Get-Content package.json -Raw
$pkg = $pkg -replace 'vite build && esbuild api/boot\.ts --platform=node --bundle --format=esm --outdir=dist --banner:js="import \{ createRequire \} from .module.;const require = createRequire\(import\.meta\.url\);"', 'vite build'
$pkg | Set-Content package.json
Write-Host "Done"