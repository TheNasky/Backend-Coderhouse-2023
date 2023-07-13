const socket = io();

socket.on('refresh', () => {
  location.reload();
});

document.getElementById('addProductForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const newProduct = Object.fromEntries(formData.entries());

  fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProduct),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});

function deleteProduct(productId) {
  fetch(`/api/products/${productId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


function addProductToCart(cartId,productId) {
  fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: 'POST',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
  
document.getElementById('updateProductForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const productId = formData.get('productId');
  const updatedProduct = Object.fromEntries(formData.entries());

  fetch(`/api/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedProduct),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});
