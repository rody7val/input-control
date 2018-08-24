import React, { Component } from 'react'
import firebase from 'firebase'
import moment from 'moment'
import FileUpload from '../utils/fileUpload'
import Select from 'react-select/lib/Creatable';
import ProductView from '../../productView'
import { 
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	Card,
	CardBody,
	Row,
	Col } from 'reactstrap';

function prepareCategoriesForSave(arr){
  var returnObj = {};
  arr.forEach(item => {
    returnObj[item.value] = true
  });
  return returnObj;
}

function prepareProviderForSave(obj){
  var returnObj = {};
  returnObj[obj.value] = true
  return returnObj;
}

class Producto extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: undefined,
      desc: undefined,
      img: '/img-card-example.png',
      _categories: [],
      categories: [],
      _providers: [],
      provider: [],
      uploadValue: 0,
    }

    this.crear = this.crear.bind(this)
    this.change = this.change.bind(this)
    this.onUpload = this.onUpload.bind(this)
    this.changeCategories = this.changeCategories.bind(this)
  }

  componentDidMount = () => {
    this.getCategories()
    this.getProviders()
  }

  getCategories = () => {
    firebase.database()
      .ref()
      .child('categories/list')
      .once('value')
      .then(snapshot => {
        snapshot.forEach(category => {
          this.setState({
            _categories: this.state._categories.concat({label: category.key, value: category.key})
          })
        })
      })
  }

  getProviders = () => {
    firebase.database()
      .ref()
      .child('providers/list')
      .once('value')
      .then(snapshot => {
        snapshot.forEach(provider => {
          this.setState({
            _providers: this.state._providers.concat({label: provider.key, value: provider.key})
          })
        })
      })
  }

  setCategory = (category) => {
    console.log(category)
    firebase.database()
      .ref('categories/list') 
      .child(category.value)
      .set(category).then(() => {
        this.setState({
          _categories: this.state._categories.concat(category)
        })
      })
  }

  setProvider = (provider) => {
    firebase.database()
      .ref('providers/list')
      .child(provider.value)
      .set(provider).then(() => {
        this.setState({
          _providers: this.state._providers.concat(provider)
        })
      })
  }

  crear(event) {
  	event.preventDefault()
    let errors = false;

    const item = {
      name: this.state.name,
      desc: this.state.desc,
      img: this.state.img,
      qty: 0,
      buyPrice: 0,
      salePrice: 0,
      categories: prepareCategoriesForSave(this.state.categories),
      provider: prepareProviderForSave(this.state.provider),
      created: moment().valueOf()
    }

    firebase.database()
      .ref('items/list')
      .push()
      .set(item)
      .then(() => {
        alert('Producto creado!')
      }).catch((err) => {
        errors = true
        alert(err)
      })

    if (!errors) {
  	  // reset state
      this.setState({
      	name: undefined,
      	desc: undefined,
        img: '/img-card-example.png',
        categories: [],
        providers: [],
      	uploadValue: 0,
      })
      event.target.reset()
    }
    
  }

  change(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    // if (name === 'salePrice') {
    // 	//calcular % de ganancia
    //   let dif = Number(Number(value - this.state.price).toFixed(2));
    //   let porcentaje = Number(Number(dif / value).toFixed(2));
    //   this.setState({
    //   	gain: porcentaje > 0 ? Number(Number(porcentaje * 100).toFixed(2)) : 0
    //   })
    // }

    this.setState({
      [name]: value
    })
  }

	onUpload (event) {
    const file = event.target.files[0]
    const storageRef = firebase.storage().ref(`/fotos/${moment().valueOf()}_${file.name}`)
    const task = storageRef.put(file)

    task.on('state_changed', snapshot => {
      let percentage = Number(Number((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0))
      this.setState({ uploadValue: percentage })
    }, error => {
      console.log(error.message)
    }, () => {  	
				storageRef.getDownloadURL().then(url => {
          console.log(url)
    			this.setState({ img: url })
				})
    })
  }

  changeCategories = (categories) => {
    let last = categories[categories.length-1] || {}
    if (last.__isNew__) {
      delete last.__isNew__
      this.setCategory(last)
    }
    this.setState({ categories })
    console.log(this.state.categories)
  }

  changeProvider = (provider) => {
    console.log(provider)
    if (provider.__isNew__) {
      delete provider.__isNew__
      this.setProvider(provider)
    }
    this.setState({ provider })
    console.log(this.state.provider)
  }

	render() {
		return (
			<Row>
				<Col md={8} sm={12}>
					<h3>Registrar Producto</h3>
					<Card className='shadow'>
						<CardBody>
							<Form onSubmit={this.crear}>
      				  <FormGroup>
      				    <Label for="name">Nombre</Label>
      				    <Input required onChange={this.change} value={this.state.name} type="text" name="name" id="name" placeholder="Nombre del producto" />
                </FormGroup>
                <FormGroup>
                  <Label for="desc">Descripción</Label>
                  <Input required onChange={this.change} value={this.state.desc} type='text' name="desc" id="desc" placeholder="Descripción del producto" />
                </FormGroup>
                <FormGroup>
                  <Label for="img">Imagen</Label>
                  <FileUpload onUpload={this.onUpload} uploadValue={this.state.uploadValue}/>
                </FormGroup>
                <FormGroup>
                  <Label>Proveedor</Label>
                  <Select
                    value={this.state.providers}
                    onChange={this.changeProvider}
                    options={this.state._providers}/>
                </FormGroup>
                <FormGroup>
                  <Label>Categorias</Label>
                  <Select
                    isMulti
                    value={this.state.categories}
                    onChange={this.changeCategories}
                    options={this.state._categories}/>
                </FormGroup>
      				  <Button color='primary'>Guardar</Button>
							</Form>
						</CardBody>
					</Card>
          <br/>
        </Col>
				<Col md={4} sm={12}>
					<h3>Vista previa</h3>
          <ProductView 
            name={this.state.name}
            desc={this.state.desc}
            img={this.state.img}
            qty={this.state.qty}
            categories={this.state.categories}/>
        </Col>
			</Row>
		)
	}
}

export default Producto

                  // <Col sm={12} md={6}>
                    // <FormGroup>
                      // <Label for="qty">Stock</Label>
                      // <Input required onChange={this.change} value={this.state.qty} type="number" name="qty" id="qty" placeholder="Cantidad de unidades" />
                    // </FormGroup>
                  // </Col>
                // </Row>
                // <Row>
                  // <Col sm={12} md={6}>
                    // <FormGroup>
                      // <Label for="price">Pcio. Compra</Label>
                      // <InputGroup>
                        // <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                        // <Input required onChange={this.change} value={this.state.price} step='0.05' type="number" name="price" id="price" placeholder="Precio de compra" />
                      // </InputGroup>
                    // </FormGroup>
                  // </Col>
                  // <Col sm={12} md={6}>
                    // <FormGroup>
                      // <Label for="salePrice">Pcio. Venta</Label>
                      // <InputGroup>
                        // <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                        // <Input required onChange={this.change} value={this.state.salePrice} step='0.05' type="number" name="salePrice" id="salePrice" placeholder="Precio de venta" />
                      // </InputGroup>
                      // <FormText><Badge>{this.state.gain}%</Badge> de ganancia</FormText>
                    // </FormGroup>
                  // </Col>
                // </Row>
                // <FormGroup>
                  // <CustomInput onChange={this.change} value={this.state.viewPrice} type='checkbox' name='viewPrice' label='Mostrar Precio' id='viewPrice'/>
                // </FormGroup>