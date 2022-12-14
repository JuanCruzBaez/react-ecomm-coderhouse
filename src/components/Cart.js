import { collection, serverTimestamp, doc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { useContext } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CartContext } from "./CartContext";
import { DetailContainer, ImageDetail, ImgContainer, InfoContainer, Title, WrapperDetail, Desc, Price, Qty } from "./styledComponents";

const Cart = () => {
    
    const context = useContext(CartContext);

    const createOrder = () => {
        let itemsForDB = context.cartList.map(item => ({
            id: item.id,
            title: item.name,
            price: item.price,
            qty: item.qty
        }))
        let order = {
            buyer: {
                name: "Leo Messi",
                email: "leo@messi.com",
                phone: "123456789"
            },
            date: serverTimestamp(),
            items: itemsForDB,
            total: context.calcTotal()
        }

        const createOrderInFirestore = async () => {
            const newOrderRef = doc(collection(db, "orders"));
            await setDoc(newOrderRef, order);
            return newOrderRef;
        }

        createOrderInFirestore()
            .then(result => {
                alert('Your order has been create! ' + result.id)
                context.cartList.forEach(async(item) => {
                    const itemRef = doc(db, "products", item.id);
                    await updateDoc(itemRef, {
                      stock: increment(-item.qty)
                    });            
                })
                context.clear()
            })
            .catch(err => console.log(err))
    }
  
    return (
        context.cartList.length !== 0 ?
        
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button className="total-button" variant="secundary" active>Total compra = ${context.calcTotal()}</Button>
                <Button className="buy-button" variant="success" active onClick={createOrder}>Realizar compra</Button>
                <Button className="remove-all-button" variant="danger" active onClick={context.clear}>Quitar todos los productos</Button>
            </div>
                {            
                context.cartList.map(item => 
                <DetailContainer key={item.id}>
                    <WrapperDetail>
                        <ImgContainer>
                            <ImageDetail src={item.image} />
                        </ImgContainer>
                        <InfoContainer>
                            <Title>{item.name} {item.brand}</Title>
                            <Desc></Desc>
                            <Price>$ {item.price}</Price>
                            <Qty>Cantidad: {item.qty} {item.qty > 1 ? "unidades" : "unidad"}</Qty>
                            <p>Subtotal: $ {item.qty * item.price}</p>
                            <Desc>{item.stock} unidades disponibles</Desc>
                        </InfoContainer>
                    </WrapperDetail>
                    <Button className="remove-button" variant="primary" onClick={() => context.removeItem(item.id)}>Quitar producto</Button>
                </DetailContainer>             
                ) 
                }  
        </>
        :
        <>
        <div className="empty-cart-message">
            <h2>
                No tienes productos en el carrito...
            </h2>
            <Link to='/'><Button variant="warning">Volver al listado de productos</Button></Link>
        </div>
        </>
    )
}

export default Cart;





/* <Button variant="secundary" active onClick={context.clear}>Quitar todos los productos</Button>
            {
                context.cartList.map(item => <li>{item.name} (qty={item.qty}) <Button variant="secundary" active
                 onClick={() => context.removeItem(item.id)}>Quitar producto</Button></li>)
                
            } */