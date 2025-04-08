function prepareSubjectData() {
  // 各セメスターのテーブルを取得
  const semesterTables = [];

  for(var i = 1; i <=8; i++){
    const semesterTable = document.getElementById(`semester${id}`);
    if(semesterTable){
      semesterTables.push(semesterTable);
    }
  }
}

function yearCredits(){
  
}
