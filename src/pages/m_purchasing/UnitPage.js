import Page from 'components/Page';
import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label,ButtonGroup,InputGroup,
    InputGroupAddon,Form, input
} from 'reactstrap';
import {MdHighlightOff, MdCheckCircle, MdSearch, MdAutorenew} from 'react-icons/md';  

import {
    MdLoyalty,
  } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import * as myUrl from '../urlLink';
import * as firebase from 'firebase/app';

const perf = firebase.performance();

class UnitPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: [],
            inputtedName: '',
            currentPage: 1,
            todosPerPage: 5,
            maxPage:0,
            flag:0,
            keyword:'',
            active_user_id: "10",
            loading: false,
        };
    }

    //set Current Limit
    handleSelect(event) {
        this.setState({ [event.target.name]: event.target.value , currentPage:1},() =>{
            this.getListbyPaging(1,this.state.todosPerPage,this.state.keyword);
        });
    }

    //set Current Page
    paginationButton(event,flag,maxPage=0) {
        var currPage =Number(event.target.value);

        if((currPage+flag)>0 && (currPage+flag)<=maxPage)
        {
            this.setState({
            currentPage: (currPage+flag)
                    },() =>{
                    this.getListbyPaging(this.state.currentPage,this.state.todosPerPage,this.state.keyword);
            });
        }
    }  

    enterPressedPage= (event) =>{
        var code = event.keyCode || event.which;
        if(code === 13) 
        {
            this.getListbyPaging(this.state.currentPage,this.state.todosPerPage,this.state.keyword);
        }
    }

    enterPressedSearch= (event) =>{
        var code = event.keyCode || event.which;
        if(code === 13) {
            event.preventDefault();
            this.setState({currentPage: 1}
                ,() =>{this.getListbyPaging(this.state.currentPage,this.state.todosPerPage,this.state.keyword);});
        } 
    }

    showNotification= (currMessage,levelType)=>{
        setTimeout(() => {
            if (!this.notificationSystem) {
              return;
            }
            this.notificationSystem.addNotification({
              title: <MdLoyalty />,
              message:
                currMessage,
              level: levelType,
            });
        }, 300);
    }

    getListbyPaging(currPage,currLimit,kword)
    {
        const trace = perf.trace('getUnitList');
        trace.start();
        
        const urlA=myUrl.url_getListByPaging;
        var payload = {
            offset :(currPage-1)*currLimit,
            limit :currLimit,
            keyword: kword
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
                },
            body: JSON.stringify(payload)
        }
        console.log(option)
        fetch(urlA,option)
        .then(response => {
            trace.stop();
            if (response.ok) {
                return response.json()
            }else{
                this.showNotification("Koneksi ke server gagal!",'error');
            }
        })
        .then(data =>{
            console.log(data)
            if(data.responseMessage === "FALSE")
            {
                this.showNotification(data.responseDescription,'error');
            }else{
                this.setState({ result: data,maxPage:data.page });
            }
        });
    }

    componentDidMount() {
        this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
    }


    insertMasterUnit = param=> () => {
        const trace = perf.trace('newUnit');
        trace.start();
        
        const uname = param;
        var url = myUrl.url_insertMasterUnit;
        this.fetchData();
        var payload = {
            unit_name: uname.trim(),
            unit_userID: this.state.active_user_id
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
                },
            body: JSON.stringify(payload)
        }
        fetch(url,option)
        .then(response => {
            trace.stop();        
            if (response.ok) {
                this.componentDidMount();
                this.setState({
                    modal_nested: false,
                    modal_nested_parent: false,
                    inputtedName:'',
                    loading: false
                });
                return response.json()
            }else{
                this.showNotification("Koneksi ke server gagal!",'error');
            }  
        }).then (data => {
            if(data.responseMessage === "FALSE")
            {
                this.showNotification(data.responseDescription,'error');
            }else{
                this.showNotification(data.responseDescription,'info') ;
            }
        });
    }

    setUnitActiveYN = (first_param, second_param) => () => {
        const trace = perf.trace('updateStatusUnit');
        trace.start();
        
        var url = myUrl.url_setUnitActiveYN;
        this.fetchData();
        var payload = {
            unit_name: second_param.unit_name,
            unit_code: second_param.unit_code,
            unit_runningid:second_param.unit_runningID,
            unit_activeyn: first_param,
            unit_userID : this.state.active_user_id
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(payload)
        }
        console.log(option);
        fetch(url,option)
        .then(response => {
            trace.stop();
            if (response.ok) {
                this.componentDidMount();
                this.setState({
                    modal_active :false,
                    modal_deactive: false,
                    loading: false
                });
                return response.json()
            }
            else{
                this.showNotification("Koneksi ke server gagal!",'error');
            } 
        }).then (data => {
            if(data.responseMessage === "FALSE")
                {
                    this.showNotification(data.responseDescription,'error');
                }else{
                    this.showNotification(data.responseDescription,'info');
                }
        });
    }

    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested: false,
        backdrop: true,
    };

    //modal update
    state = {
        modal_active: false,
        modal_deactive: false,
        active_unitcode_deactive:{},
        active_unitcode_active: {},
        modal_active_toggle: "",
        modal_deactive_toggle: "",
    };

    toggleDeactiveData = (todo) =>{
        this.setState({
            modal_deactive_toggle: "deactive_toggle",
            modal_deactive: true,
            active_unitcode_deactive: todo,
        });
    }

    toggleActiveData = (todo) =>{
        this.setState({
            modal_active_toggle: "active_toggle",
            modal_active: true,
            active_unitcode_active: todo,
        });
    }

    toggle = modalType => () => {
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };

    fetchData = () => {
        this.setState({ loading: true });
    };
      
    handleClose = () => {
        this.setState({ inputtedName: '' });
    }

    render() {
        const {loading} = this.state;
        const currentTodos = this.state.result.result;
        const isEnabled = this.canBeSubmitted();
       
        const renderTodos = currentTodos && currentTodos.map((todo,i) => {
            return<tr  key={i}>
                <th scope="row">{todo.unit_code}</th>
                <td>{todo.unit_name}</td>
                {todo.unit_aktifYN === "Y" &&
                    <td>
                        <Badge color="success" className="mr-1">Aktif</Badge>
                    </td>
                }
                {todo.unit_aktifYN !== "Y" &&
                    <td>
                        <Badge color="danger" className="mr-1">Tidak Aktif</Badge>
                    </td>
                }
                {todo.unit_aktifYN === "Y" &&
                    <td>
                        <Button color="danger" size="sm" onClick = {()=> this.toggleDeactiveData(todo)}><MdHighlightOff /></Button>
                    </td>
                }
                {todo.unit_aktifYN !== "Y" &&
                    <td>
                        <Button color="success" size="sm" onClick={()=> this.toggleActiveData(todo)}><MdCheckCircle /></Button>
                    </td>
                }
            </tr>
        });
            
        return (
            <Page
                title="Unit"
                breadcrumbs={[{ name: 'unit', active: true }]}
                className="UnitPage"
            >
                <Row>
                    <Col>
                        <Card className="mb-3">
                        <NotificationSystem
                                dismissible={false}
                                ref={notificationSystem =>
                                    (this.notificationSystem = notificationSystem)
                                }
                                style={NOTIFICATION_SYSTEM_STYLE}
                                />
                            <CardHeader className="d-flex justify-content-between">
                            <Form inline className="cr-search-form" onSubmit={e => e.preventDefault()}>
                                <MdSearch
                                    size="20"
                                    className="cr-search-form__icon-search text-secondary"
                                />
                                <Input
                                    type="search"
                                    className="cr-search-form__input"
                                    placeholder="Search..."
                                    onChange={evt => this.updateSearchValue(evt)}
                                    onKeyPress={event =>this.enterPressedSearch(event,true)}
                                 />
                                </Form>
                                <Button size="sm" onClick={this.toggle('nested_parent')}>Tambah</Button>
                                <Modal
                                    onExit={this.handleClose}
                                    isOpen={this.state.modal_nested_parent}
                                    toggle={this.toggle('nested_parent')}
                                    className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent')}>
                                        Tambah Unit
                                    </ModalHeader>
                                    <ModalBody>
                                        <Label>Nama Unit</Label>
                                        <Input type="namaunit" value={this.state.inputtedName} onChange={evt => this.updateInputValue(evt)} name="namaunit" placeholder="Nama Unit (Maksimal 15 Karakter)" />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button disabled={!isEnabled} color="primary" onClick={this.toggle('nested')}>
                                            Simpan
                                        </Button>
                                        <Modal
                                            onExit={this.handleClose}
                                            isOpen={this.state.modal_nested}
                                            toggle={this.toggle('nested')}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                            <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                            <ModalFooter>
                                            <Button color="primary" onClick={this.insertMasterUnit(this.state.inputtedName)} disabled={loading}>
                                            {!loading && <span>Ya</span>}
                                                {loading && (
                                                    <MdAutorenew/>
                                                )}
                                                {loading && <span>Sedang diproses</span>}
                                            </Button>{' '}
                                            {!loading &&<Button
                                                color="secondary"
                                                onClick={this.toggle('nested')}>
                                                Tidak
                                                </Button>}
                                            </ModalFooter>
                                        </Modal>
                                        {' '}
                                        <Button color="secondary" onClick={this.toggle('nested_parent')}>
                                            Batal
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                                {/* Modal untuk Aktif no Aktif  */ }
                                <Modal
                                    //onExit={()=>this.handleClose}
                                    isOpen={this.state.modal_deactive}
                                    toggle={this.toggle('deactive')}>
                                    <ModalHeader toggle={this.toggle('deactive')}>
                                        Konfirmasi Penonaktifan
                                    </ModalHeader>
                                    <ModalBody>
                                        Apakah Anda yakin ingin menonaktifkan data ini?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.setUnitActiveYN('N', this.state.active_unitcode_deactive)} disabled={loading}>
                                            {!loading && <span>Ya</span>}
                                                {loading && (
                                                    <MdAutorenew/>
                                                )}
                                                {loading && <span>Sedang diproses</span>}
                                        </Button>{' '}
                                            {!loading && <Button color="secondary" onClick={this.toggle('deactive')}>
                                            Tidak
                                        </Button>}
                                    </ModalFooter>
                                </Modal>
                                <Modal
                                    //onExit={()=>this.handleClose}
                                    isOpen={this.state.modal_active}
                                    toggle={this.toggle('active')}>
                                    <ModalHeader toggle={this.toggle('active')}>
                                        Konfirmasi Pengaktifan
                                    </ModalHeader>
                                    <ModalBody>
                                        Apakah Anda yakin ingin mengaktifkan data ini?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.setUnitActiveYN('Y', this.state.active_unitcode_active)} disabled={loading}>
                                            {!loading && <span>Ya</span>}
                                            {loading && (
                                                <MdAutorenew/>
                                            )}
                                            {loading && <span>Sedang diproses</span>}
                                        </Button>{' '}
                                            {!loading && <Button color="secondary" onClick={this.toggle('active')}>
                                            Tidak
                                        </Button>}
                                    </ModalFooter>
                                </Modal>
                            </CardHeader>
                            <CardBody>
                                <Table responsive
                                striped>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nama Unit</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody> 
                                        {renderTodos}
                                        {/* <tr>
                                            <td></td>
                                            <td></td>
                                            <td>NO DATA</td>
                                            <td></td>
                                            <td></td>
                                        </tr> */}
                                    </tbody>
                                </Table>
                            </CardBody>
                            <CardBody>
                            <Row>
                                <Col md="9" sm="12" xs="12">
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">Tampilkan</InputGroupAddon>
                                        <select 
                                            name="todosPerPage"
                                            style={{height: '38px'}}
                                            value={this.state.value}
                                            onChange={(e) => this.handleSelect(e)}>
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                        </select>
                                        <InputGroupAddon addonType="prepend">Baris Per-Halaman</InputGroupAddon>
                                    </InputGroup>
                                </Col>
                                <Col md="3" sm="12" xs="12">
                                    <Card className="mb-3s">  
                                     <ButtonGroup >
                                       <Button
                                           name="FirstButton"
                                           value = {1}
                                           onClick={(e) => this.paginationButton(e,0,this.state.maxPage)}>
                                           &#10092;&#10092;
                                       </Button>
                                       <Button
                                           name="PrevButton"
                                           value = {this.state.currentPage}
                                           onClick={(e) => this.paginationButton(e,-1,this.state.maxPage)}>
                                           &#10092;
                                       </Button>
                                        <input
                                            type="text"
                                            placeholder="Page"
                                            value = {this.state.currentPage}
                                            onChange={(e) => this.setState({currentPage: e.target.value})}
                                            onKeyPress={(e) => this.enterPressedPage(e)}
                                            style={{height: '38px', width: '75px',textAlign: 'center'}}
                                            />
                                       <Button
                                           name="NextButton"
                                           value = {this.state.currentPage}
                                           onClick={(e) => this.paginationButton(e,1,this.state.maxPage)}>
                                           &#10093;
                                       </Button>
                                       <Button
                                           name = "LastButton"
                                           value = {this.state.maxPage}
                                           onClick={(e) => this.paginationButton(e,0,this.state.maxPage)}>
                                           &#10093;&#10093;
                                       </Button>
                                       {/* {renderPageNumbers} */}
                                   </ButtonGroup>
                                   </Card>
                                </Col>
                            </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Page>
        );
    }

    canBeSubmitted() {
        const {inputtedName} = this.state;
        return inputtedName.length > 0 && inputtedName.trim()!=="" && inputtedName.trim().length <= 15;
    }

    handleSubmit = evt => {
        if (!this.canBeSubmitted()) {
          evt.preventDefault();
          return;
        }
    };

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

    updateSearchValue(evt) {
        this.setState({
            keyword: evt.target.value
        });
    }
}
export default UnitPage;