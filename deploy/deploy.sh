#!/bin/bash
set -e

if [ -z "$INSTANCE_ID" ]; then
  echo "INSTANCE_ID not set"
  exit 1
fi

echo "Starting remote deploy via SSM"

COMMAND_ID=$(aws ssm send-command \
  --instance-ids "$INSTANCE_ID" \
  --document-name "AWS-RunShellScript" \
  --parameters "commands=[\"cd /home/ubuntu/dit-blog/infra\",\"chmod +x scripts/deploy.sh\",\"AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION ./scripts/deploy.sh\"]" \
  --region "$AWS_DEFAULT_REGION" \
  --output text \
  --query 'Command.CommandId')

echo "SSM Command ID: $COMMAND_ID"
echo "Waiting for command to complete..."

aws ssm wait command-executed \
  --command-id "$COMMAND_ID" \
  --instance-id "$INSTANCE_ID" \
  --region "$AWS_DEFAULT_REGION"

echo "Getting command output..."

aws ssm get-command-invocation \
  --command-id "$COMMAND_ID" \
  --instance-id "$INSTANCE_ID" \
  --region "$AWS_DEFAULT_REGION" \
  --query 'StandardOutputContent' \
  --output text

echo "Deploy completed"
