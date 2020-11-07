import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('PRICELocal.db');

export const createTable_livestockDailyWeightGain= ()=>{
    db.transaction(tx => {tx.executeSql(
      'create table if not exists livestockDailyWeightGain(id integer primary key not null,WeightDate text,ContractName  text, ContractId  integer, FeedlotName  text, FeedLotId integer, LivestockTag1  text, LivestockWeight1  real, LivestockTag2  text, LivestockWeight2  real, LivestockTag3  text, LivestockWeight3  real, LivestockTag4  text, LivestockWeight4  real, LivestockTag5  text, LivestockWeight5  real, Latitude  real, Longitude  real, Altitude  real, TransactionTimestamp text, Household  integer, ProjectCode  text, Remarks  text,VillageName  text, SynchronizeStatus text)',[],(tx, results) => { /*console.log ('\n from CRUD.createTable_livestockDailyWeightGain: results: \n',results)*/},
      (t,error)=> {console.log('\n from CRUD.createTable_livestockDailyWeightGain: results: Db3 error: ',error)}
    );
    
   



  });

} // end of create table
export const createTable= async (table,fields)=>{
    const CREATE_SQL= `create table if not exists ${table} (${fields})`
    // console.log('\n trace from CRUD.createTable: CREATE_SQL: \n',CREATE_SQL)
    try {
            const result = await new Promise((resolve, reject) =>{
                db.transaction(tx => { tx.executeSql(CREATE_SQL, [],
                    (tx,results)=>{
                        /*console.log ('\n trace from CRUD.createTable: CREATE_SQL:results: \n',results); */
                         resolve(results.rowsAffected)},
                    (tx,error) =>{reject(error)}
                        
                    )})});
                    // resolve
                    // const  {rows:{_array}, rows:{length}}=result
                    // console.log(`\n \n result from  CRUD.createTable: table name:${table} \n, result: ${result}`)
     }catch(err) { console.log(`\n \n Error: from  CRUD.createTable: table name:${table} \n, ${err}`) }

} // end of create table

export const readTable= async (table)=>{    
    try {
        const TABLE_ROWS = await new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql( `SELECT * FROM ${table} ;`, [],
                (tx_1, results) => {
                    if (results && results.rows && results.rows._array) { /*console.log(`\nall rows from table ${table}: \n`,results.rows._array);*/
                        resolve(results.rows._array);
                    } else { console.log('no results'); }
                },
                function (tx_2, error) {
                    console.log(error);
                    reject(error);
                }
            );
        }));
        // Resolve
            // console.log('\n mpqqqqqqqqq',TABLE_ROWS)
            return TABLE_ROWS
            // return [...TABLE_ROWS]
       
    }catch(err) { console.log(`\n \n Error: from  CRUD.readTable: table name:${table} \n, ${err}`) }

} // end of create table


export const insertRow= async (table,fields,values,data)=>{    
    const query_SQL= `'insert into ${table}(${fields}) values ( ${values})'`
    console.log('\n trace from CRUD.insertRow: query_SQL:\n', query_SQL)
    try {
        const INSERT_ROWS = await new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(query_SQL,[data],
                (tx_1, results) => {console.log ('results after Feedlot insert: ', results)
                        resolve(results);
                 },
                function (tx_2, error) {
                    console.log(error);
                    reject(error);
                }
            );
        }));
    //     // Resolve
    //         // console.log('\n mpqqqqqqqqq',query_SQL)
            return 
       
    }catch(err) { console.log(`\n \n Error: from  CRUD.insertRow: table name:${table} \n, ${err}`) }

} // end of insertRow