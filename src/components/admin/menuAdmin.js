import React from 'react';
import {Link} from 'react-router-dom'
import {
	Nav,
	NavItem,
	Dropdown,
	DropdownItem,
	DropdownToggle,
	DropdownMenu } from 'reactstrap';

	export default class MenuAdmin extends React.Component {
  constructor(props) {
    super(props);

    this.toggle_1 = this.toggle_1.bind(this);
    this.toggle_2 = this.toggle_2.bind(this);
    this.toggle_3 = this.toggle_3.bind(this);
    this.state = {
      dropdownOpen_1: false,
      dropdownOpen_2: false,
      dropdownOpen_3: false
    }
  }

  toggle_1() {
    this.setState({
      dropdownOpen_1: !this.state.dropdownOpen_1
    });
  }

  toggle_2() {
    this.setState({
      dropdownOpen_2: !this.state.dropdownOpen_2
    });
  }

  toggle_3() {
    this.setState({
      dropdownOpen_3: !this.state.dropdownOpen_3
    });
  }
  render() {
  	const { url } = this.props

    return (
      <div>
        <Nav className='shadow' style={{backgroundColor: '#007bff', borderColor: '#007bff'}} tabs>
          <NavItem>
            <Link className='nav-link' to={'/admin'}>Dashboard</Link>
          </NavItem>

          <Dropdown nav isOpen={this.state.dropdownOpen_1} toggle={this.toggle_1}>
            <DropdownToggle nav caret>
              Registrar
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                <Link to={`${url}/register/product`}>Producto</Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown nav isOpen={this.state.dropdownOpen_2} toggle={this.toggle_2}>
            <DropdownToggle nav caret>
              Operación
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
              	<Link to={`${url}/operation/buy`}>Compra</Link>
              </DropdownItem>
              <DropdownItem>
              	<Link to={`${url}/operation/sale`}>Venta</Link>
              </DropdownItem>
              <DropdownItem>
                <Link to={`${url}/operation/order`}>Presupuesto</Link>
              </DropdownItem>
              <DropdownItem>
                <Link to={`${url}/operation/manual-registration`}>Registro Manual</Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown nav isOpen={this.state.dropdownOpen_3} toggle={this.toggle_3}>
            <DropdownToggle nav caret>
              Informe
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
              	<Link to={`${url}/report/stock`}>Stock</Link>
              </DropdownItem>
              <DropdownItem>
                <Link to={`${url}/report/orders`}>Pedidos</Link>
              </DropdownItem>
            	<DropdownItem>
            		<Link to={`${url}/report/motions/buy`}>Compras</Link>
            	</DropdownItem>
              <DropdownItem>
                <Link to={`${url}/report/motions/sale`}>Ventas</Link>
              </DropdownItem>
            	<DropdownItem>
            		<Link to={`${url}/report/users`}>Usuarios</Link>
            	</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Nav>
      </div>
    );
  }
}