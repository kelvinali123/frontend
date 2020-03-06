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
import { MdAdd, MdLoyalty } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

class EmptyPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            datas: [
                {
                    nama: 'MELANTHA',
                    qty: 5
                },
                {
                    nama: 'PANADOL',
                    qty: 20
                }
            ],
            resultPointTop: [],

            modal_modalAddIsOpen: false,
            inputPointTopIdValue: 0,
            inputPointTopNameValue: '',
            inputPointTopPointValue: 0,

            stringTemp: 'TEST'
        };
    }

    // Fungsi yang dipanggil ketika Page load pertama kali
    componentDidMount() {
        this.getPointTopData();
        this.fungsi();
    }

    fungsi = () => {
        this.setState({
            stringTemp: 'TEST123'
        })
        console.log(this.state.stringTemp)
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

    onInputChange = (event) => {
        const value = event.target.value;

        console.log('Input Value: ', value);
        this.setState({
            inputValue: value
        })
    }

    onButtonClick = () => {
        alert('Button Clicked');
    }

    onButtonDisplayInputClick = () => {
        alert('Input Value: ' + this.state.inputValue);
    }

    
    getPointTopData = async () => {
        var url = 'https://api.docnet.id/CHCMasterProduk/PointGroup/1/PointTOP'

        // Jika menggunakan fungsi FETCH
        // fetch(url)
        //     .then(response => {
        //         if(response.ok) {
        //             return response.json();
        //         }
        //     })
        //     .then(data => {
        //         this.setState({
        //             resultPointTop: data.data
        //         })
        //     })
        //     .catch(error => {
        //         console.log('ERROR: ' + error.message)
        //     })

        Axios.get(url)
        .then((response) => {
            try {
                this.setState({
                    resultPointTop: response.data.data
                })
            } catch (error) {
                console.log('ERROR: ' + error.message);
                this.setState({
                    resultPointTop: []
                })
            }
        })
    }

    addPointTop = async () => {
        var url = 'https://api.docnet.id/CHCMasterProduk/PointGroup/1/PointTOP'

        var body = {
            ptop_name: this.state.inputPointTopNameValue,
            ptop_point: parseInt(this.state.inputPointTopPointValue),
            ptop_userid: '190671U'
        }

        // Jika menggunakan fungsi FETCH
        // fetch(url, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json;charset=utf-8',
        //     },
        //     json: true,
        //     body: JSON.stringify(body),
        // })
        //     .then(() => {
        //         this.componentDidMount();
        //         this.closeModalAdd();
        //         this.showNotification('BERHASIL MENAMBAHKAN DATA POINT TOP BARU');
        //     })
        //     .catch(() => {
        //         this.showNotification('GAGAL MENAMBAHKAN DATA POINT TOP BARU');
        //     })

        Axios.post(url, body)
            .then(response => {
                var responseMessage = '';
                if(response.request.status === 200) { // 200 adalah Response OK
                    this.componentDidMount();
                    responseMessage = 'BERHASIL MENAMBAHKAN DATA POINT TOP BARU';
                    this.closeModalAdd();
                }
                else {
                    responseMessage = 'GAGAL MENAMBAHKAN DATA POINT TOP BARU';
                }
                this.showNotification(responseMessage);
            })
    }

    openModalAdd = () => {
        this.setState({
            modal_modalAddIsOpen: true
        });
    }

    closeModalAdd = () => {
        this.setState({
            modal_modalAddIsOpen: false
        });
    }

    onInputPointTopAddChange = (name, event) => {
        const value = event.target.value;

        this.setState({
            [name + 'Value']: value
        }, () => console.log('CHANGE: ' + name + ': ' + value));
    }

    //render biasa nya di-isi untuk desain HTML
    render() {
        const {datas, resultPointTop} = this.state;
        return (
            <Page
                title="Empty"
                breadcrumbs={[{ name: 'Empty', active: true }]}>
                <Card className="mb-3">
                    <NotificationSystem
                        dismissible={false}
                        ref={notificationSystem =>
                            (this.notificationSystem = notificationSystem)
                        }
                        style={NOTIFICATION_SYSTEM_STYLE} />
                    <CardHeader className="d-flex justify-content-between align-items-center font-weight-bold">
                        <Label size='lg'>Empty</Label>
                    </CardHeader>
                    <CardBody>
                        <Form>
                            <Input />
                            <Input placeholder='Input' value={this.state.inputValue} onChange={(event) => this.onInputChange(event)} />

                            <Button onClick={() => this.onButtonClick()}>Button</Button>
                            <Button onClick={() => this.onButtonDisplayInputClick()}>Display Input</Button>

                            <h3>List Product</h3>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nama</th>
                                        <th>Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>0</td>
                                        <td>PARAMIX</td>
                                        <td>10</td>
                                    </tr>
                                    {datas.map((data, index) =>
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{data.nama}</td>
                                            <td>{data['qty']}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>

                            <h3>Point TOP</h3>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Point</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultPointTop.map((pointTop, index) =>
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{pointTop.ptop_runningid}</td>
                                            <td>{pointTop.ptop_name}</td>
                                            <td>{pointTop.ptop_point}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                            
                            <Button onClick={() => this.openModalAdd()}><MdAdd /> Open Modal Add</Button>
                        </Form>
                    </CardBody>
                </Card>

                <Modal
                    isOpen={this.state.modal_modalAddIsOpen}
                    size='lg'>
                    <ModalHeader><h2>Tambah Point TOP</h2></ModalHeader>
                    <ModalBody className='m-3'>
                        <Form>
                            <FormGroup row>
                                <Label>Name</Label>
                                <Input type='text' onChange={event => this.onInputPointTopAddChange('inputPointTopName', event)} value={this.state.inputPointTopNameValue} />
                            </FormGroup>
                            <FormGroup row>
                                <Label>Point</Label>
                                <Input type='number' onChange={event => this.onInputPointTopAddChange('inputPointTopPoint', event)} value={this.state.inputPointTopPointValue} />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='success' onClick={() => this.addPointTop()}>Add</Button>
                        <Button color='danger' onClick={() => this.closeModalAdd()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </Page>
        );
    }
}
export default EmptyPage;