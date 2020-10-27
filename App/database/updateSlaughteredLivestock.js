import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('PRICELocal.db'); 


const UPDATE_NULL_PROCURE_LIVESTOCK_DETAILS_SQL= `UPDATE Livestock
set SynchronizeStatus = ? where LivestockTag =? AND SynchronizeStatus is null `
module.exports.UpdateProcureLivestock = async function UpdateProcureLivestock(data){
  console.log ('\n\n trace from data syncronize.UpdateProcureLivestock from response \n',data)
for (const element of data) {
  
    // console.log ('\n\n from syncronize.UpdateProcureLivestock errorMessages from response \n',element.errorMessages[0].errorMessage)
    console.log ('\n trace from syncronize.UpdateProcureLivestock: livestockTag from server response \n',element.result.livestockTag)
   
    // if (element.errorMessages[0].errorMessage === 'The livestock slaughter data already exist'){
    if (typeof element.result.livestockTag !== "undefined"){
        LTag= element.result.livestockTag
        try {
            const result = await new Promise((resolve, reject) =>{
                db.transaction(tx => { tx.executeSql(UPDATE_NULL_PROCURE_LIVESTOCK_DETAILS_SQL, ["Synchronized",LTag],
                    (tx,results)=>{resolve(results)},
                    (tx,error) =>{reject(error)}
                        
                    )})});
                    const  {rows:{_array}, rows:{length}}=result
                    console.log('result from Livestock tables on phone: \n',result)
            }catch(err) { console.log('Synchronize: error updating Livestock table: '+ err) }
        
     } // END OF The livestock procure data already exist
    
};// end of for of loop

}// endof UpdateProcureLivestock



const UPDATE_NULL_SLAUGHTERED_LIVESTOCK_DETAILS_SQL= `UPDATE SlaughteredLivestockDetails
set SynchronizeStatus = ? where LivestockTag =? AND SynchronizeStatus is null `
module.exports.UpdateSlaughteredLivestock = async function UpdateSlaughteredLivestock(data){
  console.log ('\n\n trace from data syncronize.UpdateSlaughteredLivestock from response \n',data)
for (const element of data) {
  
    // console.log ('\n\n from UpdateSlaughteredLivestock errorMessages from response \n',element.errorMessages[0].errorMessage)
    console.log ('\n livestockTag from response \n',element.result.livestockTag)
   
    // if (element.errorMessages[0].errorMessage === 'The livestock slaughter data already exist'){
    if (typeof element.result.livestockTag !== "undefined"){
        LTag= element.result.livestockTag
        try {
            const result = await new Promise((resolve, reject) =>{
                db.transaction(tx => { tx.executeSql(UPDATE_NULL_SLAUGHTERED_LIVESTOCK_DETAILS_SQL, ["Synchronized",LTag],
                    (tx,results)=>{resolve(results)},
                    (tx,error) =>{reject(error)}
                        
                    )})});
                    const  {rows:{_array}, rows:{length}}=result
                    console.log('result from updateSlaughteredLivestock tables on phone: \n',result)
            }catch(err) { console.log('Synchronize: error updating SlaughteredLivestockDetails table: '+ err) }
        
     } // END OF The livestock slaughter data already exist
    
};// end of for of loop

}// endof UpdateSlaughteredLivestock

const UPDATE_NULL_MEAT_PACKAGE_SQL= `UPDATE MeatPackageDistribution
set SynchronizeStatus = ? where LivestockTag =? AND PackageNumber = ? AND SynchronizeStatus is null `
module.exports.UpdateMeatPackageDistribution = async function UpdateMeatPackageDistribution(data){
  console.log ('\nfrom UpdateMeatPackageDistribution: data from server response \n',data)
for (const element of data) {
  
    // console.log ('\n\n from UpdateSlaughteredLivestock errorMessages from response \n',element.errorMessages[0].errorMessage)
    console.log ('\n livestockTag from response \n',element.result.livestockTag)
   
    // if (element.errorMessages[0].errorMessage === 'The livestock slaughter data already exist'){
    if (typeof element.result.livestockTag !== "undefined"){
        LTag= element.result.livestockTag
        LPNo=element.PackageNumber
        try {
            const result = await new Promise((resolve, reject) =>{
                db.transaction(tx => { tx.executeSql(UPDATE_NULL_MEAT_PACKAGE_SQL, ["Synchronized",LTag,LPNo],
                    (tx,results)=>{resolve(results)},
                    (tx,error) =>{reject(error)}
                        
                    )})});
                    const  {rows:{_array}, rows:{length}}=result
                    console.log('result from MeatPackageDistribution tables on phone: \n',result)
            }catch(err) { console.log('Synchronize: error updating MeatPackageDistribution table: '+ err) }
        
     } // END OF The livestock slaughter data already exist
    
};// end of for of loop



}// endof UpdateMeatPackageDistribution