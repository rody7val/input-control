import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import MenuAdmin from './menuAdmin'
import MenuUser from './menuUser'

import Producto from './register/producto'

import Stock from './report/stock'

import Compra from './operation/buy'

// admin
const Dashboard = ({match}) => <p>Dasboard admin <code>{match.url}</code>.</p>;

const Venta = ({match}) => <p>Operación nueva venta <code>{match.url}</code>.</p>;

const Operaciones = ({match}) => <p>Informe de operaciones de compras y ventas<code>{match.url}</code>.</p>;
const Usuarios = ({match}) => <p>Informe de usuarios <code>{match.url}</code>.</p>;

// user
const DashboardUser = ({match}) => <p>Dasboard user <code>{match.url}</code>.</p>;
const Pedidos = ({match}) => <p>Gestion de pedidos <code>{match.url}</code>.</p>;

class Admin extends Component {
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
										<Route exact path={match.url} component={Dashboard} />

										<Route path={`${match.url}/register/product`} component={Producto} />

										<Route path={`${match.url}/operation/buy`} component={Compra} />
										<Route path={`${match.url}/operation/sale`} component={Venta} />

										<Route path={`${match.url}/report/stock`} component={Stock} />
										<Route path={`${match.url}/report/motions`} component={Operaciones} />
										<Route path={`${match.url}/report/users`} component={Usuarios} />
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
										<Route path={`${match.url}/orders`} component={Pedidos} />
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