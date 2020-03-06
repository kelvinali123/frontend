import Page from 'components/Page';
import React from 'react';
import Typography from 'components/Typography';
import { MdSearch, MdLoyalty, MdDelete,MdDateRange } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Modal,
  ListGroup,
  ListGroupItem,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Label,
  InputGroup,
  InputGroupAddon,
  Form,
  Alert,
  ButtonGroup,
  InputGroupText,
  FormGroup,


} from 'reactstrap';
import { cpus } from 'os';

const hostUrl = 'http://10.0.111.143:8083';

var tempListOutlet = [];

class DiscountPurchasing extends React.Component {
  //special method
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      suppliers: [],
      searchOutletList: [],
      Kotas:[],
      listOutlet:[],
      isLoading: false,
      flagisi: true,
      flagaddbtn: true,
      flagsavebtn: true,
      flagcancelbtn: true,

      inputtedName: '',
      supplierName: '',
      supplierAddress1: '',
      supp_id: '',
      labelPercent: 'd-none',
      inputValue: true,
      out_allowcredityndisabled: true,
      disabledInputNilai:true,
      centuryInputdisabled:true,
      supplierInputdisabled:true,
      rowStatusMove:'d-none',
      rowBrand:'d-none',
      rowProcode:'d-none',
      rowKotaOutlet:'d-none',
      rowBrandOutlet:'d-none',
      rowKotaBesar:'d-none',
      rowTanggunganPerusahaan:'d-none',
      rowKerjasamaSupplier:'d-none'

    };
  }

  // -----------------------------------------------  SHOW ALL DATA ---------------------------------------------------------

  enableField = () => {
    if (this.state.flagisi === true) {
      var url = hostUrl + `/TampilSupplierFinance`;
      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(data => {
          let suppApi = data.map(suppdata => {
            return {
              value: suppdata.sup_id,
              display: '[' + suppdata.sup_id + '] ' + suppdata.sup_nama,
            };
          });
          this.setState({
            suppliers: [{ value: '', display: '- Pilih Supplier -' }].concat(
              suppApi,
            ),
          });
        });
    }

    var currFlagisi = this.state.flagisi;
    this.setState({
      flagisi: !currFlagisi,
    });

    var currFlagSave = this.state.flagsavebtn;
    this.setState({
      flagsavebtn: !currFlagSave,
    });

    var currFlagCancel = this.state.flagcancelbtn;
    this.setState({
      flagcancelbtn: !currFlagCancel,
    });

    var currFlagAdd = this.state.flagaddbtn;
    this.setState({
      flagaddbtn: !currFlagAdd,
    });
  };

  handleSik2StartDateInputChange = event => {
   
    const value = event.target.value;
    const startDate = new Date(value);
    const endDate = new Date(this.state.dateclose);


    try {
      if (startDate >= endDate) {
        this.setState({
        
          dateopen: startDate.toISOString().substr(0, 10),
          hostout_tglefektifmesinInvalid: true,
          hostout_tglefektifmesinValid: false,
      
        });
      } else {
        this.setState({
        
          disabledtanggalTutup: false,
          dateopen: startDate.toISOString().substr(0, 10),
          hostout_tglefektifmesinInvalid: false,
          hostout_tglefektifmesinValid: true,
      
        });
      }
    } catch (error) {
      this.setState({
      
        hostout_tglefektifmesinInvalid: true,
        hostout_tglefektifmesinValid: false,
  
      });
    }
  };


  clickDiskon(){
      this.setState({
        modal_discount:true
      })
  }

  openModalSearchProcode(){

    this.setState({
      modal_procodeSearch:true
    })
  }

  openModalSearchOutlet(){
    this.setState({
      modal_searchOutlet:true
    })
  }
  
  handleSik2EndDateInputChange = event => {
    const value = event.target.value;
    const startDate = new Date(this.state.dateopen);
    const endDate = new Date(value);



    console.log('SIA: StartDate: ' + startDate);
    console.log('SIA: EndDate: ' + endDate);

 
    try {
      if (startDate >= endDate) {
        this.setState({
          dateclose: endDate.toISOString().substr(0, 10),
          hostout_penarikanmesinInvalid: true,
          hostout_penarikanmesinValid: false,
          disabledButtonNext: true,
        });
      } else {
        this.setState({
          dateclose: endDate.toISOString().substr(0, 10),
          hostout_penarikanmesinInvalid: false,
          hostout_penarikanmesinValid: true,
          disabledButtonNext: false,
          buttonSimpanEdit: false,
        });
      }
    } catch (error) {
      this.setState({
        dateclose: endDate,
        hostout_penarikanmesinInvalid: true,
        hostout_penarikanmesinValid: false,
        disabledButtonNext: true,
      });
    }
  };

  
  checkStatusMove(e) {
 
    if (e.target.checked === true) {
      this.setState({
        rowStatusMove: 'inline',
  
      });
    } else {
      this.setState({
        rowStatusMove: "d-none",
      });
    }
  }
  
  
  checkBrandProcode(e) {

    if (e.target.checked === true) {
      this.setState({
        rowProcode: 'd-none',
        rowBrand: 'inline',
        brandChecked:true,
        procodeChecked:false,
      });
    } else {
      this.setState({
        brandChecked:false,
        rowBrand: "d-none",
      });
    }
  }

  
  checkProcode(e) {
    console.log("MASUKKK WOII")
    if (e.target.checked === true) {
      this.setState({
        rowProcode: 'inline',
        rowBrand:'d-none',
        procodeChecked:true,
        brandChecked:false
      });
    } else {
      this.setState({
        rowProcode: "d-none",
        procodeChecked:false,
      });
    }
  }
  
  checkBrandOutlet(e) {
 
    if (e.target.checked === true) {
      console.log("MASUK GANN")
      this.setState({
        rowBrandOutlet: 'inline',
        rowKotaOutlet: "d-none",
        brandChecked: true,
        kotaChecked:false
      });
    } else {
      this.setState({
        rowBrandOutlet: "d-none",
        brandChecked: false
      });
    }
  }

  checkKota(e) {

    if (e.target.checked === true) {
      this.setState({
        rowKotaOutlet: 'inline',
        rowBrandOutlet: "d-none",
        kotaChecked:true,
        brandChecked:false
      });
    } else {
      this.setState({
        kotaChecked:false,
        rowKotaOutlet: "d-none"
      });
    }
  }

  checkOutletkotaBesar(e) {
    console.log("MASUKKK WOII")
    if (e.target.checked === true) {
      this.setState({
        rowKotaBesar: 'inline'
      });
    } else {
      this.setState({
        rowKotaBesar: "d-none",
      });
    }
  }


  
    
  checkTanggunganPerusahaan(e) {
 
    if (e.target.checked === true) {
      this.setState({
        rowTanggunganPerusahaan: 'inline',
  
      });
    } else {
      this.setState({
        rowTanggunganPerusahaan: "d-none",
      });
    }
  }
  checkKerjasamaSupplier(e) {
 
    if (e.target.checked === true) {
      this.setState({
        rowKerjasamaSupplier: 'inline',
  
      });
    } else {
      this.setState({
        rowKerjasamaSupplier: "d-none",
      });
    }
  }
  

  enableFieldCondition = () => {
    var url = hostUrl + `/TampilSupplierFinance`;
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        let suppApi = data.map(suppdata => {
          return {
            value: suppdata.sup_id,
            display: '[' + suppdata.sup_id + '] ' + suppdata.sup_nama,
          };
        });
        this.setState({
          suppliers: [{ value: '', display: '- Pilih Supplier -' }].concat(
            suppApi,
          ),
        });
      });

    var currFlagisi = this.state.flagisi;
    this.setState({
      flagisi: !currFlagisi,
      modal_supplierNotFound: false,
      flagsavebtn: false,
      flagcancelbtn: false,
    });
  };

  updateInputValueSearchOutlet = evt => {
    console.log(evt.target);
    this.setState({
      outletSearch: evt.target.value.replace(/[^\w\s]/gi, '').toUpperCase(),
    });
  };

  updateInputValueSupplier = evt => {
    this.setState(
      {
        supp_id: evt.target.value,
      },
      this.getSupplierData(evt.target.value),
    );
  };

  getSupplierData = param => {
    var url = hostUrl + `/TampilDataSupplierFinance/${param}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({
          supplierName: data.sup_nama,
          supplierAddress1: data.sup_alamat1,
          supplierAddress2: data.sup_alamat2,
        });
      });
  };

  cancelButton() {
    this.searchInputValue(this.state.inputtedName);
    this.enableField();
    this.setState({
      modal_nested: false,
      supp_id: '',
      supplierName: '',
      supplierAddress1: '',
      supplierAddress2: '',
    });
  }

  cancelCariOutlet() {
    this.setState({
      outletSearch: '',
      searchOutletList: [],
      modal_outletSearch: false,
    });
  }

  refreshPage() {
    window.location.reload();
  }

  valueClicked() {
    this.setState({

    
      colorValue: 'danger',
      colorPercent: 'primary',
      labelPercent: 'd-none',
      inputValue: false,
      disabledInputNilai:false,
   

    });
  }

  handleOutletCheckboxClick(event, outlist) {
    const value = event.target.checked;
    console.log(value)
    if(value === true) {
      tempListOutlet.push(outlist);
    } else {
      tempListOutlet.splice(tempListOutlet.indexOf(outlist), 1);
    }
    this.setState({
      checkedOutlet: value
    })
  }

  handleOutletOkButtonClick = () => {

    var currListOutlet = this.state.listOutlet;
    this.setState({
      listOutlet: currListOutlet.concat(tempListOutlet),
      modal_searchOutlet: false
    }, () => {tempListOutlet = []; console.log(this.state.listOutlet)})
  }

  percentClicked() {
    this.setState({
      diskonType:'standard',
      colorPercent: 'danger',
      colorValue: 'primary',
      labelPercent: 'inline',
      inputValue: false,
      disabledInputNilai:false,
      
    });
  }


  valueClickedCentury() {
    this.setState({
      colorValueCentury: 'danger',
      colorPercentCentury: 'primary',
      labelPercentCentury: 'd-none',
      outlineButtonPercentCentury:true,
      outlineButtonValueCentury:false,
      centuryynChecked:true,
      centuryInputdisabled:false
    });
  }

  percentClickedCentury() {
    this.setState({
      colorPercentCentury: 'danger',
      colorValueCentury: 'primary',
      labelPercentCentury: 'inline',
      outlineButtonPercentCentury:false,
      outlineButtonValueCentury:true,
      centuryynChecked:true,
      centuryInputdisabled:false,


    });
  }
  
  valueClickedSupplier() {
    this.setState({
      colorValueSupplier: 'danger',
      colorPercentSupplier: 'primary',
      labelPercentSupplier: 'd-none',
      outlineButtonPercentSupplier:true,
      outlineButtonValueSupplier:false,
      supplierynChecked:true,
      supplierInputdisabled:false
    });
  }

  percentClickedSupplier() {
    this.setState({
      colorPercentSupplier: 'danger',
      colorValueSupplier: 'primary',
      labelPercentSupplier: 'inline',
      outlineButtonPercentSupplier:false,
      outlineButtonValueSupplier:true,
      supplierynChecked:true,
      supplierInputdisabled:false
    });
  }

  // valueClickedPrincipal() {
  //   this.setState({
  //     colorValuePrincipal: 'danger',
  //     colorPercentPrincipal: 'primary',
  //     labelPercentPrincipal: 'd-none',
  //     outlineButtonPercentPrincipal:true,
  //     outlineButtonValuePrincipal:false,
  //     principalynChecked:true
  //   });
  // }

  // percentClickedPrincipal() {
  //   this.setState({
  //     colorPercentPrincipal:'danger',
  //     colorValuePrincipal:'primary',
  //     labelPercentPrincipal:'inline',
  //     outlineButtonPercentPrincipal:false,
  //     outlineButtonValuePrincipal:true,
  //     principalynChecked:true
  //   });
  // }

  clickSearchSupplier(){

    this.setState({
      modal_searchSupplier:true
    })
  }


  // -----------------------------------------------  INSERT ---------------------------------------------------------

  addSupplierOutlet = (out_code, param) => async () => {
    var url = hostUrl + `/TambahSupplierOutlet/${out_code}`;

    var payload = {
      supout_supplierid: param,
      supout_userid: '0',
    };

    console.log(JSON.stringify(payload));
    let data = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      json: true,
      body: JSON.stringify(payload),
    }).then(response => {
      if (response.ok) {
        this.state.jumlahJenisCamera = '';
        this.isLoading = false;
        this.componentDidMount();
        return response.json();
      }
    });

    if (data) {
      this.setState({
        modal_nested: false,
        supp_id: '',
        supplierName: '',
        supplierAddress1: '',
        supplierAddress2: '',
      });
      this.isLoading = true;
      this.showNotification('Data Berhasil Disimpan');
      this.searchInputValue(this.state.inputtedName);
      this.enableField();
    } else {
      alert('Data Sudah Pernah Ada');
    }
  };

  //fungsi notification
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

  //fungsi untuk mengambil semua data dimana memanggil current page dan perpage
  componentDidMount() {
this.getTableForInputSelect();


  }

  //state awal pada saat membuka suatu page tsb nanti dicari langsung di render()
  state = {
    modal: false,
    modal_backdrop: false,
    modal_nested_parent: false,
    modal_nested: false,
    modal_delete: false,
    modal_update: false,
    modal_outletNotFound: false,
    modal_supplierNotFound: false,
    backdrop: true,
  };

  //fungsi untuk membuka suatu toggle di page tsb
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

  addNotNull = () => {
    if (this.state.supp_id === '') {
      alert('Harus Pilih Supplier');
    } else {
      this.setState({
        modal_nested: true,
      });
    }
  };

  // --------------------------------------------------------- SEARCH --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

  //mengambil parameter yang telah diinput di inputtedName . lalu dilempar ke Backend
  searchInputValue = outcode => {
    
  };

  getTableForInputSelect() {
    var url = `https://api.docnet.id/CHCMasterSupport/MasterKota`;
    console.log(url)
 
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('RESPONSE NOT FOUND');
        }
      })
      .then(data => {
        let resultKota = data.data.map(Kota => {
          return { value: Kota.kota_id, display: Kota.kota_name };
        });
        this.setState({
          Kotas: [{ value: '0', display: 'Pilih Kota' }].concat(resultKota),

        });
      })
      .catch(() => {
        console.log('ERROR BOSQ');
      });
  }

  getsearchOutletList = (citycode) => {
    this.setState({
      isLoading: true,
    });
    console.log(this.state.outletSearch);
    var url =  `http://10.0.111.143:8083/MasterOutlet/TampilDataOutletKota/${citycode}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState(
          {
            searchOutletList: data,
            isLoading: false,
          },
          () => console.log('searchOutletList: Data: ' + JSON.stringify(data)),
        );
      });
  };
  
 
  //function untuk melakukan search pada saat menekan enter
  enterPressed = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      this.getsearchOutletList();
    }
  };

  //ketika melakukan search, state input-an yang masuk harus uppercase dan tidak boleh special character
  setSearchInputState = evt => {
    this.setState({
      inputtedName: evt.target.value.replace(/[^\w\s]/gi, '').toUpperCase(),
    });
  };

  editTanggunganCentury = event => {
   
    
    const checked = event.target.checked;
    var yn = this.state.tanggunganCentury;

    if (checked) {
      yn = 'Y';
    } else {
      yn = 'N';
    }
   
    this.setState({
      [event.target.name]: yn,
      [event.target.name + 'Checked']: checked,
      [event.target.name + 'disabled']: !checked,
    });

    if(checked){
      this.setState({
        centuryInputdisabled:false

      })
    }else{
      this.setState({
        centuryInputdisabled:true

      })
    }
  };

  insertcitycodeValue = evt => {
    this.getsearchOutletList(evt.target.value)
    this.setState({
      citycode: evt.target.value,
    })
  };



  editTanggunganSupplier = event => {
   
    
    const checked = event.target.checked;
    var yn = this.state.tanggunganSupplier;

    if (checked) {
      yn = 'Y';
    } else {
      yn = 'N';
    }
   
    this.setState({
      [event.target.name]: yn,
      [event.target.name + 'Checked']: checked,
      [event.target.name + 'disabled']: !checked,
    });

    if(checked){
      this.setState({
        supplierInputdisabled:false

      })
    }else{
      this.setState({
        supplierInputdisabled:true

      })
    }
  };

  //--------------------------------------------------------- DELETE ---------------------------------------------------------

  // 1.Pelemparan parameter ke Backend dimana data apa saja yang akan di hapus
  deleteSupplierOutlet = () => async () => {
    var url = hostUrl + `/HapusDataSupplier/${this.state.activeID}`;

    var payload = {
      user_id: '0',
    };

    let data = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      //2.Ketika sudah terespond oleh backend , maka frontend akan melakukan hal ini
      .then(response => {
        if (response.ok) {
          this.state.modal_delete = false;
          this.state.modal_nested = false;
          this.state.backdrop = false;
          this.componentDidMount();
          return response.json();
        }
      });

    if (data) {
      this.setState({
        modal_delete: false,
      });
      this.isLoading = true;
      this.showNotification('Data Berhasil Dihapus');
      this.searchInputValue(this.state.inputtedName);
    }
  };

  // set awal pada saat membuka delete
  openModalWithItemID(idSupplier) {
    this.setState({
      modal_delete: true,
      activeID: idSupplier,
    });
  }

  //--------------------------------------------------------- DESAIN HALAMAN ---------------------------------------------------------

  //render biasa nya di-isi untuk desain HTML
  render() {
    const { result, isLoading,listOutlet } = this.state;
    var currOpen = new Date();
    var currClose = new Date();
    currOpen.setDate(currOpen.getDate());
    currClose.setDate(currClose.getDate());

    var dateOpen = currOpen.toISOString().substr(0, 10);
    var dateClose = currClose.toISOString().substr(0, 10);

    return (
      <Page
        title="Program Discount Purchasing"
        breadcrumbs={[{ name: 'Program Discount / Purchasing ', active: true }]}
        className="Program Discount"
      >
        {/* ---------------------------------------- MODAL CARI OUTLET --------------------------------------------- */}

        <Modal
          isOpen={this.state.modal_outletSearch}
          toggle={this.toggle('outletSearch')}
          className="modal-dialog-scrollable modal-dialog-centered"
          size="lg"
        >
          <ModalHeader>Search</ModalHeader>
          <ModalBody>
            <InputGroup>
              <Col className="mt-2">
                <Label>No Supplier</Label>
              </Col>

              <Input
                name="outletSearchInput"
                placeholder="Cari No Supplier"
                value={this.state.outletSearch}
                disabled={this.state.isLoading}
                onKeyPress={event => this.enterPressed(event)}
                onChange={this.updateInputValueSearchOutlet}
              />
              {!isLoading && <i className="fa fa-refresh fa-spin"></i>}

              <InputGroupAddon addonType="append">
                <Button
                  disabled={
                    this.state.buttonAddDisabled || this.state.isLoading
                  }
                  onClick={() => this.getsearchOutletList()}
                >
                  {!isLoading && <i className="fa fa-refresh fa-spin"></i>}
                  <MdSearch />
                </Button>
              </InputGroupAddon>
            </InputGroup>

            <InputGroup className="mt-3">
              <Col className="mt-2">
                <Label>Principle</Label>
              </Col>

              <Input
                name="outletSearchInput"
                placeholder="Cari Principle"
                value={this.state.outletSearch}
                disabled={this.state.isLoading}
                onKeyPress={event => this.enterPressed(event)}
                onChange={this.updateInputValueSearchOutlet}
              />
              {!isLoading && <i className="fa fa-refresh fa-spin"></i>}

              <InputGroupAddon addonType="append">
                <Button
                  disabled={
                    this.state.buttonAddDisabled || this.state.isLoading
                  }
                  onClick={() => this.getsearchOutletList()}
                >
                  {!isLoading && <i className="fa fa-refresh fa-spin"></i>}
                  <MdSearch />
                </Button>
              </InputGroupAddon>
            </InputGroup>
            <ListGroup className="mt-3">
              <ListGroupItem
                className={
                  this.state.searchOutletList.length > 0 ? '' : 'd-none'
                }
              >
                <p class="text-center font-weight-bold">Pilih Salah Satu</p>
              </ListGroupItem>
              {this.state.searchOutletList.map(outlist => (
                <ListGroupItem
                  tag="button"
                  action
                  name={outlist.out_code}
                  value={outlist.out_name}
                  onClick={() => this.searchInputValue(outlist.out_code)}
                >
                  {outlist.out_code + ' - ' + outlist.out_name}
                </ListGroupItem>
              ))}
            </ListGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              style={{
                background: 'primary',
                borderStyle: 'none',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              disabled={this.state.isLoading}
              onClick={() => this.cancelCariOutlet()}
            >
              Search
            </Button>
            <Button
              style={{
                background: '#FF0000',
                borderStyle: 'none',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.modal_outletSearch}
          toggle={this.toggle('outletSearch')}
          className="modal-dialog-scrollable modal-dialog-centered"
          size="lg"
        >
          <ModalHeader>Search</ModalHeader>
          <ModalBody>
            <InputGroup>
              <Input
                name="outletSearchInput"
                placeholder="Cari No Supplier"
                value={this.state.outletSearch}
                disabled={this.state.isLoading}
                onKeyPress={event => this.enterPressed(event)}
                onChange={this.updateInputValueSearchOutlet}
              />
              {!isLoading && <i className="fa fa-refresh fa-spin"></i>}

              <InputGroupAddon addonType="append">
                <Button
                  disabled={
                    this.state.buttonAddDisabled || this.state.isLoading
                  }
                  onClick={() => this.getsearchOutletList()}
                >
                  {!isLoading && <i className="fa fa-refresh fa-spin"></i>}
                  <MdSearch />
                </Button>
              </InputGroupAddon>
            </InputGroup>

            <InputGroup className="mt-3">
              <Col className="mt-2">
                <Label>Principle</Label>
              </Col>

              <Input
                name="outletSearchInput"
                placeholder="Cari Principle"
                value={this.state.outletSearch}
                disabled={this.state.isLoading}
                onKeyPress={event => this.enterPressed(event)}
                onChange={this.updateInputValueSearchOutlet}
              />
              {!isLoading && <i className="fa fa-refresh fa-spin"></i>}

              <InputGroupAddon addonType="append">
                <Button
                  disabled={
                    this.state.buttonAddDisabled || this.state.isLoading
                  }
                  onClick={() => this.getsearchOutletList()}
                >
                  {!isLoading && <i className="fa fa-refresh fa-spin"></i>}
                  <MdSearch />
                </Button>
              </InputGroupAddon>
            </InputGroup>
            <ListGroup className="mt-3">
              <ListGroupItem
                className={
                  this.state.searchOutletList.length > 0 ? '' : 'd-none'
                }
              >
                <p class="text-center font-weight-bold">Pilih Salah Satu</p>
              </ListGroupItem>
              {this.state.searchOutletList.map(outlist => (
                <ListGroupItem
                  tag="button"
                  action
                  name={outlist.out_code}
                  value={outlist.out_name}
                  onClick={() => this.searchInputValue(outlist.out_code)}
                >
                  {outlist.out_code + ' - ' + outlist.out_name}
                </ListGroupItem>
              ))}
            </ListGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              style={{
                background: 'primary',
                borderStyle: 'none',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              disabled={this.state.isLoading}
              onClick={() => this.cancelCariOutlet()}
            >
              Search
            </Button>
            <Button
              style={{
                background: '#FF0000',
                borderStyle: 'none',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* // -------------------------------------------------- MODAL PROCODE ------------------------------------------- // */}

        <Modal
          isOpen={this.state.modal_procodeSearch}
          toggle={this.toggle('procodeSearch')}
          className="modal-dialog-scrollable modal-dialog-centered"
          size="lg"
        >
          <ModalHeader>Pilih Procode</ModalHeader>
          <ModalBody>
            <Card outline color="primary">
              <Row>
                <Col xs={3} md={3} className="ml-5 mt-3 ">
                  <InputGroup>
                    <Input
                      value={this.state.brand}
                      checked={this.state.brandChecked}
                      onChange={evt => this.checkBrandProcode(evt)}
                      className="mt-1"
                      type="checkbox"
                    ></Input>
                    <Label>Brand</Label>
                  </InputGroup>
                </Col>

                <Col xs={3} md={3} className="ml-5 mt-3">
                  <Form>
                    <Input
                      id="procodeChecked"
                      value={this.state.procode}
                      checked={this.state.procodeChecked}
                      onChange={evt => this.checkProcode(evt)}
                      className="mt-1"
                      type="checkbox"
                    ></Input>
                    <Label>Procode</Label>
                  </Form>
                </Col>

                <Col xs={3} md={3} className="ml-5 mt-3">
                  <InputGroup>
                    <Input
                      value={this.state.statusMove}
                      checked={this.state.statusMoveChecked}
                      onChange={evt => this.checkStatusMove(evt)}
                      className="mt-1"
                      type="checkbox"
                    ></Input>
                    <Label>Status Move</Label>
                  </InputGroup>
                </Col>
              </Row>
            </Card>

            <Row className={this.state.rowBrand + ' mt-3'}>
              <Col>
                <Label>Brand</Label>
              </Col>
              <Col>
                <Input type="select">
                  <option>-- Pilih Brand --</option>
                  <option>CENTURY HEALTHCARE</option>
                  <option>CENTURY PHARMA</option>
                  <option>APOTEK GENERIK</option>
                  <option>TOKO OBAT</option>
                </Input>
              </Col>
            </Row>
            <Row className={this.state.rowProcode + ' mt-3'}>
              <Col>
                <Label>Procode</Label>
              </Col>
              <Col>
                <Input type="number" placeholder="Cari Product"></Input>
              </Col>
            </Row>
            <Row
              className={
                this.state.rowStatusMove +
                ' justify-content-center font-weight-bold mt-3'
              }
            >
              <Label>Status Move</Label>
            </Row>
            <Row className={this.state.rowStatusMove + ' mt-3'}>
              <Col xs={3} md={3}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        value={this.state.resultEyeout_schedulerosenin}
                        checked={this.state.resultEyeout_jaminynSenin}
                        id="jaminYNChecbox"
                        addon
                        type="checkbox"
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input disabled placeholder="Super Fast"></Input>
                </InputGroup>
              </Col>

              <Col xs={3} md={3}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        value={this.state.resultEyeout_schedulerosenin}
                        checked={this.state.resultEyeout_jaminynSenin}
                        id="jaminYNChecbox"
                        addon
                        type="checkbox"
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input disabled placeholder="Fast"></Input>
                </InputGroup>
              </Col>

              <Col xs={3} md={3}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        value={this.state.resultEyeout_schedulerosenin}
                        checked={this.state.resultEyeout_jaminynSenin}
                        id="jaminYNChecbox"
                        addon
                        type="checkbox"
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input disabled placeholder="Moderate"></Input>
                </InputGroup>
              </Col>

              <Col xs={3} md={3}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        value={this.state.resultEyeout_schedulerosenin}
                        checked={this.state.resultEyeout_jaminynSenin}
                        id="jaminYNChecbox"
                        addon
                        type="checkbox"
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input disabled placeholder="Slow"></Input>
                </InputGroup>
              </Col>
              <Col xs={3} md={3}></Col>
              <Col xs={3} md={3}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        value={this.state.resultEyeout_schedulerosenin}
                        checked={this.state.resultEyeout_jaminynSenin}
                        id="jaminYNChecbox"
                        addon
                        type="checkbox"
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input disabled placeholder="Super Slow"></Input>
                </InputGroup>
              </Col>

              <Col xs={3} md={3}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        value={this.state.resultEyeout_schedulerosenin}
                        checked={this.state.resultEyeout_jaminynSenin}
                        id="jaminYNChecbox"
                        addon
                        type="checkbox"
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input disabled placeholder="Tidak Laku"></Input>
                </InputGroup>
              </Col>
            </Row>

            <Card></Card>
          </ModalBody>
          <ModalFooter>
            <Button>OK</Button>
            <Button
            onClick = {this.toggle('procodeSearch')}
            style={{
              background: '#FF0000',
              borderStyle: 'none',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            >Cancel</Button>
          </ModalFooter>
        </Modal>

        {/* // -------------------------------------------------- MODAL OUTLET ------------------------------------------- // */}

        <Modal
          isOpen={this.state.modal_searchOutlet}
          toggle={this.toggle('searchOutlet')}
          className="modal-dialog-scrollable "
          size="lg"
        >
          <ModalHeader>Pilih Outlet</ModalHeader>
          <ModalBody>
            <Card outline color="primary">
              <Row>
                <Col xs={3} md={3} className="ml-5 mt-3">
                  <InputGroup>
                    <Input
                      value={this.state.kotaOutlet}
                      checked={this.state.kotaChecked}
                      onChange={evt => this.checkKota(evt)}
                      className="mt-1"
                      type="checkbox"
                    ></Input>
                    <Label>Kota</Label>
                  </InputGroup>
                </Col>
                <Col xs={3} md={3} className="ml-5 mt-3">
                  <Form>
                    <Input
                      value={this.state.brandOutlet}
                      checked={this.state.brandChecked}
                      onChange={evt => this.checkBrandOutlet(evt)}
                      className="mt-1"
                      type="checkbox"
                    ></Input>
                    <Label>Brand</Label>
                  </Form>
                </Col>

                <Col xs={3} md={3} className="ml-5 mt-3">
                  <Form>
                    <Input
                      value={this.state.outletkotaBesar}
                      checked={this.state.outletkotaBesarChecked}
                      onChange={evt => this.checkOutletkotaBesar(evt)}
                      className="mt-1"
                      type="checkbox"
                    ></Input>
                    <Label>5 Kota Besar</Label>
                  </Form>
                </Col>
              </Row>
            </Card>

            <Row className={'mt-3 ' + this.state.rowKotaOutlet}>
              <Col>
                <Label>Kota</Label>
              </Col>
              <Col>
                <Input 
                onChange={evt => this.insertcitycodeValue(evt)}
                type="select"
                value={this.state.citycode}
                >
                {this.state.Kotas.map(kota => (
                  <option key={kota.value} value={kota.value}>
                    {kota.display}
                  </option>
                ))}
                </Input>
              </Col>
            </Row>
            <Row className={'mt-3 ' + this.state.rowBrandOutlet}>
              <Col>
                <Label>Brand</Label>
              </Col>
              <Col>
                <Input type="select">
                  <option>-- Pilih Brand --</option>
                  <option>CENTURY HEALTHCARE</option>
                  <option>CENTURY PHARMA</option>
                  <option>APOTEK GENERIK</option>
                  <option>TOKO OBAT</option>
                </Input>
              </Col>
            </Row>

            <Row
              className={
                'mt-3 justify-content-center font-weight-bold ' +
                this.state.rowKotaBesar
              }
            >
              <Label>5 Kota besar</Label>
            </Row>
            <Row
              className={' justify-content-center ' + this.state.rowKotaBesar}
            >
              <Col xs={3} md={3}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        value={this.state.resultEyeout_schedulerosenin}
                        checked={this.state.resultEyeout_jaminynSenin}
                        id="jaminYNChecbox"
                        addon
                        type="checkbox"
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input disabled placeholder="Jakarta"></Input>
                </InputGroup>
              </Col>

              <Col xs={3} md={3}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        value={this.state.resultEyeout_schedulerosenin}
                        checked={this.state.resultEyeout_jaminynSenin}
                        id="jaminYNChecbox"
                        addon
                        type="checkbox"
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input disabled placeholder="Palembang"></Input>
                </InputGroup>
              </Col>

              <Col xs={3} md={3}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        value={this.state.resultEyeout_schedulerosenin}
                        checked={this.state.resultEyeout_jaminynSenin}
                        id="jaminYNChecbox"
                        addon
                        type="checkbox"
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input disabled placeholder="Bandung"></Input>
                </InputGroup>
              </Col>

              <Col xs={3} md={3}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        value={this.state.resultEyeout_schedulerosenin}
                        checked={this.state.resultEyeout_jaminynSenin}
                        id="jaminYNChecbox"
                        addon
                        type="checkbox"
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input disabled placeholder="Tangerang"></Input>
                </InputGroup>
              </Col>

              <Col xs={3} md={3}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        value={this.state.resultEyeout_schedulerosenin}
                        checked={this.state.resultEyeout_jaminynSenin}
                        id="jaminYNChecbox"
                        addon
                        type="checkbox"
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input disabled placeholder="Depok"></Input>
                </InputGroup>
              </Col>
            </Row>


            <ListGroup className="mt-3">
            <ListGroupItem
              className={
                this.state.searchOutletList.length > 0 ? '' : 'd-none'
              }
            >
              <p class="text-center font-weight-bold">
                Pilih 
              </p>
              <Button 
              
              size = "sm">
              Select All

              </Button>
            </ListGroupItem>
            {this.state.searchOutletList.map((outlist) => (
              <ListGroupItem
                disabled={this.state.disableClickSearchOutlet}
                name={outlist.out_code}
                value={outlist.out_name}
              >
        <Col xs = {5} md={5} >
              <Input
              type = "checkbox"
              value = {this.state.checkedOutlet}
              onClick={event => this.handleOutletCheckboxClick(event,outlist)}
              >
              </Input>
        </Col>
        <Col xs = {5} md={5}  className ="justify-content-center ml-3">
  
              {outlist.out_code + ' - ' + outlist.out_name}
      
        </Col>
              
           
     
               
              </ListGroupItem>
            ))}
          </ListGroup> 




          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => this.handleOutletOkButtonClick()}
            >OK</Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.modal_discount}
          toggle={this.toggle('discountStandard')}
          className="modal-dialog-scrollable modal-dialog-centered"
          size="lg"
        >
          <ModalBody>
            <Card outline color="primary">
              <Row>
                <Col className="d-flex justify-content-center mt-1 font-weight-bold">
                  <Label>Diskon</Label>
                </Col>
              </Row>

              <Row className="d-flex justify-content-center mt-3">
                <Col xs={5} md={5} className="d-flex flex-column">
                  <ButtonGroup size="sm">
                    <Button
                      outline={this.state.outlineButtonPercentCentury}
                      xs={5}
                      md={5}
                      id="colorPercent"
                      color={this.state.colorPercentCentury}
                      onClick={() => this.percentClickedCentury()}
                    >
                      %
                    </Button>
                    <Button
                      outline={this.state.outlineButtonValueCentury}
                      xs={5}
                      md={5}
                      id="colorValue"
                      disabled={this.state.disabledColorValue}
                      color={this.state.colorValueCentury}
                      onClick={() => this.valueClickedCentury()}
                    >
                      Value
                    </Button>
                  </ButtonGroup>
                </Col>

                <Col xs={5} md={5} className="d-flex flex-column">
                  <ButtonGroup size="sm">
                    <Button
                      outline={this.state.outlineButtonPercentSupplier}
                      xs={5}
                      md={5}
                      id="colorPercent"
                      color={this.state.colorPercentSupplier}
                      onClick={() => this.percentClickedSupplier()}
                    >
                      %
                    </Button>
                    <Button
                      outline={this.state.outlineButtonValueSupplier}
                      xs={5}
                      md={5}
                      id="colorValue"
                      disabled={this.state.disabledColorValue}
                      color={this.state.colorValueSupplier}
                      onClick={() => this.valueClickedSupplier()}
                    >
                      Value
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
              <Row className="d-flex justify-content-center">
                <Col xs={5} md={5}>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <Input
                          value={this.state.tanggunganCentury}
                          name="centuryyn"
                          onClick={event => this.editTanggunganCentury(event)}
                          checked={this.state.centuryynChecked}
                          id="creditYNChecbox"
                          addon
                          type="checkbox"
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      id="tanggunganInputCentury"
                      name="centuryInput"
                      disabled={this.state.centuryInputdisabled}
                      placeholder="Century"
                    ></Input>

                    <InputGroupAddon addonType="append">
                      <InputGroupText
                        disabled
                        className={this.state.labelPercentCentury}
                      >
                        %
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>

                <Col xs={5} md={5} className="mb-3">
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <Input
                          value={this.state.tanggunganSupplier}
                          name="supplieryn"
                          onClick={event => this.editTanggunganSupplier(event)}
                          checked={this.state.supplierynChecked}
                          id="creditYNChecbox"
                          addon
                          type="checkbox"
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      disabled={this.state.supplierInputdisabled}
                      placeholder="Supplier"
                    ></Input>

                    <InputGroupAddon addonType="append">
                      <InputGroupText
                        disabled
                        className={this.state.labelPercentSupplier}
                      >
                        %
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>
              </Row>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button>Save</Button>
            <Button
            onClick = {this.toggle('discount')}
            style={{
              background: '#FF0000',
              borderStyle: 'none',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
          
            Cancel
          </Button>
          </ModalFooter>
        </Modal>


        <Modal
        isOpen={this.state.modal_searchSupplier}
        toggle={this.toggle('searchSupplier')}
        className="modal-dialog-scrollable modal-dialog-centered"
        size="lg"
        >
        <ModalHeader>
        Search Supplier
        </ModalHeader>
        

        <ModalBody>
        <InputGroup>
            <Input 
            
                placeholder = 'Cari No Supplier'
        
                disabled    = {this.state.isLoading}
                // onKeyPress  = {event => this.enterPressed(event)}
                // onChange    = {this.updateInputValueSearchOutlet}
                
                />
                {!isLoading && <i className = "fa fa-refresh fa-spin"></i>}

            <InputGroupAddon addonType  = 'append'>
                <Button 
                  
                  >
                    {!isLoading && <i className = "fa fa-refresh fa-spin"></i>}
                <MdSearch/>
                </Button>
            </InputGroupAddon>

        </InputGroup>
           
    </ModalBody>
        
        </Modal>

        {/* // -------------------------------------------------- TAMPILAN DATA ------------------------------------------- // */}

        <Card className="mb-1">
          <NotificationSystem
            dismissible={false}
            ref={notificationSystem =>
              (this.notificationSystem = notificationSystem)
            }
            style={NOTIFICATION_SYSTEM_STYLE}
          />
          <CardBody id="selectedAccSupplier">
            <Form>
              <Card outline color="primary" className="mt-1">
                <Row className="d-flex justify-content-center mt-3 font-weight-bold">
                  <Col xs={5} md={3} className="d-flex justify-content-center">
                    <Label>Periode Awal</Label>
                  </Col>
                  <Col xs={5} md={3} className="d-flex justify-content-center">
                    <Label>Periode Akhir</Label>
                  </Col>
                </Row>
                <Row className="d-flex justify-content-center font-weight-bold ">
                  <MdDateRange size="25px" className="mt-1"></MdDateRange>
                  <Col xs={5} md={3}>
                    <FormGroup>
                      <Input
                        defaultValue={dateOpen}
                        type="date"
                        onChange={evt =>
                          this.handleSik2StartDateInputChange(evt)
                        }
                        id="tanggalBuka"
                        name="tanggalBuka"
                        required
                        class="datepicker-input"
                        value={this.state.dateopen}
                        disabled={this.state.disabledEfektifMesin}
                        invalid={this.state.hostout_tglefektifmesinInvalid}
                        valid={this.state.hostout_tglefektifmesinValid}
                      ></Input>
                    </FormGroup>
                  </Col>
                  <MdDateRange size="25px" className="mt-1"></MdDateRange>
                  <Col xs={5} md={3}>
                    <Input
                      defaultValue={dateClose}
                      onChange={evt => this.handleSik2EndDateInputChange(evt)}
                      type="date"
                      id="tanggalTutup"
                      name="tanggalTutup"
                      value={this.state.dateclose}
                      disabled={this.state.disabledtanggalTutup}
                      invalid={this.state.hostout_penarikanmesinInvalid}
                      valid={this.state.hostout_penarikanmesinValid}
                    ></Input>
                  </Col>
                </Row>

             
              </Card>
              <Card outline color="primary" className = "mt-3">
                <Row >
                  <Col xs={3} md={3} className="ml-5 mt-3">
                    <InputGroup>
                      <Input type="checkbox" 
                      value={this.state.kerjasamaSupplier}
                      checked={this.state.kerjasamaSupplierChecked}
                      onChange={evt => this.checkKerjasamaSupplier(evt)}
                      ></Input>
                      <Label>Kerjasama Dengan Supplier</Label>
                    </InputGroup>
                  </Col>
                  <Col  xs={1} md={2}  className={"mt-3  ml-3 justify-content-end "+ this.state.rowKerjasamaSupplier}>
                    <Input disabled placeholder="Kode"></Input>
              
                  </Col>
                  <Col  xs={3} md={3}  className={"mt-3 justify-content-center " + this.state.rowKerjasamaSupplier}>
                
                  <Input disabled placeholder="Nama"></Input>
                </Col>
                <Col  xs={1} md={2}  className={"justify-content-center "+ this.state.rowKerjasamaSupplier}>
                
                <Button 
                onClick = {()=>this.clickSearchSupplier()}
                className = "mt-3">
                <MdSearch></MdSearch>
                </Button>
                </Col>
                </Row>
              
                <Row className={"justify-content-center mt-3 "+ this.state.rowKerjasamaSupplier}>
                <Col xs={5} md={5} className="d-flex flex-column">
                  <ButtonGroup size="sm">
                    <Button
                      outline={this.state.outlineButtonPercentCentury}
                      xs={5}
                      md={5}
                      id="colorPercent"
                      color={this.state.colorPercentCentury}
                      onClick={() => this.percentClickedCentury()}
                    >
                      %
                    </Button>
                    <Button
                      outline={this.state.outlineButtonValueCentury}
                      xs={5}
                      md={5}
                      id="colorValue"
                      disabled={this.state.disabledColorValue}
                      color={this.state.colorValueCentury}
                      onClick={() => this.valueClickedCentury()}
                    >
                      Value
                    </Button>
                  </ButtonGroup>
                </Col>

              
              </Row>
              <Row className={"justify-content-center " +this.state.rowKerjasamaSupplier}>
                <Col xs={5} md={5}>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <Input
                          value={this.state.tanggunganCentury}
                          name="centuryyn"
                          onClick={event => this.editTanggunganCentury(event)}
                          checked={this.state.centuryynChecked}
                          id="creditYNChecbox"
                          addon
                          type="checkbox"
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      id="tanggunganInputCentury"
                      name="centuryInput"
                      disabled={this.state.centuryInputdisabled}
                    
                    ></Input>

                    <InputGroupAddon addonType="append">
                      <InputGroupText
                        disabled
                        className={this.state.labelPercentCentury}
                      >
                        %
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>

              
              </Row>

              <Row >
              <Col xs={5} md={3} className="ml-5 mt-3">
                <InputGroup>
                  <Input type="checkbox"
                  value={this.state.tanggunganPerusahaan}
                  checked={this.state.tanggunganPerusahaanChecked}
                  onChange={evt => this.checkTanggunganPerusahaan(evt)}
                  
                  ></Input>
                  <Label>Tanggungan Perusahaan</Label>
                </InputGroup>
              </Col>
            
          
            </Row>
            <Row className={"justify-content-center mt-3 " + this.state.rowTanggunganPerusahaan}>
                <Col xs={5} md={5} className="d-flex flex-column">
                  <ButtonGroup size="sm">
                    <Button
                      outline={this.state.outlineButtonPercentCentury}
                      xs={5}
                      md={5}
                      id="colorPercent"
                      color={this.state.colorPercentCentury}
                      onClick={() => this.percentClickedCentury()}
                    >
                      %
                    </Button>
                    <Button
                      outline={this.state.outlineButtonValueCentury}
                      xs={5}
                      md={5}
                      id="colorValue"
                      disabled={this.state.disabledColorValue}
                      color={this.state.colorValueCentury}
                      onClick={() => this.valueClickedCentury()}
                    >
                      Value
                    </Button>
                  </ButtonGroup>
                </Col>

              
              </Row>
            <Row className={" justify-content-center "+ this.state.rowTanggunganPerusahaan}>
                <Col xs={5} md={5}>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <Input
                          value={this.state.tanggunganCentury}
                          name="centuryyn"
                          onClick={event => this.editTanggunganCentury(event)}
                          checked={this.state.centuryynChecked}
                          id="creditYNChecbox"
                          addon
                          type="checkbox"
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      id="tanggunganInputCentury"
                      name="centuryInput"
                      disabled={this.state.centuryInputdisabled}
                   
                    ></Input>

                    <InputGroupAddon addonType="append">
                      <InputGroupText
                        disabled
                        className={this.state.labelPercentCentury}
                      >
                        %
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>

              
              </Row>
          <Card className = "mx-5 mt-1" outline color = "secondary">
          </Card>
          <Row  className=" justify-content-center mt-3 font-weight-bold" >
         <Label> Total Discount</Label>

        </Row>
        <Row  className="mt-3 ml-3 d-flex justify-content-center" >
          <Col md={3}>
                        <Label>
                        Kerjasama Supplier
                        </Label>
          </Col>
          <Col md={3}>
                        <Label >
                        Tanggungan Perusahaan
                        </Label>
          </Col>
        </Row>
        <Row className = " d-flex justify-content-center">
                <Col xs={5} md={3} className="d-flex flex-column">
                  <ButtonGroup size="sm">
                    <Button
                      outline={this.state.outlineButtonPercentCentury}
                      xs={5}
                      md={5}
                      id="colorPercent"
                      color={this.state.colorPercentCentury}
                      onClick={() => this.percentClickedCentury()}
                    >
                      %
                    </Button>
                    <Button
                      outline={this.state.outlineButtonValueCentury}
                      xs={5}
                      md={5}
                      id="colorValue"
                      disabled={this.state.disabledColorValue}
                      color={this.state.colorValueCentury}
                      onClick={() => this.valueClickedCentury()}
                    >
                      Value
                    </Button>
                  </ButtonGroup>
                </Col>
                <Col xs={5} md={3} className="d-flex flex-column">
                <ButtonGroup size="sm">
                  <Button
                    outline={this.state.outlineButtonPercentCentury}
                    xs={5}
                    md={5}
                    id="colorPercent"
                    color={this.state.colorPercentCentury}
                    onClick={() => this.percentClickedCentury()}
                  >
                    %
                  </Button>
                  <Button
                    outline={this.state.outlineButtonValueCentury}
                    xs={5}
                    md={5}
                    id="colorValue"
                    disabled={this.state.disabledColorValue}
                    color={this.state.colorValueCentury}
                    onClick={() => this.valueClickedCentury()}
                  >
                    Value
                  </Button>
                </ButtonGroup>
              </Col>
              
              </Row>
        <Row  className = "d-flex justify-content-center">
                <Col xs={3} md={3}>
                  <InputGroup>
                
                    <Input
                      id="tanggunganInputCentury"
                      name="centuryInput"
                      disabled={this.state.centuryInputdisabled}
                   
                    ></Input>

                    <InputGroupAddon addonType="append">
                      <InputGroupText
                        disabled
                        className={this.state.labelPercentCentury}
                      >
                        %
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>

                <Col xs={3} md={3}>
                <InputGroup>
              
                  <Input
                    id="tanggunganInputCentury"
                    name="centuryInput"
                    disabled={this.state.centuryInputdisabled}
                 
                  ></Input>

                  <InputGroupAddon addonType="append">
                    <InputGroupText
                      disabled
                      className={this.state.labelPercentCentury}
                    >
                      %
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
              
              </Row>
              
              </Card>

              <Row  className=" justify-content-center mt-3" >
              <Col xs={2} md={2}  >
                <Button onClick={() => this.openModalSearchProcode()}>
                  ADD PROCODE
                </Button>
              </Col>
              <Col  xs={2} md={2}  >
                <Button onClick={() => this.openModalSearchOutlet()}>
                  ADD OUTLET
                </Button>
              </Col>
            </Row>
              {/* // -------------------------------------------------- TAMPILAN DATA SUPPLIER ------------------------------------------- // */}

              <Table
                responsive
                id="selectedColumn"
                class="table table-striped table-bordered table-sm"
              >
                <thead>
                  <tr>
                    <th className="d-none">LIST PRODUCT</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </Table>
              {/*
              // <Row className="mt-3" xs={4} md={3}>
              //   <Col xs={4} md={3} className="d-flex flex-column">
              //     <ButtonGroup className="mt-1" size="sm">
              //       <Button
              //         xs={5}
              //         md={5}
              //         id="colorPercent"
              //         color={this.state.colorPercent}
              //         onClick={() => this.percentClicked()}
              //       >
              //         %
              //       </Button>
              //       <Button
              //         xs={5}
              //         md={5}
              //         id="colorValue"
              //         disabled={this.state.disabledColorValue}
              //         color={this.state.colorValue}
              //         onClick={() => this.valueClicked()}
              //       >
              //         Value
              //       </Button>
              //     </ButtonGroup>
              //   </Col>

              //   <Col xs={5} md={3}>
              //     <InputGroup>
              //       <Input
              //         disabled={this.state.disabledInputNilai}
              //         type="number"
              //         placeholder="Input Nilai !"
              //       ></Input>
              //       <InputGroupAddon addonType="prepend">
              //         <InputGroupText className={this.state.labelPercent}>
              //           %
              //         </InputGroupText>
              //       </InputGroupAddon>
              //     </InputGroup>
              //   </Col>
// </Row> */}

              <Table
                responsive
                id="selectedColumn"
                class="table table-striped table-bordered table-sm"
                bordered="3"
              >
                <thead>
                  <tr align="center">
                    <th class="th-sm">Kode Produk</th>
                    <th class="th-sm">Nama Produk</th>

                    <th class="th-sm"></th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td align="center">0201784</td>
                    <td align="center">POLYSILANE SUSPENSI 100 ML</td>

                    <td align="center">
                      <Button
                        style={{
                          borderStyle: 'none',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onClick={() => this.clickDiskon()}
                        size="sm"
                      >
                        <MdLoyalty></MdLoyalty>
                      </Button>
                      <Button
                        style={{
                          background: '#FF0000',
                          borderStyle: 'none',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        size="sm"
                      >
                        <MdDelete></MdDelete>
                      </Button>
                    </td>
                  </tr>

                  <tr>
                    <td align="center">0103625</td>
                    <td align="center">ALBOTHYL CONCENTRATE 10 ML</td>

                    <td align="center">
                      <Button
                        style={{
                          borderStyle: 'none',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        size="sm"
                      >
                        <MdLoyalty></MdLoyalty>
                      </Button>
                      <Button
                        style={{
                          background: '#FF0000',
                          borderStyle: 'none',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        size="sm"
                      >
                        <MdDelete></MdDelete>
                      </Button>
                    </td>
                  </tr>

                  <tr>
                    <td align="center">0302478</td>
                    <td align="center">FRUIT 18JR FRUITS EXTRACTS 30</td>

                    <td align="center">
                      <Button
                        style={{
                          borderStyle: 'none',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        size="sm"
                      >
                        <MdLoyalty></MdLoyalty>
                      </Button>
                      <Button
                        style={{
                          background: '#FF0000',
                          borderStyle: 'none',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        size="sm"
                      >
                        <MdDelete></MdDelete>
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>

              <Label className="font-weight-bold mt-3">LIST OUTLET</Label>
              <Table
                responsive
                id="selectedColumn"
                class="table table-striped table-bordered table-sm"
                bordered="3"
              >
                <thead>
                  <tr align="center">
                    <th class="th-sm">Kode Outlet</th>
                    <th class="th-sm">Nama Outlet</th>
                    <th class="th-sm"></th>
                  </tr>
                </thead>



                <tbody>
                {this.state.listOutlet.map(outlet => (

                  <tr>
                  <td align="center">{outlet.out_code}</td>
                  <td align="center">{outlet.out_name}</td>
                  </tr>

               
                ))}
                </tbody>
              </Table>

              <Card className="mt-1" outline color="primary">
                <Row className="d-flex justify-content-center mt-3 font-weight-bold">
                  <Label>Kwitansi/Faktur Pajak Atas Nama</Label>
                </Row>
                <Row className="d-flex justify-content-center mt-1">
                  <Col className="d-flex justify-content-center mt-1">
                    <ButtonGroup>
                      <Button
                        xs={5}
                        md={5}
                        id="colorPercent"
                        color={this.state.colorPercent}
                        onClick={() => this.percentClicked()}
                      >
                        No Principal
                      </Button>
                      <Button
                        xs={5}
                        md={5}
                        id="colorValue"
                        disabled={this.state.disabledColorValue}
                        color={this.state.colorValue}
                        onClick={() => this.valueClicked()}
                      >
                        Distributor
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </Card>
            </Form>
          </CardBody>
        </Card>
      </Page>
    );
  }
}
export default DiscountPurchasing;
