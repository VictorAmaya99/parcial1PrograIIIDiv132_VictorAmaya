fetch('https://dummyjson.com/products/categories')
  .then(res => res.json())
  .then(categories => console.log(categories))
  .catch(err => console.error(err));