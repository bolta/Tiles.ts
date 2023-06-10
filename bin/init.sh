#!/bin/sh -eu

cd "$(dirname "$0")/.."

TEMPLATE_DIR=./resources
ATELIER_DIR=./atelier
mkdir -p "$ATELIER_DIR"

new_file_path="$ATELIER_DIR/$(date +%Y%m%d_%H%M%S).ts"

if [ -f "$new_file_path" ]; then
	echo "$new_file_path already exists."
	exit 1
fi

cp $TEMPLATE_DIR/template.ts $new_file_path \
&& echo $new_file_path created.
