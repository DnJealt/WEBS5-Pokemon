var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('express')();
var bodyParser = require('body-parser');
var games = require('../routes/game');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', games);

function makeGetRequest(route, statusCode, done){
    request(app)
    .get(route)
    .expect(statusCode)
    .end(function(err, res){
        if(err){return done(err);}

        done(null, res);
    });
};

function makePostRequest(route, body, statusCode, done){
    request(app)
    .post(route)
    .send(body)
    .expect(statusCode)
    .end(function(err, res){
        if (err){
            return done(err);
        }
        done(null, res);
    });
}

describe('Testing fight simulation', function(){
    describe('supereffective moves', function(){
        it('pikachu vs mudkip (mudkip should win)', function(done){
            var body = {
                testpokemon1: {
                     name: "Pikachu",
                     type1: "electric"
                },
                testpokemon2:{
                    name:  "Mudkip",
                    type1: "water",
                    type2: "ground"
                }
            }
            makePostRequest('/simulate', body, 200, function(err, res){
                if(err){return done(err);}

                expect(res.body).to.not.be.undefined;
                expect(res.body.winner).to.equals('Mudkip');
                done();
            });
        });

        it('spiritomb vs sableye (draw)', function(done){
             var body = {
                testpokemon1: {
                     name: "Sableye",
                     type1: "ghost",
                     type2: "dark"
                },
                testpokemon2:{
                    name:  "Spiritomb",
                    type1: "ghost",
                    type2: "dark"
                }
            }
            makePostRequest('/simulate', body, 200, function(err, res){
                if(err){return done(err);}

                expect(res.body).to.not.be.undefined;
                expect(res.body.winner).to.equals('draw');
                done();
            });
        });
    });

    describe('uneffective moves', function(){
            it('pidgey vs diglett (pidgey should win)', function(done){
                var body = {
                    testpokemon1: {
                        name: "Pidgey",
                        type1: "normal",
                        type2: "flying"
                    },
                    testpokemon2:{
                        name:  "Diglett",
                        type1: "ground"
                    }
                }
                makePostRequest('/simulate', body, 200, function(err, res){
                    if(err){return done(err);}

                    expect(res.body).to.not.be.undefined;
                    expect(res.body.winner).to.equals('Pidgey');
                    done();
            });
        });
    });

    describe('moves that cancel each other out', function(){
        it("staraptor vs mankey (draw)", function(done){
            var body = {
                    testpokemon1: {
                        name: "Mankey",
                        type1: "fight"
                    },
                    testpokemon2:{
                        name:  "Staraptor",
                        type1: "normal",
                        type2: "flying"
                    }
                }
                makePostRequest('/simulate', body, 200, function(err, res){
                    if(err){return done(err);}

                    expect(res.body).to.not.be.undefined;
                    expect(res.body.winner).to.equals('draw');
                    expect(res.body.winner).to.not.equals('staraptor')
                    done();
            });
        });
    });

});


