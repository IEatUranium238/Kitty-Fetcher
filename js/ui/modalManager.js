export const modalBody = document.getElementById("modalBody");
export const closeModal = document.getElementById("closeModal");
export const openModal = document.getElementById("openModal");

openModal.addEventListener('click', () => {
  modalBody.classList.remove('hidden');
  document.body.classList.add('no-scroll');
});

closeModal.addEventListener('click', () => {
  modalBody.classList.add('hidden');
  document.body.classList.remove('no-scroll');
});
