import React, { useEffect, useState } from 'react';

function BuyItemPage(props) {
  return <div>Item id: {props.match.params.id}</div>;
}

export default BuyItemPage;
