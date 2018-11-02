var Elections = artifacts.require("./Election.sol");

//artifacts represent contract abstraction specific to truffle 

module.exports = function(deployer) {
	deployer.deploy(Elections);
} 

//look back about the filenames and contract names and whatnames should be included in thos places