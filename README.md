# Wan Gobel Express Offline App
## Build Installer
$ build -wml
* -w = windows, -m = mac, -l = linux
## Source Code App
Di folder app/ terdapat source code berisi file html dan javascript yang akan di export oleh electron.js menjadi installer untuk desktop application.
Folder ini akan tetap kosong di repository git. Folder ini akan diisi oleh file yang telah di test, manager hanya tinggal mereplace isi file dengan yang terbaru.
## Publish
$ npm run publish
Script ini akan mengcompile script di dalam folder app/ kedalam folder dist/ dan secara otomatis akan mengirim script ke list publish github.