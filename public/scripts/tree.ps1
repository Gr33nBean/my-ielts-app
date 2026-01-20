function Show-Tree {
    param (
        [string]$Path = ".",
        [string]$Indent = ""
    )

    # In thư mục (bỏ node_modules)
    Get-ChildItem -Path $Path -Directory -Exclude node_modules | ForEach-Object {
        Write-Output "$Indent|-- [DIR] $($_.Name)"
        Show-Tree -Path $_.FullName -Indent "$Indent    "
    }

    # In file
    Get-ChildItem -Path $Path -File | ForEach-Object {
        Write-Output "$Indent|-- [FILE] $($_.Name)"
    }
}

Show-Tree
