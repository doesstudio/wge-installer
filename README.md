# Wan Gobel Express Offline App
## Build Installer
$ build -wml
* -w = windows, -m = mac, -l = linux
## Source Code App
Di folder app/ terdapat source code berisi file html dan javascript yang akan di export oleh electron.js menjadi installer untuk desktop application.
Folder ini akan tetap kosong di repository git. Folder ini akan diisi oleh file yang telah di test, manager hanya tinggal mereplace isi file dengan yang terbaru.
## Publish

Generate a GitHub access token by going to <https://github.com/settings/tokens/new>.  The access token should have the `repo` scope/permission.  Once you have the token, assign it to an environment variable 

    On macOS/linux:

        export GH_TOKEN="<YOUR_TOKEN_HERE>"

    On Windows, run in powershell:

        [Environment]::SetEnvironmentVariable("GH_TOKEN","<YOUR_TOKEN_HERE>","User")

    Make sure to restart IDE/Terminal to inherit latest env variable.

$ npm run publish

Script ini akan mengcompile script di dalam folder app/ kedalam folder dist/ dan secara otomatis akan mengirim script ke list publish github.
