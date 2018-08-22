import React from 'react';
import { Progress, CustomInput } from 'reactstrap';

class FileUpload extends React.Component {

	render () {
		return (
			<div>
				<CustomInput id='file' type='file' onChange={this.props.onUpload} label="Click para subir imagen!"/>
				<Progress value={this.props.uploadValue}>{this.props.uploadValue}%</Progress>
			</div>
		);
	}
}

export default FileUpload;