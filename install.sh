#!/bin/bash

INPUT_FILE=books.zip
OUTPUT_DIR=dist

get_abs_filename() {
  # $1 : relative filename
  echo "$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
}

usage()
{
	echo "Usage: $1 -i <input zip file> -o <destination dir>"
}

while [ "$1" != "" ]; do
	case $1 in 
		-i ) 	shift
				INPUT_FILE=$1
				;;
		-o )	shift
				OUTPUT_DIR=$1
				;;
		--help | -h )
				usage $0
				exit 1
				;;
		* )		usage $0
				exit 0
	esac
	shift
done

if [ -z "$INPUT_FILE" ] || [ -z "$OUTPUT_DIR" ] 
then
	usage $0
	exit 0
fi

INPUT_FILE_PATH=$(get_abs_filename $INPUT_FILE)
OUTPUT_FULL_PATH=$(get_abs_filename $OUTPUT_DIR)

if [ -d $OUTPUT_FULL_PATH ]; then
	rm -rf $OUTPUT_FULL_PATH
fi

mkdir -p $OUTPUT_FULL_PATH
cd $OUTPUT_FULL_PATH
unzip $INPUT_FILE_PATH


cd $OUTPUT_FULL_PATH/server
npm install

cd $OUTPUT_FULL_PATH/client
npm install

cp -r $OUTPUT_FULL_PATH/client/app/* $OUTPUT_FULL_PATH/server/views


