#!/usr/bin/env python
import glob, os

files = glob.glob("log/*.frag")

def edited(file):
    defaultHeader = open('default.txt','r')
    testingFile = open(file,'r');

    while True:
        line1 = defaultHeader.readline()
        if not line1: 
            return False
        line2 = testingFile.readline()
        s1 = line1.strip()
        s2 = line2.strip()
        if s1 != s2:
            return True

for f in files:
    touched = edited(f)
    if not touched:
        filename = os.path.splitext(f)[0]
        if os.path.exists(filename+'.frag'):
            print "deleting "+filename+'.frag'
            os.remove(filename+'.frag')
        if os.path.exists(filename+'.png'):
            print "deleting "+filename+'.png'
            os.remove(filename+'.png')