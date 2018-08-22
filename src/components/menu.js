import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {
	Container,
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

class Menu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  login = () => {
    this.props.auth(() => {
      console.log('auth')
    })
  }

  logout = () => {
    this.props.signout(() => {
      console.log('auth')
    })
  }

	render() {
		return (
      <Navbar color="dark" dark expand="sm">
      	<Container>
          <Link className='navbar-brand' to={'/'}>INSUMAX</Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {
                !this.props.user ? (
                  <NavItem>
                    <NavLink className='marginLink' style={{cursor: 'pointer'}} onClick={this.login}>ACCEDER</NavLink>
                  </NavItem>
                ) : (
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      <img src={this.props.user.photoURL} alt='user-img' className='imgUser' />
                    </DropdownToggle>
                    <DropdownMenu right className='backgroundDark'>
                      <DropdownItem className='backgroundDark'>
                        <Link className='nav-link' to={'/admin'}>Administración</Link>
                      </DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem className='backgroundDark' style={{cursor: 'pointer'}} onClick={this.logout}>
                        <NavLink>Salir</NavLink>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                )
              }
            </Nav>
          </Collapse>
        </Container>
      </Navbar>

    );
  }
}

export default Menu;
							// <NavItem>
							// 	<Link className='nav-link marginLink' to={'/company'}>EMPRESA</Link>
							// </NavItem>
       //      	<NavItem>
       //        	<Link className='nav-link marginLink' to={'/contact'}>CONTACTO</Link>
       //        </NavItem>