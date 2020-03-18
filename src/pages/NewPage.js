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
} from 'reactstrap';
import { MdAdd, MdAssignment, MdLoyalty } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import User from './UserPage';
import register from './../registerServiceWorker';

var BACKEND;

class NewPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            modal_register: false,

            // Register
            registerUser_nip:'',
            registerUser_nama_lengkap: '',
            registerUser_tanggal_lahir: '',
            registerUser_jabatan: '',
            registerUser_email: '',

            //Update
            updateUser_user_id: 0,
            updateUser_nip:'',
            updateUser_nama_lengkap: '',
            updateUser_tanggal_lahir: '',
            updateUser_jabatan: '',
            updateUser_email: ''
        }
        BACKEND = 'http://10.0.111.94:8888'
    }

    // Fungsi yang dipanggil ketika Page load pertama kali
    componentDidMount() {
        this.getDataUser()
    }

    // Untuk memunculkan Notification dengan pesan {currMessage}
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

    getDataUser = () => {
        var url=BACKEND + "/users?typeGet=getUserFirebase"
        Axios.get(url)
        .then((response) => {
            if (response.data.data) {
                this.setState({
                    users: response.data.data
                })
            }
        })
    }

    openRegisterModal = () =>{
        this.setState({
            modal_register: true
        })

    }

    openUpdateModal = (index) =>{
        var user = this.state.users[index];
        this.setState({
            modal_update: true,
            updateUser_user_id: user.user_id,
            updateUser_nip: user.nip,
            updateUser_nama_lengkap: user.nama_lengkap,
            updateUser_tanggal_lahir: new Date(user.tanggal_lahir).toISOString().substr(0, 10),
            updateUser_jabatan: user.jabatan,
            updateUser_email: user.email,

        })

    }

    closeRegisterModal = () =>{
        this.setState({
            modal_register: false
        })
    }

    closeUpdateModal = () =>{
        this.setState({
            modal_update: false
        })
    }

    onRegisterInputTextChange = (inputName, event) => {
        const value = event.target.value;

        this.setState({
            ['registerUser_' + inputName]: value
        });
    }

    onUpdateInputTextChange =(inputName, event) => {
        const value = event.target.value;

        this.setState({
            ['updateUser_' +inputName] : value
        });
    }

    updateUser =()=>{
        var url=BACKEND + "/updateUser?NIP=" + this.state.updateUser_nip
        var body={
            user_id: this.state.updateUser_user_id,
            nip: this.state.updateUser_nip,
            nama_lengkap: this.state.updateUser_nama_lengkap,
            tanggal_lahir: this.state.updateUser_tanggal_lahir + "T00:00:00Z",
            jabatan: this.state.updateUser_jabatan,
            email: this.state.updateUser_email
        }
        this.setState({
            modal_update: true
        })

        Axios.put(url, body)
            .then(() => {
                this.getDataUser();
                this.closeUpdateModal();
                
            })
            .catch(error => {
                
            })
    }

    registerUser = () => {
        var url=BACKEND + "/insertUser?typePost=Firebase"
        var body = {
            user_id: 1,
            nip: this.state.registerUser_nip,
            nama_lengkap: this.state.registerUser_nama_lengkap,
            tanggal_lahir: this.state.registerUser_tanggal_lahir + "T00:00:00Z",
            jabatan: this.state.registerUser_jabatan,
            email: this.state.registerUser_email
        }

        this.setState({
            modal_register: true
        })

        Axios.post(url, body)
            .then(() => {
                this.getDataUser();
                this.closeRegisterModal();
                
            })
            .catch(error => {
                
            })
    }

    

    //render biasa nya di-isi untuk desain HTML
    render() {
        return (

            <Page
                title="Table"
                breadcrumbs={[{ name: 'Table', active: true }]}>
                <Card className="mb-3">
                    <NotificationSystem
                        dismissible={false}
                        ref={notificationSystem =>
                            (this.notificationSystem = notificationSystem)
                        }
                        style={NOTIFICATION_SYSTEM_STYLE} />
                    <CardHeader className='d-flex justify-content-between align-items-center'>
                        <Label>User</Label>
                        <Button onClick={() => this.openRegisterModal()}>Register</Button>
                    </CardHeader>

                    <CardBody>
                        <Table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama</th>
                                    <th>Email</th>
                                    <th>Jabatan</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.users.map((user, index)=>
                                        <tr>
                                        <td>{index + 1}</td>
                                        <td>{user.nama_lengkap}</td>
                                        <td>{user.email}</td>
                                        <td>{user.jabatan}</td>
                                        <td><Button size="sm" color="danger" onClick={() => this.openUpdateModal(index)}>Edit</Button></td>
                                        <td><Button size="sm" color='warning'>Delete</Button></td>
                                        
                                </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
                <Modal isOpen = {this.state.modal_register} size= 'lg'>
                       <ModalHeader>
                                <Label>Register</Label>
                       </ModalHeader>
                        <ModalBody>
                        <Form>
                            <Row form>
                                <Col>
                                    <FormGroup>
                                        <Label>Nip</Label> 
                                        <Input placeholder="Nip" value={this.state.registerUser_nip} onInput={(event) => this.onRegisterInputTextChange('nip', event)} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        
                            <Row form>
                                <Col>
                                    <FormGroup>
                                        <Label>Nama Lengkap</Label> 
                                        <Input placeholder="Nama" value={this.state.registerUser_nama_lengkap} onInput={(event) => this.onRegisterInputTextChange('nama_lengkap', event)} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col>
                                    <FormGroup>
                                        <Label>Tgl Lahir</Label>
                                        <Input type='date' value={this.state.registerUser_tanggal_lahir} onInput={(event) => this.onRegisterInputTextChange('tanggal_lahir', event)}/>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label>Jabatan</Label>
                                        <Input value={this.state.registerUser_jabatan} onInput={(event) => this.onRegisterInputTextChange('jabatan', event)}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                            <Col>
                                    <FormGroup>
                                        <Label>Email</Label>
                                        <Input placeholder="example@gmail.com" value={this.state.registerUser_email} onInput={(event) => this.onRegisterInputTextChange('email', event)}/>
                                    </FormGroup>
                                </Col>
                                <Col></Col>
                            </Row>
                        </Form>
                        </ModalBody>
                        <ModalFooter className = 'd-flex justify-content-center'>
                            <Button color ='danger' onClick={()=> this.closeRegisterModal()}>Cancel</Button>
                                <Button color='success' onClick={() => this.registerUser()}>Register</Button>
                                
                        </ModalFooter>

                </Modal>
                <Modal isOpen = {this.state.modal_update} size= 'lg'>
                       <ModalHeader>
                                <Label>Edit</Label>
                       </ModalHeader>
                        <ModalBody>
                        <Form>
                            <Row form>
                                <Col>
                                    <FormGroup>
                                        <Label>Nip</Label> 
                                        <Input placeholder="Nip" value={this.state.updateUser_nip} onInput={(event) => this.onUpdateInputTextChange('nip', event)}disabled/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        
                            <Row form>
                                <Col>
                                    <FormGroup>
                                        <Label>Nama Lengkap</Label> 
                                        <Input placeholder="Nama" value={this.state.updateUser_nama_lengkap} onInput={(event) => this.onUpdateInputTextChange('nama_lengkap', event)} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col>
                                    <FormGroup>
                                        <Label>Tgl Lahir</Label>
                                        <Input type='date' value={this.state.updateUser_tanggal_lahir} onInput={(event) => this.onUpdateInputTextChange('tanggal_lahir', event)}/>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label>Jabatan</Label>
                                        <Input value={this.state.updateUser_jabatan} onInput={(event) => this.onUpdateInputTextChange('jabatan', event)}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                            <Col>
                                    <FormGroup>
                                        <Label>Email</Label>
                                        <Input placeholder="example@gmail.com" value={this.state.updateUser_email} onInput={(event) => this.onUpdateInputTextChange('email', event)}/>
                                    </FormGroup>
                                </Col>
                                <Col></Col>
                            </Row>
                        </Form>
                        </ModalBody>
                        <ModalFooter className = 'd-flex justify-content-center'>
                            <Button color ='danger' onClick={()=> this.closeUpdateModal()}>Cancel</Button>
                                <Button color='success' onClick={() => this.updateUser()}>Edit</Button>
                                
                                
                        </ModalFooter>

                </Modal>
                
            </Page>
        );
    }
}

export default NewPage;