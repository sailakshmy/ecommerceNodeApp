const deleteProduct = (btn) => {
  console.log("Clicked the delete button", btn);
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  console.log("pare", productId);
  const csrfToken = btn.parentNode.querySelector("[name=_csrf").value;
};
