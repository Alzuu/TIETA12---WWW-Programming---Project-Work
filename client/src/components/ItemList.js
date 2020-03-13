import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ItemList(props) {
  if (props.items.length > 0) {
    return (
      <div className="itemList">
        <table>
          <thead>
            <tr>
              <th>Picture</th>
              <th>Item name</th>
              <th>Price</th>
              <th>Seller items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.items.map((item) => (
              <tr key={item._id}>
                <td>
                  <img
                    width="100px"
                    src={
                      (props.type === 'shopkeeper'
                        ? 'itemimages/'
                        : '../../itemimages/') +
                      (item.pictureId === '' ||
                      item.pictureId === null ||
                      item.pictureId === undefined
                        ? 'nologo.png'
                        : item.pictureId)
                    }
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>
                  <Link to={'/users/' + item.ownerId + '/items'}>
                    Seller items
                  </Link>
                </td>
                <td>
                  <Link to={'/items/' + item._id + '/buy'}>Buy item</Link>
                  {item.ownerId === props.userId || props.userRole === 1 ? (
                    <Link to={'/items/' + item._id + '/edit'}>
                      <br />
                      Edit item
                    </Link>
                  ) : (
                    ''
                  )}
                  {item.ownerId === props.userId || props.userRole === 1 ? (
                    <Link to={'/items/' + item._id + '/delete'}>
                      <br />
                      Delete item
                    </Link>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    return (
      <div>
        <h2>No items.</h2>
      </div>
    );
  }
}
export default ItemList;
