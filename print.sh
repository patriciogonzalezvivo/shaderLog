#!/bin/sh

echo $1
# glslViewer $1 -w 384 -h 384 -s 1 -o tmp.png 
glslViewer $1 -w 192 -h 192 -s 1 -o tmp.png # On retina
tprint tmp.png -s $1