import config from '../config';
const { MONGO_URI, MONGO_DB_NAME } = config;
const url = `${MONGO_URI}`;
const dbname = `${MONGO_DB_NAME}`;
var MongoClient = require('mongodb').MongoClient;

// Retrieve all data
exports.findAll =  (req, res) => {
    const team_id = req.query.id;
    const limit = parseInt(req.query.limit);
    const page = req.query.page;
    const status = req.query.status;
    var fromDate = req.query.from;
    var toDate = req.query.to;
    var skip = (page - 1)*limit;
    if(skip < 0) skip = 0;
    if(team_id){
        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            var dbo = db.db(dbname);
            var collection = dbo.collection(team_id);
            var countFilter = 0;
            if(collection){
                
                collection.find({ time : {'$gte': fromDate, '$lte': toDate}, status : status}).count((err, count) => { countFilter = count });
                collection.find({ time : {'$gte': fromDate, '$lte': toDate}, status : status}).skip(skip).limit(limit).toArray((err, result) => {
                    if(err) throw err;
                    res.send({
                        result : result,
                        count : countFilter,
                    });
                })
     
            }
            else{
                res.status(404).send({
                    message : "Not found " + team_id + " collection!",
                })
            }
    
          });
    }

};

exports.addTrack = (req, res) => {
    const team_id = req.query.id;
    var myobj = req.body.activity;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbname);
        var collection = dbo.collection(team_id);
        if(!collection){
            dbo.createCollection(team_id, function(err, res) {
                if (err) throw err;
                console.log(team_id, "Collection created!");
            });
        }
        
        dbo.collection(team_id).insertMany(myobj, (err, result) => {
            if (err){
                throw err;
            }
            res.send(myobj);
            console.log("1 document inserted");
            db.close();
          });

      });
      
};


exports.getCollections = (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbname);
        dbo.listCollections().toArray(function(err, collInfos) {
            var result = collInfos.map(coll => {
                    return coll.name;
            })
            res.send(result);
        });

      });
}

exports.getTimeHistory = (req, res) => {
    const team_id = req.query.id;
    if(team_id){
        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            var dbo = db.db(dbname);
            var collection = dbo.collection(team_id);
            if(collection){
                
                collection.find({}).toArray(function(err, results) {
                    if (err) throw err;
                    var times = results.map(result => {
                        return result.time;
                    })
                    var history = [];
                    for(var i = 0; i < 24; i++){
                        history.push([1, 1, 1, 1, 1, 1, 1])
                    }
                    times.forEach(time => {
                        var date = new Date(time*1000);
                        var hour = date.getHours();
                        var weekDay = date.getDay();
                        console.log(hour, weekDay)
                        history[hour][weekDay] = history[hour][weekDay] + 1;
                    })
                    res.send({
                        result: history
                    })
                    db.close();
                  });
     
            }
            else{
                res.status(404).send({
                    message : "Not found " + team_id + " collection!",
                })
            }
    
          });
    }
}