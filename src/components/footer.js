import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

class Footer extends Component {

	render() {
		return (
			<footer style={{backgroundColor: '#343a40'}}>
				<br/>
				<br/>
				<Container>
					<Row>
						<Col md={4} sm={12}>
							<h5 className='footerTitle'>Empresa</h5>
							<p>loren ipsum dolor cura cuorum jaquet di poter</p>
						</Col>
						<Col md={4} sm={12}>
							<h5 className='footerTitle'>Social</h5>
							<p>loren cuorum jaquet di poteripsum dolor cura cuorum jaquet di poter</p>
						</Col>
						<Col md={4} sm={12}>
							<h5 className='footerTitle'>Contacto</h5>
							<p>loren ipsum dolor cura cuorum</p>
						</Col>
					</Row>
				</Container>
				<br/>
				<br/>
			</footer>
		);
	}
}

export default Footer;