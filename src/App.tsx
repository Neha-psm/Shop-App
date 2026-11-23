import React from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from './store/store';
import { addToBasket, removeFromBasket } from './store/shopSlice';

const ShopStorefront: React.FC = () => {
  const dispatch = useAppDispatch();
  const { inventory, basket } = useAppSelector((state) => state.shop);

  const subTotalAmount = basket.reduce((sum, item) => sum + item.subtotal, 0);
  const totalAmount = basket.reduce((sum, item) => sum + item.totalAmt, 0);
  const savingAmount = subTotalAmount - totalAmount;

  return (
    <div>
    <section className="widget-container">
      <section className="widget">
        <div className="widget-header">
          <h2>Products</h2>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Price</th>
                <th> </th>
              </tr>
            </thead>

            <tbody>
              {inventory.map((item) => (
              <>
              <tr>
              <td>{item.name} {' '}</td>
              <td>&pound;{item.price.toFixed(2)} {' '}</td>
              <td><button className="status in-stock" 
                  onClick={() => dispatch(addToBasket(item.id))}
                  disabled={item.stock === 0}
                >
                  {item.stock > 0 ? 'Add' : 'Sold Out'}
                </button>{' '}
              </td>
              </tr>
              </>
              ))}
          </tbody>
        </table>
      </div>
      </section>

      <section className="widget">
      <div className="widget-header">
        <h2>Basket</h2>
      </div>
      {basket.length === 0 ? (
        <p>Your basket is empty.</p>
      ) : (
        <>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
                <th>Price</th>
                <th> </th>
                <th>Qty</th>
                <th> </th>
                <th> Item Cost</th>
            </tr>
          </thead>
          <tbody>
            {
            
            basket.map((item) => {
            const fullPrice = item.price * item.quantity;
            return (
              <>
              <tr  key={item.id}>
                <td>{item.name}</td>
                <td> &pound; {item.price}</td>
                <td>
                  <button 
                    className="status in-stock" 
                    onClick={() => dispatch(addToBasket(item.id))}
                    disabled={item.quantity === 0}
                  >
                    +
                  </button>
                </td>
                <td>{item.quantity}</td>
                <td>
                  <button 
                    className="status in-stock" 
                    onClick={() => dispatch(removeFromBasket(item.id))}
                  >
                    - 
                  </button>
                </td>
                <td>

                  {item.discountedCount > 0 && (
                    <span
                      style={{
                        textDecoration: 'line-through',
                        color: '#888',
                        marginRight: '6px',
                      }}
                    >
                      ${fullPrice.toFixed(2)}
                    </span>
                  )}
                  ${item.subtotal.toFixed(2)}{"\n"}
                  {item.discountedCount > 0 && (
                    <span style={{ color: 'green', marginLeft: '8px', fontSize: '0.85rem' }}>
                      ({item.discountLabel})
                    </span>
                  )}
                </td>
              </tr>
              </>
            )}
            
            )}
          </tbody>
        </table>
        </div>
        </>
        )}

        <h4>Sub Total : &pound; {subTotalAmount.toFixed(2)}</h4>
        <h4>Savings   : &pound; {savingAmount.toFixed(2)}</h4>
        <h3>Total Amount: &pound;{totalAmount.toFixed(2)}</h3>
      </section>
    </section>
    </div>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <ShopStorefront />
    </Provider>
  );
}
