import React from 'react';
import Page from 'components/Page';
import Stomp from 'stompjs';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import {
    Alert, 
    Button, 
    Badge, 
    Card, 
    CardBody, 
    CardHeader, 
    CardFooter, 
    Col, 
    DatePicker,
    Form,
    FormGroup,
    FormFeedback,
    Input,
    InputGroup,
    InputGroupAddon,
    Label,
    ListGroup,
    ListGroupItem,
    Modal, 
    ModalBody, 
    ModalFooter, 
    ModalHeader, 
    Row, 
    Spinner, 
    Table, 
    UncontrolledTooltip,
    ButtonGroup
} from 'reactstrap';
import {MdLoyalty} from 'react-icons/md';

var stompClient = null;

class KafkaPageTest extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dataList: ['00001', '00002', '00003', '00004', '00005'],
            input: ''
        }
    }

    componentDidMount() {
        console.log('Length: ' + this.state.dataList.length);
        this.connect(this);
    }

    //fungsi notification
    showNotification = (currMessage) => {
        setTimeout(() => {
            if (!this.notificationSystem) {
                return;
            }
            this.notificationSystem.addNotification({
                title: <MdLoyalty />,
                message:
                    currMessage,
                level: 'info',
            });
        }, 100);
    }

    connect(context) {
        var socket = new WebSocket('ws://localhost:4444/scanBarcodeMessage');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function(frame) {
            console.log('StompConnected: ' + frame);
            stompClient.subscribe('/deliveryOrder/scanBarcodeMessages', function(messageOutput) {
                var msg = messageOutput.body;
                context.showNotification('Message Output: ' + msg);
                // context.pushDataList(msg);
                context.removeDataList(msg);
            });
            context.showNotification('StompConnected');
        });
    }

    disconnect() {
        if(stompClient != null) {
            stompClient.disconnect();
            console.log('Disconnected');
            return;
        }
        console.log('No connection');
    }

    sendMessage(message) {
        stompClient.send("/DO/scanBarcodeMessage", {}, message)
    }

    pushDataList(data) {
        var dataList = this.state.dataList;
        dataList.push(data);
        this.setState({
            dataList: dataList
        })
    }

    removeDataList(data) {
        var dataList = this.state.dataList;
        var index = dataList.indexOf(data)
        if(index >= 0) {
            const data = dataList[index];
            dataList.splice(index, 1);
            this.setState({
                dataList: dataList
            })
            this.showNotification('Data ' + data + ' deleted');
            return;
        }
        this.showNotification('Data not found');
    }

    render() {
        return (
            <Page
                title="WebSocket Test"
                breadcrumbs={[{ name: "KafkaTest", active: true }]}
                className="KafkaPageTest">
                <NotificationSystem
                    dismissable={false}
                    ref={notificationSystem => (this.notificationSystem = notificationSystem)}
                    style={NOTIFICATION_SYSTEM_STYLE} />

                <Card className="mb-3">
                    <CardHeader>Delivery Order</CardHeader>
                    <CardBody>
                        <Row className='m-3'>
                            <ButtonGroup>
                                <Button color='primary' onClick={() => this.connect(this)}>Connect</Button>
                                <Button color='danger' onClick={() => this.disconnect()}>Disconnect</Button>
                            </ButtonGroup>
                        </Row>
                        <Row className='m-3'>
                            <InputGroup>
                                <Input
                                    value={this.state.input}
                                    onChange={event => { this.setState({ input: event.target.value }) }} />
                                <InputGroupAddon addonType='append'>
                                    <Button color='primary' onClick={() => this.sendMessage(this.state.input)}>Send</Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </Row>
                        <Table>
                            <thead>
                                <th>No DO</th>
                            </thead>
                            <tbody>
                                {this.state.dataList.map((data) =>
                                    <tr>
                                        <td>{data}</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Page>
        )
    }
}
export default KafkaPageTest;