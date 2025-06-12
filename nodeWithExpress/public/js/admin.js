const deleteProduct = (btn) => {
  console.log("Clicked the delete button", btn);
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  console.log("pare", productId);
  const csrfToken = btn.parentNode.querySelector("[name=_csrf").value;
  fetch(`/admin/product/${productId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrfToken,
    },
  })
    .then((res) => {
      console.log("res of fetch request", res);
    })
    .catch((e) => {
      console.log(
        "error while sending fetch request with product Id and csrf token to delete product",
        e
      );
    });
};
