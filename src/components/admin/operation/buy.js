import React, { Component } from 'react'
import firebase from 'firebase'
import Buscador from './buscador'
import List from '../utils/list'
import {
	Button,
	Row,
	Col,
	Card,
	CardHeader,
	CardBody,
	Form,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter } from 'reactstrap';

function removeAccents(value) {
	return value
		.replace(/á/g, 'a')            
		.replace(/é/g, 'e')
		.replace(/í/g, 'i')
		.replace(/ó/g, 'o')
		.replace(/ú/g, 'u');
}

function addProperties(snapshot) {
	let item = snapshot.val()
	item.key = snapshot.key
	item.done = false
	item.listSelected = false
	return item
}

class Buy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dropdownOpen: false,
      _items: [],
      itemsSearch: [],
      itemsList: [],
      items: []
    }

    this.toggle = this.toggle.bind(this)
    this.filterSearch = this.filterSearch.bind(this)
		this.searchToList = this.searchToList.bind(this)
    this.crear = this.crear.bind(this)
    this.change = this.change.bind(this)
    this.changeInputsSearchList = this.changeInputsSearchList.bind(this)
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  componentDidMount = () => {
  	firebase.database()
  		.ref('items')
  		.on('child_added', snapshot => {
  			this.setState({
  				_items: this.state._items.concat(addProperties( snapshot )),
  				itemsSearch: this.state.itemsSearch.concat(addProperties( snapshot ))
  			})
  		})
  }

	filterSearch = (event) => {
		if (event.target.value === '') {
			return this.setState({
				itemsSearch: this.state._items
			})
		}

		this.setState({ itemsSearch: this.state._items.filter(item => {
				var name = removeAccents(item.name);
				var value_1 = name.toLowerCase().search( event.target.value.toLowerCase() ) !== -1;
			 	var value_2 = item.done == true;
			 	var value_3 = item.listSelected == false;
			 	return value_1 
			 	// && value_2 
			 	&& value_3;
			})
		})
  }

  crear = (event) => {
  	event.preventDefault()    
  }

  change = (event) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

	searchToList = () => {
		// add to list
		let arr = this.state.itemsList;
		this.state.itemsSearch.forEach(item => {
			if (item.done && !item.listSelected) {
				arr.push(item)
			}
		})
		this.setState({
			itemsList: arr
		})
		// delete from search
		this.setState({
			itemsSearch: this.state.itemsSearch.filter(item => {
				return item.done == false
			})
		})
		// add property selected in _items[]
		let arr_1 = this.state._items;
		this.state._items.forEach(item => {
			if (item.done) {
				item.listSelected = true
				arr_1.push(item)
			}
		})
		this.setState({
			_items: arr_1
		})
	}

	changeInputsSearchList = (event) => {
    var arr = [];
		this.state.itemsSearch.forEach((item, index) => {
			if (item.key == event.target.id) {
				item.done = !item.done
			}
			arr.push(item)
		})

		this.setState({
			_items: arr,
			itemsSearch: arr
		})
	}

	changeInputsList = (event) => {
    var arr = [];
		this.state.itemsList.forEach((item, index) => {
			if (item.key == event.target.id) {
				item.done = !item.done
			}
			arr.push(item)
		})

		this.setState({
			itemsList: arr
		})
	}


	render() {
		return (
			<div>
			<h3>Nueva Compra</h3>
			<Row>
				<Col md={12}>
					<Card className='shadow'>
						<CardBody>
						<Row>
							<Col md={6} sm={12}>
								<Row>
									<Col md={12}>
										<Card className='shadow'>
											<CardHeader tag="h5">
												Buscador
												<Buscador
													items={this.state.itemsSearch}
													change={this.changeInputsSearchList}

													searchToList={this.searchToList}
													filter={this.filterSearch}
													buttonLabel='Buscar productos'/>
											</CardHeader>
										</Card>
      					    <br/>
      					  </Col>
									<Col md={12}>
										<Card className='shadow'>
											<CardHeader tag="h5">
												Listado
												<ButtonDropdown size='sm' style={{float: 'right'}} isOpen={this.state.dropdownOpen} toggle={this.toggle}>
      									  <DropdownToggle caret>
      									    Acciones
      									  </DropdownToggle>
      									  <DropdownMenu>
      									    <DropdownItem>Quitar item(s)</DropdownItem>
      									  </DropdownMenu>
      									</ButtonDropdown>
											</CardHeader>
											<CardBody>
            						<List 
            						 items={this.state.itemsList}
            						 change={this.changeInputsList}
            						 filter={false}
            						 noItemLabel={'Ningun item seleccionado'}/>
											</CardBody>
										</Card>
      					    <br/>
      					  </Col>
								</Row>
        			</Col>
							<Col md={6} sm={12}>
									<Card className='shadow'>
									<CardHeader tag="h5">Compra</CardHeader>
										<CardBody>
											<Form onSubmit={this.crear}>
											</Form>
										</CardBody>
									</Card>
      					  <br/>
        			</Col>
        		</Row>
						</CardBody>
        	</Card>
        </Col>
			</Row>
			</div>
		)
	}
}

export default Buy