const Dropdown = document.getElementById('filtersSelect');
const Menu = document.getElementById('customFilter');

function logic(){
  if (Dropdown.value === "custom") {
    Menu.classList.remove('hidden');
  } else {
    Menu.classList.add('hidden');
  }
}

Dropdown.addEventListener("change", () => {
  logic();
});

logic();