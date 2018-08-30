import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import MenuAdmin from './menuAdmin'
import MenuUser from './menuUser'
import Dashboard from './dashboard'

import Producto from './register/producto'

import Stock from './report/stock'

import Compra from './operation/buy'
import Venta from './operation/sale'
import RegistroManual from './operation/regManual'

import userList from './report/userList'
import userView from './report/userView'

// admin
const Ventas = ({match}) => <p>Informe de ventas <code>{match.url}</code>.</p>;
const Presupuesto = ({match}) => <p>Operación nueva presupuesto <code>{match.url}</code>.</p>;

const Compras = ({match}) => <p>Informe de compras <code>{match.url}</code>.</p>;
const Pedidos = ({match}) => <p>Gestion de pedidos <code>{match.url}</code>.</p>;

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
										<Route exact path={match.url} component={Dashboard} />

										<Route path={`${match.url}/register/product`} component={Producto} />

										<Route path={`${match.url}/operation/order`} component={Presupuesto} />
										<Route path={`${match.url}/operation/buy`} render={() => (
											<Compra user={user} />
										)} />
										<Route path={`${match.url}/operation/sale`} render={() => (
											<Venta user={user} />
										)} />
										<Route path={`${match.url}/operation/manual-registration`} render={() => (
											<RegistroManual user={user} />
										)} />

										<Route path={`${match.url}/report/stock`} component={Stock} />
										<Route path={`${match.url}/report/orders`} component={Pedidos} />
										<Route path={`${match.url}/report/motions/buy`} component={Compras} />
										<Route path={`${match.url}/report/motions/sale`} render={() => (
											<Ventas user={user} />
										)} />
                    <Route exact path={`${match.url}/report/users`} component={userList} />
                    <Route path={`${match.url}/report/users/:uid`} component={userView} />
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