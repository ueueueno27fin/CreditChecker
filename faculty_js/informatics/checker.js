document.addEventListener("DOMContentLoaded", () => {
  prepareSubjectData();

  document.getElementById("checkButton").addEventListener("click", () => {
    yearCreditsHandle();
    check1to2();
    check2to3();
    check3to4();
    check4toG();
  });
});

let semesterTables = [];
let yearCredits = [];
let commonCredits = [];
let basicCredits = [];

function prepareSubjectData() {
  semesterTables = []; // ← 念のため初期化

  for (let i = 1; i <= 8; i++) {
    const semesterTable = document.getElementsByClassName(`semester${i}`); // ← 修正ポイント！
    if (semesterTable) {
      semesterTables.push(semesterTable[0]);
    }
  }
}

function yearCreditsHandle() {
  yearCredits = [0, 0, 0, 0];

  semesterTables.forEach((semesterTable, index) => {
    const units = semesterTable.querySelectorAll(".unit");

    units.forEach((unit) => {
      const floatUnit = parseFloat(unit.value);
      if (!isNaN(floatUnit)) {
        console.log(`学期${index + 1}の単位: ${floatUnit}`); // デバッグ用
        const yearIndex = Math.floor(index / 2);
        yearCredits[yearIndex] += floatUnit;
      }
    });
  });

  // 年度ごとの累積合計
  for (let year = 1; year < 4; year++) {
    yearCredits[year] += yearCredits[year - 1];
  }

  // 累積単位の確認
  console.log("年度別合計単位:", yearCredits); // デバッグ用
}

//進級判定 1->2
function check1to2() {
  const divJudge = document.getElementById("judge1");
  if (yearCredits[0] >= 24) {
    divJudge.innerHTML = "判定:進級";
    divJudge.style.color = "green";
  } else {
    divJudge.innerHTML = `判定:留年　　【！】${
      24 - yearCredits[0]
    }単位足りません！！`;
    divJudge.style.color = "red";
  }
}

//進級判定 2->3
function check2to3() {
  const divJudge = document.getElementById("judge2");
  if (yearCredits[1] >= 58) {
    divJudge.innerHTML = "判定:進級";
    divJudge.style.color = "green";
  } else {
    divJudge.innerHTML = `判定:留年　　【！】${
      58 - yearCredits[1]
    }単位足りません！！`;
    divJudge.style.color = "red";
  }
}

//進級判定 3->4
function check3to4() {
  const commonShortage       = checkCommon3to4();       
  const basicShortage        = checkBasic3to4();         
  const foreignShortage      = checkForeign3to4();     
  const specializedResults   = checkSpecialized3to4(); 

  const specializedShortage = specializedResults[specializedResults.length - 1];
  specializedResults.splice(specializedResults.length - 1, 1); // 不足単位を取り出して、残りは科目名だけに

  const divJudge = document.getElementById("judge3");

  if (
    commonShortage <= 0 &&
    basicShortage <= 0 &&
    foreignShortage <= 0 &&
    specializedShortage <= 0 &&
    specializedResults.length === 0
  ) {
    divJudge.innerHTML = "判定:進級";
    divJudge.style.color = "green";
  } else {
    let errorMsg = "判定:留年<br>";
    divJudge.style.color = "red";
    if (commonShortage > 0) {
      errorMsg += `【！】共通教養科目が${commonShortage}単位<br>`;
    }
    if (foreignShortage > 0) {
      errorMsg += `【！】外国語科目が${foreignShortage}単位<br>`;
    }
    if (basicShortage > 0) {
      errorMsg += `【！】基礎科目が${basicShortage}単位<br>`;
    }
    if (specializedShortage > 0) {
      errorMsg += `【！】専門科目が${specializedShortage}単位<br>`;
    }
    if (specializedResults.length > 0) {
      errorMsg += `【！】未取得の必修専門科目:<br>`;
      specializedResults.forEach((subject) => {
        errorMsg += `・${subject}<br>`;
      });
    }
    errorMsg += "が足りません！！";
    divJudge.innerHTML = errorMsg;
  }
}



//卒業判定
function check4toG() {
  const divJudge = document.getElementById("judge4");
}

//3回生までの単位計算
function prepareUntil3rd() {
  const creditsUntil3rd = {
    common: 0,
    basic: 0,
    foreign: 0,
    specialized: 0,
  };

  semesterTables.forEach((table, index) => {
    if (index < 6) {
      const rows = table.querySelectorAll("tr");
      if (rows) {
        rows.forEach((row) => {
          const subjectType1 = row.querySelectorAll("subject-type1").value;
        });
      }
    } else {
      return;
    }
  });
}

//共通教養科目進級要件確認
function checkCommon3to4() {
  const checkNum = 12;
  let sum = 0;

  semesterTables.forEach((table) => {
    const rows = table.querySelectorAll("tr");
    rows.forEach((row) => {
      const type1 = row.querySelector(".subject-type1")?.value;
      if (type1 === "common") {
        const unit = Number(row.querySelector(".unit")?.value || 0);
        sum += unit;
      }
    });
  });

  return checkNum - sum;
}

//外国語科目進級要件確認
function checkForeign3to4() {
  const checkNum = 12;
  let sum = 0;

  semesterTables.forEach((table) => {
    const rows = table.querySelectorAll("tr");
    rows.forEach((row) => {
      const type1 = row.querySelector(".subject-type1")?.value;
      if (type1 === "foreign") {
        const unit = Number(row.querySelector(".unit")?.value || 0);
        sum += unit;
      }
    });
  });

  return checkNum - sum;
}

// 基礎科目進級要件確認
function checkBasic3to4() {
  const checkNum = 10;
  let sum = 0;

  semesterTables.forEach((table) => {
    const rows = table.querySelectorAll("tr");
    rows.forEach((row) => {
      const type1 = row.querySelector(".subject-type1")?.value;
      const type2 = row.querySelector(".subject-type2")?.value;
      if (type1 === "specialized" && type2 === "basic") {
        const unit = Number(row.querySelector(".unit")?.value || 0);
        sum += unit;
      }
    });
  });

  return checkNum - sum;
}

// 専門科目進級要件確認
function checkSpecialized3to4() {
  const selected = document.querySelector('input[name="cource"]:checked');
  const courseValue = selected ? selected.value : "各コース(上の方で選択してください)";
  const checkNum = 68;
  let sum = 0;

  let checkSubject = [
    "プログラミング基礎1",
    "プログラミング基礎2",
    "プログラミング実習1",
    "プログラミング実習2",
    "情報学基礎ゼミナール1",
    "情報学基礎ゼミナール2",
    "情報学応用ゼミナール1",
    "情報学応用ゼミナール2",
    courseValue + "プロジェクト1",
    courseValue + "プロジェクト2",
  ];

  semesterTables.forEach((table) => {
    const rows = table.querySelectorAll("tr");
    rows.forEach((row) => {
      const type1 = row.querySelector(".subject-type1")?.value;
      const type2 = row.querySelector(".subject-type2")?.value;
      if (type1 === "specialized" && type2 === "specialized") {
        const name = row.querySelector("input[type='text']")?.value || "";
        const unit = Number(row.querySelector(".unit")?.value || 0);
        sum += unit;

        const index = checkSubject.indexOf(name);
        if (index !== -1) {
          checkSubject.splice(index, 1); // 必修を取得済みに
        }
      }
    });
  });

  const result = [...checkSubject]; // 未取得の必修科目（なければ空）
  result.push(checkNum - sum); // 最後に不足単位数を入れる

  return result;
}

