pragma solidity ^0.4.24;

contract Election {

	//the first letter of contract name is capitalized
	//2.model a candidate
	struct Candidate {
		uint id;
		string name;
		uint voteCount;
	}


	//store accounts that has voted
	mapping(address => bool) public voters;

	//1.store candidates we need to save the candidates 
	mapping(uint => Candidate) public candidates; 
	//mapping in solidity is like an associative array which maps key value pairs 
	//when we add candidates we are changing the stte of our blockchain this will be interacting with the data layer of the blockchain
	//the size of this mapping cannot be determined in solidity and no way to iterate
	//if look for a candidate not stored a default value is returned 
	//when we call this function it expects a key as an argument


	//adding an event
	event votedEvent (
		  uint indexed _candidateId
	);


	//after returning the promise the items inside the result must be accessed using array repreasentation

	//fetch candidate

	//store candidate count we are going to use a counter cache
	uint public candidateCount;


	//3. read candidates this is a way to read
	//string public candidate;//public is going to assign a getter function to the variable

	//constructor will run when the app is migrated to the blockchain
	//we are defining a constructor in solidity by defining a function as the same name as the contract
	function Election() public {
		//this is going to run whenever we deploy it to the blockchain
		//so it is declared public
		//store value of candidates
		//candidate = "Candidate 1"; //variable without an underscore is a state variable and it accessible inside our contract belongs to our smart contract 
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


	//cast the vote
	//for these functions we can pass metadata in solidity language
	function vote (uint _candidateId) public {

		//record if that voter has voted as one voter can 
		//app.vote(1,{ from: web3.eth.accounts[0] }) is the command passed
		//here from is a metadata so it is captcured by the msg.seder and saved it in the voters mapping
		//we dont want this function to be called by anyone
		//if address has not voted before
		//require accept a condition which evaluate to ture condition execures
		require(!voters[msg.sender]); //that this address is not in this mapping
		require(_candidateId > 0 && _candidateId <=candidateCount);//require a valid candidate

		//voting for a valud candidate
		voters[msg.sender] = true;
		//update candidate voteCount
		//reference mapping
		candidates[_candidateId].voteCount ++;


		//we can create an event when the vote are counted ad subscribe to that event in our 
		//front end application to see the votes coming in realtime
		votedEvent(_candidateId);
	}
}
