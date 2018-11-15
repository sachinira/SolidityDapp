 App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    // Load pets.
   /* $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });*/

    return App.initWeb3();
  },

  initWeb3: function() {
    /*
     * Replace me...
     */

    /* // Modern dapp browsers...
    if (App.ethereum) {
        App.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            ethereum.enable();
            // Acccounts now exposed
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (App.web3) {
        App.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
    }
    // Non-dapp browsers...
    else {

      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');

    }*/




     /*initilizes connection of clientside application to the blockchain*/

     if(typeof web3 !== 'undefined'){
      //If a web3 instance is already prvided by metamask
      App.web3Provider = web3.currentProvider;
      web3 =  new Web3(web3.currentProvider);
     } else {
      //specify a default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
     }
    return App.initContract();
  },

  initContract: function() {
    /*
     *  initilize the contract Election.js loads the contract into the front end application
     */

     //this election.json works with election.sol file we use browsersync 
     //it allows to read json files out of the build contract artifacts
     $.getJSON("Election.json", function(election){ //load a jso file of the election artifact
      //use this json to create a truffle contract
      //truffle contract is the contractwhich can interact inside our app
      App.contracts.Election = TruffleContract(election);
      //set the provider in the contract 
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

       return App.render();

     });

  },

  render:function(){
    var electionInstance;

    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();


    //display the account we are connecting to the blockchain with
    web3.eth.getCoinbase(function(err, account){
      if(err === null){
        //we get the account instance
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });


    //list down the candidates on the page
    App.contracts.Election.deployed().then(function(instance){
      electionInstance = instance; 
      //get instance of the artifact 
      return electionInstance.candidateCount();
      //the countercache of the candidates
    }).then(function(candidateCount){

      var candidatesResult = $("#candidatesResult");
      candidatesResult.empty();

      var candidatesSelect = $("#candidatesSelect");
      candidatesSelect.empty();


      //listout each candidate of the mapping we use our counter cache for this 
      for(var i = 1;i <= candidateCount; i++){
        electionInstance.candidates(i).then(function(candidate){

          //fetch each cadidate from the mapping
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
          candidatesResult.append(candidateTemplate);
          //we take the content and append it to the table on the page

          var candidateOption = "<option value='" + id + "' >" + name + "</option>";
          candidatesSelect.append(candidateOption);
        });
      }
      return electionInstance.voters(App.account);
    }).then(function(hasVoted){

      if(hasVoted){

        $('form').hide();

      }

      loader.hide();
      content.show();
      
    }).catch(function(error){

      console.warn(error);

    });  
  },

  listenForEvents:function(){

    App.contracts.Election.deployed().then(function(instance){

      instance.votedEvent({},{  //the first argument is a filter /second is metadata this means we want to subscribe to every events on  
        //in the blockchsin

        fromBlock: 0,
        toBlock: 'latest'

      }).watch(function(error, event){

        console.log("event trigered", event);
        //to reload when a new vote is recorded
        App.render();
      });
    });
  },

  castVote:function(){

    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance){

      return instance.vote(candidateId, {from: App.account});

    }).then(function(result){
      $('#content').hide();
      $('#loader').show();
    }).catch(function(error){
      console.error(error);
    });

  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
