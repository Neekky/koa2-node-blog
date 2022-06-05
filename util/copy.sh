#!/bin/sh

cd /Users/cengchao/Study/node-product/logs

cp access.log $(date "+%Y-%m-%d~%H:%M:%S").access.log

echo "" > access.log