import Page from 'components/Page';
import React from 'react';
import Axios from 'axios'
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table,
    InputGroup,
    InputGroupAddon,
} from 'reactstrap';
import { MdAdd, MdLoyalty, MdSearch } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listUser: []
        }
    }

    componentDidMount() {
        this.getUser();
    }

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

    getUser = async () => {
        var url = 'http://10.0.111.143:8888/users';

        Axios.get(url)
        .then(response => {
            this.setState({
                listUser: response.data.data
            })
        })
        .catch(error => {
            setTimeout(() => this.getUser(), 5000);
            this.showNotification('Terjadi error dengan pesan: ' + error.message);
            return;
        })
    }

    render() {
        return (
            <Page
                title='User'
                breadcrumbs={[{ name: 'User', active: true }]}>
                <NotificationSystem
                    dismissible={false}
                    ref={notificationSystem =>
                        (this.notificationSystem = notificationSystem)
                    }
                    style={NOTIFICATION_SYSTEM_STYLE} />
                <Card>
                    <CardHeader className='d-flex justify-content-end'>
                        <Button><MdAdd /> Register</Button>
                    </CardHeader>
                    <CardBody>
                        <Row className='mb-3'>
                            <Col>
                                <Label>Search</Label>
                                <InputGroup>
                                    <Input />
                                    <InputGroupAddon addonType='append'>
                                        <Button><MdSearch /></Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h5>List User</h5>
                                <Table>
                                    <thead>
                                        <th>No</th>
                                        <th>Nama</th>
                                        <th>Email</th>
                                        <th>Jabatan</th>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.listUser.map((user, index) => 
                                                <tr>
                                                    <td>{index}</td>
                                                    <td>{user.nama_lengkap}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.jabatan}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Page>
        )
    }
}

export default User;