<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Style Guidelines](#style-guidelines)
  - [Testing](#testing)
    - [Tests Must be Written Elegantly](#tests-must-be-written-elegantly)
    - [Tests Must not be Random](#tests-must-not-be-random)
  - [Documentation](#documentation)
- [Pull Request Workflow](#pull-request-workflow)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Style Guidelines

Follow the official Solidity style guide: http://solidity.readthedocs.io/en/latest/style-guide.html

### Testing

#### Tests Must be Written Elegantly

Style guidelines are not relaxed for tests. Tests are a good way to show how to use the library, and maintaining them is extremely necessary.

Don't write long tests, write helper functions to make them be as short and concise as possible (they should take just a few lines each), and use good variable names.

#### Tests Must not be Random

Inputs for tests should not be generated randomly. Accounts used to create test contracts are an exception, those can be random. Also, the type and structure of outputs should be checked.

### Documentation

See [README.md](https://github.com/EthereumGroup/DiscoveryService/blob/master/README.md)

## Pull Request Workflow

Our workflow is based on GitHub's pull requests. We use feature branches, prepended with: `test`, `feature`, `fix`, `refactor`, or `remove` according to the change the branch introduces. Some examples for such branches are:
```sh
git checkout -b test/some-module
git checkout -b feature/some-new-stuff
git checkout -b fix/some-bug
git checkout -b remove/some-file
```

We expect pull requests to be rebased to the master branch before merging:
```sh
git remote add eds git@github.com:EthereumGroup/service-discovery.git
git pull --rebase eds master
```

Note that we require rebasing your branch instead of merging it, for commit readability reasons.

After that, you can push the changes to your fork, by doing:
```sh
git push origin your_branch_name
git push origin feature/some-new-stuff
git push origin fix/some-bug
```

Finally go to [github.com/EthereumGroup/service-discovery](https://github.com/EthereumGroup/service-discovery) in your web browser and issue a new pull request.

Main contributors will review your code and possibly ask for changes before your code is pulled in to the main repository.  We'll check that all tests pass, review the coding style, and check for general code correctness. If everything is OK, we'll merge your pull request and your code will be part of Ethereum Service Discovery Project.

Thanks for your time and code!
