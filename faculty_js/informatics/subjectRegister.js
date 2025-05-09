document.addEventListener("DOMContentLoaded", () => {
  const addButtons = document.querySelectorAll("button");

  const courceContainer = document.getElementById("courceCheck");
  if (courceContainer) {
    const courceOptions = ["知能システム", "サイバーセキュリティ", "実世界コンピューティング"]; // 例として3コース
    courceOptions.forEach((cource) => {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "cource";
      radio.value = cource;
      label.appendChild(radio);
      label.appendChild(document.createTextNode(`${cource}コース `));
      courceContainer.appendChild(label);
    });
  }

  addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const table = button.closest("table");
      if (table) {
        const newRow = table.insertRow(table.rows.length - 1); // 最後の行を除いた位置に追加
        const cells = Array.from({ length: 6 }, () => newRow.insertCell());

        // 科目区分1〜3、科目名、単位、削除ボタンを追加
        cells[0].innerHTML = `
            <select class="subject-type1">
              <option value="common">共通教養科目</option>
              <option value="foreign">外国語科目</option>
              <option value="specialized">専門科目</option>
            </select>`;

        cells[1].innerHTML = '<select class="subject-type2"></select>';
        cells[2].innerHTML = '<select class="subject-type3"></select>';
        cells[3].innerHTML = '<input type="text" placeholder="科目名">';
        cells[4].innerHTML =
          '<input type="number" class="unit" placeholder="単位" min="0" max="10">';

        // 削除ボタン
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "削除";
        cells[5].appendChild(deleteButton);

        // 削除ボタンの動作
        deleteButton.addEventListener("click", () => {
          newRow.remove();
          countSubjects(); // 科目数を更新
          updateTotalUnits(); // 合計単位も更新
        });

        // プルダウンメニューの選択変更時に科目区分2, 3を更新
        const subjectType1 = newRow.querySelector(".subject-type1");
        subjectType1.addEventListener("change", updateSubjectTypes);

        const subjectType2 = newRow.querySelector(".subject-type2");
        subjectType2.addEventListener("change", updateSubjectType3);

        // 初期状態で科目区分2, 3を設定
        updateSubjectTypes.call(subjectType1);

        // 単位の変更時に合計単位を更新
        const unitInput = newRow.querySelector(".unit");
        unitInput.addEventListener("input", updateTotalUnits);

        // 科目数を更新
        countSubjects();
      }
    });
  });

  // 科目区分1が変更された時に科目区分2, 3を更新
  function updateSubjectTypes() {
    const subjectType1 = this.value;
    const subjectType2Select =
      this.closest("tr").querySelector(".subject-type2");
    const subjectType3Select =
      this.closest("tr").querySelector(".subject-type3");

    // 科目区分2, 3をリセット
    subjectType2Select.innerHTML = "";
    subjectType3Select.innerHTML = "";

    // 科目区分1に応じて科目区分2, 3の内容を変更
    if (subjectType1 === "common") {
      subjectType2Select.innerHTML = `
            <option value="required">必修</option>
            <option value="selected">選択</option>`;
      subjectType3Select.innerHTML = `
            <option value="null"> - </option>`;
    } else if (subjectType1 === "foreign") {
      subjectType2Select.innerHTML = `
            <option value="required">必修</option>
            <option value="selected">選択</option>
            <option value="selected_required">選択必修</option>`;
      subjectType3Select.innerHTML = `
            <option value="english">英語</option>
            <option value="others">第二言語</option>`;
    } else if (subjectType1 === "specialized") {
      subjectType2Select.innerHTML = `
            <option value="basic">基礎</option>
            <option value="specialized">専門</option>`;
      subjectType3Select.innerHTML = `
            <option value="required">必修</option>
            <option value="selected">選択</option>
            <option value="selected_required">選択必修</option>`;
    }
  }

  // 科目区分2に応じて科目区分3を変更
  function updateSubjectType3() {
    const subjectType2 = this.value;
    const subjectType3Select =
      this.closest("tr").querySelector(".subject-type3");

    // 科目区分2が「選択必修」の場合に科目区分3を「英語」に設定
    if (subjectType2 === "selected_required") {
      subjectType3Select.innerHTML = `
         <option value="english">英語</option>`;
      subjectType3Select.value = "english"; // 英語に設定
    }
  }

  // 科目数をカウントして表示
  function countSubjects() {
    for (let i = 1; i <= 8; i++) {
      const table = document.querySelector(`.semester${i}`);
      const subjectCount = table.rows.length - 2; // 最後の行を除外
      const subjectLen = document.getElementById(`total-subject${i}`);
      subjectLen.textContent = `科目数: ${subjectCount}`;
    }
  }

  // 合計単位を計算する関数
  function updateTotalUnits() {
    for (let i = 1; i <= 8; i++) {
      const table = document.querySelector(`.semester${i}`);
      const unitInputs = table.querySelectorAll(".unit");
      let sum = 0;
      unitInputs.forEach((input) => {
        sum += Number(input.value) || 0;
      });
      const totalUnitDisplay = document.getElementById(`total-unit${i}`);
      if (totalUnitDisplay) {
        if (sum <= 24) {
          totalUnitDisplay.textContent = `合計単位: ${sum}`;
          totalUnitDisplay.style.color = "black";
        } else {
          totalUnitDisplay.textContent = `合計単位: ${sum} 取りすぎでっしゃろォ...`;
          totalUnitDisplay.style.color = "red";
        }
      }
    }
  }
});
