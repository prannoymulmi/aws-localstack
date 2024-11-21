#!/bin/bash

KEYS_DIR="terraform/keys"
PRIVATE_KEY_FILE="$KEYS_DIR/private.pem"
PUBLIC_KEY_FILE="$KEYS_DIR/public.pem"

# Create the keys directory if it doesn't exist
if [ ! -d "$KEYS_DIR" ]; then
  mkdir -p "$KEYS_DIR"
  echo "Directory '$KEYS_DIR' created."
fi

# Generate the private key if it doesn't exist
if [ ! -f "$PRIVATE_KEY_FILE" ]; then
  openssl genpkey -algorithm RSA -out "$PRIVATE_KEY_FILE" -pkeyopt rsa_keygen_bits:2048
  echo "Private key generated and saved to '$PRIVATE_KEY_FILE'."
else
  echo "Private key already exists at '$PRIVATE_KEY_FILE'."
fi

# Generate the public key if it doesn't exist
if [ ! -f "$PUBLIC_KEY_FILE" ]; then
  openssl rsa -pubout -in "$PRIVATE_KEY_FILE" -out "$PUBLIC_KEY_FILE"
  echo "Public key generated and saved to '$PUBLIC_KEY_FILE'."
else
  echo "Public key already exists at '$PUBLIC_KEY_FILE'."
fi