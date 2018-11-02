var Migrations = artifacts.require("./Migrations.sol");

//here our migrations files live whenever we deploy our contract to the blockchain we are changing the state 

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
 //we number our migrations in order so that truffle knows the order to run them
 