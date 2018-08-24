import React, { Component } from 'react'
import firebase from 'firebase'
import Buscador from './buscador'
import List from '../utils/list'
import {
	Row,
	Col,
	Card,
	CardHeader,
	CardBody,
	Form,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem } from 'reactstrap';

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

export default class RegistroManual extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dropdownOpen: false,
    	valueSearch: '',
      _items: [],
      itemsSearch: [],
      itemsList: [],
      items: []
    }

    this.toggle = this.toggle.bind(this)
    this.filterSearch = this.filterSearch.bind(this)
		this.searchToList = this.searchToList.bind(this)
		this.listToSearch = this.listToSearch.bind(this)
    this.crear = this.crear.bind(this)
    this.change = this.change.bind(this)
    this.changeInputsSearchList = this.changeInputsSearchList.bind(this)
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  componentWillMount = () => {
  	firebase.database()
  		.ref('items/list')
  		.orderByChild('name')
  		.once('value')
  		.then(snapshot => {
  			snapshot.forEach(item => {
  				this.setState({
  					_items: this.state._items.concat(addProperties( item )),
  					itemsSearch: this.state.itemsSearch.concat(addProperties( item ))
  				})
  			})
  		})
  }

	filterSearch = (event) => {
		this.setState({
			valueSearch: event.target.value
		})
		if (event.target.value === '') {
			return this.setState({
				itemsSearch: this.state._items
			})
		}

		this.setState({ itemsSearch: this.state._items.filter(item => {
				var name = removeAccents(item.name);
				var value_1 = name.toLowerCase().search( event.target.value.toLowerCase() ) !== -1;
			 	var value_2 = item.listSelected == false;
			 	return value_1 && value_2;
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
		// add items to list
		let itemsList = this.state.itemsList;
		this.state._items.forEach(item => {
			if (item.done && !item.listSelected) {
				// item.done = !item.done;
				itemsList.push(item)
			}
		})
		this.setState({
			itemsList: itemsList
		})
		// refresh _items and itemsSearch
		let _items = [];
		this.state._items.forEach(item => {
			if (item.done) {
				item.listSelected = true
			}
			_items.push(item)
		})
		var filter = _items.filter(item => {
			var name = removeAccents(item.name);
			var value_1 = name.toLowerCase().search( this.state.valueSearch.toLowerCase() ) !== -1;
		 	var value_2 = item.listSelected == false;
		 	return value_1 && value_2;
		})
		this.setState({
			_items: _items,
			itemsSearch: filter
		})
	}

	listToSearch = () => {
		let itemsList = this.state.itemsList;
		let _items = this.state._items;
		// delete items from search
		this.setState({
			itemsList: this.state.itemsList.filter(item => {
				return item.done == false
			})
		})
		// delete items from list
		_items.forEach((item, index) => {
			itemsList.forEach(itemList => {
				if (itemList.key === item.key && itemList.done ) {
					console.log('key', item.name)
					_items[index].listSelected = false
					_items[index].done = false
				}
			})
		})
		this.setState({
			_items: _items,
			itemsSearch: _items,
			valueSearch: ''
		})
	}

	changeInputsSearchList = (event) => {
		// change item.done in _items[] and itemsSearch[]
    var arr = [];
		this.state._items.forEach((item, index) => {
			if (event.target.id === item.key) {
				item.done = !item.done
			}
			arr.push(item)
		})
		var filter = arr.filter(item => {
			var name = removeAccents(item.name);
			var value_1 = name.toLowerCase().search( this.state.valueSearch.toLowerCase() ) !== -1;
		 	var value_2 = item.listSelected == false;
		 	return value_1 && value_2;
		})

		this.setState({
			_items: arr,
			itemsSearch: filter
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
			<h3>Nuevo Registro Manual</h3>
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
													value={this.state.valueSearch}
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
												<ButtonDropdown style={{float: 'right'}} isOpen={this.state.dropdownOpen} toggle={this.toggle}>
      									  <DropdownToggle caret>
      									    Acciones
      									  </DropdownToggle>
      									  <DropdownMenu>
      									    <DropdownItem onClick={this.listToSearch}>Quitar item(s)</DropdownItem>
      									  </DropdownMenu>
      									</ButtonDropdown>
											</CardHeader>
											<CardBody>
            						<List 
            							items={this.state.itemsList}
            							change={this.changeInputsList}

            							filter={false}
            							noItemLabel={'Ningun producto seleccionado'}/>
											</CardBody>
										</Card>
      					    <br/>
      					  </Col>
								</Row>
        			</Col>
							<Col md={6} sm={12}>
									<Card className='shadow'>
									<CardHeader tag="h5">Registro Manual</CardHeader>
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