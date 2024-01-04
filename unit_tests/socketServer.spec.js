const expect = require('chai').expect;
const itParam = require('mocha-param');
const winston = require('./config/winston_test.js')
const fs = require('fs');
const net = require('net')
//import io from 'socket.io-client'
const { io } = require("socket.io-client")

const socketServer = require('../VLCB-server/socketServer.js')


// Scope:
// variables declared outside of the class are 'global' to this module only
// callbacks need a bind(this) option to allow access to the class members
// let has block scope (or global if top level)
// var has function scope (or global if top level)
// const has block scope (like let), but can't be changed through reassigment or redeclared

const NET_ADDRESS = "localhost"
const JSON_PORT = 5561
const SERVER_PORT=5562
const LAYOUTS_PATH="./unit_tests/layouts/"

const mock_jsonServer = new (require('./mock_jsonServer'))(JSON_PORT)
socketServer.socketServer(NET_ADDRESS, LAYOUTS_PATH, JSON_PORT, SERVER_PORT)


function decToHex(num, len) {return parseInt(num & (2 ** (4*len) - 1)).toString(16).toUpperCase().padStart(len, '0');}

function stringToHex(string) {
  // expects UTF-8 string
  var bytes = new TextEncoder().encode(string);
  return Array.from(
    bytes,
    byte => byte.toString(16).padStart(2, "0")
  ).join("");
}

function hexToString(hex) {
    // returns UTF-8 string
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i !== bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return new TextDecoder().decode(bytes);
}




describe('socketServer tests', function(){

  const socket = io(`http://${NET_ADDRESS}:${SERVER_PORT}`)

  // Add a connect listener
  socket.on('connect', function (socket) {
    console.log('   web socket Connected!');
  });
  socket.emit('CH01', 'me', 'test msg');


	before(function(done) {
		winston.info({message: ' '});
		winston.info({message: '================================================================================'});
    //                      12345678901234567890123456789012345678900987654321098765432109876543210987654321
		winston.info({message: '------------------------------ socketServer tests ------------------------------'});
		winston.info({message: '================================================================================'});
		winston.info({message: ' '});
        
		done();
	});

	beforeEach(function() {
    winston.info({message: ' '});   // blank line to separate tests
    winston.info({message: ' '});   // blank line to separate tests
        // ensure expected CAN header is reset before each test run
	});

	after(function() {
   		winston.info({message: ' '});   // blank line to separate tests
	});																										


  //****************************************************************************************** */
  //
  // Actual tests after here...
  //
  //****************************************************************************************** */  


  //
  it("get_layout_list test ${JSON.stringify(value)}", async function () {
    winston.info({message: 'unit_test: BEGIN get_layout_list test '});
    const test_layout_path = "./unit_tests/layouts/"
    socketServer.checkLayoutExists(test_layout_path + "test1")
    socketServer.checkLayoutExists(test_layout_path + "test2")
    //
    var result = socketServer.get_layout_list(test_layout_path)
    winston.info({message: 'unit_test: result ' + result});
    winston.info({message: 'unit_test: result count ' + result.length});
    expect(result[0]).to.equal('default');
    expect(result[1]).to.equal('test1');
    winston.info({message: 'unit_test: END get_layout_list test'});
  })

  //
  it("request_layout_list test ${JSON.stringify(value)}", function (done) {
    winston.info({message: 'unit_test: BEGIN request_layout_list test '});
    //
    socket.on('LAYOUTS_LIST', function (data) {
			var layouts_list = data;
			winston.info({message: ' LAYOUTS_LIST : ' + JSON.stringify(layouts_list)});
			});	
    socket.emit('REQUEST_LAYOUTS_LIST')
    //
    setTimeout(function(){
      winston.info({message: 'unit_test: END request_layout_list test'});
			done();
		}, 100);
  })

  //
  it("request_version test ${JSON.stringify(value)}", function (done) {
    winston.info({message: 'unit_test: BEGIN request_version test '});
    //
    socket.on('VERSION', function (data) {
			var version = data;
			winston.info({message: ' VERSION : ' + JSON.stringify(version)});
			});	
    socket.emit('REQUEST_VERSION')
    //
    setTimeout(function(){
      winston.info({message: 'unit_test: END request_version test'});
			done();
		}, 100);

  })

})


