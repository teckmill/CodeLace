Get-ChildItem -Path "js/src/components/*.ts" | ForEach-Object {
    (Get-Content $_.FullName) | ForEach-Object {
        $_ -replace "from '../core/Component'", "from '../core/component'"
    } | Set-Content $_.FullName
}
