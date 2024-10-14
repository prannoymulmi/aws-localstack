# aws-localstack

# Getting Started 🚀

### Prerequisites for running Application
* <a href=https://www.docker.com/>Docker for Local Stack</a>
* <a href=https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html>AWS CLI</a>
* 


## Installing Local Stack
* <a href=https://docs.localstack.cloud/getting-started/installation/>How to install Localstack</a>

``` bash
# Validates the docker-compose.yml, if the configurations are ok
localstack config validate

## Start Docker compose
docker run \
  --rm -it \
  -p 127.0.0.1:4566:4566 \
  -p 127.0.0.1:4510-4559:4510-4559 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  localstack/localstack
```
