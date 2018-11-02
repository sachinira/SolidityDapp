var Elections = artifacts.require("./Election.sol");


contract("Election", function(accounts) {
//this is going to include all of the accounts that exists in the blockchain
	it("Initializes with two candidates",function() {
		return Elections.deployed().then(function(instance){
			return instance.candidateCount();
		}).then(function(count){//asynchrnous promise chain
			assert.equal(count, 2);
		});
	}); 


	//we are going to test if the id ,name and vote count is correct when we deploy the contract to the blockchain
	it("Initialize candidate with correct values",function(){
		return Elections.deployed().then(function(instance){
			electionInstance = instance;
			return electionInstance.candidates(1);
		}).then(function(candidate){
			
		})
	})
});