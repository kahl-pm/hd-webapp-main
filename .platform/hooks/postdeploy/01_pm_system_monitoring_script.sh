#!/bin/bash

#https://www.digitalocean.com/community/tutorials/nohup-command-in-linux
nohup_version_check=`nohup --version`
if [[ ! -e/var/log/pm-monitoring.log ]]; then
  touch /var/log/pm-monitoring.log
  chmod 666 /var/log/pm-monitoring.log
fi
if [ -z "$nohup_version_check" ]; then
  echo "FATAL: could not find nohup installed on the system" >> /var/log/pm-monitoring.log
else
  # we query secretsmanager to get the appropriate secret value for github token
  echo "calling aws secretsmanager to retrieve github token"

  SECRET_ID="PM_GITHUB_CONTEXT_$(echo $PM_ENV | tr '[:lower:]' '[:upper:]')"
  PM_GITHUB_TOKEN=$(aws secretsmanager get-secret-value --secret-id $SECRET_ID --region ca-central-1 --query SecretString --output text | jq -r ."GITHUB_TOKEN")

  # call github restapi to download the script
  echo "INFO: Calling github api to download pm_system_monitoring_cron"
  curl \
    -H "Authorization: token ${PM_GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github.v3.raw" \
    https://api.github.com/repos/policyme/global-tools-development/contents/scripts/pm_system_monitoring_cron.sh > /var/app/current/pm_system_monitoring_cron.sh

  chmod 755 /var/app/current/pm_system_monitoring_cron.sh

  # https://stackoverflow.com/questions/16809134/how-to-get-a-list-of-programs-running-with-nohup
  ps -xw
  mon_check=`ps -xw | grep pm_system_monitoring_cron.sh | grep -v 'grep'`
  if [ -z "$mon_check" ]; then
    nohup /var/app/current/pm_system_monitoring_cron.sh> /dev/null 2>&1 & # as we need to run the script forever
    disown #https://phoenixnap.com/kb/disown-command-linux
  else
    echo "pm_system_monitoring_cron.sh is already running" >> /var/log/pm-monitoring.log
  fi
fi 
exit
