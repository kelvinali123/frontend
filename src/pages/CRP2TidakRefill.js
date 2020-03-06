import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
import {
    Button,
    Badge,
    Card,
    CardBody,
    CardHeader,
    Col,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Spinner,
    Table,
    FormGroup,
} from 'reactstrap';
import { MdSearch, MdLoyalty, MdFormatAlignRight } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import DropdownPage from '../pages/template/DropdownPage';

const BACKEND_HOST_URL = 'http://10.0.111.143';
const BACKEND_HOST_PORT = '1234'
const BACKEND_HOST_PREFIX_CRP2 = 'CRP2'

const MAIN_DB_CLUSTER_LIST = ['K8'];
const SECOND_DB_CLUSTER_LIST = ['ST', 'UM'];
const THIRD_DB_CLUSTER_LIST = ['XK', 'UL'];
const CLUSTER_LIST = MAIN_DB_CLUSTER_LIST.concat(SECOND_DB_CLUSTER_LIST).concat(THIRD_DB_CLUSTER_LIST);

const GET_NEXT_CLUSTER_INTERVAL = 45; //In seconds
const RETRY_TIMEOUT = 5 * 1000; //In X seconds * 1000 milliseconds

class CRP2Page extends React.Component {
    //Constructor method
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            clock: new Date(),

            notRefillList: [],
            isGettingNotRefillList: false,
            dropdownClusterValue: 'K8',
            dateTanggalAwalValue: new Date().toISOString().substr(0, 10),
            dateTanggalAkhirValue: new Date().toISOString().substr(0, 10),

