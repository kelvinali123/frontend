import Page from 'components/Page';
import React from 'react';

import {
	Button,
	Card,
	CardDeck,
	CardBody,
	CardTitle,
	CardText,
	CardHeader,
	Col,
	Label,
	Row,
	ListGroup,
	ListGroupItem,
	Progress,
	FormGroup
} from 'reactstrap';
import {
	MdCheckCircle,
	MdLoyalty,
	MdPlayArrow,
	MdSettingsApplications,
} from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

class BatchMonitoring extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,

			modal: false
		};

	}

	showNotification = currMessage => {
		setTimeout(() => {
			if (!this.notificationSystem) {
				return;
			}
			this.notificationSystem.addNotification({
				title: <MdLoyalty />,
				message: currMessage,
				level: 'info',
			});
		}, 100);
	};

	toggle = modalType => () => {
		if (!modalType) {
			return this.setState({
				modal: !this.state.modal,
			});
		}

		//pembuatan setState disemua function, dimana hanya memanggil nama nya saja ex modal_delete , maka di render hanya panggil delete saja
		this.setState({
			[`modal_${modalType}`]: !this.state[`modal_${modalType}`],
		});
	};

	componentDidMount() {
		
	}

	toggleCollapseMore() {
		this.setState({ collapse: !this.state.collapse });
	}

	render() {
		return (
			<Page
				title="Batch Monitoring"
				breadcrumbs={[{ name: 'Batch Monitoring', active: true }]}>
				<Card className="mb-3">
					<NotificationSystem
						dismissible={false}
						ref={notificationSystem =>
							(this.notificationSystem = notificationSystem)
						}
						style={NOTIFICATION_SYSTEM_STYLE} />
					<Card outline color="primary" className="ml-3 mr-3 mt-3">
						<div className="d-flex justify-content-center mt-3 mb-3">
							<CardDeck className="w-50">
								<Card body outline color="primary" className="text-center">
									<CardTitle><MdSettingsApplications style={{ width: '3rem', height: '3rem' }} /></CardTitle>
									<CardText className="font-weight-bold">On Progress</CardText>
									<Button>PILIH</Button>
								</Card>
								<Card body outline color="primary" className="text-center">
									<CardTitle><MdCheckCircle style={{ width: '3rem', height: '3rem' }} /></CardTitle>
									<CardText className="font-weight-bold">Done </CardText>
									<Button>PILIH </Button>
								</Card>
							</CardDeck>
						</div>
					</Card>
					<CardBody>
						<Row className='d-flex justify-content-center'>
							<ListGroup className='w-100'>

								<ListGroupItem>
									<Row>
										<Col className='d-flex justify-content-between'>
											<text><span className='font-weight-bold'>No SP: </span> 981000004</text>
											<text><span className='font-weight-bold'>Status: </span> On Progress</text>
											<text><span className='font-weight-bold'>Tanggal: </span> 07-February-2020</text>
										</Col>
									</Row>
									<Row>
										<Col>
											<div className='font-weight-bold text-center'>Progress</div>
										</Col>
									</Row>
									<Row>
										<Col className='d-flex align-items-center'>
											<Card body outline={false} color='primary'>
												<CardTitle className='font-weight-bold text-center text-light'>SP Terbentuk</CardTitle>
												<CardText className='text-center text-light'>Sukses membentuk SP</CardText>
											</Card>

											<MdPlayArrow style={{ width: '1rem', height: '1rem' }} />

											<Card body outline={false} color='primary'>
												<CardTitle className='font-weight-bold text-center text-light'>SP Dilayani</CardTitle>
												<CardText className='text-center text-light'>Sukses melayani SP</CardText>
											</Card>

											<MdPlayArrow style={{ width: '1rem', height: '1rem' }} />

											<Card body outline={false} color='secondary'>
												<CardTitle className='font-weight-bold text-center text-light'>DO Terbentuk</CardTitle>
												<CardText className='text-center text-light'>Sedang diproses</CardText>
											</Card>

											<MdPlayArrow style={{ width: '1rem', height: '1rem' }} />

											<Card body outline={true} color='primary'>
												<CardTitle className='font-weight-bold text-center'>DO Print</CardTitle>
												<CardText className='text-center'>Belum diproses</CardText>
											</Card>
										</Col>
									</Row>
								</ListGroupItem>

								<ListGroupItem>
									<Row>
										<Col className='d-flex justify-content-between'>
											<text><span className='font-weight-bold'>No SP: </span> 981000008</text>
											<text><span className='font-weight-bold'>Status: </span> On Progress</text>
											<text><span className='font-weight-bold'>Tanggal: </span> 07-February-2020</text>
										</Col>
									</Row>
									<Row>
										<Col>
											<div className='font-weight-bold text-center'>Progress</div>
										</Col>
									</Row>
									<Row>
										<Col className='d-flex align-items-center'>
											<Card body outline={false} color='secondary'>
												<CardTitle className='font-weight-bold text-center text-light'>SP Terbentuk</CardTitle>
												<CardText className='text-center text-light'>Sedang diproses</CardText>
											</Card>

											<MdPlayArrow style={{ width: '1rem', height: '1rem' }} />

											<Card body outline={true} color='primary'>
												<CardTitle className='font-weight-bold text-center'>SP Dilayani</CardTitle>
												<CardText className='text-center'>Belum diproses</CardText>
											</Card>

											<MdPlayArrow style={{ width: '1rem', height: '1rem' }} />

											<Card body outline={true} color='primary'>
												<CardTitle className='font-weight-bold text-center'>DO Terbentuk</CardTitle>
												<CardText className='text-center'>Belum diproses</CardText>
											</Card>

											<MdPlayArrow style={{ width: '1rem', height: '1rem' }} />

											<Card body outline={true} color='primary'>
												<CardTitle className='font-weight-bold text-center'>DO Print</CardTitle>
												<CardText className='text-center'>Belum diproses</CardText>
											</Card>
										</Col>
									</Row>
								</ListGroupItem>

							</ListGroup>
						</Row>
					</CardBody>
				</Card>
			</Page>
		);
	}
}
export default BatchMonitoring;
