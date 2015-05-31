#!/bin/sh

echo $1
cp www/log/$1.png current.png 
cp www/log/$1.frag current.frag
tprint current.png -s $1