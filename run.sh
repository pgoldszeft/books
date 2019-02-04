#!/bin/bash -v

REMOTE_HOST=$(aws ec2 describe-instances --filters "Name=tag:Name, Values=Books" --query "Reservations[*].Instances[*].PublicIpAddress" | jq  '.[0] | .[0]' | sed -e 's/^"//' -e 's/"$//')


ssh -n -i $PEM_FILE ec2-user@$REMOTE_HOST "
	killall -KILL node
	cd dist/server 
	nohup node app.js &>/dev/null & 
	nohup node reviewsWorker.js &>/dev/null &
	disown
"
