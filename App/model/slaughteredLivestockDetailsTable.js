import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('PRICELocal.db');
module.exports. createSlaughteredTable = function  createSlaughteredTable (){
 
db.transaction(tx => {
    tx.executeSql(
      'create table if not exists SlaughteredLivestockDetails (id integer primary key not null, LivestockTag text, SlaughterDate text, LiveWeight real, TotalMeatWeight real, TotalNumberOfMeatPackages integer, MeatPackageWeight real, SynchronizeStatus text,Latitude text,Longitude text,Altitude text,ProjectCode text,TransactionTimestamp text,VillageName text);',[],(tx, results) => { console.log ('\n from slaughteredLivestockTable.createSlaughteredTable: results: \n',results)
          // tx.executeSql('insert into SlaughteredLivestockDetails (LivestockTag, SlaughterDate, LiveWeight, TotalMeatWeight, TotalNumberOfMeatPackages, MeatPackageWeight,SynchronizeStatus,Latitude,Longitude,Altitude,ProjectCode,TransactionTimestamp,VillageName  ) values (?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)', ['HFL999', '2011-01-01','999','999','999','999','do not sync','999','999','999','PRICE','2011-01-01','Mehrabpur'],
          // (tx, results) => { console.log ('\n from slaughteredLivestockTable.createSlaughteredTable: insert results: \n',results)},
          // (t,error)=> {console.log('\n from slaughteredLivestockTable.createSlaughteredTable insert Db4 error: ',error)})
    
    },
      (t,error)=> {console.log('\n from slaughteredLivestockTable.createSlaughteredTable Db3 error: ',error)}
    );
  })


  // React.useEffect(() => {
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       "create table if not exists items (id integer primary key not null, done int, value text);"
  //     );
  //   });
  // }, []);
  console.log('\n from slaughteredLivestockDetailsTable table has been created')
} // end of create table

module.exports. createMeatPackageDistributionTable = function  createMeatPackageDistributionTable(){
db.transaction(tx => {
  tx.executeSql(
          'create table if not exists MeatPackageDistribution (id integer primary key not null, VillageName text, HouseHold int, LivestockTag text, PackageNumber int, DateMeatFrozen text, PackageHandedoverDate text, Latitude text, Longitude text, Altitude text, ProjectCode text, SynchronizeStatus text );',[],(tx, results) => {  },(t,error)=> {console.log('Db0 MeatPackageDistribution table creation error: ',error);}
            );
          });
        } // end of createMeatPackageDistributionTable
module.exports. dropSlaughteredTable = function  dropSlaughteredTable(){
 
db.transaction(tx => {
    tx.executeSql(
      'DROP TABLE SlaughteredLivestockDetails;', [],
      (tx, results) => {  console.log('table SlaughteredLivestockDetails dropped result: \n',results)},
      (tx, error) => {console.log(error);}
    )
  });
}// end of drop table
module.exports. dropTable = function  dropTable(table){
 
  console.log(`\n from SlaughteredLivestockDetails.droptable table name ${table} `),
  db.transaction(tx => {
      tx.executeSql(
        `DROP TABLE ${table};`, [],
        (tx, results) => {  console.log(`\n from SlaughteredLivestockDetails.droptable dropped table ${table} result: ${results}`)},
        (tx, error) => {console.log(error);}
      )
    });
  }// end of drop table
 