            nextClusterTimer: GET_NEXT_CLUSTER_INTERVAL
        };
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

    componentDidMount() {
        const defaultCluster = this.state.dropdownClusterValue;
        const defaultTanggalAwal = this.state.dateTanggalAwalValue.replace(/-/g, '');
        const defaultTanggalAkhir = this.state.dateTanggalAkhirValue.replace(/-/g, '');
        this.getNotRefillList(defaultCluster, defaultTanggalAwal, defaultTanggalAkhir);

        //Clock interval function every second
        setInterval(() => {
            const currentClusterTimer = this.state.nextClusterTimer;
            const isGettingNotRefillList = this.state.isGettingNotRefillList;
            this.setState({
                clock: new Date(),
                nextClusterTimer: currentClusterTimer - 1 != 0 && !isGettingNotRefillList ? currentClusterTimer - 1 : GET_NEXT_CLUSTER_INTERVAL
            })

            if(currentClusterTimer - 1 == 0) {
                this.getNextClusterNotRefillList();
            }
        }, 1000);
    }

    handleOnChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            [name + 'Value']: value
        })
    }

    searchRefillDate(event) {
        event.preventDefault();

        const cluster = this.state.dropdownClusterValue;
        const tanggalAwal = this.state.dateTanggalAwalValue.replace(/-/g, '');
        const tanggalAkhir = this.state.dateTanggalAkhirValue.replace(/-/g, '');

        this.getNotRefillList(cluster, tanggalAwal, tanggalAkhir);
    }

    getNotRefillList(cluster, tanggalAwal, tanggalAkhir) {
        this.setState({
            isLoading: true,
            isGettingNotRefillList: true
        })

        const db = this.getDatabaseApi(cluster);
        const url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_CRP2}/${db}?tanggalAwalSP=${tanggalAwal}&tanggalAkhirSP=${tanggalAkhir}`;
        console.log(`Get Not Refill List from: ${url}`)

        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    this.setState({
                        isLoading: false
                    });
                    return;
                }
            })
            .then(data => {
                var list;
                try {
                    list = data.length > 0 ? data : [];
                } catch (error) {
                    list = [];
                }

                this.setState({
                    notRefillList: list,

                    isLoading: false,
                    isGettingNotRefillList: false
                })
            })
            .catch(error => {
                setTimeout(() => this.getNotRefillList(cluster, tanggalAwal, tanggalAkhir), RETRY_TIMEOUT);
            });
    }

    getDatabaseApi(cluster) {
        var database = 'main';

        if(MAIN_DB_CLUSTER_LIST.includes(cluster)) {
            database = 'main';
        }
        else if(SECOND_DB_CLUSTER_LIST.includes(cluster)) {
            database = 'second';
        }
        else if(THIRD_DB_CLUSTER_LIST.includes(cluster)) {
            database = 'third';
        }

        return `${database}/get${cluster}`;
    }

    getNextClusterNotRefillList() {
        this.setState({
            notRefillList: []
        });

        this.getNextCluster();

        const cluster = this.state.dropdownClusterValue;
        var message = `Getting list for cluster ${cluster}`;
        this.showNotification(message);
        const tanggalAwal = this.state.dateTanggalAwalValue.replace(/-/g, '');
        const tanggalAkhir = this.state.dateTanggalAkhirValue.replace(/-/g, '');
        this.getNotRefillList(cluster, tanggalAwal, tanggalAkhir);
    }

    getNextCluster() {
        const currentIndex = CLUSTER_LIST.indexOf(this.state.dropdownClusterValue);
        const lastIndex = CLUSTER_LIST.length - 1;
        var nextIndex;

        if(currentIndex != lastIndex) {
            nextIndex = currentIndex + 1;
        }
        else {
            nextIndex = 0;
        }

        this.setState({
            dropdownClusterValue: CLUSTER_LIST[nextIndex]
        });
    }

    //render biasa nya di-isi untuk desain HTML
    render() {
        return (
            <Page
                title=""
                breadcrumbs={[{ name: 'LIST TIDAK REFILL', active: true }]}
                className="CRP2Page"
            >
                <Card className="mb-3">
                    <NotificationSystem
                        dismissible={false}
                        ref={notificationSystem =>
                            (this.notificationSystem = notificationSystem)
                        }
                        style={NOTIFICATION_SYSTEM_STYLE}/>
                    <CardHeader className="d-flex justify-content-between align-items-center font-weight-bold">
                        <Label size='lg'>List Tidak Refill</Label>
                        <Label size='lg'>Current Time: {this.state.clock.toLocaleTimeString()}</Label>
                    </CardHeader>
                    <CardBody>
                        <Card outline color="primary">
                            <Form className='mt-4'>
                                <FormGroup row className='d-flex justify-content-center align-items-center'>
                                    <Label md={1}>Cluster</Label>
                                    <Col className="" xs={2} md={2}>
                                        <Input
                                            type="select"
                                            disabled={this.state.isLoading /*|| true*/}
                                            name='dropdownCluster'
                                            value={this.state.dropdownClusterValue}
                                            onChange={(event) => this.handleOnChange(event)}>
                                            {CLUSTER_LIST.map((cluster) =>
                                                <option value={cluster}>{cluster}</option>
                                            )}
                                        </Input>
                                    </Col>
                                    <Col md={3}>
                                        <Label>will change to another cluster in</Label>
                                        <Label><span className='font-weight-bold'>{this.state.nextClusterTimer}</span> seconds</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row className='d-flex justify-content-center align-items-center'>
                                    <Col md={2}>
                                        <Label>Tanggal Refill</Label>
                                    </Col>
                                    <Col md={5}>
                                        <InputGroup>
                                            <Input
                                                type='date'
                                                required={true}
                                                disabled={this.state.isLoading /*|| true*/}
                                                name='dateTanggalAwal'
                                                value={this.state.dateTanggalAwalValue}
                                                onChange={(event) => this.handleOnChange(event)} />
                                            <Input
                                                type='date'
                                                required={true}
                                                disabled={this.state.isLoading /*|| true*/}
                                                name='dateTanggalAkhir'
                                                value={this.state.dateTanggalAkhirValue}
                                                onChange={(event) => this.handleOnChange(event)} />
                                            <InputGroupAddon addonType='append' /*className='d-none'*/>
                                                <Button
                                                    disabled={this.state.isLoading /*|| true*/}
                                                    value={this.state.searchInputtedName}
                                                    onClick={evt => this.searchRefillDate(evt)}>
                                                    Search
                                                </Button>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </Card>
                        <Table
                            className="table table-bordered mt-3">
                            <thead>
                                <tr>
                                    <th>Outcode</th>
                                    <th>No SP</th>
                                    <th>Product Code</th>
                                    <th>Product Name</th>
                                    <th>LINE</th>
                                    <th>CLUSTER</th>
                                    <th>FRAME</th>
                                    <th>Motor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.notRefillList.map((product) =>
                                    <tr>
                                        <td>{product['OutCode']}</td>
                                        <td>{product['NoSP']}</td>
                                        <td>{product['Pro_Code']}</td>
                                        <td>{product['Pro_Name']}</td>
                                        <td>{product['LINE']}</td>
                                        <td>{product['CLUSTER']}</td>
                                        <td>{product['FRAME']}</td>
                                        <td>{product['LogMotor']}</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        {
                            (this.state.isLoading) &&
                            <Row className='d-flex justify-content-center'>
                                <Spinner
                                    style={{ width: '3rem', height: '3rem' }}
                                    color='primary' />
                            </Row>
                        }
                        {
                            !(this.state.isLoading || this.state.notRefillList.length > 0) &&
                            <Row className='d-flex justify-content-center'>
                                <Label>Tidak ada data</Label>
                            </Row>
                        }
                    </CardBody>
                </Card>
            </Page>
        );
    }
}
export default CRP2Page;