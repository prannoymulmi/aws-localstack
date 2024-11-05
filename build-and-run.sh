#! /bin/bash

BUCKET_NAME="state-bucket"
FIRST_RUN=true  # Set FIRST_RUN as a boolean (without quotes)
VOLUME_DIR="./volume"
RUN_ALL=false
RUN_DB=false

# Check for --run-all flag
for arg in "$@"; do
  if [ "$arg" == "--run-all" ]; then
    RUN_ALL=true
    break
  fi
done

# Check for --run-all flag
for arg in "$@"; do
  if [ "$arg" == "--run-db" ]; then
    RUN_DB=true
    break
  fi
done

if [ ! -d "$VOLUME_DIR" ]; then
  mkdir -p "$VOLUME_DIR"
  echo "Directory '$VOLUME_DIR' created."
fi

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

yarn clean
yarn install
#yarn build
yarn deploy

# Define the target directory
tf_dir="./terraform"

# Run commands inside the target directory without changing the current directory
if ! $RUN_DB; then
  (
    cd "$tf_dir" || exit
    pwd
    rm -rf .terraform
    tflocal init
    tflocal apply -auto-approve
  )
fi
# Check if it's the first run
if $FIRST_RUN || $RUN_ALL || $RUN_DB; then
  # Add this at the top of your script to import the argon2 library
  node -e "require('argon2');"

  # Function to hash passwords using Argon2id
  hash_password() {
    local PASSWORD="$1"
    node -e "
      const argon2 = require('argon2');
      argon2.hash('$PASSWORD', { type: argon2.argon2id }).then(hash => console.log(hash)).catch(err => console.error(err));
    "
  }

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
        password="test$k"
        hashed_password=$(hash_password "$password")

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
              \"password\": {\"S\": \"$hashed_password\"},
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

# Add tenant domain into local hosts file
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