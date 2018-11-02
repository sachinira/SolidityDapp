pragma solidity ^0.4.24;

contract Election {

	//2.model a candidate
	struct Candidate {
		uint id;
		string name;
		uint voteCount;
	}

	//1.store candidates we need to save the candidates 
	mapping(uint => Candidate) public candidates; 
	//mapping in solidity is like an associative array which maps key value pairs 
	//when we add candidates we are changing the stte of our blockchain this will be interacting with the data layer of the blockchain
	//the size of this mapping cannot be determined in solidity and no way to iterate
	//if look for a candidate not stored a default value is returned 
	//when we call this function it expects a key as an argument



	//after returning the promise the items inside the result must be accessed using array repreasentation

	//fetch candidate

	//store candidate count we are going to use a counter cache
	uint public candidateCount;


	//3. read candidates this is a way to read
	//string public candidate;//public is going to assign a getter function to the variable

	//constructor will run when the app is migrated to the blockchain
	//we are defining a constructor in solidity by defining a function as the same name as the contract
	function Election() public {
		//this isgoing to run whenever we deploy it to the blockchain
		//so it is declared public
		//store value of candidates
		//candidate = "Candidate 1"; //variable without an underscore is a state variable and itaccessible inside our contract belongs to our smart contract 
		//inorder to interact with it we have to create a migration 
		addCandidate("candidate 1");
		addCandidate("candidate 2");
	}
	//variables with _ is known as local variables

	function addCandidate (string _name) private {
		candidateCount++;
		//we reference the candidate mapping pass id of candidate to the mapping
		candidates[candidateCount] =  Candidate(candidateCount,_name,0);
	}

	//we want our smart contract only able to deploy this app to the blockchain
	// we call this inside the constructor and when we deploy this to the blockchsin this methid will be called


	//voter can be anyone connected to the blockchain these are represented by addresses connected to the blockchain
	//we get the access to these user accounts using the web3 library
}
