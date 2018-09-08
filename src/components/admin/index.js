import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Container } from 'reactstrap';
import MenuAdmin from './menuAdmin'
import MenuUser from './menuUser'
import Dashboard from './dashboard'
import Producto from './register/producto'
import Productos from './report/products'
import ProductView from './report/productView'
// import Compra from './operation/buy'
// import Venta from './operation/sale'
import RegistroManual from './operation/regManual'
import userList from './report/userList'
import userView from './report/userView'

// admin
const Ventas = ({match}) => <p>Ventas <code>{match.url}</code>.</p>;

const Compra = ({match}) => <p>Nueva compra <code>{match.url}</code>.</p>;
const Venta = ({match}) => <p>Nueva venta <code>{match.url}</code>.</p>;
const Presupuesto = ({match}) => <p>Nuevo presupuesto <code>{match.url}</code>.</p>;

const Motions = ({match}) => <p>Movimientos <code>{match.url}</code>.</p>;

// user
const DashboardUser = ({match}) => <p>Dasboard user <code>{match.url}</code>.</p>;
const PedidosUser = ({match}) => <p>Gestion de pedidos <code>{match.url}</code>.</p>;

class Admin extends Component {
  constructor(props) {
    super(props)
  }
	render() {
		const { match, user } = this.props

		return (
			<div>
				{
					user.admin ? (
						<div>

							{
								user.active ? (
									<div>		
										<MenuAdmin url={match.url}/>
										<br/>
										<Container style={{minHeight: '-webkit-fill-available'}}>
											<Route exact path={match.url} component={Dashboard} />
											<Route path={`${match.url}/register/product`} component={Producto} />

											<Route path={`${match.url}/operation/buy`} component={Compra} />
											<Route path={`${match.url}/operation/sale`} component={Venta} />
											<Route path={`${match.url}/operation/order`} component={Presupuesto} />
											<Route path={`${match.url}/operation/manual-registration`} render={() => (
												<RegistroManual user={user} />
											)} />

											<Route exact path={`${match.url}/report/products`} component={Productos} />
											<Route path={`${match.url}/report/products/:id`} component={ProductView} />
											<Route path={`${match.url}/report/motions`} component={Motions} />
                    	<Route exact path={`${match.url}/report/users`} component={userList} />
                    	<Route path={`${match.url}/report/users/:uid`} component={userView} />
										</Container> 
									</div>
								) : (
									<p>Tu cuenta de administrador esta bloqueada!</p>
								)
							}
						</div>
					) : (
						<div>
							{
								user.active ? (
									<div>
										<MenuUser url={match.url}/>
										<br/>
										<Route exact path={match.url} component={DashboardUser} />
										<Route path={`${match.url}/orders`} component={PedidosUser} />
									</div>
								) : (
									<p>Su cuenta de usuario esta bloqueada!</p>
								)
							}
						</div>
					)
				}

			</div>
		);
	}
}

export default Admin;