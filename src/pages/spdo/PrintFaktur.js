import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Label,
    Row,
    Table,
} from 'reactstrap';

class PrintFaktur extends React.Component {

    render() {
        var classes = " " + this.props.className;

        return (
            <Card className={"m-1 p-4" + classes}>
                <CardHeader>
                    <Row className='d-flex justify-content-end'>
                        <Label className='font-weight-bold'>ASLI</Label>
                    </Row>
                    <Row className='d-flex justify-content-center'>
                        <h5 className='font-weight-bold'>Faktur Penjualan</h5>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Form>
                        <Card body outline color='secondary'>
                            <div>
                                <Label xs={4} md={4}>Kode dan Nomor Seri Faktur Pajak</Label>
                                <Label xs={1} md={1} className='text-right'>:</Label>
                                <Label xs={6} md={6} className='font-weight-bold'>010.003-20.00990571</Label>
                            </div>
                        </Card>

                        <Card body outline color='secondary' className='mt-2'>
                            <CardHeader><h6 className='font-weight-bold'>PENGUSAHA KENA PAJAK</h6></CardHeader>
                            <CardBody>
                                <Row form>
                                    <Col>
                                        <Label xs={4} md={4}>Nama</Label>
                                        <Label xs={1} md={1} className='text-right'>:</Label>
                                        <Label xs={6} md={6} className='text-uppercase'>PT. CENTURY FRANCHISINDO UTAMA</Label>
                                    </Col>
                                </Row>
                                <Row form>
                                    <Col>
                                        <Label xs={4} md={4}>Alamat</Label>
                                        <Label xs={1} md={1} className='text-right'>:</Label>
                                        <Label xs={6} md={6} className='text-uppercase'>JL. LIMO NO 40, GROGOL SELATAN KEBAYORAN LAMA</Label>
                                    </Col>
                                </Row>
                                <Row form>
                                    <Col>
                                        <Label xs={4} md={4}></Label>
                                        <Label xs={1} md={1}></Label>
                                        <Label xs={6} md={6} className='text-uppercase'>JAKARTA SELATAN DKI JAKARTA RAYA</Label>
                                    </Col>
                                </Row>
                                <Row form>
                                    <Col>
                                        <Label xs={4} md={4}>N.P.W.P.</Label>
                                        <Label xs={1} md={1} className='text-right'>:</Label>
                                        <Label xs={6} md={6} className='text-uppercase'>01.640.177.0-013.000</Label>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>


                        <Card body outline color='secondary' className='mt-2'>
                            <CardHeader><h6 className='font-weight-bold'>PEMBELIAN BARANG KENA PAJAK / PENERIMA JASA PAJAK</h6></CardHeader>
                            <CardBody>
                                <Row form>
                                    <Col>
                                        <Label xs={4} md={4}>Nama</Label>
                                        <Label xs={1} md={1} className='text-right'>:</Label>
                                        <Label xs={6} md={6} className='text-uppercase'>OMEGA SUKSES ABADI, TO</Label>
                                    </Col>
                                </Row>
                                <Row form>
                                    <Col>
                                        <Label xs={4} md={4}>Alamat</Label>
                                        <Label xs={1} md={1} className='text-right'>:</Label>
                                        <Label xs={6} md={6} className='text-uppercase'>KOMP. NAGOYA CITY CENTRE BLOK C NO. 3, LUBUK BAJA</Label>
                                    </Col>
                                </Row>
                                <Row form>
                                    <Col>
                                        <Label xs={4} md={4}></Label>
                                        <Label xs={1} md={1}></Label>
                                        <Label xs={6} md={6}></Label>
                                    </Col>
                                </Row>
                                <Row form>
                                    <Col>
                                        <Label xs={4} md={4}>N.P.W.P.</Label>
                                        <Label xs={1} md={1} className='text-right'>:</Label>
                                        <Label xs={6} md={6} className='text-uppercase'>027236694215000</Label>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>

                        <Table bordered className='mt-3'>
                            <thead>
                                <tr align='center'>
                                    <th>No</th>
                                    <th>Nama Barang</th>
                                    <th>(Kd. Brg)</th>
                                    <th>Batch</th>
                                    <th>Satuan</th>
                                    <th>Qty</th>
                                    <th>Hrg / Sat</th>
                                    <th>Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='text-right'>1</td>
                                    <td>DUREX CLOSE FIT 3'S</td>
                                    <td className='text-center'>0906428</td>
                                    <td className='text-center'>1000886153</td>
                                    <td className='text-center'>BOX</td>
                                    <td className='text-right'>21</td>
                                    <td className='text-right'>11,124.000</td>
                                    <td className='text-right'>233,604</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td colSpan={2} className='text-center'>FA200000</td>
                                    <td colSpan={4}>Tgl Jatuh Tempo : <span className='ml-5'>03 May 2020</span></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td colSpan={3}></td>
                                    <td colSpan={3}>
                                        <Row>
                                            <Col>Sub Total</Col>
                                        </Row>
                                        <Row form>
                                            <Col xs={5} md={5}>Diskon</Col>
                                            <Col xs={1} md={1}>:</Col>
                                            <Col className='text-right'>- %</Col>
                                        </Row>
                                        <Row form>
                                            <Col xs={5} md={5}>Extra Diskon</Col>
                                            <Col xs={1} md={1}>:</Col>
                                            <Col className='text-right'>- %</Col>
                                        </Row>
                                    </td>
                                    <td>
                                        <Row>
                                            <Col className='text-right'>233,604</Col>
                                        </Row>
                                        <Row form>
                                            <Col className='text-right'>-</Col>
                                        </Row>
                                        <Row form>
                                            <Col className='text-right'>-</Col>
                                        </Row>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td colSpan={3}></td>
                                    <td colSpan={3}>
                                        <Row form>
                                            <Col>Dasar Pengenaan Pajak</Col>
                                        </Row>
                                        <Row form>
                                            <Col>PPN 10%</Col>
                                        </Row>
                                    </td>
                                    <td>
                                        <Row form>
                                            <Col className='text-right'>233,604</Col>
                                        </Row>
                                        <Row form>
                                            <Col className='text-right'>23,360</Col>
                                        </Row>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td colSpan={3}></td>
                                    <td colSpan={3}>TOTAL</td>
                                    <td className='text-right'>256,964</td>
                                </tr>
                            </tbody>
                        </Table>

                        <Row>
                            <Col className='text-right'>Jakarta, <span className='ml-5'>04 March 2020</span></Col>
                        </Row>

                        <Row>
                            <Col xs={2} md={2}>No. Ref / No. DO</Col>
                            <Col xs={1} md={1} className='text-right'>:</Col>
                            <Col>J0192R006466</Col>
                        </Row>

                        <Row>
                            <Col xs={2} md={2}>No. Recv Depo</Col>
                            <Col xs={1} md={1} className='text-right'>:</Col>
                            <Col>787000295993</Col>
                        </Row>


                        <Row>
                            <Col xs={2} md={2}>* Payment Type</Col>
                            <Col xs={1} md={1} className='text-right'>:</Col>
                            <Col>CIMB PHAR</Col>
                        </Row>

                        <Row form>
                            <Col className='text-right'>Nunun Novelinda Simajuntak, S Farm., A</Col>
                        </Row>
                        <Row form>
                            <Col className='text-right'>Apoteker Penanggungjawab</Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
        )
    }
}

export default PrintFaktur;