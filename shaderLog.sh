#!/bin/bash

OS=$(uname)
ARQ=$(uname -m)
DIST="UNKNOWN"

if [ -f /etc/os-release ]; then
    . /etc/os-release
    DIST=$NAME
fi

case "$1" in
    install)
        if [ $OS == "Linux" ]; then
            echo "Install dependeces for Linux - $DIST"
            if [ "$DIST" == "Amazon Linux AMI" ]; then

                # Install Node
                if [ ! -e ~/.nvm/ ]; then
                    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
                    nvm install node
                fi

            elif [ "$DIST" == "Ubuntu" ]; then
                sudo apt-get update
                sudo apt-get upgrade
                sudo apt-get install npm nodejs
                sudo ln -s /usr/bin/nodejs /usr/local/bin/node

            elif [ "$DIST" == "Raspbian GNU/Linux" ]; then
                curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
                sudo apt-get install nodejs -y
            fi

        elif [ $OS == "Darwin" ]; then
            
            # ON MacOX 
            if [ ! -e /usr/local/bin/brew ]; then
                ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
            fi

            brew update
            brew upgrade
            brew install npm node 
        fi

        npm install

        if [ ! -e key.pem ] && [ ! -e cert.pem ]; then
            openssl req -new -x509 -sha256 -newkey rsa:2048 -nodes -keyout key.pem -days 365 -out cert.pem
        fi 
        ;;

    start)
        while true ; do
            npm start
            sleep 5
        done
        ;;

    stop)
        sudo kill -9 `pgrep -f npm`
        sudo kill -9 `pgrep -f node`
        ps aux  |  grep -i 'shaderLog.sh'  | grep -v grep |  awk '{print $2}'  |  xargs kill -9
        ;;

    *)
        if [ ! -e /usr/local/bin/paparazzi_worker ]; then
            echo "Usage: $0 install"
        else
            echo "Usage: $0 start"
        fi
        exit 1
        ;;
esac
