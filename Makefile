ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

# If the first argument is "test"...
ifeq (test,$(firstword $(MAKECMDGOALS)))
  # use the rest as arguments for "test"
  TEST_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  # ...and turn them into do-nothing targets
  $(eval $(TEST_ARGS):;@:)
endif

ALL: setup

setup:
	apt-get update && apt-get install -y build-essential libssl-dev ca-certificates emacs24-nox screen
	apt-get update && apt-get install -y software-properties-common
	add-apt-repository -y ppa:ethereum/ethereum
	apt-get update
	apt-get install -y ethereum solc
	echo 'export NVM_DIR="$HOME/.nvm"' >> $HOME/.bashrc
	echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm' >> $HOME/.bashrc
	. $HOME/.bashrc && curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | sh
	. $HOME/.bashrc && nvm install v9.4.0
	npm i -g truffle ganache-cli
	npm install zeppelin-solidity --save
	npm install bluebird --save
	npm install lodash --save

compile:
	npm install
	truffle compile

test: compile
	-screen -X -S ganache kill
	screen -dmS ganache ganache-cli
	sleep 5
	truffle migrate --reset
	truffle test $(TEST_ARGS)
	screen -X -S ganache kill

solc: clean solc-locator solc-discovery solc-adminable solc-registry solc-deploy

solc-deploy:
	echo "var adminableContractContent =" > target/deploy.js
	cat target/Adminable/combined.json >> target/deploy.js
	echo ";\nvar serviceDiscoveryContractContent =" >> target/deploy.js
	cat target/ServiceDiscovery/combined.json >> target/deploy.js
	echo ";\nvar serviceDiscoveryLocatorContractContent =" >> target/deploy.js
	cat target/ServiceDiscoveryLocator/combined.json >> target/deploy.js
	echo ";\n" >> target/deploy.js

solc-registry:
	solc -o target/Registry --overwrite --bin --ast --asm --abi --optimize --gas --combined-json abi,bin,interface --allow-paths ${ROOT_DIR}/node_modules zeppelin-solidity=node_modules/zeppelin-solidity contracts/Registry.sol

solc-adminable:
	solc -o target/Adminable --overwrite --bin --ast --asm --abi --optimize --gas --combined-json abi,bin,interface --allow-paths ${ROOT_DIR}/node_modules zeppelin-solidity=node_modules/zeppelin-solidity contracts/Adminable.sol

solc-locator:
	solc -o target/ServiceDiscoveryLocator --overwrite --bin --ast --asm --abi --optimize --gas --combined-json abi,bin,interface --allow-paths ${ROOT_DIR}/node_modules zeppelin-solidity=node_modules/zeppelin-solidity contracts/ServiceDiscoveryLocator.sol

solc-discovery:
	solc -o target/ServiceDiscovery --overwrite --bin --ast --asm --abi --optimize --gas --combined-json abi,bin,interface --allow-paths ${ROOT_DIR}/node_modules zeppelin-solidity=node_modules/zeppelin-solidity contracts/ServiceDiscovery.sol

untab:
	./untab.sh

.PHONY: clean test untabify

clean:
	rm -rf ${ROOT_DIR}/target ${ROOT_DIR}/build
