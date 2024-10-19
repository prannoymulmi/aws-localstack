#! /bin/bash



BUCKET_NAME="state-bucket"

# Check if the bucket exists
if ! awslocal s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    # Create the bucket if it doesn't exist
    echo "Bucket does not exist, creating it..."
    awslocal s3api create-bucket --bucket "$BUCKET_NAME"
    echo "Bucket '$BUCKET_NAME' created."
else
    echo "Bucket '$BUCKET_NAME' already exists."
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

