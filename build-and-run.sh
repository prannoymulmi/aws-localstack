#! /bin/bash

BUCKET_NAME="state-bucket"
FIRST_RUN=true  # Set FIRST_RUN as a boolean (without quotes)

# Check if the bucket exists
if ! awslocal s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    # Create the bucket if it doesn't exist
    echo "Bucket does not exist, creating it..."
    awslocal s3api create-bucket --bucket "$BUCKET_NAME"
    echo "Bucket '$BUCKET_NAME' created."
else
    echo "Bucket '$BUCKET_NAME' already exists."
    FIRST_RUN=false  # Update the boolean
fi

rm -rf node_modules
rm -rf dist
yarn install
yarn build
yarn deploy

# Define the target directory
tf_dir="./terraform"

# Run commands inside the target directory without changing the current directory
(
  cd "$tf_dir" || exit
  pwd
  rm -rf .terraform
  tflocal init
  tflocal apply -auto-approve
)

# Check if it's the first run
if $FIRST_RUN; then
  for k in {1..2}
  do
    awslocal dynamodb put-item \
                --table-name "catalog-table" \
                --item "{
                    \"tenantId\": {\"S\": \"tenant$k\"},
                     \"table_name\": {\"S\": \"tenant-$k-table\"}
                }"
    echo "Inserted tenant$k in catalog-table"
    for i in {1..10}
      do
        # Generate a random userId and email
        userId="user-$RANDOM-$RANDOM"
        email="user$i@example.com"

        # Insert into DynamoDB using awslocal
        awslocal dynamodb put-item \
          --table-name "tenant-$k-table" \
          --item "{
              \"id\": {\"S\": \"$userId\"},
              \"codeVerifier\": {\"S\": \"some-code-verifier-$i\"},
              \"accessToken\": {\"S\": \"access-token-value-$i\"},
              \"refreshToken\": {\"S\": \"refresh-token-value-$i\"},
              \"expiresAt\": {\"N\": \"1700000000\"},
              \"user_email\": {\"S\": \"$email\"},
              \"password\": {\"S\": \"test$k\"},
              \"userProfile\": {
                  \"M\": {
                      \"name\": {\"S\": \"User $i\"},
                      \"email\": {\"S\": \"$email\"}
                  }
              }
          }"

        echo "Inserted user with userId $userId and email $email in tenant-$k-table"
      done
  done
fi

if $FIRST_RUN; then
  # Host entries to add
  HOST1="127.0.0.1 tenant1.local"
  HOST2="127.0.0.1 tenant2.local"
  HOSTS_FILE="/etc/hosts"

  # Function to add a host entry if it doesn't exist
  add_host_if_missing() {
      local HOST_ENTRY="$1"
      local HOSTS_FILE="$2"

      if ! grep -qF "$HOST_ENTRY" "$HOSTS_FILE"; then
          echo "$HOST_ENTRY" | sudo tee -a "$HOSTS_FILE" > /dev/null
          echo "Added $HOST_ENTRY to $HOSTS_FILE"
          sudo dscacheutil -flushcache
          sudo killall -HUP mDNSResponder
      else
          echo "$HOST_ENTRY already exists in $HOSTS_FILE"
      fi
  }

  # Add tenant1.local and tenant2.local if they are missing
  add_host_if_missing "$HOST1" "$HOSTS_FILE"
  add_host_if_missing "$HOST2" "$HOSTS_FILE"
fi