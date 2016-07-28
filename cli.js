'use strict'

const vorpal = require('vorpal')();
const exec = require('child_process').exec;
const config = require('./config.json');

var migrate = config['MigrateLocation'];

vorpal.command('migrate', 'Create a class in WcfService/Migrations/ > BUILD > Run this command.')
.option('-t, --task [task]', 'Available task : migrate:up (default), rollback, rollback:all, rollback:toversion, listmigration, validateversionorder.')
    .action(function (args, callback) {
        var cmd = migrate + " -a " + config["MigrationsDll"] + " -db " + config["DbType"] + ' -conn "' + config["ConnectionString"] +'"';
        cmd += (args.options.task) ? (" -t " + args.options.task) : "";
        console.log(cmd);
        exec(cmd, function (error, stdout, stderr) {
            if(error){
                console.error('!!! ERROR !!!');
                console.error(stderr);
            } 
            console.log(stdout);
            callback();
        });
        console.log('Enf od task');
    });

isValid(function(){
    vorpal.show();
});

function isValid(cb){
    var error = [];

    error += (config) ? "" : "config.json file is invalid : file not found. Use config.json.template to create your own :) !";
    if(config){
        error += (config["MigrationsDll"]) ? "" : "config.json file is invalid : Please provide the dll file from your migration project library.";
        error += (config["MigrateLocation"]) ? "" : "config.json file is invalid : Please provide path to Migrate.exe.";
        error += (config["DbType"]) ? "" : "config.json file is invalid : Please provide the type of Db (Db2, DotConnectOracle, FireBird, Hana, Jet, Mysql, Oracle, OracleManaged, Postgres, SQLite, SqlServer).";
        error += (config["ConnectionString"]) ? "" : "config.json file is invalid : Please provide a valid ConnectionString."; 
    }

    if(error.length < 1)
        cb();
    else{
        error.forEach(function(element) {
            console.error(element);
        });
    }
}