module.exports.alterSlaughteredTable = function  alterSlaughteredTable(){
 ////////////////////////////// SQLite does not allow multiple columns addition in one ALTER statement /////
 db.transaction(tx => {
 let columAlter= ['Latitude text','Longitude text','Altitude text','ProjectCode text','TransactionTimestamp text']
 for (const element of columAlter) {
     console.log(`ALTER TABLE SlaughteredLivestockDetails ADD COLUMN ${element}  ,;`)
 
        tx.executeSql(
            `ALTER TABLE SlaughteredLivestockDetails ADD COLUMN ${element};` , [],
              (tx, results) => {
            if (results && results.rows && results.rows._array) {
              /* do something with the items */
              // results.rows._array holds all the results.
              console.log(JSON.stringify(results.rows._array));
              console.log('table altered')
            } else {
              console.log('no results')
            }
          },
          (tx, error) => {
            console.log(error);
          }
        )
    }
      });
    }// end of Alter table

    module.exports.ListRows = function  ListRows(table){
 
    db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM ${table} ;`, [],
          (tx, results) => {
            if (results && results.rows && results.rows._array) {
              /* do something with the items */
              // results.rows._array holds all the results.
            //   console.log(JSON.stringify(results.rows._array));
              console.log(`\nall rows from table ${table}: \n`,results.rows._array);
              
            } else {
              console.log('no results')
            }
          },
          (tx, error) => {
            console.log(error);
          }
        )
      });
    }// end of ListRows
    module.exports.selectAllSlaughteredTable = function  selectAllSlaughteredTable(){
 
    db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM SlaughteredLivestockDetails ;', [],
          (tx, results) => {
            if (results && results.rows && results.rows._array) {
              /* do something with the items */
              // results.rows._array holds all the results.
            //   console.log(JSON.stringify(results.rows._array));
              console.log('\nall rows from table SlaughteredLivestockDetails: \n',results.rows._array);
            //   console.log('table altered')
            } else {
              console.log('no results')
            }
          },
          (tx, error) => {
            console.log(error);
          }
        )
      });
    }// end of list all record table
    module.exports.DeleteRows = function  DeleteRows(table){
 
        db.transaction(tx => {
            tx.executeSql(
              `DELETE FROM ${table} ;`, [],
              (tx, results) => { console.log('Delete result \n',results) },
              (tx, error) => {
                console.log(error);
              }
            )
          });
        }// end of DELETE all record table



        module.exports.selectAllMeatPackageDistribution = function  selectAllMeatPackageDistribution(){
 
            db.transaction(tx => {
                tx.executeSql(
                  'SELECT * FROM MeatPackageDistribution ;', [],
                  (tx, results) => {
                    if (results && results.rows && results.rows._array) {
                      /* do something with the items */
                      // results.rows._array holds all the results.
                    //   console.log(JSON.stringify(results.rows._array));
                      console.log('\nall rows from table MeatPackageDistribution: \n',results.rows._array);
                    //   console.log('table altered')
                    } else {
                      console.log('no results')
                    }
                  },
                  (tx, error) => {
                    console.log(error);
                  }
                )
              });
            }// end of list all record from MeatPackageDistribution table
            
    module.exports.selectAllLivestockPictures = function  selectAllLivestockPictures(){

      db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM LivestockPicture ;', [],
            (tx, results) => {
              console.log('\nresults from table LivestockPicture: \n',results);
              if (results && results.rows && results.rows._array) {
                /* do something with the items */
                // results.rows._array holds all the results.
              //   console.log(JSON.stringify(results.rows._array));
                console.log('\nall rows from table LivestockPicture: \n',results.rows._array);
              //   console.log('table altered')
              } else {
                console.log('no results')
              }
            },
            (tx, error) => {
              console.log(error);
            }
          )
        });
      }// end of list all record table: LivestockPicture


      module.exports. createMTEHouseholdTable = function  createMTEHouseholdTable (){
 
        db.transaction(tx => {
            tx.executeSql(
              'create table if not exists mTEHousehold (id integer primary key not null, LivestockTag text, pictureHeight integer, pictureWidth integer, pictureDate text, picture blob,SynchronizeStatus text,Latitude text, Longitude text, Altitude text,Household integer,ProjectCode text,DonorId integer,Remarks text,PackageNumber integer, TransactionTimestamp text, VillageName text);',[],(tx, results) => { console.log ('\n from slaughteredLivestockTable.createMTEHouseholdTable: results: \n',results)                 
              },
              (t,error)=> {console.log('\n from slaughteredLivestockTable.createMTEHouseholdTable Db3 error: ',error)}
            );
          })
        
        
          // React.useEffect(() => {
          //   db.transaction(tx => {
          //     tx.executeSql(
          //       "create table if not exists items (id integer primary key not null, done int, value text);"
          //     );
          //   });
          // }, []);
          console.log('\n from slaughteredLivestockDetailsTable mTEHousehold table has been created')
        } // end of create mTEHousehold table