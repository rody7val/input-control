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
							<h6 className='footerTitle'>EMPRESA</h6>
							<p><small>loren ipsum dolor cura cuorum jaquet di poter</small></p>
						</Col>
						<Col md={4} sm={12}>
							<h6 className='footerTitle'>SOCIAL</h6>
							<p><small>loren cuorum jaquet di poteripsum dolor cura cuorum jaquet di poter</small></p>
						</Col>
						<Col md={4} sm={12}>
							<h6 className='footerTitle'>CONTACTO</h6>
							<p><small>loren ipsum dolor cura cuorum</small></p>
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