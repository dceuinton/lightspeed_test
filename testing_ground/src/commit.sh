#!/bin/bash

git add .
git status
echo -e "Enter commit message: "
read MES
git commit -m "$MES"