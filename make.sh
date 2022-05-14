#!/bin/bash

cd /root/axis
git pull

cd api

npm run deploy

cd ../client

npm run deploy