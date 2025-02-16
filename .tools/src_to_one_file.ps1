$CurDir=(Get-Item .).FullName

Set-Location $PSScriptRoot

Get-ChildItem ..\src -Recurse -Include '*.ts','*.vue' | 
Resolve-Path -Relative |
ForEach-Object {
@'
// -- start of file '{0}' --
{1}
//-- end of file '{0}' --

'@ -f $_, (Get-Content $_ -Raw)
} |
Set-Content src.txt

Set-Location $CurDir