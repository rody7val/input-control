import React, { Component } from 'react'
import update from 'react-addons-update';
import SearchInput, {createFilter} from 'react-search-input'
import firebase from 'firebase'
import moment from 'moment'
import { Collapse, FormGroup, Label, InputGroup, InputGroupAddon, FormText, Row, Col, Card, CardHeader, CardBody, Form, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, ListGroup, CustomInput, Badge } from 'reactstrap';

const KEYS_TO_FILTERS = ['name', 'desc']

function addProperties(snapshot) {
	let item = snapshot.val()
	item.key = snapshot.key
  item.collapse = false
  item.done = false
  item.gain = 0
  item.qty = item.qty || 0
  item._qty = 0
  item._buyPrice = item._buyPrice || 0
  item._salePrice = item._salePrice || 0
	return item
}
function getlength(number) {
  return number.toString().length;
}
function prepareForSave(arr){
  var returnObj = {};
  arr.forEach(item => {
    returnObj[item.key] = true
  });
  return returnObj;
}

export default class Sale extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //toggle
      load: false,
      modal: false,
      dropdown: false,
      // front
      items: [],
      itemsEdition: [],
      searchTerm: '',
      changes: false,
      //motion
      type: 'REG-MANUAL',
      date: moment().format('YYYY-MM-DD'),
      _items: [],
      _user: this.props.user.uid,
      buyTotal: 0,
      saleTotal: 0,
      gain: 0
    }
    
    this.toggle = this.toggle.bind(this)
    this.changeMotion = this.changeMotion.bind(this)
    this.changeEdit = this.changeEdit.bind(this)
    this.collapse = this.collapse.bind(this)
    this.changeInputs = this.changeInputs.bind(this)
    this.searchUpdated = this.searchUpdated.bind(this)
    this.flushItems = this.flushItems.bind(this)
    this.calc = this.calc.bind(this)
    this.save = this.save.bind(this)
  }

  save(event){
    event.preventDefault();
    let errors = false;

    var motion = {
      type: this.state.type,
      date: this.state.date,
      _items: this.state.itemsEdition.map(item => {
        return {
          key: item.key,
          qty: Number(item.qty + Number(item._qty)),
          _qty: Number(item._qty),
          _salePrice: Number(item._salePrice),
          _buyPrice: Number(item._buyPrice),
          gain: item.gain
        }
      }),
      members: prepareForSave(
        this.state.itemsEdition.map(item => {
          return {
            key: item.key
          }
        })
      ),
      _user: this.state._user,
      buyTotal: Number(this.state.buyTotal),
      saleTotal: Number(this.state.saleTotal),
      gain: this.state.gain,
      created: moment().valueOf()
    }

    firebase.database()
      .ref(`motions/${motion.type}/list`)
      .push()
      .set(motion)
      .then(() => {
        firebase.database().ref('load').set(true);
      }).catch((err) => {
        errors = true
        alert(err)
      })

    if (!errors) {
      // reset state
      this.setState({
        // front
        items: [],
        itemsEdition: [],
        searchTerm: '',
        //motion
        type: 'REG-MANUAL',
        date: moment().format('YYYY-MM-DD'),
        _items: [],
        _user: this.props.user.uid,
        buyTotal: 0,
        saleTotal: 0,
        gain: 0
      })
      event.target.reset()
    }
  }

  toggle(type) {
    this.setState({
      [type]: !this.state[type]
    });
  }

  changeMotion(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  changeEdit(index, event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    let length;

    //calcular % de ganancia
    if (name === '_salePrice') {

      let dif = Number(value - this.state.itemsEdition[index]._buyPrice);
      let porcentaje =  Number(dif / value);
      let gain = porcentaje > 0 ? Number(
        Number(
          porcentaje * 100
        ).toFixed(2)
      ) : 0;

      this.state.itemsEdition[index].gain = Number(gain);
      this.forceUpdate()
    }

    this.setState({
    	changes: true,
      itemsEdition: update(this.state.itemsEdition, {
        [index]: {
          [name]: {
            $set: value
          }
        }
      })
    })
  }

  collapse(index, event) {
    this.setState({
      itemsEdition: update(this.state.itemsEdition, {
        [index]: {
          collapse: {
            $set: !this.state.itemsEdition[index].collapse
          }
        }
      })
    });
  }

  changeInputs(type, event) {
    let id = event.target.id;
    let position = this.state[type].map(item => {return item.key}).indexOf(id);
    let value = !this.state[type][position].done;
    
    this.setState({
    	changes: true,
      [type]: update(this.state[type], {
        [position]: {
          done: {
            $set: value
          }
        }
      })
    });
  }

  searchUpdated(term) {

    this.setState({searchTerm: term})
  }

  flushItems(from, to){
    // agregar items al editor o buscador
    this.setState({
      [to]: update(this.state[to], {
        $push: this.state[from].filter(item => { return item.done })
      })
    });
    // Limpiar editor o buscador
    this.setState({
     [from]: this.state[from].filter(item => {
        return item.done == false
      })
    });
  }

  calc(){
    let compras = 0;
    let ventas = 0;

    this.state.itemsEdition.map(item => {
      if (item.done){
        compras = Number(
          compras + (Math.abs(item._qty) * item._buyPrice)
        );
        ventas = Number(
          ventas + (Math.abs(item._qty) * item._salePrice)
        );
      }
    });

      let dif = Number(ventas - compras);
      let porcentaje =  Number(dif / ventas);
      let gain = porcentaje > 0 ? Number(
        Number(
          porcentaje * 100
        ).toFixed(2)
      ) : 0;

    // let gain = Number(
    //   Number( (compras * 100) / ventas).toFixed(2)
    // ) || 0;

    this.setState({
    	changes: false,
      buyTotal: compras,
      saleTotal: ventas,
      gain: gain
    })
    
  }

  getAll(){
    firebase.database()
      .ref('items/list')
      .orderByChild('name')
      .once('value')
      .then(snapshot => {
        snapshot.forEach(item => {
          this.setState({
            items: this.state.items.concat(addProperties( item )),
          })
        })
      })
  }

  componentWillMount() {
    firebase.database().ref('load').on('value', snapshot => {
    	if (!snapshot.val()) {
  			this.getAll()
    	}
      this.setState({ load: snapshot.val() })
    })
  }

	render() {
		const {user} = this.props;
    let filteredItems = this.state.items.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))

		return (
			<div>
			<Modal isOpen={this.state.load} >
        <ModalBody>
          <p className='lead text-center'>Guardando...</p>
        </ModalBody>
      </Modal>
			<h3 className='title'>Registro Manual</h3>
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
												Edición

                        <div style={{float: 'right'}}>
                          <ButtonDropdown size='sm' style={{float: 'right'}} isOpen={this.state.dropdown} toggle={()=>this.toggle('dropdown')}>
                            <DropdownToggle caret>
                              Acciones
                            </DropdownToggle>
                            <DropdownMenu>
                            {
                              this.state.itemsEdition.length > 0 ? (
                                <div>
                                  <DropdownItem onClick={()=>this.flushItems('itemsEdition', 'items')}>Quitar item(s)</DropdownItem>
                                  <DropdownItem onClick={this.calc}>Calcular montos</DropdownItem>
                                </div>
                              ) : (
                                <div>
                                  <DropdownItem disabled style={{cursor: 'not-allowed'}}>Quitar item(s)</DropdownItem>
                                  <DropdownItem disabled style={{cursor: 'not-allowed'}}>Calcular montos</DropdownItem>
                                </div>
                              )
                            }
                            </DropdownMenu>
                          </ButtonDropdown>

                          <Button color='primary' size='sm' onClick={()=>this.toggle('modal')} style={{float: 'right'}}>Buscar</Button>
                          <Modal size='lg' isOpen={this.state.modal} toggle={()=>this.toggle('modal')}>
                            <ModalHeader toggle={()=>this.toggle('modal')}>
                              <SearchInput onChange={this.searchUpdated} />
                            </ModalHeader>
                            <ModalBody>
                              {filteredItems.map(item => {
                                return (
                                  <div >
                                    <CustomInput
                                      key={item.key}
                                      id={item.key}
                                      name='done'
                                      type="checkbox"
                                      label={
                                        <div>
                                          {item.name}{' '}
                                          <small>- {item.desc}</small>{' '}
                                          <Badge size='sm' color={item.qty == 0 ? 'danger' : (item.qty >= 6 ? 'success' : 'warning')} pill>{item.qty}</Badge>
                                        </div>
                                      }
                                      checked={item.done}
                                      onChange={(event) => this.changeInputs("items", event)}
                                      className={`list-group-item-action list-group-item ${item.done ? 'active' : null}`} />
                                  </div>
                                )
                              })}
                            </ModalBody>
                            <ModalFooter>
                              <Button size='sm' color="secondary" onClick={()=>this.toggle('modal')}>Ocultar</Button>
                              <Button size='sm' onClick={()=>this.flushItems('items','itemsEdition')} color="primary">Añadir a la lista</Button>{' '}
                            </ModalFooter>
                          </Modal>
                        </div>

											</CardHeader>
											<CardBody>

                        <ListGroup>
                          {
                            this.state.itemsEdition.length ? this.state.itemsEdition.map((item, index) => (
                              <div key={index}>
                                <CustomInput
                                  id={item.key}
                                  name='done'
                                  type="checkbox"
                                  label={
                                    <div>
                                      {item.name}{' '}
                                      <Badge size='sm' color={item.qty + Number(item._qty) == 0 ? 'danger' : (item.qty + Number(item._qty) >= 6 ? 'success' : 'warning')} pill>{item.qty + Number(item._qty)}</Badge>
                                      <Button size='sm' onClick={(event) => this.collapse(index, event)} style={{float: 'right'}}>{item.collapse ? 'Close' : 'Edit'}</Button>
                                    </div>
                                  }
                                  checked={item.done}
                                  onChange={(event) => this.changeInputs("itemsEdition", event)}
                                  className={`list-group-item-action list-group-item shadow ${item.done ? 'active' : null}`} />
                                <Collapse isOpen={item.collapse}>
                                  <Card>
                                    <CardBody>
                                      <Row>
                                        <Col>
                                          <FormGroup>
                                            <Label for="qty">Cantidad</Label>
                                            <Input required onChange={(event) => {this.changeEdit(index, event)}} value={item._qty} type="number" min={-item.qty} name="_qty" id="qty" placeholder="Cantidad de unidades" />
                                            <Label for="price">Pcio. Compra</Label>
                                            <InputGroup>
                                              <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                                              <Input required onChange={(event) => {this.changeEdit(index, event)}} value={item._buyPrice} step='0.05' type="number" name="_buyPrice" id="price" placeholder="Precio de compra" />
                                            </InputGroup>
                                            <Label for="salePrice">Pcio. Venta</Label>
                                            <InputGroup>
                                              <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                                              <Input required onChange={(event) => {this.changeEdit(index, event)}} value={item._salePrice} step='0.05' type="number" name="_salePrice" id="salePrice" placeholder="Precio de venta" />
                                            </InputGroup>
                                          </FormGroup>
                                        </Col>

                                      <Col>
                                        <FormGroup>
                                          <Label>% de Ganancia</Label>
                                          <InputGroup>
                                            <Badge color={item.gain == 0 ? 'danger' : (item.gain >= 10 ? 'success' : 'warning')}>{item.gain}%</Badge>
                                          </InputGroup>
                                        </FormGroup>
                                      </Col>
                                      </Row>
                                    </CardBody>
                                  </Card>
                                </Collapse>
                              </div>
                            )) : <small>Busca unos productos..</small>
                          }
                        </ListGroup>
                      </CardBody>
                    </Card>
                    <br/>
                  </Col>
                </Row>
              </Col>
              <Col md={6} sm={12}>
                  <Card className='shadow'>
                  <CardHeader tag="h5">Movimiento</CardHeader>
                    <CardBody>
                      <Form onSubmit={this.save}>
                        <FormGroup>
                          <Row>
                            <Col>
                              <Label for="date">Fecha</Label>
                              <Input readOnly type="date" name="date" onChange={this.changeMotion} value={this.state.date} id="date" />
                              <Label for="user">Usuario</Label>
                              <Input readOnly type="text" name="user" value={this.props.user.displayName} id="userId" />
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Label for="total">Pcio. Compra Total</Label>
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                                <Input required type="number" readOnly value={this.state.buyTotal} name="buyTotal" id="buyTotal" />
                              </InputGroup>
                              <Label for="total">Pcio. Venta Total</Label>
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                                <Input required type="number" readOnly value={this.state.saleTotal} name="saleTotal" id="saleTotal" />
                              </InputGroup>
                            </Col>
                            <Col>
                              <FormGroup>
                                <Label>% de Ganancia Total</Label>
                                <InputGroup>
                                  <Badge color={this.state.gain == 0 ? 'danger' : (this.state.gain >= 10 ? 'success' : 'warning')}>{this.state.gain}%</Badge>
                                </InputGroup>
                              </FormGroup>
                            </Col>
                          </Row>
                        </FormGroup>
                        <FormGroup>
                        	{
                        	  this.state.itemsEdition.length && !this.state.changes ? (
                        	  	<Button color='primary'>Guardar</Button>
                        	  ) : (
                        	  	<div>
                        	  		<Button style={{cursor: 'not-allowed'}} color='primary' outline disabled>Guardar</Button>
                        	  		<FormText color="muted">Actualiza los cambios</FormText>
                        	  	</div>
                        	  )
                        	}
                        </FormGroup>
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