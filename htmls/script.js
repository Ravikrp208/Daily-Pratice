// ===============================
// GET HTML ELEMENTS
// ===============================

const form = document.getElementById("registrationForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const ageInput = document.getElementById("age");

const aboutInput = document.getElementById("about");

const passwordEye = document.getElementById("passwordEye");

const confirmEye = document.getElementById("confirmEye");

const profileInput = document.getElementById("profile");

// Preview elements

const previewImage = document.getElementById("previewImage");

const previewName = document.getElementById("previewName");

const showName = document.getElementById("showName");

const showEmail = document.getElementById("showEmail");

const showAge = document.getElementById("showAge");

const showGender = document.getElementById("showGender");

const showSkills = document.getElementById("showSkills");

const showAbout = document.getElementById("showAbout");

// ===============================
// PASSWORD SHOW / HIDE
// ===============================

passwordEye.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";

    passwordEye.innerText = "🙈";
  } else {
    passwordInput.type = "password";

    passwordEye.innerText = "👁";
  }
});

confirmEye.addEventListener("click", function () {
  if (confirmPasswordInput.type === "password") {
    confirmPasswordInput.type = "text";

    confirmEye.innerText = "🙈";
  } else {
    confirmPasswordInput.type = "password";

    confirmEye.innerText = "👁";
  }
});

// ===============================
// PROFILE IMAGE PREVIEW
// ===============================

profileInput.addEventListener("change", function () {
  const file = profileInput.files[0];

  if (file) {
    const imageURL = URL.createObjectURL(file);

    previewImage.src = imageURL;
  }
});

// ===============================
// FORM SUBMIT
// ===============================

form.addEventListener("submit", function (event) {
  // Prevent page refresh
  event.preventDefault();

  // ===========================
  // PASSWORD VALIDATION
  // ===========================

  if (passwordInput.value !== confirmPasswordInput.value) {
    alert("Passwords do not match!");

    return;
  }

  // ===========================
  // GET GENDER
  // ===========================

  const gender = document.querySelector('input[name="gender"]:checked');

  // ===========================
  // GET SKILLS
  // ===========================

  const skills = document.querySelectorAll(".skill:checked");

  const selectedSkills = [];

  skills.forEach(function (skill) {
    selectedSkills.push(skill.value);
  });

  // ===========================
  // UPDATE PREVIEW
  // ===========================

  previewName.innerText = nameInput.value;

  showName.innerText = nameInput.value;

  showEmail.innerText = emailInput.value;

  showAge.innerText = ageInput.value;

  showGender.innerText = gender ? gender.value : "-";

  showSkills.innerText =
    selectedSkills.length > 0
      ? selectedSkills.join(", ")
      : "No skills selected";

  showAbout.innerText = aboutInput.value || "No information";

  // ===========================
  // SUCCESS MESSAGE
  // ===========================

  alert("Registration Successful! 🎉");
});
