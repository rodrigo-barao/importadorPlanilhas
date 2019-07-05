var mdb  = require('mdb');
var base = mdb('../files/Cond21.mdb');

console.log(base.tables);

base.tables(function(err, tables) {
    console.log(err);
    console.log(tables);
  tables.forEach(function(table) {
    base.toCSV(table, function(err, csv) {
      console.log(err, table, csv.split('\n').length - 1 + " lines")
    })
  })
})

// mdb-tables -d ',' Cond21.mdb| xargs -L1 -d',' -I{} bash -c 'mdb-export Cond21.mdb "$1" >"$1".csv' -- {}