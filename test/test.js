var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('express')();
var apipoke = require('../routes/pokeapi');
app.use('/', apipoke);

function makeRequest(route, statusCode, done){
    request(app)
    .get(route)
    .expect(statusCode)
    .end(function(err, res){
        if(err){return done(err);}

        done(null, res);
    });
};

describe('Testing pokeapi route', function(){
    describe('without params', function(){
        it('should return a 404 (pokeapi)', function(done){
            makeRequest('/', 404, function(err, res){
                if(err){return done(err);}
                done();
            });
        });

        it('should return a 404 (pokemon/)', function(done){
            makeRequest('/pokemon', 404, function(err, res){
                if(err){return done(err);}
                done();
            });
        });

        it('should return a 404 (types)', function(done){
            makeRequest('/types', 404, function(err, res){
                if(err){return done(err);}
                done();
            });
        });
    });

    describe('with invalid params', function(){
        it('should return 404 (pokeapi)', function(done){
            makeRequest('/testing',404, function(err, res){
                if(err){return done(err);}
                done();
            });
        });

        it('should return 404 (allpokemon)', function(done){
            makeRequest('/allpokemon/test',404, function(err, res){
                if(err){return done(err);}
                done();
            });
        });
    });
    describe('with valid params', function(){
        it('should return a 200 (allpokemon)', function(done){

            makeRequest('/allpokemon', 200, done);        
        });

        it('should return a 200 (types)', function(done){

            makeRequest('/types/fire', 200, done);        
        });

        it('should return a 200 (pokemon, aipom)', function(done){

            makeRequest('/pokemon/aipom', 200, done);        
        });

        it('should not be a undefined array', function(done){

            
            makeRequest('/allpokemon', 200, function(err, res){
                if(err){return done(err);}

                res.body.should.be.a('array');
                expect(res.body).to.not.be.undefined;
                done();
            });
        });

        it('should return psychic (abra)', function(done){

            var type = 'psychic';
            
            makeRequest('/pokemon/abra', 200, function(err, res){
                if(err){return done(err);}

                expect(res.body.slot1).to.not.be.undefined;
                expect(res.body.slot1).to.include(type);
                done();
            });
        });

        it('should return ground and steel (steelix)', function(done){
            
            var maintype = 'steel';
            var secondtype = 'ground';
           
            makeRequest('/pokemon/steelix', 200, function(err, res){
                if(err){return done(err);}

                expect(res.body.slot1).to.not.be.undefined;
                expect(res.body.slot1).to.include(secondtype);
                expect(res.body.slot2).to.not.be.undefined;
                expect(res.body.slot2).to.include(maintype);
                done();
            });
        });

        it('should return types strong against fire', function(done){
            
            var water = 'water';
            var ground = 'ground';
            var rock = 'rock';

            makeRequest('/types/fire', 200, function(err, res){
                if(err){return done(err);}

                expect(res.body.double_damage_from[2].name).to.not.be.undefined;
                expect(res.body.double_damage_from[2].name).to.include(water);
                expect(res.body.double_damage_from[1].name).to.not.be.undefined;
                expect(res.body.double_damage_from[1].name).to.include(rock);
                expect(res.body.double_damage_from[0].name).to.not.be.undefined;
                expect(res.body.double_damage_from[0].name).to.include(ground);

                done();
            });
        });

            it('should return types incapable of fighting against fairy (dragon)', function(done){
            
            var dragon = 'dragon';

            makeRequest('/types/fairy', 200, function(err, res){
                if(err){return done(err);}

                expect(res.body.no_damage_from[0].name).to.not.be.undefined;
                expect(res.body.no_damage_from[0].name).to.include(dragon);

                done();
            });
        });
    });
});