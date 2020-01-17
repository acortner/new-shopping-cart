import React, { useEffect, useState } from 'react';
import "rbx/index.css";
import { Button, Container, Message, Title, Card } from "rbx";

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  return (
    <div class="card_container">
      {products.map(product => <Card key={product.sku}><img src={"./data/products/" + product.sku + "_1.jpg"}/>
        <h3 id="title">{product.title}</h3>
        <p id="description">{product.description}</p>
        <h2 id="price">{"$" + product.price.toFixed(2)}</h2>
        <div class="sizes">
          <Button>S</Button>
          <Button>M</Button>
          <Button>L</Button>
          <Button>XL</Button>
        </div></Card>)}
    </div>
  );
};

export default App;
