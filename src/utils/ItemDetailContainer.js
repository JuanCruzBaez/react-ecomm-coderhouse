import CustomFetch from "../utils/CustomFetch";
import { useEffect, useState } from "react";
import Data from "./Data";
import ItemDetail from "./ItemDetail";


const ItemDetailContainer = () => {
    const [dato, setDato] = useState({});
    
    useEffect(() => {
      CustomFetch(2000, Data[3])
          .then(result => setDato(result))
          .catch(err => console.log(err))
    }, []);

    return (
        <ItemDetail item={Data[0]} />
    );
}

export default ItemDetailContainer;