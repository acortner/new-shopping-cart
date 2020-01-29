import React, { useEffect, useState } from 'react';
import "rbx/index.css";
import { Button, Card } from "rbx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { Navbar } from 'react-bootstrap'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCL6NAT4aKpTx9kRkl1GjDHonMNKctrBPs",
  authDomain: "shopping-cart-app-d9ce7.firebaseapp.com",
  databaseURL: "https://shopping-cart-app-d9ce7.firebaseio.com",
  projectId: "shopping-cart-app-d9ce7",
  storageBucket: "shopping-cart-app-d9ce7.appspot.com",
  messagingSenderId: "970456502678",
  appId: "1:970456502678:web:b2f983275db42704d30db7"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

function openCart() {
  document.getElementById("cart-tab").style.width = "30%";
}

function closeCart() {
  document.getElementById("cart-tab").style.width = "0%";
}

const App = () => {
  const [data, setData] = useState({});
  const [cartData, setCartData] = useState([]);
  const [inventory, setInventory] = useState({});
  const products = Object.values(data);
  useEffect(() => {
    const handleData = async snap => {
      if (snap.val()) {
        setInventory(snap.val());
      } 
      const product_response = await fetch('./data/products.json');
      const product_json = await product_response.json();
      setData(product_json);
    }
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, []);
  return (
    <div>
      <Navbar>
        <h1 class="header">Amazon... but better</h1>
        <Button class="cart_button" onClick={openCart}><FontAwesomeIcon icon={faShoppingCart} id="shopping_cart_icon"/></Button>
        <Cart setCartData={setCartData} items={cartData} inventory={inventory} setInventory={setInventory}/>
      </Navbar>
      <div class="card_container">
        {products.map(product => <ItemCard product={product} cartData={cartData} setCartData={setCartData} inventory={inventory} setInventory={setInventory}/>)}
      </div>
    </div>
  );
};

const ItemCard = ({product, cartData, setCartData, inventory, setInventory}) => {
  const [itemSize, setItemSize] = useState("");
  return (
    <Card class="product_card" key={product.sku}><img src={"./data/products/" + product.sku + "_1.jpg"} alt="product image"/>
      <h3 id="title">{product.title}</h3>
      <p id="description">{product.description}</p>
      <h2 id="price">{"$" + product.price.toFixed(2)}</h2>
      {inventory[product.sku].S || inventory[product.sku].M || inventory[product.sku].L || inventory[product.sku].XL ?
      <div class="sizes">
        {inventory[product.sku].S ? <SelectSize availabile="True" setItemSize={setItemSize} selectedSize={itemSize} size="S"/> : <SelectSize available="False" setItemSize={setItemSize} selectedSize={itemSize} size="S"/>}
        {inventory[product.sku].M ? <SelectSize availabile="True" setItemSize={setItemSize} selectedSize={itemSize} size="M"/> : <SelectSize available="False" setItemSize={setItemSize} selectedSize={itemSize} size="M"/>}
        {inventory[product.sku].L ? <SelectSize availabile="True" setItemSize={setItemSize} selectedSize={itemSize} size="L"/> : <SelectSize available="False" setItemSize={setItemSize} selectedSize={itemSize} size="L"/>}
        {inventory[product.sku].XL ? <SelectSize availabile="True" setItemSize={setItemSize} selectedSize={itemSize} size="XL"/> : <SelectSize available="False" setItemSize={setItemSize} selectedSize={itemSize} size="XL"/>}
      </div> :
      <h2 id="oos">OUT OF STOCK</h2>
      }
      <AddToCart setCartData={setCartData} item={product} size={itemSize} cartData={cartData} inventory={inventory} setInventory={setInventory}/>
    </Card>
  );
}

const SelectSize = ({available, setItemSize, selectedSize, size}) => {
  const buttonType = () => {
    if (available === "False") {
      return <Button class="button unavailable">{size}</Button>;
    } else if (selectedSize === size) {
      return <Button class="button selected-size" onClick={() => setItemSize(size)}>{size}</Button>;
    } else {
      return <Button class="button" onClick={() => setItemSize(size)}>{size}</Button>;
    }
  }
  return (
    buttonType()
  );
}

const AddToCart = ({setCartData, item, size, cartData, inventory, setInventory}) => {
  const [num, setNum] = useState(0);
  const updateCart = () => {
    for (var i = 0; i < cartData.length; i++) {
      if (cartData[i].it === item && cartData[i].sz === size) {
        setCartData(cartData.map(i => i.it === item && i.sz === size ? {n: i.n, it: i.it, sz: i.sz, qt: i.qt+1} : {n: i.n, it: i.it, sz: i.sz, qt: i.qt}));
        setInventory({...inventory, [item.sku]: {...inventory[item.sku], [size]: inventory[item.sku][size]-1}});
        return;
      }
    }
    setCartData([...cartData, {n: num, it: item, sz: size, qt: 1}]);
    setInventory({...inventory, [item.sku]: {...inventory[item.sku], [size]: inventory[item.sku][size]-1}});
    setNum(num => num + 1);
  }
  return (
    <Button class="addtocart" onClick={size ? () => {updateCart(); openCart();} : () => {alert("Please select a size.")}}>Add to Cart</Button>
  );
}

const Cart = ({setCartData, items, inventory, setInventory}) => {
  const getSubtotal = () => {
    var subtotal = 0;
    for (var i = 0; i < items.length; i++) {
      subtotal += items[i].it.price * items[i].qt;
    }
    return subtotal;
  }
  return (
    <div>
      <div id="cart-tab" class="overlay">
        <div class="overlay-content"></div>
          <div class="cart_header">
            <Button class="closebtn" onClick={closeCart}>&times;</Button>
            <FontAwesomeIcon icon={faShoppingCart} class="cart_logo" id="shopping_cart_icon"/>
          </div>
          <div class="cart_contents">
            {items.map(item => <Card class="cart_card">
              <img src={"./data/products/" + item.it.sku + "_1.jpg"} alt=""/>
              <Button class="deletebtn" onClick={() => {setCartData(items.filter(i => item !== i)); setInventory({...inventory, [item.it.sku]: {...inventory[item.it.sku], [item.sz]: inventory[item.it.sku][item.sz]+item.qt}});}}>&times;</Button>
              <div class="info">
                <h2 id="cart_title">{item.it.title}</h2>
                <h2 id="cart_price">{"$" + item.it.price.toFixed(2)}</h2>
                <h2 id="cart_size">{"Size: " + item.sz}</h2>
                <div>
                  <h2>{"Quantity: " + item.qt}</h2>
                  {item.qt > 1 ? <Button class="qtybtn" onClick={() => {setInventory({...inventory, [item.it.sku]: {...inventory[item.it.sku], [item.sz]: inventory[item.it.sku][item.sz]+1}});setCartData(items.map(i => i.n === item.n && i.it === item.it ? {n: i.n, it: i.it, sz: i.sz, qt: i.qt-1} : {n: i.n, it: i.it, sz: i.sz, qt: i.qt}))}}>-</Button> : <Button class="qtybtn inactive">-</Button>}
                  {inventory[item.it.sku][item.sz] > 0 ? <Button class="qtybtn" onClick={() => {setInventory({...inventory, [item.it.sku]: {...inventory[item.it.sku], [item.sz]: inventory[item.it.sku][item.sz]-1}});setCartData(items.map(i => i.n === item.n && i.it === item.it? {n: i.n, it: i.it, sz: i.sz, qt: i.qt+1} : {n: i.n, it: i.it, sz: i.sz, qt: i.qt}))}}>+</Button> : <Button class="qtybtn inactive">+</Button>}
                </div>
              </div>
            </Card>)}
          </div>
          <div class="checkout">
            <h1 id="subtotal">SUBTOTAL</h1>
            <h1 id="subtotal_price">{"$" + getSubtotal().toFixed(2)}</h1>
            <Button id="chkoutbtn">CHECKOUT</Button>
          </div>
        </div>
      </div>
  );
}

export default App;