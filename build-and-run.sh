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
              \"userProfile\": {
                  \"M\": {
                      \"name\": {\"S\": \"User $i\"},
                      \"email\": {\"S\": \"$email\"}
                  }
              }
          }"

        echo "Inserted user with userId $userId and email $email in tenant-$k-table"
      done
fi
