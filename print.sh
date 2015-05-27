#!/bin/sh

echo $1
glslViewer $1 -w 384 -h 384 -s 1 -o tmp.png
tprint tmp.png -s $1