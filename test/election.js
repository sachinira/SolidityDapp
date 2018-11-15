var Election = artifacts.require("./Election.sol");


contract("Election", function(accounts) {
//this is going to include all of the accounts that exists in the blockchain
	it("Initializes with two candidates",function() {
		return Election.deployed().then(function(instance){
			return instance.candidateCount();
		}).then(function(count){//asynchrnous promise chain
			assert.equal(count, 2);
		});
	}); 


	//we are going to test if the id ,name and vote count is correct when we deploy the contract to the blockchain
	it("Initialize candidate with correct values",function(){
		return Election.deployed().then(function(instance){
			electionInstance = instance;
			return electionInstance.candidates(1);
		}).then(function(candidate){
			assert.equal(candidate[0], 1, "contains corect id");
			assert.equal(candidate[1], "candidate 1", "contains corect name");
			assert.equal(candidate[2], 0, "contains corect name");
			return electionInstance.candidates(2);

		}).then(function(candidate){
			assert.equal(candidate[0], 2, "contains corect id");
			assert.equal(candidate[1], "candidate 2", "contains corect name");
			assert.equal(candidate[2], 0, "contains corect name");
		});
	});

	it("allows to caste a vote",function(){
		return Election.deployed().then(function(instance){

			electionInstance = instance;
			candidateId = 1;
			return electionInstance.vote(candidateId, {from: accounts[0]});

		}).then(function(receipt){

			//we inspect the transaction receipt we received
			assert.equal(receipt.logs.length, 1, "an event was triggered");
			assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
			assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");

			//read the voters apping we created returned if account voted or not
			return electionInstance.voters(accounts[0]); 
		}).then(function(voted){
			assert(voted, "the voter was marked as voted");
			return electionInstance.candidates(candidateId);
		}).then(function(candidate){
			var voteCount =  candidate[2];
			assert.equal(voteCount, 1, "increments the candidate's vote count");
		});
	});


	it("throws an exception for invaild candidates", function(){
		return Election.deployed().then(function(instance){

			electionInstance =instance;
			return electionInstance.vote(99, {from: accounts[1]});
		}).then(assert.fail).catch(function(err){
			//checking error
			assert(err.message.indexOf('revert') >= 0, "error must contain revert");
			return electionInstance.candidates(1);

		}).then(function(candidate1){

			var voteCount =candidate1[2];
			assert.equal(voteCount, 1, "candidate1 did not eceive any votes");
			return electionInstance.candidates(2);

		}).then(function(candidate2){
			var voteCount =candidate2[2];
			assert.equal(voteCount, 0, "candidate2 did not eceive any votes");
		});
	});


	it("throws an exception for double voting",function(){
		return Election.deployed().then(function(instance){

			electionInstance = instance;
			candidateId = 2;
			electionInstance.vote(candidateId, {from: accounts[1]});
			return electionInstance.candidates(candidateId);

		}).then(function(candidate){

			var voteCount = candidate[2];
			assert.equal(voteCount, 1, "accepts first vote");
			return electionInstance.vote(candidateId, {from: accounts[1]});

		}).then(assert.fail).catch(function(error){

			assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
			return electionInstance.candidates(1);

		}).then(function(candidate1){

			var voteCount = candidate1[2];
			assert.equal(voteCount, 1, "candidate1 didn't receive any votes");
			return electionInstance.candidates(2);

		}).then(function(candidate2){

			var voteCount = candidate2[2];
			assert.equal(voteCount, 1, "candidate2 didn't receive any votes");

		});
	});


















});