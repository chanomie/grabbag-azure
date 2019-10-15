brew install azure-cli

mvn package azure-webapp:deploy


Used to generate random coupon codes:
for run in {1..10000}; do openssl rand -hex 10; done
