#!/bin/bash -v

REMOTE_HOST=$(aws ec2 describe-instances --filters "Name=tag:Name, Values=Books" --query "Reservations[*].Instances[*].PublicIpAddress" | jq  '.[0] | .[0]' | sed -e 's/^"//' -e 's/"$//')

zip books.zip -r . -x \*node_modules\* -x \*lib\* -x books.zip -x \*.git\* 

scp -i $PEM_FILE books.zip install.sh ec2-user@$REMOTE_HOST:.
ssh -i $PEM_FILE ec2-user@$REMOTE_HOST '(bash install.sh -i books.zip -o dist)'
