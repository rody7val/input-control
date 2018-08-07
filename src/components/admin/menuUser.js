import React from 'react';
import {Link} from 'react-router-dom'
import { Nav, NavItem } from 'reactstrap';

	export default class MenuAdmin extends React.Component {


  render() {
  	const { url } = this.props

    return (
      <div>
        <Nav tabs>
          <NavItem>
            <Link className='nav-link' to={`${url}`}>Dashboard</Link>
          </NavItem>
          <NavItem>
            <Link className='nav-link' to={`${url}/orders`}>Pedidos</Link>
          </NavItem>
        </Nav>
      </div>
    );
  }
}