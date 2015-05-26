#!/bin/sh

# Basics
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install avahi-daemon git-core

# Install GLSL-VIEWER
cd ~
git clone https://github.com/patriciogonzalezvivo/glslViewer.git
cd glslViewer
make
sudo make install

# Install TPRINT
cd ~
git clone https://github.com/patriciogonzalezvivo/tprint.git
cd tprint
make
sudo make install

# Install NODE.JS
cd ~
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb

cd ~/shaderLog
npm install -l
