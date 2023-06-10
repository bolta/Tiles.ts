#!/bin/sh -eu

# 生ソースファイルを前処理して生成物置き場に配置し、実行する

HERE="$(dirname "$0")"

raw_src_path="$1"
src_name_no_ext="$(basename "$raw_src_path" | sed 's/\.[^.]*$//')"
ext="$(echo $raw_src_path | sed 's/^.*\.//')"
time_run="$(date +%Y%m%d_%H%M%S)"

# 生成物は生ソースごとにまとめる
dest_dir="$HERE/../atelier/$src_name_no_ext"
mkdir -p "$dest_dir"

# 生成物にはタイムスタンプを付与
preprocessed_src_path="$dest_dir/$src_name_no_ext.$time_run.$ext"

# 配置した前処理済みソースファイルから Tiles.ts の src/ ディレクトリへの相対パス
# TODO できれば自動で求めたい
tiles_src_dir_path=../../src

# TODO Linux（WSL）版と Windows 版の混在をなんとかする
npx ts-node "$HERE/../src/preprocess.ts" "$raw_src_path" "$tiles_src_dir_path" > "$preprocessed_src_path"
cmd.exe /c npx.cmd ts-node src/main.ts "$preprocessed_src_path"
