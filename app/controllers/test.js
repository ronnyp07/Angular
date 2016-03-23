'use strict';

var getDate = function(param){      
    return param.getFullYear() + '-' +  ('0'+(param.getMonth() + 1)).slice(-2)+ '-' + ('0'+(param.getDate())).slice(-2);          
};

var data = db.results.find({created: {'$exists': true}}).toArray();
data.forEach(function( aRow ) {
  db.results.update({_id: aRow._id}, {'$set': {created: getDate(new Date (aRow.created))}});
  // print(getDate(new Date (aRow.created)), aRow.ResultId);
});

