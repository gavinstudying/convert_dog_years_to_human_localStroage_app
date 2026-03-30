const ageForm = document.getElementById("ageForm");
const birthdateInput = document.getElementById("birthdate");
const result = document.getElementById("result");
const clearBtn = document.getElementById("clearBtn");

// 網頁載入時，自動讀取上次查詢結果
window.addEventListener("load", function () {
  const savedData = localStorage.getItem("dogAgeRecord");

  if (savedData) {
    const data = JSON.parse(savedData);

    birthdateInput.value = data.birthdate;
    result.innerHTML = `
      <p>小狗的實際年齡：${data.dogAge} 歲</p>
      <p>換算成人類年齡：${data.humanAge} 歲</p>
    `;
  }
});

// 按下換算按鈕
ageForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const birthdateValue = birthdateInput.value;

  if (!birthdateValue) {
    result.innerHTML = `
      <p>請先選擇小狗的生日。</p>
    `;
    return;
  }

  const birthDate = new Date(birthdateValue);
  const today = new Date();

  if (birthDate > today) {
    result.innerHTML = `
      <p>生日不可晚於今天，請重新選擇。</p>
    `;
    return;
  }

  const dogAge = calculateDogAge(birthDate, today);

  if (dogAge <= 0) {
    result.innerHTML = `
      <p>小狗的實際年齡需大於 0，才能進行換算。</p>
    `;
    return;
  }

  const humanAge = 16 * Math.log(dogAge) + 31;

  const dogAgeText = dogAge.toFixed(2);
  const humanAgeText = humanAge.toFixed(2);

  result.innerHTML = `
    <p>小狗的實際年齡：${dogAgeText} 歲</p>
    <p>換算成人類年齡：${humanAgeText} 歲</p>
  `;

  const record = {
    birthdate: birthdateValue,
    dogAge: dogAgeText,
    humanAge: humanAgeText
  };

  localStorage.setItem("dogAgeRecord", JSON.stringify(record));
});

// 按下清除紀錄按鈕
clearBtn.addEventListener("click", function () {
  localStorage.removeItem("dogAgeRecord");
  birthdateInput.value = "";

  result.innerHTML = `
    <p>小狗的實際年齡：-- 歲</p>
    <p>換算成人類年齡：-- 歲</p>
  `;
});

function calculateDogAge(birthDate, today) {
  const diffTime = today - birthDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const dogAgeYears = diffDays / 365.25;
  return dogAgeYears;
}